export const SCHEMA_VERSION = 1;
export type FactKind = 'session' | 'session-revision';
export interface Fact {
  id: string;
  deviceId: string;
  sequence: number;
  occurredAt: string;
  schemaVersion: 1;
  kind: FactKind;
  entityId: string;
  baseRevision: string | null;
  references: string[];
  versions: { content: string; policy: string };
  payload: { intention: string; state: 'draft' };
}
export interface Operation {
  id: string;
  facts: Fact[];
}
export interface RemoteFact {
  cursor: number;
  receivedAt: string;
  fact: Fact;
}
export const uuid = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const exact = (v: Record<string, unknown>, keys: string[]) =>
  Object.keys(v).sort().join() === keys.sort().join();
export function validFact(v: unknown): v is Fact {
  if (
    !object(v) ||
    !exact(v, [
      'id',
      'deviceId',
      'sequence',
      'occurredAt',
      'schemaVersion',
      'kind',
      'entityId',
      'baseRevision',
      'references',
      'versions',
      'payload',
    ])
  )
    return false;
  if (
    !uuid(v.id) ||
    !uuid(v.deviceId) ||
    !uuid(v.entityId) ||
    !Number.isSafeInteger(v.sequence) ||
    Number(v.sequence) < 1 ||
    v.schemaVersion !== 1
  )
    return false;
  if (
    typeof v.occurredAt !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T/.test(v.occurredAt) ||
    !Number.isFinite(Date.parse(v.occurredAt))
  )
    return false;
  if (
    !Array.isArray(v.references) ||
    v.references.length > 20 ||
    !v.references.every(uuid) ||
    new Set(v.references).size !== v.references.length ||
    v.references.includes(v.id)
  )
    return false;
  if (
    !object(v.versions) ||
    !exact(v.versions, ['content', 'policy']) ||
    v.versions.content !== 'foundation-v1' ||
    v.versions.policy !== 'none'
  )
    return false;
  if (
    !object(v.payload) ||
    !exact(v.payload, ['intention', 'state']) ||
    typeof v.payload.intention !== 'string' ||
    v.payload.intention.length > 4000 ||
    v.payload.state !== 'draft'
  )
    return false;
  if (v.kind === 'session')
    return (
      v.baseRevision === null &&
      v.entityId === v.id &&
      v.references.length === 0
    );
  return (
    v.kind === 'session-revision' &&
    uuid(v.baseRevision) &&
    v.entityId !== v.id &&
    v.references.includes(v.entityId) &&
    v.references.includes(v.baseRevision) &&
    v.references.length === new Set([v.entityId, v.baseRevision]).size
  );
}
export function validOperation(v: unknown): v is Operation {
  return (
    object(v) &&
    exact(v, ['id', 'facts']) &&
    uuid(v.id) &&
    Array.isArray(v.facts) &&
    v.facts.length > 0 &&
    v.facts.length <= 10 &&
    v.facts.every(validFact) &&
    new Set(v.facts.map((f) => f.id)).size === v.facts.length
  );
}
// Canonical serialization makes retries independent of JSON property order.
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (object(value))
    return (
      '{' +
      Object.keys(value)
        .sort()
        .map((k) => JSON.stringify(k) + ':' + canonical(value[k]))
        .join(',') +
      '}'
    );
  return JSON.stringify(value);
}
export async function digest(value: string): Promise<string> {
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, '0'),
  ).join('');
}
