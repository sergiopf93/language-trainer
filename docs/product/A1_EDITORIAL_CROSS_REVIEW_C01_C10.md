# Fase 5B.2 — validación cruzada C01–C10

Estado actual: **IR-01 e IR-02 resueltos mediante decisiones explícitas de Sergio y revisión de las actividades v2; 29 conceptos reviewed, 70 candidate, 0 published**. Las secciones originales conservan el resultado histórico del dictamen ciego y el cierre parcial; el cierre definitivo al final registra el estado vigente. Revisión asistida, no aprobación humana cualificada para publicación.

Fecha: 2026-10-13. Baseline de contenido: `5c122d7`; preparación recuperada: `3118ee5`; rama `feat/editorial-cross-review-c01-c10`.

## Material efectivamente revisado

Reutilizados sin regeneración los diez paquetes originales, con sus SHA-256 verificados contra el [manifiesto](editorial-cross-review-c01-c10/manifest.json). Desde el baseline hasta la reanudación solo había documentación de preparación; no habían cambiado las fuentes de contenido. La muestra conserva 29 conceptos, 10 formatos, 5 familias y las modalidades de respuesta seleccionada, textual, asociación y ordenación. No se necesitó ampliarla.

El revisor aislado `/root/italian_independent_review_resume`, con `fork_turns: none`, emitió y guardó su [dictamen independiente íntegro](editorial-cross-review-c01-c10/independent-verdict.json) antes de que R2 leyera el informe detallado y el inventario de cambios de 5B.1 para compararlos. Recibió únicamente criterios, manifiesto y C01.json–C10.json, sin conclusiones anteriores. El manifiesto original revela qué IDs habían cambiado, pero no los motivos ni conclusiones: independencia respecto del dictamen previo, no cegamiento respecto de la selección.

**Revisión acreditada: 29/29 Theory completas y 148/227 actividades**, con respuestas, distractores y explicaciones; incluye 42/42 actividades modificadas y 15/15 listas accepted modificadas. Cobertura por ID en dictamen y manifiesto. Quedan **79 actividades sin revisión independiente**, enumeradas en `notSelectedActivityIds` y `unreviewedActivityIds`. Vocabulario y templates fueron contexto; no se acredita una auditoría independiente exhaustiva de ambos. El intento anterior bloqueado sigue sin aportar cobertura.

## Dictamen y decisión de R2

Cero errores inequívocos confirmados, dos ambigüedades relevantes y una preferencia opcional. Cada hallazgo conserva concepto, ficha/actividad, problema, gravedad, evidencia, propuesta y certeza en el JSON del revisor.

| ID / clase | Concepto y actividad | Evidencia y problema | Gravedad / certeza | Propuesta y resolución |
|---|---|---|---|---|
| IR-01 · ambigüedad relevante | C06-01 · `it-a1-c06-01-nega`; Theory `it-a1-theory-c06-01` | «Nega la frase senza cambiare le altre parole: “Sono a casa”» rechaza `Sono non a casa`. La Theory limita la regla al orden neutro; la consigna no explicita ese límite frente a una lectura contrastiva. | Media / media; construcción marcada sin continuación, no error gramatical confirmado. | Explicitar orden neutro o retirar rechazo. **Sin corrección automática; candidate y validación humana.** |
| IR-02 · ambigüedad relevante | C10-02 · `it-a1-c10-02-caffe` | «Ordina un solo caffè, senza indicarne uno già pronto: ___ caffè, per favore» rechaza `Il`. El contexto no excluye plenamente una bebida identificable en la situación compartida. | Media / media-alta sobre insuficiencia contextual. | Delimitar primera mención/referente no identificable o retirar rechazo; pedir indeterminado explícito reduciría la demanda de selección contextual y debe valorarse. **Sin corrección automática; candidate y validación humana.** |
| IR-03 · preferencia estilística | C10-02 · `it-a1-c10-02-chiedi` | `Un caffè, per favore!` produce abstención, no error lingüístico. | Baja, opcional / alta. | Ampliar accepted si se decide reducir abstenciones. **No aplicado ni considerado bloqueo.** |

La categoría «requiere validación humana» se aplica como disposición pendiente a IR-01/IR-02, sin duplicarlos como hallazgos adicionales. R2 retiene las dudas; no transforma la recomendación del revisor en una afirmación de error confirmado. No se consultaron fuentes lingüísticas adicionales para adjudicarlas: permanecen sin resolver.

## Comparación posterior con 5B.1

Comparación con [informe](A1_EDITORIAL_REVIEW_C01_C10.md) e [inventario](A1_EDITORIAL_CHANGES_C01_C10.json), realizada después del dictamen ciego:

- **Omisión C06-01:** 5B.1 corrigió las comillas de no/non en Theory y feedback de `riconosci`; no modificó `nega`. Declaró seis actividades revisadas sin flags. IR-01 identifica una duda residual entre alcance neutro y contraste, no invalida aquella corrección de español.
- **Omisión C10-02:** 5B.1 revisó introducción/petición/identificación, pero `caffe` no figura entre los cambios. IR-02 cuestiona la suficiencia de su contexto y obliga a retener la aprobación mientras se resuelve.
- **Diferencia no bloqueante:** `chiedi` sí cambió en 5B.1 para aceptar posiciones de `per favore`. IR-03 propone además exclamación; el comportamiento es abstención conforme al contrato, no falso rechazo confirmado.
- **Concordancia limitada:** el revisor no encontró errores inequívocos en las versiones actuales de las 29 Theory ni en las 148 actividades. Esto no prueba que todos los cambios anteriores fueran necesarios, ni certifica las 79 actividades no muestreadas. No hay falsos positivos de 5B.1 demostrados por este dictamen.
- **Discrepancia operativa:** «0 flags conocidos» describía el cierre de 5B.1; ahora hay dos dudas abiertas. El informe histórico se conserva y este documento registra el nuevo estado.

Mejoras necesarias para el proceso: contrastar cada rechazo explícito con el contexto exacto de la consigna; distinguir negación neutra y contrastiva; comprobar identificabilidad discursiva sin reducir inadvertidamente la capacidad evaluada a elegir una forma dada; separar abstenciones de errores; guardar cobertura exacta, dictamen previo a comparación y límite del muestreo. Las preferencias de puntuación deben separarse de bloqueos y nunca normalizar globalmente signos relevantes para C06.

## Correcciones, versiones y estados

**Ninguna corrección lingüística aplicada**, al no existir errores inequívocos. No se alteran enunciados, Theory, accepted/rejected, canon, currículo, evaluador ni snapshots históricos.

Se actualiza únicamente la decisión editorial de C06-01 y C10-02 a candidate, con flags IR-01/IR-02, conforme al contrato que impide reviewed con dudas abiertas. Lote identificado como `it-a1-editorial-c01-c10-2026-10-13-cross-review-1`; provenance distingue las 27 decisiones conservadas de 5B.1 de las dos retenciones de 5B.2. Los recibos anteriores permanecen en Git. Inventarios, versiones y huellas originales se conservan porque el contenido no cambió; no se regeneran aprobaciones ni se presenta la muestra independiente como revisión integral de 227 actividades.

| Entidad | reviewed | candidate | published |
|---|---:|---:|---:|
| Concept | 27 | 72 | 0 |
| Theory | 27 | 72 | 0 |
| Actividad | 214 | 651 | 0 |
| Vocabulario | 96 | 220 | 0 |
| Template | 2 | 0 | 0 |

Las 13 actividades de los dos conceptos retenidos quedan candidate. El vocabulario compartido conserva sus decisiones por otros conceptos revisados. Los 70 conceptos de C11–C34 siguen intactos. Ningún elemento publicado; no se habilita producción.

## Validaciones y tests

- Diez hashes originales correctos; cobertura exacta del dictamen cotejada con manifiesto: 29 Theory, 148 actividades, 42 cambios y 15 listas, sin regeneración.
- **9/9 pruebas editoriales** (`editorial-pilot` y `editorial-review`), incluida la transición efectiva de Concept/Theory/actividades a candidate, huellas, versiones, aislamiento de C11–C34, exclusión en producción y conservación de snapshots.
- Typecheck y formato de los dos archivos TypeScript modificados correctos. `content:editorial -- --json`: sin errores, huellas vigentes y totales de la tabla.
- Reproducción directa con el evaluador actual: IR-01 e IR-02 → `linguistic-error`; IR-03 → `not-evaluable`. Confirma comportamiento técnico, no resuelve el juicio lingüístico.
- Primer intento de tests/tipos falló por Node antiguo activado por el shell; repetido correctamente con Node 22.23.3. Vitest necesitó autorización de escritura para su caché en el repositorio, fuera del workspace inicial; ejecución posterior correcta.
- Sin repetición de auditorías estructurales, Research Pack, E2E ni builds generales: cambios limitados a decisiones editoriales y trazabilidad, cubiertos por pruebas específicas. Sin cambios de UX, infraestructura o dependencias. Diff revisado.

## Git y continuación

Commit de cierre en esta rama con mensaje `docs(content): complete blind C01-C10 cross-review and hold ambiguities`; el hash se entrega al usuario después de crearlo. Sin merge, push, publicación ni despliegue.

Recomendación: resolver IR-01/IR-02 con validación editorial humana antes de recuperar reviewed o escalar el proceso. IR-03 es opcional. La revisión humana cualificada para publicación sigue pendiente. **Detenerse tras esta entrega; no iniciar C11–C34.**

## Decisiones explícitas posteriores — cierre parcial

Sergio autorizó resolver IR-01/IR-02 mediante consignas concretas, mantener accepted/rejected y restaurar reviewed solo tras revisión satisfactoria sin respuesta revelada.

**IR-01 aplicado:** `it-a1-c06-01-nega` pasa de versión 1 a 2, incluido criterion.version y trace.sourceVersion. Enunciado literal: «Trasforma «Sono a casa» in una frase negativa semplice, senza aggiungere altre parole.» Feedback y pista: «En la negación simple enseñada, non se coloca antes de sono: Non sono a casa. Las construcciones contrastivas tienen otro alcance.» Accepted/rejected sin cambios. Revisión completa de actividad, contexto, pista, explicación, criterio y Theory: la consigna no muestra non ni su posición; se entiende que la transformación agrega la negación requerida y no amplía el resto de la oración. La exclusión de construcciones contrastivas se limita a esta tarea. C06-01 vuelve a reviewed con inventario actualizado y huella nueva.

**IR-02 pendiente de aclaración:** el texto solicitado incluye «Chiedi un caffè» antes de «___ caffè», que permite copiar Un y contradice la validación de no revelar directamente la respuesta. Se ha pedido elegir entre sustituir ese fragmento por «Ordina questa bevanda» o conservar el literal y mantener candidate. No se interpreta la ausencia de respuesta como aprobación. C10-02-caffe permanece en versión 1, sin cambios de texto, criterio o feedback; su recibo candidate sigue vigente. La situación discursiva propuesta resuelve la duda de referencia, pero no puede darse por superada la validación pedagógica con ese modelo explícito.

Lote `it-a1-editorial-c01-c10-2026-10-13-cross-review-2`; solo nuevo recibo de C06-01. Estado vigente: **28 Concepts/Theory reviewed, 71 candidate, 0 published; 220 actividades reviewed y 645 candidate**. Vocabulario y templates sin cambios. Paquetes y dictamen ciego se conservan como evidencia histórica de v1, no como revisión independiente de v2.

Validaciones: 9/9 pruebas editoriales; tipos y formato correctos; reporte editorial sin errores. Comparación del pack antes/después: solo cambia C06-01-nega; accepted/rejected idénticos, las otras 28 huellas intactas, Theory/vocabulario/templates/relaciones y C11–C34 idénticos. Diff revisado. Sin repetición de E2E/build generales por alcance localizado. No publicación, merge, push ni despliegue. Cierre de ambas decisiones pendiente de la aclaración de C10-02.

## Cierre definitivo de IR-02 — decisión explícita de Sergio

Enunciado definitivo aplicado literalmente a `it-a1-c10-02-caffe`:

> Entri in un bar e fai una nuova ordinazione. Chiedi la bevanda indicata, senza riferirti a una consumazione già identificata: ___ caffè, per favore.

Feedback y pista contextual:

> Un caffè, per favore es la forma neutra para solicitar una consumición nueva no identificada. Il caffè, per favore puede usarse en otros contextos con una consumición identificable; no corresponde al contexto indicado aquí.

Actividad, criterio y trace.sourceVersion **1 → 2**. Accepted `Un`, rejected `Il`/`Uno`, exhaustive false, IDs, objetivo, contexto bar y formato cloze permanecen intactos. Theory, vocabulario y relaciones no cambian.

**Revisión completa satisfactoria de R2:** contrastados enunciado, contexto, respuestas, pista, explicación, formato, atribución y Theory C10-02. El texto no presenta «un caffè» antes del hueco ni ordena usar un indeterminado. «Un bar» identifica el establecimiento y no proporciona el grupo nominal que debe completarse. «La bevanda indicata» señala el tipo de bebida escrito tras el hueco, no una consumición ya identificada. La exclusión explícita de esa consumición permite justificar Un frente a Il dentro de esta tarea; no se formula una prohibición general de Il caffè. Uno conserva su rechazo ante caffè. La pista consultable y el feedback sí explican la solución, conforme a su función de ayuda/corrección, no como parte del enunciado inicial. No queda bloqueo IR-02.

Recibo nuevo de C10-02: inventario con actividad v2 y huella actualizada; decision reviewed, flags vacíos. Lote `it-a1-editorial-c01-c10-2026-10-13-cross-review-3`. Se conserva el recibo vigente de C06-01 y los otros 27; no se regeneran sus huellas. Paquetes originales y dictamen independiente permanecen congelados sobre v1: esta revisión posterior de v2 corresponde a R2 aplicando la decisión del usuario, no a un nuevo dictamen ciego. IR-03 continúa como mejora opcional no aplicada.

**Estado final:** Concepts y Theory 29 reviewed/70 candidate/0 published; actividades 227 reviewed/638 candidate; vocabulario 96 reviewed/220 candidate; 2 templates reviewed. Sin publicación. La aprobación editorial humana cualificada antes de publicar sigue pendiente.

**Validación:** 9/9 pruebas editoriales, con casos Un correcto e Il/Uno incorrectos para este contexto y regresión de IR-01; tipos y formato correctos. Reporte editorial sin errores ni recibos obsoletos. Comparación de snapshots del pack authored: solo cambia C10-02-caffe; las otras 28 huellas, Theory, vocabulario, templates, relaciones y todo C11–C34 permanecen idénticos. Versiones del criterio y trace coherentes. Diff revisado. No se repiten E2E/build generales por alcance localizado; no cambia el motor ni la interfaz.

Cierre en `feat/editorial-cross-review-c01-c10`, commit con mensaje `fix(content): resolve IR-02 with contextual article prompt`; hash entregado al usuario tras crearlo. **Detenerse: sin C11–C34, publicación, merge, push ni despliegue.**
