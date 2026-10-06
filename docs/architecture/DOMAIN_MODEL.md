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

## Grafo pequeño y comprensible

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

El idioma forma parte del ámbito de IDs. El historial de italiano no acredita conocimiento de otro idioma. Los hechos observados se conservan separados de sus interpretaciones, sin exigir infraestructura de event sourcing: almacenamiento local simple más proyecciones reconstruibles es suficiente como propuesta.
