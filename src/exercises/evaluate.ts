import type { ExerciseEngine } from './contract';
import type { Activity, Judgment } from '../../shared/learning';
export const evaluatorVersion = 'canonical-match-v1';
// Preserve accents and apostrophes; only case, Unicode composition and whitespace are neutral here.
export const normalize = (s: string) =>
  s.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
export function evaluate(
  activity: Activity,
  response: string,
): { judgment: Judgment; explanation: string } {
  const value = normalize(response);
  if (!value)
    return {
      judgment: 'no-opportunity',
      explanation: 'No hay respuesta para observar este objetivo.',
    };
  const c = activity.criterion;
  if (c.accepted.some((a) => normalize(a) === value))
    return { judgment: 'correct', explanation: activity.explanation };
  const knownWrong = c.rejected.some((a) => normalize(a) === value);
  const inClosedScope =
    c.exhaustive &&
    (activity.format !== 'selection' ||
      activity.options.some((a) => normalize(a) === value));
  return knownWrong || inClosedScope
    ? { judgment: 'verifiable-error', explanation: activity.explanation }
    : {
        judgment: 'not-evaluable',
        explanation:
          'La respuesta queda fuera de las variantes que este criterio puede comprobar. No se registra como error. Referencia: ' +
          activity.explanation,
      };
}

export const canonicalExerciseEngine: ExerciseEngine = {
  async evaluate(activity, response) {
    return [
      {
        ...evaluate(activity, response),
        opportunityId: activity.id + ':target',
        conceptId: activity.conceptId,
        criterionVersion: activity.criterion.version,
      },
    ];
  },
};
