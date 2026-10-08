import type {
  D1Database,
  D1PreparedStatement,
} from '@cloudflare/workers-types';
import {
  canonical,
  digest,
  uuid,
  validOperation,
  validLinks,
  type Fact,
} from '../shared/protocol';
export interface Env {
  DB: D1Database;
  ASSETS: { fetch(request: Request): Promise<Response> };
  OWNER_ID?: string;
  ACCESS_CODE_SHA256?: string;
}
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    super(code);
  }
}
const json = (
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...headers,
    },
  });
async function body(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new ApiError(415, 'json_required');
  if (Number(request.headers.get('content-length')) > 131072)
    throw new ApiError(413, 'payload_too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'invalid_json');
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 131072) {
      await reader.cancel();
      throw new ApiError(413, 'payload_too_large');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new ApiError(400, 'invalid_json');
  }
}
const cookieName = 'lt_session';
const cookie = (token: string, seconds: number) =>
  `${cookieName}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
async function tokenHash(request: Request): Promise<string> {
  const token = request.headers
    .get('Cookie')
    ?.split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(cookieName + '='))
    ?.slice(cookieName.length + 1);
  if (!token || !/^[0-9a-f-]{73}$/.test(token))
    throw new ApiError(401, 'authentication_required');
  return digest(token);
}
async function authenticate(request: Request, env: Env) {
  const hash = await tokenHash(request);
  const session = await env.DB.prepare(
    'SELECT owner_id,device_id FROM access_sessions WHERE token_hash=? AND expires_at>?',
  )
    .bind(hash, Date.now())
    .first<{ owner_id: string; device_id: string }>();
  if (!session || session.owner_id !== env.OWNER_ID)
    throw new ApiError(401, 'authentication_required');
  return { ...session, hash };
}
async function login(request: Request, env: Env) {
  if (
    !uuid(env.OWNER_ID) ||
    !env.ACCESS_CODE_SHA256 ||
    !/^[a-f0-9]{64}$/.test(env.ACCESS_CODE_SHA256)
  )
    throw new ApiError(503, 'access_not_configured');
  const now = Date.now();
  const window = Math.floor(now / 900000);
  const bucket = await digest(
    (request.headers.get('CF-Connecting-IP') ?? 'local') + ':' + window,
  );
  const limits = await env.DB.batch([
    env.DB.prepare('DELETE FROM login_limits WHERE expires_at<?').bind(now),
    env.DB.prepare(
      'INSERT INTO login_limits(bucket,attempts,expires_at) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET attempts=attempts+1 RETURNING attempts',
    ).bind(bucket, now + 900000),
  ]);
  if (
    Number(
      (limits[1].results[0] as { attempts: number } | undefined)?.attempts,
    ) > 10
  )
    throw new ApiError(429, 'too_many_attempts');
  const input = (await body(request)) as { code?: unknown; deviceId?: unknown };
  if (
    !input ||
    typeof input.code !== 'string' ||
    input.code.length > 256 ||
    !uuid(input.deviceId)
  )
    throw new ApiError(400, 'invalid_access_request');
  const actual = await digest(input.code);
  let difference = 0;
  for (let i = 0; i < 64; i++)
    difference |= actual.charCodeAt(i) ^ env.ACCESS_CODE_SHA256.charCodeAt(i);
  if (difference) throw new ApiError(401, 'invalid_access_code');
  const token = crypto.randomUUID() + '-' + crypto.randomUUID();
  const hash = await digest(token);
  const date = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      'INSERT OR IGNORE INTO owners(id,created_at) VALUES(?,?)',
    ).bind(env.OWNER_ID, date),
    env.DB.prepare(
      'INSERT OR IGNORE INTO devices(owner_id,id,created_at) VALUES(?,?,?)',
    ).bind(env.OWNER_ID, input.deviceId, date),
    env.DB.prepare(
      'DELETE FROM access_sessions WHERE expires_at<? OR (owner_id=? AND device_id=?)',
    ).bind(now, env.OWNER_ID, input.deviceId),
    env.DB.prepare(
      'INSERT INTO access_sessions(token_hash,owner_id,device_id,expires_at) VALUES(?,?,?,?)',
    ).bind(hash, env.OWNER_ID, input.deviceId, now + 30 * 86400000),
  ]);
  return json({ ownerId: env.OWNER_ID, deviceId: input.deviceId }, 200, {
    'Set-Cookie': cookie(token, 30 * 86400),
  });
}
async function push(request: Request, env: Env, ownerId: string) {
  const op = await body(request);
  if (!validOperation(op))
    throw new ApiError(422, 'unsupported_or_invalid_schema');
  const opHash = await digest(canonical(op));
  const receipt = await env.DB.prepare(
    'SELECT content_hash FROM sync_receipts WHERE owner_id=? AND id=?',
  )
    .bind(ownerId, op.id)
    .first<{ content_hash: string }>();
  if (receipt) {
    if (receipt.content_hash !== opHash)
      throw new ApiError(409, 'operation_conflict');
    return json({ ack: op.id });
  }
  // References may target existing facts or facts in this atomic operation.
  const known = new Map<string, Fact>(op.facts.map((f) => [f.id, f]));
  const externalRefs = [
    ...new Set(op.facts.flatMap((f) => f.references)),
  ].filter((id) => !known.has(id));
  if (externalRefs.length) {
    const rows = await env.DB.prepare(
      `SELECT body FROM facts WHERE owner_id=? AND id IN (${externalRefs.map(() => '?').join(',')})`,
    )
      .bind(ownerId, ...externalRefs)
      .all<{ body: string }>();
    for (const row of rows.results) {
      const fact = JSON.parse(row.body) as Fact;
      known.set(fact.id, fact);
    }
  }
  const load = async (id: string) => {
    const fact = known.get(id);
    if (!fact) throw new ApiError(422, 'missing_reference');
    return fact;
  };
  for (const fact of op.facts) {
    for (const ref of fact.references) await load(ref);
    if (!validLinks(fact, known))
      throw new ApiError(422, 'invalid_learning_reference');
    if (fact.kind === 'session-revision') {
      const root = await load(fact.entityId);
      const base = await load(fact.baseRevision!);
      if (root.kind !== 'session' || base.entityId !== fact.entityId)
        throw new ApiError(422, 'invalid_revision');
      const incoming = new Map(op.facts.map((f) => [f.id, f]));
      const visited = new Set([fact.id]);
      let current: Fact | undefined = fact;
      while (current?.baseRevision) {
        if (visited.has(current.baseRevision))
          throw new ApiError(422, 'revision_cycle');
        visited.add(current.baseRevision);
        current = incoming.get(current.baseRevision);
      }
    }
  }
  const receivedAt = new Date().toISOString();
  const statements: D1PreparedStatement[] = [];
  for (const originDevice of new Set(op.facts.map((f) => f.deviceId))) {
    statements.push(
      env.DB.prepare(
        'INSERT OR IGNORE INTO devices(owner_id,id,created_at) VALUES(?,?,?)',
      ).bind(ownerId, originDevice, receivedAt),
    );
  }
  for (const fact of op.facts) {
    const serialized = canonical(fact);
    statements.push(
      env.DB.prepare(
        `INSERT INTO facts(owner_id,id,device_id,sequence,kind,entity_id,base_revision,schema_version,occurred_at,received_at,content_hash,body)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(owner_id,id) DO UPDATE SET content_hash=excluded.content_hash`,
      ).bind(
        ownerId,
        fact.id,
        fact.deviceId,
        fact.sequence,
        fact.kind,
        fact.entityId,
        fact.baseRevision,
        1,
        fact.occurredAt,
        receivedAt,
        await digest(serialized),
        serialized,
      ),
    );
    for (const ref of fact.references)
      statements.push(
        env.DB.prepare(
          'INSERT OR IGNORE INTO fact_references(owner_id,fact_id,target_id) VALUES(?,?,?)',
        ).bind(ownerId, fact.id, ref),
      );
  }
  statements.push(
    env.DB.prepare(
      'INSERT INTO sync_receipts(owner_id,id,content_hash,received_at) VALUES(?,?,?,?) ON CONFLICT(owner_id,id) DO UPDATE SET content_hash=excluded.content_hash',
    ).bind(ownerId, op.id, opHash, receivedAt),
  );
  try {
    await env.DB.batch(statements);
  } catch (error) {
    const message = String(error);
    if (/conflict|UNIQUE constraint/.test(message))
      throw new ApiError(409, 'fact_conflict');
    if (/FOREIGN KEY/.test(message))
      throw new ApiError(422, 'missing_reference');
    throw error;
  }
  return json({ ack: op.id });
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (!['GET', 'POST'].includes(request.method))
        throw new ApiError(405, 'method_not_allowed');
      if (
        request.method === 'POST' &&
        request.headers.get('Origin') !== url.origin
      )
        throw new ApiError(403, 'origin_rejected');
      if (url.pathname === '/api/health' && request.method === 'GET')
        return json({ ok: true, schemaVersion: 1 });
      if (url.pathname === '/api/access' && request.method === 'POST')
        return await login(request, env);
      const session = await authenticate(request, env);
      if (url.pathname === '/api/identity' && request.method === 'GET')
        return json({ ownerId: session.owner_id, deviceId: session.device_id });
      if (url.pathname === '/api/logout' && request.method === 'POST') {
        await env.DB.prepare('DELETE FROM access_sessions WHERE token_hash=?')
          .bind(session.hash)
          .run();
        return json({ ok: true }, 200, { 'Set-Cookie': cookie('', 0) });
      }
      if (url.pathname === '/api/devices' && request.method === 'GET') {
        const rows = await env.DB.prepare(
          'SELECT device_id AS deviceId,MAX(expires_at) AS expiresAt FROM access_sessions WHERE owner_id=? AND expires_at>? GROUP BY device_id',
        )
          .bind(session.owner_id, Date.now())
          .all();
        return json({ devices: rows.results });
      }
      if (url.pathname === '/api/revoke' && request.method === 'POST') {
        const input = (await body(request)) as { deviceId?: unknown };
        if (!input || !uuid(input.deviceId))
          throw new ApiError(400, 'invalid_device');
        await env.DB.prepare(
          'DELETE FROM access_sessions WHERE owner_id=? AND device_id=?',
        )
          .bind(session.owner_id, input.deviceId)
          .run();
        return json({ ok: true });
      }
      if (url.pathname === '/api/sync/push' && request.method === 'POST')
        return await push(request, env, session.owner_id);
      if (url.pathname === '/api/sync/pull' && request.method === 'GET') {
        const cursor = Number(url.searchParams.get('cursor') ?? 0);
        if (!Number.isSafeInteger(cursor) || cursor < 0)
          throw new ApiError(400, 'invalid_cursor');
        const result = await env.DB.prepare(
          'SELECT cursor,received_at,body FROM facts WHERE owner_id=? AND cursor>? ORDER BY cursor LIMIT 101',
        )
          .bind(session.owner_id, cursor)
          .all<{ cursor: number; received_at: string; body: string }>();
        const page = result.results.slice(0, 100);
        return json({
          ownerId: session.owner_id,
          items: page.map((row) => ({
            cursor: row.cursor,
            receivedAt: row.received_at,
            fact: JSON.parse(row.body),
          })),
          cursor: page.at(-1)?.cursor ?? cursor,
          hasMore: result.results.length > 100,
        });
      }
      throw new ApiError(404, 'not_found');
    } catch (error) {
      if (error instanceof ApiError)
        return json({ error: error.code }, error.status);
      // Never echo payloads, access codes or database details to logs or clients.
      return json({ error: 'service_unavailable' }, 503);
    }
  },
};
