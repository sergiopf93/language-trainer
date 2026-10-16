# A1 Mixed Practice — implementación de fase 6B

Fecha: 2026-10-16. Rama `feat/a1-mixed-practice`, baseline `571d382` (cierre documental de 6A). Implementación local; pendiente validación humana. **Mixed está operativo para tres grupos, ocho conceptos y 29 actividades reutilizadas; no se acredita cobertura mixta de los 99 conceptos ni V1 completa.**

## 1. Arquitectura reutilizada

Leídos AGENTS, contexto operativo, informe 6A, Learning Model §§3–6, Exercise Taxonomy §§1–4 y Mastery/Review/Error Model §§1–4. Inspeccionados contratos, catálogo editorial, selección, evaluación, evidencias, persistencia, UI y pruebas reales. Asesoría acotada de arquitectura/pedagogía y QA; R2 integra los cambios.

`src/mixed/manifest.ts` contiene la elegibilidad explícita por ID/versión y grupos; `src/mixed/engine.ts` calcula planes desde `reviewPlans` y los mismos hechos. `SessionEngine.startMixed` congela la selección y utiliza el motor canónico, revisiones de sesión, outbox, feedback y reanudación existentes. No hay dependencias, infraestructura, IA runtime ni segundo modelo de dominio.

La raíz admite `focus | review | mixed`. Mixed exige `mixed-v1`, grupo, conceptos y motivos iniciales; cada actividad conserva su propio concepto/versión. Los campos históricos `conceptId/conceptVersion` de la raíz corresponden al primer ítem como ancla de compatibilidad, **no representan todos los objetivos de la sesión**. Validadores exigen correspondencia de lista/actividades, versiones consistentes y estado editorial uniforme. Focus/Review mantienen su contrato de un concepto. No se reescribe Review.

## 2. Selección de conceptos

Un concepto cuenta como introducido mediante TheoryExposure o intento de su versión vigente, con pack y estado editorial permitidos. Abrir una sesión sin responder no basta. Se exige introducción de todos los conceptos del grupo y de todos sus prerrequisitos transitivos, incluidos los recomendados. Es una restricción conservadora de Mixed, no un umbral de dominio ni un bloqueo añadido a Theory/Focus.

Se reutilizan las categorías explicables de `review-v1`: recurrencia, recuperación independiente fallida, otros errores, falta de observaciones, invitación diferida y mantenimiento. El orden de grupos usa la prioridad más alta de sus conceptos; en empate, primero el grupo menos recientemente iniciado y luego ID. Dentro del grupo se conservan también conceptos recientes o con evidencia favorable: no se exige que todos sean débiles. No hay porcentajes de mezcla ni pesos de dominio.

Los motivos individuales y el motivo general quedan congelados al inicio. La UI muestra la regla de selección antes de empezar y los motivos por concepto al terminar, evitando anticipar la estructura del ítem. Las razones describen el historial **al seleccionar**, no un diagnóstico del resultado. Se conserva la trazabilidad original de los hechos; no se duplica todo el ReviewPlan en la raíz.

Limitación: se requiere el grupo completo, aunque algunos pares podrían ser válidos. Una dificultad persistente puede mantener un grupo prioritario; no hay política calibrada contra la concentración prolongada en ese grupo.

## 3. Elegibilidad de actividades

Whitelist de uso, no promoción editorial. Se comprueban ID, versión, concepto disponible, estado, contexto y dimensión; una salvaguarda adicional excluye algunas consignas focales explícitas. **La expresión regular no decide por sí sola la aptitud pedagógica**: la decisión es la lista inspeccionada. Una versión nueva queda fuera hasta reevaluarla.

| Grupo | Conceptos | Actividades (sufijo tras `it-a1-cXX-YY-`; versión 1 salvo indicación) |
| --- | --- | --- |
| Intenciones cotidianas | C02-01 | hotel-mattina, notte, ciao-contesto |
| | C02-02 | grazie, dialogo |
| | C02-03 | intenzione@2, velocita |
| Estados/necesidades | C04-05 | stanco, contenta, pronto |
| | C05-04 | fame, sete, freddo, paura, contrasto |
| Relaciones/lugares | C20-01 | origine@2, provenienza, materia, camera, traduci@2 |
| | C20-02 | citta, paese, superficie, tra |
| | C20-03 | meta, italia, anna, treno, direzione@2 |

Intenciones combina elección de saludo, cortesía y reparación: principalmente reconocimiento/discriminación funcional, no producción libre. Estados/necesidades contrasta essere + estado con avere + sensación sin anunciar el verbo. Relaciones/lugares exige elegir preposiciones según significado; especificar origen/destino constituye contexto legítimo, no suministro de la forma italiana.

Se conservan consignas, opciones, variantes, criterios y dimensiones. No se convierten conjugaciones focales, transformaciones mecánicas ni consignas «Completa con essere» en discriminación por cambiarles el modo.

## 4. Experiencia de sesión

Practicar → Pratica mista → explicación y tamaño de muestra → iniciar. Estado vacío orienta a Biblioteca cuando falta preparación o no hay grupo habilitado. Sesiones de hasta seis actividades, con al menos dos oportunidades por concepto. Este tamaño es una decisión de producto, no una dosis validada.

Primero se eligen actividades no respondidas y después las menos recientemente respondidas, respetando la representación de cada concepto. El desempate y la secuencia usan un orden determinista dependiente del número de sesiones del grupo. No se repiten IDs dentro de sesión ni se impone una alternancia fija que revele la respuesta. El snapshot preserva exactamente el orden al reanudar. Con un banco finito reaparecen ítems conocidos; se informa cuántos todavía no han sido respondidos. La novedad por ID/versión no prueba novedad semántica.

Encabezado genérico «Pratica mista», sin nombre de concepto ni ficha oculta en DOM antes de pedir ayuda. La consigna comunica la situación. Pistas y teoría son voluntarias y registradas. Feedback, reintento, siguiente actividad, pausa, recuperación y finalización parcial reutilizan el flujo existente. El resumen presenta conceptos, motivos iniciales y evidencias por dimensión, con acceso al progreso común. Historial identifica las sesiones mixtas sin revelar un objetivo ancla.

Mobile-first, controles existentes, sin puntos, rachas ni cronómetro. No se rediseña la interfaz.

## 5. Integración con Review

Mixed escribe los mismos Attempt/Evaluation/Evidence. Review reconoce la actividad realmente respondida de cada intento, en vez de atribuir toda la sesión al ancla. Esto actualiza última práctica, novedades, dificultades e invitación posterior para cada concepto observado. No se introducen nuevos estados de dominio ni un scheduler paralelo.

Progreso filtra su historial por el objetivo de la actividad, incluso dentro de una sesión mixta. Las proyecciones siguen agregando dimensiones; el origen mixto se recupera por `sessionId → mode/mixed`. Un agregado de discriminación no se etiqueta como «dominio mixto». Los errores históricos no desaparecen después de un éxito.

## 6. Evidencias y evaluación

| Resultado | Tratamiento |
| --- | --- |
| Correcta / variante aceptada | Evidencia del único objetivo y dimensión editorial del ítem |
| Error lingüístico verificable | Evidencia negativa trazable; puede informar Review |
| Near-miss previsto como typo | Categoría separada, sin acierto ni dificultad lingüística automática |
| Respuesta vacía | Intento/evaluación `no-opportunity`; ninguna evidencia negativa |
| Variante fuera del criterio abierto | `not-evaluable`; no se declara incorrecta |
| Frase lingüísticamente válida que evita el objetivo | No obtiene acierto por mera corrección global; si no está cubierta, abstención |

No se modifica `canonical-match-v2`. Los criterios abiertos conservan listas no exhaustivas; no se añade evaluación lingüística general. Las selecciones cerradas solo se evalúan dentro de sus opciones. No se diagnostica una causa mental del error.

Se mantienen habilidad y dimensión separadas: reconocimiento, recuperación, discriminación y uso contextual. La mezcla no cambia `dimension` ni crea evidencias para los conceptos de apoyo. Opciones visibles siguen registradas como scaffolding; «sin ayuda» no significa respuesta producida sin opciones.

Ayudas, reintentos y correcciones conocidas impiden independencia según la política común. La consulta de teoría conserva `theoryVersion` durante el resto de sesión, también al cambiar de concepto: es una política conservadora de asistencia de sesión, **no prueba de lectura de todas las fichas posteriores**.

Fechas reales, versiones, actividad, criterio, evaluador, procedencia y referencias permiten distinguir oportunidades posteriores. La invitación de 24 h procede de Review, no demuestra retención. No se crea evidencia `retention` por dejar pasar tiempo o cambiar el modo. Repetir una actividad cuya corrección ya se vio permanece asistido incluso días después.

## 7. Persistencia

IndexedDB existente, sin tablas ni migración. Raíz y revisiones append-only; envío de intento/evaluación/evidencia/estado en una transacción con outbox. Se mantienen control de head, protección de doble envío, importación idempotente y snapshots históricos.

Los contratos compartidos de cliente y Worker conocen `mixed-v1`; servicios antiguos necesitarían actualizarse antes de recibir estas sesiones. No se despliega. Offline requiere recursos cacheados previamente. No se afirma resistencia a expulsión de almacenamiento, cuota agotada o apagado durante una escritura.

## 8. Pruebas y revisión

Regresión unitaria/integración: las 18 suites previas pasaron (291 casos). La primera ejecución global añadió nueve casos Mixed y detectó una suposición incorrecta del test: algunas selecciones no tienen `rejected` explícito. Se corrigió el test para usar opciones incorrectas y se añadieron dos comprobaciones de objetivo/exposición; la suite final Mixed pasó **11/11**, con typecheck posterior correcto. **302 casos únicos verificados entre regresión y ejecución focal final.** No se cambió el evaluador para satisfacer el test. Suites nuevas: `tests/mixed.test.ts` y `tests/e2e/mixed.spec.ts`. Incluyen selección/elegibilidad real, prerrequisitos, orden estable, grupos completos, rotación, evaluación, atribución a cada objetivo, integración con Review, contratos/enlaces, transacciones, duplicados, respaldo, reanudación, ausencia de título anticipatorio y ayuda solicitada.

Regresión E2E general: **40/40 casos de validación correctos y una omisión intencional** (producción se ejecuta aparte). Tras el ajuste visual final y el refuerzo del historial filtrado por concepto, **6/6 E2E Mixed repetidos correctamente**. E2E en 320/375/390/768 px, sesión completa, pausa/cierre/reapertura offline, feedback tras recarga y finalización parcial. **Producción: 1/1 E2E correcto**, incluida ausencia de inicio Mixed con contenido no publicado; **41 E2E únicos verificados**. Typecheck, formato global, build de validación, build normal final, coverage curricular y auditoría editorial correctos. El build local final es normal; para validación humana usar desarrollo o reconstruir con `VITE_ENABLE_CANDIDATE_CONTENT=true`. La prueba de near-miss reutiliza el fixture canónico con `typos` explícitos: no se inventan erratas aceptadas para las 29 actividades. La cobertura solicitada se verifica con `content:coverage`, el informe curricular existente; no se incorpora una herramienta de cobertura instrumentada de código ni se inventa un porcentaje.

Comandos reproducibles con Node 22.23.3 en PATH:

```sh
npm test -- --maxWorkers=2
npm run typecheck
npm run format:check
npm run content:coverage
npm run content:editorial
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e
npm run build
E2E_PRODUCTION=1 PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npm run test:e2e -- --grep 'production build'
git diff --check
```

Inspección visual de captura a 320 px: controles legibles y sin desbordamiento; se retiró la explicación larga repetida de cada actividad, manteniéndola al inicio y en resumen. Chrome de escritorio con servidor Worker/SQLite de pruebas; no se valida aquí Safari/iOS, teclados nativos, lectores de pantalla, runtime Cloudflare remoto ni aprendizaje longitudinal. Build conserva el aviso previo de chunk >500 kB, sin optimización de bundle.

## 9. Limitaciones pedagógicas

No se acredita eficacia de la mezcla, transferencia general, dominio estable ni retención longitudinal. Leer Theory introduce un concepto, pero no demuestra preparación suficiente; se requiere validación con alumnos. Léxico incidental conocido se infiere del recorrido editorial y no de un modelo individual de vocabulario. El motor se abstiene ante variantes no previstas. El grupo de intenciones aporta principalmente selección/reconocimiento.

La muestra no garantiza todas las dimensiones en cada sesión, ni el contraste editorial `contrasto` en todas las sesiones de estados. No se ha reservado un banco independiente para evidencia diferida: Focus puede consumir las mismas actividades. Selección por ID/versión no detecta equivalencia semántica entre ítems.

## 10. Brechas de contenido

- **Cobertura:** 8/99 conceptos tienen elegibilidad mixta en este incremento; los otros 91 no se consideran automáticamente aptos ni carentes de conocimiento. Sus actividades requieren inspección/selección explícita antes de ampliar el manifest.
- **Origen/ubicación C04-03/C04-04:** `origine` y `ora` ofrecen contraste; faltan alternativas suficientes sin suministrar `essere di`, `in hotel` o `a Roma` para una muestra equilibrada de dos oportunidades por concepto.
- **Existencia/localización C19-02:** `distingui@2` ofrece contraste; `libro`, `chiavi`, `cambia`, `traduci` anuncian essere, y `annuncio` anuncia la construcción de existencia. Falta una pareja variada de tareas situadas sin esa pista.
- **Estados:** `stanca`, `pronte`, `sonno`, `caldo`, `loro` nombran el verbo; `bene` incorpora una tercera expresión y no se usa en este grupo.
- **Preposiciones:** `C20-02-casa@4` da una pista metalingüística demasiado específica para el contraste elegido.
- **Reservas:** faltan conjuntos equivalentes nuevos reservados para comprobación diferida y producción situada más variada.

No se crea contenido adicional: el banco reutilizable basta para los tres grupos implementados. Una ampliación editorial debe pasar `candidate → reviewed → published`; la nueva aptitud para Mixed no constituye una revisión lingüística independiente.

## 11. Estado editorial

Sin cambios en `src/content`, los 99 conceptos, Theory, consignas, criterios, canon, vocabulario, relaciones ni recibos. Se conservan **99 conceptos reviewed, 99 Theory reviewed, 865 actividades reviewed, 316 entradas reviewed, 2 templates reviewed, 210 relaciones y 99 recibos**; **0 published**. No promociones automáticas ni publicación. Producción mantiene el filtro existente; desarrollo/build de validación habilita contenido reviewed.

## 12. Commits y estado Git

Rama `feat/a1-mixed-practice`, creada desde `571d382` para conservar la implementación 6A y las fases previas necesarias que todavía no están en main. No se modifica main ni se descarta trabajo del usuario. Commit técnico: `1147824` (`feat(mixed): add explainable A1 mixed practice sessions`). Informe y contexto se guardan en un commit documental posterior, cuyo hash se comunica en la entrega. Diff, archivos nuevos e imports revisados; `git diff --check` correcto. Sin cambios de contenido editorial, dependencias ni archivos ajenos a 6B. El estado final previsto es limpio tras el commit documental y se comprueba en la entrega. Sin merge, push, publicación ni despliegue. README queda para la actualización previa a un eventual merge autorizado, después de validar.

## 13. Recomendación para Reading/Writing

Primero validar manualmente estas sesiones y sus límites. Un encargo posterior de Reading/Writing debería reutilizar los mismos hechos y oportunidades por concepto, separar comprensión de producción y evitar otorgar evidencia a estructuras eludidas. Mantener abstención honesta en escritura abierta y preparar contenido nuevo como candidate con revisión editorial explícita. No asumir que seis tareas breves sustituyen lectura o composición extensas.

**Detenerse al entregar 6B. No iniciar Reading/Writing, publicación, merge, push ni despliegue.**
