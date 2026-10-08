import { ContentRepository, type Concept, type Topic } from './catalog';
import type { Activity } from '../../shared/learning';
export const fixtureVersion = 'it-A1-candidate-1';
const provenance =
  'Candidato creado por R2 para validación técnica; sin revisión editorial independiente. Fuentes de alcance: Research 02 C03/C04 y A1_COVERAGE_MATRIX C03-01/C04-01.';
const topics: Topic[] = [
  {
    id: 'it-a1-t03',
    packId: 'it-A1',
    title: 'Personas y sujeto',
    version: '1',
  },
  {
    id: 'it-a1-t04',
    packId: 'it-A1',
    title: 'Essere en presente',
    version: '1',
  },
];
const concepts: Concept[] = [
  {
    id: 'it-a1-c03-01',
    topicId: 'it-a1-t03',
    version: '1',
    title: 'Pronombres sujeto',
    objective: 'Identificar y expresar persona y número del referente.',
    scope: 'Fixture: io, tu y noi.',
    exclusions:
      'No cubre todas las facetas, sujetos nominales ni omisión del sujeto.',
    dimensions: ['comprehension', 'retrieval'],
    status: 'candidate',
    provenance,
  },
  {
    id: 'it-a1-c04-01',
    topicId: 'it-a1-t04',
    version: '1',
    title: 'Presente de essere',
    objective: 'Recuperar formas de essere y concordarlas con el sujeto.',
    scope: 'Fixture: io sono, tu sei y noi siamo.',
    exclusions:
      'No cubre todo el paradigma ni demuestra uso contextual o retención.',
    dimensions: ['comprehension', 'retrieval'],
    status: 'candidate',
    provenance,
  },
];
function activity(
  concept: number,
  suffix: string,
  format: Activity['format'],
  prompt: string,
  accepted: string[],
  rejected: string[],
  hint: string,
  explanation: string,
  options: string[] = [],
): Activity {
  return {
    id: concepts[concept].id + '-' + suffix,
    version: '1',
    family: format === 'selection' ? 'F1' : 'F2',
    format,
    conceptId: concepts[concept].id,
    conceptVersion: '1',
    dimension: format === 'selection' ? 'comprehension' : 'retrieval',
    prompt,
    options,
    hint,
    explanation,
    criterion: {
      version: '1',
      canonVersion: fixtureVersion,
      accepted,
      rejected,
      exhaustive: format === 'selection',
    },
    status: 'candidate',
    provenance,
  };
}
export const fixtureActivities: Activity[] = [
  activity(
    0,
    'io',
    'selection',
    '¿Qué pronombre italiano se refiere a la persona que habla («yo»)?',
    ['io'],
    ['tu', 'noi'],
    'Es la primera persona del singular.',
    'Io significa «yo». Tu se refiere a quien escucha y noi incluye a quien habla y otras personas.',
    ['io', 'tu', 'noi'],
  ),
  activity(
    0,
    'tu',
    'cloze',
    'Completa con el pronombre sujeto: ___ = tú (una persona, trato informal).',
    ['tu'],
    ['io', 'noi', 'voi', 'lui', 'lei', 'loro'],
    'Tiene dos letras y comienza por t.',
    'Tu corresponde a «tú» en el trato informal singular.',
  ),
  activity(
    0,
    'noi',
    'short',
    'Escribe el pronombre sujeto italiano que significa «nosotros/nosotras».',
    ['noi'],
    ['io', 'tu', 'voi', 'lui', 'lei', 'loro'],
    'La primera persona del plural empieza por n.',
    'Noi incluye a la persona que habla y al menos otra persona, sin distinción de género.',
  ),
  activity(
    1,
    'sono',
    'selection',
    'Selecciona la forma de essere que concuerda con io: Io ___.',
    ['sono'],
    ['sei', 'siamo'],
    'Primera persona singular: io sono.',
    'Io sono es la primera persona singular del presente de essere.',
    ['sono', 'sei', 'siamo'],
  ),
  activity(
    1,
    'sei',
    'cloze',
    'Completa con essere en presente: Tu ___.',
    ['sei'],
    ['sono', 'siamo', 'siete', 'è', 'e', 'essere'],
    'La forma para tu comienza por s y tiene tres letras.',
    'Tu sei es la segunda persona singular del presente de essere.',
  ),
  activity(
    1,
    'siamo',
    'short',
    'Escribe en italiano «nosotros somos», usando pronombre sujeto y essere en presente.',
    ['noi siamo'],
    ['noi sono', 'noi sei', 'noi siete', 'noi è', 'noi e'],
    'Usa noi y la forma siamo.',
    'Noi siamo concuerda en primera persona plural. La consigna pide el pronombre; este ítem no evalúa la omisión del sujeto.',
  ),
];
export function validationCatalog(allowCandidates = false) {
  return new ContentRepository(
    'it-A1',
    fixtureVersion,
    topics,
    concepts,
    [
      {
        from: 'it-a1-c04-01',
        to: 'it-a1-c03-01',
        type: 'prerequisite',
        reason:
          'Reconocer la persona del sujeto permite elegir la forma verbal; orienta, no bloquea la práctica.',
      },
    ],
    fixtureActivities,
    allowCandidates,
  );
}
export const catalog = validationCatalog(
  import.meta.env.DEV ||
    import.meta.env.VITE_ENABLE_CANDIDATE_CONTENT === 'true',
);
