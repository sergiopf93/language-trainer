// Serializable learning contracts shared by local storage and the sync boundary.
export type ExerciseFamily = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';
export type EditorialStatus = 'candidate' | 'reviewed' | 'published';
export type Dimension =
  | 'comprehension'
  | 'retrieval'
  | 'contextual-use'
  | 'discrimination'
  | 'retention';
export const skills = [
  'recognition',
  'retrieval',
  'transformation',
  'discrimination',
  'controlled-production',
] as const;
export type Skill = (typeof skills)[number];
export interface TaskMetadata {
  skill: Skill;
  context: string;
  facets: string[];
  opportunityId: string;
  scaffolding: 'none' | 'visible-options';
  matchingPrompts: string[];
}
export type Judgment =
  | 'correct'
  | 'typo'
  | 'linguistic-error'
  | 'verifiable-error'
  | 'not-evaluable'
  | 'no-opportunity';
export interface ContentTrace {
  kind: 'canonical' | 'derived';
  packId: string;
  packVersion: string;
  curriculumId: string;
  curriculumVersion: string;
  sourceId: string;
  sourceVersion: string;
  templateId?: string;
  templateVersion?: string;
  variantKey?: string;
}
export interface Activity {
  review?: { reviewer: string; date: string; version: string };
  publication?: { date: string; version: string };
  trace?: ContentTrace;
  id: string;
  version: string;
  family: Exclude<ExerciseFamily, 'F5' | 'F6'>;
  task?: TaskMetadata;
  format:
    | 'selection'
    | 'cloze'
    | 'short'
    | 'ordering'
    | 'transformation'
    | 'error-detection'
    | 'error-correction'
    | 'translation'
    | 'matching'
    | 'controlled-production';
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
    typos?: string[];
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
    task?: TaskMetadata;
    accepted?: string[];
    typoPattern?: string;
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
    trace?: ContentTrace;
    activityVersion?: string;
    provenance?: string;
    task?: TaskMetadata;
    attemptId: string;
    evaluationId: string;
    sessionId: string;
    conceptId: string;
    conceptVersion: string;
    activityId: string;
    dimension: Dimension;
    judgment: 'correct' | 'typo' | 'linguistic-error' | 'verifiable-error';
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
      'id version family format conceptId conceptVersion dimension prompt options hint explanation criterion status provenance' +
        ('task' in v ? ' task' : '') +
        ('trace' in v ? ' trace' : '') +
        optionalKeys(v, ['review', 'publication']),
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
    (!('review' in v) ||
      (record(v.review) &&
        keys(v.review, 'reviewer date version') &&
        Object.values(v.review).every(text))) &&
    (!('publication' in v) ||
      (record(v.publication) &&
        keys(v.publication, 'date version') &&
        Object.values(v.publication).every(text))) &&
    (!('trace' in v) || validTrace(v.trace)) &&
    (!('task' in v) || validTask(v.task)) &&
    dimension(v.dimension) &&
    editorial(v.status) &&
    strings(v.options) &&
    validFormat(v) &&
    record(c) &&
    keys(
      c,
      'version canonVersion accepted rejected exhaustive' +
        ('typos' in c ? ' typos' : ''),
    ) &&
    (!('typos' in c) || strings(c.typos)) &&
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
          'attemptId conceptId conceptVersion activityId activityVersion dimension judgment criterionVersion canonVersion evaluatorVersion explanation' +
            optionalKeys(p, ['task', 'accepted', 'typoPattern']),
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
        (!('task' in p) || validTask(p.task)) &&
        (!('accepted' in p) ||
          (strings(p.accepted) && p.accepted.length > 0)) &&
        (!('typoPattern' in p) ||
          (p.judgment === 'typo' && text(p.typoPattern))) &&
        dimension(p.dimension) &&
        [
          'correct',
          'verifiable-error',
          'typo',
          'linguistic-error',
          'not-evaluable',
          'no-opportunity',
        ].includes(p.judgment as string)
      );
    case 'evidence':
      return (
        keys(
          p,
          'attemptId evaluationId sessionId conceptId conceptVersion activityId dimension judgment independent contentStatus' +
            optionalKeys(p, ['task', 'trace', 'activityVersion', 'provenance']),
        ) &&
        (!('trace' in p) ||
          (validTrace(p.trace) &&
            text(p.activityVersion) &&
            text(p.provenance))) &&
        (!('activityVersion' in p) || text(p.activityVersion)) &&
        (!('provenance' in p) || text(p.provenance)) &&
        ['attemptId', 'evaluationId', 'sessionId'].every((k) => id(p[k])) &&
        ['conceptId', 'conceptVersion', 'activityId'].every((k) =>
          text(p[k]),
        ) &&
        (!('task' in p) || validTask(p.task)) &&
        dimension(p.dimension) &&
        ['correct', 'typo', 'linguistic-error', 'verifiable-error'].includes(
          p.judgment as string,
        ) &&
        typeof p.independent === 'boolean' &&
        editorial(p.contentStatus)
      );
    default:
      return false;
  }
}

function optionalKeys(p: Record<string, unknown>, names: string[]) {
  return names
    .filter((n) => n in p)
    .map((n) => ' ' + n)
    .join('');
}
function validTask(v: unknown): v is TaskMetadata {
  return (
    record(v) &&
    keys(v, 'skill context facets opportunityId scaffolding matchingPrompts') &&
    skills.includes(v.skill as Skill) &&
    text(v.context) &&
    strings(v.facets) &&
    text(v.opportunityId) &&
    ['none', 'visible-options'].includes(v.scaffolding as string) &&
    strings(v.matchingPrompts)
  );
}
function validFormat(v: Record<string, unknown>) {
  const options = v.options as string[];
  if (['selection', 'error-detection'].includes(v.format as string))
    return (
      v.family === 'F1' &&
      options.length >= 2 &&
      (v.format === 'selection' || validTask(v.task))
    );
  if (['ordering', 'matching'].includes(v.format as string))
    return (
      v.family === 'F7' &&
      options.length >= 2 &&
      validTask(v.task) &&
      v.task.scaffolding === 'visible-options' &&
      (v.format === 'ordering' ||
        (v.task.matchingPrompts.length === options.length &&
          new Set(options).size === options.length))
    );
  if (['transformation', 'error-correction'].includes(v.format as string))
    return v.family === 'F3' && options.length === 0 && validTask(v.task);
  if (['translation', 'controlled-production'].includes(v.format as string))
    return v.family === 'F4' && options.length === 0 && validTask(v.task);
  return (
    ['cloze', 'short'].includes(v.format as string) &&
    ['F2', 'F4'].includes(v.family as string) &&
    options.length === 0
  );
}

export function validTrace(v: unknown): v is ContentTrace {
  if (!record(v) || !['canonical', 'derived'].includes(v.kind as string))
    return false;
  const names =
    'kind packId packVersion curriculumId curriculumVersion sourceId sourceVersion' +
    (v.kind === 'derived' ? ' templateId templateVersion variantKey' : '');
  return keys(v, names) && names.split(' ').every((k) => text(v[k]));
}
