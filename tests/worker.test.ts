import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import worker from '../worker/index';
import { SqliteD1 } from './support/sqlite';
import { digest, type Fact, type Operation } from '../shared/protocol';
let mf: Pick<Miniflare, 'dispatchFetch' | 'getD1Database' | 'dispose'>;
const ownerId = crypto.randomUUID();
const code = 'test-only-' + crypto.randomUUID();
let sequence = 0;
const origin = 'https://trainer.test';
async function request(
  path: string,
  method = 'GET',
  body?: unknown,
  cookie?: string,
  headers: Record<string, string> = {},
) {
  return mf.dispatchFetch(origin + '/api/' + path, {
    method,
    headers: {
      Origin: origin,
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
async function login(deviceId = crypto.randomUUID()) {
  const result = await request(
    'access',
    'POST',
    { code, deviceId },
    undefined,
    { 'CF-Connecting-IP': crypto.randomUUID() },
  );
  expect(result.status).toBe(200);
  return { deviceId, cookie: result.headers.get('set-cookie')!.split(';')[0] };
}
function fact(deviceId: string, base?: Fact): Fact {
  const id = crypto.randomUUID();
  return {
    id,
    deviceId,
    sequence: ++sequence,
    occurredAt: new Date().toISOString(),
    schemaVersion: 1,
    kind: base ? 'session-revision' : 'session',
    entityId: base?.entityId ?? id,
    baseRevision: base?.id ?? null,
    references: base ? [...new Set([base.entityId, base.id])] : [],
    versions: { content: 'foundation-v1', policy: 'none' },
    payload: { intention: 'Borrador', state: 'draft' },
  };
}
const operation = (facts: Fact[]): Operation => ({
  id: crypto.randomUUID(),
  facts,
});
beforeAll(async () => {
  if (process.env.CF_RUNTIME !== '1') {
    const db = new SqliteD1();
    db.sqlite.exec(await readFile('migrations/0001_foundation.sql', 'utf8'));
    const env = {
      DB: db.binding(),
      OWNER_ID: ownerId,
      ACCESS_CODE_SHA256: await digest(code),
      ASSETS: { fetch: async () => new Response('not found', { status: 404 }) },
    };
    mf = {
      dispatchFetch: (url: string, init?: RequestInit) =>
        worker.fetch(new Request(String(url), init as RequestInit), env),
      getD1Database: async () => db,
      dispose: async () => db.close(),
    } as unknown as typeof mf;
    return;
  }
  const result = await build({
    entryPoints: ['worker/index.ts'],
    bundle: true,
    format: 'esm',
    write: false,
    platform: 'browser',
    target: 'es2022',
  });
  mf = new Miniflare(
    convertV4MiniflareOptions({
      modules: true,
      script: result.outputFiles[0].text,
      compatibilityDate: '2026-10-01',
      d1Databases: ['DB'],
      bindings: { OWNER_ID: ownerId, ACCESS_CODE_SHA256: await digest(code) },
    }),
  );
  const db = await mf.getD1Database('DB');
  const sql = await readFile('migrations/0001_foundation.sql', 'utf8');
  for (const statement of sql.split(/;\s*\n/).filter((s) => s.trim()))
    await db.prepare(statement).run();
}, 30000);
afterAll(async () => {
  await mf?.dispose();
});
describe(
  process.env.CF_RUNTIME === '1'
    ? 'Worker + Cloudflare local D1'
    : 'Worker + SQLite test adapter',
  () => {
    it('requires authentication, exact Origin and JSON', async () => {
      expect((await request('sync/pull')).status).toBe(401);
      expect(
        (
          await request(
            'access',
            'POST',
            { code, deviceId: crypto.randomUUID() },
            undefined,
            { Origin: 'https://evil.test' },
          )
        ).status,
      ).toBe(403);
      expect(
        (
          await request('access', 'POST', {}, undefined, {
            'Content-Type': 'text/plain',
          })
        ).status,
      ).toBe(415);
    });
    it('uses private Secure/HttpOnly sessions and rejects a wrong code', async () => {
      const bad = await request('access', 'POST', {
        code: 'wrong',
        deviceId: crypto.randomUUID(),
      });
      expect(bad.status).toBe(401);
      const access = await request(
        'access',
        'POST',
        { code, deviceId: crypto.randomUUID() },
        undefined,
        { 'CF-Connecting-IP': crypto.randomUUID() },
      );
      expect(access.headers.get('set-cookie')).toContain(
        'HttpOnly; Secure; SameSite=Strict',
      );
      expect(access.headers.get('cache-control')).toBe('no-store');
    });
    it('ACKs an identical retry once and rejects changed operation content', async () => {
      const auth = await login();
      const op = operation([fact(auth.deviceId)]);
      expect((await request('sync/push', 'POST', op, auth.cookie)).status).toBe(
        200,
      );
      expect((await request('sync/push', 'POST', op, auth.cookie)).status).toBe(
        200,
      );
      const db = await mf.getD1Database('DB');
      expect(
        await db
          .prepare('SELECT COUNT(*) AS n FROM facts WHERE id=?')
          .bind(op.facts[0].id)
          .first('n'),
      ).toBe(1);
      op.facts[0].payload.intention = 'Alterado';
      expect((await request('sync/push', 'POST', op, auth.cookie)).status).toBe(
        409,
      );
    });
    it('rolls back the entire batch if a fact ID has different content', async () => {
      const auth = await login();
      const original = fact(auth.deviceId);
      await request('sync/push', 'POST', operation([original]), auth.cookie);
      const extra = fact(auth.deviceId);
      const conflict = {
        ...original,
        payload: { ...original.payload, intention: 'Diferente' },
      };
      const result = await request(
        'sync/push',
        'POST',
        operation([extra, conflict]),
        auth.cookie,
      );
      expect(result.status).toBe(409);
      const db = await mf.getD1Database('DB');
      expect(
        await db
          .prepare('SELECT id FROM facts WHERE id=?')
          .bind(extra.id)
          .first(),
      ).toBeNull();
    });
    it('rejects unknown schemas, dangling references, oversized requests and client owner IDs', async () => {
      const auth = await login();
      const root = fact(auth.deviceId);
      const revision = fact(auth.deviceId, root);
      expect(
        (await request('sync/push', 'POST', operation([revision]), auth.cookie))
          .status,
      ).toBe(422);
      expect(
        (
          await request(
            'sync/push',
            'POST',
            operation([{ ...root, schemaVersion: 2 } as unknown as Fact]),
            auth.cookie,
          )
        ).status,
      ).toBe(422);
      expect(
        (
          await request(
            'sync/push',
            'POST',
            { ...operation([root]), ownerId: crypto.randomUUID() },
            auth.cookie,
          )
        ).status,
      ).toBe(422);
      expect(
        (
          await request(
            'sync/push',
            'POST',
            { text: 'x'.repeat(140000) },
            auth.cookie,
          )
        ).status,
      ).toBe(413);
    });
    it('keeps two device revisions, preserves original provenance on restore, and pulls by cursor', async () => {
      const a = await login();
      const b = await login();
      const root = fact(a.deviceId);
      expect(
        (await request('sync/push', 'POST', operation([root]), a.cookie))
          .status,
      ).toBe(200);
      const left = fact(a.deviceId, root);
      const right = fact(b.deviceId, root);
      expect(
        (await request('sync/push', 'POST', operation([left]), a.cookie))
          .status,
      ).toBe(200);
      expect(
        (await request('sync/push', 'POST', operation([right]), b.cookie))
          .status,
      ).toBe(200);
      const restored = fact(crypto.randomUUID());
      expect(
        (await request('sync/push', 'POST', operation([restored]), b.cookie))
          .status,
      ).toBe(200);
      const page = (await (
        await request('sync/pull?cursor=0', 'GET', undefined, b.cookie)
      ).json()) as { ownerId: string; cursor: number; items: { fact: Fact }[] };
      expect(page.ownerId).toBe(ownerId);
      expect(page.items.map((item) => item.fact.id)).toEqual(
        expect.arrayContaining([root.id, left.id, right.id, restored.id]),
      );
      const empty = (await (
        await request(
          'sync/pull?cursor=' + page.cursor,
          'GET',
          undefined,
          b.cookie,
        )
      ).json()) as { items: unknown[] };
      expect(empty.items).toHaveLength(0);
    });
    it('supports dependent facts in an atomic group even when ordered child first', async () => {
      const auth = await login();
      const root = fact(auth.deviceId);
      const child = fact(auth.deviceId, root);
      const response = await request(
        'sync/push',
        'POST',
        operation([child, root]),
        auth.cookie,
      );
      expect(response.status).toBe(200);
    });
    it('paginates without skipping facts', async () => {
      const auth = await login();
      for (let n = 0; n < 12; n++)
        expect(
          (
            await request(
              'sync/push',
              'POST',
              operation(Array.from({ length: 10 }, () => fact(auth.deviceId))),
              auth.cookie,
            )
          ).status,
        ).toBe(200);
      let cursor = 0;
      let more = true;
      const ids: string[] = [];
      while (more) {
        const page = (await (
          await request(
            'sync/pull?cursor=' + cursor,
            'GET',
            undefined,
            auth.cookie,
          )
        ).json()) as {
          cursor: number;
          hasMore: boolean;
          items: { fact: Fact }[];
        };
        expect(page.items.length).toBeLessThanOrEqual(100);
        ids.push(...page.items.map((row) => row.fact.id));
        cursor = page.cursor;
        more = page.hasMore;
      }
      expect(ids.length).toBeGreaterThanOrEqual(120);
      expect(new Set(ids).size).toBe(ids.length);
    });
    it('revokes a device without deleting history and rejects expired sessions', async () => {
      const a = await login();
      const b = await login();
      await request('revoke', 'POST', { deviceId: b.deviceId }, a.cookie);
      expect(
        (await request('identity', 'GET', undefined, b.cookie)).status,
      ).toBe(401);
      expect(
        (await request('identity', 'GET', undefined, a.cookie)).status,
      ).toBe(200);
      const db = await mf.getD1Database('DB');
      await db
        .prepare('UPDATE access_sessions SET expires_at=0 WHERE device_id=?')
        .bind(a.deviceId)
        .run();
      expect(
        (await request('identity', 'GET', undefined, a.cookie)).status,
      ).toBe(401);
      const again = await login(a.deviceId);
      expect(
        (await request('sync/pull', 'GET', undefined, again.cookie)).status,
      ).toBe(200);
    });
    it('limits repeated access attempts', async () => {
      const ip = crypto.randomUUID();
      for (let n = 0; n < 10; n++)
        expect(
          (
            await request(
              'access',
              'POST',
              { code: 'bad', deviceId: crypto.randomUUID() },
              undefined,
              { 'CF-Connecting-IP': ip },
            )
          ).status,
        ).toBe(401);
      expect(
        (
          await request(
            'access',
            'POST',
            { code, deviceId: crypto.randomUUID() },
            undefined,
            { 'CF-Connecting-IP': ip },
          )
        ).status,
      ).toBe(429);
    });
  },
);
