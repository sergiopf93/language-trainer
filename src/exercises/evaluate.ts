import type { ExerciseEngine } from './contract';
import type { Activity, Judgment } from '../../shared/learning';
import { responseText } from './response';
export const evaluatorVersion = 'canonical-match-v2';
// Preserve accents and apostrophes; only case, Unicode composition and whitespace are neutral here.
export const normalize = (s: string) =>
  s.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
export function evaluate(
  activity: Activity,
  response: string,
): { judgment: Judgment; explanation: string } {
  const decoded = responseText(activity, response);
  if (decoded === null)
    return {
      judgment: 'not-evaluable',
      explanation:
        'Completa todos los elementos sin repetirlos para poder comprobar la respuesta.',
    };
  const value = normalize(decoded);
  if (!value)
    return {
      judgment: 'no-opportunity',
      explanation: 'No hay respuesta para observar este objetivo.',
    };
  const c = activity.criterion;
  if (c.accepted.some((a) => normalize(a) === value))
    return { judgment: 'correct', explanation: activity.explanation };
  const knownWrong = c.rejected.some((a) => normalize(a) === value);
  if (
    !knownWrong &&
    !['selection', 'error-detection', 'ordering', 'matching'].includes(
      activity.format,
    ) &&
    c.typos?.some((a) => normalize(a) === value)
  )
    return {
      judgment: 'typo',
      explanation: `Casi. Has escrito “${response}”. La forma correcta es “${c.accepted[0]}”. Es una posible errata, no un acierto.`,
    };
  const inClosedScope =
    c.exhaustive &&
    (!['selection', 'error-detection'].includes(activity.format) ||
      activity.options.some((a) => normalize(a) === value));
  return knownWrong || inClosedScope
    ? {
        judgment:
          activity.family === 'F5' ? 'verifiable-error' : 'linguistic-error',
        explanation: activity.explanation,
      }
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
        opportunityId: activity.task?.opportunityId ?? activity.id + ':target',
        conceptId: activity.conceptId,
        criterionVersion: activity.criterion.version,
      },
    ];
  },
};
