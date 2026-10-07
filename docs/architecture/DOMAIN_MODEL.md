# Modelo conceptual del dominio

Estado: propuesta; sin esquema físico ni implementación. Base: Research 01 §1–5, 02 §2–4, 03 §1–4, 04 completo y 05 §1–6. Los identificadores siguientes son de diseño y conservan trazabilidad curricular.

## Conceptos con alcance evaluable

Un Concept identifica una capacidad de forma/significado/uso, con idioma, alcance, exclusiones, criterio observable y versión semántica. Un Topic agrupa conceptos para navegación y no tiene dominio propio: «essere» agrupa recuperar el presente y usarlo para identidad/origen/localización. No se crea un nodo por persona, palabra, contexto o variante: son facetas de cobertura salvo que necesiten enseñanza y decisión independiente.

Regla para dividir: separar cuando cambian propósito, criterio de evaluación o siguiente intervención. Mantener unido cuando solo varía el ejemplo. El usuario puede practicar el grupo «Essere — presente», pero recibe evidencia atribuida a objetivos concretos. Los ID C01–C34 del Research son referencias curriculares, no claves obligatorias del motor.

## Entidades y relaciones

| Elemento | Responsabilidad y relaciones |
|---|---|
| LanguagePack / Curriculum | Idioma objetivo, metadatos lingüísticos, conceptos y orden sugerido; idioma de explicación separado. Versiones de contenido y compatibilidad. |
| Topic | Agrupación navegable, sin evaluación agregada automática. |
| Concept | Capacidad acotada; referencia a teoría canónica, objetivos comunicativos y facetas de cobertura. |
| ConceptRelation | Origen, destino, tipo, motivo y alcance. Tipos: prerequisite, supports, contrasts. Prerequisite significa preparación necesaria para una tarea independiente, no candado del producto. |
| Skill / CommunicativeFunction / Context | Catálogos de dimensiones: comprender/recuperar/usar; presentarse/localizar/describir; trabajo/viaje/cotidiano. No multiplicar conceptos por cada combinación. |
| LexicalEntry | Forma, significado, género u otras propiedades propias del idioma, variantes y ejemplos. Léxico objetivo distinguible del léxico de apoyo. |
| CanonicalEntry | Regla, paradigma, excepciones de alcance, variantes, procedencia, revisión y versión. Solo proceso editorial puede cambiarla. |
| ActivityDefinition / ActivityVariant | Demanda pedagógica, formato de respuesta, objetivos evaluados, conceptos incidentales, apoyos, contexto, facetas y criterios de aceptación; variante concreta versionada. |
| ContentProvenance | Origen humano/generado, estado editorial, fuentes y revisión. Origen y aprobación son ejes separados. |
| Session / SessionItem | Objetivo manual o recomendado, modo, presupuesto orientativo, selección y razón; instantánea de actividad, posición, borrador y estado de reanudación. |
| Exposure | Consulta de teoría, ejemplo, paradigma o solución, incluso desde Biblioteca sin sesión. Fecha, concepto, contenido/versión y alcance de la ayuda. Registra exposición, no evidencia de dominio. |
| Attempt | Primer envío y reintentos identificados; texto, fecha, apoyos consultados, exposición a solución e interrupciones. Reintento enlaza al original y no lo reemplaza. |
| Evaluation / Opportunity | Juicio por oportunidad real: correcto, error verificable, no evaluable o sin oportunidad. Incluye alcance, criterio y versión; cumplimiento comunicativo separado. |
| Evidence | Derivada de evaluación: concepto, dimensión, facetas, independencia, foco/mezcla, novedad/familia de ítem y separación temporal. No evidencia positiva por mera ausencia de error. |
| ErrorEvent | Observación localizada con categoría lingüística, oportunidad, conceptos relacionados y confianza de clasificación. No diagnóstico de causa mental. |
| ErrorPattern | Agrupación derivada de eventos comparables en oportunidades diferentes; mantiene frecuencia respecto a oportunidades y relaciones de dependencia. |
| MasteryProfile | Proyección por concepto/dimensión con evidencia a favor, lagunas y fecha; reconstruible con política versionada. |
| ReviewNeed | Próxima comprobación recomendada, motivo, alcance y política; derivada de evidencia, no deuda permanente. |

Grammar se representa como categoría y contenido del Concept, no como un motor independiente. Vocabulary usa LexicalEntry; solo una capacidad léxica explícitamente enseñada necesita Concept. Context y Function permiten reutilizar el mismo concepto en situaciones diferentes. Las etiquetas de habilidad no son formatos de interfaz.

## Grafo curricular comprensible

Las relaciones prerequisite deben carecer de ciclos en el alcance publicado; supports y contrasts pueden ser recíprocas. Una tarea declara qué conocimientos necesita para ejecutarse sin ayuda y cuáles puede suministrar como apoyo. La navegación permite acceder anticipadamente a teoría y práctica guiada. «Qué aprender después» combina intención, apoyos accesibles y evidencia faltante; muestra su motivo y deja elección manual.

Ejemplo: persona/referente → formas de essere → uso de essere; persona/referente → formas de avere → uso de avere. Ambos usos supports contraste. Género + número supports concordancia; esos dos más grafía inicial relevante prerequisite de selección autónoma de artículos. Aprender género y plural puede alternarse: no es necesario un bloqueo serial completo.

## Evidencia y errores: ejemplo trabajado

Respuesta «Noi sono italiani» en una situación que requiere hablar del grupo:

- Una oportunidad verbal observada. Error de persona/número, relacionado con formas de essere y faceta primera persona plural; no tres penalizaciones por tres etiquetas.
- El uso de essere puede ser apropiado y la concordancia nominal correcta: conservar esas observaciones si la rúbrica permite atribuirlas por separado.
- La causa «interferencia del español» no se infiere del evento. Tampoco se diagnostica desconocimiento de todas las personas.
- «Noi siamo italiani» después de mostrar la solución es reparación asistida, no recuperación independiente.
- Otra situación sin ayudas y otro día puede aportar evidencia nueva; repetir el mismo ítem conserva su identidad y menor novedad.

En «la libro» un error de género puede explicar selección de artículo. Se registra el vínculo sin afirmar dos dificultades independientes. Un patrón recurrente requiere observaciones en oportunidades distintas; el umbral sigue siendo H. Una errata sospechada invita a comprobar, no a declarar olvido.

## Perfil de dominio y tiempo

Dimensiones separadas: comprensión, recuperación de formas, uso contextual, discriminación y retención diferida. No todas aplican igual a todos los conceptos; cada objetivo declara requisitos de evidencia. Estados visibles son resúmenes, no una máquina lineal irreversible. El vencimiento temporal añade incertidumbre o necesidad de comprobación, nunca transforma por sí solo aciertos anteriores en errores.

Una comprobación diferida conserva fecha de última exposición y feedback, incluidas consultas registradas desde Biblioteca, no solo número de sesiones. Abrir dos sesiones seguidas no equivale a espaciado. Conteos por facetas ayudan a detectar ausencia de noi o de uso contextual, sin exigir un producto cartesiano de todas las combinaciones.

## Integridad y evolución

Cada evaluación referencia versiones exactas de actividad, canon y política. Corregir un ítem conserva intentos y añade invalidación/revisión; las proyecciones dejan de usar el juicio inválido. Un cambio de significado del concepto necesita correspondencia explícita y puede requerir nueva comprobación; no hereda automáticamente dominio.

El idioma forma parte del ámbito de IDs. El historial de italiano no acredita conocimiento de otro idioma. Los hechos observados se conservan separados de sus interpretaciones, sin exigir infraestructura de event sourcing: historial de hechos en almacenamiento local y D1, mediante Worker, más proyecciones reconstruibles. No se requiere plataforma de mensajería ni infraestructura distribuida de event sourcing.

## Extensiones necesarias para V1 A1 completo

Se mantienen todas las entidades anteriores. La [matriz A1](../product/A1_COVERAGE_MATRIX.md) es el inventario propuesto; Topic, Cxx y Concept no son equivalentes. El Cxx es una referencia de origen; un Concept puede servir a más de una función o tema sin duplicar historial. El conteo de Concepts se realiza por ID único, no por apariciones en ejercicios o listas.

### Verbos y construcciones

LexicalEntry admite categoría verbo, lema y sentidos diferenciados. El contenido lingüístico italiano asocia paradigma versionado, tiempo/modo, regularidad o clase, excepciones y formas; persona/número son facetas, no seis Concepts por paradigma. Una forma irregular no se infiere por aplicar una terminación regular.

ConstructionSpec representa, como estructura editorial del pack, un patrón de uso con argumentos, restricciones, función y canon: modal + infinitivo, reflexivo, piacere, preposición contextual o auxiliar + participio. No exige nueva infraestructura. La selección de auxiliar pertenece al verbo/sentido/construcción y alcance declarado, nunca a una regla universal de «movimiento». Un Concept puede evaluar recuperación del paradigma, elección funcional o uso de una construcción; estas capacidades no se acreditan mutuamente por defecto.

C31, C32 y C33 conservan oportunidades distintas: formar/recuperar participio, construir/elegir auxiliar en pasado y concordar con essere. Una actividad puede observar las tres si sus rúbricas permiten atribución, sin convertir una sola causa propagada en tres fallos independientes. Error verbal se relaciona con verbo, tiempo, persona y uso como metadatos/facetas y referencias, no como penalizaciones añadidas.

### Léxico objetivo y de apoyo

LexicalEntry incorpora sentidos, categoría, rasgos flexivos, género lexical cuando aplica, formas/variantes, registro, colocaciones, régimen/construcciones y ejemplos con canon. LexicalSet agrupa por contexto, función y tramo; no duplica la entrada al reutilizarla. Ser objetivo o apoyo es un papel en cada actividad, no una propiedad permanente de la palabra.

El perfil lexical diferencia reconocimiento de sentido y recuperación productiva por entrada/sentido/facetas dentro del Concept lexical correspondiente. Haber acertado una palabra no domina todo un conjunto. Una glosa de apoyo no penaliza gramática; revelar la palabra objetivo sí afecta a esa oportunidad lexical. El estado «lexical accesible» distingue evidencia observada de apoyo disponible, sin presumir que el usuario conoce todo el vocabulario publicado.

### Contrato editorial por Concept

Cada Concept referencia teoría y canon, criterios de aceptación, facetas exigidas, funciones/contextos, actividades elegibles por fase, errores/reparación, ReviewNeed posible y capacidades del evaluador. CoverageRequirement describe lo requerido; CoverageStatus conserva enlaces a artefactos y revisiones reales. No son puntuaciones de usuario. Un estado editorial completo no significa dominio, y un estado planificado no significa material existente.

ActivityTemplate declara variables tipadas, conjuntos permitidos, restricciones lingüísticas, respuestas válidas, distractores y reglas canónicas versionadas. ActivityVariant registra la combinación aprobada, identidad de familia y exposición. Grammar y construcción italianas permanecen en el pack, no en el Learning Engine. TextAsset y WritingTask reutilizan el contrato de actividades y oportunidades; una rúbrica de composición no reemplaza evaluación específica de conceptos.

### Relaciones y escala

Validar referencias, alcance de idiomas, ciclos de dependencias fuertes y accesibilidad de cada Concept. Un nodo raíz no es huérfano si tiene función, contenido y entrada de aprendizaje; la conectividad no exige inventar un prerrequisito. Las dependencias soportan alternativas y apoyos, sin crear candados globales. El selector indexa por Concept, faceta, preparación, disponibilidad editorial y oportunidad; el perfil se consulta por objetivo, no recorriendo todo el historial para cada pregunta.

El historial de los diez IDs de diseño anteriores no existe en producción. El nuevo inventario sustituye esa propuesta sin migración de alumnos; futuros cambios con datos reales sí exigirán correspondencia y versionado explícitos.

## Persistencia de hechos e identidad local-first

Decisión de Sergio: sincronización Cloudflare Worker/D1 en V1. Se añaden metadatos de transporte a los hechos existentes, sin sustituir el modelo pedagógico.

| Elemento | Responsabilidad |
|---|---|
| OwnerIdentity | Identidad estable de un propietario personal; obtenida de autenticación del Worker, nunca confiada al payload. |
| Device / AccessSession | Dispositivo identificado y sesión de acceso revocable; independiente de Session de aprendizaje. Secretos fuera del historial/exportaciones. |
| FactEnvelope | ID global, owner, device, secuencia local, occurredAt/receivedAt, tipo/schema, referencias, versiones y hash de contenido. Envuelve sesiones/revisiones, exposiciones, intentos y observaciones. |
| OutboxOperation / SyncReceipt | Grupo local pendiente y confirmación durable por IDs; ambos permiten reintento sin duplicados. |
| SyncCursor | Posición de descarga asignada por servidor; avanzar tras aplicar página de forma atómica, no por reloj de dispositivo. |
| Revision / Conflict | Base y sucesoras de borrador/estado; conservar alternativas concurrentes. Correcciones de evaluación son revisiones trazables. |
| ProjectionCheckpoint | Política, canon/evaluador compatibles y frontera de hechos utilizados. MasteryProfile/ReviewNeed/ErrorPattern reconstruibles; no son fuente primaria sincronizada por suma. |

Persistir hechos de Session, Exposure, Attempt, Evaluation/Opportunity, Evidence y ErrorEvent con su procedencia. Evidence y Evaluation son interpretaciones originales conservadas, no verdades inmutables: una revisión no sobrescribe la anterior. ErrorPattern es una agrupación derivada; decisiones humanas de confirmar/impugnar un patrón sí son hechos. Lectura de teoría sin respuesta también debe sobrevivir al cambio de dispositivo.

Invariantes: mismo ID+mismo contenido se incorpora una vez; mismo ID+distinto contenido es conflicto; referencias dependientes se aceptan en grupo coherente; no perder el intento por actualizar una proyección; no sumar dos evaluaciones del mismo objetivo/versión por reintento de red. Eventos simultáneos independientes se conservan sin inflar variedad o estabilidad.

La política de dominio trabaja sobre la versión vigente de observaciones y su causalidad. Llegada tardía de ayudas/invalidaciones puede recalcular perfiles anteriores. Tiempo del servidor acredita recepción, no cuándo se aprendió offline. Incertidumbre del reloj o exposición pendiente requiere prudencia al inferir estabilidad.

Una reautenticación en otro dispositivo recupera owner e historial remoto y reconstruye proyecciones. Exportar/importar conserva IDs y revisiones, deduplica contra historial existente y nunca transforma un snapshot derivado en hechos nuevos. Recursos canónicos/versiones necesarios para reevaluar se mantienen accesibles; faltantes se señalan, no se sustituyen por versiones actuales silenciosamente.
