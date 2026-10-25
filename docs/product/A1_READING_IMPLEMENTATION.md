# Fase 6C — Reading A1: cierre editorial y punto de reanudación

Actualizado 2026-10-25. Rama `feat/a1-reading`, baseline `f439d74`. **No declarar Reading integralmente cerrado.** Revisión editorial completada; integración implementada y suite unitaria/de integración correcta. Interrupción por límite de uso del agente QA al final de la fase E2E. Sin push, merge, publicación, despliegue ni Writing.

## 1. Estado técnico

Se reutiliza SessionEngine, evaluación determinista, hechos versionados, proyección de evidencias, IndexedDB y recuperación. Modo reading/F5, dimensión y habilidad reading-comprehension, namespace reading:<id>, snapshots de cuerpo/título/ayuda con glosario. Navegación Home/Pratica→Reading, preparación curricular transitiva, texto persistente durante preguntas, ayuda registrada, feedback, resumen y progreso lector separado.

No nuevas dependencias ni migraciones; package.json solo añade content:reading. Review/Mixed conservan sus motores. Un error de comprensión es verifiable-error de la lectura, no penalización gramatical. Respuesta desconocida: not-evaluable; vacía: no-opportunity. Sin IA runtime ni evaluación por similitud.

## 2. Inventario y estados

**24 lecturas, 78 preguntas: 72 cerradas y seis respuestas breves delimitadas. 24 recibos válidos, 24 textos y 78 actividades efectivamente reviewed en validación, 0 publicados.** La fuente de autoría conserva candidate; reviewedReadings deriva reviewed solo mediante recibo coincidente. Producción exige published y no habilita estos textos.

Seis textos iniciales, doce de desarrollo y seis de consolidación. Las respuestas breves piden exclusivamente cifras o nombres explícitos. Criterios no exhaustivos para abstenerse ante variantes fuera de contrato; no se evalúa producción libre.

## 3. Cobertura curricular

[Matriz y verificación funcional](reading-review/coverage.md): oportunidades receptivas en C01–C34, sin afirmar cobertura de cada microconcepto ni dominio de los 99. Revisados referentes, contrastes, causa, secuencia, decisiones, pasado y tipos de situación; no deducido del número o etiquetas.

**Brechas para cobertura integral V1:** K05 necesita carta/intercambio de restaurante y K09 billete/horario de transporte. Propuesta mínima: dos textos breves con dos o tres preguntas cada uno, reutilizando estructuras existentes. No añadidos para conservar las 24 lecturas solicitadas; pendiente decisión de alcance. La reserva para comprobaciones diferidas independientes tampoco queda cubierta por repetir preguntas conocidas.

## 4. Correcciones iniciales

[Acta inicial](reading-review/initial-review.md) y [registro campo a campo](reading-review/initial-changes.json). Metadata visible traducida a italiano; R01-Q1 realmente global; R13 elimina contradicción martes/viernes; R18 elimina ne no preparado y corrige exhaustive; R22 elimina imperfetto/doble clítico; R24 elimina indirectos no preparados. Cinco preguntas convertidas a breves, manteniendo total. Todas las lecturas pasan v1→v2 por metadata; no regeneradas.

## 5. Dictamen independiente y resolución

[Paquete ciego](reading-review/candidate-packet.json), SHA256 `ae30da8a78165e9fa680b51f2eff20f7d6d67626675e4e4296463c31ff4195a5`.

[Dictamen independiente íntegro](reading-review/independent-verdict.json): revisión de los 24 textos/78 preguntas, accepted/rejected, criterios, ayudas, feedback y posición curricular. Emitido sin conocer revisión inicial. 23 aprobados inicialmente; R24 bloqueado por C31-02 sin participios irregulares y C29-03 sin perché causal. Detecta además filtración de feedback R06 y cambio tu/voi de R20, apoyos incidentales y mejoras opcionales.

[Correcciones de cierre](reading-review/closure-changes.json): R24 referencia C31-01 y retira C29-03, conservando cuerpo válido. R06-Q1 no adelanta bebida de Q2; R05-Q1 no adelanta capacidad de Q3; R22-Q1 no adelanta días de Q4. R20 explicita Marco frente a Anna y Luca. Glosas de fórmulas anticipadas en R04/R08/R16/R18/R23. Diez textos v2→v3; 14 siguen v2.

[Paquete final](reading-review/final-packet.json), SHA256 `a36d90f045e4675d753adb6372887168f262bdcc413ec72b989adb7607f0f245`.

[Seguimiento independiente](reading-review/independent-followup.json): relectura integral de diez textos modificados/34 preguntas y conservación por fingerprint de los otros 14. **24 aprobados, ningún bloqueo editorial pendiente.** Recibos de versiones exactas emitidos después. content:reading comprueba ambos SHA, fingerprints del paquete frente al corpus, inventarios, criterios y aprobación vigente.

## 6. Incidencias no resueltas

Mejoras opcionales conservadas: R02 «signor Gino» y alternancia de destinatario colectivo/personal de R10. No sustituidas por preferencias estilísticas. Glosas resuelven apoyo inmediato, pero no acreditan autonomía de lectores A1 reales. Pendiente validación humana cualificada, dispositivos/teclados reales y observación longitudinal. No se han identificado bloqueos editoriales que obliguen a dejar lecturas fuera de reviewed.

## 7. Ayudas, evidencias y persistencia

Glosario incluido en help del snapshot, con saltos de línea visibles. No aparece antes de registrar consulta. readingHelp persiste entre preguntas y su exposición se reconoce entre sesiones del mismo texto/versión. Soluciones ya vistas y reintentos son asistidos. Resumen muestra explicación solo de preguntas con intento. Errores y aciertos lectores no cambian Review/Mixed gramatical; no acreditan retención ni producción.

## 8. Validación automatizada comprobada por R2

| Comprobación | Resultado verificable |
|---|---|
| Suite completa `npm test -- --maxWorkers=2` final | **360/360, 21 suites**, 74,25 s |
| Primera suite global | 359/360; expectativa antigua de skills en engine.test corregida para incluir reading-comprehension=0; suite final anterior confirma resolución |
| Reading | 8/8; incluidos criterio correcto/error/no evaluable/vacío, recibos, preparación, dependencias, ayudas, duplicados, IndexedDB, backup e invariancia Review/Mixed |
| Engine + Reading focal | 21/21 tras corrección de expectativa |
| Learning/Review/Mixed/Local/Sync focal | 49/49 según QA; además incluidas en suite global |
| Typecheck | Correcto, también dentro de ambos builds |
| Formato global | Correcto; recibos finales formateados después |
| Coverage curricular existente | Correcto: 99/99 presentes; no equivale a cobertura Reading integral |
| Auditoría editorial existente | Correcta: 99 Concepts, 99 Theory, 923 actividades reviewed preservadas |
| content:reading / recibos / hashes | Correcto: 24 textos, 78 preguntas, 24 reviewed, errors=[] |
| Build normal | Correcto antes de recibos finales; **repetir build normal final y exclusión con recibos reales** |
| Build validación final | Correcto con corpus y recibos finales; dist conserva este build |
| E2E producción inicial | 1/1 en Chrome; ejecutado antes de recibos finales, insuficiente como última prueba de exclusión reviewed |

Aviso conocido: bundle >500 kB (build validación ≈1.035 kB minificado); no optimizado por restricción del encargo. Primer intento E2E no arrancó porque falta Chromium de Playwright; resuelto usando Chrome instalado, sin instalar dependencias. E2E usa servidor Node local de pruebas (E2E_NODE_FALLBACK=1), no runtime Cloudflare nativo/remoto.

## 9. E2E y comprobación visual: evidencia recuperada tras interrupción

QA tenía encargado ejecutar la suite completa con `PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npx playwright test`. Después del límite se comprobó que **no quedaba proceso E2E/servidor activo**, `test-results/.last-run.json` indica `passed` y no hay failedTests. Hay capturas recientes de Reading 320/390/768, Reading largo a 320, Mixed, Review y regresiones. El agente no devolvió el resumen de consola; **no se inventa un número de casos ejecutados ni se afirma inspección visual manual**. Conservar estos artefactos locales; son evidencia automatizada, no prueba en dispositivos físicos.

Los seis E2E Reading implementados cubren: correcto/ayuda/resumen/progreso a 320/390/768 (zoom 200% a 768), cierre/reapertura offline/borrador/feedback/doble envío, teclado/foco/error/reintento/abstención y lectura más larga con respuesta no evaluable/glosario/overflow a 320. La última marca global es satisfactoria; queda recuperar informe detallado o ejecutar los seis focales si no existe informe recuperable, e inspeccionar capturas con view_image. No repetir editorial ni reconstruir corpus.

## 10. Bloqueos y límites de cierre

No faltan recibos editoriales. Faltan cierre verificable del reporte E2E, inspección visual, comprobación de producción con recibos finales y validación humana. Además las brechas K05/K09 impiden afirmar cobertura integral Reading V1. Las 24 lecturas pueden ofrecer el recorrido revisado en validación, pero no equivalen a toda la V1 ni a eficacia pedagógica demostrada.

## 11. Reanudación exacta

Proyecto `/Users/sergiopardo/Desktop/language-trainer`; esta sesión tiene cwd healt-tracker, por lo que escrituras requerían escalación. Node: `/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin` en PATH. Conservar rama y commits.

1. Recuperar informe E2E si existe. Marca local passed conservada en `reading-review/validation-status.json`; screenshots originales en test-results. Si no hay resumen detallado, ejecutar seis Reading: `PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npx playwright test tests/e2e/reading.spec.ts` sobre dist actual de validación. No repetir toda la suite sin una razón nueva.
2. Inspeccionar las capturas de Reading, especialmente texto largo a 320 y zoom; documentar hallazgos. No hay validación física de dispositivos.
3. `npm run build` sin VITE_ENABLE_CANDIDATE_CONTENT; después `PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_PRODUCTION=1 npx playwright test tests/e2e/learning.spec.ts --grep 'production build'`. Ahora existen recibos reviewed y esta prueba debe confirmar exclusión real.
4. Formato/diff final si se cambia algo; no repetir revisión editorial completa. Cualquier modificación de contenido invalida recibo y exige seguimiento del texto afectado.
5. Actualizar informe/contexto, guardar commit local y presentar validación humana y decisión mínima K05/K09. No iniciar Writing, no publicar, push, merge ni desplegar.

## 12. Commits y Git

Baseline `f439d74`. Los cambios técnicos/editoriales y la documentación de reanudación se guardan en commits locales de esta sesión; hashes registrados abajo después del commit. No se descartan cambios previos. Rama `feat/a1-reading`.

## 13. Recomendación para Writing

No iniciar Writing. Antes, cerrar las comprobaciones pendientes y decidir las dos brechas contextuales de Reading. Una fase futura puede reutilizar snapshots, ayudas, evaluación conservadora y separación de comprensión/producción, siempre con encargo explícito. Reading no prueba producción libre.
