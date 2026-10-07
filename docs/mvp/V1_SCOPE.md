# V1 — Italiano A1 completo según el Research Pack

Estado: alcance curricular fijado por Sergio; propuesta de diseño actualizada pendiente de aprobación final para implementar. Sustituye el corte anterior de diez objetivos. No hay implementación autorizada en esta fase.

## V1

Todo C01–C34 de [Research 02](../research/02_Italian_A1_Curriculum.md), incluidos sus detalles, ampliación final C31–C33, léxico transversal, funciones y situaciones. La [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md) enumera Topics y Concepts propuestos y sirve de checklist. Cxx es referencia curricular; no equivale a Concept.

Cada Concept evaluable debe poder aprenderse, consultarse, practicarse de forma focal, usarse en contexto, generar errores explicados, reparación, repaso, evidencia y recomendaciones; participa en mezcla cuando haya alternativas conocidas y preparación suficiente. Las modalidades se adaptan a la habilidad; no se impone producción gramatical para medir una capacidad receptiva ni se aceptan temas solo teóricos.

Incluye todos los artículos determinados e indeterminados del pack; paradigmas regulares/irregulares; modales; c'è/ci sono; preposiciones simples/articuladas; calendario y horas; posesivos/demostrativos; gustos/reflexivos; cantidades/partitivos; pronombres complemento; conectores; imperativo útil; participio y pasado próximo con concordancia dentro del alcance A1. Incluye C01/C02 como capacidades integradas, no meros apoyos invisibles.

Reading cubre progresivamente los 14 contextos de Research 02 §5 y las demandas apropiadas. Writing progresa de completar con significado a mensajes más autónomos, incluidos relatos breves en pasado; no requiere que el corrector pueda juzgar cualquier texto libre. Teoría es referencia completa del currículo, con práctica conectada.

Siete familias de actividad F1–F7, definidas en [CONTENT_STRATEGY](../product/CONTENT_STRATEGY.md), cubren la taxonomía mediante reutilización de interacciones. Focus de grupo no concede dominio a sus Concepts no observados. Mixed y Review no están codificados para una lista pequeña de verbos.

Decisión técnica de V1: PWA local-first, almacenamiento local offline, sincronización mediante Cloudflare Worker y persistencia D1. Un propietario identificado de forma sencilla, italiano objetivo/español de explicación, guardado/reanudación y recursos descargables. Backup manual secundario. Historial original persistido y proyecciones reconstruibles; reintentos idempotentes y conflictos entre dispositivos contemplados.

## POST-V1

Segundo idioma activo; otros niveles/competencias fuera del currículo del pack; conversación/reconocimiento de voz, evaluación automática de pronunciación, social, rankings, gamificación compleja, monetización. Producción sistemática de imperfetto frente a passato prossimo, futuro morfológico completo, condicional más allá de fórmulas, subjuntivo y combinaciones pronominales complejas: Research 02 §3 los difiere fuera de este recorrido; vorrei y expresiones que el pack sí incluye permanecen en V1.

La sincronización del mismo propietario sí está en V1; un sistema público multiusuario/roles y corrección general mediante IA no se asumen. Generación offline de candidatos puede utilizarse en el desarrollo de V1 bajo control editorial y sin gasto no autorizado. No se promete certificación oficial A1 ni evaluación oral integral.

## Puerta de cobertura editorial

Todo Concept cumple el contrato por fases/facetas de CONTENT_STRATEGY, con artefactos enlazados, revisión lingüística, variantes aceptadas y rutas fiables de evaluación. La matriz no puede marcar publicado por tener solo teoría ni integrado por disponer de un componente genérico. Reading/Writing se auditan por progresión, contexto y propósito; no se fija una cantidad arbitraria de textos.

Templates y lexical sets reducen autoría duplicada. Combinaciones fuera del espacio validado no llegan al alumno. Variación significa oportunidades distintas pertinentes, no multiplicación de cadenas casi idénticas. Una respuesta no evaluable conserva el texto y ofrece otra vía de práctica/evidencia; un evaluador que siempre se abstiene no satisface cobertura de un Concept.

## Implementación por fases internas

| Fase | Trabajo futuro autorizado como conjunto solo tras aprobación final | Puerta de salida interna |
|---|---|---|
| A — Fundamentos | Contratos de contenido/versiones, identidad personal, modelo local/D1, outbox/protocolo de sincronización, inventario completo y políticas iniciales verificables | Trazabilidad, invariantes y formato editorial revisables. |
| B — Motores | Sesión, Exposure/Attempt/Evaluation/Evidence, Focus/Mixed/Review, errores y reanudación | Comportamientos base con fixtures de distintas áreas y recuperación/sincronización sin duplicados. |
| C — Integración vertical | Unidad piloto verbal y nominal, interfaz/teoría y primeras lecturas/escrituras | Validar ciclo y carga editorial; es hito interno, no V1. |
| D — Cobertura curricular | Todas las filas C01–C34, verbos/construcciones/léxico; templates y variantes revisadas | Ningún Concept sin rutas funcionales y contenido, incluido pasado. |
| E — Lectura y escritura | Completar matriz progresiva, contextos, mensajes autónomos y evaluación parcial | Todas las demandas editoriales pertinentes satisfechas. Empieza junto a C/D, no espera al final para detectar problemas. |
| F — Integración A1 completa | Auditar todos los modos, grafo, canon, reservas y recomendaciones con catálogo completo | Matriz sin lagunas de alcance ni contenido A1 pospuesto. |
| G — QA y entrega V1 | Regresiones, accesibilidad/móvil/offline, sincronización/conflictos/seguridad, rendimiento, evaluación editorial y validación de Sergio | Criterios de aceptación cumplidos o límites expresamente resueltos; no declarar V1 completa con faltantes curriculares. |

La autoría lingüística y QA acompañan todas las fases. Una revisión diferida del aprendizaje necesita tiempo real y no se finge con tests; pruebas con reloj controlado validan scheduler, no aprendizaje humano. No se estima duración sin medir autoría/validación de unidades representativas. Los ajustes de secuencia no requieren otro prompt para añadir el resto del A1: ya está dentro de la tarea total futura.

## Riesgos

- Volumen editorial y validación lingüística: medir coste por unidad piloto, reutilizar plantillas y ampliar dentro del alcance; no recortar A1 automáticamente.
- Combinatoria inválida: restringir espacios, revisar semántica y conservar variantes/canon exactos.
- Escritura autónoma: ofrecer revisión parcial honesta y tareas focales alternativas; no fabricar corrección ni aplazar su interfaz de composición.
- Abstención excesiva: medir por familia/Concept y mejorar cobertura de evaluación antes de cerrar V1.
- Catálogo grande: índices, búsqueda y agrupaciones sin listas interminables; comprobar rendimiento real y preparación del usuario.
- Progreso engañoso: evidencia por faceta/habilidad, sin porcentajes universales ni autoridad científica para umbrales H.
- Sincronización y coste: preservar hechos ante fallos de red/cuota/autenticación, probar conflictos y reconstrucción; no activar plan de pago ni descartar historial para cumplir límites.

## Decisiones pendientes

Solo las preguntas de [DECISIONS](../DECISIONS.md#open-questions-for-sergio): revisión lingüística y necesidad de una alternativa al acceso personal propuesto. El alcance A1 completo, la escritura a lo largo de todo el recorrido y la sincronización Cloudflare ya están decididos; no se vuelven a someter como opciones de recorte.

## ACCEPTANCE CRITERIA

| ID | Escenario verificable tras implementación | Resultado esperado |
|---|---|---|
| AC01 | Iniciar desde cero un Concept de presente de essere y llegar a comprobación diferida | Teoría/apoyo, intento independiente, producción y revisión nueva quedan diferenciados. No se declara estabilidad en la primera sesión. |
| AC02 | Elegir essere manualmente | Sesión se mantiene en alcance y varía facetas; ayuda evoluciona según evidencia, sin serie de clones. |
| AC03 | Mezclar con essere y avere accesibles | Ítems obligan a elegir sin revelar verbo; selección tiene motivo. Con uno solo, ofrecer Focus. |
| AC04 | Volver tras ausencia prolongada | Revisión muestreada y manejable, sin pérdida automática del perfil ni deuda infinita. |
| AC05 | Responder Noi sono italiani y reparar viendo modelo | Se conserva error verbal inicial; reparación asistida separada; no penalizar adjetivo correcto ni inferir causa psicológica. |
| AC06 | Responder con sujeto omitido o variante aceptada | Aceptar cuando sea válida dentro de la consigna; desconocida se abstiene, no se rechaza automáticamente. |
| AC07 | Escribir texto correcto que evita el objetivo | Registrar logro comunicativo evaluable; ninguna evidencia positiva del concepto ausente. |
| AC08 | Abrir tabla, teoría, opciones o glosa | Registrar tipo de apoyo; distinguir apoyo lexical incidental de revelación del objetivo. |
| AC09 | Fallar lectura pero escribir una forma correcta | Comprensión y oportunidad gramatical se atribuyen por separado, solo cuando la rúbrica lo permite. |
| AC10 | Recargar, pausar, doble enviar o reanudar tras solución | Sin duplicar envíos ni perder los confirmados; borrador recuperable y ayuda vista conservada. |
| AC11 | Fallo de guardado o restauración incompatible | Mensaje útil; conservar datos actuales y respuesta; no aparentar guardado exitoso. |
| AC12 | Retirar un ítem ambiguo | Conservar historial y excluir/recalcular su inferencia; no penalizar al alumno. |
| AC13 | Corregir género que propaga artículo/adjetivo | Vínculo entre errores; no tres penalizaciones independientes automáticas. |
| AC14 | Consultar progreso con datos escasos o antiguos | Mostrar sin evidencia / conviene comprobar; ni 0% ni olvido demostrado. |
| AC15 | Navegar con teclado móvil, ampliación y tecnología de apoyo | Consigna, respuesta, feedback y salida utilizables; sin depender solo de color o arrastre. |
| AC16 | Cambiar versión de política o contenido | Historial trazable; no herencia silenciosa de dominio en conceptos de significado distinto. |
| AC17 | Revisar pack completo y extensibilidad documental | Ninguna regla italiana incrustada como requisito universal del motor; idioma objetivo y explicación separados. |
| AC18 | Agotar ítems nuevos | Ofrecer repetición declarada o alternativa, sin presentar retención/transferencia nueva. |
| AC19 | Consultar teoría desde Biblioteca antes de un repaso | Exposición registrada aunque no haya intento; no atribuir retención independiente de esa ayuda reciente. |
| AC20 | Impugnar una respuesta sin conexión ni revisor remoto | Incidencia guardada offline y sincronizable con el historial, juicio suspendido y continuidad con otra actividad; sin crédito positivo ni promesa de atención docente. |
| AC21 | Evaluar variantes, errores conocidos, ambigüedad y objetivo ausente | Sin falsos positivos ni falsos rechazos conocidos en el conjunto editorial publicado; abstenciones identificadas y revisadas por cobertura. |
| AC22 | Auditar Research 02 completo | C01–C34, todos sus subalcances, 14 contextos y funciones están enlazados a inventario; fuentes complementarias trazadas. |
| AC23 | Publicar cualquier Concept | Tiene canon versionado, teoría, ejemplos, criterios, errores y artefactos de cobertura; no basta una fila planificada. |
| AC24 | Buscar cualquier Topic o Concept A1 | Focus resuelve subalcance o grupo y ofrece actividades apropiadas; excepción pedagógica explícita con alternativa, nunca solo teoría. |
| AC25 | Solicitar Review de cualquier Concept evaluable | Existe actividad de comprobación pertinente y ruta a Evidence; la cola no depende de una lista verbal fija. |
| AC26 | Mezclar áreas conocidas | Combina verbos, nominales, pronombres, preposiciones, tiempo y léxico según preparación; no introduce demandas desconocidas silenciosamente. |
| AC27 | Auditar referencias y grafo | Sin IDs rotos, nodos evaluables sin contenido/ruta, ciclos fuertes ni referencias a idioma ajeno; raíces justificadas no son huérfanos. |
| AC28 | Comparar V1 y POST-V1 con Research | Ningún contenido del currículo A1 queda pospuesto, incluido C27–C33 y todos los subalcances. |
| AC29 | Recorrer Reading de entrada a pasado | Matriz tramo/contexto/demanda satisfecha con textos y tareas revisados, incluidos los 14 contextos y variación adecuada. |
| AC30 | Recorrer Writing completo | Completar, frase construida/propia, varias frases, mensaje guiado y autónomo A1 disponibles; evaluación parcial explícita y alternativa focal ante abstención. |
| AC31 | Revisar reserva editorial por Concept | Facetas y fases cubiertas con variantes válidas; material equivalente no expuesto suficiente para plan de revisión declarado, sin confundir cambios cosméticos con variedad. |
| AC32 | Generar variantes deterministas | Solo espacio de combinaciones validado contra canon exacto; restricciones semánticas/gramaticales y distractores comprobados; fuera del espacio no se publica. |
| AC33 | Cambiar canon o lexical set | Variantes/plantillas dependientes se revalidan o retiran; historia y versiones anteriores preservadas. |
| AC34 | Evaluar verbos y léxico en todo A1 | Paradigmas, sentidos, régimen, auxiliar y persona trazables sin Concept por celda; léxico objetivo/apoyo y reconocimiento/producción diferenciados. |
| AC35 | Comprobar C01 mediante tareas escritas | Grafías/correspondencias del pack cubiertas con explicación y evidencia escrita apropiada; no se afirma evaluar pronunciación ni escucha. |
| AC36 | Cerrar hito interno | Entrega parcial se etiqueta como tal; solo cobertura curricular/editorial y QA integral permiten cerrar V1, sin requerir nuevo encargo para resto A1. |
| AC37 | Probar catálogo e historial completos en móvil | Buscar/seleccionar/revisar con todo inventario y ausencia prolongada sin bloqueo; mediciones reales documentadas antes de declarar rendimiento aceptable. |
| AC38 | Estudiar una unidad no descargada sin conexión | Indicar disponibilidad y descargar al recuperar conexión; no alterar dominio ni tratar falta de recurso como desconocimiento. |
| AC39 | Estudiar offline y reconectar | Hechos y outbox guardados atómicamente; sincronizar al poder ejecutar app, con reintentos/backoff y sin pérdida por red/cuota. |
| AC40 | Perder ACK o reenviar un lote | Mismos IDs/recibo no duplican hechos, evidencias ni errores; ID con contenido distinto genera conflicto. |
| AC41 | Recuperar propietario en otro dispositivo | Autenticación sencilla, descarga paginada e historial confirmado reconstruyen perfil y repasos; pendientes del otro dispositivo no se presentan como recibidos. |
| AC42 | Editar borrador/continuar sesión desde dos dispositivos offline | Conservar ramas/revisiones y ofrecer resolución; no sobrescribir respuestas ni inflar evidencia por repetición. |
| AC43 | Cambiar política de dominio o recibir exposición tardía | Recalcular MasteryProfile/ReviewNeed/ErrorPattern desde hechos/versiones; preservar evaluaciones originales y vincular las nuevas. |
| AC44 | Acceder sin sesión o con owner manipulado | Worker rechaza acceso; D1 solo por binding servidor, sin secretos de infraestructura en bundle, backup o logs. |
| AC45 | Importar dos veces o usar respaldo antiguo | Deduplicación por IDs, owner/versión validados, revisiones/invalidaciones respetadas; no reemplazar historial remoto ni duplicar mastery. |
| AC46 | Vencer o revocar acceso/agotar cuota | Suspender sync y conservar trabajo/outbox; recuperación de acceso mantiene owner sin reprovisionar ni crear otra identidad; sin activación automática de pago. |
| AC47 | Interrumpir descarga o recibir esquema incompatible | Cursor avanza solo tras aplicación local; conservar outbox y pedir actualización cuando proceda, sin omitir hechos. |

La revisión actual es documental; ninguno de estos escenarios se presenta como prueba de software ejecutada. La implementación comienza únicamente tras aprobación final. Merge a main solo con autorización explícita y README actualizado antes del merge.
