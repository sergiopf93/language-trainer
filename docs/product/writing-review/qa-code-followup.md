# QA independiente — seguimiento de correcciones Writing

Fecha: 2026-10-25. Seguimiento de `qa-code-review.md`. Alcance: revisión de las correcciones B1/M1–M4, regresiones en `tests/writing.test.ts` y comprobaciones focales autorizadas. No se modificó producción.

## Dictamen

B1 queda resuelto en el código inspeccionado y sus regresiones negativas pasan. M1 y M2 quedan resueltos con pruebas específicas. M3 y M4 quedan atendidos por inspección estática; su apariencia e interacción requieren la validación visual/E2E que realiza R2. No quedan bloqueantes conocidos dentro de este alcance.

## Evidencia por hallazgo

- **B1, evidencia falsa abierta:** `shared/protocol.ts` enlaza evaluaciones Writing al concepto, versión, dimensión, criterio y tarea de su snapshot. Exige correspondencia entre writingOutcome y judgment. F6/open admite únicamente empty/no-opportunity para texto vacío y unassessed/not-evaluable para texto no vacío; evidence veta F6/open. Tres regresiones confirman rechazo de evaluación abierta correct forjada, evidencia abierta positiva coherente con esa evaluación y outcome incompatible con judgment. En cada importación rechazada, el almacén destino permanece vacío. La prueba de evidencia también invoca directamente validLinks para verificar su veto independientemente del rechazo de la evaluación.
- **M1, identidad de tarea:** `shared/learning.ts` exige igualdad de writing.id/version con la actividad única. Dos regresiones alteran respectivamente ID y versión; validFact e importBackup los rechazan sin guardar hechos.
- **M2, espacios y canon:** `SessionEngine.submit` utiliza normalize para la clasificación de actividades reutilizadas. Una regresión toma una actividad real reutilizada, multiplica los espacios internos y agrega espacios exteriores: la evaluación sigue siendo correct/canonical.
- **M3, historial de reparación:** el resumen ordena intentos por sequence en el mismo dispositivo y por fecha/ID entre dispositivos; distingue Primo tentativo/Revisione y ayudas. La inspección confirma que ya no depende directamente del orden de claves de IndexedDB. No se certifica orden causal universal ante relojes de dispositivos desajustados.
- **M4, párrafos:** el resumen aplica white-space pre-wrap a cada respuesta; el feedback Writing lo aplica a su contenedor. La relectura ya conservaba espacios y saltos. Confirmado en código, pendiente inspección visual.

## Comprobaciones ejecutadas

Con Node 22.23.3:

- `npm test -- tests/writing.test.ts tests/engine.test.ts --maxWorkers=2`: **34/34**, dos suites correctas (21 Writing y 13 engine).
- `npm run typecheck`: correcto.
- Prettier sobre el único archivo de tests modificado: correcto.
- `git diff --check -- tests/writing.test.ts`: sin incidencias.

No se ejecutó la suite global ni se repitieron E2E. Los recibos usados por los tests siguen siendo fixtures explícitos que se restauran tras cada prueba; no acreditan revisión editorial real. Este dictamen no sustituye recibos editoriales, pruebas visuales, pruebas en dispositivos físicos ni validación humana cualificada.

## Seguimiento acotado: eventos repetidos de pegado y título de Progreso

Inspección adicional solicitada por R2, sin ejecutar de nuevo pruebas previas ni modificar producción/tests.

- **Guardia de borrador Writing:** `src/ui/pages/learning.ts` inicializa lastQueuedValue con el borrador de la vista y compara el valor capturado en cada evento input antes de encolarlo. La comparación se aplica únicamente a Writing. Eventos consecutivos con idéntico texto no crean estados redundantes; cambios distintos siguen en la cola existente. En particular, A→B→A conserva ambos cambios posteriores, porque se compara contra el último valor encolado, no contra el último valor persistido. La captura local de value y la serialización existentes permanecen. Tras redibujar, la referencia vuelve a inicializarse desde el estado actual. No se identifica bloqueo ni pérdida de cambios distintos por esta corrección. La política existente ante un error de almacenamiento sigue requiriendo conservar la respuesta y recargar; esta guardia no constituye un mecanismo nuevo de recuperación de errores.
- **Título en Progreso:** `src/ui/pages/progress.ts` obtiene writing.title de la sesión asociada al intento antes de recurrir a la teoría/ID del concepto. Sustituye la presentación del ID sintético para Writing y conserva los fallbacks de sesiones históricas y otros modos. No cambia evidencia ni datos persistidos.
- **Nuevo E2E inspeccionado:** `tests/e2e/writing-paste.spec.ts` prepara los conceptos, abre una composición a 320 px, introduce 260 líneas, espera confirmación de guardado y comprueba un solo estado no vacío. Después dispara 20 eventos input idénticos, escribe un valor distinto y vuelve al original; exige tres estados, reabre la página y verifica texto íntegro y ausencia de scroll horizontal. La comprobación de foco cubre el guardado inicial. El contenido repetido queda dentro del límite de 4000 caracteres.

**Dictamen acotado:** correcciones coherentes con el problema descrito y test pertinente; sin nuevos bloqueantes por inspección. **Límite:** el E2E estaba pendiente de ejecución al emitir este seguimiento. fill y eventos sintéticos comprueban el contrato de la cola; no equivalen a validar todos los mecanismos de portapapeles nativos, IME o dispositivos físicos. No se certifica todavía el resultado visual ni la duración del guardado en esos entornos. Los 34/34 del apartado anterior no se atribuyen a esta modificación posterior.
