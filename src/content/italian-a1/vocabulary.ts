import type { VocabularyEntry } from '../model';
import { italianPack as fixture } from '../validation-fixture';
import { type Lesson, provenance, sources } from './authoring';
import { essereForms } from './c04';
import { avereForms } from './c05';
// Pedagogical senses and inflections for this lot only. Associations come from authored lessons.
const words: [string, string, string, string, string?][] = [
  ['chiave', 'chiave', 'llave', 'noun', 'feminine'],
  ['amico', 'amico', 'amigo / amiga', 'noun', 'masculine'],
  ['gelato', 'gelato', 'helado', 'noun', 'masculine'],
  ['spaghetti', 'spaghetti', 'espaguetis', 'noun', 'masculine'],
  ['ghiaccio', 'ghiaccio', 'hielo', 'noun', 'masculine'],
  ['pesce', 'pesce', 'pescado / pez', 'noun', 'masculine'],
  ['scimmia', 'scimmia', 'mono (animal)', 'noun', 'feminine'],
  ['bagno', 'bagno', 'baño', 'noun', 'masculine'],
  ['famiglia', 'famiglia', 'familia', 'noun', 'feminine'],
  ['biglietto', 'biglietto', 'billete', 'noun', 'masculine'],
  ['casa', 'casa', 'casa', 'noun', 'feminine'],
  ['gatto', 'gatto', 'gato', 'noun', 'masculine'],
  ['citta', 'città', 'ciudad', 'noun', 'feminine'],
  ['caffe', 'caffè', 'café', 'noun', 'masculine'],
  ['perche', 'perché', 'por qué / porque', 'function-word'],
  ['si', 'sì', 'sí (afirmación)', 'adverb'],
  ['e', 'e', 'y', 'conjunction'],
  ['pala', 'pala', 'pala', 'noun', 'feminine'],
  ['palla', 'palla', 'pelota', 'noun', 'feminine'],
  ['pena', 'pena', 'pena', 'noun', 'feminine'],
  ['penna', 'penna', 'bolígrafo / pluma para escribir', 'noun', 'feminine'],
  ['letto', 'letto', 'cama', 'noun', 'masculine'],
  ['ciao', 'ciao', 'hola / adiós informal', 'formula'],
  ['buongiorno', 'buongiorno', 'buenos días', 'formula'],
  ['buonasera', 'buonasera', 'buenas tardes / noches al saludar', 'formula'],
  ['arrivederci', 'arrivederci', 'adiós / hasta luego', 'formula'],
  [
    'buonanotte',
    'buonanotte',
    'buenas noches al despedirse para dormir',
    'formula',
  ],
  ['a-presto', 'a presto', 'hasta pronto', 'formula'],
  ['grazie', 'grazie', 'gracias', 'formula'],
  ['prego', 'prego', 'de nada, como respuesta a gracias', 'formula'],
  ['per-favore', 'per favore', 'por favor', 'formula'],
  ['scusa', 'scusa', 'disculpa, informal', 'formula'],
  ['scusi', 'scusi', 'disculpe, cortés', 'formula'],
  ['non-capisco', 'non capisco', 'no entiendo', 'formula'],
  ['puo-ripetere', 'può ripetere?', '¿puede repetir?, cortés', 'formula'],
  ['puoi-ripetere', 'puoi ripetere?', '¿puedes repetir?, informal', 'formula'],
  ['piu-lentamente', 'più lentamente', 'más despacio', 'formula'],
  ['non-lo-so', 'non lo so', 'no lo sé', 'formula'],
  ['lui', 'lui', 'él', 'pronoun'],
  ['lei', 'lei', 'ella; usted en trato cortés', 'pronoun'],
  ['voi', 'voi', 'vosotros / vosotras / ustedes', 'pronoun'],
  ['loro', 'loro', 'ellos / ellas', 'pronoun'],
  ['qui', 'qui', 'aquí', 'adverb'],
  ['insegnante', 'insegnante', 'profesor / profesora', 'noun'],
  ['alto', 'alto', 'alto (estatura)', 'adjective'],
  ['di', 'di', 'de, en la construcción de origen enseñada', 'preposition'],
  ['roma', 'Roma', 'Roma', 'proper-noun'],
  ['madrid', 'Madrid', 'Madrid', 'proper-noun'],
  [
    'italiano',
    'italiano',
    'italiano: nacionalidad; lengua en parlare/studiare italiano',
    'adjective',
  ],
  [
    'spagnolo',
    'spagnolo',
    'español: nacionalidad; lengua en parlare spagnolo',
    'adjective',
  ],
  ['a', 'a', 'en, dentro de a Roma / a casa', 'preposition'],
  ['in', 'in', 'en, dentro de in hotel', 'preposition'],
  ['hotel', 'hotel', 'hotel', 'noun', 'masculine'],
  ['stanco', 'stanco', 'cansado', 'adjective'],
  ['contento', 'contento', 'contento', 'adjective'],
  ['pronto', 'pronto', 'listo, preparado', 'adjective'],
  ['sto-bene', 'sto bene', 'estoy bien', 'formula'],
  [
    'avere',
    'avere',
    'tener; auxiliar del passato prossimo en las construcciones enseñadas',
    'verb',
  ],
  ['due', 'due', 'dos', 'numeral'],
  ['anno', 'anno', 'año', 'noun', 'masculine'],
  ['venti', 'venti', 'veinte', 'numeral'],
  ['trenta', 'trenta', 'treinta', 'numeral'],
  ['quaranta', 'quaranta', 'cuarenta', 'numeral'],
  ['quanti-anni', 'quanti anni hai?', '¿cuántos años tienes?', 'formula'],
  ['fame', 'fame', 'hambre', 'noun', 'feminine'],
  ['sete', 'sete', 'sed', 'noun', 'feminine'],
  ['sonno', 'sonno', 'sueño, ganas de dormir', 'noun', 'masculine'],
  ['caldo', 'caldo', 'calor, en avere caldo', 'noun', 'masculine'],
  ['freddo', 'freddo', 'frío, en avere freddo', 'noun', 'masculine'],
  ['paura', 'paura', 'miedo', 'noun', 'feminine'],
];
const inflections: Record<string, [string, string, Record<string, string>][]> =
  {
    chiave: [['plural', 'chiavi', { number: 'plural' }]],
    amico: [
      ['feminine', 'amica', { gender: 'feminine', number: 'singular' }],
      ['plural', 'amici', { gender: 'masculine', number: 'plural' }],
      ['feminine-plural', 'amiche', { gender: 'feminine', number: 'plural' }],
    ],
    biglietto: [['plural', 'biglietti', { number: 'plural' }]],
    penna: [['plural', 'penne', { number: 'plural' }]],
    anno: [['plural', 'anni', { number: 'plural' }]],
    alto: [['feminine', 'alta', { gender: 'feminine', number: 'singular' }]],
    italiano: [
      ['feminine', 'italiana', { gender: 'feminine', number: 'singular' }],
    ],
    spagnolo: [
      ['feminine', 'spagnola', { gender: 'feminine', number: 'singular' }],
    ],
    stanco: [
      ['feminine', 'stanca', { gender: 'feminine', number: 'singular' }],
    ],
    contento: [
      ['feminine', 'contenta', { gender: 'feminine', number: 'singular' }],
    ],
    pronto: [
      ['feminine', 'pronta', { gender: 'feminine', number: 'singular' }],
      ['plural', 'pronti', { gender: 'masculine', number: 'plural' }],
      ['feminine-plural', 'pronte', { gender: 'feminine', number: 'plural' }],
    ],
  };
function paradigm(rows: [string, string][]) {
  return rows.map(([phrase], index) => ({
    key: ['io', 'tu', 'lui-lei', 'noi', 'voi', 'loro'][index],
    text: phrase.split(' ').at(-1)!,
    features: {
      person: String((index % 3) + 1),
      number: index < 3 ? 'singular' : 'plural',
      tense: 'present',
    },
    irregular: true,
  }));
}
export function vocabularyFor(lessons: Lesson[]): VocabularyEntry[] {
  const entries: VocabularyEntry[] = [
    ...fixture.vocabulary.map((v) => ({
      ...structuredClone(v),
      version: '2',
      ...(v.id === 'it-essere' ? { forms: paradigm(essereForms) } : {}),
    })),
    ...words.map(
      ([key, lemma, gloss, partOfSpeech, gender]): VocabularyEntry => ({
        id: 'it-' + key,
        version: ['italiano', 'spagnolo', 'avere'].includes(key) ? '2' : '1',
        language: 'it',
        supportLanguage: 'es',
        lemma,
        displayForm: lemma,
        gloss,
        partOfSpeech,
        ...(gender ? { gender } : {}),
        ...(partOfSpeech === 'noun'
          ? { number: key === 'spaghetti' ? 'plural' : 'singular' }
          : {}),
        forms:
          key === 'avere'
            ? paradigm(avereForms)
            : (inflections[key] ?? []).map(([key, text, features]) => ({
                key,
                text,
                features,
                irregular: false,
              })),
        tags: [partOfSpeech],
        level: 'A1',
        conceptIds: [],
        topicIds: [],
        examples: [],
        status: 'candidate',
        provenance,
      }),
    ),
  ];
  for (const entry of entries) {
    const associated = lessons.filter((l) =>
      l.vocabularyIds.includes(entry.id),
    );
    entry.conceptIds = associated.map((l) => 'it-a1-c' + l.code);
    entry.topicIds = [
      ...new Set(associated.map((l) => 'it-a1-t' + l.code.slice(0, 2))),
    ];
    entry.tags = [
      ...new Set([
        ...entry.tags,
        ...associated.map((l) => 'C' + l.code.slice(0, 2)),
      ]),
    ];
    if (entry.id === 'it-avere') entry.provenance += ' ' + sources.avere;
  }
  return entries;
}
