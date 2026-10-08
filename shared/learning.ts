// Serializable learning contracts shared by local storage and the sync boundary.
export type EditorialStatus = 'candidate' | 'reviewed' | 'published';
export type Dimension =
  | 'comprehension'
  | 'retrieval'
  | 'contextual-use'
  | 'discrimination'
  | 'retention';
export type Judgment =
  'correct' | 'verifiable-error' | 'not-evaluable' | 'no-opportunity';
export interface Activity {
  id: string;
  version: string;
  family: 'F1' | 'F2' | 'F4';
  format: 'selection' | 'cloze' | 'short';
  conceptId: string;
  conceptVersion: string;
  dimension: Dimension;
  prompt: string;
  options: string[];
  hint: string;
  explanation: string;
  criterion: {
    version: string;
    canonVersion: string;
    accepted: string[];
    rejected: string[];
    exhaustive: boolean;
  };
  status: EditorialStatus;
  provenance: string;
}
export interface SessionState {
  theoryVersion?: string;
  index: number;
  draft: string;
  hintShown: boolean;
  attemptId: string | null;
  status: 'active' | 'completed';
  phase: 'answer' | 'feedback';
}
export interface LearningPayloads {
  'practice-session': {
    packId: string;
    conceptId: string;
    conceptVersion: string;
    contentStatus: EditorialStatus;
    mode: 'focus';
    selectionReason: string;
    activities: Activity[];
    state: SessionState;
  };
  'practice-state': { sessionId: string; state: SessionState };
  'theory-exposure': {
    packId: string;
    conceptId: string;
    conceptVersion: string;
    theoryVersion: string;
    contentStatus: EditorialStatus;
  };
  attempt: {
    theoryVersion?: string;
    sessionId: string;
    stateId: string;
    itemIndex: number;
    activityId: string;
    activityVersion: string;
    response: string;
    hintShown: boolean;
    solutionSeen: boolean;
    retryOf: string | null;
    exposureId: string | null;
  };
  evaluation: {
    attemptId: string;
    conceptId: string;
    conceptVersion: string;
    activityId: string;
    activityVersion: string;
    dimension: Dimension;
    judgment: Judgment;
    criterionVersion: string;
    canonVersion: string;
    evaluatorVersion: string;
    explanation: string;
  };
  evidence: {
    attemptId: string;
    evaluationId: string;
    sessionId: string;
    conceptId: string;
    conceptVersion: string;
    activityId: string;
    dimension: Dimension;
    judgment: 'correct' | 'verifiable-error';
    independent: boolean;
    contentStatus: EditorialStatus;
  };
}
export type LearningKind = keyof LearningPayloads;
const record = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= 4000;
const strings = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length <= 30 && v.every(text);
const keys = (v: Record<string, unknown>, names: string) =>
  Object.keys(v).sort().join() === names.split(' ').sort().join();
const id = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
export const dimensions: Dimension[] = [
  'comprehension',
  'retrieval',
  'contextual-use',
  'discrimination',
  'retention',
];
const dimension = (v: unknown) => dimensions.includes(v as Dimension);
const editorial = (v: unknown) =>
  ['candidate', 'reviewed', 'published'].includes(v as string);
export function validActivity(v: unknown): v is Activity {
  if (
    !record(v) ||
    !keys(
      v,
      'id version family format conceptId conceptVersion dimension prompt options hint explanation criterion status provenance',
    )
  )
    return false;
  const c = v.criterion;
  return (
    [
      'id',
      'version',
      'conceptId',
      'conceptVersion',
      'prompt',
      'hint',
      'explanation',
      'provenance',
    ].every((k) => text(v[k])) &&
    dimension(v.dimension) &&
    editorial(v.status) &&
    strings(v.options) &&
    ['selection', 'cloze', 'short'].includes(v.format as string) &&
    (v.format === 'selection'
      ? v.family === 'F1' && v.options.length >= 2
      : ['F2', 'F4'].includes(v.family as string) && v.options.length === 0) &&
    record(c) &&
    keys(c, 'version canonVersion accepted rejected exhaustive') &&
    text(c.version) &&
    text(c.canonVersion) &&
    strings(c.accepted) &&
    c.accepted.length > 0 &&
    strings(c.rejected) &&
    typeof c.exhaustive === 'boolean'
  );
}
function state(v: unknown) {
  return (
    record(v) &&
    keys(
      v,
      'index draft hintShown attemptId status phase' +
        ('theoryVersion' in v ? ' theoryVersion' : ''),
    ) &&
    (!('theoryVersion' in v) || text(v.theoryVersion)) &&
    Number.isSafeInteger(v.index) &&
    Number(v.index) >= 0 &&
    Number(v.index) <= 30 &&
    typeof v.draft === 'string' &&
    v.draft.length <= 4000 &&
    typeof v.hintShown === 'boolean' &&
    (v.attemptId === null || id(v.attemptId)) &&
    ['active', 'completed'].includes(v.status as string) &&
    ['answer', 'feedback'].includes(v.phase as string) &&
    (v.phase !== 'feedback' || id(v.attemptId))
  );
}
export function validLearningPayload(kind: string, p: unknown): boolean {
  if (!record(p)) return false;
  switch (kind) {
    case 'practice-session':
      return (
        keys(
          p,
          'packId conceptId conceptVersion contentStatus mode selectionReason activities state',
        ) &&
        ['packId', 'conceptId', 'conceptVersion', 'selectionReason'].every(
          (k) => text(p[k]),
        ) &&
        editorial(p.contentStatus) &&
        p.mode === 'focus' &&
        Array.isArray(p.activities) &&
        p.activities.length > 0 &&
        p.activities.length <= 30 &&
        p.activities.every(validActivity) &&
        p.activities.every(
          (a) =>
            a.conceptId === p.conceptId &&
            a.conceptVersion === p.conceptVersion &&
            a.status === p.contentStatus,
        ) &&
        new Set(p.activities.map((a) => a.id)).size === p.activities.length &&
        state(p.state) &&
        (p.state as SessionState).index === 0 &&
        (p.state as SessionState).status === 'active' &&
        (p.state as SessionState).attemptId === null
      );
    case 'practice-state':
      return keys(p, 'sessionId state') && id(p.sessionId) && state(p.state);
    case 'theory-exposure':
      return (
        keys(
          p,
          'packId conceptId conceptVersion theoryVersion contentStatus',
        ) &&
        ['packId', 'conceptId', 'conceptVersion', 'theoryVersion'].every((k) =>
          text(p[k]),
        ) &&
        editorial(p.contentStatus)
      );
    case 'attempt':
      return (
        keys(
          p,
          'sessionId stateId itemIndex activityId activityVersion response hintShown solutionSeen retryOf exposureId' +
            ('theoryVersion' in p ? ' theoryVersion' : ''),
        ) &&
        id(p.sessionId) &&
        id(p.stateId) &&
        (!('theoryVersion' in p) || text(p.theoryVersion)) &&
        Number.isSafeInteger(p.itemIndex) &&
        Number(p.itemIndex) >= 0 &&
        Number(p.itemIndex) < 30 &&
        text(p.activityId) &&
        text(p.activityVersion) &&
        typeof p.response === 'string' &&
        p.response.length <= 4000 &&
        typeof p.hintShown === 'boolean' &&
        typeof p.solutionSeen === 'boolean' &&
        (p.retryOf === null || id(p.retryOf)) &&
        (p.exposureId === null || id(p.exposureId))
      );
    case 'evaluation':
      return (
        keys(
          p,
          'attemptId conceptId conceptVersion activityId activityVersion dimension judgment criterionVersion canonVersion evaluatorVersion explanation',
        ) &&
        id(p.attemptId) &&
        [
          'conceptId',
          'conceptVersion',
          'activityId',
          'activityVersion',
          'criterionVersion',
          'canonVersion',
          'evaluatorVersion',
          'explanation',
        ].every((k) => text(p[k])) &&
        dimension(p.dimension) &&
        [
          'correct',
          'verifiable-error',
          'not-evaluable',
          'no-opportunity',
        ].includes(p.judgment as string)
      );
    case 'evidence':
      return (
        keys(
          p,
          'attemptId evaluationId sessionId conceptId conceptVersion activityId dimension judgment independent contentStatus',
        ) &&
        ['attemptId', 'evaluationId', 'sessionId'].every((k) => id(p[k])) &&
        ['conceptId', 'conceptVersion', 'activityId'].every((k) =>
          text(p[k]),
        ) &&
        dimension(p.dimension) &&
        ['correct', 'verifiable-error'].includes(p.judgment as string) &&
        typeof p.independent === 'boolean' &&
        editorial(p.contentStatus)
      );
    default:
      return false;
  }
}
