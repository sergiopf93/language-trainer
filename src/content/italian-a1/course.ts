import type { LanguagePack, ExerciseTemplate } from '../model';
import type { ConceptRelation } from '../catalog';
import { italianPack as fixture } from '../validation-fixture';
import { italianCurriculum } from '../italian-curriculum';
import { batchVersion, materialize, provenance } from './authoring';
import { c01 } from './c01';
import { c02 } from './c02';
import { c03 } from './c03';
import { c04 } from './c04';
import { c05 } from './c05';
import { vocabularyFor } from './vocabulary';
export const lessons = [...c01, ...c02, ...c03, ...c04, ...c05];
const content = lessons.map(materialize);
const vocabulary = vocabularyFor(lessons);
const relations: ConceptRelation[] = [];
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
const activities = content
  .flatMap(({ concept, activities }) => [
    // Keep the existing authored items and their stable IDs as the opening practice.
    ...fixture.canonicalActivities
      .filter((a) => a.conceptId === concept.id)
      .map((a) => ({ ...structuredClone(a), conceptVersion: concept.version })),
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
export const italianCourse: LanguagePack = {
  id: fixture.id,
  version: batchVersion,
  targetLanguage: 'it',
  supportLanguage: 'es',
  status: 'candidate',
  provenance,
  curriculum: italianCurriculum,
  topics: italianCurriculum.levels[0].units.slice(0, 5).map((unit) => ({
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
