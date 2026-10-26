# A1 V1 — informe final de integración técnica

Fecha: 2026-10-26. Rama `feat/a1-v1-integration`. **Fase 7 cerrada técnicamente, con dictamen QA favorable.** Integración preparada para validación humana; no constituye validación humana ni certificación pedagógica. Cambios conservados en commit local y árbol limpio comprobado en la entrega.

## 1. Ramas y commits

Inicio en `feat/a1-writing` limpio, `0415c6b`, implementación `f859c45`. Ancestro común con main: `9dcb05f1af40533bbe34e237713d957193971405`. Todas las ramas anteriores ya eran ancestros de Writing: no hubo que fusionarlas separadamente. Review `571d382` tiene 0 commits exclusivos y 10 posteriores; Mixed cobertura `f439d74`, 0/6; Reading `1830ee1`, 0/2. Integración creada desde Writing preservando el historial. Checkpoint `18e1992`; el commit de cierre se identifica por `git log -1` y en la entrega. Sin push, merges a main/development, promoción de contenido ni despliegue.

## 2. Funcionalidades integradas

Inicio/Biblioteca → Theory → Focus → feedback/resumen → Progreso → Review → Mixed → Reading → Writing → recuperación/historial. Todos usan el motor de sesiones y hechos persistidos existentes. No cambios de producción, currículo, motores, dependencias ni infraestructura. La única modificación ejecutable de esta fase es el E2E transversal; el helper existente se completa para matching (índices JSON) y ordering (palabras habilitadas). Se reutilizan Playwright, servidor local y escenarios existentes.

## 3. Recorrido E2E representativo

`tests/e2e/v1-integration.spec.ts` inicia con perfil vacío y navega por enlaces reales. Estudia y completa C04-01, comprueba progreso, completa Review, prepara y completa Mixed, completa Reading con ayuda y redacta Writing abierto con ayuda. Cierra la pestaña, abre otra offline, recupera borrador, compara los hechos completos y la proyección de C04-01, envía con doble click, recarga feedback y recupera historiales.

Resultado: **1/1 focal y repetición correcta dentro de la regresión global**. Perfil final: **219 hechos, 33 intentos, 32 evidencias**. La composición abierta conserva intento/evaluación, sin evidencia de dominio. [Resultado focal](integration-validation/transversal.json), [regresión por caso](integration-validation/regression.json).

## 4. Integridad de evidencias

El transversal verifica `validFact`/`validLinks`, una evaluación por intento, unicidad de evaluación referenciada por Evidence, atribución al concepto/dimensión de cada actividad, comprensión lectora separada, ayuda Reading no independiente, exposición Focus→Review no independiente y ninguna evidencia de retención ni de composición abierta. La igualdad exacta de todos los hechos tras recuperación protege los cinco modos; la comparación explícita de proyección se limita a C04-01.

Las suites vigentes amplían la comprobación a reparación, errores/erratas/abstención, importación, vínculos, control de concurrencia y exposición compartida. No se introduce dominio paralelo ni se infiere dominio por completar actividades. No se afirma recuperación conjunta de los cinco modos en un segundo dispositivo: la regresión sincroniza sesiones focales y notas en contextos de navegador separados.

## 5. Persistencia y offline

Transversal y escenarios por módulo comprueban IndexedDB, snapshots, ayudas/borradores, doble envío, recarga, cierre/reapertura, feedback e historiales offline. La regresión autenticada local pasa sin omisiones de configuración. Offline requiere visita previa y recursos cacheados. No se simulan expulsión del almacenamiento, daño del dispositivo, cuotas agotadas ni pérdida física; no son pruebas Cloudflare nativas/remotas.

## 6. Auditoría editorial y bundles

Se conservan los resultados válidos de esta fase: [coverage](integration-validation/coverage.log), [editorial](integration-validation/editorial.log), [Reading](integration-validation/reading.log) y [Writing](integration-validation/writing.log). Hashes, recibos, referencias y dependencias ya comprobados; sus fuentes, scripts y paquetes no han cambiado. No se repite revisión editorial costosa ni se emiten recibos nuevos. [Conservación frente a Writing](integration-validation/editorial-preservation.json) y manifiestos SHA256 vinculan la evidencia al código.

- 99 conceptos/Theory, 923 actividades previas, 316 entradas y 2 templates reviewed; 99 recibos efectivos del currículo (incluidos reemplazos Mixed).
- Reading: 26 textos/84 preguntas, 26 reviewed efectivos; autoría candidate.
- Writing: 270 reutilizadas y 19 nuevas reviewed efectivas; autoría nueva candidate, 18 abiertas.
- **Cero published.** Los estados derivados requieren recibos vigentes. No promoción ni publicación.

El build normal mantiene catálogo/listado/inicio directo no autorizado excluidos en Focus, Review, Mixed, Reading y Writing: [E2E restrictivo 1/1](integration-validation/production.json). `dist` final es normal/restrictivo. **El contenido sigue físicamente en JavaScript**: currículo/Theory/actividades/vocabulario importados estáticamente, textos/preguntas Reading y Writing. Muestras verificadas en bundle normal: `it-a1-c04-01`, `Chi è Chiara?`, `Un nuovo gruppo`. Exclusión de acceso no significa eliminación del texto del bundle.

## 7. Resultados técnicos

| Comprobación | Resultado |
|---|---|
| Unitarias/integración del checkpoint | 381/381, 22 suites; [log](integration-validation/unit.log) |
| Regresión unitaria reanudada | 380/381; un timeout de Mixed a 20 s durante ejecución concurrente con navegador; [log íntegro](integration-validation/unit-resume-initial.log) |
| Repetición aislada afectada | 12/12 Mixed en 8,99 s, sin cambios ni aumento de timeout; [log](integration-validation/unit-mixed-repeat.log). Los 381 casos únicos quedan satisfechos entre ejecución y repetición |
| E2E global | **60 correctos, 1 omitido intencional de producción**, 0 inesperados/flaky, 590,93 s |
| E2E producción separado | **1/1**, 16,8 s. **61 E2E únicos satisfechos**, sin contar transversal focal como caso nuevo |
| Typecheck y formato | Correctos; [tipos](integration-validation/typecheck.log), [formato](integration-validation/format.log) |
| Builds validación/normal | Correctos, ambos incluyen typecheck; [validación](integration-validation/build-validation-resume.log), [normal](integration-validation/build-production.log) |
| Auditorías/recibos/hashes | Correctos y conservados sin cambio de dependencias, Reading/Writing `errors=[]` |

Entorno: Node 22.23.3, Chrome de escritorio, `PLAYWRIGHT_CHANNEL=chrome`, `E2E_NODE_FALLBACK=1`; autenticación de prueba `E2E_ACCESS_CODE=local-test-only`, no credencial real. [Manifiesto validación](integration-validation/validation-manifest.json) y [producción](integration-validation/production-manifest.json): fuentes, helper y dist. Avisos conocidos: SQLite experimental y chunk >500 kB. No ocultar el timeout ni presentar la ejecución reanudada como 381/381 en una sola pasada.

## 8. Rendimiento, móvil y accesibilidad esencial

[Medición reproducible](integration-validation/browser-check.mjs) y [resultados](integration-validation/browser-check.json), cuatro contextos nuevos a 320/375/390/768:

- Arranque local hasta h1: **1,03–1,44 s**; navegación hasta vista: **102–479 ms**.
- Heap JS al terminar navegación: **12,3–14,2 MB**. Instantánea CDP; no auditoría de fugas ni ensayo con años de historial.
- Sin errores de página ni desbordamiento horizontal en Home; landmarks main/nav y enlace de salto presentes. La regresión comprueba además controles, foco, teclado y módulos en esos anchos.
- JS normal: **1.075,19 kB minificado / 217,76 kB gzip**; CSS 8,24 / 2,82 kB. Advertencia preexistente; no optimización anticipada.

R2 inspeccionó capturas de Home, entrada, feedback con altura reducida y progreso a 320 px, conservadas en `integration-validation/`. Texto/foco/navegación legibles. Las capturas de progreso global de página completa resultan extremadamente largas; no se usan como prueba visual legible. Las cifras son muestras locales sin red lenta ni CPU móvil simulada, no percentiles ni garantías. Sin validación en móviles físicos, teclados nativos, Safari o tecnologías asistivas reales; no auditoría WCAG completa.

## 9. Hallazgos y correcciones

**Sin P0/P1 conocidos tras la regresión.** No correcciones de producción necesarias.

- **P2 confirmado en revisión de código:** `src/ui/pages/progress.ts` filtra Attività recente por Concepts; Reading (`reading:*`) y Writing abierto (`writing:*`) no aparecen en esa cronología. Un perfil solo de esos modos puede ver «Todavía no hay respuestas». Sus historiales específicos y datos se conservan. Diferido para versión posterior, sin ampliar la fase.
- Riesgo preexistente de bundle grande y banco finito; sin problema bloqueante demostrado. No se abre un refactor.
- Fallos de construcción del test preservados: aviso de teoría solo disponible al reintentar; aviso de guardado ausente al iniciar Focus; helper sin matching. En reanudación, un intento interpretó ordering como JSON y falló con `noi siamo`; corregido a selección textual de botones habilitados. Se conservan timeouts y comportamiento de producción.
- Timeout unitario bajo ejecución concurrente: causa de recursos plausible, no demostrada; repetición aislada correcta y antecedente completo 381/381. No se atribuye silenciosamente a la aplicación ni se oculta.

## 10. Dictamen QA

Ver [dictamen independiente](integration-validation/qa-final.md). QA inspecciona código, resultados y huellas; las ejecuciones se atribuyen a R2, no se presentan como una segunda batería independiente. El dictamen no certifica pedagogía ni validación humana.

## 11. Preparación para validación humana

Preparada técnicamente dentro del alcance local probado, con dictamen favorable de QA. Para revisar contenido no publicado, usar desarrollo o un build local con `VITE_ENABLE_CANDIDATE_CONTENT=true`; el build normal final lo excluye intencionalmente. La persona revisora debe validar comprensión del flujo, ayudas/abstención y muestras lingüísticas; no se afirma que esa validación ya haya ocurrido.

## 12. Recomendaciones y límites de lanzamiento

Antes de cualquier lanzamiento: validación humana cualificada, dispositivos/teclados reales, tecnologías asistivas y decisiones editoriales explícitas. Conservar separación entre revisión y publicación, backup y límites de almacenamiento. Actualizar README antes de eventual merge autorizado. No se recomienda publicar automáticamente contenido reviewed ni se afirma eficacia, retención, autonomía libre o certificación A1. Cloudflare sigue sin desplegar ni validar remotamente.

La fase termina con el informe, dictamen y commits locales; no iniciar fase 8, hacer push/merge ni desplegar.
