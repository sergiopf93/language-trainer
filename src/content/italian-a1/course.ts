import { applyReviewBatch } from '../editorial-review';
import { editorialC01C10 } from './editorial-c01-c10';
import { editorialC11C20 } from './editorial-c11-c20';
import type { LanguagePack, ExerciseTemplate } from '../model';
import type { Activity } from '../../../shared/learning';
import type { ConceptRelation } from '../catalog';
import { italianPack as fixture } from '../validation-fixture';
import { italianCurriculum } from '../italian-curriculum';
import { batchVersion, materialize, provenance } from './authoring';
import { c01 } from './c01';
import { c02 } from './c02';
import { c03 } from './c03';
import { c04 } from './c04';
import { c05 } from './c05';
import { c06 } from './c06';
import { c07 } from './c07';
import { c08 } from './c08';
import { c09 } from './c09';
import { c10 } from './c10';
import { c11 } from './c11';
import { c12 } from './c12';
import { c13 } from './c13';
import { c14 } from './c14';
import { c15 } from './c15';
import { c16 } from './c16';
import { c17 } from './c17';
import { c18 } from './c18';
import { c19 } from './c19';
import { c20 } from './c20';
import { c21 } from './c21';
import { c22 } from './c22';
import { c23 } from './c23';
import { c24 } from './c24';
import { c25 } from './c25';
import { c26 } from './c26';
import { c27 } from './c27';
import { c28 } from './c28';
import { c29 } from './c29';
import { c30 } from './c30';
import { c31 } from './c31';
import { c32 } from './c32';
import { c33 } from './c33';
import { c34 } from './c34';
import { extendC26C34Vocabulary } from './vocabulary-c26-c34';
import { c26C34Relations } from './relations-c26-c34';
import { extendC18C25Vocabulary } from './vocabulary-c18-c25';
import { c18C25Relations } from './relations-c18-c25';
import { extendC11C17Vocabulary } from './vocabulary-c11-c17';
import { c11C17Relations } from './relations-c11-c17';
import { extendVocabulary } from './vocabulary-c06-c10';
import { vocabularyFor } from './vocabulary';
export const lessons = [
  ...c01,
  ...c02,
  ...c03,
  ...c04,
  ...c05,
  ...c06,
  ...c07,
  ...c08,
  ...c09,
  ...c10,
  ...c11,
  ...c12,
  ...c13,
  ...c14,
  ...c15,
  ...c16,
  ...c17,
  ...c18,
  ...c19,
  ...c20,
  ...c21,
  ...c22,
  ...c23,
  ...c24,
  ...c25,
  ...c26,
  ...c27,
  ...c28,
  ...c29,
  ...c30,
  ...c31,
  ...c32,
  ...c33,
  ...c34,
];
const content = lessons.map(materialize);
const vocabulary = extendC26C34Vocabulary(
  extendC18C25Vocabulary(
    extendC11C17Vocabulary(
      extendVocabulary(vocabularyFor(lessons), lessons),
      lessons,
    ),
    lessons,
  ),
  lessons,
);
const relations: ConceptRelation[] = [
  ...c11C17Relations,
  ...c18C25Relations,
  ...c26C34Relations,
];
function connect(
  from: string,
  to: string,
  type: ConceptRelation['type'],
  reason: string,
) {
  relations.push({
    from: 'it-a1-c' + from,
    to: 'it-a1-c' + to,
    type,
    reason,
    ...(type === 'prerequisite' ? { strength: 'recommended' as const } : {}),
  });
}
connect(
  '01-02',
  '01-01',
  'related',
  'Acentos y grupos de letras aportan aspectos distintos de la escritura.',
);
connect(
  '01-03',
  '01-01',
  'reinforces',
  'Las palabras compartidas permiten recuperar grafías en otro contraste.',
);
connect(
  '02-02',
  '02-01',
  'related',
  'Saludos y cortesía permiten abrir y mantener el intercambio.',
);
connect(
  '02-03',
  '02-02',
  'reinforces',
  'La petición de repetición reutiliza scusi y per favore.',
);
connect(
  '03-01',
  '02-01',
  'related',
  'Los interlocutores del saludo dan sentido a yo/tú y nosotros/vosotros.',
);
connect(
  '03-02',
  '03-01',
  'prerequisite',
  'Reconocer el referente ayuda a decidir si puede omitirse.',
);
connect(
  '04-01',
  '03-01',
  'prerequisite',
  'Persona y número orientan la forma verbal.',
);
connect(
  '03-02',
  '04-01',
  'related',
  'La forma verbal y el contexto ayudan a recuperar el sujeto.',
);
for (const code of ['04-02', '04-03', '04-04', '04-05'])
  connect(
    code,
    '04-01',
    'prerequisite',
    'El uso reutiliza formas de essere; la preparación no bloquea la ficha.',
  );
connect(
  '04-03',
  '04-04',
  'contrast',
  'Origen con di frente a ubicación con a o expresiones de lugar.',
);
connect(
  '05-01',
  '03-01',
  'prerequisite',
  'Avere concuerda con el sujeto, no con el objeto.',
);
connect(
  '05-01',
  '04-01',
  'related',
  'Dos paradigmas irregulares con las mismas personas.',
);
for (const code of ['05-02', '05-03', '05-04'])
  connect(
    code,
    '05-01',
    'prerequisite',
    'El uso requiere recuperar la forma de avere apropiada.',
  );
connect(
  '05-02',
  '04-02',
  'contrast',
  'Tener un objeto no es identificar a una persona.',
);
connect(
  '05-04',
  '04-05',
  'contrast',
  'Avere fame/sonno frente a essere stanco/contento.',
);
connect(
  '05-01',
  '01-01',
  'reinforces',
  'La h de avere se vuelve a observar en palabras con significado.',
);
connect(
  '06-01',
  '04-01',
  'prerequisite',
  'La negación reutiliza las formas de essere.',
);
connect(
  '06-01',
  '05-01',
  'prerequisite',
  'La negación reutiliza las formas de avere.',
);
connect(
  '06-01',
  '02-03',
  'reinforces',
  'Non capisco anticipa la negación aprendida ahora como construcción.',
);
connect(
  '06-02',
  '06-01',
  'prerequisite',
  'Responder negativamente requiere non antes del verbo.',
);
connect(
  '06-02',
  '03-01',
  'reinforces',
  'La respuesta cambia la perspectiva de tu a io.',
);
connect(
  '06-03',
  '06-02',
  'prerequisite',
  'Las preguntas de información amplían las preguntas cerradas.',
);
connect(
  '06-03',
  '05-03',
  'reinforces',
  'Quanti anni hai reutiliza la pregunta de edad.',
);
connect(
  '06-03',
  '04-03',
  'related',
  'Di dove sei pregunta por el origen ya aprendido.',
);
connect(
  '07-01',
  '05-02',
  'related',
  'Los objetos conocidos de posesión permiten recuperar género sin léxico nuevo.',
);
connect(
  '07-02',
  '07-01',
  'prerequisite',
  'Las excepciones y nombres en -e amplían las tendencias -o/-a.',
);
connect(
  '08-01',
  '07-01',
  'prerequisite',
  'Género y terminación ayudan a recuperar la clase nominal.',
);
connect(
  '08-01',
  '07-02',
  'related',
  'Los nombres en -e aportan casos de ambos géneros.',
);
connect(
  '08-02',
  '08-01',
  'contrast',
  'Los invariantes conservan la forma frente al cambio de vocal regular.',
);
connect(
  '08-02',
  '01-02',
  'reinforces',
  'Città y caffè conservan su acento en plural.',
);
connect(
  '09-01',
  '07-01',
  'prerequisite',
  'La elección del artículo requiere el género del nombre.',
);
connect(
  '09-01',
  '07-02',
  'prerequisite',
  'El género léxico evita generalizaciones por la terminación.',
);
connect(
  '09-01',
  '01-01',
  'prerequisite',
  'Los grupos iniciales orientan il/lo/l’.',
);
connect(
  '09-02',
  '09-01',
  'prerequisite',
  'Las series del plural se relacionan con el singular.',
);
connect(
  '09-02',
  '08-01',
  'prerequisite',
  'Los plurales nominales aportan el número del grupo.',
);
connect(
  '09-02',
  '08-02',
  'related',
  'Los artículos ayudan a indicar número con nombres invariantes.',
);
connect(
  '09-03',
  '09-01',
  'prerequisite',
  'El uso contextual reutiliza las formas del determinado.',
);
connect(
  '09-03',
  '05-02',
  'reinforces',
  'La posesión introduce objetos que pueden retomarse.',
);
connect(
  '10-01',
  '07-01',
  'prerequisite',
  'Un/una requieren género del nombre.',
);
connect(
  '10-01',
  '01-01',
  'prerequisite',
  'Vocal y grupos iniciales orientan un/uno/un’.',
);
connect(
  '10-01',
  '09-01',
  'contrast',
  'L’amico contrasta con un amico sin apóstrofo.',
);
connect(
  '10-02',
  '10-01',
  'prerequisite',
  'La introducción de referentes reutiliza las formas del indeterminado.',
);
connect(
  '10-02',
  '09-03',
  'contrast',
  'Introducir un referente frente a retomar uno identificable.',
);
connect(
  '10-02',
  '02-02',
  'reinforces',
  'La petición de café reutiliza per favore.',
);
function courseFixture(source: Activity): Activity {
  const item = structuredClone(source);
  if (item.id === 'it-a1-c04-01-engine-1') {
    item.prompt = 'Trasforma «io sono»: usa tu e il verbo essere.';
    item.criterion.accepted = ['tu sei', 'tu sei.'];
    item.criterion.rejected = ['tu sono', 'tu è'];
    item.hint = 'La segunda persona singular tiene su propia forma.';
    item.explanation = 'Con tu se usa sei: tu sei.';
  } else if (item.id === 'it-a1-c04-01-engine-4') {
    item.prompt =
      'Traduci «ella está aquí». Usa essere e scrivi anche il pronome lei.';
    item.criterion.accepted = ['lei è qui', 'lei è qui.'];
    item.criterion.rejected = ['lei e qui', 'lei sono qui'];
    item.hint = 'Usa la tercera persona singular con acento.';
    item.explanation = 'Lei è qui: è concuerda con lei; qui indica aquí.';
  } else if (item.id === 'it-a1-c04-01-engine-0') {
    item.prompt = 'Ordina le parole: «nosotros somos». Inizia con noi.';
  } else if (item.id === 'it-a1-c04-01-engine-2') {
    item.prompt = 'Trova il verbo che non concorda con noi: «noi sono».';
  } else if (item.id === 'it-a1-c04-01-engine-6') {
    item.prompt =
      'Qualcuno ti cerca: «Sei tu?». Conferma con la formula che termina con io. Puoi aggiungere sì all’inizio.';
    item.criterion.accepted = [
      'sono io',
      'sono io.',
      'sì, sono io',
      'sì, sono io.',
      'sì sono io',
      'sì sono io.',
    ];
  } else if (
    item.id === 'it-a1-c04-01-engine-3' ||
    item.id === 'it-a1-c04-01-siamo'
  ) {
    item.criterion.accepted = ['noi siamo', 'noi siamo.'];
  } else return item;
  item.version =
    item.id === 'it-a1-c04-01-engine-1'
      ? '3'
      : String(Number(source.version) + 1);
  item.criterion.version = item.version;
  item.provenance +=
    ' Variante del curso: auditorías pedagógica/editorial; fixture histórico conservado.';
  return item;
}
const activities = content
  .flatMap(({ concept, activities }) => [
    // Keep the existing authored items and their stable IDs as the opening practice.
    ...fixture.canonicalActivities
      .filter((a) => a.conceptId === concept.id)
      .map((a) => ({ ...courseFixture(a), conceptVersion: concept.version })),
    ...activities,
  ])
  .map((a) => ({
    ...a,
    criterion: { ...a.criterion, canonVersion: batchVersion },
    trace: {
      kind: 'canonical' as const,
      packId: fixture.id,
      packVersion: batchVersion,
      curriculumId: italianCurriculum.id,
      curriculumVersion: italianCurriculum.version,
      sourceId: a.id,
      sourceVersion: a.version,
    },
  }));
// Explicit form-to-item links: each prompt and accepted answer was authored above.
const templates: ExerciseTemplate[] = ['04-01', '05-01'].map((code) => {
  const lemmaId = code === '04-01' ? 'it-essere' : 'it-avere';
  const pairs =
    code === '04-01'
      ? [
          ['tu', 'it-a1-c04-01-sei'],
          ['lui-lei', 'it-a1-c04-01-lei-e'],
          ['voi', 'it-a1-c04-01-voi-siete'],
          ['loro', 'it-a1-c04-01-loro-sono'],
        ]
      : [
          ['tu', 'it-a1-c05-01-tu'],
          ['lui-lei', 'it-a1-c05-01-lei'],
          ['noi', 'it-a1-c05-01-noi'],
          ['voi', 'it-a1-c05-01-voi'],
          ['loro', 'it-a1-c05-01-loro'],
        ];
  return {
    id: code === '04-01' ? 'it-essere-present-cloze' : 'it-avere-present-cloze',
    version: '2',
    status: 'candidate',
    provenance,
    family: 'F2',
    format: 'cloze',
    concept: { id: 'it-a1-c' + code, version: code === '04-01' ? '2' : '1' },
    objective:
      'Recuperar formas del paradigma en los sujetos y contextos explícitos.',
    constraints: [
      'Solo fuentes versionadas y sujetos escritos en cada consigna.',
      'Respuesta única idéntica a la forma léxica canónica; sin permutación de contextos.',
    ],
    variants: pairs.map(([key, id]) => ({
      key,
      source: { id, version: activities.find((a) => a.id === id)!.version },
      vocabulary: [
        {
          id: lemmaId,
          version: vocabulary.find((v) => v.id === lemmaId)!.version,
        },
      ],
      answerFrom: { entryId: lemmaId, formKey: key },
    })),
  };
});
export const authoredItalianCourse: LanguagePack = {
  id: fixture.id,
  version: batchVersion,
  targetLanguage: 'it',
  supportLanguage: 'es',
  status: 'candidate',
  provenance:
    provenance +
    ' Ampliación candidate C06–C34: Research 02 y A1_COVERAGE_MATRIX; revisión editorial pendiente.',
  curriculum: italianCurriculum,
  topics: italianCurriculum.levels[0].units.slice(0, 34).map((unit) => ({
    id: unit.topicId,
    packId: fixture.id,
    title: unit.title,
    version: '2',
  })),
  concepts: content.map(({ concept }) => ({
    ...concept,
    compatibleFamilies: [
      ...new Set(
        activities
          .filter((a) => a.conceptId === concept.id)
          .map((a) => a.family),
      ),
    ],
    dimensions: [
      ...new Set(
        activities
          .filter((a) => a.conceptId === concept.id)
          .map((a) => a.dimension),
      ),
    ],
  })),
  relations,
  theories: Object.fromEntries(content.map((c) => [c.concept.id, c.theory])),
  vocabulary,
  templates,
  canonicalActivities: activities,
};

// Preserve earlier review metadata when the batches share vocabulary.
export const italianCourse = applyReviewBatch(
  applyReviewBatch(authoredItalianCourse, editorialC01C10),
  editorialC11C20,
);
