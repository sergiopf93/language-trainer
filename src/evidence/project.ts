import { dimensions, type Dimension } from '../../shared/learning';
import type { Fact } from '../../shared/protocol';
import { policyVersion } from '../learning/session';
export interface Observation {
  dimension: Dimension;
  correct: number;
  errors: number;
  assisted: number;
  unassessed: number;
  activityIds: string[];
  supportingFactIds: string[];
  lastObserved: string | null;
}
export function project(
  facts: readonly Fact[],
  conceptId: string,
  conceptVersion: string,
  allowCandidates = false,
) {
  const unique = [...new Map(facts.map((f) => [f.id, f])).values()];
  const permitted = new Set(
    unique
      .filter(
        (f) =>
          f.kind === 'practice-session' &&
          (f.payload.contentStatus === 'published' ||
            (allowCandidates && f.payload.contentStatus === 'candidate')),
      )
      .map((f) => f.id),
  );
  const evidence = unique.filter(
    (f) =>
      f.kind === 'evidence' &&
      f.payload.conceptId === conceptId &&
      f.payload.conceptVersion === conceptVersion &&
      permitted.has(f.payload.sessionId),
  );
  const evaluations = unique.filter(
    (f) =>
      f.kind === 'evaluation' &&
      f.payload.conceptId === conceptId &&
      f.payload.conceptVersion === conceptVersion &&
      unique.some(
        (a) =>
          a.kind === 'attempt' &&
          a.id === f.payload.attemptId &&
          permitted.has(a.payload.sessionId),
      ),
  );
  const observations: Observation[] = dimensions.map((dimension) => {
    const seen = evidence.filter(
      (f) => f.kind === 'evidence' && f.payload.dimension === dimension,
    );
    const independent = seen.filter(
      (f) => f.kind === 'evidence' && f.payload.independent,
    );
    return {
      dimension,
      correct: independent.filter(
        (f) => f.kind === 'evidence' && f.payload.judgment === 'correct',
      ).length,
      errors: independent.filter(
        (f) =>
          f.kind === 'evidence' && f.payload.judgment === 'verifiable-error',
      ).length,
      assisted: seen.length - independent.length,
      unassessed: evaluations.filter(
        (f) =>
          f.kind === 'evaluation' &&
          f.payload.dimension === dimension &&
          ['not-evaluable', 'no-opportunity'].includes(f.payload.judgment),
      ).length,
      activityIds: [
        ...new Set(
          seen.flatMap((f) =>
            f.kind === 'evidence' ? [f.payload.activityId] : [],
          ),
        ),
      ].sort(),
      supportingFactIds: seen.map((f) => f.id).sort(),
      lastObserved:
        seen
          .map((f) => f.occurredAt)
          .sort()
          .at(-1) ?? null,
    };
  });
  return {
    conceptId,
    conceptVersion,
    policyVersion,
    observations,
    sourceFactIds: [...evidence, ...evaluations].map((f) => f.id).sort(),
    contentVersions: [
      ...new Set(evidence.map((f) => f.versions.content)),
    ].sort(),
    uncertainty:
      'Historial provisional de observaciones; los ítems repetidos no acreditan variedad ni retención. Sin umbral de dominio estable.',
  };
}
