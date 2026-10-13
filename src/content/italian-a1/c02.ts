import type { Lesson } from './authoring';
export const c02: Lesson[] = [
  {
    code: '02-01',
    title: 'Salutare e congedarsi',
    objective:
      'Elegir y escribir saludos y despedidas adecuados a intercambios cotidianos formales e informales.',
    introduction:
      'Aprende estas expresiones como unidades. La relación con la otra persona y el momento del intercambio ayudan a elegir: entrar, despedirse o desear buenas noches no son la misma acción.',
    rules: [
      'Ciao sirve para saludar y despedirse en trato informal. Con una persona desconocida, buongiorno o buonasera suelen ser opciones más adecuadas al abrir el intercambio.',
      'Arrivederci es una despedida de uso amplio. Buonanotte se usa al despedirse para ir a dormir; no es el saludo normal al entrar en un hotel por la noche.',
    ],
    forms: [
      ['ciao', 'hola / adiós informal'],
      ['buongiorno', 'buenos días'],
      ['buonasera', 'buenas tardes / noches al saludar'],
      ['arrivederci', 'adiós / hasta luego'],
      ['buonanotte', 'buenas noches al ir a dormir'],
      ['a presto', 'hasta pronto'],
    ],
    examples: [
      ['Buongiorno!', '¡Buenos días!'],
      ['Ciao, Anna!', '¡Hola, Anna! / ¡Adiós, Anna!'],
      ['Arrivederci, a presto!', '¡Hasta luego, hasta pronto!'],
      ['Buonanotte!', '¡Buenas noches, que descanses!'],
    ],
    frequentErrors: [
      'No traduzcas todas las situaciones de «buenas noches» con buonanotte: al llegar, buonasera es una fórmula útil.',
    ],
    usageNotes: [
      'No fijamos una hora exacta universal para cambiar de buongiorno a buonasera; el uso varía. Las actividades dan un contexto claro.',
    ],
    vocabularyIds: [
      'it-ciao',
      'it-buongiorno',
      'it-buonasera',
      'it-arrivederci',
      'it-buonanotte',
      'it-a-presto',
    ],
    facets: ['apertura', 'despedida', 'registro'],
    source:
      'Research 02 C02: fórmulas de interacción; ejemplos originales candidate.',
    items: [
      {
        key: 'hotel-mattina',
        format: 'selection',
        prompt:
          'Alle 9 entri in hotel. Saluti una persona che non conosci. Scegli la formula più adatta.',
        options: ['Buongiorno', 'Buonanotte', 'Arrivederci'],
        accepted: ['Buongiorno'],
        hint: 'Estás llegando por la mañana.',
        explanation:
          'Buongiorno abre este intercambio. Arrivederci lo cerraría; buonanotte se reserva aquí para ir a dormir.',
        context: 'hotel',
        facets: ['apertura', 'registro'],
      },
      {
        key: 'amica',
        version: '2',
        format: 'short',
        prompt:
          'Saluta un’amica con la formula informale studiata (una parola).',
        accepted: ['ciao', 'ciao.', 'ciao!'],
        hint: 'Sirve también para despedirse de amigos.',
        explanation: 'Ciao es la fórmula informal solicitada.',
        context: 'amistad',
        facets: ['registro'],
      },
      {
        key: 'sera',
        version: '2',
        format: 'cloze',
        prompt:
          'È sera. Entri al ristorante: «___!» Scrivi la formula studiata per «buenas tardes/noches» (una parola).',
        accepted: ['buonasera'],
        rejected: ['buonanotte', 'arrivederci'],
        hint: 'Estás saludando, no yéndote a dormir.',
        explanation: 'Buonasera es adecuada al entrar por la tarde/noche.',
        context: 'restaurante',
        facets: ['apertura'],
      },
      {
        key: 'uscita',
        version: '2',
        format: 'controlled-production',
        prompt:
          'Esci dall’hotel. Scrivi la formula studiata che significa «adiós / hasta luego» (una parola).',
        accepted: ['arrivederci', 'arrivederci.', 'arrivederci!'],
        hint: 'Comienza por arri-.',
        explanation: 'Arrivederci cierra el intercambio cortésmente.',
        context: 'hotel',
        facets: ['despedida'],
      },
      {
        key: 'notte',
        format: 'selection',
        prompt: 'Vai a dormire. Quale formula scegli?',
        options: ['Buonanotte', 'Buongiorno', 'Benvenuto'],
        accepted: ['Buonanotte'],
        hint: 'Deseas que la otra persona descanse.',
        explanation: 'Buonanotte se usa en esta despedida antes de dormir.',
        context: 'casa',
        facets: ['despedida'],
      },
      {
        key: 'presto',
        format: 'cloze',
        prompt: 'Completa «hasta pronto»: A ___.',
        accepted: ['presto'],
        hint: 'La fórmula completa es a presto.',
        explanation: 'A presto expresa hasta pronto, sin fijar una fecha.',
        context: 'amistad',
        facets: ['despedida'],
      },
      {
        key: 'ciao-contesto',
        format: 'selection',
        prompt: 'Un’amica dice «Ciao!» e va via. Qui significa…',
        options: ['adiós', 'buenas noches al acostarse', 'gracias'],
        accepted: ['adiós'],
        hint: 'Observa que se va.',
        explanation:
          'Ciao puede cerrar un intercambio informal: el contexto permite interpretar la intención.',
        context: 'amistad',
        facets: ['despedida', 'registro'],
        skill: 'discrimination',
      },
    ],
  },
  {
    code: '02-02',
    title: 'Grazie, prego, scusi',
    objective:
      'Agradecer, responder a un agradecimiento y llamar la atención o disculparse con el registro adecuado.',
    introduction:
      'Estas fórmulas ayudan a pedir atención y mantener un intercambio cortés. No necesitas conjugar sus verbos todavía: aprende qué hace cada expresión.',
    rules: [
      'Grazie agradece; prego es una respuesta habitual a un agradecimiento. Per favore acompaña una petición.',
      'Scusa se usa con trato informal; scusi es una fórmula cortés al dirigirse a una persona de usted. Pueden introducir una petición de atención o una disculpa breve.',
    ],
    forms: [
      ['grazie', 'gracias'],
      ['prego', 'de nada, al responder a gracias'],
      ['per favore', 'por favor'],
      ['scusa', 'disculpa, trato informal'],
      ['scusi', 'disculpe, trato cortés'],
    ],
    examples: [
      ['Grazie! — Prego!', '¡Gracias! — ¡De nada!'],
      ['Un caffè, per favore.', 'Un café, por favor.'],
      ['Scusi!', '¡Disculpe!'],
    ],
    frequentErrors: [
      'No intercambies grazie y prego: en el pequeño diálogo hacen funciones distintas. Scusi no es una forma plural de scusa.',
    ],
    usageNotes: [
      'Prego tiene otros usos; aquí se practica como respuesta a gracias. No se presentan todos sus significados como equivalentes.',
    ],
    vocabularyIds: [
      'it-grazie',
      'it-prego',
      'it-per-favore',
      'it-scusa',
      'it-scusi',
      'it-caffe',
    ],
    facets: ['agradecimiento', 'respuesta', 'atención', 'registro'],
    source:
      'Research 02 C02: grazie/scusi y cortesía; expresiones básicas candidate.',
    items: [
      {
        key: 'grazie',
        format: 'selection',
        prompt: 'Una persona ti dà la chiave. Vuoi ringraziare. Scegli.',
        options: ['Grazie', 'Scusi', 'Arrivederci'],
        accepted: ['Grazie'],
        hint: 'La intención es agradecer.',
        explanation: 'Grazie agradece la ayuda recibida.',
        context: 'hotel',
        facets: ['agradecimiento'],
      },
      {
        key: 'prego',
        version: '2',
        format: 'short',
        prompt: '«Grazie!» Rispondi con la formula studiata per «de nada».',
        accepted: ['prego', 'prego.', 'prego!'],
        hint: 'Empieza por pr-.',
        explanation: 'Prego responde al agradecimiento en este diálogo.',
        context: 'hotel',
        facets: ['respuesta'],
      },
      {
        key: 'favore',
        format: 'cloze',
        prompt: 'Completa la richiesta: Un caffè, per ___.',
        accepted: ['favore'],
        hint: 'La expresión corresponde a por favor.',
        explanation:
          'Per favore acompaña la petición; no sustituye al agradecimiento posterior.',
        context: 'bar',
        facets: ['atención'],
      },
      {
        key: 'scusi',
        version: '2',
        format: 'controlled-production',
        prompt:
          'Con una persona sconosciuta: scrivi «disculpe» con la formula studiata (una parola).',
        accepted: ['scusi', 'scusi.', 'scusi!'],
        rejected: ['scusa'],
        hint: 'Usa la fórmula cortés.',
        explanation:
          'Scusi corresponde al trato cortés solicitado. Scusa sería informal.',
        context: 'transporte',
        facets: ['atención', 'registro'],
      },
      {
        key: 'scusa',
        version: '2',
        format: 'short',
        prompt: 'Con un amico, scrivi «disculpa» usando la formula informale.',
        accepted: ['scusa', 'scusa.', 'scusa!'],
        rejected: ['scusi'],
        hint: 'Termina en a.',
        explanation: 'Scusa se dirige a una persona con trato informal.',
        context: 'amistad',
        facets: ['registro'],
      },
      {
        key: 'dialogo',
        format: 'matching',
        prompt: 'Abbina l’intenzione alla formula.',
        options: ['Prego', 'Grazie', 'Per favore'],
        matchingPrompts: ['Agradecer', 'Responder a gracias', 'Por favor'],
        accepted: ['[1,0,2]'],
        hint: 'Piensa quién recibe la ayuda y quién responde.',
        explanation:
          'Grazie agradece; prego responde; per favore acompaña una petición.',
        context: 'interacción cotidiana',
        facets: ['agradecimiento', 'respuesta', 'atención'],
      },
      {
        key: 'petizione',
        format: 'ordering',
        prompt:
          'Ordina: «Un café, por favor». La punteggiatura non è richiesta.',
        options: ['per', 'caffè', 'favore', 'un'],
        accepted: ['un caffè per favore', 'per favore un caffè'],
        hint: 'Empieza por un caffè.',
        explanation:
          'Un caffè per favore y per favore un caffè son peticiones válidas. En escritura continua puede separarse per favore con coma.',
        context: 'bar',
        facets: ['atención'],
      },
    ],
  },
  {
    code: '02-03',
    title: 'Non capisco. Può ripetere?',
    objective:
      'Señalar incomprensión y pedir repetición o menor velocidad mediante fórmulas enseñadas.',
    introduction:
      'Puedes pedir ayuda desde el primer día. Estas frases permiten continuar la conversación sin fingir que has entendido. Se aprenden como expresiones completas.',
    rules: [
      'Non capisco comunica que no entiendes. Non lo so comunica que no lo sabes: son intenciones distintas.',
      'Può ripetere? pide repetición cortésmente. Puoi ripetere? corresponde al trato informal. Più lentamente, per favore pide menor velocidad.',
    ],
    forms: [
      ['non capisco', 'no entiendo'],
      ['può ripetere?', '¿puede repetir?'],
      ['puoi ripetere?', '¿puedes repetir?'],
      ['più lentamente, per favore', 'más despacio, por favor'],
      ['non lo so', 'no lo sé; contraste de intención'],
    ],
    examples: [
      ['Scusi, non capisco.', 'Disculpe, no entiendo.'],
      ['Può ripetere, per favore?', '¿Puede repetir, por favor?'],
      ['Più lentamente, per favore.', 'Más despacio, por favor.'],
    ],
    frequentErrors: [
      '«Non lo so» no pide aclarar algo que no has entendido. En può hay acento; puoi no lo lleva.',
    ],
    usageNotes: [
      'No se evalúa aún el paradigma de capire o potere ni la formación general de preguntas. La práctica se centra en elegir y recuperar estas fórmulas.',
    ],
    vocabularyIds: [
      'it-non-capisco',
      'it-puo-ripetere',
      'it-puoi-ripetere',
      'it-piu-lentamente',
      'it-non-lo-so',
      'it-per-favore',
      'it-scusi',
    ],
    facets: ['incomprensión', 'repetición', 'velocidad', 'registro'],
    source:
      'Research 02 C02: non capisco y reparación; frases candidate para revisión.',
    items: [
      {
        key: 'intenzione',
        version: '2',
        format: 'selection',
        prompt:
          'Alla reception: non capisci (no entiendes). Scegli la frase adatta.',
        options: ['Non capisco', 'Non lo so', 'Arrivederci'],
        accepted: ['Non capisco'],
        hint: 'El problema es entender el mensaje.',
        explanation:
          'Non capisco señala incomprensión; non lo so indica que desconoces una respuesta.',
        context: 'hotel',
        facets: ['incomprensión'],
        skill: 'discrimination',
      },
      {
        key: 'capisco',
        format: 'cloze',
        prompt: 'Completa «no entiendo»: Non ___.',
        accepted: ['capisco'],
        hint: 'La fórmula estudiada comienza por non cap-.',
        explanation:
          'Non capisco es una forma directa de indicar que no entiendes.',
        context: 'transporte',
        facets: ['incomprensión'],
      },
      {
        key: 'ripetere',
        version: '2',
        format: 'cloze',
        prompt:
          'Completa la formula per «¿Puede repetir, por favor?»: Può ___, per favore?',
        accepted: ['ripetere'],
        hint: 'Quieres oír otra vez el mensaje.',
        explanation: 'Può ripetere, per favore? pide una repetición cortés.',
        context: 'hotel',
        facets: ['repetición', 'registro'],
      },
      {
        key: 'formula',
        version: '2',
        format: 'controlled-production',
        prompt:
          'Una persona sconosciuta parla. Chiedi «¿Puede repetir?» con la formula studiata di due parole. Puoi aggiungere per favore alla fine.',
        accepted: [
          'può ripetere',
          'può ripetere?',
          'può ripetere, per favore?',
          'può ripetere per favore?',
          'può ripetere, per favore',
          'può ripetere per favore',
        ],
        rejected: ['puo ripetere', 'puoi ripetere'],
        hint: 'Empieza por può, con acento.',
        explanation:
          'Può ripetere? corresponde al trato cortés; puedes añadir per favore.',
        context: 'transporte',
        facets: ['repetición', 'registro'],
      },
      {
        key: 'velocita',
        format: 'selection',
        prompt:
          'La persona parla troppo velocemente. Chiedi di parlare più piano.',
        options: ['Più lentamente, per favore', 'Grazie', 'Non lo so'],
        accepted: ['Più lentamente, per favore'],
        hint: 'No basta con agradecer ni con decir que no sabes.',
        explanation: 'Più lentamente, per favore solicita menor velocidad.',
        context: 'hotel',
        facets: ['velocidad'],
      },
      {
        key: 'lentamente',
        version: '2',
        format: 'cloze',
        prompt:
          'Completa con la parola della formula studiata: «más despacio, por favor» → Più ___, per favore.',
        accepted: ['lentamente'],
        hint: 'La palabra empieza por lenta-.',
        explanation:
          'Più lentamente indica más despacio; es una fórmula útil para regular el intercambio.',
        context: 'interacción cotidiana',
        facets: ['velocidad'],
      },
      {
        key: 'amico',
        version: '2',
        format: 'controlled-production',
        prompt:
          'Con un amico: scrivi «¿Puedes repetir?» con la formula studiata di due parole. Puoi aggiungere per favore alla fine.',
        accepted: [
          'puoi ripetere',
          'puoi ripetere?',
          'puoi ripetere, per favore?',
          'puoi ripetere per favore?',
          'puoi ripetere, per favore',
          'puoi ripetere per favore',
        ],
        rejected: ['può ripetere'],
        hint: 'Informal: puoi, sin acento.',
        explanation: 'Puoi ripetere? usa el trato informal pedido.',
        context: 'amistad',
        facets: ['registro', 'repetición'],
      },
    ],
  },
];
