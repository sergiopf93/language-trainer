# Auditoría pedagógica A1 — 2026-10-13

Fase 5A: cobertura y correcciones focales, **no revisión editorial final ni validación empírica del aprendizaje**. Rama `feat/a1-pedagogical-audit`, baseline `c3f9019`, pack `it-A1-candidate-8` → `it-A1-candidate-9`. Todo candidate; 0 published/reviewed y 0 ready. No cambia C01–C34.

## Método y baseline

Se ejecutó `npm run content:coverage` antes de editar. Baseline: 99 Concepts, 99 Theory, 316 entradas, 849 actividades, 207 relaciones, 0 errores. [Inventario inicial conservado](A1_PEDAGOGY_BASELINE.json). El contenido exacto sigue disponible en el commit baseline. Las señales pedagógicas del snapshot se calcularon sobre ese contenido sin modificar.

Lectura de objetivos/reglas y contraste con enunciados/respuestas de los 99 conceptos; inspección adicional de paradigmas, glosas/asociaciones de las 316 entradas y las 207 relaciones. Revisión manual más detallada de instrucciones, alternativas y feedback en inicio, C09–C17, C20–C25, C29–C34. No se acredita edición exhaustiva de cada distractor/paráfrasis. Checks automáticos recorren todo el inventario.

Fuentes de diseño consultadas selectivamente: Research 02 §§2–5 (orden y prerrequisitos); Research 01 §3 (learning loop); Research 03 §§1/4 (habilidad ≠ formato); Research 04 §4 (reserva y tareas nuevas); Research 05 §§3–7 (canon, vocabulario y respuestas). Contraste léxico puntual de caro: [Treccani](https://www.treccani.it/vocabolario/caro_%28Sinonimi-e-Contrari%29/), sentido de precio frente a afecto. No se reaudita infraestructura ni se declara cobertura oral.

## 1. Progresión y hallazgos

**Juicio de diseño:** recorrido coherente como práctica focal escrita inicial, con condiciones. No basta por sí solo para acreditar un A1 utilizable de manera autónoma o estable. No hay un umbral científico de actividades por concepto.

- C01–C06 pasa de palabras/fórmulas a sujeto, paradigmas y usos. C03-02 anticipa sono/siamo antes de C04, pero los ejemplos y contexto los preparan; mantener acceso a Theory, sin reordenar Work. C04 anticipa adjetivos/preposiciones como construcciones dadas, no como sistema ya dominado.
- C07–C13 construye género/número → artículos → concordancia → grupo nominal. Determinado/indeterminado se contrastan por referencia, no solo terminación. Edad ya utiliza tres numerales antes de C13: progresión léxica paralela autorizada por la fuente.
- C14–C19 amplía paradigmas, función modal, registro y existencia. La serie de ocho irregulares C16 concentra carga; las seis personas tienen valor diagnóstico, pero no deben confundirse con transferencia por cambiar únicamente sujeto.
- C20–C25 integra relaciones espaciales/temporales, citas, posesivos y gustos. C20 prepara me/te antes de C28 y meses/horas antes de C22 dentro de expresiones; no son requisitos ocultos de una regla no explicada. C21 necesitaba vínculos al significado de preposiciones simples.
- C26–C30 integra rutina, cantidad, referencia, conectores e instrucciones. C26-02 enlazaba por error con -ere para vestirsi. Los conectores aparecen tarde como unidades, pero ya se usan con apoyo. La fuente los concibe progresivos C29/4–6; reportar su reutilización, no mover unidades arbitrariamente.
- C31–C33 separa participio, construcción, auxiliar y concordancia. Se suministran terminaciones en C32 para no evaluar C33 antes de tiempo. C32-02 tenía selección productiva débil: su tarea de camminare daba el auxiliar; corregida y contrastada con andare.
- **C34 es transversal en la fuente**, no una obligación de reservar todo el léxico hasta el final. Las asociaciones prueban presencia anterior, pero no una ruta adaptativa. Una lectura rígida de la lista como 34 lecciones cerradas sería una interpretación incorrecta; no se implementa otro scheduler.

No hay concepto con una única habilidad declarada. La ausencia de F4 en grafía, género, numerales, comprensión de instrucciones y participios está justificada; C05-01 se completa con sus conceptos de uso. Una familia o etiqueta no acredita independencia. Veinte tareas escritas estaban mal clasificadas como recuperación: nueve se reclasifican como discriminación y once como reconocimiento.

## 2. Juicio por los 99 conceptos

S = suficiente **para introducir/practicar su objetivo focal con apoyo**, M = mejorable, I = insuficiente en el aspecto concreto detectado. Son juicios de esta auditoría, no estados editoriales. La columna inicial conserva la decisión previa a corrección; “corregido” no significa dominio ni publicación. Las cinco habilidades se valoran según el objetivo y las tareas, no se exigen todas por fila.

| Concepto | Actividades antes→después | Juicio inicial | Theory ↔ Practice, facetas y decisión |
|---|---:|---|---|
| C01-01 | 11→11 | suficiente | Grafías contrastivas recuperadas en palabras y reparaciones; sin inferencia oral. |
| C01-02 | 7→7 | suficiente | e/è, sì, ciudad/café y perché: reconocimiento, recuperación y reparación pertinentes. |
| C01-03 | 7→8 | mejorable | Faltaba recuperar pena frente a penna; se añade el contraste inverso. Pala/palla ya se contrasta. |
| C02-01 | 7→7 | suficiente | Apertura, despedida, registro y buonanotte diferenciados; frases fijas justifican la reserva. |
| C02-02 | 7→7 | suficiente | Agradecer, responder, pedir atención y cortesía informal/formal se practican con funciones distintas. |
| C02-03 | 7→7 | suficiente | No entender/no saber y pedir repetición/menor velocidad están representados; no mide comprensión oral. |
| C03-01 | 10→10 | suficiente | Personas y referentes nominales/grupos cubiertos; producir un pronombre no equivale a construir una frase. |
| C03-02 | 7→8 | insuficiente | La omisión se transformaba o reconocía; se añade recuperación del referente desde contexto plural. |
| C04-01 | 18→18 | mejorable | Seis personas cubiertas; cinco salidas noi siamo se reducen a tres con dos variantes de persona/contexto. |
| C04-02 | 6→6 | suficiente | Identidad, profesión y descripción con adjetivo dado; concordancia productiva general pertenece a C11. |
| C04-03 | 7→7 | suficiente | Origen/nacionalidad, di y cambio de persona; contraste con ubicación explícito. |
| C04-04 | 7→7 | suficiente | Ubicación de persona/objeto, singular/plural y locuciones enseñadas; C19 amplía existencia. |
| C04-05 | 6→6 | suficiente | Cansancio, contento, disposición y sto bene contrastados; paradigma se recupera en contexto. |
| C05-01 | 8→8 | suficiente | Todas las personas y h; producción situada reaparece en C05-02/03/04. No exige añadir F4 propio. |
| C05-02 | 7→7 | suficiente | Sujeto distinto del número de objetos, petición situada y reparación ser/tener. |
| C05-03 | 8→8 | suficiente | Edad, pregunta, elisión y cifras; número se limita inicialmente a 20/30/40 y luego C13. |
| C05-04 | 8→8 | suficiente | Seis sensaciones y contraste sonno/stanco; fórmulas ya preparadas. |
| C06-01 | 6→6 | suficiente | Posición de non, no independiente, transformación y respuesta negativa. |
| C06-02 | 6→6 | suficiente | Pregunta escrita, signo final y perspectiva tu→io; respuesta afirmativa y negativa. |
| C06-03 | 8→8 | suficiente | Interrogativos por intención; cuándo principalmente receptivo, se reutiliza en citas. |
| C07-01 | 6→6 | suficiente | Género léxico, transferencia española y tendencia no universal; no necesita producción de frases. |
| C07-02 | 7→7 | suficiente | -e, mano/problema e insegnante; etiquetas binarias apropiadas, aunque son recuperación muy restringida. |
| C08-01 | 7→7 | suficiente | Tres clases regulares y singular/plural; mani/problemi son apoyo explícito, no faceta evaluada sistemáticamente. |
| C08-02 | 7→7 | suficiente | Acentuados, préstamos y foto; número e invariabilidad se practican sin forzar más léxico. |
| C09-01 | 9→9 | suficiente | Grupos iniciales y género cubiertos; se explicita determinado para desambiguar studente. |
| C09-02 | 9→9 | suficiente | i/gli/le, vocales y grupos especiales; repertorio gn/ps es apoyo específico, no léxico prioritario de conversación. |
| C09-03 | 6→6 | suficiente | Referente retomado y situación compartida, frente a nuevo; seis tareas tienen funciones diferentes. |
| C10-01 | 9→9 | suficiente | Forma y elisión femenina/masculina; se explicita indeterminado en la consigna duplicada. |
| C10-02 | 7→7 | suficiente | Introducir, pedir y retomar; contrasta identificación del interlocutor, no conocimiento privado del hablante. |
| C11-01 | 9→9 | suficiente | Clases -o/-e y stanchi con h explicada; concordancia transferida a grupo y predicado. |
| C11-02 | 7→7 | mejorable | Contraste vecchio amico/amico vecchio válido; nazionalita y bella dan prácticamente la respuesta: revisar retirada de apoyos. |
| C12-01 | 8→8 | suficiente | Integra artículo, número y adjetivo sin atribuir tres evidencias; plural invariable incluido. |
| C13-01 | 12→18 | insuficiente | Base léxica poco muestreada pese a 12 actividades: seis nuevas tareas sobre 12 formas, no cuota de 8. |
| C13-02 | 10→10 | suficiente | Centenas productivas y excepciones centottanta/centotto/-tré; no exige un ítem por cada centena regular. |
| C13-03 | 8→8 | suficiente | Precio, edad, cantidades y teléfono con cero; contextos diferenciados y unidades explícitas. |
| C14-01 | 11→11 | suficiente | Seis personas y studiare; construye residencia/trabajo con formas enseñadas. |
| C14-02 | 7→7 | suficiente | Elegir estudiar/trabajar/residir, habitualidad y negación; siete tareas suficientes para uso focal. |
| C15-01 | 11→11 | suficiente | Seis personas de leggere y transferencia a prendere; contrasta -are/-ere. |
| C15-02 | 9→9 | suficiente | Paradigma dormire, voi y ausencia de -isc-; reparación y uso en vivienda. |
| C15-03 | 9→9 | suficiente | Alternancia -isc- con noi/voi y contraste dormire; non capisco vuelve como estructura. |
| C16-01 | 9→9 | suficiente | Seis formas irregulares y expresiones fare; variación de persona deliberada. |
| C16-02 | 9→9 | suficiente | Paradigma y destino; elección andare/venire se contrasta en C16-04, no exigir todo en cada concepto. |
| C16-03 | 9→9 | suficiente | Bienestar/permanencia frente a essere; dos enlaces apuntaban a usos incorrectos y se corrigen. |
| C16-04 | 9→9 | suficiente | Deixis explicada en cada contexto; traducción española no decide sola venire. |
| C16-05 | 9→9 | suficiente | Paradigma, destinatario y acento dà; sin sistema de clíticos prematuro. |
| C16-06 | 9→9 | suficiente | Base bev-, personas y negación; objetos simples reutilizados. |
| C16-07 | 9→9 | suficiente | Dite y expresiones con dire, contraste parlare/dare; práctica contextual suficiente para forma focal. |
| C16-08 | 9→9 | suficiente | Alternancia esc-/usc- y construcciones conocidas; no depende del futuro pasado. |
| C17-01 | 11→11 | suficiente | Paradigma + infinitivo, permiso/posibilidad/petición; no solo rellenar seis formas. |
| C17-02 | 11→11 | suficiente | Deseo, negación y registro, contrastado con posibilidad; vorrei se reserva como fórmula posterior. |
| C17-03 | 11→11 | suficiente | Obligación, variantes debbo/debbono y negación contextual; acepta límites del significado negativo. |
| C18-01 | 8→8 | suficiente | Vorrei con nombre/infinitivo y contraste voglio; comparación escrita se reclasifica como discriminación. |
| C18-02 | 8→8 | suficiente | Tu/Lei, verbo y fórmula de atención; referencia usted/ella se reclasifica. |
| C19-01 | 8→8 | suficiente | Singular/plural, grafía, negación y pregunta; se añade vínculo de preparación a essere. |
| C19-02 | 8→8 | suficiente | Existencia frente a localización sin prohibir determinado; identificación de intención no es retrieval. |
| C20-01 | 8→8 | suficiente | Origen/procedencia, pertenencia, materia y cámara da letto tienen práctica. |
| C20-02 | 8→8 | suficiente | Locuciones, superficie y tra/fra; se deja de llamar corrección a reformular Sono in casa. |
| C20-03 | 8→8 | suficiente | Ciudad/país/persona y transporte; destino/procedencia se discriminan explícitamente. |
| C20-04 | 8→8 | suficiente | Compañía y pronombres tónicos preparados en ficha, antes de C28; no es salto sin explicación. |
| C20-05 | 8→8 | suficiente | Destinatario/finalidad y contraste modal sin per; infinitivo explicado y practicado. |
| C20-06 | 8→8 | suficiente | Duración, continuidad, plazo, mes y momento; comprensión de in due ore se reclasifica. |
| C21-01 | 10→10 | suficiente | Fusiones por artículo, elisión y separación de per; añadir enlaces a significado de preposición simple. |
| C21-02 | 8→8 | suficiente | Elección según construcción/referencia, ambas formas hotel válidas; variantes de sujeto aceptadas. |
| C22-01 | 9→16 | insuficiente | 19 días/meses enseñados con muestreo escaso; siete tareas nuevas combinan recuperación y asociación. |
| C22-02 | 9→9 | suficiente | Hora actual/evento, una/plural, fracciones y 24 h; che ora è/che ore sono aceptadas. |
| C22-03 | 8→8 | suficiente | Adverbios y periodicidad, non…mai y orden fijado; identificar hábito se reclasifica. |
| C22-04 | 8→8 | suficiente | Cita con disponibilidad, fecha y hora; incompatibilidad semántica explícita, producción muy guiada. |
| C23-01 | 9→9 | suficiente | Poseedor frente a poseído y loro; no se exige cada celda de tabla. Ambigüedad se discrimina. |
| C23-02 | 8→8 | mejorable | Singular/plural/loro/modificador; madre daba mia, se exige ahora escoger el grupo completo. |
| C24-01 | 8→8 | mejorable | Cuatro formas y uso pronominal; penna deja de ofrecer questa/questo dentro del supuesto retrieval. |
| C24-02 | 9→9 | suficiente | Quel/quello/quell y plural, autónomo quello; distancia está especificada. |
| C25-01 | 8→8 | suficiente | Infinitivo, negación y destinatario; identificar mi como a mí se discrimina. |
| C25-02 | 8→8 | suficiente | Singular/plural frente a infinitivo y destinatario; forma de lo gustado gobierna concordancia. |
| C26-01 | 8→8 | suficiente | Personas y tratamiento, no solo mi chiamo; sujeto explícito añadido como alternativa válida. |
| C26-02 | 9→9 | suficiente | -are/-ire, pronombre, negación y hora; prerequisite corregido a dormire, variante noi aceptada. |
| C27-01 | 8→8 | suficiente | Medida/recipiente, di y apóstrofo; variantes d’acqua ya previstas. |
| C27-02 | 8→8 | suficiente | Nombre/verbo/adjetivo distinguidos; pocas formas siguen el patrón sin cuota por celda. |
| C27-03 | 8→8 | suficiente | No contable/plural, cantidad frente a pertenencia y numeral; no plural universal de un. |
| C28-01 | 8→8 | suficiente | Pronombres tónicos reutilizan C20 y se aplican a referencia explícita; límites de invitación para 5B. |
| C28-02 | 9→9 | suficiente | Cuatro clíticos, referente, posición y negación; identificación receptiva reclasificada y sujeto io admitido. |
| C29-01 | 8→8 | suficiente | Unión de nombres y frases; e repetida es objetivo funcional, localizar la palabra no es retrieval. |
| C29-02 | 8→8 | mejorable | Contraste y negativa; caro como precio carecía de glosa/apoyo: se corrigen léxico y Theory. |
| C29-03 | 8→8 | suficiente | Causa y dirección semántica; copiar motivo se reclasifica, variante io en traducción. |
| C29-04 | 8→8 | suficiente | Orden de hechos y contraste con causa; copiar segunda acción se reclasifica. |
| C30-01 | 8→8 | suficiente | Comprensión de instrucciones y secuencia; tareas de copia pasan a reconocimiento, sin fingir producción. |
| C30-02 | 9→9 | suficiente | Tu/voi, negativo e irregulares acotados; las formas están preparadas explícitamente. |
| C31-01 | 8→8 | suficiente | Tres familias de participio y límite sin auxiliar; localizar recibido no acredita recuperación. |
| C31-02 | 10→10 | suficiente | Ocho participios frecuentes y homógrafo letto; repetición de formato justificada por repertorio. |
| C32-01 | 9→9 | suficiente | Persona del auxiliar + participio, negación y essere con concordancia suministrada; una oportunidad focal. |
| C32-02 | 10→11 | mejorable | Auxiliar por construcción, no movimiento; se retira Ho suministrado y se añade contraste productivo con andare. |
| C32-03 | 9→9 | suficiente | Hábito/hecho, tiempo y secuencia; copiar el hecho pasado se reclasifica. Relato aún guiado. |
| C33-01 | 10→10 | suficiente | Cuatro concordancias, grupo mixto, personas y contraste avere; formas base preparadas en C31/32 y vocabulario. |
| C34-01 | 10→10 | suficiente | Personas/familia y presentación integran usos anteriores; geografía como pista de nacionalidad va a 5B. |
| C34-02 | 10→10 | suficiente | Habitaciones, muebles y petición singola/doppia; repertorio focal practicado, poca transferencia nueva. |
| C34-03 | 11→11 | suficiente | Alimentos, envase/medida y cuenta; formas léxicas nuevas limitadas, sin restaurante abierto completo. |
| C34-04 | 10→10 | suficiente | Prendas, talla y color invariable blu; forma y petición practicadas; no asegura resolver una compra completa. |
| C34-05 | 10→10 | suficiente | Nombre/verbo y actividades/ocio; asociación no acredita todos los sentidos de estudio/trabajo. |
| C34-06 | 11→11 | suficiente | Destino, transporte, horario y alojamiento; arrivo suministrado y città invariable son apoyos, no transferencia. |
| C34-07 | 11→11 | mejorable | Disponibilidad/cita y necesidades por fórmulas; libre deja de copiarse y sujeto io añadido a síntoma. |

Los **21 con 6–7 actividades** iniciales: 18 suficientes para su objetivo focal; C01-03 y C11-02 mejorables; C03-02 insuficiente en recuperación contextual. Se añade solo una actividad a C01-03 y una a C03-02. C11-02 queda señalado para decidir en 5B cómo retirar apoyos sin convertir posiciones válidas en errores. Ninguno se amplía por alcanzar un mínimo numérico.

Fuera de esos 21, debilidades especialmente relevantes: C13-01 y C22-01 (muestreo léxico insuficiente), C04-01 (redundancia), C23-02/C24-01/C34-07 (respuesta suministrada), C29-02 (sentido léxico sin preparar), C32-02 (auxiliar suministrado). La reclasificación de habilidades afecta además a otros conceptos con práctica suficiente; no implica que todo ese concepto sea insuficiente.

## 3. Correcciones e inventario de cambios

**16 nuevas, 0 eliminadas, 38 modificadas** en contenido, criterio o habilidad; se excluye de ese cómputo la actualización transversal de pack/trace/canon. Nuevas: C01-03 +1; C03-02 +1; C13-01 +6; C22-01 +7; C32-02 +1. No hay nuevo léxico, conceptos, familias, dependencias ni UI.

Las 38 actividades existentes cambian a versión 2, también el criterio. Los IDs se mantienen. Los fixtures del motor siguen intactos; solo dos variantes del curso activo cambian mediante `courseFixture`. Teoría C29-02 recibe revisión propia; cuatro glosas reciben versión 2. El alcance conceptual no se amplía y conserva versión de Concept. Sesiones anteriores guardan sus instantáneas; no se recalifican hechos históricos.

## 4. Distribución de habilidades

Orden: reconocimiento / recuperación / discriminación / transformación / producción controlada. Conteos de oportunidades, no de respuestas posibles, tokens o competencias dominadas. Templates sustituyen a su fuente; no se cuentan dos veces.

| Tramo | Antes | Después |
|---|---|---|
| C1–C10 | 44 / 93 / 21 / 29 / 38 | 44 / 95 / 21 / 29 / 38 |
| C11–C17 | 22 / 107 / 21 / 26 / 30 | 25 / 110 / 21 / 26 / 30 |
| C18–C25 | 22 / 61 / 11 / 44 / 44 | 25 / 56 / 20 / 44 / 44 |
| C26–C32 | 2 / 81 / 5 / 36 / 29 | 13 / 70 / 5 / 36 / 30 |
| C33–C34 | 0 / 50 / 0 / 4 / 29 | 0 / 50 / 0 / 4 / 29 |
| Total | 90 / 392 / 58 / 139 / 170 | 107 / 381 / 67 / 139 / 171 |

El reconocimiento inicial no domina (44/225). Las tareas posteriores exigen más recuperación, transformaciones y frases, pero **no hay una retirada monótona y demostrada de apoyos**. El aumento final de reconocimiento/discriminación corrige metadata, además de introducir seis asociaciones útiles de repertorio. No es retroceso del alumno ni objetivo de porcentajes uniformes. El reporte señala 55 producciones con piezas suministradas/opciones; es un mínimo heurístico, no auditoría completa de scaffolding. C33/C34 conserva mucha traducción o léxico guiado: no acredita escritura autónoma.

## 5. Repetitividad

El único enunciado exactamente duplicado (studente, C09/C10) ahora especifica el tipo de artículo. La repetición del sustantivo tiene valor de contraste, la consigna indistinguible no lo tenía. Cinco salidas noi siamo consecutivamente reutilizadas en C04-01 pasan a tres: recuperación, ordenación y reparación pueden compartir respuesta con demandas distintas. Transformación usa tu sei y traducción lei è qui.

Se conservan seis personas verbales cuando comprueban alternancias; e como conector y è como auxiliar reaparecen legítimamente. C32-02 continúa con varias respuestas è, ahora con contraste productivo camminare/andare. Una respuesta repetida no es por sí sola duplicación sin valor. El análisis de frase similar es manual por patrones; no se pretende resolver equivalencia semántica con un hash.

## 6. Theory ↔ Practice

Las 99 fichas tienen reglas/ejemplos y práctica conectada. No se detecta una regla focal nueva exigida sin preparación en las muestras contrastadas. Sí se corrigen: sentido de precio de caro ausente de la glosa/preparación; respuesta mia/libero dada literalmente; alternativas visibles en questo/questa; tarea de auxiliar que daba Ho; formulación engañosa de corrección de Sono in casa. Se agrega apoyo léxico de caro/bello a C29-02.

Las tablas de números/calendario excedían su muestreo real: se amplían oportunidades, sin prometer practicar cada forma en cada habilidad. Otras tablas (35 preposiciones articuladas, posesivos, paradigmas) se muestrean por regla/faceta: no se necesita un ejercicio por celda. Variantes periféricas, mam(m)a/papà, posiciones marcadas de adjetivos y sentidos de léxico de apoyo no quedan certificados por estar explicados. C11-02 sigue con apoyo excesivo en dos tareas.

## 7. Vocabulario

316→316 entradas, sin huérfanas por asociación y sin lemas exactamente duplicados en el inventario. Homografía legítima: artículo/pronombre, letto nombre/participio, lavoro/studio verbo/nombre; no fusionar sentidos por coincidencia gráfica. Caro añade precio; italiano/spagnolo añaden lengua; avere añade uso auxiliar ya presente. Sin eliminaciones por baja frecuencia. Scimmia, gnocco y psicologo tienen función de contraste gráfico/artículo, con glosa: no se presentan como prioridad comunicativa universal.

El detector de superficie baja de **36 a 18 entradas sin coincidencia** y sube de 95 a 110 con coincidencias en un único concepto: introducir práctica del calendario convierte ausencias en uso localizado, no en transferencia. No es cobertura semántica ni lematización. Ghiaccio/scimmia se completan por grupos; artículos son entradas compuestas; verbos comprare/invitare/tornare aparecen flexionados. Son falsos negativos conocidos, no huérfanos pedagógicos. Dieci/quaranta y algunas centenas tienen poca práctica explícita como palabra completa: reserva productiva posterior, sin necesidad de eliminar entradas ni completar una cuota automática.

Se revisó carga léxica en las muestras: predomina vocabulario ya preparado o glosado. Quedan para 5B consignas iniciales italianas complejas (p. ej. C02-03-intenzione), ambigüedad de referentes (C34-01-fratello) y geografía como pista de nacionalidad (C34-01-nazionalita). Las coincidencias mixtas italiano/español y cognados no prueban reutilización objetivo. Ver JSON del reporte para IDs de todas las señales.

## 8. Knowledge Graph

207→210 relaciones. Retargets comprobados:

- C11-01 refuerza C04-02 (descripción), antes C04-04 (ubicación).
- C16-03 contrasta C04-05 (estados), antes C04-04.
- C16-03 contrasta C04-04 (localización), antes C04-03 (origen).
- C26-02 prepara vestirsi con C15-02 (-ire), antes C15-01 (-ere).

Tres enlaces nuevos: C19-01→C04-01; C21-01→C20-01 y C20-02. Explican construcción y significado, no aumentan métrica sin propósito. Sin nodos aislados, relaciones exactas duplicadas, ciclos de prerequisite (incluidos recommended) ni prerequisites hacia unidades posteriores. Contrastes/relaciones de apoyo pueden cruzar el orden y no son hard locks. El grafo no pretende enumerar todas las dependencias incidentales de cada frase.

## 9. Accepted answers y typo policy

Se amplían variantes inequívocas de sujeto explícito y punto final en nueve actividades: C20-02-hotel, C20-03-casa, C20-04-traduci, C21-02-origine, C26-01-presenta, C26-02-traduce, C28-02-traduci, C29-03-traduci, C34-07-testa. No se cambia normalización ni se acepta una persona distinta. C23-02 cambia criterio acorde con la nueva petición de grupo completo.

Se conserva `correct` ✓; `typo` ✕ separado; `linguistic-error` ✕; `not-evaluable`; vacío `no-opportunity`. Única declaración de typo: noe→noi; voi sigue siendo error lingüístico. Acentos/apóstrofos permanecen significativos, los rechazos conocidos prevalecen sobre typo y las respuestas abiertas no enumeradas no se fuerzan a error. Sin conflictos normalizados accepted/rejected/typos. No se crea diccionario de erratas ni se hace más permisivo el evaluador.

No se declara completa la aceptación de todas las paráfrasis. Para 5B: traducciones ambiguas (ser/estar, destino vs procedencia), puntuación y sujeto omitido en otras consignas; invitación C28-01-invito que solo acepta interrogativa; C29-02-traduci con posible omisión de segundo è. Revisar intención antes de ampliar criterios. Las listas grandes C05-03-trenta y C34-01-professione reflejan variantes ortográficas/gramaticales legítimas, no aceptación universal.

## 10. Cobertura comunicativa escrita

| Uso A1 dentro del alcance | Evidencia focal | Límite |
|---|---|---|
| Presentarse | C04-02/03, C05-03, C26-01, C34-01 | Perfil/frases, no presentación libre sostenida |
| Personas y familia | C11, C23, C34-01 | Posesión, parentesco y descripción guiada |
| Describir | C11/12, C19, C34-02/04 | Grupos y frases, no descripción extensa |
| Gustos | C25 y C34-05 | Infinitivo y entidad singular/plural |
| Pedir/informar | C02, C06, C17/18, C34-06/07 | Fórmulas y preguntas acotadas |
| Tiempo/horarios | C13, C20-06, C22, C34-06 | Fecha/hora y cruce de disponibilidad |
| Rutinas | C14, C16, C22-03, C26-02 | Acciones y frecuencia, sin diario autónomo |
| Lugares | C04-04, C19–21, C30-01, C34-06 | Ubicar, destino e indicaciones escritas |
| Cantidades | C13, C27, C34-03 | Compra y medidas con datos dados |
| Necesidad/deseo | C05-04, C17/18, C34-07 | Peticiones y fórmulas de ayuda |
| Pasado previsto | C31–33 | Construcción, auxiliar y concordancia en relato guiado |
| Conectar frases | C29 y C32-03 | Añadir, contrastar, causa y sucesión |

Todos tienen práctica focal escrita; eso no acredita desempeño global, Reading completo, Writing libre ni listening/speaking/pronunciation.

## 11. Tooling y coverage final

`npm run content:pedagogy` da una fila compacta por concepto; `-- --json` incluye detalle de habilidades, familias, Theory, relaciones, vocabulario, contextos, facetas y señales. `-- --input ruta-al-pack.json --json` permite comparar un pack anterior. Los patrones de respuesta de las seis asociaciones nuevas se varían para no enseñar una permutación fija. El baseline compacto es un informe, no un LanguagePack para ese argumento.

Flags: reserva pequeña, ausencia explícita de retrieval, habilidad única, etiqueta de faceta sin tarea, respuesta visible, producción con piezas, duplicado exacto y relaciones ausentes. Vocabulario: asociación huérfana y coincidencias de superficie escasas/ausentes. Grafo: ciclos incluso recommended, duplicados y dependencias hacia adelante. Accepted answers: conflictos tras normalización. Sin pedagogy score ni aprobación automática. El detector de respuesta visible usa límites de palabra pero no distingue cognados o flexión invariable: se requiere inspección.

**Final: 99/99 Concepts, 99 Theory, 316 entradas, 865 actividades, 210 relaciones; F1/F2/F3/F4/F7; 0 errores estructurales; todo candidate; 0 ready/published.**

## 12. Flags pendientes para 5B

- Lectura y evaluación editorial independiente de naturalidad, paráfrasis, glosas y distractores; casos concretos arriba.
- Retirada de apoyo en C11-02 y en producción con piezas dadas; la independencia de Evidence significa ausencia de pista/reintento/exposición registrada, no creación libre de la respuesta.
- Reserva para comprobación diferida nueva y mezcla de construcciones. No existe una reserva certificada; no confundir repetición de actividad con retención.
- C13-01/C22-01 mejoran repertorio pero siguen necesitando observación de transferencia y práctica espaciada. C34 es repertorio focal; no valida todas las combinaciones/sentidos.
- Confirmación humana del ritmo C16 y de la integración transversal de C34, sin alterar silenciosamente Work.

## 13. Pruebas

259 pruebas locales correctas (252 previas + 7 pruebas del reporte/regresiones); 150 pruebas afectadas repetidas tras variar las asociaciones; typecheck y formato correctos. Coverage, referencias, canon/accepted answers, provenance, graph, Exercise Engine, Evidence y sesiones históricas incluidos. Nuevas pruebas cubren señales explicables, conteo sin duplicar templates, ciclos recommended, colisiones normalizadas, habilidades mal etiquetadas, variantes y política typo. Las expectativas históricas de conteo/versionado se actualizan al nuevo inventario; no se añade un test por concepto.

Build normal y candidate correctos; **21 E2E candidate + 1 E2E de exclusión en producción**, incluyendo sesiones, ayudas, typo, offline, sincronización entre navegadores y cambios de las variantes de essere. La prueba de producción se omite deliberadamente en la pasada candidate y se ejecuta por separado. Bundle candidate: 675,06 kB minificados / 146,92 kB gzip; aviso >500 kB conservado.

## 14. Limitaciones

Juicio de diseño y muestreo lingüístico, sin estudiantes ni estudio de eficacia. No editorial exhaustiva, certificación oficial o validación humana final. Cloudflare remoto/nativo no ejecutado ni necesario para esta fase; E2E local usa Worker/SQLite. Aviso de bundle permanece sin optimización. Ningún contenido se publica.

## 15. Git y trazabilidad

Rama creada desde main e incorporada por fast-forward la cadena curricular existente hasta c3f9019 para continuar el trabajo sin pérdida. Main intacta. Commits separados para correcciones, reporte/tests y documentación; sin push, merge a main ni despliegue. Las listas exactas de cambios están en Git y en el diff de la fase.

## 16. Siguiente fase

Validación humana de estos hallazgos y después 5B editorial acotada, con autorización. No iniciada. Reading/Writing completos, Review avanzado y publicación conservan sus fases propias. Detenerse aquí.
