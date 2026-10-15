# A1 Review Engine — implementación de fase 6A

Fecha: 2026-10-15. Rama `feat/a1-review-engine`, baseline `d93d923` (cierre de 5C). Implementación local pendiente de validación humana. No se declara eficacia pedagógica ni V1 completa.

## 1. Diagnóstico y arquitectura reutilizada

Antes de implementar se leyeron `AGENTS.md`, el contexto operativo, el informe 5C, Learning Model §§2–6 y Mastery/Review/Error Model §§1–8; se inspeccionaron catálogo, sesión, evaluación, proyección, UI y persistencia reales.

| Área | Existente en 5C | Incorporado en 6A |
| --- | --- | --- |
| Evidencias | Attempt, Evaluation, Evidence, TheoryExposure y revisiones de sesión; versiones, ayudas, reintentos y procedencia | Mismo circuito para sesiones `review`; no segunda fuente de progreso |
| Progreso | `project`: observaciones por dimensión y habilidad, sin porcentaje de dominio | La recomendación consulta esa proyección y los hechos originales |
| Errores | Juicios correct/typo/linguistic-error/verifiable-error/not-evaluable/no-opportunity; no diagnóstico causal | Agrupación explicable por concepto/dimensión y ocasiones; no taxonomía lingüística nueva |
| Tiempo | `occurredAt`, secuencia y dispositivo en cada hecho | Última lectura/respuesta, próxima invitación y reloj explícito para selección |
| Actividades | Catálogo versionado y filtrado editorial; práctica focal en orden de catálogo | Selección determinista de una muestra de actividades del mismo concepto |
| Persistencia | IndexedDB v1, hechos append-only, escritura atómica con outbox, heads, respaldo e idempotencia | Reutilización íntegra, sin tabla, migración ni sincronización nueva |
| Review | Contrato `ReviewScheduler` sin implementación | `LocalReviewScheduler`, `reviewPlans`, `selectReviewActivities` y UI |

La política de observaciones sigue siendo `observations-v2`; su constante se mueve al contrato de evidencia para evitar el ciclo proyección → sesión → review → proyección. El algoritmo de recomendación es `review-v1`. La sesión conserva su motivo de selección, versión de política y snapshot de actividades. No se alteran los criterios de evaluación.

## 2. Algoritmo de selección y justificación

Solo entran conceptos habilitados con actividades de su versión actual y una lectura de Theory o respuesta registrada. Abrir una sesión sin responder no introduce por sí solo el concepto. Se filtran pack, estado editorial y versión de concepto. Los IDs de hechos se deduplican; el resultado no depende del orden de entrada.

Cada `ReviewPlan` expone razones, IDs fuente, dimensiones con errores, última práctica/lectura, próxima invitación y número de actividades todavía no respondidas. Es una proyección reconstruible, no un nuevo estado de dominio persistido. La sesión congela el motivo y las actividades; las recomendaciones posteriores pueden cambiar sin alterar sesiones abiertas.

La ausencia de un acierto independiente en una dimensión disponible se presenta como falta de observaciones, no desconocimiento. Se excluye retención de esa comprobación: el catálogo actual no ofrece una batería independiente que permita acreditarla automáticamente.

Fundamento: [Learning Model](../research/01_Learning_Model.md) §§3, 5–6 y [Mastery/Review/Error Model](../research/04_Mastery_Review_Error_Model.md) §§2, 4, 7. Las reglas de orden son decisiones operativas explícitas; no pesos científicos ni puntuaciones de dominio.

## 3. Priorización de conceptos y actividades

Orden categórico de conceptos:

1. Dificultad observada en más de una ocasión del mismo concepto/dimensión.
2. Recuperación fallida independiente.
3. Otros errores lingüísticos/verificables iniciales.
4. Dimensiones sin observación correcta independiente e invitación diferida disponible.
5. Dimensiones sin esa observación, todavía dentro del intervalo.
6. Dificultad histórica con éxito independiente posterior.
7. Otros conceptos estudiados para comprobación voluntaria.

Las categorías 1–3 bajan de prioridad cuando hay un acierto independiente posterior en cada dimensión afectada. **No desaparecen los errores ni su motivo de revisión**, ni se declara resuelta la dificultad. No se establece un umbral de dominio. Dentro de categoría, se ordena por invitación disponible, práctica más antigua y finalmente ID. Los números internos 0–6 son posiciones ordinales, no un score.

Recurrencia significa más de una combinación sesión/actividad con error inicial en la misma dimensión. Los reintentos de una respuesta no crean nuevas ocasiones; typos y abstenciones tampoco. Errores con ayuda siguen siendo observaciones lingüísticas, pero no recuperación independiente fallida. Esto no diagnostica que dos errores compartan una causa lingüística concreta.

Actividades: primero IDs/versiones todavía no respondidos; después dimensiones con errores y habilidades de recuperación, discriminación, transformación y producción controlada. Se usan antigüedad de respuesta, ausencia de opciones, habilidad e ID para ordenar; la selección introduce diversidad de habilidades dentro del mismo nivel, por lo que antigüedad no es una regla estricta para todas las posiciones. No repite IDs dentro de sesión. Se conservan consigna, dificultad y criterios editoriales; no se combina con objetivos de conceptos nuevos.

La UI usa hasta cuatro actividades por sesión, una muestra breve dentro del ejemplo orientativo de 3–5 respuestas del Learning Model §6. Es un límite de producto, no una dosis validada ni umbral de aprendizaje. El selector admite presupuestos explícitos de 1–30; el scheduler limita conceptos según presupuesto. El alumno elige un concepto y puede terminar antes.

## 4. Repaso diferido

`nextCheckAt = última lectura o respuesta + intervalo`. Valor inicial: **24 horas**, documentado como invitación orientativa basada en el ejemplo «al día siguiente» de Research 04 §4. El intervalo es configurable al construir el scheduler o llamar la función pura; no hay configuración pedagógica nueva en UI.

Los avisos se recalculan al abrir la vista; no se añaden notificaciones ni tareas en segundo plano.

No se introduce SM-2, FSRS, curva de olvido, deuda acumulada ni crecimiento automático de intervalos. Fallos/ayudas afectan a la selección de práctica, pero no activan un calendario adaptativo no calibrado. La práctica voluntaria sigue disponible antes del próximo aviso. Una nueva lectura/respuesta desplaza la próxima invitación; editar un borrador, pausar o abrir una sesión no lo hace.

El reloj es argumento explícito de `reviewPlans`/`suggest`; los tests controlan también Date para fechas de persistencia. Se verifica el instante anterior al intervalo, el límite, la configuración alternativa y el avance tras responder. El tiempo no crea ni elimina Evidence, ni cambia retroactivamente el progreso.

## 5. Experiencia de usuario

Home enlaza a Ripasso en Practicar. Allí aparecen conceptos estudiados, motivos, última práctica, próxima invitación y aviso sobre actividades nuevas o agotadas. El usuario elige «Ripassa», confirma «Inizia il ripasso» y responde sin una explicación previa obligatoria.

Se reutilizan controles, teclado, ayudas, feedback y resumen existentes. «Pausa e torna alla pratica» conserva la sesión activa; «Continua ripasso» recupera su última revisión. «Termina la sessione» la cierra y ofrece un resumen parcial. Las sesiones completas permanecen accesibles como «Riepilogo ripasso», y enlazan al progreso común.

No se añaden puntos, rachas, cronómetros ni bloqueos de avance. La navegación existente protege cambios pendientes de guardar. Las tarjetas no presentan conceptos como deuda ni certifican dominio.

## 6. Evidencias

Cada envío conserva Attempt → Evaluation → Evidence cuando el juicio es evaluable, más la revisión de sesión en la misma transacción. No-opportunity y not-evaluable guardan intento/evaluación, sin Evidence negativa; typo conserva su categoría y no se usa para priorizar errores lingüísticos. Se conserva el historial incluso tras aciertos posteriores.

La exposición previa a la corrección del mismo ID/versión impide volver a contar ese ítem como independiente, incluso días después. Pistas, Theory consultada durante sesión y reintentos mantienen las reglas existentes. «Sin ayuda» no acredita independencia de memoria reciente ni retención real. No se fabrican evidencias de retención por cambiar el modo a `review`.

Trazabilidad: versiones, snapshot, respuesta, criterio/evaluador, procedencia editorial y referencias entre hechos permanecen verificables con `validFact`/`validLinks`. Los IDs fuente de la recomendación se exponen en la proyección; no se copian como enlaces adicionales al root, cuyo contrato sigue exigiendo las referencias originales. El motivo y versión congelados permiten identificar la política aplicada, aunque no constituyen un snapshot completo del plan.

## 7. Persistencia

Sin cambio de esquema IndexedDB. Se amplía el modo serializable a `focus | review`; el validador acepta `review-v1` únicamente en raíces de sesión review. Intentos, estados y evidencias mantienen su política de observaciones. Se conservan los hechos focales antiguos.

Probados cierre/reapertura de base, snapshot de sesión, restauración de draft, envío/feedback, protección ante head obsoleta, respaldo/importación repetida, validación de enlaces y consumo de página por el mecanismo local existente. En navegador se prueba pausa, cierre de página, reapertura offline y recarga del feedback, con un único intento/evidencia pese a doble click.

Offline requiere una visita previa con recursos cacheados. No se simula apagado abrupto, expulsión de almacenamiento, cuota agotada ni navegación móvil nativa. Clientes/servidores antiguos que desconozcan `review-v1` no pueden consumir estas sesiones hasta actualizar su validador; no se despliega ningún servicio en esta fase.

## 8. Integración

Currículo/Concept → selección del catálogo → SessionEngine → Exercise Engine canónico → hechos de aprendizaje → proyección común → Progreso. La sesión usa un único concepto, preservando el contrato de atribución y la dificultad del material existente. La recomendación no genera contenido ni modifica el grafo curricular. Prerrequisitos continúan como recomendaciones del catálogo, sin hard locks.

No se implementan Mixed Practice, Reading/Writing completos ni sincronización remota nueva. El modo review funciona en desarrollo/build de validación; producción mantiene la exclusión de contenido no publicado.

## 9. Escenarios probados

- Perfil vacío, concepto solo abierto, Theory estudiada, versión obsoleta y catálogo no habilitado.
- Recurrencia frente a recuperación fallida, evidencia faltante, empate por antigüedad/ID, historial invertido y duplicado.
- Error en varias dimensiones, typos, abstenciones, reintentos y éxito posterior conservando errores anteriores.
- Presupuesto, actividad nueva antes que repetida, selección determinista y mismo snapshot al reanudar.
- Intervalo controlado y ausencia de Evidence de retención automática.
- Envío concurrente/duplicado, enlaces, cierre/reapertura de IndexedDB, importación idempotente y página sincronizada local.
- Flujo real de cuatro actividades, resumen e integración con Progreso en 320/375/390/768 px.
- Pausa y recuperación offline del borrador y feedback sin duplicados.

## 10. Tests y revisión

Batería completa: **291/291 tests, 18 suites**, con `npm test -- --maxWorkers=2`. Después se reforzó la prueba de persistencia (cierre real de IndexedDB y consumo local de una página review): **10/10** casos focales correctos, sin cambios de producción posteriores. Typecheck, formato global, build de validación, coverage curricular y auditoría editorial correctos. E2E nuevos: **5/5** en ejecución focal. **Regresión E2E general: 34/34 casos de validación correctos y 1 omisión intencional** (producción). **E2E de producción: 1/1 correcto**, ejecutado aparte sobre build normal, incluyendo exclusión de recomendaciones y acceso directo review. Build normal y typecheck finales correctos. Total: 35 casos E2E únicos comprobados. Ambos builds conservan el aviso previo de chunk >500 kB; sin optimización de bundle.

Nuevos archivos: `tests/review.test.ts` (10 casos) y `tests/e2e/review.spec.ts` (5 casos).

Incidencias durante desarrollo: QA reprodujo un orden no determinista de `errorDimensions` al invertir los hechos; corregido con orden estable y prueba de regresión. El primer helper E2E no manejaba ordenación de palabras; corregido, sin atribuir el fallo a persistencia. La primera batería general tuvo 290 aciertos y un timeout de 20 s en un test pedagógico bajo ejecución concurrente; se repite con dos workers, sin relajar el timeout ni modificar la prueba. Al reforzar la prueba de página sincronizada faltaba `receivedAt` en el fixture: typecheck lo detectó; se completó y se repitieron build/typecheck y los 10 casos focales con resultado correcto.

Inspección visual: captura de feedback a 320 px legible, controles y navegación coherentes, sin desbordamiento horizontal; E2E comprueba los cuatro anchos. No equivale a validar teclados virtuales, Safari/iOS, lectores de pantalla ni observación con alumnos. Capturas regenerables en `test-results/review-*-feedback.png`.

Comandos reproducibles con Node 22.23.3 en PATH:

```sh
npm test -- --maxWorkers=2
npm test -- tests/review.test.ts --maxWorkers=1
npm run typecheck
npm run format:check
npm run content:coverage
npm run content:editorial
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e
npm run build
E2E_PRODUCTION=1 PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npm run test:e2e -- --grep 'production build'
```

El build local final es el normal, sin acceso al contenido reviewed. Para validación humana usar desarrollo o reconstruir con `VITE_ENABLE_CANDIDATE_CONTENT=true`. No se ha desplegado. E2E usa Chrome de escritorio y el servidor de test Worker/SQLite; no runtime Cloudflare nativo ni remoto en este macOS.

## 11. Limitaciones

- Banco finito: tras agotar actividades nuevas, se rotan conocidas y se avisa. Focus todavía puede consumir todo el banco; no se reservan contenidos editoriales nuevos.
- Novedad se define por ID/versión respondido, no por equivalencia semántica demostrada. No hay muestreo longitudinal validado ni evaluación adaptativa de vocabulario conocido.
- Agrupar errores por dimensión no sustituye ErrorPattern lingüístico ni permite deducir interferencia, causa mental o impacto comunicativo.
- El historial de dificultades sigue disponible; no existe una política calibrada de «dificultad resuelta» ni dominio estable.
- Invitación fija/configurable de 24 h, sin intervalos crecientes. Las señales de ayuda/fallo no calibran una fecha óptima.
- La lista de conceptos puede crecer hasta los estudiados; solo se inicia una muestra de un concepto, sin cola obligatoria. No se acredita escalabilidad con años de historial.
- Validación humana del flujo y de utilidad pedagógica pendiente. V1 aún tiene brechas de Mixed/Reading/Writing.

## 12. Diferencias frente a investigación

Se implementa la parte observable: historial separado por dimensiones, fallos y ayudas, recurrencia no causal, oportunidades variadas y comprobación posterior orientativa. El modelo recomienda ampliar/acortar distancia según rendimiento, contrastar conceptos conocidos y comprobar transferencia. Esas recomendaciones requieren calibración, oportunidades reservadas y/o Mixed Practice, por lo que no se convierten aquí en fórmulas automáticas.

El ejemplo de otro día se operacionaliza como 24 h; no se presenta como intervalo científicamente óptimo. Cuatro actividades y el orden lexicográfico son políticas de producto explícitas. Retención, estabilidad y eficacia requieren observaciones humanas posteriores y tareas apropiadas.

## 13. Estado editorial

Sin cambios en `src/content`, canon, Theory, actividades, vocabulario, relaciones ni recibos. Auditoría: **99 conceptos reviewed, 99 Theory, 865 actividades, 316 entradas, 2 templates reviewed; 0 conceptos candidate, 0 published**. Se conservan las 210 relaciones y los 99 recibos. Persisten los límites de revisión humana del cierre 5B.4; ejecutar pruebas no amplía la revisión editorial.

## 14. Commits y Git

Rama local `feat/a1-review-engine`, creada sobre `d93d923`, que contiene las fases anteriores necesarias y no están en main. Se conserva esa continuidad sin modificar main ni descartar trabajo. Commit técnico: `0cb9d59` (`feat(review): add deterministic A1 review sessions and validation`). El informe y el contexto se guardan en un segundo commit documental, cuyo hash se comunica en la entrega. Diff revisado y `git diff --check` correcto; sin cambios de dependencias ni contenido editorial. Sin merge, push, publicación ni despliegue. README no se cambia: su actualización previa a un eventual merge queda condicionada a validación/autorización futura.

## 15. Recomendación para la siguiente fase

Validar este flujo con el usuario y, posteriormente, observar recuperación diferida con adultos y oportunidades equivalentes nuevas para calibrar intervalos y resolución de dificultades. Decidir el siguiente incremento por encargo separado. No iniciar Mixed Practice ni Reading/Writing como continuación automática.

**Detenerse al entregar 6A.**
