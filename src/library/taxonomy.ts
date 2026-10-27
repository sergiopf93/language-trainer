// Presentation aliases over existing curriculum units, never editorial/evaluation tags.
export const categories = [
  {
    id: 'verb',
    label: 'Verbos',
    units: [
      'C04',
      'C05',
      'C14',
      'C15',
      'C16',
      'C17',
      'C19',
      'C25',
      'C26',
      'C30',
      'C31',
      'C32',
      'C33',
    ],
    aliases: ['verbo', 'verbi', 'conjugaciones', 'coniugazioni'],
  },
  {
    id: 'article',
    label: 'Artículos',
    units: ['C09', 'C10'],
    aliases: ['articolo', 'articoli', 'articulos'],
  },
  {
    id: 'pronoun',
    label: 'Pronombres',
    units: ['C03', 'C28'],
    aliases: ['pronome', 'pronomi'],
  },
  {
    id: 'preposition',
    label: 'Preposiciones',
    units: ['C20', 'C21'],
    aliases: ['preposizione', 'preposizioni'],
  },
  {
    id: 'vocabulary',
    label: 'Vocabulario',
    units: ['C01', 'C02', 'C13', 'C22', 'C34'],
    aliases: ['lessico', 'vocabolario', 'palabras'],
  },
  {
    id: 'sentence',
    label: 'Construcción de frases',
    units: ['C06', 'C12', 'C18', 'C29'],
    aliases: ['frasi', 'frases', 'oraciones'],
  },
  {
    id: 'nominal',
    label: 'Sustantivos y adjetivos',
    units: ['C07', 'C08', 'C11', 'C23', 'C24', 'C27'],
    aliases: [
      'nomi',
      'aggettivi',
      'sustantivos',
      'adjetivos',
      'posesivos',
      'possessivi',
      'demostrativos',
    ],
  },
];
// Match authored context labels, not arbitrary words in prompts/answers.
export const themes = [
  {
    id: 'presentation',
    label: 'Presentaciones',
    aliases: [
      'presentazione',
      'presentación',
      'presentacion',
      'saludo',
      'saluti',
      'identidad',
    ],
  },
  { id: 'family', label: 'Familia', aliases: ['familia', 'famiglia'] },
  {
    id: 'routine',
    label: 'Rutinas',
    aliases: ['rutina', 'routine', 'trabajo', 'lavoro'],
  },
  {
    id: 'restaurant',
    label: 'Restaurante',
    aliases: ['restaurante', 'ristorante', 'bar', 'bebidas', 'menu', 'menù'],
  },
  {
    id: 'travel',
    label: 'Viajes',
    aliases: [
      'viaje',
      'viajes',
      'viaggio',
      'viaggi',
      'transporte',
      'trasporto',
      'desplazamiento',
      'hotel',
      'alojamiento',
      'treno',
      'biglietto',
      'itinerario',
    ],
  },
  {
    id: 'shopping',
    label: 'Compras',
    aliases: [
      'compras',
      'compra',
      'spesa',
      'negozio',
      'supermercado',
      'supermercato',
      'precios',
    ],
  },
  {
    id: 'time',
    label: 'Horarios',
    aliases: [
      'horarios',
      'orari',
      'orario',
      'calendario',
      'cita',
      'appuntamento',
      'agenda',
    ],
  },
  {
    id: 'home',
    label: 'Vivienda',
    aliases: ['vivienda', 'casa', 'objetos', 'oggetti', 'alloggio', 'camera'],
  },
  {
    id: 'social',
    label: 'Interacción cotidiana',
    aliases: [
      'interacción',
      'interazione',
      'conversacion',
      'conversazione',
      'amistad',
      'invitación',
      'invito',
      'aclaración',
      'chiarimento',
      'mensaje',
      'messaggio',
    ],
  },
];
export const practiceTypes = {
  concept: 'Práctica de conceptos',
  vocabulary: 'Vocabulario',
  mixed: 'Mixed',
  reading: 'Reading',
  writing: 'Writing',
};
export const practiceAliases = {
  concept: ['teoria', 'teoría', 'gramatica', 'grammatica', 'conceptos'],
  vocabulary: ['vocabulario', 'vocabolario', 'lessico'],
  mixed: ['mixed', 'mixta', 'mista', 'mezclada'],
  reading: ['reading', 'lectura', 'lettura', 'letture', 'comprensión escrita'],
  writing: ['writing', 'escritura', 'scrittura', 'escribir', 'scrivere'],
};
export const learningStates = {
  new: 'Sin empezar',
  started: 'En progreso',
  review: 'Necesita repaso',
};
export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('it')
    .replace(/[^\p{L}\p{N}-]+/gu, ' ')
    .trim();
}
export function themeIds(contexts: string[]) {
  return themes
    .filter((t) =>
      contexts.some((context) =>
        t.aliases.some(
          (a) =>
            normalize(context)
              .split(' ')
              .some((word) => word === normalize(a)) ||
            normalize(context) === normalize(a),
        ),
      ),
    )
    .map((t) => t.id);
}
