import { type Concept, type Topic } from './catalog';
import type { LanguagePack, VocabularyEntry } from './model';
import { italianCurriculum } from './italian-curriculum';
import { theories } from './theory';
import { loadLanguagePack } from './loader';
import type { Activity } from '../../shared/learning';
export const fixtureVersion = 'it-A1-candidate-3';
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
// Explicit suspected spelling variants; never accepted answers.
fixtureActivities[2] = {
  ...fixtureActivities[2],
  prompt: 'Scrivi il pronome: «nosotros / nosotras» in italiano.',
  version: '2',
  criterion: {
    ...fixtureActivities[2].criterion,
    version: '2',
    typos: ['noe'],
  },
};
for (const item of fixtureActivities) {
  item.version = '2';
  item.task = {
    skill: item.format === 'selection' ? 'recognition' : 'retrieval',
    context: 'persona y concordancia',
    facets: ['persona', 'numero'],
    opportunityId: item.id + ':target',
    scaffolding: item.options.length ? 'visible-options' : 'none',
    matchingPrompts: [],
  };
}
export const engineFixtures: Activity[] = [
  {
    format: 'ordering',
    family: 'F7',
    skill: 'controlled-production',
    dimension: 'contextual-use',
    prompt: 'Ordina le parole: «nosotros somos».',
    options: ['siamo', 'noi'],
    accepted: ['noi siamo'],
    rejected: ['siamo noi'],
    hint: 'Comienza por el pronombre noi.',
    explanation: 'Para esta afirmación con sujeto explícito: noi siamo.',
  },
  {
    format: 'transformation',
    family: 'F3',
    skill: 'transformation',
    dimension: 'retrieval',
    prompt: 'Trasforma «io sono»: usa noi e il verbo essere.',
    options: [],
    accepted: ['noi siamo'],
    rejected: ['noi sono', 'noi sei'],
    hint: 'Cambia también la forma verbal.',
    explanation: 'El cambio de io a noi requiere sono → siamo.',
  },
  {
    format: 'error-detection',
    family: 'F1',
    skill: 'discrimination',
    dimension: 'discrimination',
    prompt: 'Trova l’errore: «noi sono».',
    options: ['noi', 'sono', 'nessun errore'],
    accepted: ['sono'],
    rejected: ['noi', 'nessun errore'],
    hint: 'Comprueba la concordancia del verbo.',
    explanation: 'Noi necesita siamo. Sono no concuerda con noi.',
  },
  {
    format: 'error-correction',
    family: 'F3',
    skill: 'transformation',
    dimension: 'retrieval',
    prompt: 'Correggi «noi sono». Mantieni noi.',
    options: [],
    accepted: ['noi siamo'],
    rejected: ['noi sono', 'noi sei'],
    hint: 'Primera persona plural de essere.',
    explanation: 'Se conserva noi y se cambia sono por siamo.',
  },
  {
    format: 'translation',
    family: 'F4',
    skill: 'controlled-production',
    dimension: 'contextual-use',
    prompt: 'Traduci «nosotros somos». Scrivi anche il pronome.',
    options: [],
    accepted: ['noi siamo'],
    rejected: ['noi sono', 'noi sei'],
    hint: 'Nosotros corresponde a noi.',
    explanation:
      'Con pronombre explícito, nosotros somos se expresa noi siamo.',
  },
  {
    format: 'matching',
    family: 'F7',
    skill: 'recognition',
    dimension: 'comprehension',
    prompt: 'Abbina il pronome alla forma di essere.',
    options: ['siamo', 'sono', 'sei'],
    accepted: ['[1,2,0]'],
    rejected: ['[0,1,2]'],
    hint: 'Io sono, tu sei, noi siamo.',
    explanation: 'Las parejas son io → sono, tu → sei, noi → siamo.',
  },
  {
    format: 'controlled-production',
    family: 'F4',
    skill: 'controlled-production',
    dimension: 'contextual-use',
    prompt:
      'Qualcuno ti cerca: «Sei tu?». Conferma con essere e il pronome io.',
    options: [],
    accepted: ['sono io', 'sì, sono io', 'sì sono io'],
    rejected: ['sei io', 'siamo io'],
    hint: 'Habla en primera persona singular.',
    explanation:
      'Para confirmar que eres tú: sono io. Sono concuerda con io; también puedes comenzar con sì.',
  },
  {
    format: 'error-detection',
    family: 'F1',
    skill: 'discrimination',
    dimension: 'discrimination',
    prompt: 'Trova l’errore: «noi siamo».',
    options: ['noi', 'siamo', 'nessun errore'],
    accepted: ['nessun errore'],
    rejected: ['noi', 'siamo'],
    hint: 'También puede ser una frase correcta.',
    explanation: 'No hay error: noi concuerda con siamo.',
  },
].map((item, index) => ({
  id: `it-a1-c04-01-engine-${index}`,
  version: '1',
  family: item.family as Activity['family'],
  format: item.format as Activity['format'],
  conceptId: 'it-a1-c04-01',
  conceptVersion: '1',
  dimension: item.dimension as Activity['dimension'],
  prompt: item.prompt,
  options: item.options,
  hint: item.hint,
  explanation: item.explanation,
  criterion: {
    version: '1',
    canonVersion: fixtureVersion,
    accepted: item.accepted,
    rejected: item.rejected,
    exhaustive: ['ordering', 'matching', 'error-detection'].includes(
      item.format,
    ),
  },
  task: {
    skill: item.skill as NonNullable<Activity['task']>['skill'],
    context: 'persona y concordancia de essere; validación técnica',
    facets: ['persona', 'numero'],
    opportunityId: `it-a1-c04-01-engine-${index}:target`,
    scaffolding: item.options.length
      ? ('visible-options' as const)
      : ('none' as const),
    matchingPrompts: item.format === 'matching' ? ['io', 'tu', 'noi'] : [],
  },
  status: 'candidate' as const,
  provenance,
}));

const vocabulary: VocabularyEntry[] = [
  ...[
    ['io', 'yo'],
    ['tu', 'tú'],
    ['noi', 'nosotros / nosotras'],
  ].map(([lemma, gloss]) => ({
    id: 'it-' + lemma,
    version: '1',
    language: 'it',
    supportLanguage: 'es',
    lemma,
    displayForm: lemma,
    gloss,
    partOfSpeech: 'pronoun',
    number: lemma === 'noi' ? 'plural' : 'singular',
    forms: [],
    tags: ['personas'],
    level: 'A1',
    conceptIds: ['it-a1-c03-01'],
    topicIds: ['it-a1-t03'],
    examples: [],
    status: 'candidate' as const,
    provenance,
  })),
  {
    id: 'it-essere',
    version: '1',
    language: 'it',
    supportLanguage: 'es',
    lemma: 'essere',
    displayForm: 'essere',
    gloss: 'ser / estar (según construcción)',
    partOfSpeech: 'verb',
    forms: [
      {
        key: 'io',
        text: 'sono',
        features: { person: '1', number: 'singular', tense: 'present' },
        irregular: true,
      },
      {
        key: 'tu',
        text: 'sei',
        features: { person: '2', number: 'singular', tense: 'present' },
        irregular: true,
      },
      {
        key: 'noi',
        text: 'siamo',
        features: { person: '1', number: 'plural', tense: 'present' },
        irregular: true,
      },
    ],
    tags: ['identidad'],
    level: 'A1',
    conceptIds: ['it-a1-c04-01'],
    topicIds: ['it-a1-t04'],
    examples: [{ target: 'Io sono Ana.', support: 'Yo soy Ana.' }],
    status: 'candidate',
    provenance,
  },
];
export const italianPack: LanguagePack = {
  id: 'it-A1',
  version: fixtureVersion,
  targetLanguage: 'it',
  supportLanguage: 'es',
  status: 'candidate',
  provenance,
  curriculum: italianCurriculum,
  topics,
  concepts: concepts.map((c) => ({
    ...c,
    targetLanguage: 'it',
    supportLanguage: 'es',
    cefr: 'A1',
    facets: ['persona', 'numero'],
    compatibleFamilies: ['F1', 'F2', 'F3', 'F4', 'F7'],
    coverage: 'partial',
  })),
  relations: [
    {
      from: 'it-a1-c04-01',
      to: 'it-a1-c03-01',
      type: 'prerequisite',
      strength: 'recommended',
      reason:
        'Reconocer la persona orienta la elección verbal; no bloquea la práctica.',
    },
  ],
  theories,
  vocabulary,
  templates: [
    {
      id: 'it-essere-present-cloze',
      version: '1',
      status: 'candidate',
      provenance,
      family: 'F2',
      format: 'cloze',
      concept: { id: 'it-a1-c04-01', version: '1' },
      objective:
        'Recuperar una forma canónica de essere para el sujeto indicado.',
      constraints: [
        'Solo variantes expresamente creadas; sin permutar sujetos ni respuestas.',
        'La versión canónica y el vocabulario deben existir.',
      ],
      variants: [
        {
          key: 'tu',
          answerFrom: { entryId: 'it-essere', formKey: 'tu' },
          source: { id: 'it-a1-c04-01-sei', version: '2' },
          vocabulary: [
            { id: 'it-tu', version: '1' },
            { id: 'it-essere', version: '1' },
          ],
        },
      ],
    },
  ],
  canonicalActivities: [...fixtureActivities, ...engineFixtures].map((a) => ({
    ...a,
    trace: {
      kind: 'canonical',
      packId: 'it-A1',
      packVersion: fixtureVersion,
      curriculumId: italianCurriculum.id,
      curriculumVersion: italianCurriculum.version,
      sourceId: a.id,
      sourceVersion: a.version,
    },
  })),
};
export function validationCatalog(allowCandidates = false) {
  return loadLanguagePack(italianPack, allowCandidates).repository;
}
