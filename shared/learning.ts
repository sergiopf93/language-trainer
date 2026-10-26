// Serializable learning contracts shared by local storage and the sync boundary.
export type ExerciseFamily = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7';
export type EditorialStatus = 'candidate' | 'reviewed' | 'published';
export type Dimension =
  | 'reading-comprehension'
  | 'comprehension'
  | 'retrieval'
  | 'contextual-use'
  | 'discrimination'
  | 'retention';
export const skills = [
  'reading-comprehension',
  'recognition',
  'retrieval',
  'transformation',
  'discrimination',
  'controlled-production',
  'communicative-production',
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
export const writingOutcomes = [
  'canonical',
  'accepted-variant',
  'confirmed-error',
  'typo',
  'empty',
  'incomplete',
  'off-task',
  'target-not-demonstrated',
  'unassessed',
] as const;
export type WritingOutcome = (typeof writingOutcomes)[number];
export interface WritingCriterion {
  policy: 'open' | 'bounded';
  rubric: string[];
  model: string;
  incomplete: string[];
  offTask: string[];
  noTarget: string[];
}
export interface Activity {
  writing?: WritingCriterion;
  review?: { reviewer: string; date: string; version: string };
  publication?: { date: string; version: string };
  trace?: ContentTrace;
  id: string;
  version: string;
  family: ExerciseFamily;
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
    | 'controlled-production'
    | 'composition';
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
  readingHelp?: boolean;
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
    mode: 'focus' | 'review' | 'mixed' | 'reading' | 'writing';
    writing?: { id: string; version: string; title: string };
    reading?: {
      id: string;
      version: string;
      title: string;
      body: string;
      help: string;
    };
    mixed?: { groupId: string; conceptIds: string[]; reasons: string[] };
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
    readingHelp?: boolean;
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
    writingOutcome?: WritingOutcome;
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
  'reading-comprehension',
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
        optionalKeys(v, ['review', 'publication', 'writing']),
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
    (!('writing' in v) ||
      (validWritingCriterion(v.writing) &&
        (v.writing.policy === 'open'
          ? v.family === 'F6'
          : v.family !== 'F6'))) &&
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
        ('theoryVersion' in v ? ' theoryVersion' : '') +
        optionalKeys(v, ['readingHelp']),
    ) &&
    (!('theoryVersion' in v) || text(v.theoryVersion)) &&
    (!('readingHelp' in v) || typeof v.readingHelp === 'boolean') &&
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
          'packId conceptId conceptVersion contentStatus mode selectionReason activities state' +
            optionalKeys(p, ['mixed', 'reading', 'writing']),
        ) &&
        ['packId', 'conceptId', 'conceptVersion', 'selectionReason'].every(
          (k) => text(p[k]),
        ) &&
        editorial(p.contentStatus) &&
        ['focus', 'review', 'mixed', 'reading', 'writing'].includes(
          p.mode as string,
        ) &&
        Array.isArray(p.activities) &&
        p.activities.length > 0 &&
        p.activities.length <= 30 &&
        p.activities.every(validActivity) &&
        p.activities.every(
          (a) =>
            (p.mode === 'mixed' ||
              (a.conceptId === p.conceptId &&
                a.conceptVersion === p.conceptVersion)) &&
            a.status === p.contentStatus,
        ) &&
        validSessionScope(p) &&
        new Set(p.activities.map((a) => a.id)).size === p.activities.length &&
        state(p.state) &&
        !(p.state as SessionState).readingHelp &&
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
            ('theoryVersion' in p ? ' theoryVersion' : '') +
            optionalKeys(p, ['readingHelp']),
        ) &&
        id(p.sessionId) &&
        id(p.stateId) &&
        (!('theoryVersion' in p) || text(p.theoryVersion)) &&
        (!('readingHelp' in p) || typeof p.readingHelp === 'boolean') &&
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
            optionalKeys(p, [
              'task',
              'accepted',
              'typoPattern',
              'writingOutcome',
            ]),
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
        (!('writingOutcome' in p) ||
          writingOutcomes.includes(p.writingOutcome as WritingOutcome)) &&
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
  if (v.family === 'F6')
    return (
      v.format === 'composition' &&
      options.length === 0 &&
      v.dimension === 'contextual-use' &&
      validTask(v.task) &&
      v.task.skill === 'communicative-production' &&
      validWritingCriterion(v.writing) &&
      v.writing.policy === 'open' &&
      record(v.criterion) &&
      v.criterion.exhaustive === false
    );
  if (v.family === 'F5')
    return (
      v.dimension === 'reading-comprehension' &&
      validTask(v.task) &&
      v.task.skill === 'reading-comprehension' &&
      ((v.format === 'selection' && options.length >= 2) ||
        (v.format === 'short' && options.length === 0))
    );
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

function validWritingCriterion(v: unknown): v is WritingCriterion {
  return (
    record(v) &&
    keys(v, 'policy rubric model incomplete offTask noTarget') &&
    ['open', 'bounded'].includes(v.policy as string) &&
    strings(v.rubric) &&
    v.rubric.length === 6 &&
    text(v.model) &&
    strings(v.incomplete) &&
    strings(v.offTask) &&
    strings(v.noTarget)
  );
}
function validSessionScope(p: Record<string, unknown>) {
  if (p.mode === 'writing') {
    const w = p.writing;
    return (
      !('mixed' in p) &&
      !('reading' in p) &&
      record(w) &&
      keys(w, 'id version title') &&
      Object.values(w).every(text) &&
      (p.activities as Activity[]).length === 1 &&
      w.id === (p.activities as Activity[])[0].id &&
      w.version === (p.activities as Activity[])[0].version &&
      (p.activities as Activity[]).every(
        (a) => a.family !== 'F5' && a.options.length === 0,
      )
    );
  }
  if (
    'writing' in p ||
    (p.activities as Activity[]).some((a) => a.family === 'F6' || a.writing)
  )
    return false;
  if (p.mode === 'reading') {
    const r = p.reading;
    return (
      !('mixed' in p) &&
      record(r) &&
      keys(r, 'id version title body help') &&
      Object.values(r).every(text) &&
      p.conceptId === 'reading:' + r.id &&
      p.conceptVersion === r.version &&
      (p.activities as Activity[]).every(
        (a) => a.family === 'F5' && a.dimension === 'reading-comprehension',
      )
    );
  }
  if (
    'reading' in p ||
    (p.activities as Activity[]).some((a) => a.family === 'F5')
  )
    return false;
  if (p.mode !== 'mixed') return !('mixed' in p);
  const m = p.mixed;
  if (
    !record(m) ||
    !keys(m, 'groupId conceptIds reasons') ||
    !text(m.groupId) ||
    !strings(m.conceptIds) ||
    !strings(m.reasons) ||
    m.conceptIds.length < 2 ||
    m.reasons.length !== m.conceptIds.length ||
    new Set(m.conceptIds).size !== m.conceptIds.length
  )
    return false;
  const activities = p.activities as Activity[];
  const anchor = activities[0];
  return (
    anchor.conceptId === p.conceptId &&
    anchor.conceptVersion === p.conceptVersion &&
    m.conceptIds.every((id) => activities.some((a) => a.conceptId === id)) &&
    activities.every(
      (a) =>
        (m.conceptIds as string[]).includes(a.conceptId) &&
        activities
          .filter((b) => b.conceptId === a.conceptId)
          .every((b) => b.conceptVersion === a.conceptVersion),
    )
  );
}
