import type { Lesson } from './authoring';
export const c10: Lesson[] = [
  {
    code: '10-01',
    title: 'Un amico, un’amica',
    objective:
      'Elegir un/uno/una/un’ según género e inicio, distinguiendo el apóstrofo femenino.',
    introduction:
      'El artículo indeterminado singular tiene formas masculinas y femeninas. Primero decide el género; después aplica la forma apropiada al inicio del nombre.',
    rules: [
      'Masculino: un ante consonante habitual o vocal (un letto, un amico); uno ante los grupos de lo: uno studente, uno zaino, uno gnocco, uno psicologo.',
      'Femenino: una ante consonante (una penna, una studentessa). Ante vocal se puede elidir: un’amica. La forma plena una amica también es posible; las consignas que pidan elisión requieren apóstrofo.',
      'Un masculino nunca lleva apóstrofo: un amico. Un’ con apóstrofo procede del femenino una. No copies l’ del determinado masculino.',
      'No existe un plural morfológico universal de un/uno/una. Aquí se practica el singular; cantidades y partitivos tendrán su propio alcance en C27.',
    ],
    forms: [
      ['un letto / un amico', 'una cama / un amigo'],
      ['uno studente / uno zaino', 'un estudiante / una mochila'],
      ['una penna / un’amica', 'un bolígrafo / una amiga'],
    ],
    examples: [
      ['Ho un amico.', 'Tengo un amigo.'],
      ['Ho un’amica.', 'Tengo una amiga.'],
      ['Ho uno zaino.', 'Tengo una mochila.'],
    ],
    frequentErrors: [
      '«Un’amico» es incorrecto: amico es masculino.',
      '«Un amica» omite el apóstrofo de la elisión femenina.',
      '«Uno penna» no concuerda con el femenino penna.',
    ],
    usageNotes: [
      'El género italiano gobierna el artículo, aunque la traducción tenga otro género. Se admiten apóstrofos rectos y tipográficos.',
    ],
    vocabularyIds: [
      'it-amico',
      'it-letto',
      'it-studente',
      'it-studentessa',
      'it-zaino',
      'it-penna',
      'it-gnocco',
      'it-psicologo',
      'it-articolo-indeterminativo',
    ],
    facets: ['un', 'uno', 'una', 'elisión', 'sin-plural'],
    source:
      'Research 02 C10; A1_COVERAGE_MATRIX C10. https://www.treccani.it/enciclopedia/articoli-indeterminativi_(La-grammatica-italiana)/',
    items: [
      {
        key: 'penna',
        format: 'selection',
        prompt: 'Penna è femminile: ___ penna.',
        accepted: ['una'],
        explanation: 'Ante consonante, el femenino usa una.',
        facets: ['una'],
        context: 'estudio',
        hint: 'Ante consonante, el femenino usa una.',
        options: ['un', 'uno', 'una'],
      },
      {
        key: 'studente',
        format: 'cloze',
        prompt: 'Studente è maschile: ___ studente.',
        accepted: ['uno'],
        explanation: 'S + consonante requiere uno en masculino.',
        facets: ['uno'],
        context: 'estudio',
        hint: 'S + consonante requiere uno en masculino.',
        rejected: ['un', 'una'],
      },
      {
        key: 'amico',
        format: 'short',
        prompt: 'Scrivi articolo indeterminativo + amico (maschile).',
        accepted: ['un amico'],
        explanation: 'El masculino un ante vocal no lleva apóstrofo.',
        facets: ['un'],
        context: 'conversación',
        hint: 'El masculino un ante vocal no lleva apóstrofo.',
        rejected: ["un'amico", 'un’amico', 'uno amico'],
      },
      {
        key: 'amica',
        format: 'short',
        prompt: 'Scrivi articolo indeterminativo + amica, usando l’elisione.',
        accepted: ["un'amica", 'un’amica'],
        explanation: 'La elisión de una deja un’ femenino.',
        facets: ['elisión'],
        context: 'conversación',
        hint: 'La elisión de una deja un’ femenino.',
        rejected: ['un amica'],
      },
      {
        key: 'correggi',
        format: 'error-correction',
        prompt: 'Correggi l’apostrofo: «Ho un’amico».',
        accepted: ['Ho un amico', 'Ho un amico.'],
        explanation: 'Amico es masculino; un no necesita apóstrofo.',
        facets: ['un'],
        context: 'conversación',
        hint: 'Amico es masculino; un no necesita apóstrofo.',
        rejected: ['Ho un’amico', "Ho un'amico"],
      },
      {
        key: 'zaino',
        format: 'controlled-production',
        prompt: 'Scrivi «Tengo una mochila» usando zaino (maschile), senza io.',
        accepted: ['Ho uno zaino', 'Ho uno zaino.'],
        explanation: 'Zaino selecciona uno por z inicial y género masculino.',
        facets: ['uno'],
        context: 'viaje',
        hint: 'Zaino selecciona uno por z inicial y género masculino.',
        rejected: ['Ho un zaino', 'Ho una zaino'],
      },
      {
        key: 'studentessa',
        format: 'cloze',
        prompt: 'Studentessa è femminile: ___ studentessa.',
        accepted: ['una'],
        explanation:
          'La regla de uno no se aplica al femenino, aunque empiece por st.',
        facets: ['una'],
        context: 'estudio',
        hint: 'La regla de uno no se aplica al femenino, aunque empiece por st.',
        rejected: ['uno', 'un'],
      },
      {
        key: 'plurale',
        format: 'selection',
        prompt:
          'Un amico → più persone: esiste una forma plurale unica dell’articolo indeterminativo?',
        accepted: ['no'],
        explanation:
          'No hay un plural morfológico universal de un; el contexto decide la construcción.',
        facets: ['sin-plural'],
        context: 'conversación',
        hint: 'No hay un plural morfológico universal de un; el contexto decide la construcción.',
        options: ['sì: uns', 'sì: uni', 'no'],
        skill: 'discrimination',
      },
      {
        key: 'gruppi',
        format: 'selection',
        prompt: 'Scegli i gruppi corretti per gnocco e psicologo (maschili).',
        accepted: ['uno gnocco / uno psicologo'],
        explanation:
          'Gn y ps seleccionan uno, igual que seleccionan lo en el determinado.',
        facets: ['uno'],
        context: 'restaurante',
        hint: 'Gn y ps seleccionan uno, igual que seleccionan lo en el determinado.',
        options: [
          'uno gnocco / uno psicologo',
          'un gnocco / un psicologo',
          'una gnocco / una psicologo',
        ],
      },
    ],
  },
  {
    code: '10-02',
    title: 'Una chiave: introduciamo qualcosa',
    objective:
      'Introducir un referente con indeterminado y contrastar su posterior identificación con determinado.',
    introduction:
      'Cuando presentas algo que el interlocutor todavía no identifica, el indeterminado permite introducirlo. No significa que el hablante desconozca de qué objeto se trata.',
    rules: [
      'Ho una chiave introduce una llave; La chiave è qui puede continuar hablando de la misma.',
      'Una petición de una unidad sin identificar un ejemplar concreto usa indeterminado: Un caffè, per favore. La fórmula permite pedir sin aprender otro verbo.',
      'El contraste es discursivo: una penna presenta; la penna retoma o identifica. No se decide únicamente por si el nombre aparece por primera vez en la frase.',
    ],
    forms: [
      ['un caffè, per favore', 'un café, por favor'],
      ['ho una chiave → la chiave è qui', 'introducción → referencia conocida'],
    ],
    examples: [
      ['Un caffè, per favore.', 'Un café, por favor.'],
      [
        'Ho un biglietto. Il biglietto è qui.',
        'Tengo un billete. El billete está aquí.',
      ],
    ],
    frequentErrors: [
      'El indeterminado no significa necesariamente desconocido para quien habla.',
      'No trates dei como plural universal de un: esa construcción se verá con cantidades y contexto.',
    ],
    usageNotes: [
      'Las situaciones especifican si se introduce o retoma el objeto para evitar evaluar preferencias ambiguas.',
    ],
    vocabularyIds: [
      'it-chiave',
      'it-penna',
      'it-biglietto',
      'it-caffe',
      'it-per-favore',
      'it-articolo-indeterminativo',
      'it-articolo-determinativo',
    ],
    facets: ['introducción', 'petición', 'contraste-referencia'],
    source:
      'Research 02 C10; A1_COVERAGE_MATRIX C10. https://www.treccani.it/enciclopedia/articoli-indeterminativi_(La-grammatica-italiana)/',
    items: [
      {
        key: 'introduci',
        format: 'selection',
        prompt:
          'Parli per la prima volta di una penna che l’altra persona non può identificare: Ho ___ penna.',
        accepted: ['una'],
        explanation:
          'Una introduce un ejemplar sin suponer que el interlocutor lo identifica.',
        facets: ['introducción'],
        context: 'estudio',
        hint: 'Una introduce un ejemplar sin suponer que el interlocutor lo identifica.',
        options: ['una', 'la'],
      },
      {
        key: 'caffe',
        format: 'cloze',
        prompt:
          'Ordina un solo caffè, senza indicarne uno già pronto: ___ caffè, per favore.',
        accepted: ['Un'],
        explanation: 'Un introduce la unidad solicitada.',
        facets: ['petición'],
        context: 'bar',
        hint: 'Un introduce la unidad solicitada.',
        rejected: ['Il', 'Uno'],
      },
      {
        key: 'chiedi',
        format: 'controlled-production',
        prompt:
          'Al bar, ordina «un café, por favor» con la formula senza verbo.',
        accepted: [
          'Un caffè, per favore',
          'Un caffè, per favore.',
          'Un caffè per favore',
          'Un caffè per favore.',
        ],
        explanation: 'Un caffè introduce el pedido; per favore añade cortesía.',
        facets: ['petición'],
        context: 'bar',
        hint: 'Un caffè introduce el pedido; per favore añade cortesía.',
        rejected: ['Il caffè, per favore'],
      },
      {
        key: 'sequenza',
        format: 'selection',
        prompt:
          'Introduci un biglietto nuovo e poi riprendi lo stesso: scegli la sequenza.',
        accepted: ['Ho un biglietto. Il biglietto è qui.'],
        explanation: 'Un introduce; il retoma ese mismo billete.',
        facets: ['introducción', 'contraste-referencia'],
        context: 'transporte',
        hint: 'Un introduce; il retoma ese mismo billete.',
        options: [
          'Ho un biglietto. Il biglietto è qui.',
          'Ho il biglietto. Un biglietto è qui.',
        ],
        skill: 'discrimination',
      },
      {
        key: 'presenta',
        format: 'translation',
        prompt:
          'Traduci «Tengo una llave» para introducir una llave no identificada; usa chiave, senza io.',
        accepted: ['Ho una chiave', 'Ho una chiave.'],
        explanation:
          'Una chiave presenta un referente nuevo para el interlocutor.',
        facets: ['introducción'],
        context: 'hotel',
        hint: 'Una chiave presenta un referente nuevo para el interlocutor.',
        rejected: ['Ho la chiave'],
      },
      {
        key: 'significato',
        format: 'selection',
        prompt: 'Dico «Ho una chiave» e so esattamente quale. È possibile?',
        accepted: ['sì'],
        explanation:
          'El hablante puede conocer el objeto: el indeterminado no exige que él lo desconozca.',
        facets: ['contraste-referencia'],
        context: 'hotel',
        hint: 'El hablante puede conocer el objeto: el indeterminado no exige que él lo desconozca.',
        options: ['sì', 'no'],
        skill: 'discrimination',
      },
      {
        key: 'riprendi',
        format: 'cloze',
        prompt:
          'Ho una penna. Voglio parlare della stessa penna: ___ penna è qui.',
        accepted: ['La'],
        explanation: 'Tras introducir, la permite retomar ese mismo referente.',
        facets: ['contraste-referencia'],
        context: 'estudio',
        hint: 'Tras introducir, la permite retomar ese mismo referente.',
        rejected: ['Una'],
      },
    ],
    contrasts: [
      {
        conceptId: 'it-a1-c09-03',
        explanation:
          'Un/una introducen; il/la pueden retomar lo introducido o identificar algo compartido.',
      },
    ],
  },
];
