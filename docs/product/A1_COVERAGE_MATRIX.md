# Matriz de cobertura — V1 italiano A1 completo

Estado: inventario de V1 conservado. C01–C25 implementados como contenido candidate para estudio y práctica focal; no publicado ni validado editorialmente. Fuente de alcance: [Research 02](../research/02_Italian_A1_Curriculum.md). Las casillas CC continúan pendientes: la carga técnica no acredita por sí sola todo el contrato de V1.

## Inventario y uso de la checklist

**34 Topics y 99 Concepts evaluables propuestos.** Cada C01–C34 conserva un Topic `it-a1-tXX` para auditar la fuente. Pueden agruparse en navegación por área/función sin crear otros Concepts ni puntuar el Topic. ID `it-a1-cXX-NN` estable y con versión semántica; no reutilizar para otra capacidad. No existe un Concept por celda de paradigma, palabra o ejercicio. Un Topic amplio permite seleccionar subalcance o practicar el grupo.

La casilla individual solo se marca cuando todo el contrato CC esté verificado para ese Concept con enlaces a artefactos y comprobaciones. Hoy todas están pendientes. Durante desarrollo se mantendrá una ficha CC por Concept: marcar un Topic no acredita sus hijos. Cambiar inventario requiere actualizar total, trazabilidad y decisiones, nunca eliminar capacidades silenciosamente.

| Fuente | Topic | Concepts |
|---|---|---:|
| C01 | it-a1-t01 | 3 |
| C02 | it-a1-t02 | 3 |
| C03 | it-a1-t03 | 2 |
| C04 | it-a1-t04 | 5 |
| C05 | it-a1-t05 | 4 |
| C06 | it-a1-t06 | 3 |
| C07 | it-a1-t07 | 2 |
| C08 | it-a1-t08 | 2 |
| C09 | it-a1-t09 | 3 |
| C10 | it-a1-t10 | 2 |
| C11 | it-a1-t11 | 2 |
| C12 | it-a1-t12 | 1 |
| C13 | it-a1-t13 | 3 |
| C14 | it-a1-t14 | 2 |
| C15 | it-a1-t15 | 3 |
| C16 | it-a1-t16 | 8 |
| C17 | it-a1-t17 | 3 |
| C18 | it-a1-t18 | 2 |
| C19 | it-a1-t19 | 2 |
| C20 | it-a1-t20 | 6 |
| C21 | it-a1-t21 | 2 |
| C22 | it-a1-t22 | 4 |
| C23 | it-a1-t23 | 2 |
| C24 | it-a1-t24 | 2 |
| C25 | it-a1-t25 | 2 |
| C26 | it-a1-t26 | 2 |
| C27 | it-a1-t27 | 3 |
| C28 | it-a1-t28 | 2 |
| C29 | it-a1-t29 | 4 |
| C30 | it-a1-t30 | 2 |
| C31 | it-a1-t31 | 2 |
| C32 | it-a1-t32 | 3 |
| C33 | it-a1-t33 | 1 |
| C34 | it-a1-t34 | 7 |

## Control de carga — lote C01–C05

Baseline reproducible: commit `c703c4a`, pack `it-A1-candidate-3`: **2/99 Concepts, 2 Theory, 14 actividades, 4 entradas léxicas, 0 ready**. Después: pack `it-A1-candidate-4`, **17/99 Concepts, 17 Theory, 138 actividades, 74 entradas léxicas, 0 ready**. Los dos Concepts existentes se amplían; se añaden 15. Todo sigue candidate. Coverage: `npm run content:coverage` o `npm run --silent content:coverage -- --json`.

| Bloque | Concepts antes → después / esperados | Theory antes → después | Actividades antes → después | Vocabulario asociado antes → después | Familias actuales |
|---|---|---|---|---|---|
| C01 | 0 → 3 / 3 | 0 → 3 | 0 → 25 | 0 → 23 | F1, F2, F3 |
| C02 | 0 → 3 / 3 | 0 → 3 | 0 → 21 | 0 → 17 | F1, F2, F4, F7 |
| C03 | 1 → 2 / 2 | 1 → 2 | 3 → 17 | 3 → 9 | F1, F2, F3, F4 |
| C04 | 1 → 5 / 5 | 1 → 5 | 11 → 44 | 1 → 26 | F1, F2, F3, F4, F7 |
| C05 | 0 → 4 / 4 | 0 → 4 | 0 → 31 | 0 → 24 | F1, F2, F3, F4, F7 |

El vocabulario se comparte: no sumar sus columnas para obtener el total. Todos los Concepts del lote tienen reglas, ejemplos, práctica guiada y recuperación/producción restringida, feedback y Evidence. `coverage=complete` se refiere al objetivo focal declarado del lote; no sustituye revisión editorial, validación humana ni CC1–CC10. Habilidades observadas: reconocimiento, recuperación, discriminación, transformación y producción controlada según el objetivo. Sin afirmación de retención ni evaluación oral. Al cierre de aquel lote, C06–C34 sumaban **82 Concepts ausentes**; el siguiente control registra la ampliación C06–C10.

## Control de carga — lote C06–C10

Baseline conservado: commit `9e2c0f9`, pack `it-A1-candidate-4`: **17/99 Concepts, 17 Theory, 138 actividades, 74 entradas léxicas, 0 ready**. Resultado: pack `it-A1-candidate-5`: **29/99 Concepts, 29 Theory, 225 actividades, 96 entradas léxicas, 0 ready**. Se añaden los 12 Concepts previstos, sin alterar el inventario esperado de 99. Coverage inicial y final sin errores, ejecutado con Node 22.23.3; el Node antiguo del terminal no ejecutaba el script.

| Bloque | Concepts añadidos / esperados | Theory añadidas | Actividades añadidas | Entradas asociadas | Familias |
|---|---|---|---|---|---|
| C06 | 3 / 3 | 3 | 20 | 21 | F1, F2, F3, F4, F7 |
| C07 | 2 / 2 | 2 | 13 | 13 | F1, F2, F3 |
| C08 | 2 / 2 | 2 | 14 | 16 | F1, F2, F3, F4 |
| C09 | 3 / 3 | 3 | 24 | 14 | F1, F2, F3, F4 |
| C10 | 2 / 2 | 2 | 16 | 14 | F1, F2, F3, F4 |

22 entradas nuevas y 25 anteriores reutilizadas; las asociaciones por bloque se solapan. Los 2 templates y sus 9 variantes previos se conservan: las 87 actividades nuevas son explícitas, sin productos combinatorios ni nuevos templates. Distribución de las nuevas actividades por formato: 28 selection, 17 cloze, 14 short, 7 transformation, 9 error-correction, 10 controlled-production, 1 translation, 1 ordering. Familias: F1 28, F2 31, F3 16, F4 11, F7 1. Habilidades: reconocimiento 17, recuperación 31, transformación 16, producción controlada 12 y discriminación 11.

28 relaciones nuevas entre conceptos: preparación recomendada, relaciones, contrastes y refuerzos; sin bloqueos. C01–C05 mantienen sus 17 fichas y 138 actividades, sin correcciones de sus enunciados. Cambios compartidos necesarios: asociaciones léxicas al lote, formas plurales versionadas de letto/casa/città/caffè/hotel y versión/procedencia del pack. Los hechos y las instantáneas de sesiones anteriores no se reescriben.

Todo sigue **candidate**, incluidos los lotes anteriores; no hay contenido reviewed/published. La presencia y `coverage=complete` describen el alcance focal escrito, no revisión editorial, dominio ni cumplimiento íntegro de CC1–CC10. Al cierre de aquel lote quedaban **70 Concepts ausentes, todos en C11–C34**. El siguiente control registra la ampliación autorizada C11–C17. Reading/Writing extensos, Review avanzado y evaluación oral quedan fuera de este bloque.

## Control de carga — lote C11–C17

Baseline ejecutado y conservado: commit `d970489`, pack `it-A1-candidate-5`: **29/99 Concepts, 29 Theory, 225 actividades, 96 entradas léxicas, 0 ready**. Resultado: pack `it-A1-candidate-6`: **51/99 Concepts, 51 Theory, 431 actividades, 172 entradas léxicas, 0 ready**. Se añaden exactamente los 22 conceptos previstos para C11–C17, manteniendo los 34 bloques y 99 conceptos de V1. La columna Cxx / tramo de Research 02 no es un recuento de conceptos; no se detectó discrepancia con la matriz granular. Coverage inicial/final sin errores con Node 22.23.3; el Node antiguo por defecto no admite el script.

| Bloque | Concepts añadidos / esperados | Theory añadidas | Actividades añadidas | Entradas asociadas | Familias |
|---|---|---|---|---|---|
| C11 | 2 / 2 | 2 | 16 | 18 | F1, F2, F3, F4, F7 |
| C12 | 1 / 1 | 1 | 8 | 13 | F1, F2, F3, F4, F7 |
| C13 | 3 / 3 | 3 | 30 | 44 | F1, F2, F3, F4 |
| C14 | 2 / 2 | 2 | 18 | 11 | F1, F2, F3, F4 |
| C15 | 3 / 3 | 3 | 29 | 18 | F1, F2, F3, F4 |
| C16 | 8 / 8 | 8 | 72 | 39 | F1, F2, F3, F4 |
| C17 | 3 / 3 | 3 | 33 | 25 | F1, F2, F3, F4 |

**76 entradas nuevas y 38 anteriores reutilizadas**, con asociaciones compartidas que no deben sumarse entre bloques. Los numerales incluyen el repertorio 0–20, decenas y centenas; las formas verbales se agrupan por lema, no por entrada independiente. Se conservan **2 templates / 9 variantes**; las 206 actividades nuevas son explícitas, sin generación combinatoria en runtime. Formatos añadidos: selection 43, cloze 85, short 22, transformation 18, error-correction 8, controlled-production 19, ordering 2, translation 9. Familias: F1 43, F2 107, F3 26, F4 28, F7 2. Habilidades: reconocimiento 22, recuperación 107, transformación 26, producción controlada 30, discriminación 21. No se fuerza producción de frases para evaluar recuperación de un numeral.

**55 relaciones nuevas**, 33 hacia C01–C10: prerequisite 28 (siempre recommended), reinforces 10, related 4 y contrast 13; total del grafo 104. Incluyen género/número→adjetivo, artículos/adjetivo→grupo nominal, avere→edad, personas→verbos, essere/stare, andare/venire y contraste entre modales. Una actividad integrada mantiene un único concepto objetivo; aparecer como contexto no atribuye evidencia negativa a otros conceptos.

C01–C10 conservan sus 29 Theory y 225 actividades, IDs, versiones y criterios lingüísticos. Solo se amplían asociaciones léxicas y metadatos de versión/procedencia del pack; no hay revisión editorial del contenido previo. No se modifica UI, evaluación, persistencia, mastery/review ni infraestructura.

Validación: **139 pruebas locales** (137 de la batería completa y repetición de las 65 pruebas curriculares afectadas tras añadir dos casos de atribución), typecheck, formato, builds normal/candidate, **18 E2E candidate + 1 E2E de exclusión en producción**; el caso de producción se omite intencionalmente durante la ejecución candidate y se ejecuta por separado. Integración Theory→práctica→Evidence de cada concepto, respuestas alternativas, errores/acento, abstención/vacío, ayudas/reintentos, procedencia/versiones, regresiones C01–C10 y offline/sync; captura C17 inspeccionada a 320 px. Sin incidencias abiertas en estas comprobaciones.

Todo permanece **candidate**, nada reviewed/published. `coverage=complete` acredita aquí el alcance focal escrito implementado, no publicación ni todo CC1–CC10. **48 Concepts pendientes, C18–C34**; C18 no iniciado. Pendientes validación manual del usuario y revisión editorial independiente; Reading/Writing extensos y Review avanzado fuera de este lote. Cloudflare nativo/remoto no ejecutado. Siguiente lote recomendado: **C18–C22**, sujeto a autorización.

## Control de carga — lote C18–C25

Baseline ejecutado: commit `94c920b`, pack `it-A1-candidate-6`: **51/99 Concepts, 51 Theory, 431 actividades, 172 entradas léxicas, 0 ready**. Resultado: pack `it-A1-candidate-7`: **73/99 Concepts, 73 Theory, 613 actividades, 234 entradas léxicas, 0 ready**. Se añaden los 22 conceptos previstos sin cambiar V1: 34 bloques/99 conceptos. Coverage inicial y final sin errores con Node 22.23.3; el Node antiguo de la terminal no ejecuta el script.

| Bloque | Concepts nuevos | Theory nuevas | Actividades nuevas | Entradas vinculadas (compartidas) |
|---|---:|---:|---:|---:|
| C18 | 2 | 2 | 16 | 21 |
| C19 | 2 | 2 | 16 | 12 |
| C20 | 6 | 6 | 48 | 49 |
| C21 | 2 | 2 | 18 | 20 |
| C22 | 4 | 4 | 34 | 48 |
| C23 | 2 | 2 | 17 | 19 |
| C24 | 2 | 2 | 17 | 10 |
| C25 | 2 | 2 | 16 | 14 |

**62 entradas nuevas y 65 anteriores reutilizadas**. Ratio de reutilización: **65 / (65 + 62) ≈ 51 %**, medido sobre entradas léxicas distintas vinculadas a las fichas del lote, no sobre tokens de texto ni frecuencia de aparición. No sumar las columnas léxicas por bloque. El crecimiento es deliberado: 19 entradas corresponden a los siete días y doce meses; las demás cubren construcciones objetivo, palabras temporales, parentesco y apoyo limitado. Las formas flexionadas se agrupan en la misma entrada. Vocabulario nuevo:

- Construcciones/preposiciones/pronombres: vorrei, esserci, da, su, tra, fra, per, me, te, mi, ti, mio, tuo, suo, nostro, vostro, questo, quello, piacere.
- Calendario: lunedì, martedì, mercoledì, giovedì, venerdì, sabato, domenica; gennaio, febbraio, marzo, aprile, maggio, giugno, luglio, agosto, settembre, ottobre, novembre, dicembre.
- Tiempo/frecuencia: ora, giorno, volta, settimana, appuntamento, mezzogiorno, mezzanotte, primo, quarto, mezza, sempre, spesso, qualche volta, mai.
- Parentesco y apoyo: padre, madre, fratello, sorella, sorellina, caro, Italia, treno, centro, là.

**182 actividades explícitas, sin nuevos templates**; se conservan los 2 templates y 9 variantes. Formatos: selection 22, cloze 42, short 19, transformation 25, error-correction 19, controlled-production 24, translation 20, error-detection 11. Familias nuevas F1 33, F2 61, F3 44, F4 44; F7 se conserva en el contenido anterior. Habilidades: reconocimiento 22, recuperación 61, transformación 44, producción controlada 44, discriminación 11. Recuperación/transformación/producción suman 149/182 (82 %). No se fuerza matching ni ordering para aumentar variedad nominal.

**46 relaciones nuevas**, 31 con C01–C17; grafo total 150. Tipos prerequisite (recomendado, sin hard locks), related, contrast y reinforces. Se conectan cortesía/modales, existencia/essere locativo, preposiciones/origen/desplazamiento, articuladas/artículos, calendario/números/rutinas, posesivos/grupo nominal, demostrativos/artículos y gustos/infinitivos/número. Una oportunidad por actividad, atribuida solo al concepto objetivo: los errores de la cita no se propagan a calendario, modal o preposiciones.

Conservación comprobada contra el pack baseline: las 51 Theory previas son idénticas; las 431 actividades conservan IDs/versiones, enunciados, aceptadas/rechazadas, feedback y tareas. Solo se actualizan canonVersion/packVersion del pack activo. Las asociaciones léxicas crecen; di, a, in, con y loro amplían glosa/uso con versión incrementada (loro añade su uso posesivo). Sin cambios en los archivos C01–C17, UI, evaluador, Evidence, Review/Mastery, infraestructura ni dependencias.

Validación: **194 pruebas locales**, typecheck, formato y builds normal/candidate correctos; **19 E2E candidate y 1 E2E de exclusión en producción**, incluidas regresiones C01–C17, offline/sync y cita incompatible con persistencia del feedback. Pruebas data-driven de IDs/referencias/versiones/grafo/Theory/léxico/respuestas/templates/provenance/estado/coverage; sesiones de los 73 conceptos con ayudas/reintentos y Evidence. Una carencia inicial de variedad contextual en C23-02 se corrigió con mensajería de visita y se repitió la batería completa. Ficha C22-04 a 320 px comprobada. Tras aclarar notas didácticas, se repitieron las 112 pruebas curriculares afectadas, el build candidate y el E2E de citas, todos correctos. El build advierte de un chunk minificado superior a 500 kB; no se introduce refactor en esta carga curricular.

Todo **candidate**, nada reviewed/published, 0 listo para producción. `coverage=complete` acredita aquí el objetivo focal escrito, no revisión editorial ni CC1–CC10 completos. Pendientes validación humana y revisión editorial; Cloudflare nativo/remoto no ejecutado. **26 conceptos ausentes en C26–C34**; C26 no iniciado. Siguiente lote sugerido: C26–C30, solo tras autorización. Sin merge ni despliegue.


## Control de carga — lote C26–C34 (2026-10-12)

Baseline `1e4afa3`, pack `it-A1-candidate-7`: **73/99 Concepts, 73 Theory, 613 actividades, 234 entradas léxicas, 150 relaciones, 0 ready**. Resultado `it-A1-candidate-8`: **99/99 Concepts, 99 Theory, 849 actividades, 316 entradas léxicas, 207 relaciones, 0 ready**. Fuente Research 02 C26–C34 y granularidad de esta matriz: 2/3/2/4/2/2/3/1/7, sin discrepancias ni modificación del inventario esperado. Coverage inicial/final sin errores con Node 22.23.3; el Node antiguo del terminal no ejecuta el script.

| Bloque | Concepts nuevos | Theory nuevas | Actividades nuevas |
|---|---:|---:|---:|
| C26 | 2 | 2 | 17 |
| C27 | 3 | 3 | 24 |
| C28 | 2 | 2 | 17 |
| C29 | 4 | 4 | 32 |
| C30 | 2 | 2 | 17 |
| C31 | 2 | 2 | 18 |
| C32 | 3 | 3 | 28 |
| C33 | 1 | 1 | 10 |
| C34 | 7 | 7 | 73 |

**26 conceptos añadidos, ningún bloque parcial, ningún concepto sin Theory o práctica, ninguna referencia rota.** Las 26 fichas incluyen explicación, reglas, formas, ejemplos, errores y límites de uso. Recuperación en todos los nuevos conceptos; producción dirigida en los 23 objetivos que la requieren. C30-01 es comprensión de instrucciones; C31-01/02 evalúan formas de participio, cuya producción integrada se trabaja en C32/C33.

**82 entradas nuevas, 87 anteriores reutilizadas: 87 / (87 + 82) ≈ 51,5 %** sobre entradas distintas vinculadas al lote, no tokens ni frecuencia. El crecimiento corresponde a construcciones nuevas, apoyo necesario y repertorios explícitos de C34; no se fija un ratio objetivo. Las formas se agrupan con su lema. Nuevas: chiamarsi, alzarsi, lavarsi, vestirsi, lavoro, presto, prima, un po’ di, litro, chilo, pane, mela, molto, poco, comprare, zucchero, pasta, invitare, ragazzo, lo, la, li, le, ma, domani, libero, mangiare, panino, poi, rispondere, tornare, girare, destra, sinistra, dritto, aggiungere, mescolare, formaggio, latte, finire, ricevere, vedere, scrivere, arrivare, ieri, camminare, partire, ieri sera, la settimana scorsa, Spagna, cucina, tavolo, sedia, singolo, doppio, riso, bottiglia, conto, piatto, maglietta, pantaloni, scarpa, taglia, nero, blu, studio, musica, cinema, ascoltare, dopo, stazione, autobus, partenza, arrivo, albergo, piazza, telefono, medico, farmacia, avere mal di testa, febbre, avere bisogno di aiuto.

Reutilizadas: io, tu, noi, essere, amico, bagno, famiglia, biglietto, casa, città, caffè, perché, e, penna, letto, per favore, lui, lei, voi, loro, insegnante, di, Roma, italiano, spagnolo, hotel, stanco, avere, due, fame, sete, non, oggi, mano, nome, film, studente, studentessa, zaino, il / lo / la / l’ / i / gli / le, piccolo, tranquillo, grande, rosso, bello, camera, sei, sette, otto, numero, parlare, lavorare, abitare, studiare, con, ogni giorno, leggere, prendere, dormire, capire, libro, messaggio, fare, andare, venire, bere, dire, uscire, colazione, pausa, acqua, potere, vorrei, esserci, per, Italia, treno, centro, appuntamento, padre, madre, fratello, sorella, me, te, caro, questo.

**236 actividades explícitas; 0 templates nuevos; se conservan 2 templates/9 variantes.** Nuevos formatos: cloze 83, short 47, transformation 20, error-correction 20, controlled-production 29, translation 30 y selection 7. Habilidades del lote: retrieval 131, transformation 40, controlled-production 58, discrimination 5, recognition 2. Recuperación/transformación/producción suman 229/236 (97 %); una traducción de una instrucción al español observa recuperación de significado, no producción italiana. Familias del pack completo: F1 146, F2 391, F3 139, F4 165, F7 8; diez formatos y cinco habilidades. No se implementan Reading/Writing completos.

**57 relaciones nuevas; 207 en total**, prerequisite recomendado, related, contrast y reinforces. Conectan reflexivos/persona, cuantificadores/número, partitivos/artículos, pronombres/referentes, conectores/relaciones semánticas, instrucciones/secuencia, participios/auxiliares/pasado/concordancia y léxico con funciones anteriores. Sin hard locks ni propagación de Evidence a conceptos de contexto.

Conservación comparada con el baseline: **73 Theory idénticas; 613 actividades con IDs/versiones, tareas, enunciados, feedback y criterios aceptados/rechazados intactos; 234 entradas conservan glosas/formas/versiones**. Solo cambian metadatos de pack/canon y asociaciones/tags léxicos. Sin cambios en C01–C25, motor/evaluador, Evidence, Review/Mastery, UI, persistencia, dependencias ni infraestructura. Las pruebas históricas conservan los conteos de cada lote y actualizan las expectativas del pack global.

Validación: **252 pruebas locales**; tras precisar metadatos léxicos y habilidad receptiva, **137 pruebas curriculares afectadas repetidas**. Typecheck, formato, builds normal/candidate y coverage correctos. E2E: **21 candidate + 1 exclusión de producción**, todos correctos (el de producción se omite intencionalmente en el build candidate y se ejecuta aparte). Regresiones de navegación, offline, dos dispositivos, ayudas y reintentos; nuevas fichas C33-01/C34-07 inspeccionadas a 320 px sin desbordamiento horizontal. Integración de los 99 conceptos, ayudas/reintentos, original/versiones/provenance/trace y casos negativos de pronombres, concordancia y necesidades básicas. El build normal excluye candidate; no se modifica esa política.

Comprobación pedagógica específica y deuda: [A1_COVERAGE_FINDINGS](A1_COVERAGE_FINDINGS.md). Todo sigue **candidate**, 0 reviewed/published. **99/99 significa currículo focal implementado, no aprobación editorial ni cierre de CC1–CC10 o de toda V1.** Validación humana/editorial pendientes; sin Reading/Writing completos, Review avanzado, publicación, merge ni despliegue. Detenerse aquí; siguiente fase recomendada: validación humana y revisión pedagógica/editorial acotada, previa autorización.

## Contrato común CC — heredado explícitamente por cada uno de los 99 Concepts

Cada entrada individual hereda CC completo. Los bloques Cxx añaden asignaciones particulares. Estado inicial **de cada Concept**: `contenido: planificado, pendiente de autoría/revisión/publicación; implementación: planificada, no implementada`. Cuando una dimensión no proceda, justificarlo pedagógicamente y definir evidencia alternativa; nunca suprimir el objetivo.

- [ ] **CC1 Alcance/canon/teoría:** propósito, criterio observable, facetas, exclusiones, variantes válidas y canon versionado. Teoría con explicación, reglas, ejemplos, paradigma cuando proceda, excepciones A1, errores, relaciones y enlace a Focus.
- [ ] **CC2 Preparación/léxico:** relaciones prerequisite/supports/contrasts por Concept y faceta; léxico objetivo y de apoyo por actividad. Cxx en esta matriz significa ámbito a resolver a IDs pertinentes, nunca dependencia de todo el Topic indiscriminadamente.
- [ ] **CC3 Ciclo completo:** introducción, guiada, recuperación apropiada, producción/contexto, contraste pertinente, revisión diferida y variación; feedback explicativo y retorno desde Error Learning. No imponer todo el ciclo en una sesión.
- [ ] **CC4 Focus:** navegable/buscable por Topic/Concept, con subalcance/faceta y varias familias pertinentes. Comprensión se practica interpretando; no se exige producción para acreditar un objetivo receptivo.
- [ ] **CC5 Mixed:** oportunidades atribuibles con conocimientos accesibles, elección real y apoyos declarados para incidentales nuevos; sin introducir desconocidos silenciosamente.
- [ ] **CC6 Review:** todo Concept admite ReviewNeed; ejemplos equivalentes nuevos antes del recordatorio, facetas pendientes y Exposure registrado. Repetición tras feedback es reparación, no evidencia diferida nueva.
- [ ] **CC7 Reading/Writing:** presencia en el recorrido y oportunidades explícitas cuando se evalúe. Ver una forma o evitarla en texto correcto no acredita el objetivo. Escritura abierta permite abstención y mantiene práctica/feedback verificable.
- [ ] **CC8 Evidencia/errores/recomendaciones:** oportunidad, habilidad, formato, ayuda, intento inicial/reintento, criterio/confianza/versiones; ErrorEvent/ErrorPattern relacionados sin doble penalización; perfil y recomendaciones explican observado/faltante.
- [ ] **CC9 Suficiencia editorial:** banco cubre todas las funciones anteriores y nuevas revisiones equivalentes, variando facetas pertinentes. Sin cuota arbitraria ni producto cartesiano. Si se agota novedad, declararlo; no simular transferencia.
- [ ] **CC10 Publicación/validación:** canon y variantes revisados, alternativas válidas y ambigüedad comprobadas, familias/criterios probados, cinco modos integrados, revisión lingüística y comprobaciones funcionales enlazadas. Estado de contenido y de implementación independientes.

## Familias del Exercise Engine

| Familia | Variantes de Research 03 | Evidencia y cautela |
|---|---|---|
| F1 Selección | Multiple choice, binaria, detección de error, contraste de significado, elegir turno | Comprensión/discriminación; opciones/azar no equivalen a recuperación. Detectar no demuestra reparar. |
| F2 Recuperación y cloze | Hueco con/sin opciones, banco de palabras, cloze, conjugación | Banco = ayuda; sin opciones = recuperación limitada. Paradigma no demuestra selección comunicativa. |
| F3 Transformación y reparación | Persona/número/negación, corrección, reformulación de destinatario | Separar reparación/primer intento; significado y variantes naturales preservados. |
| F4 Construcción situada y diálogo | Frase propia, ES→IT, respuesta personal breve, turno, information gap, respuesta a mensaje breve, formulario breve, ejemplo propio breve con explicación | Limitada/situada según ayudas; traducción no literal obligatoria; metaconocimiento separado. |
| F5 Lectura | Global/detalle/referente/inferencia local, respuesta corta, IT→ES, lectura funcional | Puede componer tareas F1/F2/F4/F7; evidencia receptiva aunque se escriba respuesta. |
| F6 Composición | Formulario compuesto/mensaje con sentido, guiada/autónoma, varias frases, respuesta extensa, reconstrucción de microtexto, ejemplo propio desarrollado con explicación | Intención y oportunidades reales; modelo/memoria limitan inferencia; abstención donde falte criterio. |
| F7 Asociación y ordenación | Matching, situación↔mensaje, ordenar frase | Asociación = reconocimiento; ordenación = construcción restringida con palabras dadas. Subtipo obligatorio. |

Formulario y ejemplo propio + explicación pertenecen a F4 cuando piden respuesta breve situada y a F6 cuando implican composición/revisión de varios campos o frases. La demanda declarada decide la familia; no crea dos evaluaciones del mismo intento.

Siete familias, no siete motores aislados; F5/F6 componen interacciones reutilizables. Toda la taxonomía de Research 03 queda mapeada, sin añadir tipos por variedad visual. Las familias indicadas por Cxx son repertorio pertinente, no obligación de usarlas todas en una sesión. Focus/Mixed/Review/Reading/Writing son los cinco modos; Theory/Progress acompañan a todos mediante CC.

## Inventario detallado

### C01 — Grafía y correspondencias básicas · Topic it-a1-t01

- [ ] `it-a1-c01-01` Reconocer y escribir c/ch, g/gh, sc, gn y gli en palabras familiares; contraste gráfico, sin evaluación automática de pronunciación.
- [ ] `it-a1-c01-02` Distinguir y escribir acentos pertinentes al repertorio, incluido e/è, en contexto.
- [ ] `it-a1-c01-03` Distinguir y escribir consonantes dobles de palabras enseñadas; una posible errata no permite diagnosticar desconocimiento.

**Prerrequisitos y teoría:** Ninguno; significados proporcionados como apoyo. Teoría: correspondencias, acentos y dobles, nombres/deletreo escrito; apóstrofo enlazado C10/C19/C27 y puntuación básica de mensajes.

**Vocabulario, funciones y contextos:** Objetivo: grafías de repertorio familiar. Apoyo: significado, nombres y lugares. Función: leer/escribir nombres y palabras. Contextos K01/K12.

**Familias, modos y errores:** F1/F2/F3/F5/F6/F7. Focus: contraste escrito; Mixed: léxico conocido; Review: otra oportunidad de grafía; Reading: nombres/mensajes; Writing: datos/frases. Errores: grafía, acento, dobles.

**Estado de cada Concept:** contenido candidate implementado para estudio y práctica focal en el primer lote. Theory, actividades y vocabulario en `src/content/italian-a1/`; sin revisión editorial ni publicación. Hereda CC1–CC10, cuyas casillas siguen pendientes de su validación completa.

### C02 — Saludos, cortesía y reparación · Topic it-a1-t02

- [ ] `it-a1-c02-01` Escoger y usar saludos y despedidas adecuados al intercambio cotidiano.
- [ ] `it-a1-c02-02` Agradecer y llamar la atención/disculparse con expresiones como grazie y scusi.
- [ ] `it-a1-c02-03` Señalar incomprensión y pedir reparación con non capisco y expresiones revisadas equivalentes.

**Prerrequisitos y teoría:** Ninguno; C01 como apoyo. Teoría: expresiones completas, propósito y registro, sin exigir análisis de todos sus verbos.

**Vocabulario, funciones y contextos:** Objetivo: fórmulas sociales. Apoyo: interlocutores/situación. Funciones: abrir/cerrar y pedir ayuda. Contextos K01/K04/K10/K12/K14.

**Familias, modos y errores:** F1/F2/F4/F5/F6/F7. Focus: intención/expresión; Mixed: elegir fórmula pertinente; Review: situación nueva; Reading: mensajes; Writing: apertura/cierre/aclaración. Errores: léxico, registro, pertinencia.

**Estado de cada Concept:** contenido candidate implementado para estudio y práctica focal en el primer lote. Theory, actividades y vocabulario en `src/content/italian-a1/`; sin revisión editorial ni publicación. Hereda CC1–CC10, cuyas casillas siguen pendientes de su validación completa.

### C03 — Personas y sujeto · Topic it-a1-t03

- [ ] `it-a1-c03-01` Identificar y expresar persona/número del referente con pronombres sujeto y sujetos nominales.
- [ ] `it-a1-c03-02` Interpretar y usar sujeto omitido cuando el referente esté claro; admitir pronombre explícito pertinente.

**Prerrequisitos y teoría:** Ejemplos C02 como apoyo. Teoría: personas, pronombres, nombres propios, singular/plural, omisión habitual y referencia clara.

**Vocabulario, funciones y contextos:** Objetivo: pronombres. Apoyo: nombres/personas. Función: identificar quién habla y de quién. Contextos K01/K02/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: referente; Mixed: formas conocidas; Review: cambiar sujeto; Reading: referentes; Writing: presentación sin exigir pronombre redundante. Errores: referencia, persona/número, omisión ambigua.

**Estado de cada Concept:** contenido candidate implementado para estudio y práctica focal en el primer lote. Theory, actividades y vocabulario en `src/content/italian-a1/`; sin revisión editorial ni publicación. Hereda CC1–CC10, cuyas casillas siguen pendientes de su validación completa.

### C04 — Essere en presente · Topic it-a1-t04

- [ ] `it-a1-c04-01` Recuperar presente de essere y concordarlo con sujetos; seis personas y sujeto nominal/omitido son facetas, no Concepts.
- [ ] `it-a1-c04-02` Usar essere para identidad y descripción personal básica.
- [ ] `it-a1-c04-03` Expresar origen con essere y construcción enseñada.
- [ ] `it-a1-c04-04` Situar personas/cosas con essere locativo y lugar conocido.
- [ ] `it-a1-c04-05` Expresar estados frecuentes con essere en expresiones revisadas.

**Prerrequisitos y teoría:** C03 y léxico mínimo; preposición/adjetivo como apoyo antes de C11/C20. Teoría: paradigma y usos separados, omisión del sujeto, enlaces a negación/pregunta C06 y auxiliar C32 sin confundir alcances.

**Vocabulario, funciones y contextos:** Objetivo: essere y expresiones. Apoyo: profesión, nacionalidad, lugares y estados. Funciones: presentarse/describir/localizar. Contextos K01/K02/K03/K10/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/uso elegible; Mixed: avere/stare/c’è cuando accesibles; Review: sujeto/contexto nuevo; Reading: perfil/ubicación; Writing: presentación y localización. Errores: morfología, selección funcional, preposición; no atribuir fallo de adjetivo al verbo.

**Estado de cada Concept:** contenido candidate implementado para estudio y práctica focal en el primer lote. Theory, actividades y vocabulario en `src/content/italian-a1/`; sin revisión editorial ni publicación. Hereda CC1–CC10, cuyas casillas siguen pendientes de su validación completa.

### C05 — Avere en presente · Topic it-a1-t05

- [ ] `it-a1-c05-01` Recuperar presente de avere con persona/número pertinentes.
- [ ] `it-a1-c05-02` Expresar posesión con avere.
- [ ] `it-a1-c05-03` Expresar edad con avere, sin calco de ser.
- [ ] `it-a1-c05-04` Expresar necesidades/estados frecuentes: ho fame y otras combinaciones revisadas.

**Prerrequisitos y teoría:** C03; números y objetos como apoyo. Teoría: paradigma, usos y contraste C04; auxiliar enlazado C32.

**Vocabulario, funciones y contextos:** Objetivo: avere/combinaciones. Apoyo: cantidades, edades, billetes y necesidades. Funciones: posesión/edad/necesidad. Contextos K01/K02/K09/K10/K13.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/uso; Mixed: essere/avere; Review: otra persona/expresión; Reading: datos/necesidades; Writing: presentación/solicitud. Errores: persona/número, combinación, selección de construcción.

**Estado de cada Concept:** contenido candidate implementado para estudio y práctica focal en el primer lote. Theory, actividades y vocabulario en `src/content/italian-a1/`; sin revisión editorial ni publicación. Hereda CC1–CC10, cuyas casillas siguen pendientes de su validación completa.

### C06 — Negación y pregunta · Topic it-a1-t06

- [ ] `it-a1-c06-01` Negar una declaración con non en posición pertinente.
- [ ] `it-a1-c06-02` Comprender, formular y responder preguntas simples cerradas en situaciones escritas.
- [ ] `it-a1-c06-03` Elegir y usar interrogativos frecuentes para quién, dónde, cómo y otros datos cotidianos del repertorio.

**Prerrequisitos y teoría:** Usos C04 o C05 accesibles. Teoría: orden, puntuación y respuesta pertinente, sin sintaxis interrogativa avanzada.

**Vocabulario, funciones y contextos:** Objetivo: non/interrogativos. Apoyo: datos personales/situación. Funciones: negar, preguntar y responder. Contextos K01/K09/K12/K13/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: transformación/consigna; Mixed: intención afirmativa/negativa/interrogativa; Review: situación nueva; Reading: pregunta/respuesta; Writing: information gap. Errores: posición/omisión, comprensión y pertinencia.

**Estado de cada Concept:** candidate implementado para Theory y práctica focal en C06–C10, con léxico, feedback y Evidence. Revisión editorial y validación manual pendientes; CC1–CC10 no se acreditan por presencia.

### C07 — Género de sustantivos · Topic it-a1-t07

- [ ] `it-a1-c07-01` Recuperar género de sustantivos familiares con tendencias -o/-a, sin convertirlas en regla universal.
- [ ] `it-a1-c07-02` Recuperar género léxico de nombres en -e y excepciones frecuentes del repertorio publicado.

**Prerrequisitos y teoría:** Sustantivos conocidos. Teoría: nombre y género juntos; artículo como apoyo, sin ciclo de dominio obligatorio C09.

**Vocabulario, funciones y contextos:** Objetivo: sustantivos con género. Apoyo: significados/contexto. Función: nombrar personas/objetos. Contextos K02/K03/K04/K06/K07.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: género; Mixed: número/artículo conocidos; Review: otra oportunidad del léxico enseñado; Reading: referentes; Writing: objetos necesarios. Errores: género y propagación a artículo/adjetivo relacionada.

**Estado de cada Concept:** candidate implementado para Theory y práctica focal en C06–C10, con léxico, feedback y Evidence. Revisión editorial y validación manual pendientes; CC1–CC10 no se acreditan por presencia.

### C08 — Número nominal · Topic it-a1-t08

- [ ] `it-a1-c08-01` Formar y usar plurales regulares -o/-i, -a/-e y -e/-i en sustantivos del alcance.
- [ ] `it-a1-c08-02` Interpretar y usar invariantes frecuentes enseñados, con número recuperable del contexto.

**Prerrequisitos y teoría:** Forma/clase nominal; C07 apoyo, singular/plural puede aprenderse conjuntamente. Teoría: plural italiano, contraste con añadir -s y excepciones del repertorio.

**Vocabulario, funciones y contextos:** Objetivo: singular/plural e invariantes. Apoyo: cantidades/objetos. Función: uno/varios. Contextos K03/K06/K07.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: número; Mixed: artículos/adjetivos; Review: cambiar referente; Reading: listas/anuncios; Writing: lista/descripción. Errores: plural, número, concordancia relacionada.

**Estado de cada Concept:** candidate implementado para Theory y práctica focal en C06–C10, con léxico, feedback y Evidence. Revisión editorial y validación manual pendientes; CC1–CC10 no se acreditan por presencia.

### C09 — Artículos determinados · Topic it-a1-t09

- [ ] `it-a1-c09-01` Seleccionar il/lo/l'/la en singular según género y comienzo de palabra en casos A1 revisados.
- [ ] `it-a1-c09-02` Seleccionar i/gli/le en plural en los casos enseñados; lo/gli/l' están incluidos en V1.
- [ ] `it-a1-c09-03` Usar determinado para referente identificable y contrastar referencia nueva cuando C10 sea accesible.

**Prerrequisitos y teoría:** Para forma: C07, número C08 cuando proceda y grafía/sonido inicial C01. Para uso: contexto de referencia. Teoría: paradigma y casos iniciales, incluida vocal/grupos pertinentes.

**Vocabulario, funciones y contextos:** Objetivo: artículos. Apoyo: nombres de género conocido. Funciones: identificar/retomar. Contextos K03/K06/K07/K10.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/referencia; Mixed: C10/nominales; Review: otros nombres ya conocidos; Reading: referentes; Writing: introducir/retomar. Errores: forma, determinación, género relacionado.

**Estado de cada Concept:** candidate implementado para Theory y práctica focal en C06–C10, con léxico, feedback y Evidence. Revisión editorial y validación manual pendientes; CC1–CC10 no se acreditan por presencia.

### C10 — Artículos indeterminados · Topic it-a1-t10

- [ ] `it-a1-c10-01` Elegir un/uno/una/un' según género y comienzo; distinguir un amico de un’amica.
- [ ] `it-a1-c10-02` Introducir referentes con indeterminado y contrastarlo con determinado en contexto.

**Prerrequisitos y teoría:** C07/C01; C09 contraste. Teoría: formas, usos y apóstrofo; no plural morfológico universal de un, enlace a partitivos C27.

**Vocabulario, funciones y contextos:** Objetivo: indeterminados. Apoyo: objetos/personas conocidos. Funciones: pedir/introducir. Contextos K01/K04/K06/K10.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/uso; Mixed: C09; Review: otro referente; Reading: peticiones; Writing: pedir objeto/introducir persona. Errores: artículo, determinación, apóstrofo, género.

**Estado de cada Concept:** candidate implementado para Theory y práctica focal en C06–C10, con léxico, feedback y Evidence. Revisión editorial y validación manual pendientes; CC1–CC10 no se acreditan por presencia.

### C11 — Adjetivos · Topic it-a1-t11

- [ ] `it-a1-c11-01` Concordar adjetivos frecuentes con género/número de nombre o sujeto conocido según clase enseñada.
- [ ] `it-a1-c11-02` Colocar adjetivos frecuentes en posición básica natural dentro de construcciones revisadas.

**Prerrequisitos y teoría:** C07/C08; C04 para predicación, no para toda frase nominal. Teoría: clases/formas frecuentes y posición sin orden universal falso.

**Vocabulario, funciones y contextos:** Objetivo: adjetivos descriptivos. Apoyo: nombres conocidos. Función: describir personas/objetos. Contextos K02/K03/K07.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: concordancia/posición; Mixed: género/número/artículos; Review: nuevas combinaciones válidas; Reading: descripción; Writing: describir. Errores: concordancia, posición, léxico y origen nominal relacionado.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c11.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C12 — Grupo nominal · Topic it-a1-t12

- [ ] `it-a1-c12-01` Construir artículo + nombre + adjetivo coherentes para nombrar/describir/pedir, integrando reglas conocidas.

**Prerrequisitos y teoría:** Facetas C09/C10/C11. Teoría: integración, ejemplo una camera tranquilla; no duplicar evidencia de componentes sin oportunidades atribuibles.

**Vocabulario, funciones y contextos:** Objetivo: combinaciones nominales. Apoyo: léxico enseñado. Funciones: habitación/producto/descripción. Contextos K02/K03/K07/K10.

**Familias, modos y errores:** F2/F3/F4/F5/F6/F7. Focus: integración; Mixed: verbos; Review: nuevos referentes; Reading: anuncio; Writing: petición/descripción. Errores: concordancia encadenada, determinación, orden; evitar triple penalización.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c12.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C13 — Números, precios y cantidades · Topic it-a1-t13

- [ ] `it-a1-c13-01` Comprender y recuperar 0–20 y ampliar hasta 100; bandas como facetas de cobertura.
- [ ] `it-a1-c13-02` Comprender y expresar números frecuentes hasta 1000 en usos publicados.
- [ ] `it-a1-c13-03` Interpretar y comunicar edad, precio, cantidad, billete y teléfono con convenciones pertinentes.

**Prerrequisitos y teoría:** C01 apoyo; progresión léxica paralela. Teoría: formación y convenciones según uso, no aprendizaje de toda cifra como Concept.

**Vocabulario, funciones y contextos:** Objetivo: numerales/importe. Apoyo: unidades/productos. Funciones: edad/transacciones/contacto. Contextos K01/K04/K06/K07/K09/K12.

**Familias, modos y errores:** F1/F2/F4/F5/F6/F7. Focus: banda/uso; Mixed: edad/cantidad; Review: datos nuevos; Reading: precio/billete; Writing: formulario/cantidad. Errores: numeral, grafía, dato/unidad.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c13.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C14 — Presente regular -are · Topic it-a1-t14

- [ ] `it-a1-c14-01` Recuperar presente regular -are relacionando infinitivo, raíz, terminaciones y persona.
- [ ] `it-a1-c14-02` Elegir y usar verbos -are enseñados para estudio, trabajo, residencia y actividad habitual.

**Prerrequisitos y teoría:** C03/significado verbal; C04/C05 apoyos, no requisitos lógicos absolutos. Teoría: paradigma, regularidad y función.

**Vocabulario, funciones y contextos:** Objetivo: verbos -are/combinaciones. Apoyo: profesiones/lugares. Función: informar rutina. Contextos K08/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/uso; Mixed: sujetos/verbos conocidos; Review: nuevo mensaje; Reading: rutina; Writing: estudio/trabajo/residencia. Errores: persona, raíz/terminación, selección.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c14.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C15 — Presente -ere/-ire/-isc- · Topic it-a1-t15

- [ ] `it-a1-c15-01` Recuperar y usar presente regular -ere en verbos/funciones enseñados.
- [ ] `it-a1-c15-02` Recuperar y usar presente -ire sin -isc- en repertorio revisado.
- [ ] `it-a1-c15-03` Recuperar y usar presente del subgrupo -isc-, discriminando pertenencia léxica.

**Prerrequisitos y teoría:** C03 y apoyo C14. Teoría: paradigmas/comparación; no aplicar -isc- a todo -ire.

**Vocabulario, funciones y contextos:** Objetivo: leer/tomar/dormir/entender y verbos del repertorio. Apoyo: acciones/objetos. Función: actividades/comprensión. Contextos K08/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: clase/subgrupo; Mixed: clases/elección funcional; Review: nuevos sujetos/acciones enseñadas; Reading: actividades; Writing: rutina. Errores: morfología, clase léxica, significado.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c15.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C16 — Presentes irregulares frecuentes · Topic it-a1-t16

- [ ] `it-a1-c16-01` Recuperar y usar fare en presente en actividades frecuentes.
- [ ] `it-a1-c16-02` Recuperar y usar andare en presente para desplazamiento en construcciones revisadas.
- [ ] `it-a1-c16-03` Recuperar y usar stare en presente en usos frecuentes, contrastando essere cuando proceda.
- [ ] `it-a1-c16-04` Recuperar y usar venire en presente con referencia de desplazamiento clara.
- [ ] `it-a1-c16-05` Recuperar y usar dare en presente en transferencias cotidianas enseñadas.
- [ ] `it-a1-c16-06` Recuperar y usar bere en presente en consumo cotidiano.
- [ ] `it-a1-c16-07` Recuperar y usar dire en presente en expresiones/intercambios del alcance.
- [ ] `it-a1-c16-08` Recuperar y usar uscire en presente para salidas/actividad cotidiana.

**Prerrequisitos y teoría:** C03, significados y tareas en presente; preposición como apoyo antes de C20. Teoría: paradigma/usos por verbo. Separar verbo permite reparación específica ante irregularidad; personas son facetas, sin replicar motor.

**Vocabulario, funciones y contextos:** Objetivo: los ocho verbos/combinaciones. Apoyo: lugares/bebidas/horarios/actividades. Funciones: rutina/desplazamiento. Contextos K04/K08/K09/K11/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: verbo/grupo; Mixed: elegir entre accesibles; Review: personas/construcciones; Reading: desplazamientos/agenda; Writing: actividad en presente. Errores: irregularidad, persona, construcción, léxico; sin equivalencia automática ser/estar.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c16.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C17 — Modales + infinitivo · Topic it-a1-t17

- [ ] `it-a1-c17-01` Usar potere + infinitivo para posibilidad/permiso/petición dentro del alcance.
- [ ] `it-a1-c17-02` Usar volere + infinitivo para deseos con registro apropiado.
- [ ] `it-a1-c17-03` Usar dovere + infinitivo para obligación/necesidad cotidiana.

**Prerrequisitos y teoría:** C03 e infinitivos/significados C14 o C15. Teoría: paradigmas, infinitivo y contraste funcional.

**Vocabulario, funciones y contextos:** Objetivo: modales. Apoyo: acciones necesarias. Funciones: pedir/desear/obligación. Contextos K05/K08/K09/K13/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: modalidad; Mixed: elegir intención; Review: otra situación; Reading: necesidades/normas simples; Writing: petición/compromiso. Errores: forma modal, verbo+infinitivo, registro/intención.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c17.ts`. Validación técnica registrada en el control C11–C17; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C18 — Petición cortés y tu/Lei · Topic it-a1-t18

- [ ] `it-a1-c18-01` Usar vorrei como fórmula de petición cotidiana con contenido pertinente.
- [ ] `it-a1-c18-02` Interpretar y adaptar trato tu/Lei en intercambios básicos enseñados.

**Prerrequisitos y teoría:** C02/palabras de petición. Teoría: cortesía/destinatario; no condicional completo.

**Vocabulario, funciones y contextos:** Objetivo: fórmulas/trato. Apoyo: pedidos/datos. Funciones: pedir/interactuar. Contextos K04/K05/K10/K13.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: intención/destinatario; Mixed: petición/declaración; Review: objeto/interlocutor nuevo; Reading: intercambio; Writing: reserva/pedido. Errores: registro, referencia/persona, propósito; formalidad no solo cambiar pronombre.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c18.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C19 — Existencia · Topic it-a1-t19

- [ ] `it-a1-c19-01` Expresar existencia con c’è/ci sono ajustando número.
- [ ] `it-a1-c19-02` Distinguir existencia de localización de referente identificado con essere.

**Prerrequisitos y teoría:** C04/C08 y referencia C09/C10. Teoría: construcción, apóstrofo/acento y contraste.

**Vocabulario, funciones y contextos:** Objetivo: expresiones existenciales. Apoyo: lugares/objetos. Funciones: existencia/disponibilidad. Contextos K03/K10.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: número/función; Mixed: essere locativo; Review: otro lugar; Reading: anuncio; Writing: vivienda/disponibilidad. Errores: número, construcción, referencia, grafía.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c19.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C20 — Preposiciones simples por uso · Topic it-a1-t20

- [ ] `it-a1-c20-01` Expresar origen, pertenencia y relaciones nominales con di/da en construcciones especificadas.
- [ ] `it-a1-c20-02` Expresar ubicación con a/in/su/tra/fra en combinaciones revisadas, sin equivalencia única por traducción.
- [ ] `it-a1-c20-03` Expresar destino/dirección con a/in/da/per según verbo y referente enseñado.
- [ ] `it-a1-c20-04` Expresar compañía/relación interpersonal con con y construcciones pertinentes.
- [ ] `it-a1-c20-05` Expresar finalidad/destinatario con per y usos A1 revisados.
- [ ] `it-a1-c20-06` Expresar relaciones temporales con di/a/in/da/per/tra/fra en expresiones del repertorio.

**Prerrequisitos y teoría:** C04 o C14, lugares/relaciones conocidos. Teoría: por construcción; di/a/in/da/con/per/su/tra/fra incluidos, sentidos avanzados excluidos.

**Vocabulario, funciones y contextos:** Objetivo: construcciones preposicionales. Apoyo: lugar/persona/tiempo. Funciones: origen/destino/compañía/ubicación/finalidad/tiempo. Contextos K03/K08/K09/K10/K11/K12.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: función/subalcance; Mixed: elección contextual; Review: combinaciones nuevas válidas conocidas; Reading: indicaciones/horarios; Writing: ubicación/cita/desplazamiento. Errores: preposición, régimen, relación semántica.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c20.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C21 — Preposiciones articuladas · Topic it-a1-t21

- [ ] `it-a1-c21-01` Formar combinaciones frecuentes de preposición/artículo en series di/a/da/in/su revisadas.
- [ ] `it-a1-c21-02` Elegir y usar combinaciones articuladas en contexto, distinguiendo simple/articulada por construcción/referencia.

**Prerrequisitos y teoría:** Facetas C09/C20. Teoría: tabla de combinaciones de esas series e introducción gradual: al bar/nel centro/della città; variantes pertinentes col/con il documentadas si se publican.

**Vocabulario, funciones y contextos:** Objetivo: combinaciones. Apoyo: lugares/relaciones. Funciones: lugar/pertenencia. Contextos K03/K09/K10.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/uso; Mixed: C20/artículos; Review: otro referente; Reading: anuncio/indicaciones; Writing: descripción/destino. Errores: fusión, artículo, régimen; relacionar sin castigo múltiple.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c21.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C22 — Calendario, hora y frecuencia · Topic it-a1-t22

- [ ] `it-a1-c22-01` Comprender y expresar días/meses/fechas para situar eventos.
- [ ] `it-a1-c22-02` Comprender, preguntar y comunicar horas en usos cotidianos.
- [ ] `it-a1-c22-03` Comprender y expresar frecuencia de actividades con repertorio A1.
- [ ] `it-a1-c22-04` Concertar cita/horario comunicando fecha, hora y disponibilidad coherentemente.

**Prerrequisitos y teoría:** C13, presente pertinente C14 y usos C20. Teoría: léxico temporal, expresiones/convenciones; distinguir dato de tarea integrada.

**Vocabulario, funciones y contextos:** Objetivo: calendario/hora/frecuencia. Apoyo: actividad/lugar. Funciones: cita/rutina. Contextos K08/K09/K10/K11/K12.

**Familias, modos y errores:** F1/F2/F4/F5/F6/F7. Focus: dato/concertación; Mixed: preposiciones/presente; Review: nuevo horario; Reading: calendario/aviso; Writing: disponibilidad/cita. Errores: dato/comprensión, expresión temporal, pertinencia.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c22.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C23 — Posesivos · Topic it-a1-t23

- [ ] `it-a1-c23-01` Elegir posesivo por poseedor y concordarlo con lo poseído, con artículo en construcciones generales.
- [ ] `it-a1-c23-02` Usar posesivos con nombres de familia y excepciones frecuentes A1 del repertorio.

**Prerrequisitos y teoría:** Facetas C07–C09/C12. Teoría: mio padre/la mia casa/i miei fratelli; plural/excepciones revisadas, sin regla absoluta familia sin artículo.

**Vocabulario, funciones y contextos:** Objetivo: posesivos/construcciones familiares. Apoyo: parentesco/objetos. Funciones: relaciones/pertenencia. Contextos K02/K03.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: poseedor/construcción; Mixed: nominales; Review: otro poseedor/referente; Reading: familia; Writing: relaciones. Errores: referencia, posesivo, género/número/artículo relacionados.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c23.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C24 — Questo/quello · Topic it-a1-t24

- [ ] `it-a1-c24-01` Identificar referentes con questo y formas concordadas frecuentes.
- [ ] `it-a1-c24-02` Identificar/contrastar referentes con quello y formas frecuentes en contexto revisado.

**Prerrequisitos y teoría:** C07–C09 pertinentes. Teoría: referencia/formas y distinción funcional; no agotar paradigma de quello al inicio, pero repertorio A1 publicado explícito.

**Vocabulario, funciones y contextos:** Objetivo: demostrativos. Apoyo: objetos/ropa. Funciones: señalar/elegir. Contextos K07/K03.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/referente; Mixed: artículos/pronombres conocidos; Review: otra selección; Reading: elección; Writing: elegir producto. Errores: referencia, forma, concordancia.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c24.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C25 — Gustos · Topic it-a1-t25

- [ ] `it-a1-c25-01` Expresar gusto por actividad con mi piace + infinitivo, entendiendo mi como destinatario.
- [ ] `it-a1-c25-02` Expresar gusto por entidades con mi piace/mi piacciono según número de lo que gusta.

**Prerrequisitos y teoría:** C08 e infinitivos C14; fórmula anticipable con apoyo. Teoría: dirección de la construcción sin calco automático.

**Vocabulario, funciones y contextos:** Objetivo: construcción de gusto. Apoyo: comida/ocio. Función: preferencias. Contextos K05/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: construcción; Mixed: actividad/entidades; Review: otra preferencia; Reading: gustos; Writing: preferencia/respuesta a invitación. Errores: número, destinatario/referencia, construcción.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c25.ts`. Validación técnica registrada en el control C18–C25; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C26 — Reflexivos frecuentes · Topic it-a1-t26

- [ ] `it-a1-c26-01` Usar mi chiamo y formas pertinentes para presentar/identificar personas.
- [ ] `it-a1-c26-02` Usar reflexivos frecuentes en presente para rutina, vinculando pronombre y persona verbal.

**Prerrequisitos y teoría:** C03 y formas C14/C15 pertinentes; mi chiamo puede anticiparse como expresión. Teoría: paradigma y función del pronombre; mi alzo y repertorio definido.

**Vocabulario, funciones y contextos:** Objetivo: reflexivos/construcciones. Apoyo: rutina/tiempo. Funciones: presentación/hábito. Contextos K01/K08/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: presentación/reflexivos; Mixed: personas/verbos; Review: otro sujeto/rutina; Reading: perfil; Writing: presentación/hábitos. Errores: pronombre, persona, omisión/posición, morfología.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c26.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C27 — Cantidad y partitivos · Topic it-a1-t27

- [ ] `it-a1-c27-01` Pedir/expresar cantidad con un po’ di y expresiones enseñadas.
- [ ] `it-a1-c27-02` Usar molto/poco en cantidades y funciones frecuentes, concordando cuando proceda.
- [ ] `it-a1-c27-03` Comprender y usar partitivos frecuentes en contextos revisados; dei no es plural universal de un.

**Prerrequisitos y teoría:** C08/C10, comida y cantidades C13. Teoría: apóstrofo, construcciones/variantes de alcance explícito.

**Vocabulario, funciones y contextos:** Objetivo: cuantificadores/partitivos. Apoyo: alimentos/envases/medidas. Funciones: pedir/comprar. Contextos K04/K05/K06.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: cantidad; Mixed: artículos/número; Review: otro pedido; Reading: receta/lista; Writing: compra/petición. Errores: cantidad, determinación, concordancia, grafía.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c27.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C28 — Pronombres complemento básicos · Topic it-a1-t28

- [ ] `it-a1-c28-01` Comprender y usar formas tónicas de complemento en construcciones enseñadas con referente claro.
- [ ] `it-a1-c28-02` Comprender y usar lo/la/li/le como complementos directos básicos, manteniendo referencia/posición del alcance.

**Prerrequisitos y teoría:** C03/C07/C08, verbos transitivos/construcciones. Teoría: formas tónicas y antecedente/pronombre; producción inicial limitada/apoyada, sin combinaciones complejas de clíticos.

**Vocabulario, funciones y contextos:** Objetivo: pronombres/referencia. Apoyo: objetos/personas. Función: evitar repetición. Contextos K07/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: referente/sustitución; Mixed: artículos frente clíticos contextualizados; Review: otro antecedente; Reading: referencias; Writing: respuesta apoyada. Errores: referente, género/número, posición, transitividad.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c28.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C29 — Conectores · Topic it-a1-t29

- [ ] `it-a1-c29-01` Añadir información con e manteniendo coherencia.
- [ ] `it-a1-c29-02` Expresar contraste simple con ma.
- [ ] `it-a1-c29-03` Dar causa breve con perché.
- [ ] `it-a1-c29-04` Secuenciar hechos/acciones con poi.

**Prerrequisitos y teoría:** Frases breves C06/C14. Teoría: relación de significado, puntuación básica y límites de causal A1.

**Vocabulario, funciones y contextos:** Objetivo: conectores. Apoyo: frases/acciones. Funciones: unir/explicar/ordenar. Contextos K08/K11/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: relación; Mixed: elegir por mensaje; Review: hechos nuevos; Reading: relaciones locales; Writing: varias frases/relato. Errores: conexión, coherencia, grafía perché.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c29.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C30 — Imperativo útil · Topic it-a1-t30

- [ ] `it-a1-c30-01` Comprender expresiones e instrucciones frecuentes de indicaciones y recetas.
- [ ] `it-a1-c30-02` Producir instrucciones sencillas con formas tu/voi gradualmente sistematizadas en verbos publicados.

**Prerrequisitos y teoría:** C03/C14/C16 pertinentes. Teoría: fórmulas, formas frecuentes y destinatario; no sistema completo de formal/clíticos avanzados.

**Vocabulario, funciones y contextos:** Objetivo: verbos de instrucción. Apoyo: lugares/ingredientes/acciones. Funciones: entender/dar instrucciones. Contextos K05/K06/K09/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: comprensión/tu/voi; Mixed: instrucción frente descripción conocida; Review: nuevas instrucciones; Reading: receta/indicaciones; Writing: pasos simples. Errores: comprensión/secuencia, forma/persona, registro.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c30.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C31 — Participio passato · Topic it-a1-t31

- [ ] `it-a1-c31-01` Reconocer y recuperar participios regulares de verbos conocidos.
- [ ] `it-a1-c31-02` Reconocer y recuperar participios irregulares frecuentes, incluidos fatto/visto/preso, en repertorio explícito.

**Prerrequisitos y teoría:** Infinitivo y significado de acciones. Teoría: formación/irregularidad y C32; recuperar participio no demuestra uso de pasado.

**Vocabulario, funciones y contextos:** Objetivo: participios. Apoyo: acciones conocidas. Función: reconocer acciones terminadas. Contextos K08/K11/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6/F7. Focus: regular/irregular; Mixed: clases; Review: otros verbos enseñados; Reading: pasado con auxiliar apoyado antes de C32; Writing: frase apoyada y luego integrada. Errores: participio, regularización, léxico.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c31.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C32 — Passato prossimo · Topic it-a1-t32

- [ ] `it-a1-c32-01` Construir passato prossimo con auxiliar en presente + participio en situaciones enseñadas.
- [ ] `it-a1-c32-02` Seleccionar essere/avere como auxiliar por verbo y construcción del repertorio básico revisado.
- [ ] `it-a1-c32-03` Comprender y contar hechos terminados breves con marcadores temporales, distinguiéndolos del presente en contextos claros.

**Prerrequisitos y teoría:** Formas C04/C05, C31 y tiempo C22. Teoría: construcción/uso; no movimiento = essere universal; contraste sistemático con imperfetto fuera de alcance.

**Vocabulario, funciones y contextos:** Objetivo: construcciones de pasado. Apoyo: viaje/acciones/marcadores. Funciones: contar ayer/viaje. Contextos K11/K08/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: forma/auxiliar/uso; Mixed: presentes/pasado accesibles; Review: otro relato; Reading: hechos pasados; Writing: relato breve. Errores: auxiliar, tiempo, participio, relación temporal separados.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c32.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C33 — Concordancia en pasado con essere · Topic it-a1-t33

- [ ] `it-a1-c33-01` Concordar participio con género/número del sujeto al usar essere en casos frecuentes: Anna è arrivata / siamo arrivati y variantes pertinentes.

**Prerrequisitos y teoría:** C32/C07/C08. Teoría: concordancia, sujeto explícito/omitido si el contexto lo fija; no reglas completas con clíticos.

**Vocabulario, funciones y contextos:** Objetivo: participios concordados. Apoyo: nombres/acciones. Función: narrar hechos personales/grupo. Contextos K11/K02/K14.

**Familias, modos y errores:** F1/F2/F3/F4/F5/F6. Focus: concordancia; Mixed: auxiliar/participio; Review: otro grupo/referente; Reading: quién realizó acción; Writing: relato de grupo. Errores: concordancia, referente y auxiliar relacionados.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c33.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

### C34 — Vocabulario y expresiones transversales · Topic it-a1-t34

- [ ] `it-a1-c34-01` Comprender y recuperar repertorio de identidad, países, profesiones, personas y parentesco para presentarse/describir relaciones.
- [ ] `it-a1-c34-02` Comprender y recuperar repertorio de vivienda, habitaciones, muebles y alojamiento para describir/solicitar un espacio.
- [ ] `it-a1-c34-03` Comprender y recuperar alimentos, bebidas, platos, ingredientes, envases y medidas para pedir/comprar/expresar preferencias.
- [ ] `it-a1-c34-04` Comprender y recuperar productos, ropa, tallas y colores para identificar/elegir una compra.
- [ ] `it-a1-c34-05` Comprender y recuperar léxico de trabajo, estudio, rutina, ocio y actividades para informar/invitar.
- [ ] `it-a1-c34-06` Comprender y recuperar ciudad, transporte y viaje: lugares, billete, estación, salida/llegada y desplazamientos.
- [ ] `it-a1-c34-07` Comprender y recuperar expresiones de contacto/disponibilidad y necesidades elementales, incluidos dolor, síntomas y cita; sin explicación clínica compleja.

**Prerrequisitos y teoría:** Sin prerrequisito global; ajustar estructuras a tarea. Teoría: sustantivo con género/ejemplo, verbo con significado/construcción, expresión con propósito/registro. Cada Concept declara repertorio versionado de sentidos/entradas, no dominio de todo un campo por pocas muestras; dimensiones receptiva/productiva separadas.

**Vocabulario, funciones y contextos:** Objetivo: repertorio explícitamente enseñado. Apoyo: palabras suministradas para otros objetivos; una entrada puede cambiar de papel por actividad. Funciones y contextos K01–K14. Las capacidades no se duplican por contexto: hotel reutiliza espacio/viaje. Añadir entradas deja cobertura nueva sin evidencia, no cambia automáticamente dominio.

**Familias, modos y errores:** F1/F2/F4/F5/F6/F7; F3 para reparación verificable. Focus: repertorio/función/facetas; Mixed: léxico y gramática accesibles; Review: nueva oportunidad/contexto; Reading: todas las etapas; Writing: palabras necesarias al propósito. Errores: significado, selección, combinación, falso amigo, grafía/género relacionados.

**Estado de cada Concept:** contenido candidate; Theory y práctica focal implementadas en `src/content/italian-a1/c34.ts`. Validación técnica registrada en el control C26–C34; revisión editorial/publicación y CC1–CC10 completos pendientes.

## Matriz de contextos, Reading y Writing

Los 14 contextos de Research 02 §5 pertenecen a V1. Cada fila requiere material en las etapas indicadas; un texto no acredita por sí mismo toda la fila. Un artefacto puede servir a varias celdas si contiene oportunidades trazables. `C34-NN` abrevia el Concept `it-a1-c34-NN`. Estado de todas las filas: contenido planificado; implementación no implementada.

| Contexto | Fuentes y léxico objetivo | Reading progresivo | Writing y función |
|---|---|---|---|
| K01 Presentarse | C03–C06/C13/C26; C34-01 | Perfil → mensaje personal | Formulario con sentido → frase propia → presentación |
| K02 Familia | C04/C05/C11/C12/C23; C34-01 | Descripción → relaciones/referentes | Describir dos familiares, edades y relación |
| K03 Vivienda | C09–C12/C19–C21; C34-02 | Anuncio → detalles de habitación | Describir → preguntar por habitación |
| K04 Bar | C10/C13/C18/C27; C34-03 | Menú/precio → intercambio | Pedir bebida y comprender/confirmar importe |
| K05 Restaurante | C17/C18/C25/C27; C34-03 | Carta/ingredientes → diálogo/receta con C30 | Preferencia → pedido/preguntar ingredientes |
| K06 Supermercado | C08–C10/C13/C27; C34-03 | Lista/envase/medida → petición | Lista significativa → pedir cantidades |
| K07 Compras | C11/C12/C13/C24/C28; C34-04 | Producto/talla/precio → referentes | Elegir producto y preguntar precio/talla |
| K08 Trabajo/estudios | C14–C17/C22/C29; C34-01/05 | Rutina/horario → disponibilidad | Frases → rutina/disponibilidad |
| K09 Transporte | C16/C17/C20–C22; C34-06 | Billete/horario → indicaciones C30 | Preguntar destino/horario/completar información |
| K10 Hotel | C05/C18–C21/C22; C34-02/06 | Anuncio/reserva → fechas/servicios | Petición breve de reserva/aclaración |
| K11 Viaje | C16/C20/C22/C32/C33; C34-06 | Mensaje actual → relato pasado | Plan en presente → contar hechos pasados |
| K12 Teléfono/mensajería | C02/C06/C13/C22; C34-07 | Número/recado → concertar hora | Devolución de llamada por escrito → cita |
| K13 Médico, necesidades elementales | C05/C06/C17/C18; C34-07 | Aviso/cita/necesidad breve | Expresar necesidad/solicitar cita, sin alcance clínico complejo |
| K14 Conversación cotidiana escrita | C06/C14–C17/C25/C29; C34-01/03/05/07 | Ocio/familia/comida → intercambio | Preguntar/responder → invitar/explicar brevemente |

Checklist editorial por contexto y etapa:

- [ ] Dificultad declara tema, léxico, sintaxis, densidad, referentes y demanda; no solo longitud.
- [ ] Material adulto cotidiano; glosas de apoyo y preguntas que requieren leer, sin conocimiento cultural ajeno al objetivo.
- [ ] Comprensión global, detalle, referente y relación/inferencia local distribuidas; no todas obligatorias en cada texto.
- [ ] Writing completa la progresión: completar con significado → frase apoyada → propia → varias frases → mensaje guiado → autónomo A1 → relato final con pasado.
- [ ] Actividades equivalentes nuevas para comprobación y nueva tarea después de reparación; Exposure registra modelos/soluciones.
- [ ] Rúbrica separa intención, comprensibilidad y Concepts realmente utilizados; ayuda identificada y abstención donde corresponda.

Bandas de Research 03 (lecturas 15–40/40–80/80–150 palabras y mensajes 20–40/40–70 inicialmente) son H, no cuotas ni criterio de suficiencia. Cobertura se cierra por demandas/oportunidades y variación, no un número arbitrario de textos o encargos.

## Cobertura complementaria del Research Pack fuera de la tabla curricular

Se integra en los 99 Concepts, actividades y criterios transversales; no crea Concepts por formato.

| Fuente/obligación | Destino y comprobación |
|---|---|
| Research 01: loop completo, comprobación inicial, retirada de ayuda, propósito, contraste y diferida | CC3–CC8 para cada Concept; avance parcial y reparación de alcance concreto, sin bloqueo por perfección. |
| Research 02 §3: interferencias potenciales del español | C05 edad; C04/C16 essere/stare; C08 plural; C09 lo/gli; C23 familia; C20/C21 preposición. Causa mental siempre hipótesis. |
| Research 02 §4: expresiones anticipadas | C02/C18/C26/C25; al bar/del giorno C21; ho fatto/sono andato C32. Fórmula no acredita sistema completo. |
| Research 02 §6: resultados finales | Aviso nuevo, mensaje personal, presentación, petición, rutina, relato de hechos; tarea cotidiana y concepto focal se comprueban por separado. |
| Research 03: taxonomía completa y dos ejes | F1–F7; ambas traducciones, detección/corrección, formulario, information gap, destinatario, reconstrucción y ejemplo explicado conservados como variantes pertinentes. |
| Research 03: géneros adultos adicionales | Música/ocio K14 C34-05; recetas K05/K06 C30; minihistorias adultas K08/K11/K14 C29/C32; no exigir cuentos infantiles. |
| Research 03: progresión de lectura/escritura | Matriz contextual y checklist; inferencia local, léxico en contexto, continuidad de composición y mensajes nuevos. |
| Research 04: errores en todo el currículo | Verbal C04–C05/C14–C17/C26/C30–C33; nominal C07–C12/C27; referencia C03/C23–C25/C28; relaciones C20–C22; sintaxis C06/C12/C29; léxico C34; grafía C01/C10/C19/C27/C29; adecuación/comprensión en toda tarea pertinente. |
| Research 04: problema de actividad | Ambigüedad, válida rechazada o fuera de alcance: conservar intento, retirar inferencia negativa, revisar contenido/reconstruir perfil. |
| Research 05: Biblioteca completa en estructura | Canon por Concept, áreas e intención, variantes/excepciones A1 y práctica. Indirectos y otras ampliaciones de la estructura futura no implican añadir un paradigma avanzado; mi de C25 y expresiones A1 sí incluidos. |
| Research 05: muestra de validación pedagógica | Essere/avere, artículos, plural/concordancia, preposiciones y texto escrito revisados antes de escalar autoría; control de proceso, no recorte final. |

Fuera del currículo A1 definido por Work: producción sistemática de imperfetto frente a passato prossimo, futuro morfológico completo, condicional completo, subjuntivo y combinaciones complejas de pronombres. Las fórmulas útiles permanecen en V1. Son límites explícitos de Research 02, no exclusiones para ahorrar desarrollo. Cubrir todo este recorrido escrito no certifica por sí mismo todas las competencias orales del MCER.

## Estrategia editorial y cierre de cobertura

Templates + variables tipadas + lexical sets + variantes revisadas + canon. Cada template declara restricciones de concordancia, régimen, significado, referencia y respuesta; combinación formal posible no garantiza naturalidad. Restringir/enumerar combinaciones validadas. Cada variante publicada referencia versiones de template, entradas léxicas, canon y rúbrica. Generación offline produce candidatos sujetos a revisión; ejecución normal sin dependencia de IA online/de pago.

Variación suficiente cambia facetas relevantes para la inferencia: no sustituir selección essere/avere con infinitas permutaciones de noi siamo ni ampliar repertorio por cambiar solo nombres propios. Reservar oportunidades equivalentes nuevas para diferida, manteniendo demanda comparable. Si no se dispone de ellas, la capacidad editorial no está completa.

- [ ] C01–C34 completos y ninguno POST-V1; 34 Topics/99 Concepts coinciden con inventario/catalogación publicada.
- [ ] Cada Concept acredita CC1–CC10, canon versionado y estados editorial/funcional separados; no sustituir práctica por páginas teóricas.
- [ ] Sin Concepts huérfanos de currículo, teoría, actividad, evidencia, Review o recomendación; relaciones resueltas a alcance concreto.
- [ ] Los 14 contextos y Reading/Writing progresivos tienen artefactos trazables y variantes diferidas nuevas.
- [ ] Mixed cruza verbos, nominales, referencia, preposición, tiempo, léxico y funciones accesibles; Review no tiene lista fija de unos pocos Concepts.
- [ ] Familias pertinentes comprobadas con ayudas, variantes válidas, abstención, errores relacionados e historial/versiones preservados.
- [ ] Revisión final compara currículo, inventario, catálogo, banco publicado y pruebas; contar archivos no demuestra cobertura.

La creación de esta matriz no declara implementado ni validado ningún Concept, familia o modo. El tamaño del inventario es una propuesta de granularidad; su cobertura semántica está comprometida en V1 incluso si la revisión pedagógica posterior ajusta particiones con trazabilidad explícita.
