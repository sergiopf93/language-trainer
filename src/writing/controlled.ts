import type { Activity } from '../../shared/learning';
// Authoring remains candidate. A matching independent receipt is required at runtime.
export const controlledWriting: Activity[] = [
  {
    id: 'W-C01',
    version: '1',
    family: 'F4',
    format: 'controlled-production',
    conceptId: 'it-a1-c04-02',
    conceptVersion: '1',
    dimension: 'contextual-use',
    prompt:
      'Scrivi una frase per presentarti a un collega: sei Luca e sei italiano. Usa essere, scrivi il nome e la nazionalità. Puoi usare o omettere io.',
    options: [],
    hint: 'Con io, la forma de essere es sono. No necesitas repetir el pronombre.',
    explanation:
      'Sono Luca e sono italiano presenta nombre y nacionalidad con essere. Io es opcional. Noi requiere siamo; io requiere sono.',
    criterion: {
      version: '1',
      canonVersion: '1',
      accepted: [
        'Sono Luca e sono italiano.',
        'Sono Luca e sono italiano',
        'Io sono Luca e sono italiano.',
        'Io sono Luca e sono italiano',
        'Sono Luca, sono italiano.',
        'Sono Luca, sono italiano',
      ],
      rejected: [
        'Io siamo Luca e siamo italiano.',
        'Io siamo Luca e siamo italiano',
      ],
      exhaustive: false,
      typos: ['Sno Luca e sono italiano.'],
    },
    writing: {
      policy: 'bounded',
      model: 'Sono Luca e sono italiano.',
      rubric: [
        'Consegna: nome e nazionalità indicati.',
        'Struttura: essere con io, anche senza il pronome.',
        'Vocabolario: nome e nazionalità dati.',
        'Organizzazione: una frase di presentazione.',
        'Funzione: presentarsi a un collega.',
        'Autonomia: aiuti e tentativi sono registrati.',
      ],
      incomplete: ['Sono Luca.', 'Sono Luca'],
      offTask: ['Sono Paolo e sono francese.', 'Sono Paolo e sono francese'],
      noTarget: [
        'Mi chiamo Luca e vengo dall’Italia.',
        'Mi chiamo Luca e vengo dall’Italia',
      ],
    },
    task: {
      skill: 'controlled-production',
      context: 'presentazione al lavoro',
      facets: ['identità', 'nazionalità'],
      opportunityId: 'W-C01:essere',
      scaffolding: 'none',
      matchingPrompts: [],
    },
    status: 'candidate',
    provenance: 'Writing A1 · original bounded production · C04-02 · candidate',
  },
];
