import { italian } from '../content/language-packs';
// Interaction follows the target language; explanations follow the support language.
// Future packs supply their own copy without changing the learning engine.
export const language = {
  targetLanguage: italian.targetLanguage,
  supportLanguage: italian.explanationLanguage,
};
export const copy = {
  home: 'Home',
  practice: 'Pratica',
  library: 'Biblioteca',
  progress: 'Progressi',
  start: 'Inizia la pratica',
  theory: 'Rivedi la teoria',
  check: 'Controlla',
  next: 'Continua',
  retry: 'Riprova',
  hint: 'Mostra un aiuto',
  finish: 'Termina la sessione',
  summary: 'Riepilogo della sessione',
  saved: 'Pratica salvata su questo dispositivo',
  correct: 'Corretto!',
  error: 'Da rivedere',
  unknown: 'Da verificare',
  empty: 'Nessuna risposta',
};

// Presentation-only translations for the unchanged v1 task instructions.
// Answer criteria and stored activity snapshots remain intact.
const instructions: Record<string, string> = {
  'it-a1-c03-01-io': 'Scegli il pronome: «yo» in italiano è…',
  'it-a1-c03-01-tu': 'Completa: ___ = tú (una persona, trato informal).',
  'it-a1-c03-01-noi': 'Scrivi il pronome: «nosotros / nosotras» in italiano.',
  'it-a1-c04-01-sono': 'Scegli la forma di essere: Io ___.',
  'it-a1-c04-01-sei': 'Completa con essere: Tu ___.',
  'it-a1-c04-01-siamo':
    'Scrivi «nosotros somos» in italiano. Usa il pronome e il verbo essere.',
};
export function instruction(activity: {
  id: string;
  version: string;
  prompt: string;
}) {
  return activity.version === '1'
    ? (instructions[activity.id] ?? activity.prompt)
    : activity.prompt;
}
