# Fase 5C — validación funcional y pedagógica integral del A1

Fecha: 2026-10-15. Baseline: `8ac7e64`, cierre editorial 5B.4. Rama: `feat/a1-end-to-end-validation`, creada desde ese cierre para conservar el contenido solicitado; no se modifica `main`.

## Alcance y criterio

Se contrasta la implementación con Learning Model §§1/3–6, Mastery/Review/Error Model §§1–8 y Exercise Taxonomy §§1/2/4–6. Se consultaron AGENTS, contexto operativo e informe final 5B.4. No se repite la revisión lingüística de las 865 actividades.

Los alumnos son simulaciones deterministas. Usar las respuestas accepted del catálogo verifica la integración técnica, no que un adulto comprenda las consignas, aprenda ni retenga. Se distingue: prueba automatizada, inspección de código/capturas por R2, validación humana pendiente y funcionalidad ausente. No hay experimento longitudinal ni certificación A1.

## 1. Recorrido curricular

**Implementado:** Home → Biblioteca → ficha con Theory → práctica focal → respuesta/feedback/reintento → siguiente actividad → resumen → progreso → ficha o Biblioteca. Los 99 conceptos son accesibles en la compilación de validación. Cada sesión conserva las actividades/versiones seleccionadas; no cambia de contenido por una actualización posterior del catálogo.

La suite curricular existente completa las actividades de cada uno de los 99 conceptos a través de SessionEngine + IndexedDB simulado. La nueva integración verifica además Theory sin Evidence y primer intento sin pista en cada concepto. En navegador se completan C01-01 y C34-07 y se atraviesan manualmente C06-01, C14-01, C21-01, C26-01 y C32-01 con dos respuestas por concepto. No se afirma haber recorrido las 865 actividades mediante UI.

**Prerrequisitos:** relaciones recomendadas, enlaces «Prima» en la ficha y explicación en la entrada directa a práctica. Catálogo valida referencias y ciclos; acceso libre coherente con el modelo, sin exigir perfección previa. No hay cálculo individual de preparación. El avance entre conceptos/bloques es manual, no una ruta adaptativa ni un botón automático «siguiente concepto». Terminar una sesión parcial no acredita completar el concepto; el resumen muestra cuántos ejercicios se respondieron. Llegar a C34 no genera certificado ni estado de dominio del A1.

Fuentes: `src/content/catalog.ts`, `src/learning/session.ts`, `src/ui/pages/{home,library,concept,learning}.ts`.

## 2. Evaluación de respuestas

| Escenario | Resultado real | Hechos |
| --- | --- | --- |
| Correcta y variante accepted | `correct`, «Corretto!» | Attempt + Evaluation + Evidence |
| Rechazo explícito / error dentro de alcance exhaustivo | `linguistic-error`, «Da rivedere» | Evidence negativa del objetivo observado |
| Typo registrado, no rechazado explícitamente | `typo`, «Quasi!» | Evidence separada; no es acierto ni error conceptual |
| Vacía | `no-opportunity`, «Nessuna risposta» | Attempt + Evaluation; sin Evidence |
| Fuera del criterio no exhaustivo / estructura incompleta | `not-evaluable`, «Da verificare» | Attempt + Evaluation; sin Evidence negativa |

Normalización conserva acentos y apóstrofos; admite variación de espacios, mayúsculas y composición Unicode. Las listas editoriales delimitan variantes y near-misses: no existe detección genérica inteligente de typos. Un rechazo explícito tiene prioridad frente a typo. No se convierte la abstención en error lingüístico.

Ejemplos reproducibles: C03-01-noi: `noe` → typo, `voi` → error; C27-01-grafia: `un po’` → correcto; vacío y `fuori criterio 987` → sin Evidence. Los tests preexistentes verifican también formatos estructurados, variantes accepted y alcance abierto. No se infiere fiabilidad ante cualquier respuesta libre italiana.

Fuentes: `src/exercises/{evaluate,response}.ts`, `tests/{engine,learning,curriculum-batch,a1-learning-validation}.test.ts`, E2E learning/engine.

## 3. Evidencias de dominio

La proyección es un historial provisional, no un Mastery Engine calibrado. Separa comprensión, recuperación, uso contextual, discriminación y retención; conserva habilidad y formato en la tarea. Reconocimiento acertado no suma recuperación. Un único acierto no genera dominio; los conceptos sin evidencia permanecen «Non ancora osservato».

Ayuda, Theory durante sesión, reintentos y exposición previa al mismo ítem excluyen independencia. La lectura anterior al inicio es Exposure, sin Evidence; la política actual permite contar el intento posterior como «sin ayuda», aunque sea inmediatamente después de estudiar. Eso describe asistencia registrada, no distancia temporal suficiente ni estabilidad.

Los hechos son acumulativos: un fallo no borra un acierto anterior. Reintentos conservan `retryOf`; versiones de concepto y contenido impiden mezclar alcances históricos automáticamente. La proyección deduplica IDs. La repetición posterior del mismo ítem queda asistida incluso tras 30 días: política conservadora, no motor de retención.

## 4. Progreso

Los contadores y barras corresponden a observaciones almacenadas. El anillo del resumen representa ejercicios con respuesta enviada, incluso vacíos/no evaluables; su etiqueta lo explicita. No es porcentaje de dominio. Los reintentos aumentan intentos, no ejercicios distintos.

Escenario B/C: una selección correcta y dos fallos del mismo hueco, seguidos de reparación, producen comprensión `correct=1`; recuperación `errors=1, assisted=2, correct=0`. Ambos fallos permanecen como Evaluation, pero solo el primero es independiente. El error repetido con ayuda no aparece como segundo error independiente; no existe un detector de patrones recurrentes.

El progreso general muestra las cinco dimensiones y advierte que no hay comprobaciones diferidas. «Conceptos practicados» cuenta conceptos con evaluaciones, también no evaluables; no equivale a conceptos dominados. Retención permanece sin evidencia.

Fuentes: `src/evidence/project.ts`, `src/ui/components.ts`, `src/ui/pages/progress.ts`.

## 5. Persistencia y recuperación

IndexedDB mantiene `meta`, `facts` y `outbox`. Attempt, Evaluation, Evidence aplicable y estado de feedback se escriben en una transacción con comprobación de la revisión esperada. El doble envío no genera duplicados. Los tests existentes verifican rollback, referencias inválidas, versiones concurrentes, importación idempotente y recuperación de snapshots históricos.

En navegador se cierra la página tras guardar un borrador, se abre otra en el mismo contexto sin red y se retoma desde Home; respuesta y feedback sobreviven recarga. Reintentar conserva el historial y cuenta como práctica asistida. Se comprueban los enlaces de todos los hechos del escenario con `validFact`/`validLinks` y una evaluación por intento.

Offline funciona tras cargar/preparar el service worker y recursos. No se promete primer acceso sin red, supervivencia al borrado de datos del navegador ni a expulsión por falta de espacio. Cerrar página no equivale a matar el proceso del navegador o apagar el dispositivo durante una transacción; esos casos no se ejecutaron. Sin nueva sincronización remota; regresiones existentes usan Worker + adaptador SQLite local.

## 6. Repaso y retención

**Disponible:** identificar errores por feedback, resumen e historial; volver manualmente al concepto, consultar Theory y repetir práctica. Las nuevas respuestas dejan evidencia posterior con fechas y procedencia.

**Ausente:** `ReviewScheduler` solo tiene interfaz; no hay selección de conceptos débiles, ErrorPattern, programación, presupuesto de repaso, mezcla adaptativa ni reservas nuevas seleccionadas por intervalo. `SessionEngine.select` solo implementa focus de un concepto, con orden de catálogo. Son funcionalidades pendientes, no fallos del motor existente; no se desarrollan en 5C.

Reloj simulado a +1/+7/+30 días: la evidencia anterior se conserva; el tiempo solo no crea olvido ni dominio. Repetir el ítem no añade recuperación independiente ni retención. Esto verifica una política de software, no retención de alumnos.

## 7. Experiencia móvil

Matriz automatizada: 320, 375, 390 y 768 px, altura 844 px; altura reducida a 420 px durante interacción para aproximar espacio disponible. Home, Biblioteca, práctica vacía, progreso vacío, rutas de concepto/sesión inválidas, input, feedback, resumen, progreso y Theory. Sin scroll horizontal en las vistas comprobadas; entrada con fuente de al menos 16 px; navegación y controles activables, continuidad conservada.

Capturas por ancho en `test-results/a1-validation-5C-mobile-*/`; se regeneran con Playwright y no se versionan. R2 inspeccionó las capturas de input a 320 px, Theory a 375 px, feedback con altura reducida a 390 px, resumen a 768 px y progreso completo a 320 px. Texto legible, foco visible y controles coherentes en esa muestra. La navegación fija ocupa parte del viewport y requiere scroll para controles inferiores, que los E2E activaron correctamente; no se afirma inspección visual exhaustiva de todas las capturas. Las pruebas de teclado usan eventos de escritorio; **teclado virtual nativo, autocorrección de iOS/Android, Safari, gestos táctiles reales y lector de pantalla no están validados**. No se confunde reducción del viewport con un teclado móvil real. No se ha rediseñado la interfaz.

## 8. Escenarios reproducibles ejecutados

| ID / estado inicial | Acciones | Esperado | Observado y evidencias | Incidencias/límites |
| --- | --- | --- | --- | --- |
| A. Perfil vacío | Home → Biblioteca → Theory C01-01 → 11 actividades → resumen/progreso | Primer concepto practicable sin dominio automático | 11 intentos/evaluaciones/evidencias; resumen 11/11; Theory como Exposure | Completar banco no acredita aprendizaje |
| B. C04-01 iniciado | Selección correcta, hueco `sono` dos veces y reparación `sei` | Conservar errores, atribuir reparación asistida | 4 intentos; 2 Evaluation de error; primer error independiente, 2 respuestas asistidas | Sin detección automática de patrón |
| C. Mismo perfil B | Abrir progreso | Reconocimiento separado de recuperación | Comprensión 1 acierto; recuperación 0 aciertos independientes/1 error/2 asistidas | No infiere dominio |
| D. Sesión C34-07 con borrador guardado | Cerrar página, abrir Home, continuar, enviar y recargar | Recuperar respuesta y estado | `il telefono` restaurado; feedback persistido; 1 intento pese a doble click | Mismo contexto persistente; no apagado abrupto |
| E. Perfil con práctica previa | Progreso → ficha → nueva sesión del concepto; reloj +1/+7/+30 en integración | Preservar hechos y distinguir repetición | Intento posterior asistido; sin Evidence de retención; acierto anterior intacto | Repaso manual; no scheduler |
| F. Alumno con progreso parcial | Biblioteca → C06/C14/C21/C26/C32, dos actividades cada uno | Transiciones manuales válidas, preparación orientativa | Cinco sesiones parciales, hechos válidos; resumen 2/N en cada una | No se simula preparación pedagógica real |
| G. Alumno que llega a C34 | C34-07 completo; suite de integración completa 99 conceptos | Final de sesión accesible, sin certificación | 11/11 en navegador; 99 recorridos focales en IndexedDB simulado | No recorrido completo A1 por UI ni retención |
| H. Recursos previamente cacheados | Desconectar → abrir Home → retomar → responder → recargar → reintentar → continuar | Escrituras locales y navegación funcionales | Respuesta/feedback preservados, hechos íntegros, siguiente actividad disponible | Primer arranque offline no cubierto |

El escenario A/F/G de navegador conserva siete sesiones en un mismo perfil y 32 respuestas; la integración curricular existente usa bases aisladas por concepto, no una simulación acumulada de meses de historial. Los tests no miden escalabilidad longitudinal.

### Auditoría de integración

| Conexión | Verificación real |
| --- | --- |
| Currículo → Theory → práctica | Ficha y ejemplos del mismo ID, Exposure separada, snapshot de actividades y versión; 99 conceptos en integración y muestra E2E |
| Ejercicio → evaluación → Evidence | Respuesta por control real, feedback esperado; validación de referencias/atribución y ausencia de Evidence ante abstención |
| Evidence → progreso | Contadores B/C contrastados contra hechos persistidos; separación de dimensiones y ayudas |
| Estado → IndexedDB → navegación | Cierre de página, Home → sesión, feedback tras recarga offline; IDs y enlaces íntegros |
| Sesión → resumen → concepto anterior/siguiente | Resumen completo/parcial y vuelta por Biblioteca/ficha en un mismo perfil |
| Contenido → producción | Comprobación separada con build normal: contenido reviewed no habilitado |

No se reduce la auditoría a módulos aislados: combina UI, motor, persistencia real del navegador y proyección, además de las transacciones con IndexedDB simulado.

## 9. Bugs encontrados

| ID | Clasificación | Reproducción y resultado | Impacto |
| --- | --- | --- | --- |
| QA-01 | Fallo confirmado, importante | `npm test` en baseline: dos tests generales todavía esperan candidate desde C21; contenido y recibos muestran reviewed | Batería general roja después de 5B.4; no defecto lingüístico |
| SAVE-01 | Inconsistencia de estado, importante | Editar un input previamente guardado: el indicador conserva «Pratica salvata…» hasta que termina la nueva escritura | Confirmación visual prematura de persistencia; no se ha demostrado pérdida de datos |

Los primeros E2E nuevos tuvieron además dos defectos del propio test: consultar el tipo de control antes del render asíncrono y responder `Ho mal di testa` al primer ejercicio C34-07, que pide `il telefono`. Se corrigieron los tests, sin alterar actividades ni evaluador. El resultado «Da verificare» de esa respuesta fuera de criterio era correcto.

## 10. Correcciones realizadas

QA-01: expectativas de estado editorial actualizadas a reviewed en `curriculum-batch.test.ts` y `curriculum-c06-c10.test.ts`; se conservan inventarios y exclusión de producción. Nuevos escenarios en `tests/a1-learning-validation.test.ts` y `tests/e2e/a1-validation.spec.ts`.

SAVE-01: reproducido antes de corregirlo con el E2E `5C persistence`: esperaba «Salvataggio…» y obtuvo «Pratica salvata su questo dispositivo». En `src/ui/pages/learning.ts` cada escritura anuncia guardado pendiente y solo muestra guardado al drenar la cola; un error previo conserva su aviso. La regresión comprueba el aviso inmediato y recupera el nuevo texto tras recargar. No cambios de esquema, contenido, contratos ni dependencias.

## 11. Funcionalidades ausentes

| Funcionalidad | Clasificación | Fase propuesta |
| --- | --- | --- |
| Loop adaptativo: comprobación inicial, preparación individual y siguiente objetivo | Importante; ausencia, no bug | Planificación de recorrido guiado, con política explícita |
| Mixed/Review real, selección de debilidades y comprobaciones diferidas nuevas | Bloqueante para presentar V1 como consolidación integral; ausencia | Fase de repaso/retención con tareas reservadas y política calibrable |
| Reading/Writing extensos integrados | Bloqueante para declarar la V1 completa definida; ausencia | Fase específica de lectura/escritura, fuera de 5C |
| Dominio estable y patrones de errores | Importante; diseño pendiente | Validación de política con observaciones humanas; evitar score único |
| Búsqueda/filtros y orientación dentro de 99 conceptos | Mejora posterior | Iteración UX acotada tras observar uso |

La discriminación/contexto que existe dentro de actividades focales no equivale a modo Mixed ni a composición autónoma.

## 12. Riesgos antes de publicar

- **Bloqueante para publicación:** validación humana cualificada pendiente, incluyendo comprensión de consignas C34-04. Tests y revisión asistida no la sustituyen.
- **Bloqueante operativo esperado:** cero entidades published; el build normal excluye el A1. No se cambia el estado editorial para sortearlo.
- **Bloqueante para anunciar V1 integral:** las brechas de Review/Mixed/Reading/Writing anteriores. Una eventual publicación acotada de práctica focal requeriría una decisión explícita de alcance.
- **Importante:** probar dispositivos móviles reales, teclado/autocorrección, recuperación tras cierre del navegador y condiciones de almacenamiento limitado antes de afirmar soporte móvil completo.
- **Importante:** catálogo cerrado con abstención; las variantes desconocidas no se evalúan. Falta medir tasa de abstenciones/falsos rechazos con respuestas humanas.
- **Importante:** «sin ayuda» indica ausencia de asistencia registrada, no independencia de memoria reciente ni retención.
- **Mejora posterior:** chunk de validación mayor de 500 kB; advertencia existente, optimización excluida de 5C.

## 13. Tests y resultados

| Comprobación | Resultado |
| --- | --- |
| Unitarios/integración completos (`npm test`) | **281/281**, 17 suites; tras corregir QA-01 |
| Nuevos tests de integración 5C | **4/4**, incluidos dentro de los 281; primer intento en 99 conceptos y reloj simulado |
| E2E general sobre build de validación | **28 pasados, 1 omitido intencionalmente** (exclusión de producción, ejecutada por separado) |
| Regresión tras corregir SAVE-01 | **6/6**: nuevo indicador, cierre/reapertura offline, formatos estructurados, loop/ayudas, abstención y Theory |
| E2E sobre build normal | **1/1**: catálogo sin contenido published y práctica directa no habilitada |
| Typecheck | Correcto; además incluido en ambos builds posteriores a SAVE-01 |
| Formato global | Correcto tras formatear el nuevo E2E; primer intento había señalado ese archivo |
| Build de validación y normal | Correctos; advertencia de chunk >500 kB conservada |
| Coverage curricular | 99/99 conceptos presentes, 0 listos para producción, sin errores |
| Auditoría editorial | 99 recibos vigentes, sin errores; estados e inventario preservados |
| Hashes/recibos 5B.4 | Tests editoriales comprueban 14 paquetes originales y 3 seguimientos, versiones y 99 huellas |
| Diff | Revisado, `git diff --check` correcto; sin cambios de contenido, dependencias o infraestructura |

El E2E nuevo de SAVE-01 se añadió después de la batería general. Por tanto se comprobaron **29 casos únicos de validación**, más **1 de producción**, distribuidos entre la batería general y la regresión focal; no se presenta como una única ejecución de 30 tests. La suite general no se repitió entera tras una corrección limitada al aviso de guardado; sí sus seis escenarios afectados. Los 281 tests no fueron repetidos tras esa corrección de UI, que no cambia motor ni persistencia.

Comandos reproducibles (Node 22.23.3 en PATH):

```sh
npm test
npm run typecheck
npm run format:check
npm run content:coverage
npm run content:editorial
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e
# Regresión focal posterior a SAVE-01:
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e -- --grep '5C persistence|5C D/H|candidate loop|theory detail|unknown response|new interactions'
npm run build
E2E_PRODUCTION=1 PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npm run test:e2e -- --grep 'production build'
```

La exclusión de producción es de catálogo/acceso/proyección; no significa que los datos se eliminen físicamente del bundle. El build local final es el normal; para validar visualmente el A1 hay que usar desarrollo o reconstruir con el flag de validación.

Artefactos locales: capturas generales en `test-results/`; reproducción roja SAVE-01 en `/private/tmp/lt-5c-save-before/`, regresión verde en `/private/tmp/lt-5c-save-after/` y producción en `/private/tmp/lt-5c-production/`. Son regenerables y no versionados.

**No ejecutado:** pruebas con alumnos, evaluación lingüística nueva, retención longitudinal, teclado nativo/OS móvil, apagado abrupto, expulsión/cuota de almacenamiento y runtime Cloudflare real. La inspección manual fue de código y capturas, no una sesión presencial con alumnos. Entorno: Node 22.23.3, Chrome de escritorio mediante Playwright; servidor de test Worker + SQLite. La primera invocación con el Node antiguo del PATH falló antes de ejecutar tests; se usó la versión requerida instalada, sin cambiar dependencias. Cloudflare nativo/remoto no se ejecuta en este macOS.

## 14. Estado editorial

Sin cambios a `src/content`, Theory, actividades, vocabulario, relaciones, versiones o recibos. Permanecen **99 conceptos reviewed, 99 Theory, 865 actividades, 316 entradas y 210 relaciones; 0 candidate entre conceptos, 0 published**. El envoltorio del pack sigue candidate; no confundirlo con estado de sus entidades. 99 recibos vigentes; hashes e inventarios originales/seguimientos de 5B.4 cubiertos por sus tests.

Límites heredados: revisión independiente C21–C34 cubre 38 Theory y 291/346 actividades; 55 actividades con primera lectura R2 solamente. No se amplía esa cobertura por ejecutar tests.

## 15. Recomendación para la siguiente fase

Realizar validación humana guiada del recorrido focal con adultos hispanohablantes y revisión cualificada, incluyendo teléfonos reales. Registrar comprensión, ayudas, errores, abstenciones y reanudación; después acordar las fases específicas para las brechas de integración. No declarar eficacia, retención ni V1 íntegra a partir de 5C.

Detenerse tras entregar esta validación. Sin publicación, despliegue, merge ni push. Commit de pruebas/corrección: `3482652`. Este informe y el contexto se conservan en un segundo commit documental, cuyo hash se comunica en la entrega. No quedan fallos conocidos abiertos de las comprobaciones ejecutadas; las limitaciones y brechas anteriores permanecen pendientes.
