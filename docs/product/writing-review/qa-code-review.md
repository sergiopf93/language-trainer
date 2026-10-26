# QA independiente — revisión de código Writing

Fecha: 2026-10-25. Revisión estática del diff candidato en shared/learning.ts, shared/protocol.ts, src/exercises, src/learning/session.ts, src/ui/pages/learning.ts y de src/writing/engine.ts y src/ui/pages/writing.ts. Asesor QA/Architecture; no se modificó producción ni se repitió la suite existente. Los recibos todavía pendientes de editorial no se consideran fallo.

## Dictamen

Condicionado a resolver la frontera de validación descrita en B1. El motor ordinario conserva abstención, ayudas y reparación, pero la importación/sincronización no impone todavía las mismas restricciones semánticas. No sustituye los E2E, inspección visual o aprobación editorial pendientes.

## B1 — bloqueante: hechos abiertos admiten evidencia positiva en la frontera

**Fallo confirmado por inspección de condiciones; reproducción ejecutable pendiente.**

shared/protocol.ts, validLinks, ramas evaluation/evidence: evaluation únicamente comprueba el enlace a attempt y el ID/versión de actividad. evidence exige coherencia entre hechos y snapshot, pero no rechaza family F6 ni writing.policy open. shared/learning.ts valida writingOutcome como enum sin relación con judgment.

Reproducción propuesta: partir de una sesión F6 y su intento válidos; construir evaluación con judgment correct y writingOutcome canonical y añadir evidence correct coherente con los IDs, dimensión, trace y estado de independencia del snapshot. Ninguna condición actual rechaza el resultado porque la actividad sea abierta. Otra variante es conservar writingOutcome unassessed y cambiar judgment a correct: también satisface la forma actual. LocalStore aplica estos validadores al importar respaldo y al recibir hechos.

Esperado: tareas abiertas solo permiten no-opportunity/empty o not-evaluable/unassessed y nunca evidence. Resultado derivado del código: hechos positivos estructuralmente coherentes atraviesan la frontera. Impacto: observaciones falsas de producción abierta en la proyección, aunque la UI normal no las produzca.

Corrección mínima: validar evaluation contra el snapshot enlazado, imponer los pares outcome/judgment y la abstención abierta; vetar evidence de F6/open. Conservar compatibilidad de evaluaciones históricas que carecen de writingOutcome. Añadir casos negativos de validFact/validLinks e importación para estos hechos incoherentes.

## Otras observaciones

### M1 — metadata de raíz Writing no enlazada a actividad

**Fallo de validación confirmado por inspección.** shared/learning.ts validSessionScope comprueba que writing.id/version/title sean texto y haya una actividad, pero no writing.id === activities[0].id ni writing.version === activities[0].version. El motor los produce coincidentes; importación admite identidades contradictorias. La UI consulta la alternativa controlada mediante writing.id, por lo que puede mostrar navegación a otra tarea. Recomendado exigir igualdad de ID/versión en nuevas sesiones Writing.

### M2 — normalización desigual al clasificar actividades reutilizadas

**Fallo confirmado por inspección.** src/exercises/evaluate.ts normalize colapsa espacios internos; src/learning/session.ts, fallback writingOutcome, no lo hace. Una respuesta canónica reutilizada con dos espacios internos se acepta como correct pero queda etiquetada accepted-variant. Reutilizar normalize en ese fallback. No genera falso acierto, pero sí una subclasificación incorrecta.

### M3 — historial de reparaciones sin orden causal explícito

**Comportamiento sospechoso, no verificado visualmente.** El resumen de src/ui/pages/learning.ts recorre facts.filter(attempt) sin ordenar por sequence/fecha ni marcar original/reparación. allFacts devuelve orden de clave, no necesariamente cronológico; la suite ya evitó asumir ese orden. En Writing, varias versiones de un texto pueden presentarse desordenadas y sin distinguir cuál repara a cuál. Recomendado ordenar y mostrar relación de reparación, conservando todos los textos.

### M4 — presentación de párrafos en feedback/resumen

**Riesgo visual pendiente.** La vista de relectura aplica white-space pre-wrap; feedback y resumen insertan la respuesta en un párrafo ordinario. Pueden perder separación visual de párrafos aunque el texto almacenado esté intacto. Verificar en E2E/visual con dos párrafos y conservar saltos si no hay estilo heredado que ya lo haga.

## Comportamientos conservadores comprobados por inspección

- evaluate corta la evaluación open antes de buscar coincidencias con el modelo, incluso si el texto coincide exactamente.
- submit genera evidencia solo para juicios verificables; abstención ordinaria no genera errores ni aciertos.
- retry Writing conserva draft, attemptId y ayudas. La respuesta original permanece como hecho; los nuevos intentos enlazan retryOf y pierden independencia.
- appendLearning y expectedHead existentes siguen concentrando intento/evaluación/evidencia/estado en una transacción. La UI serializa borradores antes de enviar y deshabilita también textarea durante comandos.
- Las actividades reutilizadas mantienen IDs/versiones; las abiertas usan conceptos sintéticos writing:, evitando introducir objetivos gramaticales en Review/Mixed.
- Las nuevas opciones se filtran por recibo y allowCandidates; el catálogo de producción actual no expone las actividades reviewed. No hay indicios de publicación accidental por esta selección.
- Los textos se asignan mediante textContent/helpers de DOM, sin HTML interpretado. El foco existente tras comandos se dirige al encabezado de feedback o sesión; relectura enfoca su preview.

## Límites

No se ejecutaron nuevas pruebas en esta revisión. La suite Writing 15/15 y typecheck fueron ejecutados en la tarea anterior y no certifican cambios posteriores. No se afirma validación en navegador, accesibilidad completa, dispositivo físico o eficacia pedagógica. La lista vacía de recibos durante esta revisión es estado editorial esperado.
