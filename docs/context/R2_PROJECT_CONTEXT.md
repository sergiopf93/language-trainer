# R2 — contexto operativo de language-trainer

Actualizado: 2026-10-07. Leer este documento primero; ampliar solo la sección necesaria. Resume decisiones, no sustituye canon ni acredita implementación. Instrucciones recientes de Sergio prevalecen; ante contradicción, consultar la fuente concreta y actualizar este resumen.

## Política de lectura y delegación

1. Usar este archivo como contexto operativo principal.
2. Identificar el área afectada antes de abrir otros documentos.
3. Leer únicamente archivos/secciones directamente relacionados; reutilizar lo ya conocido.
4. No releer el Research Pack completo por defecto.
5. Para implementar un concepto italiano, consultar su Cxx/canon, entrada de matriz y requisitos pertinentes; no todo el currículo.
6. Para arquitectura, consultar Architecture/Domain solo cuando sea necesario.
7. Para UX, consultar UX solo cuando sea necesario.
8. Para QA, consultar requisitos, implementación y fuentes relevantes para la comprobación concreta.
9. Dar a subagentes objetivo acotado, estado conocido y referencias precisas. No ordenarles releer toda la documentación ni transmitir todo el historial por defecto. Evitar delegación redundante.
10. Releer el Research Pack completo únicamente cuando una decisión afecte globalmente al modelo pedagógico o al currículo A1.

Localizar un encabezado con búsqueda antes de leer un documento largo. Ampliar inspección solo si aparece dependencia, contradicción o evidencia faltante; no simular comprensión de código no inspeccionado. Esta política reduce lectura innecesaria, no las pruebas relevantes.

Fuente si hace falta: instrucción de Sergio sobre optimización de contexto; reglas globales R2 §§5/11.

## Visión y V1

Entrenador mobile-first adulto para aprender, practicar, usar y consolidar capacidades concretas. Italiano objetivo; español inicial de interfaz/explicación. **V1 incluye todo el A1 definido por Work**, C01–C34, funciones, léxico, contextos y lectura/escritura progresivas, incluido pasado. No es una demo de diez objetivos. Cobertura curricular completa no equivale a certificación oficial ni evaluación oral integral.

Detalle solo si necesario: [PRODUCT_SPEC](../product/PRODUCT_SPEC.md), apartados Visión y V1; [V1_SCOPE](../mvp/V1_SCOPE.md), V1/POST-V1.

## Mapa curricular

Inventario propuesto: **34 Topics, 99 Concepts evaluables, 14 contextos**. Los números describen diseño, no contenido publicado.

- C01–C06: grafía, interacción básica, personas/sujeto, essere, avere, negación/preguntas.
- C07–C13: género, número, determinados/indeterminados, adjetivos, grupo nominal, números/precios/cantidades.
- C14–C19: presentes regulares/irregulares, modales, vorrei/tu-Lei, c'è/ci sono.
- C20–C26: preposiciones simples/articuladas, calendario/hora, posesivos, demostrativos, gustos y reflexivos.
- C27–C30: cantidades/partitivos, pronombres complemento, conectores e imperativo útil.
- C31–C33: participios, passato prossimo y concordancia con essere.
- C34: léxico/expresiones transversales. Contextos: presentación, familia, vivienda, bar, restaurante, supermercado, compras, trabajo/estudio, transporte, hotel, viaje, mensajería, necesidades médicas elementales y conversación cotidiana escrita.

La matriz asigna IDs, capacidades, preparación, teoría, léxico, modos, errores y estados. Cada Concept hereda CC1–CC10; no marcar completo por tener una página teórica.

Detalle: [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md), únicamente Cxx/contexto afectado; [Research 02](../research/02_Italian_A1_Curriculum.md), fila/sección correspondiente.

## Pedagogía y learning loop

Acertar hoy no demuestra aprendizaje estable. Separar reconocimiento, recuperación, producción, selección contextual y retención; registrar ayudas, reintentos, variedad y oportunidades reales. Falta de evidencia no significa desconocimiento. E-S/E-M delimitan evidencia del pack; REF describe referencias; R recomienda; H es hipótesis, nunca regla científica automática.

Objetivo → comprobación inicial → explicación/apoyo cuando haga falta → recuperación independiente → producción con propósito → contraste/mezcla → comprobación diferida nueva → valoración provisional y mantenimiento/reparación. Puede repartirse entre sesiones; copiar una corrección no acredita recuperación.

Detalle: [Research 01](../research/01_Learning_Model.md) §3 y sección pertinente de [Research 04](../research/04_Mastery_Review_Error_Model.md).

## Dominio y knowledge graph

Topic agrupa y no recibe dominio propio. Concept define capacidad evaluable con alcance, exclusiones y versión. Persona, formas y contextos suelen ser facetas; no crear Concept por celda verbal. ConceptRelation distingue prerequisite/supports/contrasts. Preparación orienta tareas, sin exigir perfección ni bloquear teoría. Validar referencias, ciclos fuertes y ausencia de Concepts huérfanos.

Verbos: lema/sentido, paradigma, irregularidad, construcción/régimen y auxiliar por construcción. LexicalEntry diferencia sentidos y formas; lexical sets organizan repertorios. Objetivo/apoyo es papel por actividad, no atributo fijo de una palabra.

Detalle: [DOMAIN_MODEL](../architecture/DOMAIN_MODEL.md), Conceptos, Grafo y Extensiones; matriz Cxx pertinente.

## Evidence y Mastery

Session, Exposure, Attempt, Evaluation/Opportunity, Evidence y ErrorEvent conservan procedencia/versiones. Exposure incluye teoría consultada fuera de sesión. Separar primer intento y reparación; juicio correcto/error verificable/no evaluable/sin oportunidad. Solo atribuir conceptos realmente observados.

MasteryProfile es proyección explicable por comprensión, recuperación, uso contextual, discriminación y retención. No porcentaje global ni fórmula definitiva. Antigüedad aumenta incertidumbre, no demuestra olvido. Umbrales/calendarios necesitan política explícita y calibración.

Detalle: [DOMAIN_MODEL](../architecture/DOMAIN_MODEL.md), Perfil/Integridad; [Research 04](../research/04_Mastery_Review_Error_Model.md) §§1–3.

## Focus, Mixed y Review

Focus admite cualquier Topic/Concept A1, seleccionando subalcance o grupo. Variar tareas y retirar apoyos según evidencia. Mixed cruza conocimientos accesibles de todo el currículo sin introducir desconocidos silenciosamente ni fijar porcentajes arbitrarios. ReviewNeed puede surgir para cualquier Concept: intentar antes de recordar, usar oportunidades nuevas equivalentes y reparar después. Tras ausencia, muestrear sin deuda ilimitada.

Detalle: [ARCHITECTURE_PROPOSAL](../architecture/ARCHITECTURE_PROPOSAL.md), Selección/Mastery y scheduler; [Research 04](../research/04_Mastery_Review_Error_Model.md) §§4/7.

## Error Learning

Relacionar evento, oportunidad, categoría y patrón sin diagnosticar causas mentales. Un error de género puede propagar artículo/adjetivo: no tres penalizaciones independientes. Feedback explica qué/por qué/concepto y permite practicar. Incidencia de corrección dudosa suspende su inferencia; sincronizarla no promete revisión docente.

Detalle: [DOMAIN_MODEL](../architecture/DOMAIN_MODEL.md), Evidencia y errores; [Research 04](../research/04_Mastery_Review_Error_Model.md) §§5–6.

## Exercise Engine

Siete familias: F1 selección; F2 recuperación/cloze; F3 transformación/reparación; F4 construcción situada/diálogo; F5 lectura; F6 composición; F7 asociación/ordenación. Son contratos reutilizables, no siete motores. Habilidad y formato se registran por separado. Formulario/ejemplo breve puede ser F4; composición de varios campos/frases, F6; no doble evidencia.

Detalle: [CONTENT_STRATEGY](../product/CONTENT_STRATEGY.md), Taxonomía; [Research 03](../research/03_Exercise_Taxonomy.md), fila de actividad; Architecture, Contrato del ejercicio.

## Reading, Writing y Theory

Reading cubre todos los tramos/contextos adultos con dificultad por léxico, sintaxis, referentes y demanda, no solo longitud. Writing: completar → construir frase → frase propia → varias frases → mensaje guiado → autónomo A1, incluido relato pasado. No limitar a tres textos/encargos. Evaluación parcial honesta: abstenerse ante incertidumbre y ofrecer comprobación focal fiable; autoevaluación no crea mastery automático.

Theory cubre todo A1: reglas, paradigmas, ejemplos, excepciones pertinentes y errores, conectados con práctica/progreso. Nada puede quedar solo en teoría.

Detalle: [CONTENT_STRATEGY](../product/CONTENT_STRATEGY.md), matrices Reading/Writing; [UX_PROPOSAL](../ux/UX_PROPOSAL.md), flujo afectado.

## Canon y contenido generado

Canon versionado es autoridad lingüística; generación manual/determinista/IA offline produce candidatos. Templates + variables tipadas + lexical sets + restricciones semánticas/gramaticales + variantes revisadas reducen autoría duplicada. Publicar solo combinaciones del espacio validado. Determinismo no garantiza naturalidad. No IA online obligatoria ni pago no autorizado.

Suficiencia se verifica por Concept/facetas/fases y reservas diferidas, no cuotas arbitrarias de textos. Controlar falsos positivos, falsos rechazos y abstención excesiva.

Detalle: [CONTENT_STRATEGY](../product/CONTENT_STRATEGY.md); [Research 05](../research/05_Content_Strategy.md), criterio editorial relevante.

## Multi-language

Learning Engine separado de LanguagePack/Curriculum y evaluadores lingüísticos. Idioma objetivo y explicación separados. No transferir dominio automáticamente entre lenguas. Solo italiano activo en V1.

Detalle: [DOMAIN_MODEL](../architecture/DOMAIN_MODEL.md), entidades/Integridad; Architecture, Límites de responsabilidad.

## Local-first, Cloudflare e historial

**Decidido:** PWA → almacenamiento local offline → Worker → D1. Guardar hechos y outbox atómicamente; sincronizar al recuperar conexión cuando la app pueda ejecutarse. Historial confirmado recuperable en otro dispositivo; exportación/importación manual como backup y portabilidad, no sincronización principal. D1 accesible exclusivamente desde Worker, sin credenciales de infraestructura en cliente.

**Diseño propuesto:** IDs globales, ACK durable/idempotente, descarga paginada por cursor y transacción local; conservar conflictos/borradores concurrentes. Persistir hechos originales y revisiones; MasteryProfile/ReviewNeed/ErrorPattern reconstruibles con políticas/versiones. Exposición tardía puede cambiar inferencias previas. No fusionar snapshots de dominio ni sobrescribir historial con backups antiguos.

Acceso propuesto: un propietario, código privado de recuperación y sesiones revocables por dispositivo con cookie segura/HttpOnly; mismo origen PWA/API. Reautenticar conserva owner/outbox. No sistema público multiusuario. Cuotas gratuitas compartidas requieren medición; no activar pago automáticamente.

healt-tracker ya fue inspeccionado: reutilizar técnicas IndexedDB/Worker/D1, transacciones y revisiones; **no copiar** snapshot global, dependencia de red antes de mutar ni Bearer persistido en localStorage. No volver a inspeccionarlo entero.

Detalle: [ARCHITECTURE_PROPOSAL](../architecture/ARCHITECTURE_PROPOSAL.md), Patrón healt-tracker, Persistencia, Identidad y Coste; Domain, Persistencia de hechos. Verificar cuotas actuales solo al decidir despliegue/coste.

## UX fundamental

Inicio / Practicar / Biblioteca / Progreso. Una acción principal, búsqueda por Topic/subalcance/intención, uso adulto con una mano, teclado móvil y accesibilidad. Sesiones reanudables; sin cronómetro evaluador. Distinguir publicación, descarga local, preparación y evidencia. Mostrar guardado local/pendiente/sincronizado/error/acceso vencido sin perder trabajo.

Detalle: [UX_PROPOSAL](../ux/UX_PROPOSAL.md), únicamente navegación/flujo/estado afectado.

## Decisiones y estado actual

Aprobado como dirección: todo A1, todos sus modos integrados, Cloudflare local-first, historial reconstruible, backup secundario y coste prácticamente cero. **Implementación incremental autorizada por Sergio el 2026-10-07: primer bloque de base técnica.** Se mantiene V1 A1 completa. Acceso personal implementado conforme a la propuesta; parámetros pedagógicos y responsable de revisión lingüística siguen pendientes.

Base técnica implementada en rama de desarrollo: TypeScript/Vite, shell PWA, IndexedDB y outbox, Worker/D1, identificación personal, recibos idempotentes y revisiones de borrador. Motores pedagógicos solo como contratos. Architecture/UX/QA revisaron previamente la propuesta; QA cerró hallazgos documentales. Inventario: 34 Topics/99 Concepts/14 contextos; 47 criterios AC01–AC47. Contenido aún planificado; no hay currículo publicado, evaluación ni dominio implementado. Tests de infraestructura y navegador disponibles; runtime nativo Cloudflare no ejecutable en el macOS 12 actual, despliegue real y validación humana pendientes. No se acredita eficacia pedagógica.

Repositorio: `/Users/sergiopardo/Desktop/language-trainer`; rama de implementación `feat/technical-foundation`, creada desde main e incorporando por fast-forward la documentación existente. Arranque y límites en README.md. Punto de partida: base técnica del primer bloque, sin cierre de V1 ni continuación automática al siguiente bloque. Consultar `git status` y `git log` antes de actuar: este resumen no sustituye el estado real del repositorio ni implica aprobación de implementación. Preservar cambios ajenos.

Fases futuras A–G: fundamentos → motores → integración vertical → cobertura curricular → Reading/Writing → integración completa → QA/entrega. Un hito parcial no cierra V1 ni necesita otro encargo para añadir el resto del A1.

Detalle: [DECISIONS](../DECISIONS.md), decisiones/preguntas; [V1_SCOPE](../mvp/V1_SCOPE.md), fases/AC; [DESIGN_REVIEW](../mvp/DESIGN_REVIEW.md), límites de revisión.

## Reglas y mantenimiento

Hablar español; implementar solo el bloque autorizado y detenerse al entregarlo. No merge a main ni gasto sin autorización explícita. No sobrescribir trabajo ni ocultar fallos. No presentar propuesta/publicación como funcionalidad probada. Mantener trazabilidad del A1, canon, ayudas y versiones. Modificar reglas globales únicamente dentro de una autorización explícita de Sergio.

Actualizar solo apartados afectados de este resumen al cambiar una decisión o cerrar una fase; eliminar estados transitorios resueltos. Mantenerlo compacto, sin copiar matrices, transcripciones, logs, secretos ni banco de ejemplos. Si fuente y resumen discrepan, resolver la sección concreta antes de actuar.

Detalle: instrucciones globales R2 aplicables; [DECISIONS](../DECISIONS.md). El resumen no amplía permisos ni reemplaza instrucciones superiores.
