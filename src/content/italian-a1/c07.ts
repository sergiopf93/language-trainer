import type { Lesson } from './authoring';
export const c07: Lesson[] = [
  {
    code: '07-01',
    theoryRevision: 'editorial-1',
    title: 'Il genere: -o e -a',
    objective:
      'Recuperar género de nombres familiares en -o/-a como tendencia y no como regla universal.',
    introduction:
      'Cada sustantivo tiene género gramatical. En muchos nombres, -o orienta al masculino y -a al femenino; aprende la palabra con su género, incluso cuando se refiere a un objeto.',
    rules: [
      'Gatto, letto y biglietto son masculinos; casa, penna y famiglia son femeninos.',
      'El género de los objetos no se deduce de la traducción española: penna es femenino aunque bolígrafo sea masculino. En nombres de personas, el género puede distinguir referentes: amico/amica.',
      'Los artículos il y la se muestran como pistas de género. Su selección completa se estudia en C09; aquí puedes responder maschile o femminile.',
    ],
    forms: [
      [
        'il gatto / il letto / il biglietto',
        'masculinos: gato / cama / billete',
      ],
      [
        'la casa / la penna / la famiglia',
        'femeninos: casa / bolígrafo / familia',
      ],
    ],
    examples: [
      ['La penna è qui.', 'El bolígrafo está aquí.'],
      ['Il letto è qui.', 'La cama está aquí.'],
    ],
    frequentErrors: [
      'No asignes masculino a penna por la traducción bolígrafo.',
      'No conviertas -a = femenino en una regla sin excepciones.',
    ],
    usageNotes: [
      'Maschile significa masculino; femminile, femenino. C07-02 amplía nombres en -e y excepciones.',
    ],
    vocabularyIds: [
      'it-gatto',
      'it-letto',
      'it-biglietto',
      'it-casa',
      'it-penna',
      'it-famiglia',
      'it-mano',
      'it-problema',
    ],
    facets: ['tendencias', 'género-léxico', 'contraste-español'],
    source:
      'Research 02 C07; A1_COVERAGE_MATRIX C07. https://www.treccani.it/enciclopedia/variabili-e-invariabili-parole-prontuario_(Enciclopedia-dell%27Italiano)/',
    items: [
      {
        key: 'riconosci',
        format: 'selection',
        prompt: 'Penna (bolígrafo): scegli il genere italiano.',
        accepted: ['femminile'],
        explanation:
          'Penna es femenino, independientemente de bolígrafo en español.',
        facets: ['contraste-español', 'género-léxico'],
        context: 'estudio',
        hint: 'Penna es femenino, independientemente de bolígrafo en español.',
        options: ['maschile', 'femminile'],
      },
      {
        key: 'letto',
        format: 'short',
        prompt: 'Letto (cama): scrivi maschile o femminile.',
        accepted: ['maschile'],
        explanation:
          'Letto es masculino; la traducción cama no decide el género italiano.',
        facets: ['contraste-español', 'género-léxico'],
        context: 'hotel',
        hint: 'Letto es masculino; la traducción cama no decide el género italiano.',
        rejected: ['femminile'],
      },
      {
        key: 'famiglia',
        format: 'cloze',
        prompt: 'Famiglia (familia): genere ___. Scrivi maschile o femminile.',
        accepted: ['femminile'],
        explanation:
          'Famiglia sigue la tendencia frecuente de los nombres en -a.',
        facets: ['tendencias'],
        context: 'familia',
        hint: 'Famiglia sigue la tendencia frecuente de los nombres en -a.',
        rejected: ['maschile'],
      },
      {
        key: 'limite',
        format: 'selection',
        prompt: 'Quale regola è affidabile?',
        accepted: ['-o spesso maschile, -a spesso femminile'],
        explanation:
          'La terminación orienta, pero existen excepciones como mano y problema.',
        facets: ['tendencias'],
        context: 'conversación',
        hint: 'La terminación orienta, pero existen excepciones como mano y problema.',
        options: [
          '-o sempre maschile, -a sempre femminile',
          '-o spesso maschile, -a spesso femminile',
        ],
        skill: 'discrimination',
      },
      {
        key: 'ripara',
        format: 'error-correction',
        prompt:
          'Correggi solo l’etichetta: «biglietto (billete): femminile». Scrivi l’etichetta corretta.',
        accepted: ['maschile'],
        explanation:
          'Biglietto es masculino. La etiqueta del léxico es lo que recuperas.',
        facets: ['género-léxico'],
        context: 'transporte',
        hint: 'Biglietto es masculino. La etiqueta del léxico es lo que recuperas.',
        rejected: ['femminile'],
      },
      {
        key: 'casa',
        format: 'short',
        prompt: 'Casa: recupera il genere, scrivendo maschile o femminile.',
        accepted: ['femminile'],
        explanation: 'Casa es femenino, como indica la casa.',
        facets: ['género-léxico', 'tendencias'],
        context: 'vivienda',
        hint: 'Casa es femenino, como indica la casa.',
        rejected: ['maschile'],
      },
    ],
    exceptions: [
      'Mano es femenino y problema masculino; se trabajan junto con otras excepciones en C07-02.',
    ],
  },
  {
    code: '07-02',
    theoryRevision: 'editorial-1',
    title: 'La chiave, il problema',
    objective:
      'Recuperar género de nombres en -e y excepciones frecuentes: mano y problema.',
    introduction:
      'La terminación -e no permite decidir el género por sí sola. Usa el género guardado con cada palabra y recupera también las excepciones frecuentes en -o/-a.',
    rules: [
      'Chiave y notte son femeninos; pesce y nome son masculinos. Aprende la chiave, la notte, il pesce, il nome.',
      'Mano es femenino pese a -o: la mano. Problema es masculino pese a -a: il problema.',
      'Insegnante puede referirse a un profesor o una profesora; la terminación no cambia y el contexto ayuda a identificar el género.',
    ],
    forms: [
      ['la chiave / la notte', 'llave / noche: femenino'],
      ['il pesce / il nome', 'pez-pescado / nombre: masculino'],
      ['la mano / il problema', 'mano: femenino / problema: masculino'],
    ],
    examples: [
      ['La chiave è qui.', 'La llave está aquí.'],
      ['La notte.', 'La noche.'],
    ],
    frequentErrors: [
      'No todos los nombres en -e son masculinos.',
      '«Il mano» y «la problema» contradicen el género de estas palabras.',
    ],
    usageNotes: [
      'Aquí los artículos son pistas proporcionadas; la producción del paradigma de artículos corresponde a C09.',
    ],
    vocabularyIds: [
      'it-chiave',
      'it-notte',
      'it-pesce',
      'it-nome',
      'it-mano',
      'it-problema',
      'it-insegnante',
    ],
    facets: ['-e', 'excepciones', 'género-común'],
    source:
      'Research 02 C07; A1_COVERAGE_MATRIX C07. https://www.treccani.it/enciclopedia/variabili-e-invariabili-parole-prontuario_(Enciclopedia-dell%27Italiano)/',
    items: [
      {
        key: 'chiave',
        format: 'selection',
        prompt: 'Chiave (llave): scegli il genere.',
        accepted: ['femminile'],
        explanation: 'Chiave es femenino; -e no indica masculino por defecto.',
        facets: ['-e'],
        context: 'hotel',
        hint: 'Chiave es femenino; -e no indica masculino por defecto.',
        options: ['maschile', 'femminile'],
      },
      {
        key: 'pesce',
        format: 'short',
        prompt: 'Pesce (pescado): scrivi maschile o femminile.',
        accepted: ['maschile'],
        explanation: 'Pesce es masculino: il pesce.',
        facets: ['-e'],
        context: 'restaurante',
        hint: 'Pesce es masculino: il pesce.',
        rejected: ['femminile'],
      },
      {
        key: 'mano',
        format: 'error-correction',
        prompt:
          'Correggi l’etichetta «mano: maschile». Scrivi solo l’etichetta.',
        accepted: ['femminile'],
        explanation: 'Mano es una excepción frecuente en -o.',
        facets: ['excepciones'],
        context: 'conversación',
        hint: 'Mano es una excepción frecuente en -o.',
        rejected: ['maschile'],
      },
      {
        key: 'problema',
        format: 'cloze',
        prompt: 'Problema: genere ___. Scrivi maschile o femminile.',
        accepted: ['maschile'],
        explanation: 'Problema es masculino pese a su terminación -a.',
        facets: ['excepciones'],
        context: 'trabajo',
        hint: 'Problema es masculino pese a su terminación -a.',
        rejected: ['femminile'],
      },
      {
        key: 'notte',
        format: 'short',
        prompt: 'Notte (noche): recupera il genere, maschile o femminile.',
        accepted: ['femminile'],
        explanation: 'La notte es femenino; memoriza el género con el nombre.',
        facets: ['-e'],
        context: 'hotel',
        hint: 'La notte es femenino; memoriza el género con el nombre.',
        rejected: ['maschile'],
      },
      {
        key: 'nome',
        format: 'selection',
        prompt: 'Quale coppia contiene due nomi maschili?',
        accepted: ['nome / pesce'],
        explanation:
          'Nome y pesce son masculinos; chiave y notte son femeninos.',
        facets: ['-e'],
        context: 'conversación',
        hint: 'Nome y pesce son masculinos; chiave y notte son femeninos.',
        options: ['nome / pesce', 'chiave / notte', 'nome / chiave'],
        skill: 'discrimination',
      },
      {
        key: 'insegnante',
        format: 'selection',
        prompt:
          'Anna è insegnante. Luca è insegnante. Che cosa cambia nel nome?',
        accepted: ['niente: insegnante per entrambi'],
        explanation:
          'Insegnante mantiene su forma al referirse a mujer u hombre.',
        facets: ['género-común'],
        context: 'estudio',
        hint: 'Insegnante mantiene su forma al referirse a mujer u hombre.',
        options: [
          'niente: insegnante per entrambi',
          'Anna: insegnanta',
          'Luca: insegnanto',
        ],
      },
    ],
    exceptions: [
      'La mano y il problema deben aprenderse por su género léxico; no invalidan las tendencias de otras palabras.',
    ],
  },
];
