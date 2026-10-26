# A1 V1 — integración: punto de reanudación

Fecha: 2026-10-26. **Fase 7 incompleta; interrupción por límite de uso del subagente QA. No hay dictamen final ni cierre técnico.**

## Git e integración

Árbol inicial limpio en `feat/a1-writing`, HEAD `0415c6b` (implementación `f859c45`). Creada `feat/a1-v1-integration` desde ese HEAD. Ancestro común con main: `9dcb05f1af40533bbe34e237713d957193971405`. Todas las ramas locales son ancestros de Writing (`git branch --no-merged feat/a1-writing` vacío). Review `571d382`: 0 commits exclusivos/10 posteriores; Mixed cobertura `f439d74`: 0/6; Reading `1830ee1`: 0/2. No hacen falta merges adicionales. Sin push, merge a main/development ni despliegue.

## Funcionalidades y recorrido

Producción permanece idéntica a `0415c6b`. Añadido `tests/e2e/v1-integration.spec.ts`: mismo perfil, primer acceso, teoría/focal, progreso, Review, Mixed, Reading, Writing, cierre de pestaña, recuperación offline e historiales. Incluye integridad de enlaces, unicidad de evaluaciones/evidencias, atribución curricular, ayudas, abstención abierta e igualdad de hechos/proyección tras recuperación. **Todavía no pasa.**

Tres ejecuciones de desarrollo fallidas, sin cambios de aplicación: (1) esperaba «Lettura salvata», que solo se muestra al reintentar; cambiado a hecho theory-exposure persistido; (2) esperaba aviso de guardado al iniciar focal; cambiado a control visible; (3) timeout de 120 s durante focal C04-01, helper answer trata respuesta estructurada `[1,2,0]` como radio. Próximo paso: reutilizar manejo existente de respuestas estructuradas de tests/ UI; completar el helper sin alterar producción y repetir el transversal. No aumentar timeout para ocultar este error.

## Comprobaciones ejecutadas

Node 22.23.3: anteponer `/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin` a PATH; Node por defecto es 13.5.0.

- `npm test -- --maxWorkers=2`: **381/381, 22 suites**, 68,65 s.
- `npm run typecheck`: correcto después de primera versión del test; repetir tras ajustes finales.
- `npm run format:check`: correcto antes del nuevo E2E; archivo nuevo formateado en cada ajuste; repetir global final.
- `content:coverage`, `content:editorial`, `content:reading`, `content:writing`: correctos. 99 conceptos/Theory, 923 actividades, 316 entradas, 2 templates reviewed; 26 lecturas/84 preguntas; 19 nuevas Writing reviewed, 270 reutilizadas; cero publicados, Reading/Writing errors=[]; hashes/recibos verificados. No repetir revisión editorial humana/agentes ni auditoría pedagógica costosa: fuentes intactas.
- Build de validación correcto: JS 1.075,19 kB minificado / 217,76 kB gzip; CSS 8,24 / 2,82 kB. Aviso conocido >500 kB.
- Logs temporales `/tmp/language-integration-{unit,coverage,editorial,reading,writing,build-validation}.log`; copias durables en `integration-validation/`.

## Evidencias, persistencia y editorial

QA estático no encontró P0/P1: motor compartido, ayudas/reparación/exposición conservadoras; Reading separado de gramática; Writing abierto se abstiene incluso ante modelo; protocolos rechazan evidencia abierta positiva. No equivale a regresión integral ejecutada. Suite unitaria vigente pasa; offline transversal pendiente.

Autoría Reading/Writing candidate con reviewed derivado de recibos; cero published. Candidate/reviewed siguen físicamente empaquetados por imports estáticos (currículo/Theory/actividades/vocabulario, Reading y Writing). Exclusión de producción es catálogo/acceso, no eliminación física. Falta repetir build normal y E2E restrictivo en esta fase. `dist` queda temporalmente en validación, NO normal.

## Hallazgos y riesgos

- **P2, revisión de código QA**: `src/ui/pages/progress.ts` filtra Attività recente por Concepts; excluye namespaces reading:* y writing:* abiertos. Puede mostrar «Todavía no hay respuestas» con solo esos modos. Historial específico Reading/Writing y datos se conservan. Registrar para posterior, sin refactor.
- No P0/P1 confirmado; ausencia definitiva de bloqueantes pendiente de regresión.
- Falta E2E de recuperación conjunta de cinco modos en segundo dispositivo. Regresión existente prueba sincronización focal/notas y suites por modo prueban persistencia/backup. No afirmar esa cobertura conjunta.
- Dispositivos/teclados físicos, tecnologías asistivas, Cloudflare nativo/remoto y eficacia/retención no comprobados.

## QA y preparación humana

Subagente `/root/qa_integration` revisó código sin modificarlo: sin P0/P1, hallazgo P2 anterior y recomendación de comprobar exposición compartida y proyecciones tras recuperación. Su segunda revisión terminó por límite de uso. **Dictamen final pendiente; aún no declarar preparada la fase para validación humana.**

## Reanudación exacta

1. Arreglar helper del E2E para respuestas estructuradas; inspeccionar `src/ui/structured-answer.ts` y tests existentes pertinentes. Última traza/error en `test-results/v1-integration-*/` (ignorado por Git).
2. Ejecutar transversal con `PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e -- tests/e2e/v1-integration.spec.ts` sobre build de validación actual.
3. Ejecutar regresión E2E completa con las mismas variables y guardar informe por caso; la prueba de producción se ejecuta separadamente sobre build normal. Conservar resultados y hashes de fuentes/build.
4. Comprobar arranque/navegación/carga, memoria si medible, tamaños, móvil y accesibilidad esencial; inspeccionar capturas. Reutilizar cobertura previa intacta sin sobreafirmarla.
5. Build normal final y E2E `E2E_PRODUCTION=1 ... npm run test:e2e -- --grep 'production build'`.
6. Pedir dictamen final QA independiente con evidencias; completar este informe con resultados reales, actualizar contexto, revisar diff/tipos/formato, commits locales y árbol limpio.
7. Entregar y detenerse. Sin fase 8, publicación/promoción, push, merges ni despliegue. README solo antes de eventual merge autorizado.
