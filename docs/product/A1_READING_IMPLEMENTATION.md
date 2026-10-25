# Fase 6C — Reading A1: cierre técnico

Actualizado 2026-10-25. **6C cerrada técnicamente**, con dictamen QA favorable y sin bloqueos funcionales, visuales o editoriales conocidos en el alcance comprobado. Pendientes validación humana cualificada y dispositivos físicos. Rama `feat/a1-reading`; sin publicación, push, merge, despliegue ni Writing.

## 1. Corpus definitivo y alcance

**26 lecturas, 84 preguntas: 78 cerradas y seis respuestas breves delimitadas. 26 recibos válidos; 26 textos y 84 actividades efectivamente reviewed; cero publicados.** Seis textos iniciales, catorce de desarrollo y seis de consolidación. No se acredita producción libre, autonomía de alumnos, retención ni dominio de los 99 conceptos.

Las 24 lecturas/78 preguntas previamente aprobadas permanecen exactamente intactas. Se añaden únicamente R25/R26 para cerrar dos brechas esenciales documentadas, sin reconstruir Reading ni repetir su revisión editorial histórica. El cierre se refiere al alcance técnico y funcional Reading definido en la matriz; no certifica cada microfaceta A1 ni la V1 completa de la aplicación.

## 2. Integración conservada

SessionEngine, evaluación determinista, hechos versionados, IndexedDB y recuperación existentes. F5/reading, dimensión y habilidad `reading-comprehension`, namespace `reading:<id>`, snapshots de título/cuerpo/ayuda/glosario. Home/Pratica→Reading, preparación curricular transitiva, texto disponible durante preguntas, ayudas persistentes, feedback, resumen y progreso lector separado.

Sin cambios de motores, estilos, navegación, persistencia, dependencias ni migraciones en este cierre. Un error de comprensión no penaliza Review/Mixed gramatical. Respuesta fuera de contrato: `not-evaluable`; vacía: `no-opportunity`. Ayuda, soluciones vistas y reintentos afectan a la independencia. No IA runtime ni evaluación por similitud.

## 3. Estado editorial y trazabilidad

La autoría conserva `candidate`. `reviewedReadings` deriva `reviewed` únicamente con recibo vigente y fingerprint coincidente; esto no publica contenidos.

- Histórico preservado: [revisión inicial](reading-review/initial-review.md), [paquete ciego](reading-review/candidate-packet.json), [dictamen independiente](reading-review/independent-verdict.json), [correcciones](reading-review/closure-changes.json), [paquete final](reading-review/final-packet.json) y [seguimiento independiente](reading-review/independent-followup.json). 24 aprobados; diez textos/34 preguntas recibieron seguimiento en la fase anterior. No se repite esa revisión.
- Suplemento: [revisión inicial R2](reading-review/supplement-initial-review.md), [candidato](reading-review/supplement-candidate.json), [dictamen inicial independiente](reading-review/supplement-independent-initial.json), [final](reading-review/supplement-final.json) y [aprobación independiente final](reading-review/supplement-verdict.json).
- R25 aprobado inicialmente. R26 tenía una referencia curricular incorrecta: C20-02 (ubicación) se sustituyó por C20-03 (dirección/destino) en las dos listas de conceptos. Seguimiento independiente confirma que todo lo demás permanece exacto. 2/2 aprobados, sin flags bloqueantes; recibos emitidos después.
- SHA256 candidato suplemento: `17bc43af9292dec4ce13eb0fc8b5395ae74e6b90e537031abe04b86c762ce60d`. Final: `fb9ffde9e556b1f6d8d09516cbd92e065660c784ff8697edec99848aa2885d13`.
- `content:reading` verifica corpus, referencias, dependencias/ciclos, criterios, actividades, inventario, recibos, fingerprints y hashes de paquetes históricos y suplementarios. Resultado final: `texts=26`, `questions=84`, `reviewed=26`, `published=0`, `errors=[]`.

Revisión independiente realizada por otro agente, no por una persona. Opcionales sin bloqueo conservados: R02 «signor Gino», destinatarios R10, glosa tonno ya disponible en ayuda R25 y paralelismo de un distractor R26. No se alteraron versiones aprobadas por preferencias estilísticas.

## 4. Brechas curriculares resueltas

[Matriz funcional actualizada](reading-review/coverage.md).

| Brecha | Función faltante y contenido existente | Ampliación mínima suficiente |
|---|---|---|
| K05 restaurante | R06 cubría bar; R16/R20 comida doméstica. Faltaba comprender ingredientes/restricciones, respuesta del camarero y pedido final. | R25: carta + intercambio, tres preguntas de intención, relación y pedido. C18-01/C34-03. |
| K09 horarios/billetes | R12 cubría trayecto urbano y R22 viaje pasado. Faltaba relacionar billete con destino, salida y vía del horario. | R26: billete + dos filas de horario, tres preguntas; distingue origen/destino y salida/llegada. C20-03/C22-02/C34-06. |

Se añaden dos documentos porque las lecturas existentes no cubrían esas funciones; modificarlas habría alterado sus funciones/versiones aprobadas. Sin ampliación por cantidad ni nuevo sistema. No quedan abiertas estas dos brechas esenciales. Presencia funcional en C01–C34 no significa evaluación exhaustiva de sus microconceptos.

Excepción justificada: no hay reservas paralelas para comprobaciones diferidas independientes. Repetir una pregunta cuya solución ya se vio no demuestra retención; el motor conserva la exposición. Su creación no es necesaria para las funciones receptivas cerradas aquí ni está incluida en esta intervención.

## 5. E2E recuperados y resultado final de QA

La evidencia antigua era `.last-run.json=passed` y capturas, sin informe por caso ni hash del build. **No acredita un total E2E ni una certificación global.** Se recuperó el alcance leyendo los seis escenarios originales y se ejecutó el conjunto Reading focal con trazabilidad nueva.

| Ejecución conservada | Resultado |
|---|---|
| [Reading inicial](reading-review/closure/e2e-reading-initial.json) | 7 correctos / 2 fallidos; 0 omitidos, 0 flaky, errores globales vacíos; 145,16 s |
| [Repetición R25/R26](reading-review/closure/e2e-supplement.json) | 2/2 correctos, sin omisiones/flaky/errores globales; 34,86 s |
| [Exclusión de producción](reading-review/closure/e2e-production.json) | 1/1 correcto, sin omisiones/flaky/errores globales; 12,42 s |

Los dos fallos iniciales pertenecían al test nuevo: comparaba una cadena con saltos de línea con `textContent` concatenado de varios párrafos. El DOM contenía todos los párrafos. Se corrigió la aserción para verificar cada `p` contra `body.split('\n')`, se reforzaron sesiones/hechos y se repitieron únicamente esos dos casos. No se cambió producción para hacerlos pasar. Fallos originales conservados en el informe.

**Nueve escenarios únicos Reading satisfechos**, más uno de producción; no nueve correctos en una única ejecución ni suite E2E global repetida. Cobertura final:

- Cuatro anchos 320/375/390/768: texto, ayuda, feedback, resumen, progreso separado, hechos válidos y ausencia de duplicados; 768 con zoom CSS al 200%.
- Cierre/reapertura offline: borrador y ayuda recuperados, doble envío con un intento, feedback restaurado y resumen.
- Teclado/foco/roles/lang: error, reintento asistido, abstención y evidencia independiente/asistida.
- Texto más largo a 320: glosario, respuesta fuera de criterio neutral, sin evidencia indebida y sin overflow.
- R25/R26: cuerpo por párrafos, todas las claves, resumen, sesión/versión exactas, hechos/enlaces válidos y evidencia de comprensión independiente.

[Dictamen final del subagente QA](reading-review/closure/qa-verdict.md): **favorable al cierre técnico 6C**, sin bloqueantes conocidos. QA verificó informes y capturas; distingue la regresión ejecutada por R2 de sus comprobaciones propias.

## 6. Inspección visual y accesibilidad básica

Chrome de escritorio con viewports de **320, 375, 390 y 768 × 844 px**; no dispositivos físicos. R2 inspeccionó con `view_image` las 19 capturas preservadas en [closure](reading-review/closure/): feedback/ayuda R01 a cuatro anchos (768 zoom CSS 200%), respuesta neutral larga 320, R25/R26 a 375, y R24 largo/preguntas/reanudación en los cuatro anchos.

**Visual:** texto y glosas legibles, preguntas/opciones ajustadas, feedback distinguible por texto/icono además del color, navegación identificable; sin recortes horizontales ni defectos bloqueantes conocidos. El texto largo requiere desplazamiento vertical normal. No se rediseña ni se cambia CSS.

**Automatizado:** [visual-browser.json](reading-review/closure/visual-browser.json) registra scrollWidth igual a viewport en todos los anchos, borrador reanudado, ayuda y feedback visibles, hit-test del botón Continua y click efectivos, sin `pageerror`. [Script reproducible](reading-review/closure/visual-check.mjs), ejecutado desde la raíz contra el servidor local y build de validación. E2E añade teclado, foco en feedback, `role=status` y `lang=it`.

La barra fija se superpone a fragmentos en las capturas de página completa. Se investigó con desplazamiento, capturas de viewport `visual-resumed-*`, hit-test y click: controles operativos y visibles; no se confirma bloqueo. La prueba no sustituye una auditoría WCAG, lectores de pantalla, zoom del navegador/SO ni teclados móviles reales.

## 7. Exclusión de producción

Build final normal con `VITE_ENABLE_CANDIDATE_CONTENT=false`; build de validación separado con `true`. [Catálogo comprobado](reading-review/closure/production-catalog.json): 26 candidates en autoría, 26 reviewed efectivos/recibos, cero published; **catálogo Reading accesible de producción vacío**, catálogo de validación con 26.

`catalog.allowed` exige `published` salvo validación explícita; lista Reading, acceso directo, inicio y recuperación de sesión respetan ese filtro. El E2E final verifica biblioteca y modos previos excluidos, lista Reading sin enlaces habilitados y rutas directas R01/R25/R26 sin botón de inicio. No se altera el circuito editorial.

**Los textos siguen físicamente incluidos en JavaScript**, incluidos los títulos nuevos, por importación estática. La exclusión es del catálogo/acceso efectivo; no se afirma eliminación del bundle. El build local y la disponibilidad de validación no constituyen publicación ni despliegue. `dist` final conserva el build normal restrictivo. Sin dependencias nuevas ni cambios de hashes/paquetes de R01–R24; auditorías editoriales previas conservadas.

## 8. Regresión y vinculación al código final

| Comprobación ejecutada tras contenido/recibos finales | Resultado |
|---|---|
| `npm test -- --maxWorkers=2` | **360/360, 21 suites**, 87,58 s |
| Typecheck | Correcto en builds; repetido tras corregir tests E2E |
| Formato global | Correcto; formato focal E2E repetido tras su corrección |
| Build validación y normal final | Correctos, fuentes finales y recibos reales |
| `content:coverage` | 99/99 conceptos presentes, 0 listos para producción; no prueba dominio |
| `content:editorial` | 99 conceptos/Theory y 923 actividades reviewed preservados; cero published |
| `content:reading` | 26/84, 26 recibos/reviewed, hashes/inventarios/dependencias correctos, errors=[] |
| Reading E2E / producción / barrido visual | Resultados desglosados arriba |
| Diff y Git | Cambios acotados revisados; sin paquetes/dependencias ni archivos de motores modificados |

[Manifiesto inicial](reading-review/closure/validation-manifest.json), [repetición](reading-review/closure/supplement-validation-manifest.json) y [producción](reading-review/closure/production-manifest.json) conservan comandos y SHA256 de fuentes y builds. La repetición solo cambia tests; las fuentes de aplicación y el build de validación son los mismos. Los hashes finales se compararon sin diferencias antes de los commits. No se modificó código después de estas pruebas.

Incidencia de entorno explícita: el primer intento de build usó el Node antiguo del shell y falló al cargar TypeScript; se corrigió el PATH a Node 22.23.3 y los builds finales pasaron. Avisos conocidos conservados: SQLite experimental del servidor de pruebas y bundle >500 kB (≈1.040 kB minificado); sin optimización solicitada.

## 9. Límites y validación pendiente

Pendientes validación humana cualificada, uso con adultos A1, dispositivos/teclados físicos, tecnologías asistivas reales y observación longitudinal. Pruebas con servidor Node de pruebas (`E2E_NODE_FALLBACK=1`), no runtime Cloudflare nativo/remoto. No se acredita eficacia pedagógica, autonomía, producción libre ni retención. La marca E2E histórica no se usa para certificar regresiones ajenas al alcance focal actual.

## 10. Git y entrega

Rama `feat/a1-reading`, baseline original `f439d74`. Históricos conservados `737f002` y `b25240c`. Commit local técnico de cierre **`42f35b9`**: suplemento revisado, recibos, auditoría y pruebas focales. Este informe/contexto y evidencias se guardan en un commit documental posterior identificable en `git log`; el hash se entrega al usuario tras crearlo. Árbol limpio comprobado al entregar.

**Detenerse tras este dictamen.** No iniciar Writing ni más desarrollo, publicar, push, merge o desplegar. La validación humana permanece explícitamente pendiente y cualquier siguiente fase necesita nuevo encargo.
