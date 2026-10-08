import type { Editorial } from './model';
export interface Theory extends Editorial {
  id: string;
  conceptId: string;
  conceptVersion: string;
  targetLanguage: string;
  supportLanguage: string;
  exceptions: string[];
  contrasts: { conceptId: string; explanation: string }[];
  vocabularyIds: string[];
  version: string;
  title: string;
  goal: string;
  introduction: string;
  rules: string[];
  forms: [string, string][];
  examples: [string, string][];
  frequentErrors: string[];
  usageNotes: string[];
}
// Candidate study material for the existing validation subset only.
export const theories: Record<string, Theory> = {
  'it-a1-c03-01': {
    id: 'it-a1-theory-c03',
    conceptId: 'it-a1-c03-01',
    conceptVersion: '1',
    targetLanguage: 'it',
    supportLanguage: 'es',
    status: 'candidate',
    provenance: 'Research 02 C03; muestra técnica sin revisión editorial.',
    exceptions: [],
    contrasts: [],
    vocabularyIds: ['it-io', 'it-tu', 'it-noi'],
    version: 'theory-c03-1',
    title: 'Io, tu, noi',
    goal: 'Aprende a decir yo, tú y nosotros en italiano.',
    introduction:
      'Los pronombres sujeto indican quién habla, a quién se habla o de quién se habla. Aquí practicamos tres: io, tu y noi.',
    rules: [
      'Io se refiere a la persona que habla. Tu se refiere a una persona a la que hablamos de manera informal. Noi incluye a quien habla y a una o más personas.',
    ],
    forms: [
      ['io', 'yo · una persona'],
      ['tu', 'tú · una persona'],
      ['noi', 'nosotros / nosotras · varias personas'],
    ],
    examples: [
      ['Io sono Sergio.', 'Yo soy Sergio.'],
      ['Tu sei Ana.', 'Tú eres Ana.'],
      ['Noi siamo Ana e Sergio.', 'Nosotros somos Ana y Sergio.'],
    ],
    frequentErrors: [
      'Noi incluye a quien habla: no equivale a «ellos». No cambia según el género del grupo.',
    ],
    usageNotes: [
      'En italiano el sujeto puede omitirse si queda claro. En estas actividades lo pedimos expresamente para practicar las formas. Otros pronombres y la omisión se estudiarán más adelante.',
    ],
  },
  'it-a1-c04-01': {
    id: 'it-a1-theory-c04',
    conceptId: 'it-a1-c04-01',
    conceptVersion: '1',
    targetLanguage: 'it',
    supportLanguage: 'es',
    status: 'candidate',
    provenance: 'Research 02 C04; muestra técnica sin revisión editorial.',
    exceptions: [],
    contrasts: [],
    vocabularyIds: ['it-essere'],
    version: 'theory-c04-1',
    title: 'Io sono, tu sei, noi siamo',
    goal: 'Aprende a combinar io, tu y noi con la forma correcta de essere.',
    introduction:
      'Essere permite, entre otros usos, decir quién eres. Su forma cambia según el sujeto. En esta práctica nos centramos en io, tu y noi.',
    rules: [
      'Elige la forma que corresponde a la persona y al número del sujeto. Essere es irregular: estas formas se aprenden juntas, no añadiendo una terminación a essere.',
    ],
    forms: [
      ['io sono', 'yo soy / estoy'],
      ['tu sei', 'tú eres / estás'],
      ['noi siamo', 'nosotros somos / estamos'],
    ],
    examples: [
      ['Io sono Ana.', 'Yo soy Ana.'],
      ['Tu sei Sergio.', 'Tú eres Sergio.'],
      ['Noi siamo Ana e Sergio.', 'Nosotros somos Ana y Sergio.'],
    ],
    frequentErrors: [
      'Con noi usa siamo: «Noi siamo», no «Noi sono». No traduzcas siempre ser/estar con una única regla: la construcción y el contexto importan.',
    ],
    usageNotes: [
      'Esta ficha cubre las tres formas de la práctica disponible. El resto del paradigma y los distintos usos de essere quedan para el desarrollo curricular.',
    ],
  },
};
