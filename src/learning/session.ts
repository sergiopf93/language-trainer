import { type Fact, type LearningFact } from '../../shared/protocol';
import type {
  LearningKind,
  LearningPayloads,
  SessionState,
} from '../../shared/learning';
import type { ContentRepository } from '../content/catalog';
import type { LocalStore } from '../persistence/local';
import type {
  LearningEngine,
  LearningRequest,
  LearningDecision,
} from './contract';
import {
  canonicalExerciseEngine,
  evaluatorVersion,
} from '../exercises/evaluate';
export const policyVersion = 'observations-v2';
type Root = Extract<LearningFact, { kind: 'practice-session' }>;
type StateFact = Root | Extract<LearningFact, { kind: 'practice-state' }>;
export interface SessionView {
  root: Root;
  head: StateFact;
  state: SessionState;
  facts: Fact[];
}
function event<K extends LearningKind>(
  kind: K,
  payload: LearningPayloads[K],
  version: string,
  refs: string[] = [],
  entityId?: string,
  baseRevision: string | null = null,
) {
  const id = crypto.randomUUID();
  return {
    id,
    kind,
    payload,
    entityId: entityId ?? id,
    baseRevision,
    references: [...new Set(refs)],
    versions: { content: version, policy: policyVersion },
  };
}
export class SessionEngine implements LearningEngine {
  constructor(
    readonly store: LocalStore,
    readonly catalog: ContentRepository,
  ) {}
  async select(request: LearningRequest): Promise<LearningDecision> {
    if (
      request.mode !== 'focus' ||
      request.languagePackId !== this.catalog.packId ||
      request.conceptIds.length !== 1
    )
      return {
        status: 'unavailable',
        reason: 'Este incremento admite práctica focal de un concepto.',
      };
    const first = this.catalog.select(request.conceptIds[0])[0];
    return first
      ? {
          status: 'ready',
          activityId: first.id,
          reason:
            'Práctica focal del objetivo elegido; actividades compatibles en orden del catálogo. Repetir el fixture no acredita retención ni transferencia.',
        }
      : {
          status: 'unavailable',
          reason:
            'No hay actividades compatibles habilitadas para este concepto.',
        };
  }
  async sessions(): Promise<StateFact[]> {
    const facts = await this.store.allFacts();
    const parents = new Set(facts.map((f) => f.baseRevision));
    return facts.filter(
      (f): f is StateFact =>
        (f.kind === 'practice-session' || f.kind === 'practice-state') &&
        !parents.has(f.id),
    );
  }
  async load(headId: string): Promise<SessionView> {
    const facts = await this.store.allFacts();
    const head = facts.find((f) => f.id === headId);
    if (
      !head ||
      (head.kind !== 'practice-session' && head.kind !== 'practice-state')
    )
      throw new Error('Sesión no encontrada.');
    const root = facts.find((f) => f.id === head.entityId);
    if (root?.kind !== 'practice-session')
      throw new Error('Falta el origen de esta sesión.');
    if (!this.catalog.allowed(root.payload.contentStatus))
      throw new Error(
        'Este contenido candidate no está habilitado en esta compilación.',
      );
    return { root, head, state: head.payload.state, facts };
  }
  async study(conceptId: string, theoryVersion: string) {
    const concept = this.catalog.concept(conceptId);
    if (!concept) throw new Error('Concepto no disponible.');
    await this.store.appendLearning([
      event(
        'theory-exposure',
        {
          packId: this.catalog.packId,
          conceptId,
          conceptVersion: concept.version,
          theoryVersion,
          contentStatus: concept.status,
        },
        this.catalog.version,
      ),
    ]);
  }
  async start(conceptId: string) {
    const decision = await this.select({
      mode: 'focus',
      languagePackId: this.catalog.packId,
      conceptIds: [conceptId],
    });
    if (decision.status === 'unavailable') throw new Error(decision.reason);
    const concept = this.catalog.concept(conceptId);
    const activities = this.catalog.select(conceptId);
    if (!concept || !activities.length)
      throw new Error(
        'No hay actividades compatibles habilitadas para este concepto.',
      );
    const root = event(
      'practice-session',
      {
        packId: this.catalog.packId,
        conceptId,
        conceptVersion: concept.version,
        contentStatus: concept.status,
        mode: 'focus',
        selectionReason: decision.reason,
        activities,
        state: {
          index: 0,
          draft: '',
          hintShown: false,
          attemptId: null,
          status: 'active',
          phase: 'answer',
        },
      },
      this.catalog.version,
    );
    await this.store.appendLearning([root]);
    return this.load(root.id);
  }
  private stateEvent(view: SessionView, state: SessionState) {
    return event(
      'practice-state',
      { sessionId: view.root.id, state },
      view.root.versions.content,
      [
        view.root.id,
        view.head.id,
        ...(state.attemptId ? [state.attemptId] : []),
      ],
      view.root.id,
      view.head.id,
    );
  }
  async update(
    view: SessionView,
    action: 'draft' | 'hint' | 'theory' | 'retry' | 'next' | 'finish',
    draft?: string,
  ) {
    if (view.state.status !== 'active')
      throw new Error('Esta sesión ya ha finalizado.');
    let state = { ...view.state };
    switch (action) {
      case 'draft':
        if (state.phase !== 'answer')
          throw new Error('Primero elige Reintentar.');
        if (typeof draft !== 'string' || draft.length > 4000)
          throw new Error('Respuesta demasiado larga.');
        state.draft = draft;
        break;
      case 'theory':
        if (!draft) throw new Error('Falta la versión de teoría.');
        state.theoryVersion = draft;
        break;
      case 'hint':
        state.hintShown = true;
        break;
      case 'retry':
        if (state.phase !== 'feedback')
          throw new Error('No hay corrección que reintentar.');
        state.phase = 'answer';
        state.draft = '';
        break;
      case 'next':
        if (state.phase !== 'feedback')
          throw new Error('Responde antes de avanzar.');
        state = {
          ...(state.theoryVersion
            ? { theoryVersion: state.theoryVersion }
            : {}),
          index: state.index + 1,
          draft: '',
          hintShown: false,
          attemptId: null,
          status:
            state.index + 1 === view.root.payload.activities.length
              ? 'completed'
              : 'active',
          phase: 'answer',
        };
        break;
      case 'finish':
        state.status = 'completed';
        break;
    }
    const fact = this.stateEvent(view, state);
    await this.store.appendLearning([fact], view.head.id);
    return this.load(fact.id);
  }
  async submit(view: SessionView) {
    const s = view.state;
    if (s.status !== 'active' || s.phase !== 'answer')
      throw new Error('Esta respuesta ya se ha enviado.');
    const a = view.root.payload.activities[s.index];
    const [result] = await canonicalExerciseEngine.evaluate(a, s.draft);
    const currentFacts = await this.store.allFacts();
    const exposure = currentFacts
      .filter((f) => {
        if (f.kind === 'theory-exposure')
          return (
            f.payload.conceptId === a.conceptId &&
            f.payload.conceptVersion === a.conceptVersion &&
            f.occurredAt >= view.root.occurredAt &&
            (f.deviceId !== view.root.deviceId ||
              f.sequence > view.root.sequence)
          );
        if (f.kind === 'evaluation')
          return (
            f.payload.activityId === a.id &&
            f.payload.activityVersion === a.version
          );
        if (
          f.kind !== 'practice-state' ||
          (!f.payload.state.hintShown && !f.payload.state.theoryVersion)
        )
          return false;
        const root = currentFacts.find((r) => r.id === f.payload.sessionId);
        const item =
          root?.kind === 'practice-session'
            ? root.payload.activities[f.payload.state.index]
            : undefined;
        return item?.id === a.id && item.version === a.version;
      })
      .sort(
        (a, b) =>
          a.occurredAt.localeCompare(b.occurredAt) || a.id.localeCompare(b.id),
      )[0];
    const attempt = event(
      'attempt',
      {
        sessionId: view.root.id,
        stateId: view.head.id,
        itemIndex: s.index,
        activityId: a.id,
        activityVersion: a.version,
        response: s.draft,
        ...(s.theoryVersion ? { theoryVersion: s.theoryVersion } : {}),
        hintShown: s.hintShown,
        solutionSeen: s.attemptId !== null || exposure?.kind === 'evaluation',
        retryOf: s.attemptId,
        exposureId: exposure?.id ?? null,
      },
      view.root.versions.content,
      [
        view.root.id,
        view.head.id,
        ...(s.attemptId ? [s.attemptId] : []),
        ...(exposure ? [exposure.id] : []),
      ],
    );
    const evaluation = event(
      'evaluation',
      {
        attemptId: attempt.id,
        conceptId: a.conceptId,
        conceptVersion: a.conceptVersion,
        activityId: a.id,
        activityVersion: a.version,
        dimension: a.dimension,
        judgment: result.judgment,
        ...(a.task ? { task: a.task } : {}),
        accepted: a.criterion.accepted,
        ...(result.judgment === 'typo'
          ? {
              typoPattern:
                s.draft.normalize('NFC').trim().toLowerCase() +
                '→' +
                a.criterion.accepted[0],
            }
          : {}),
        criterionVersion: a.criterion.version,
        canonVersion: a.criterion.canonVersion,
        evaluatorVersion,
        explanation: result.explanation,
      },
      view.root.versions.content,
      [attempt.id],
    );
    const facts: Parameters<LocalStore['appendLearning']>[0] = [
      attempt,
      evaluation,
    ];
    if (
      result.judgment === 'correct' ||
      result.judgment === 'typo' ||
      result.judgment === 'linguistic-error' ||
      result.judgment === 'verifiable-error'
    )
      facts.push(
        event(
          'evidence',
          {
            attemptId: attempt.id,
            evaluationId: evaluation.id,
            sessionId: view.root.id,
            conceptId: a.conceptId,
            conceptVersion: a.conceptVersion,
            activityId: a.id,
            activityVersion: a.version,
            provenance: a.provenance,
            ...(a.trace ? { trace: a.trace } : {}),
            dimension: a.dimension,
            judgment: result.judgment,
            ...(a.task ? { task: a.task } : {}),
            independent:
              !s.theoryVersion && !s.hintShown && !s.attemptId && !exposure,
            contentStatus: view.root.payload.contentStatus,
          },
          view.root.versions.content,
          [attempt.id, evaluation.id, view.root.id],
        ),
      );
    const next = this.stateEvent(view, {
      ...s,
      attemptId: attempt.id,
      phase: 'feedback',
    });
    facts.push(next);
    await this.store.appendLearning(facts, view.head.id);
    return this.load(next.id);
  }
}
