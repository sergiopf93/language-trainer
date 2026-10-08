import {
  validLearningPayload,
  type LearningPayloads,
  type LearningKind,
} from './learning';
export const SCHEMA_VERSION = 1;
export type FactKind = 'session' | 'session-revision' | LearningKind;
interface FactEnvelope {
  id: string;
  deviceId: string;
  sequence: number;
  occurredAt: string;
  schemaVersion: 1;
  entityId: string;
  baseRevision: string | null;
  references: string[];
  versions: { content: string; policy: string };
}
export interface DraftFact extends FactEnvelope {
  kind: 'session' | 'session-revision';
  payload: { intention: string; state: 'draft' };
}
export type LearningFact = {
  [K in LearningKind]: FactEnvelope & { kind: K; payload: LearningPayloads[K] };
}[LearningKind];
export type Fact = DraftFact | LearningFact;
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
  if (typeof v.kind === 'string' && validLearningPayload(v.kind, v.payload)) {
    if (
      !object(v.versions) ||
      !exact(v.versions, ['content', 'policy']) ||
      typeof v.versions.content !== 'string' ||
      !v.versions.content ||
      v.versions.content.length > 100 ||
      v.versions.policy !== 'observations-v1'
    )
      return false;
    const p = v.payload as Record<string, unknown>;
    const refs = v.references as string[];
    let expected: unknown[] = [];
    if (v.kind === 'practice-state') {
      const state = p.state as { attemptId: string | null };
      expected = [
        p.sessionId,
        v.baseRevision,
        ...(state.attemptId ? [state.attemptId] : []),
      ];
      if (
        !uuid(v.baseRevision) ||
        v.entityId !== p.sessionId ||
        v.entityId === v.id
      )
        return false;
    } else {
      if (v.baseRevision !== null || v.entityId !== v.id) return false;
      if (v.kind === 'attempt')
        expected = [
          p.sessionId,
          p.stateId,
          ...(p.retryOf ? [p.retryOf] : []),
          ...(p.exposureId ? [p.exposureId] : []),
        ];
      if (v.kind === 'evaluation') expected = [p.attemptId];
      if (v.kind === 'evidence')
        expected = [p.attemptId, p.evaluationId, p.sessionId];
    }
    return (
      refs.length === new Set(expected).size &&
      expected.every((ref) => refs.includes(ref as string))
    );
  }
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

// Referential checks supplement shape validation without changing the transport protocol.
export function validLinks(fact: Fact, known: Map<string, Fact>): boolean {
  if (fact.references.some((id) => !known.has(id))) return false;
  const visited = new Set([fact.id]);
  let baseId = fact.baseRevision;
  while (baseId) {
    if (visited.has(baseId)) return false;
    visited.add(baseId);
    baseId = known.get(baseId)?.baseRevision ?? null;
  }
  if (fact.kind === 'practice-state') {
    const root = known.get(fact.payload.sessionId);
    const base = known.get(fact.baseRevision!);
    if (
      root?.kind !== 'practice-session' ||
      !base ||
      base.entityId !== root.id ||
      !['practice-session', 'practice-state'].includes(base.kind)
    )
      return false;
    const state = fact.payload.state;
    if (
      state.index > root.payload.activities.length ||
      (state.status === 'active' &&
        state.index === root.payload.activities.length)
    )
      return false;
    if (state.attemptId) {
      const attempt = known.get(state.attemptId);
      if (
        attempt?.kind !== 'attempt' ||
        attempt.payload.sessionId !== root.id ||
        attempt.payload.itemIndex !== state.index
      )
        return false;
    }
  }
  if (fact.kind === 'attempt') {
    const p = fact.payload;
    const root = known.get(p.sessionId);
    const base = known.get(p.stateId);
    if (
      root?.kind !== 'practice-session' ||
      !base ||
      base.entityId !== root.id ||
      (base.kind !== 'practice-session' && base.kind !== 'practice-state')
    )
      return false;
    const a = root.payload.activities[p.itemIndex];
    const s = base.payload.state;
    if (
      !a ||
      a.id !== p.activityId ||
      a.version !== p.activityVersion ||
      s.index !== p.itemIndex ||
      s.status !== 'active' ||
      s.phase !== 'answer' ||
      s.hintShown !== p.hintShown ||
      s.attemptId !== p.retryOf ||
      p.solutionSeen !==
        (p.retryOf !== null ||
          known.get(p.exposureId ?? '')?.kind === 'evaluation')
    )
      return false;
    if (p.exposureId) {
      const exposure = known.get(p.exposureId);
      const correction =
        exposure?.kind === 'evaluation' &&
        exposure.payload.activityId === p.activityId &&
        exposure.payload.activityVersion === p.activityVersion;
      const hint =
        exposure?.kind === 'practice-state' && exposure.payload.state.hintShown;
      if (!correction && !hint) return false;
    }
    if (p.retryOf) {
      const previous = known.get(p.retryOf);
      if (
        previous?.kind !== 'attempt' ||
        previous.payload.sessionId !== p.sessionId ||
        previous.payload.itemIndex !== p.itemIndex
      )
        return false;
    }
  }
  if (fact.kind === 'evaluation') {
    const attempt = known.get(fact.payload.attemptId);
    if (
      attempt?.kind !== 'attempt' ||
      attempt.payload.activityId !== fact.payload.activityId ||
      attempt.payload.activityVersion !== fact.payload.activityVersion
    )
      return false;
  }
  if (fact.kind === 'evidence') {
    const p = fact.payload;
    const evaluation = known.get(p.evaluationId);
    const attempt = known.get(p.attemptId);
    const session = known.get(p.sessionId);
    if (
      evaluation?.kind !== 'evaluation' ||
      attempt?.kind !== 'attempt' ||
      session?.kind !== 'practice-session'
    )
      return false;
    const e = evaluation.payload;
    if (
      e.attemptId !== attempt.id ||
      attempt.payload.sessionId !== session.id ||
      e.conceptId !== p.conceptId ||
      e.conceptVersion !== p.conceptVersion ||
      e.activityId !== p.activityId ||
      e.dimension !== p.dimension ||
      e.judgment !== p.judgment ||
      session.payload.contentStatus !== p.contentStatus ||
      p.independent !==
        (!attempt.payload.hintShown &&
          !attempt.payload.solutionSeen &&
          !attempt.payload.exposureId)
    )
      return false;
  }
  return true;
}
