# Fase 6D — Writing A1

Actualizado 2026-10-26. **Writing A1 cerrado técnicamente**, con validación humana cualificada y dispositivos físicos pendientes. Rama `feat/a1-writing`, baseline `1830ee1` (cierre Reading). `main` es ancestro; se conserva el trabajo acumulado de Review, Mixed y Reading. Sin publicación, push, merge ni despliegue. No iniciar V1 integral.

## 1. Modelo pedagógico

Derivado de Research 01 §3, Research 02 C01–C34 y Research 03 §6: recuperar formas → construir frases → mensajes guiados → decisiones comunicativas propias. No es una escala de dominio ni un orden obligatorio por cantidad de aciertos. N1 incluye formas y estructuras sencillas sin opciones; N2 transformación y producción contextual delimitada; N3 destinatario y puntos de contenido; N4 mensajes semilibres/libres acotados y hechos pasados tras su preparación.

## 2. Matriz C01–C34

[Matriz por los 99 conceptos](writing-review/coverage.md), [plan previo al corpus](writing-review/coverage-plan.json) y [cruce funcional previo](writing-review/design.md). Cada fila identifica objetivo, oportunidades, nivel, familias y preparación. 99 conceptos tienen oportunidades controladas; no todos necesitan composición exclusiva. Las referencias de tareas abiertas indican preparación/práctica, nunca acierto implícito de todos los conceptos presentes. Prerrequisitos transitivos usan el grafo existente y conceptos introducidos, no dominio supuesto.

## 3. Tipos de producción

Recuperación sin opciones, transformación y frases contextualizadas reutilizan F2/F3/F4. F6/composition permite mensajes guiados, semilibres y libres acotados. Límite técnico de 4000 caracteres, no mínimo de competencia. No IA runtime, comparación por similitud ni nuevo editor de documentos.

## 4. Corpus

270 actividades revisadas existentes: una oportunidad de cada habilidad disponible (recuperación, transformación, producción controlada) por concepto, con IDs/versiones originales. Se conservan 923 actividades previas, teoría y sus recibos. [Inventario seleccionado](writing-review/selection-manifest.json).

19 actividades nuevas: una presentación delimitada con essere y 18 mensajes (12 N3 guiados; cuatro N4 semilibres y dos N4 libres acotados). Funciones: presentación/aclaración, familia, vivienda, restaurante, compra/cantidades/elección, rutina/gustos, invitación/respuesta, planes, reserva, petición de información, transporte, indicaciones y pasado. La suficiencia se basa en la matriz funcional, no en alcanzar 19.

## 5. Evaluación determinista

El evaluador existente conserva normalización NFC, espacios y mayúsculas, sin borrar acentos/apóstrofos. Canon y variantes editoriales producen `correct`; errores enumerados producen error lingüístico; erratas enumeradas se etiquetan como posibles erratas, nunca aciertos. La actividad nueva delimitada declara ejemplos específicos de respuesta incompleta, datos fuera de consigna y expresión válida sin la estructura solicitada: se abstiene sin penalizar gramática. Los demás textos no enumerados no se rechazan.

`writingOutcome` distingue canonical, accepted-variant, confirmed-error, typo, empty, incomplete, off-task, target-not-demonstrated y unassessed. Se guarda junto al juicio del motor, sin cambiar las categorías de evidencia existentes. Las distinciones incompleta/consigna/objetivo solo se afirman donde hay un criterio explícito; no son detectores universales.

## 6. Abstención

F6 se abstiene antes de consultar variantes, incluso ante el modelo literal. Vacío no ofrece oportunidad. Se conserva el texto, se explica la limitación y se enlaza práctica focal evaluable. No genera evidencia, dominio ni error de Review. La frontera de backup/sync también rechaza juicios positivos y evidencia F6/open, no solo la UI. Los textos abiertos usan `writing:<id>` para no introducir conceptos ni retrasar repasos gramaticales incidentalmente.

## 7. Rúbricas

Seis dimensiones explícitas: consigna, estructura objetivo, vocabulario, organización, función y autonomía. En composiciones son guía de autolectura y revisión humana; la UI no puntúa dimensiones desconocidas ni calcula una nota global. Las tareas controladas heredadas conservan sus criterios focales, sin inventar valoración global de escritura.

## 8. Feedback y reparación

Feedback español, consignas/práctica italianas. Error verificable explica la forma; permite reparar conservando el texto. Intentos inmutables con `retryOf`, ayudas y exposición anterior separados. Copiar una solución no cuenta como recuperación independiente. Canon/variante, error, posible errata y abstención tienen mensajes diferenciados. Modelos de composición solo aparecen al solicitar ayuda. Ayuda externa puede declararse mediante el botón correspondiente; su uso no se detecta automáticamente.

## 9. Experiencia

Home/Pratica → Scrittura A1, cuatro niveles desplegables, contexto/objetivos y preparación por tarea, textarea multilínea `lang=it`, relectura antes de envío, rúbrica, ayuda y feedback. Borradores se guardan sin redibujar durante escritura; cola existente y aviso de cambios pendientes. Botones y textarea se deshabilitan durante comandos. Historial de textos/borradores y resumen con primer intento/revisión; párrafos preservados visualmente. No se implementa editor complejo.

## 10. Evidencias

Producción controlada, recuperación y uso contextual mantienen habilidad/dimensión objetivo. Producción comunicativa abierta consta como intento/evaluación no evaluada, sin evidencia positiva. Ayudas, teoría, exposición y reparaciones conservan independencia explícita. La misma ID/versión reutilizada en Focus, Review, Mixed y Writing conserva exposición previa. Doble envío o estado obsoleto no duplica transacciones; una reparación intencional es otro intento asistido, no un acierto independiente nuevo.

## 11. Review y Mixed

Errores focales verificables entran en las proyecciones y recomendaciones existentes. No se penalizan conceptos incidentales en texto abierto. Mixed reutiliza las mismas observaciones de conceptos y su selección previa; no se añade un motor ni se incorporan composiciones abiertas a su banco. Tests comprueban prioridad por error y neutralidad abierta.

## 12. Persistencia y offline

SessionEngine/LocalStore/IndexedDB existentes: snapshot de actividad, borrador, ayudas, respuesta, evaluación y estados. Una transacción registra intento/evaluación/evidencia/estado con expectedHead. Sin migración, tabla de progreso paralela ni sincronización remota nueva. Nuevos contratos compatibles con hechos anteriores; se extiende el protocolo de sesiones y validación de enlaces. El límite 4000 coincide en UI, motor y frontera.

## 13. Revisión editorial independiente

[Inicial R2](writing-review/initial-review.md), [paquete candidato](writing-review/candidate-packet.json), [dictamen independiente](writing-review/independent-verdict.json), [paquete final](writing-review/final-packet.json) y [seguimiento](writing-review/final-verdict.json). Quince huellas conservadas; cuatro correcciones: dos modelos excedían actividades/acciones pedidas, viaje ahora pide al menos dos hechos y encabezado italiano Consegna. 19 aprobaciones de agente independiente; no revisión humana.

SHA256 candidato `2a1074e5f113d15ac3b789b8d9317be5f983727464fbf02d2915fe94411d96b2`; final `82c9811a70a870ebb2d3c4462d1857dd9c0d2aa3c0556bc97f2f2da2abb806f2`. Recibos por ID/versión/fingerprint emitidos después del seguimiento. `content:writing` contrasta contenido, referencias, matriz, recibos, paquetes y hashes.

## 14. Tests y QA

[Dictamen QA final independiente](writing-review/validation/qa-final.md): favorable al cierre técnico, con recuentos e integridad de fuentes y build verificados.

[Revisión de código](writing-review/qa-code-review.md) y [seguimiento](writing-review/qa-code-followup.md). Corregidos veto de evidencia abierta importada, coherencia outcome/juicio, identidad de raíz, normalización desigual y presentación de reparaciones/párrafos. Focales: 21 Writing + 13 engine correctos y typecheck. Primera regresión global: 374/375; única expectativa antigua omitía la nueva habilidad con cero observaciones; corregida y verificada en focales. No se oculta ese fallo inicial.

| Comprobación | Resultado y evidencia |
|---|---|
| Unitarias/integración | **381/381**, 22 suites; [JSON](writing-review/validation/unit-integration.json). |
| Typecheck y formato | Correctos; tipos repetidos en ambos builds y formato tras el arreglo de pegado. |
| Coverage/editorial/Reading/Writing | Correctos; 99 conceptos, 923 actividades previas, 26 lecturas/84 preguntas y 19 recibos Writing intactos; cero publicados. |
| E2E general | [56 correctos, dos omitidos](writing-review/validation/e2e-validation.json), sin fallos ni flaky. Omisiones por configuración de autenticación, resueltas abajo. |
| Sincronización local autenticada | [2/2 correctos](writing-review/validation/e2e-authenticated.json), usando credencial ficticia del servidor de pruebas, no servicios remotos. |
| Writing final y pegado | [7/7 correctos](writing-review/validation/e2e-writing-final.json): cuatro anchos, offline, reparación/abstención y pegado. Añade un caso único a la regresión general. |
| Ajuste final de copy | [4/4 correctos](writing-review/validation/e2e-writing-copy.json), repetidos tras aclarar que revisar un mensaje abierto no es corrección automática. |
| Producción | **1/1 correcto**: [E2E](writing-review/validation/e2e-production.json) y [huellas del build normal](writing-review/validation/production-manifest.json). Rutas Writing nuevas/reutilizadas y modos previos bloqueados; dist final restrictivo. |
| Visual | 16 capturas; [datos de navegador](writing-review/validation/visual-browser.json) y [dictamen independiente](writing-review/validation/ux-verdict.md) favorables dentro del alcance. |

**59 escenarios E2E de validación únicos satisfechos en varias ejecuciones**, sin confundir las repeticiones con casos adicionales. El caso de producción suma **60 E2E únicos verificados**; las ejecuciones generales con omisiones y sus recuperaciones quedan explícitas. Esta regresión de pruebas existentes no inicia la validación integral V1 con usuarios.

El primer E2E Writing dio 5/6: el caso offline esperaba un aviso de guardado tras reload que no corresponde a esa acción. Se corrigió para esperar el editor y después verificar el texto; el caso pasa en las ejecuciones posteriores. [Informe inicial preservado](writing-review/validation/e2e-writing-initial.json).

La inspección adicional de pegado de 260 líneas/3640 caracteres reveló un fallo real: Chrome emitía eventos input repetidos con el mismo valor final, creando numerosos estados idénticos y prolongando Salvataggio. El texto estaba conservado en IndexedDB, sin error lingüístico ni pérdida demostrada. La guardia de valor consecutivo se limita a Writing; A→B→A sigue guardando cada edición distinta. El E2E nuevo exige un estado por pegado, ignora eventos idénticos y comprueba cambios posteriores y recarga. El barrido final recupera los 3640 caracteres en los cuatro anchos.

R2 inspeccionó cuatro capturas finales; UX independiente inspeccionó las 16 (editor, rúbrica, feedback y texto largo reanudado, a 320/375/390/768). Foco visible, párrafos y aviso de abstención legibles, sin overflow horizontal ni pageerror. A 768 se usó zoom CSS200% antes de recargar; long-resumed vuelve al zoom normal. Footer fijo cubre fragmentos en ciertas posiciones/capturas, pero los E2E alcanzan y pulsan controles; no se ha demostrado bloqueo. No es auditoría WCAG ni teclado móvil real. El hallazgo menor «con la correzione» en texto abierto se resolvió con «Rivedi il testo dopo il feedback: non è una correzione automatica» y los cuatro E2E repetidos; las capturas previas conservan el texto antiguo como evidencia histórica.

Builds y pruebas quedan vinculados por [build general](writing-review/validation/e2e-global-build.json), [arreglo de pegado](writing-review/validation/paste-fix-manifest.json) y [copy final](writing-review/validation/final-validation-manifest.json). El código funcional ajeno a Writing permanece igual entre la regresión general y las repeticiones focales; el cambio de Progreso solo sustituye el identificador sintético por el título del mensaje. Advertencias existentes: SQLite experimental en servidor Node y bundle >500kB; sin optimización solicitada.

## 15. Limitaciones

Sin corrección universal, nota global, certificación A1, retención ni eficacia acreditada. Validación humana cualificada, teclados/dispositivos físicos y tecnologías asistivas reales pendientes. Repetir modelos conocidos no acredita transferencia. Pruebas de servidor Node local, no Cloudflare remoto/nativo.

## 16. Riesgos

Banco controlado finito y sin reservas diferidas exclusivas. Rúbricas requieren comprensión del alumno y valoración humana para calidad comunicativa. Almacenamiento local depende del navegador; backup existente sigue disponible. Bundle grande ya conocido, sin optimización fuera de alcance. Candidate/reviewed se empaquetan en JS por imports estáticos; exclusión de producción es acceso/catálogo, no eliminación física del texto.

## 17. Estado editorial

Autoría nueva candidate, 19 recibos reviewed efectivos; cero published. Contenido previo intacto. El build normal bloquea listado e inicio directo; el de validación permite el contenido revisado. No publicación ni despliegue.

## 18. Git

Rama `feat/a1-writing` desde `1830ee1`, con toda la historia 6A–6C y main como ancestro. Commit técnico local **`f859c45`**: implementación, corpus/recibos, pruebas y evidencias. Informe/contexto y dictamen QA agregado se guardan en el commit documental posterior, identificable en `git log`. No push/merge/despliegue. README se actualizará antes de un eventual merge autorizado, no se afirma V1 validada.

## 19. Recomendación V1

Tras cierre técnico, validar con una persona cualificada muestras de mensajes y comprensión de los límites; probar dispositivos/teclados reales y tecnologías asistivas. La validación integral V1 requiere autorización separada. **Detenerse al completar Writing.**
