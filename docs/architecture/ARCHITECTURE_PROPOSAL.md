# Propuesta de arquitectura

Estado: diseño para aprobación. No se elige ni instala un stack definitivo.

## Hechos, inferencias y recomendación

Hechos: el repositorio inspeccionado contiene únicamente los siete documentos de Research; no hay aplicación ni patrones técnicos existentes que reutilizar. El uso inicial será móvil y el idioma inicial italiano. La investigación no fija fórmula de dominio, scheduler ni tecnología.

Inferencia: un piloto personal con contenido revisado y respuestas acotadas puede funcionar sin backend ni IA en ejecución. Recomendación: aplicación web instalable, con funcionamiento local tras cargar el contenido, un único despliegue estático y módulos internos. Validar primero si Sergio necesita sincronización: cambia el alcance de esta propuesta.

## Límites de responsabilidad

| Módulo conceptual | Entrada → salida y límite |
|---|---|
| Interfaz | Acciones y borradores → comandos de sesión; presenta evidencia, no calcula dominio. |
| Learning Engine | Objetivo + perfil + catálogo → siguiente paso explicado. Coordina; no contiene gramática italiana. |
| Exercise Engine | Definición versionada → actividad, apoyos y evaluación por oportunidad. Cada familia ofrece presentación y contrato de evaluación. |
| Evaluación lingüística | Respuesta + criterios publicados del pack → correcto/error/no evaluable/sin oportunidad. No inventa reglas ni fuerza coincidencia literal universal. |
| Evidence / Mastery | Intentos y evaluación → perfil explicable bajo política versionada. No modifica intentos. |
| Review Scheduler | Evidencia + fecha + presupuesto → necesidades y prioridades, con razones. No decide corrección. |
| Content Repository | Catálogo aprobado → unidades y variantes compatibles. Candidatos no publicados quedan fuera de sesiones evaluadas. |
| Persistencia | Guarda sesión, intentos y versiones de forma coherente; exporta/restaura historial. |

No se proponen microservicios, base de grafos, embeddings, colas ni un framework de plugins. Las extensiones son contratos internos y datos de idioma. Un nuevo tipo de ejercicio añade su presentación y evaluación manteniendo el formato de evidencia; una nueva lengua añade su pack y las reglas lingüísticas que precise.

## Contrato del ejercicio

Cada actividad declara ID/versión, familia, consigna, habilidad objetivo, formato, oportunidades, conceptos incidentales, apoyos, vocabulario, contexto, facetas, familia de variantes y criterio de aceptación. La evaluación devuelve juicios por oportunidad y feedback enlazado al canon. No asigna directamente mastery.

Cinco familias MVP: selección significativa, hueco sin opciones/con apoyo explícito, transformación breve, producción contextual acotada y lectura con preguntas. Corrección de un error usa transformación/producción; conjugación usa recuperación; escritura guiada compone respuestas contextuales. Esta reutilización no confunde sus demandas pedagógicas: cada actividad conserva sus etiquetas.

Validación cerrada por respuestas/variantes y reglas revisadas del alcance. Normalizar espacios y formas tipográficas cuando no alteran el objetivo; nunca borrar distinciones como e/è o apóstrofos de manera global. Respuesta fuera del conjunto conocido no implica error: el evaluador debe poder abstenerse. No se promete análisis gramatical general mediante expresiones regulares.

## Selección focal, mezcla y recomendación

1. Filtrar contenido publicado, compatible, accesible y con oportunidad para el objetivo.
2. En Focus, atender al alcance elegido y comprobar antes de ayudar. En Mixed/Review, construir candidatos por error observado, revisión diferida, laguna de evidencia y concepto reciente.
3. Priorizar obstáculos recurrentes pertinentes y comprobaciones pendientes; asegurar que también se visitan necesidades antiguas, sin que un patrón absorba siempre toda la sesión.
4. Preferir facetas y familias de ítems menos vistas; alternar demandas sin introducir léxico o estructuras desconocidas por accidente.
5. Reservar la siguiente tarea solo cuando haya presupuesto razonable; permitir terminar con resumen parcial. Si falta contenido, explicarlo y no presentar repetición como transferencia nueva.

No hay porcentajes fijos. Desempates y reglas deben ser reproducibles y guardar razón de selección. La recomendación de aprender algo nuevo considera función deseada y preparación; no exige dominio total de prerrequisitos.

## Mastery y scheduler iniciales

Propuesta de reglas explicables por dimensión, sin puntuación compuesta. Una selección asistida solo informa comprensión/reconocimiento asistido. Recuperación independiente requiere intento anterior a modelo/pista determinante. Uso en mezcla requiere elección real entre alternativas conocidas. Estabilidad requiere oportunidades independientes, diversas y separadas por tiempo real desde exposición relevante.

Se parametrizan después, antes del piloto: mínimo de oportunidades/facetas, distancia temporal, criterio de recurrencia, tolerancia a lapsos y revisión de estabilidad. Se guardará versión de política. No se publicará «estable» mientras no exista una política de evidencia aprobada y verificable; durante un piloto inicial puede mostrarse simplemente el historial observado.

Scheduler: proponer comprobación posterior para aprendizajes recientes; espaciar tras evidencia independiente variada; acercar tras dificultad confirmada. Retomar tras ausencia con una muestra priorizada. Reparación inmediata y comprobación diferida son necesidades distintas; completar una no satisface automáticamente la otra. Intervalos concretos son H pendiente de calibración.

## Canon y generación

Canon versionado con fuente lingüística, alcance y revisión; actividades publicadas referencian esa versión. Origen humano o generado permanece en procedencia. Flujo editorial: candidato → revisión lingüística y pedagógica independiente → publicado / retenido / retirado. Una IA no se valida a sí misma como única autoridad.

MVP: contenido elaborado y revisado previamente, sin generación ni corrección de IA durante el uso. Generación offline sería opcional futura: no necesaria para aprobar el MVP ni autorizada con costes. Ninguna salida generada tiene permiso para reescribir reglas o criterios. Reportes de ambigüedad suspenden el juicio discutido y conservan el intento. En el MVP, «Creo que mi respuesta es válida» crea una incidencia local exportable, excluye esa observación de inferencias y evita reutilizar el ítem cuestionado para evaluar a ese perfil. No envía mensajes ni promete revisión remota. El usuario puede continuar con otra actividad; retirar su incidencia no convierte la respuesta en correcta. Una revisión editorial posterior puede publicar criterio corregido/versionado o mantener abstención; resolver el caso requiere revaluación explícita trazable. Los reportes no bloquean otros objetivos ni generan crédito positivo.

## Persistencia, privacidad y recuperación

Propuesta: almacén estructurado en el navegador para sesiones, intentos y proyecciones; contenido y aplicación disponibles localmente después de su primera carga. IDs de envío únicos y guardado coherente evitan duplicados al recargar. Registrar también consultas de teoría y soluciones fuera de sesiones para que el scheduler no confunda exposición reciente con retención diferida. Guardar cada respuesta enviada y borradores durante escritura; si falla el guardado, avisar antes de avanzar y mantener el texto visible.

Exportación/importación manual versionada del progreso para respaldo. Validar archivo y compatibilidad antes de aplicar; ofrecer vista previa y copia de seguridad. MVP restaura una instantánea completa con confirmación explícita, no fusiona historiales entre dispositivos. La sincronización automática queda fuera. Borrar datos del navegador puede perder progreso no exportado; comunicarlo de forma útil en ajustes, sin prometer almacenamiento permanente.

Sin cuenta, secretos de proveedores ni envío de textos personales por defecto. Telemetría del piloto local/exportada voluntariamente. Actualizaciones de contenido mantienen sesiones fijadas a versiones compatibles; retirar un ítem permite saltarlo sin penalización y recalcular inferencias afectadas. Cambios de reloj o fecha sospechosos impiden atribuir retención temporal automáticamente hasta aclarar la secuencia.

## Tecnología, coste y decisiones pendientes

Web instalable + almacenamiento estructurado local + recursos estáticos es la opción recomendada; selección concreta de framework y librerías se hará solo tras aprobación. Un backend con cuenta facilitaría sincronización, pero añade permisos, conflictos, mantenimiento y límites de servicio. Una app nativa aumenta trabajo inicial sin resolver la validación pedagógica.

No se requiere gasto recurrente durante desarrollo local. Un alojamiento estático gratuito puede estudiarse al desplegar, verificando entonces sus límites; no se asumen tarifas vigentes ni se contrata nada. Dominio personalizado, IA y sincronización son decisiones independientes. Coste principal previsto: autoría y revisión lingüística; no se presume que un experto externo esté disponible gratuitamente.

## Riesgos y validación de diseño

Mayor riesgo: cobertura editorial insuficiente o corrección demasiado estrecha que frustre al usuario. Mitigar con variantes explícitas, abstención y evaluación editorial antes de ampliar volumen. Otro riesgo: estados que parezcan científicos sin calibración; mostrar evidencia y límites.

La validación de esta fase es documental. Los contratos, casos de aceptación y trazabilidad se revisan ahora; pruebas de persistencia, accesibilidad, motor y recuperación corresponderán al desarrollo autorizado. No hay build ni tests de software aplicables todavía.
