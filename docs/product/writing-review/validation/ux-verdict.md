# Dictamen UX/UI de Writing

Fecha: 2026-10-26. Revisor: agente asesor UX/UI, inspección independiente de R2 de los artefactos facilitados. Skill aplicada: `/Users/sergiopardo/.codex/skills/ux-ui/SKILL.md`. Sin modificación de código de producción.

## Alcance y evidencia

Inspeccionadas mediante `view_image` las 16 capturas `editor`, `rubric`, `feedback` y `long-resumed` en anchos 320, 375, 390 y 768, y leído `visual-browser.json` en esta carpeta. No se reutiliza el dictamen visual de R2 como sustituto de esta inspección. La independencia de esta revisión se refiere a UX/UI; este mismo agente participó previamente en autoría del corpus, por lo que no constituye revisión editorial independiente del contenido lingüístico.

En 768, editor/rúbrica/feedback corresponden a zoom CSS 200%; long-resumed vuelve a zoom normal tras recarga. El campo `zoom: 2` del registro de 768 no debe interpretarse como prueba de reanudación del texto largo al 200%. Las capturas completas de rúbrica se muestran reducidas por el visor; no se toman tamaños de píxel de esa reducción como medidas de la interfaz.

## Resultado

Favorable para la validación visual técnica del alcance observado. No se identifica un bloqueante visual demostrado. Pendientes la validación humana de uso y las comprobaciones de dispositivos reales.

| Aspecto | Observación y alcance |
| --- | --- |
| Legibilidad y jerarquía | Consigna destacada, etiqueta del editor clara y bloques de ayuda/feedback diferenciados. El contenido ocupa una columna y ajusta sus líneas en los cuatro anchos, sin texto lateral cortado en los ejemplos visibles. |
| Edición multilínea | Las tres líneas de presentación se distinguen en el editor y en la respuesta mostrada tras envío. El texto largo mantiene líneas separadas dentro de un campo de altura acotada; la última línea parcialmente visible es compatible con desplazamiento interno del textarea, no evidencia de pérdida. |
| Foco | Los cuatro estados editor muestran un contorno naranja evidente en el textarea. El JSON registra `focusDuringSave: true` en los cuatro anchos. Esto no acredita por sí solo orden de tabulación o manejo mediante teclado físico. |
| Abstención | Antes del envío aparece que el texto se conserva sin nota ni corrección automática. El feedback muestra «Da verificare», explica en español la abstención y recuerda «Testo non valutato automaticamente». No se observa una calificación de acierto/error del mensaje abierto. |
| Rúbrica | Lista desplegable con dimensiones separadas y aviso de orientación sin evaluación automática. Controles de lectura, ayuda, ayuda externa y continuación diferenciados. La longitud requiere desplazamiento, especialmente a 320 y con zoom; no hay obligación visible de comprimir el texto para hacerlo caber. |
| Responsive | JSON: `horizontalOverflow: false` y `errors: []` en los cuatro anchos. Las imágenes concuerdan con ese reflujo. La navegación inferior conserva sus cuatro destinos a los anchos observados. |
| Guardado y reanudación | JSON: `preservesLines: true`, `resumed: true` y `length: 3640` en los cuatro casos. Las capturas long-resumed muestran texto multilínea recuperado. Esta revisión lee resultados ya generados; no reejecutó esos escenarios. |

## Observaciones menores y recomendaciones

1. En long-resumed aparece «Riprova con la correzione: questa risposta conta come pratica con aiuto». Para este texto abierto, «con la correzione» puede sugerir una corrección que la propia pantalla excluye. Recomiendo «Riprova dopo il feedback: questa risposta conta come pratica con aiuto» o equivalente específico del modo. No es un bloqueante visual: el aviso de ausencia de corrección permanece visible, pero conviene alinear ambas frases.
2. «Controlla» es un verbo genérico compatible con el flujo existente, aunque en Writing podría hacer esperar una nota. El aviso previo y el feedback mitigan esa expectativa. Si se ajusta el copy, considerar «Invia il testo» para mensajes abiertos sin alterar otros modos.
3. El footer fijo tapa fragmentos de rúbrica o controles en determinadas posiciones capturadas; en imágenes completas aparece como una banda dentro de la página por el modo de captura de elementos fijos. En feedback 768 al 200% el aviso continúa bajo el borde de la ventana. No se demuestra un control permanentemente inaccesible: según la evidencia E2E comunicada por R2, los controles se alcanzan y se pulsan. Esta revisión no ejecutó esos clics ni transforma el solapamiento estático en un fallo de flujo comprobado. Mantener una comprobación específica de scroll al validar en móvil real.

## Límites

Revisión de capturas y datos de navegador de una tarea representativa, no auditoría de todas las consignas del corpus ni del catálogo completo. No prueba de teclado físico, teclado virtual móvil, lectores de pantalla, dispositivos físicos, contraste medido, orden completo de foco o conformidad WCAG. Zoom CSS 200% no equivale a toda modalidad de zoom del navegador o del sistema. No se acredita evaluación lingüística, dominio, eficacia pedagógica ni retención. El dictamen no autoriza publicación, despliegue o merge.
