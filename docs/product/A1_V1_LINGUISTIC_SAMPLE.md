# Muestra para revisión lingüística humana — V1

Estado: **pendiente de revisión humana cualificada**. Selección, no nueva auditoría editorial ni aprobación de contenido. Ocho conceptos de C01–C34, 16 actividades, tres Reading y tres Writing. No pretende cubrir todo A1.

Fuente: `81a2301`, aplicación intacta desde `9f72bcc`. [Snapshot exacto](user-validation/linguistic-sample.json), SHA256 `a6113c1a8eb9b04b0d1cf9b490c512122c9e6f5d7f68d9233fad715c63d37686`. IDs/versiones, Theory y criterios íntegros se conservan allí; las selecciones siguientes transcriben los campos indicados sin inventar variantes.

## Cómo revisar

Revisar sin mirar primero la solución cuando sea posible. Después contrastar: naturalidad y corrección italiana, claridad de consigna, correspondencia con objetivo A1, suficiencia de contexto, variantes legítimas, errores realmente incorrectos, explicación útil en español y tratamiento neutral de respuestas no contempladas. Proponer cambios como incidencias: no editar corpus ni promover estados.

Una respuesta no incluida no es automáticamente un error. En criterios no exhaustivos el motor puede abstenerse. Modelos de texto abierto son ayudas, nunca listas de respuestas aceptadas ni prueba de dominio. Versiones y estados del snapshot describen el sistema, no un dictamen humano.

## it-a1-c01-01 — Scrivere: chi, gi, sc, gn, gli

Concepto v1; Theory `it-a1-theory-c01-01` v`theory-c01-01-1`. Abrir Biblioteca o `/concept?id=it-a1-c01-01`.

**Foco humano:** Ortografía vs pronunciación; no interpretar este ejercicio como prueba oral.

**Teoría:** Algunas letras italianas trabajan juntas. Aprende la palabra con su significado y fíjate en el grupo completo: no traslades automáticamente la ortografía española.

- Ante e/i, c y g tienen un sonido distinto del que tienen ante a/o/u. La h de che/chi y ghe/ghi mantiene el sonido de c de casa y de g de gatto.
- En las palabras enseñadas, sc ante e/i aparece en pesce y scimmia; gn en bagno recuerda a la ñ española. Aprende gli dentro de famiglia y biglietto; no lo sustituyas por li.
- La h de estos grupos no se pronuncia por separado. Aquí comprobarás escritura y reconocimiento; una respuesta escrita no demuestra pronunciación.

**Ejemplos exactos:**

- La chiave. → La llave.
- Un gelato. → Un helado.
- Il bagno. → El baño.
- La famiglia. → La familia.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c01-01-chiave` v1

In hotel: scegli la parola italiana per «llave».

Formato: selection. Opciones: ["chiave", "ciave", "chave"].

**Aceptadas:** ["chiave"]

**Rechazadas explícitas:** []. Criterio exhaustivo: True.

**Ayuda:** Busca el grupo chi.

**Corrección/explicación:** La palabra enseñada es chiave, con chi. La h pertenece al grupo gráfico.

### Actividad `it-a1-c01-01-ciao` v1

Scrivi il saluto italiano «hola» mostrato nella tabella.

Formato: short. Opciones: [].

**Aceptadas:** ["ciao"]

**Rechazadas explícitas:** ["chiao"]. Criterio exhaustivo: False.

**Ayuda:** El grupo inicial es ci, sin h.

**Corrección/explicación:** Ciao contiene ci ante a. La h de chiave no se extiende a ciao.

## it-a1-c06-01 — Non ho fame

Concepto v1; Theory `it-a1-theory-c06-01` v`theory-c06-01-1-editorial-1`. Abrir Biblioteca o `/concept?id=it-a1-c06-01`.

**Foco humano:** Negación simple y contexto suficiente, especialmente la corrección editorial histórica.

**Teoría:** Non niega lo que dice el verbo. Reutiliza las formas de essere y avere que ya conoces: no cambia la persona ni la forma verbal.

- Coloca non inmediatamente antes del verbo en estas frases: non sono, non hai, non è, non abbiamo.
- Si expresas el sujeto, va antes de non en el orden neutro: Anna non è qui. El sujeto puede omitirse cuando se entiende.
- «No» sirve como respuesta independiente negativa; «non» acompaña al verbo: No, non ho fame.

**Ejemplos exactos:**

- Non sono a casa. → No estoy en casa.
- Anna non ha sonno. → Anna no tiene sueño.
- No, non ho una chiave. → No, no tengo una llave.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c06-01-nega` v2

Trasforma «Sono a casa» in una frase negativa semplice, senza aggiungere altre parole.

Formato: transformation. Opciones: [].

**Aceptadas:** ["Non sono a casa", "Non sono a casa."]

**Rechazadas explícitas:** ["Sono non a casa"]. Criterio exhaustivo: False.

**Ayuda:** En la negación simple enseñada, non se coloca antes de sono: Non sono a casa. Las construcciones contrastivas tienen otro alcance.

**Corrección/explicación:** En la negación simple enseñada, non se coloca antes de sono: Non sono a casa. Las construcciones contrastivas tienen otro alcance.

### Actividad `it-a1-c06-01-ripara` v1

Correggi solo la negazione: «No ho una chiave».

Formato: error-correction. Opciones: [].

**Aceptadas:** ["Non ho una chiave", "Non ho una chiave."]

**Rechazadas explícitas:** ["No ho una chiave"]. Criterio exhaustivo: False.

**Ayuda:** Non es el adverbio que niega ho; no sería una respuesta separada.

**Corrección/explicación:** Non es el adverbio que niega ho; no sería una respuesta separada.

## it-a1-c10-02 — Una chiave: introduciamo qualcosa

Concepto v1; Theory `it-a1-theory-c10-02` v`theory-c10-02-1`. Abrir Biblioteca o `/concept?id=it-a1-c10-02`.

**Foco humano:** Artículo indefinido y pedido de consumición nueva; evitar que contexto admita otra intención.

**Teoría:** Cuando presentas algo que el interlocutor todavía no identifica, el indeterminado permite introducirlo. No significa que el hablante desconozca de qué objeto se trata.

- Ho una chiave introduce una llave; La chiave è qui puede continuar hablando de la misma.
- Una petición de una unidad sin identificar un ejemplar concreto usa indeterminado: Un caffè, per favore. La fórmula permite pedir sin aprender otro verbo.
- El contraste es discursivo: una penna presenta; la penna retoma o identifica. No se decide únicamente por si el nombre aparece por primera vez en la frase.

**Ejemplos exactos:**

- Un caffè, per favore. → Un café, por favor.
- Ho un biglietto. Il biglietto è qui. → Tengo un billete. El billete está aquí.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c10-02-caffe` v2

Entri in un bar e fai una nuova ordinazione. Chiedi la bevanda indicata, senza riferirti a una consumazione già identificata: ___ caffè, per favore.

Formato: cloze. Opciones: [].

**Aceptadas:** ["Un"]

**Rechazadas explícitas:** ["Il", "Uno"]. Criterio exhaustivo: False.

**Ayuda:** Un caffè, per favore es la forma neutra para solicitar una consumición nueva no identificada. Il caffè, per favore puede usarse en otros contextos con una consumición identificable; no corresponde al contexto indicado aquí.

**Corrección/explicación:** Un caffè, per favore es la forma neutra para solicitar una consumición nueva no identificada. Il caffè, per favore puede usarse en otros contextos con una consumición identificable; no corresponde al contexto indicado aquí.

### Actividad `it-a1-c10-02-chiedi` v2

Al bar, ordina «un café, por favor» con la formula senza verbo.

Formato: controlled-production. Opciones: [].

**Aceptadas:** ["Un caffè, per favore", "Un caffè, per favore.", "Un caffè per favore", "Un caffè per favore.", "Per favore, un caffè", "Per favore, un caffè.", "Per favore un caffè", "Per favore un caffè."]

**Rechazadas explícitas:** ["Il caffè, per favore"]. Criterio exhaustivo: False.

**Ayuda:** Un caffè introduce el pedido; per favore añade cortesía.

**Corrección/explicación:** Un caffè introduce el pedido; per favore añade cortesía.

## it-a1-c13-01 — Da zero a cento

Concepto v1; Theory `it-a1-theory-c13-01` v`theory-c13-01-1`. Abrir Biblioteca o `/concept?id=it-a1-c13-01`.

**Foco humano:** Elisión y grafía de números; comprobar todas las variantes enumeradas.

**Teoría:** Primero aprende las formas de 0 a 20; después combina una decena con una unidad. El italiano escribe estos compuestos en una palabra y no introduce la y española.

- Memoriza las formas de la tabla 0–20: no se obtiene diecisiete traduciendo sus partes del español.
- Desde 21, une decena y unidad: trentadue, quarantacinque. Ante uno y otto cae la vocal final de la decena: ventuno, ventotto, trentuno, trentotto.
- Tre aislado no lleva acento; los compuestos terminados en tre sí: ventitré, trentatré, novantatré.
- Las decenas son venti, trenta, quaranta, cinquanta, sessanta, settanta, ottanta y novanta; 100 es cento.

**Ejemplos exactos:**

- Ho ventotto anni. → Tengo veintiocho años.
- Due biglietti, per favore. → Dos billetes, por favor.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c13-01-zero` v1

Scegli il numero zero.

Formato: selection. Opciones: ["0", "6", "10"].

**Aceptadas:** ["0"]

**Rechazadas explícitas:** []. Criterio exhaustivo: True.

**Ayuda:** Zero representa ausencia de unidades.

**Corrección/explicación:** Zero representa ausencia de unidades.

### Actividad `it-a1-c13-01-sette` v1

Scrivi 7 in lettere.

Formato: short. Opciones: [].

**Aceptadas:** ["sette"]

**Rechazadas explícitas:** ["sete"]. Criterio exhaustivo: False.

**Ayuda:** La forma canónica de 7 es sette, con doble t.

**Corrección/explicación:** La forma canónica de 7 es sette, con doble t.

## it-a1-c20-03 — Dove vai?

Concepto v1; Theory `it-a1-theory-c20-03` v`theory-c20-03-1`. Abrir Biblioteca o `/concept?id=it-a1-c20-03`.

**Foco humano:** Destino, procedencia y ubicación: preposición exigida y alternativas naturales.

**Teoría:** La meta de un desplazamiento se expresa mediante combinaciones concretas: andare a Roma, andare in Italia, andare da Anna. Per puede señalar la dirección de un transporte.

- Con andare usa a + ciudad y a casa; in + país: vado a Roma, vado in Italia.
- Da + persona indica ir a su casa o lugar de trabajo: vado da Anna. No significa aquí salir de su casa.
- Un treno per Roma es un tren con destino a Roma. Per no sustituye automáticamente a a en vado a Roma.

**Ejemplos exactos:**

- Vado da Anna. → Voy a casa de Anna.
- Prendo un treno per Roma. → Tomo un tren para Roma.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c20-03-meta` v1

Vado ___ Roma.

Formato: selection. Opciones: ["a", "in"].

**Aceptadas:** ["a"]

**Rechazadas explícitas:** ["in"]. Criterio exhaustivo: True.

**Ayuda:** La ciudad Roma se introduce con a tras andare.

**Corrección/explicación:** La ciudad Roma se introduce con a tras andare.

### Actividad `it-a1-c20-03-correggi` v2

Vuoi andare a casa di Anna. Correggi la preposizione in «Andiamo a Anna» e scrivi tutta la frase.

Formato: error-correction. Opciones: [].

**Aceptadas:** ["Andiamo da Anna", "Andiamo da Anna."]

**Rechazadas explícitas:** ["Andiamo a Anna"]. Criterio exhaustivo: False.

**Ayuda:** Con el destino personal Anna se usa da.

**Corrección/explicación:** Con el destino personal Anna se usa da.

## it-a1-c26-01 — Come ti chiami?

Concepto v1; Theory `it-a1-theory-c26-01` v`theory-c26-01-1`. Abrir Biblioteca o `/concept?id=it-a1-c26-01`.

**Foco humano:** Reflexivos, registro de presentación y equivalencia pragmática.

**Teoría:** Chiamarsi expresa cómo se llama una persona. Mi chiamo no significa que llamo a otra persona: el pronombre forma parte de esta construcción.

- El pronombre precede al verbo conjugado: mi chiamo, ti chiami. Ambos corresponden a la misma persona.
- Para preguntar usa come: Come ti chiami? Con trato de Lei: Come si chiama?
- El sujeto puede omitirse si está claro; conserva el pronombre: siamo Marco e Anna no sustituye a ci chiamiamo Marco e Anna en un ejercicio sobre llamarse.

**Ejemplos exactos:**

- Mi chiamo Elena e sono spagnola. → Me llamo Elena y soy española.
- Come si chiama tuo fratello? → ¿Cómo se llama tu hermano?
- Ci chiamiamo Anna e Luca. → Nos llamamos Anna y Luca.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c26-01-nome` v1

Io ___ Elena (chiamarsi: pronome + verbo).

Formato: cloze. Opciones: [].

**Aceptadas:** ["mi chiamo"]

**Rechazadas explícitas:** ["chiamo"]. Criterio exhaustivo: False.

**Ayuda:** Con io se usa mi chiamo.

**Corrección/explicación:** Con io se usa mi chiamo.

### Actividad `it-a1-c26-01-domanda` v1

Come si chiede il nome a un amico? Inizia con Come e usa chiamarsi.

Formato: short. Opciones: [].

**Aceptadas:** ["Come ti chiami?", "Come ti chiami"]

**Rechazadas explícitas:** ["Come si chiama?"]. Criterio exhaustivo: False.

**Ayuda:** Un amigo tratado de tu requiere ti chiami.

**Corrección/explicación:** Un amigo tratado de tu requiere ti chiami.

## it-a1-c32-02 — Scegliere avere o essere

Concepto v1; Theory `it-a1-theory-c32-02` v`theory-c32-02-1`. Abrir Biblioteca o `/concept?id=it-a1-c32-02`.

**Foco humano:** Elección de auxiliar y concordancia; alternativas dependientes del contexto.

**Teoría:** El auxiliar se aprende con el verbo y su construcción. Tener un objeto directo suele orientar hacia avere; el significado de movimiento por sí solo no basta.

- En este repertorio: avere con lavorare, studiare, dormire, camminare y con leggere un libro, prendere il treno, bere acqua, fare colazione.
- Essere con andare a Roma, venire qui, arrivare in hotel, partire, uscire. Essere mismo forma sono stato.
- Camminare usa avere aunque implique movimiento: ho camminato. No elijas por esa etiqueta de significado.
- Con essere el participio concuerda con el sujeto; en esta ficha se proporciona ya la terminación.

**Ejemplos exactos:**

- Marco ha camminato in centro. → Marco caminó por el centro.
- Marco è andato a Roma. → Marco fue a Roma.
- Anna è partita ieri. → Anna salió de viaje ayer.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c32-02-camminare` v1

Marco ___ camminato in centro.

Formato: cloze. Opciones: [].

**Aceptadas:** ["ha"]

**Rechazadas explícitas:** ["è"]. Criterio exhaustivo: False.

**Ayuda:** Camminare usa avere en esta construcción.

**Corrección/explicación:** Camminare usa avere en esta construcción.

### Actividad `it-a1-c32-02-cammina-frase` v2

Marco racconta di ieri. Traduci al passato prossimo: «He caminado por el centro». Usa camminare e in centro, senza io.

Formato: controlled-production. Opciones: [].

**Aceptadas:** ["Ho camminato in centro", "Ho camminato in centro."]

**Rechazadas explícitas:** ["Sono camminato in centro"]. Criterio exhaustivo: False.

**Ayuda:** Movimiento no implica necesariamente essere.

**Corrección/explicación:** Movimiento no implica necesariamente essere.

## it-a1-c34-07 — Contatti e bisogni essenziali

Concepto v1; Theory `it-a1-theory-c34-07` v`theory-c34-07-1`. Abrir Biblioteca o `/concept?id=it-a1-c34-07`.

**Foco humano:** Contacto/necesidades: claridad situacional; no confundir léxico con consejo médico.

**Teoría:** Repertorio focal: telefono, messaggio, libero, appuntamento, medico, farmacia, ho mal di testa, ho la febbre y ho bisogno di aiuto. Se aprende a expresar una necesidad, no a diagnosticarla.

- Para contacto: il telefono, un messaggio. Para disponibilidad: sono libero/libera; libero concuerda con quien habla.
- Para una cita: vorrei un appuntamento. Medico es el profesional; farmacia es el establecimiento.
- Síntomas como fórmulas: ho mal di testa (me duele la cabeza), ho la febbre (tengo fiebre). Usa avere.
- Necesidad: ho bisogno di aiuto. No se da ningún consejo de tratamiento en estas tareas.

**Ejemplos exactos:**

- Vorrei un appuntamento con il medico. → Quisiera una cita con el médico.
- Sono libera alle tre. → Estoy disponible a las tres (hablante mujer).
- Ho mal di testa. → Me duele la cabeza.

Revisar además formas, notas, excepciones y errores frecuentes íntegros en el snapshot.

### Actividad `it-a1-c34-07-telefono` v1

Scrivi con articolo: «el teléfono».

Formato: short. Opciones: [].

**Aceptadas:** ["il telefono"]

**Rechazadas explícitas:** ["il messaggio"]. Criterio exhaustivo: False.

**Ayuda:** Telefono designa el medio o aparato.

**Corrección/explicación:** Telefono designa el medio o aparato.

### Actividad `it-a1-c34-07-libera` v1

Anna dice «Estoy disponible a las tres»: usa Sono + aggettivo italiano per disponible + alle tre.

Formato: controlled-production. Opciones: [].

**Aceptadas:** ["Sono libera alle tre", "Sono libera alle tre."]

**Rechazadas explícitas:** ["Sono libero alle tre"]. Criterio exhaustivo: False.

**Ayuda:** Libera concuerda con Anna.

**Corrección/explicación:** Libera concuerda con Anna.

## Reading `R01` v2 — Chi è Chiara?

Abrir `/practice?reading=R01`; si pide preparación, seguir los enlaces. Para revisión de contenido puede usarse directamente este documento sin falsear progreso.

Nome: Chiara. Città: Roma. Io sono italiana. Lui è Giorgio, un amico. Ora siamo a Milano. Giorgio è italiano. Lei è Anna, una collega spagnola.

Revisar inferencias, referentes, claridad de distractores, equivalencias válidas y ausencia de dependencias no preparadas.

**R01:R01-Q1** — Di che cosa parla la scheda?

Opciones: ["Di persone e città", "Di prezzi al bar", "Di orari di lavoro"]

Aceptadas: ["Di persone e città"]; rechazadas: ["Di prezzi al bar", "Di orari di lavoro"]

Explicación: La ficha presenta personas, sus nacionalidades y ciudades.

**R01:R01-Q2** — Dove sono ora Chiara e Giorgio?

Opciones: ["Roma", "Madrid", "Milano"]

Aceptadas: ["Milano"]; rechazadas: ["Roma", "Madrid"]

Explicación: Ora siamo a Milano indica la ubicación actual.

**R01:R01-Q3** — Chi è la collega?

Opciones: ["Anna", "Chiara", "Giorgio"]

Aceptadas: ["Anna"]; rechazadas: ["Chiara", "Giorgio"]

Explicación: Lei è Anna, una collega spagnola identifica a Anna.

## Reading `R25` v1 — Al ristorante Il Girasole

Abrir `/practice?reading=R25`; si pide preparación, seguir los enlaces. Para revisión de contenido puede usarse directamente este documento sin falsear progreso.

Ristorante Il Girasole
Menù: pasta al pomodoro; pollo con patate; insalata con tonno.
— Cliente: Vorrei un piatto senza carne e senza pesce.
— Cameriere: La pasta al pomodoro è senza carne e senza pesce. L’insalata è con il tonno.
— Cliente: Allora vorrei la pasta e, come contorno, le patate.
— Cameriere: Va bene. E da bere?
— Cliente: Acqua naturale, per favore.

Revisar inferencias, referentes, claridad de distractores, equivalencias válidas y ausencia de dependencias no preparadas.

**R25:R25-Q1** — Che tipo di piatto cerca il cliente?

Opciones: ["Senza carne e senza pesce", "Con carne e patate", "Con pesce e insalata"]

Aceptadas: ["Senza carne e senza pesce"]; rechazadas: ["Con carne e patate", "Con pesce e insalata"]

Explicación: El cliente expresa dos condiciones con senza: sin carne y sin pescado.

**R25:R25-Q2** — Perché l’insalata non va bene per il cliente?

Opciones: ["È con il tonno", "È senza patate", "È con il pomodoro"]

Aceptadas: ["È con il tonno"]; rechazadas: ["È senza patate", "È con il pomodoro"]

Explicación: El camarero indica que la ensalada lleva atún, un pescado; no cumple la petición.

**R25:R25-Q3** — Qual è l’ordine finale da mangiare?

Opciones: ["Pasta e patate", "Pollo e patate", "Insalata e pasta"]

Aceptadas: ["Pasta e patate"]; rechazadas: ["Pollo e patate", "Insalata e pasta"]

Explicación: El pedido final es pasta, con patatas como guarnición.

## Reading `R26` v1 — Il biglietto di Marta

Abrir `/practice?reading=R26`; si pide preparación, seguir los enlaces. Para revisión de contenido puede usarse directamente este documento sin falsear progreso.

Orario dei treni
Treno 214: da Parma a Bologna. Partenza 09:10; arrivo 10:00. Binario 2.
Treno 216: da Parma a Modena. Partenza 09:30; arrivo 10:05. Binario 4.
Biglietto di Marta: treno 214, da Parma a Bologna, partenza 09:10.
Marta: «Il mio biglietto è per Bologna. Il treno delle 09:30 va a Modena: non è il mio».

Revisar inferencias, referentes, claridad de distractores, equivalencias válidas y ausencia de dependencias no preparadas.

**R26:R26-Q1** — Quale treno corrisponde al biglietto di Marta?

Opciones: ["214 per Bologna", "216 per Modena", "214 per Parma"]

Aceptadas: ["214 per Bologna"]; rechazadas: ["216 per Modena", "214 per Parma"]

Explicación: El billete identifica el tren 214 y Bolonia como destino; Parma es el origen.

**R26:R26-Q2** — A che ora parte il treno di Marta?

Opciones: ["09:10", "10:00", "09:30"]

Aceptadas: ["09:10"]; rechazadas: ["10:00", "09:30"]

Explicación: Partenza indica la salida: 09:10. No se debe confundir con la llegada.

**R26:R26-Q3** — Da quale binario parte il treno indicato sul biglietto?

Opciones: ["Binario 2", "Binario 4", "Il biglietto non permette di scegliere"]

Aceptadas: ["Binario 2"]; rechazadas: ["Binario 4", "Il biglietto non permette di scegliere"]

Explicación: El número 214 del billete corresponde a la fila del horario que indica binario 2.

## Writing delimitado `W-C01` v1

Scrivi una frase per presentarti a un collega: sei Luca e sei italiano. Usa essere, scrivi il nome e la nazionalità. Puoi usare o omettere io.

**Criterio exacto:**

```json
{
  "version": "1",
  "canonVersion": "1",
  "accepted": [
    "Sono Luca e sono italiano.",
    "Sono Luca e sono italiano",
    "Io sono Luca e sono italiano.",
    "Io sono Luca e sono italiano",
    "Sono Luca, sono italiano.",
    "Sono Luca, sono italiano"
  ],
  "rejected": [
    "Io siamo Luca e siamo italiano.",
    "Io siamo Luca e siamo italiano"
  ],
  "exhaustive": false,
  "typos": [
    "Sno Luca e sono italiano."
  ]
}
```

**Explicación:** Sono Luca e sono italiano presenta nombre y nacionalidad con essere. Io es opcional. Noi requiere siamo; io requiere sono.

Revisar especialmente respuestas incompletas, fuera de consigna y válidas que no demuestran la estructura solicitada. No exigir corregir automáticamente cualquier frase libre.

## Writing abierto `it-a1-writing-presentazione` v1 — Un nuovo gruppo

Scrivi al gruppo del tuo corso di italiano. Puoi usare dati inventati.

Scrivi 3–4 frasi: saluta, indica il tuo nome e la tua città, poi saluta di nuovo.

**Modelo opcional, no respuesta aceptada:** Ciao! Sono Ana. Sono di Madrid. A presto!

**Rúbrica:**

- Consegna: Ci sono un saluto, un nome e una città?
- Struttura: Controlla essere per parlare di te e della tua città.
- Vocabolario: Le parole indicano chiaramente nome e origine?
- Organizzazione: Il saluto apre il messaggio e la chiusura viene alla fine?
- Funzione: Il gruppo può capire chi sei?
- Autonomia: indica se hai usato aiuti, un modello o altre risorse. Rileggere non è una valutazione automatica.

**Feedback:** Primero comprueba si el grupo puede identificarte. Después revisa la forma de essere y la expresión de origen; no necesitas copiar el modelo.

**Abstención:** Este mensaje abierto no recibe una nota ni una corrección automática. La autolectura y el modelo no demuestran dominio. Puedes revisarlo con la rúbrica o practicar el concepto relacionado con una actividad delimitada.

Revisar si varias soluciones naturales cumplen la consigna, si el modelo respeta sus límites y si el aviso de no evaluación se entiende.

## Writing abierto `it-a1-writing-viaggio-passato` v1 — Un piccolo viaggio

Scrivi a una persona del corso dopo un viaggio reale o inventato.

Scegli una destinazione e racconta il viaggio in 4–6 frasi. Indica chi ha viaggiato e almeno due fatti conclusi, tra cui un arrivo o una partenza.

**Modelo opcional, no respuesta aceptada:** Ciao! Ieri Anna e Luca sono arrivati a Roma. Hanno preso un autobus per il centro. Poi hanno visto il centro. La sera hanno dormito in albergo.

**Rúbrica:**

- Consegna: Sono chiari destinazione, persone e almeno due fatti, con arrivo o partenza?
- Struttura: Controlla l’ausiliare e la concordanza del participio con essere.
- Vocabolario: Le parole descrivono un viaggio semplice?
- Organizzazione: Persone, tempi e ordine dei fatti sono coerenti?
- Funzione: Il lettore capisce che cosa è successo nel viaggio?
- Autonomia: indica se hai usato aiuti, un modello o altre risorse. Rileggere non è una valutazione automatica.

**Feedback:** Comprueba que se sabe quién hizo cada acción. Después revisa la elección del auxiliar y la concordancia con essere.

**Abstención:** Este mensaje abierto no recibe una nota ni una corrección automática. La autolectura y el modelo no demuestran dominio. Puedes revisarlo con la rúbrica o practicar el concepto relacionado con una actividad delimitada.

Revisar si varias soluciones naturales cumplen la consigna, si el modelo respeta sus límites y si el aviso de no evaluación se entiende.

## Registro del revisor

Nombre/cualificación: ____ · Fecha: ____ · Dispositivo o revisión documental: ____

| ID y versión | Correcto / ambiguo / incorrecto / no revisado | Ejemplo o variante exacta | Motivo | Propuesta | Prioridad |
|---|---|---|---|---|---|
| Pendiente | No revisado | — | — | — | — |

Dictamen de la muestra: pendiente. Una aprobación de esta muestra no certifica el catálogo completo, eficacia, retención ni publicación. Adjuntar incidencias al [registro](A1_V1_VALIDATION_ISSUES.md).
