import type { Activity, Dimension } from '../../shared/learning';
import type { Fact } from '../../shared/protocol';
import type { ContentRepository } from '../content/catalog';
import type { LocalStore } from '../persistence/local';
import { project } from '../evidence/project';
import type { ReviewNeed, ReviewScheduler } from './contract';

export const reviewPolicyVersion = 'review-v1';
// Operational invitation, based on Research 04 §4's next-day example; not a retention threshold.
export const reviewIntervalMs = 24 * 60 * 60 * 1000;
export interface ReviewPlan extends ReviewNeed {
  reasons: string[];
  priority: number;
  lastPracticedAt: string;
  nextCheckAt: string;
  due: boolean;
  errorDimensions: Dimension[];
  freshActivities: number;
}
function unique(facts: readonly Fact[]) {
  return [...new Map(facts.map((f) => [f.id, f])).values()];
}
function history(facts: readonly Fact[], catalog: ContentRepository) {
  const all = unique(facts);
  const roots = new Set(
    all
      .filter(
        (f) =>
          f.kind === 'practice-session' &&
          f.payload.packId === catalog.packId &&
          catalog.allowed(f.payload.contentStatus),
      )
      .map((f) => f.id),
  );
  const attempts = new Map(
    all
      .filter((f) => f.kind === 'attempt' && roots.has(f.payload.sessionId))
      .map((f) => [f.id, f]),
  );
  return { all, roots, attempts };
}
export function selectReviewActivities(
  catalog: ContentRepository,
  facts: readonly Fact[],
  conceptId: string,
  limit = 4,
  errorDimensions: readonly Dimension[] = [],
): Activity[] {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 30)
    throw new Error('Presupuesto de actividades no válido.');
  const { all, attempts } = history(facts, catalog);
  const last = new Map<string, string>();
  for (const f of all) {
    if (f.kind === 'attempt' && attempts.has(f.id)) {
      const key = f.payload.activityId + ':' + f.payload.activityVersion;
      if ((last.get(key) ?? '') < f.occurredAt) last.set(key, f.occurredAt);
    }
  }
  const time = (a: Activity) => last.get(a.id + ':' + a.version) ?? '';
  const skillOrder = (a: Activity) =>
    [
      'retrieval',
      'discrimination',
      'transformation',
      'controlled-production',
      'recognition',
    ].indexOf(
      a.task?.skill ??
        (a.dimension === 'retrieval' ? 'retrieval' : 'recognition'),
    );
  const preferred = (a: Activity) =>
    a.task?.skill !== 'recognition' &&
    (a.task ||
      ['retrieval', 'discrimination', 'contextual-use'].includes(a.dimension));
  // Never leave a new equivalent opportunity behind merely to repeat a familiar format.
  const pool = [...catalog.select(conceptId)].sort(
    (a, b) =>
      Number(!!time(a)) - Number(!!time(b)) ||
      Number(errorDimensions.includes(b.dimension)) -
        Number(errorDimensions.includes(a.dimension)) ||
      Number(!!preferred(b)) - Number(!!preferred(a)) ||
      time(a).localeCompare(time(b)) ||
      Number(a.task?.scaffolding === 'visible-options') -
        Number(b.task?.scaffolding === 'visible-options') ||
      skillOrder(a) - skillOrder(b) ||
      a.id.localeCompare(b.id),
  );
  const chosen: Activity[] = [];
  while (pool.length && chosen.length < limit) {
    const first = pool[0];
    const sameTier = (a: Activity) =>
      !!time(a) === !!time(first) &&
      errorDimensions.includes(a.dimension) ===
        errorDimensions.includes(first.dimension) &&
      !!preferred(a) === !!preferred(first);
    const index = pool.findIndex(
      (a) =>
        sameTier(a) &&
        !chosen.some(
          (c) =>
            (c.task?.skill ?? c.dimension) === (a.task?.skill ?? a.dimension),
        ),
    );
    chosen.push(pool.splice(index < 0 ? 0 : index, 1)[0]);
  }
  return chosen;
}
export function reviewPlans(
  catalog: ContentRepository,
  facts: readonly Fact[],
  now: Date,
  intervalMs = reviewIntervalMs,
): ReviewPlan[] {
  if (
    !Number.isFinite(now.getTime()) ||
    !Number.isFinite(intervalMs) ||
    intervalMs <= 0
  )
    throw new Error('Reloj o intervalo no válido.');
  const { all, roots, attempts } = history(facts, catalog);
  const plans: ReviewPlan[] = [];
  for (const concept of catalog.available()) {
    const studied = all.filter(
      (f) =>
        (f.kind === 'theory-exposure' &&
          f.payload.packId === catalog.packId &&
          catalog.allowed(f.payload.contentStatus) &&
          f.payload.conceptId === concept.id &&
          f.payload.conceptVersion === concept.version) ||
        (f.kind === 'attempt' &&
          attempts.has(f.id) &&
          all.some(
            (r) =>
              r.id === f.payload.sessionId &&
              r.kind === 'practice-session' &&
              r.payload.conceptId === concept.id &&
              r.payload.conceptVersion === concept.version,
          )),
    );
    if (!studied.length || !catalog.select(concept.id).length) continue;
    const evidence = all.filter(
      (f) =>
        f.kind === 'evidence' &&
        roots.has(f.payload.sessionId) &&
        f.payload.conceptId === concept.id &&
        f.payload.conceptVersion === concept.version,
    );
    const errors = evidence.filter(
      (f) =>
        f.kind === 'evidence' &&
        ['linguistic-error', 'verifiable-error'].includes(f.payload.judgment) &&
        attempts.get(f.payload.attemptId)?.kind === 'attempt' &&
        (
          attempts.get(f.payload.attemptId) as Extract<
            Fact,
            { kind: 'attempt' }
          >
        ).payload.retryOf === null,
    );
    const errorDimensions = [
      ...new Set(
        errors.flatMap((f) =>
          f.kind === 'evidence' ? [f.payload.dimension] : [],
        ),
      ),
    ].sort();
    const laterSuccess =
      errors.length > 0 &&
      errorDimensions.every((d) => {
        const latest = errors
          .filter((f) => f.kind === 'evidence' && f.payload.dimension === d)
          .map((f) => f.occurredAt)
          .sort()
          .at(-1)!;
        return evidence.some(
          (f) =>
            f.kind === 'evidence' &&
            f.payload.dimension === d &&
            f.payload.independent &&
            f.payload.judgment === 'correct' &&
            f.occurredAt > latest,
        );
      });
    const recurrent = errorDimensions.some(
      (d) =>
        new Set(
          errors.flatMap((f) =>
            f.kind === 'evidence' && f.payload.dimension === d
              ? [f.payload.sessionId + ':' + f.payload.activityId]
              : [],
          ),
        ).size > 1,
    );
    const failedRetrieval = errors.some(
      (f) =>
        f.kind === 'evidence' &&
        f.payload.dimension === 'retrieval' &&
        f.payload.independent,
    );
    const projection = project(
      all.filter((f) => f.kind !== 'practice-session' || roots.has(f.id)),
      concept.id,
      concept.version,
      catalog.allowCandidates,
    );
    const missing = concept.dimensions.filter(
      (d) =>
        d !== 'retention' &&
        catalog.select(concept.id).some((a) => a.dimension === d) &&
        !projection.observations.some(
          (o) => o.dimension === d && o.correct > 0,
        ),
    );
    const lastPracticedAt = studied
      .map((f) => f.occurredAt)
      .sort()
      .at(-1)!;
    const nextCheckAt = new Date(
      Date.parse(lastPracticedAt) + intervalMs,
    ).toISOString();
    const due = now.getTime() >= Date.parse(nextCheckAt);
    const reasons: string[] = [];
    if (recurrent)
      reasons.push('Difficoltà osservate in più occasioni; da ricontrollare.');
    if (failedRetrieval)
      reasons.push('Recupero non riuscito nel percorso precedente.');
    else if (errors.length)
      reasons.push('Errori linguistici osservati nel percorso precedente.');
    if (laterSuccess)
      reasons.push(
        'Un successo successivo è registrato; la difficoltà precedente resta nello storico.',
      );
    if (missing.length)
      reasons.push(
        'Mancano osservazioni corrette senza aiuto in alcune dimensioni disponibili.',
      );
    if (due)
      reasons.push(
        'È trascorso l’intervallo di invito: prova di nuovo prima di leggere gli aiuti.',
      );
    if (!reasons.length)
      reasons.push('Concetto studiato: puoi scegliere una nuova verifica.');
    const seen = new Set(
      studied.flatMap((f) =>
        f.kind === 'attempt'
          ? [f.payload.activityId + ':' + f.payload.activityVersion]
          : [],
      ),
    );
    plans.push({
      conceptId: concept.id,
      reason: reasons.join(' '),
      reasons,
      policyVersion: reviewPolicyVersion,
      sourceFactIds: [
        ...new Set([...studied, ...evidence].map((f) => f.id)),
      ].sort(),
      priority:
        !laterSuccess && recurrent
          ? 0
          : !laterSuccess && failedRetrieval
            ? 1
            : !laterSuccess && errors.length
              ? 2
              : missing.length && due
                ? 3
                : missing.length
                  ? 4
                  : errors.length
                    ? 5
                    : 6,
      lastPracticedAt,
      nextCheckAt,
      due,
      errorDimensions,
      freshActivities: catalog
        .select(concept.id)
        .filter((a) => !seen.has(a.id + ':' + a.version)).length,
    });
  }
  return plans.sort(
    (a, b) =>
      a.priority - b.priority ||
      Number(b.due) - Number(a.due) ||
      a.lastPracticedAt.localeCompare(b.lastPracticedAt) ||
      a.conceptId.localeCompare(b.conceptId),
  );
}
export class LocalReviewScheduler implements ReviewScheduler {
  constructor(
    readonly store: LocalStore,
    readonly catalog: ContentRepository,
    readonly intervalMs = reviewIntervalMs,
  ) {}
  async suggest(now: Date, budget: number): Promise<ReviewPlan[]> {
    if (!Number.isSafeInteger(budget) || budget < 0)
      throw new Error('Presupuesto de conceptos no válido.');
    return reviewPlans(
      this.catalog,
      await this.store.allFacts(),
      now,
      this.intervalMs,
    ).slice(0, budget);
  }
}
