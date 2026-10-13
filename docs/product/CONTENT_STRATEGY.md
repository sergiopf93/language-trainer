# Estrategia editorial de V1 A1

Estado: diseño, no contenido lingüístico publicado. Base: Research 02, 03, 04 y 05. El alcance es todo el A1 del pack; [A1_COVERAGE_MATRIX](A1_COVERAGE_MATRIX.md) controla la cobertura.

## Unidad de producción

Trabajar por Concept y conjuntos de construcciones compatibles, no por miles de frases aisladas. Cada unidad enlaza regla canónica versionada, teoría, ejemplos, variables tipadas, lexical sets, restricciones, familias de actividad, criterios de aceptación/abstención, errores/feedback y requisitos de cobertura. La misma regla puede servir a varias tareas, sin equiparar sus evidencias.

ActivityTemplate + variables + lexical sets + restricciones de ConstructionSpec + reglas canónicas → combinaciones candidatas → validación editorial → ActivityVariants publicadas. No hay sustitución libre de sustantivos/verbos en cualquier hueco.

Ejemplo conceptual: un patrón de posesión necesita un sujeto compatible con la forma de avere y un complemento que tenga sentido poseer; un patrón locativo usa otra construcción y restricciones. La concordancia sintáctica sola no garantiza naturalidad semántica. Los datos incluyen compatibilidad de sentido, referentes, registro, función, género/número, régimen y alcance léxico.

## Garantía operativa de generación determinista

La publicación delimita un espacio finito de combinaciones permitido. Validar referencias, restricciones, formas, respuestas alternativas y distractores antes de publicar. Enumerar y comprobar el espacio finito de cada plantilla; si no puede revisarse de manera suficiente, reducir el espacio o publicar variantes explícitamente aprobadas. Las plantillas reducen autoría duplicada, no eliminan revisión lingüística.

En ejecución solo se seleccionan variantes publicadas o combinaciones de un espacio íntegramente validado y ligado a canon exacto. Una combinación sin validación no llega al alumno ni se usa para evaluar. No afirmar que el determinismo por sí solo prueba corrección: una regla errónea puede generar muchas frases erróneas. Un cambio de canon o lexical set invalida la aprobación de combinaciones afectadas hasta revalidarlas.

Los distractores incorrectos se etiquetan como tales y se revisan por plausibilidad y ausencia de variantes válidas rechazadas. El requisito de corrección lingüística de los modelos no prohíbe ejemplos de error claramente señalados en actividades de detección/reparación.

## Flujo editorial

1. Inventariar fuente Cxx, Concept, alcance, facetas y función.
2. Redactar/revisar canon, teoría, paradigmas y repertorio lexical necesario.
3. Definir plantilla, variables, restricciones semánticas/gramaticales y oportunidades evaluables.
4. Producir candidatos manualmente, determinísticamente o mediante ayuda IA offline opcional. Guardar origen, versión y condiciones; no se contratan APIs ni herramientas.
5. Validar contra el canon, resolver actividades sin depender de la respuesta sugerida y revisar alternativas, naturalidad adulta y adecuación al nivel.
6. Revisar con persona cualificada las reglas, rúbricas y variantes; registrar responsable/fecha. El modelo que genera no es autoridad independiente para aprobarse.
7. Publicar manifiesto y variantes aprobadas; reservar material equivalente para revisión diferida y transferencia cercana.
8. Registrar incidencias y retirar/revisar lo afectado, conservando historial y recalculando inferencias inválidas.

Estados de contenido: planificado → borrador → en revisión → validado → publicado; también retenido/retirado. Estado de implementación: no implementado → parcial → integrado → verificado. No se marca un estado por mera presencia de una fila de documentación. Cada avance enlaza evidencia real (artefacto, versión, revisión y comprobación).

## Aplicación del piloto 5B.1 (2026-10-13)

Por autorización explícita de Sergio, el estado operativo es `candidate → reviewed → published`. En este piloto, reviewed significa revisión integral explícita y trazable por Concept, realizada por R2 y declarada como autorrevisión asistida. No significa validación independiente ni autorización de producción. El paso 6 del flujo anterior sigue siendo requisito para publicación definitiva; no bloquea esta revisión piloto autorizada.

Los recibos de C01–C10 registran entidades y versiones, fecha, responsable, motivo, provenance, flags y huella del conjunto revisado. Candidate se conserva si hay dudas relevantes. Reviewed requiere Theory, ejemplos, actividades, criterios y vocabulario revisados, sin errores editoriales conocidos que afecten al aprendizaje. Las comprobaciones técnicas no deciden el estado. Solo published puede entrar en producción; desarrollo y builds de validación admiten candidate y reviewed. [Resultado y límites del piloto](A1_EDITORIAL_REVIEW_C01_C10.md).

## Matriz editorial de suficiencia por Concept

Esta tabla se instancia para **cada ID evaluable**, con referencias a actividades/artefactos reales. No basta una marca global por Cxx cuando contiene varios Concepts.

| Requisito | Evidencia de suficiencia para publicar |
|---|---|
| Teoría y canon | Regla/uso, límites, variantes, ejemplos, paradigma/excepciones A1 cuando procedan; revisión y versión. |
| Introducción | Ejemplos comprensibles que conectan forma y significado; léxico objetivo/apoyo declarado. |
| Guía | Actividad con apoyos identificados y retirada prevista. |
| Recuperación | Oportunidad pertinente sin respuesta revelada; adaptación receptiva/productiva según capacidad. |
| Uso contextual | Tarea con propósito que requiere el objetivo; no solo presencia incidental. |
| Contraste | Alternativa conocida pertinente; si no aplica, motivo explícito y tarea equivalente de discriminación donde tenga sentido. |
| Variación | Cubrir facetas exigidas (personas, sentidos, funciones, registros, contexto, etc.) sin exigir todas sus combinaciones posibles. |
| Revisión diferida | Conjuntos equivalentes reservados y no expuestos para ocasiones posteriores; renovación suficiente para el plan de revisión acordado. |
| Error learning | Error verificable, explicación, vínculo a concepto y actividad de reparación; no inventar error cuando solo hay incertidumbre. |
| Evaluación | Válidas, variantes, errores conocidos, ambigüedad, fuera de alcance y objetivo ausente; controlar falsos positivos/rechazos y abstención. |
| Integración | Focus, Mixed accesible, Review, Evidence y recomendación ejecutables para el Concept; no temas exclusivamente teóricos. |
| Reading/Writing | Oportunidades enlazadas al tramo/función; apropiadas al objetivo, sin atribuir producción a copia ni oralidad a grafía. |

La suficiencia exige cubrir cada faceta obligatoria y fases aplicables con tareas reales revisadas, tener formas de comprobar en ocasiones nuevas y resolver fallos conocidos del conjunto editorial. No se fija ahora un número universal de textos/ítems. Antes de publicar se declara el horizonte de reserva y se verifica que el selector puede satisfacerlo; si se agota, la app declara repetición y no la presenta como evidencia de novedad. Esta salida protege al alumno, pero no sustituye la obligación de preparar un banco útil para todo el recorrido.

## Reading: matriz progresiva

Cruzar tramo × función/contexto de Research 02 §5 × demanda (global, detalle, referente, forma-significado, inferencia local cuando proceda) × cobertura lexical/gramatical. Cada celda requerida referencia texto/versión, tareas, conceptos realmente evaluados, apoyos y variante equivalente de revisión. No se necesita el producto cartesiano completo; justificar celdas no pertinentes, sin eliminar un contexto o tramo.

| Tramo | Textos/propósitos que deben estar cubiertos | Progresión de tareas |
|---|---|---|
| Entrada | Saludos, perfiles, datos, precios y mensajes breves | Significado global y dato explícito; grafía y léxico accesibles. |
| Descripción y necesidades | Familia, vivienda, objetos, bar, compra | Referentes, singular/plural, posesión, descripción y petición. |
| Vida cotidiana | Trabajo/estudio, gustos, rutinas, transporte, horarios y contacto | Relaciones entre datos, preposición contextual, elección de respuesta. |
| Integración | Reservas, instrucciones, necesidades elementales, mensajes cotidianos | Secuencia, referencia pronominal, cantidades, intención e inferencia local. |
| Relato breve | Viaje y hechos pasados en contextos familiares | Relación temporal, auxiliar/participio en contexto y respuesta posterior. |

Estos tramos se superponen y espiralan; no son niveles certificados ni requisitos rígidos. El inventario de 14 contextos de la matriz impide que esta agrupación oculte alguno. Las bandas de palabras de Research 03 son H orientativas, no cuotas de publicación.

## Writing: progresión completa y evaluación honesta

| Progresión requerida | Artefacto editorial y evaluación |
|---|---|
| Completar con significado | Formulario/mensaje con intención; no solo copia. |
| Construir frase | Datos o apoyos léxicos, criterios de forma y propósito. |
| Frase propia | Consigna que permita elección y haga necesario el objetivo. |
| Varias frases | Destinatario y contenido; relaciones básicas entre mensajes. |
| Mensaje guiado | Propósito, requisitos, modelo opcional registrado como ayuda. |
| Mensaje más autónomo A1 | Situación/lector, selección propia y revisión con rúbrica; incluye relatos breves en pasado dentro del pack. |

Cada tramo y función pertinente tiene propuestas, rúbricas y oportunidades nuevas, no tres encargos únicos. Corregir solo lo verificable, mostrar evaluación parcial y mantener visibles los aspectos sin evaluar. Una rúbrica/modelo puede guiar autoevaluación sin atribuirla al evaluador automático. Ante abstención, ofrecer una actividad alternativa acotada del mismo Concept para conseguir evidencia fiable. Un Concept sin ninguna vía fiable no cumple V1 aunque su editor de texto funcione.

## Taxonomía Research 03 → familias V1

| Actividades del Research | Familia y demanda preservada |
|---|---|
| Multiple choice, selección binaria, detectar error, contraste de significado | F1 selección; reconocimiento/juicio, no producción por defecto. |
| Hueco con/sin banco, cloze, conjugación | F2 recuperación; banco/opciones cuentan como apoyo. |
| Transformación, corrección de error, reformulación para destinatario | F3 transformación/reparación; registro y significado además de forma. |
| Traducción ES→IT, frase, short answer, diálogo, information gap, formulario breve, ejemplo propio breve con explicación | F4 construcción situada; declarar límites, intención y oportunidad real. |
| Reading comprehension, traducción IT→ES, respuesta a dato textual | F5 lectura con tareas; escritura en L1/copiar dato no acredita producción L2. |
| Guided/free writing, respuesta a mensaje, reconstrucción de microtexto, formulario compuesto, ejemplo propio desarrollado + explicación | F6 composición; demanda ajustada, memoria/metaconocimiento separados de dominio lingüístico. |
| Matching, emparejar situación/mensaje, sentence ordering | F7 asociación/ordenación; evidencia de relación/secuencia con apoyos, alternativa a arrastre. |

Formulario y ejemplo propio + explicación pueden ser F4 si solicitan una respuesta breve situada, o F6 si requieren composición/revisión de varios campos o frases. El contrato de demanda decide el subtipo y la evidencia, sin duplicar la actividad ni el juicio.

Una actividad puede componer varias familias; la pertenencia no crea doble evidencia. Formatos con escaso valor para un objetivo concreto no se fuerzan. Añadir una familia requiere necesidad pedagógica/contrato distinto, no solo otra apariencia.
