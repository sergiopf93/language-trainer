import { writingOptions, writingPreparation } from '../writing/engine';
import type { ReadingText } from '../reading/corpus';
import { readingActivities, eligibleReading } from '../reading/engine';
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
  normalize,
} from '../exercises/evaluate';
import {
  reviewPlans,
  selectReviewActivities,
  reviewPolicyVersion,
} from '../review/engine';
import { mixedPlans, mixedPolicyVersion } from '../mixed/engine';
import { observationPolicyVersion } from '../evidence/contract';
export const policyVersion = observationPolicyVersion;
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
      request.mode === 'mixed' &&
      request.languagePackId === this.catalog.packId
    ) {
      const plan = mixedPlans(
        this.catalog,
        await this.store.allFacts(),
        new Date(),
      ).find(
        (p) =>
          request.conceptIds.length === 0 ||
          (p.conceptIds.length === request.conceptIds.length &&
            p.conceptIds.every((id) => request.conceptIds.includes(id))),
      );
      return plan
        ? {
            status: 'ready',
            activityId: plan.activities[0].id,
            reason: plan.reason,
          }
        : {
            status: 'unavailable',
            reason:
              'No hay un grupo compatible de conceptos introducidos y actividades aptas.',
          };
    }
    if (
      !['focus', 'review'].includes(request.mode) ||
      request.languagePackId !== this.catalog.packId ||
      request.conceptIds.length !== 1
    )
      return {
        status: 'unavailable',
        reason: 'Este incremento admite práctica focal de un concepto.',
      };
    if (request.mode === 'review') {
      const plan = reviewPlans(
        this.catalog,
        await this.store.allFacts(),
        new Date(),
      ).find((p) => p.conceptId === request.conceptIds[0]);
      const activity =
        plan &&
        selectReviewActivities(
          this.catalog,
          await this.store.allFacts(),
          plan.conceptId,
          4,
          plan.errorDimensions,
        )[0];
      return plan && activity
        ? { status: 'ready', activityId: activity.id, reason: plan.reason }
        : {
            status: 'unavailable',
            reason:
              'Estudia o practica primero este concepto antes de repasarlo.',
          };
    }
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
  async start(conceptId: string, mode: 'focus' | 'review' = 'focus') {
    const decision = await this.select({
      mode,
      languagePackId: this.catalog.packId,
      conceptIds: [conceptId],
    });
    if (decision.status === 'unavailable') throw new Error(decision.reason);
    const concept = this.catalog.concept(conceptId);
    const facts = await this.store.allFacts();
    const plan =
      mode === 'review'
        ? reviewPlans(this.catalog, facts, new Date()).find(
            (p) => p.conceptId === conceptId,
          )
        : undefined;
    const activities =
      mode === 'review'
        ? selectReviewActivities(
            this.catalog,
            facts,
            conceptId,
            4,
            plan?.errorDimensions,
          )
        : this.catalog.select(conceptId);
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
        mode,
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
    if (mode === 'review') root.versions.policy = reviewPolicyVersion;
    await this.store.appendLearning([root]);
    return this.load(root.id);
  }
  async startWriting(id: string) {
    const option = writingOptions(this.catalog).find((t) => t.id === id);
    if (
      !option ||
      writingPreparation(option, this.catalog, await this.store.allFacts())
        .length
    )
      throw new Error('Scrittura non disponibile con la preparazione attuale.');
    const a = option.activity;
    const root = event(
      'practice-session',
      {
        packId: this.catalog.packId,
        conceptId: a.conceptId,
        conceptVersion: a.conceptVersion,
        contentStatus: a.status,
        mode: 'writing',
        writing: {
          id: option.id,
          version: option.version,
          title: option.title,
        },
        selectionReason:
          'Produzione scritta con criterio esplicito; i testi aperti sono conservati senza valutazione linguistica automatica.',
        activities: [a],
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
    root.versions.policy = 'writing-v1';
    await this.store.appendLearning([root]);
    return this.load(root.id);
  }
  async startReading(text: ReadingText) {
    if (
      !['reviewed', 'published'].includes(text.status) ||
      !this.catalog.allowed(text.status) ||
      !eligibleReading(text, this.catalog, await this.store.allFacts())
    )
      throw new Error('Lectura no disponible con la preparación actual.');
    const activities = readingActivities(text, this.catalog);
    if (!activities.length)
      throw new Error('La lectura no tiene preguntas disponibles.');
    const root = event(
      'practice-session',
      {
        packId: this.catalog.packId,
        conceptId: 'reading:' + text.id,
        conceptVersion: text.version,
        contentStatus: text.status,
        mode: 'reading',
        selectionReason:
          'Comprensión de un texto con preparación disponible; no acredita producción gramatical ni retención.',
        reading: {
          id: text.id,
          version: text.version,
          title: text.title,
          body: text.body,
          help: [
            text.help,
            ...text.vocabulary.map(({ word, gloss }) => `${word}: ${gloss}`),
          ].join('\n'),
        },
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
    root.versions.policy = 'reading-v1';
    await this.store.appendLearning([root]);
    return this.load(root.id);
  }
  async startMixed(groupId?: string) {
    const plans = mixedPlans(
      this.catalog,
      await this.store.allFacts(),
      new Date(),
    );
    const plan = groupId ? plans.find((p) => p.groupId === groupId) : plans[0];
    if (!plan)
      throw new Error(
        'No hay un grupo compatible de conceptos introducidos y actividades aptas.',
      );
    const first = plan.activities[0];
    const root = event(
      'practice-session',
      {
        packId: this.catalog.packId,
        conceptId: first.conceptId,
        conceptVersion: first.conceptVersion,
        contentStatus: first.status,
        mode: 'mixed',
        selectionReason: plan.reason,
        mixed: {
          groupId: plan.groupId,
          conceptIds: plan.conceptIds,
          reasons: plan.reasons,
        },
        activities: plan.activities,
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
    root.versions.policy = mixedPolicyVersion;
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
    action:
      | 'draft'
      | 'hint'
      | 'theory'
      | 'reading-help'
      | 'retry'
      | 'next'
      | 'finish',
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
      case 'reading-help':
        if (view.root.payload.mode !== 'reading')
          throw new Error('La sesión no es una lectura.');
        state.readingHelp = true;
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
        if (view.root.payload.mode !== 'writing') state.draft = '';
        break;
      case 'next':
        if (state.phase !== 'feedback')
          throw new Error('Responde antes de avanzar.');
        state = {
          ...(state.readingHelp ? { readingHelp: true } : {}),
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
          (!f.payload.state.hintShown &&
            !f.payload.state.theoryVersion &&
            !f.payload.state.readingHelp)
        )
          return false;
        const root = currentFacts.find((r) => r.id === f.payload.sessionId);
        if (
          f.payload.state.readingHelp &&
          root?.kind === 'practice-session' &&
          root.payload.reading &&
          view.root.payload.reading &&
          root.payload.reading.id === view.root.payload.reading.id &&
          root.payload.reading.version === view.root.payload.reading.version
        )
          return true;
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
        ...(s.readingHelp ? { readingHelp: true } : {}),
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
        ...(view.root.payload.mode === 'writing'
          ? {
              writingOutcome:
                result.writingOutcome ??
                (result.judgment === 'correct'
                  ? normalize(s.draft) === normalize(a.criterion.accepted[0])
                    ? ('canonical' as const)
                    : ('accepted-variant' as const)
                  : result.judgment === 'typo'
                    ? ('typo' as const)
                    : result.judgment === 'linguistic-error'
                      ? ('confirmed-error' as const)
                      : result.judgment === 'no-opportunity'
                        ? ('empty' as const)
                        : ('unassessed' as const)),
            }
          : {}),
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
              !s.theoryVersion &&
              !s.readingHelp &&
              !s.hintShown &&
              !s.attemptId &&
              !exposure,
            contentStatus: a.status,
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
