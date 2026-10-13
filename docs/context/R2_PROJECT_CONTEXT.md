# R2 — contexto operativo de language-trainer

Actualizado: 2026-10-13. Leer este documento primero; ampliar solo la sección necesaria. Resume decisiones, no sustituye canon ni acredita implementación. Instrucciones recientes de Sergio prevalecen; ante contradicción, consultar la fuente concreta y actualizar este resumen.

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

Entrenador mobile-first adulto para aprender, practicar, usar y consolidar capacidades concretas. Italiano como idioma principal de interacción y práctica; español como apoyo y explicación pedagógica. **V1 incluye todo el A1 definido por Work**, C01–C34, funciones, léxico, contextos y lectura/escritura progresivas, incluido pasado. No es una demo de diez objetivos. Cobertura curricular completa no equivale a certificación oficial ni evaluación oral integral.

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

Canon versionado es autoridad lingüística; generación manual/determinista/IA offline produce candidatos. Templates + variables tipadas + lexical sets + restricciones semánticas/gramaticales + variantes revisadas reducen autoría duplicada. Regla permanente autorizada: `candidate → reviewed → published`. Candidate puede crearse y usarse en desarrollo/testing y validación técnica sin revisión independiente; reviewed exige validación editorial conforme al proceso que se defina; published exige contenido revisado y habilitado para producción. No confundir esos estados. La revisión independiente condiciona contenido definitivo/publicable de V1, nunca implementación o pruebas técnicas. Publicar solo combinaciones del espacio validado. Determinismo no garantiza naturalidad. No IA online obligatoria ni pago no autorizado.

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

Base técnica implementada en rama de desarrollo: TypeScript/Vite, shell PWA, IndexedDB y outbox, Worker/D1, identificación personal, recibos idempotentes y revisiones de borrador. Motor focal, evaluación canónica y proyección de observaciones implementados en Fase 2; otros modos siguen como contratos. Architecture/UX/QA revisaron previamente la propuesta; QA cerró hallazgos documentales. Inventario: 34 Topics/99 Concepts/14 contextos; 47 criterios AC01–AC47. No hay currículo publicado ni política de dominio estable; el lote candidate técnico no representa cobertura A1 completa. Tests de infraestructura y navegador disponibles; runtime nativo Cloudflare no ejecutable en el macOS 12 actual, despliegue real y validación humana pendientes. No se acredita eficacia pedagógica.

Repositorio: `/Users/sergiopardo/Desktop/language-trainer`; rama de implementación `feat/technical-foundation`, creada desde main e incorporando por fast-forward la documentación existente. Arranque y límites en README.md. Punto de partida: base técnica del primer bloque, sin cierre de V1 ni continuación automática al siguiente bloque. Consultar `git status` y `git log` antes de actuar: este resumen no sustituye el estado real del repositorio ni implica aprobación de implementación. Preservar cambios ajenos.

Fases futuras A–G: fundamentos → motores → integración vertical → cobertura curricular → Reading/Writing → integración completa → QA/entrega. Un hito parcial no cierra V1 ni necesita otro encargo para añadir el resto del A1.

Detalle: [DECISIONS](../DECISIONS.md), decisiones/preguntas; [V1_SCOPE](../mvp/V1_SCOPE.md), fases/AC; [DESIGN_REVIEW](../mvp/DESIGN_REVIEW.md), límites de revisión.

## Fase 2 — recorrido técnico implementado (2026-10-08)

Decisión editorial resuelta por Sergio: `candidate → reviewed → published`. Candidate autorizado para implementar/probar técnicamente; revisión independiente pendiente solo para contenido definitivo/publicable. No volver a bloquear fases técnicas por esa revisión. Alcance final inalterable: todo A1. Sin subagentes, despliegue ni servicios nuevos.

Catálogo con Topic/Concept/relaciones/versiones y fixture candidate de C03-01/C04-01 (6 actividades; selección, huecos y respuesta breve). Desarrollo lo habilita; build normal lo excluye y `VITE_ENABLE_CANDIDATE_CONTENT=true` habilita una compilación de validación. No hay contenido reviewed/published ni cobertura completa de estos Concepts.

Biblioteca → práctica focal → respuesta/corrección → resumen → progreso por dimensión. Sesiones conservan instantáneas; borradores de respuesta, pistas, reintentos y finalización sobreviven recargas. Intento/evaluación/evidencia/estado se guardan juntos en IndexedDB/outbox, con CAS local contra envíos duplicados; ramas concurrentes se conservan. Nuevos tipos de hechos validan referencias y conviven con borradores antiguos; no cambian transporte, tablas D1 ni esquema IndexedDB. Respuestas desconocidas/vacías no generan evidencia negativa. Ayudas, correcciones y exposición previa al mismo ítem excluyen recuperación independiente. Proyección `observations-v1` reconstruible, sin porcentaje global ni afirmación de retención/estabilidad; candidate excluido por defecto.

Pruebas de Fase 2: 36 locales (unitarias e integración IndexedDB/Worker/SQLite), 5 E2E candidate y 1 E2E de exclusión en producción; tipos, formato, builds y revisión visual móvil correctos. Incluyen navegador offline y recuperación entre dos navegadores; comandos en README. Cloudflare remoto/runtime nativo no validado aquí; validación manual de Fase 2 confirmada por Sergio; revisión editorial pendiente. Detenerse tras esta fase; no iniciar Fase 3 automáticamente.

## Consolidación UX/UI — 2026-10-08

Rama `feat/ux-learning-experience`, continuando la base validada de Fase 2. Propuesta del asesor UX aplicada: marfil/verde, tarjetas y componentes reutilizables, Home con sesiones reales, Biblioteca → ficha `/concept?id=…` → inicio directo de práctica, feedback ✓/✕ (neutral cuando no se puede valorar), resumen con anillo de actividades y resultados, progreso con barras por habilidad, distribución de conceptos practicados y actividad reciente. Sin porcentaje global de dominio, fortalezas inferidas ni calendario ficticio de repaso.

Política de interfaz en `src/ui/language.ts`: target language para navegación, acciones y consignas sencillas; support language para teoría, explicaciones y ayuda compleja, con atributos `lang`. Motor sin idiomas fijados. Teoría candidate limitada a las formas ya disponibles de C03-01/C04-01; no amplía currículo ni familias. Fichas con reglas, formas, ejemplos, errores y enlace de preparación; progreso desplegable.

Lectura de ficha registra `theory-exposure` versionado, sin generar logro. Lectura previa a iniciar no marca automáticamente las respuestas como asistidas. Consulta dentro de sesión se guarda antes de mostrar teoría; `theoryVersion` opcional en estado/intento conserva ayuda al recargar, reintentar y avanzar durante esa sesión. Consultar la ficha por otra ruta durante una sesión activa también se detecta al responder mediante `exposureId`. Se preservan hechos anteriores, referencias, CAS y outbox; sin migración de IndexedDB/D1. Exposiciones de otro dispositivo que lleguen después de una respuesta no reclasifican retroactivamente esa evidencia en esta fase.

Validación: 38 pruebas locales; 6 E2E candidate (incluyen offline, dos dispositivos y teoría asistida), E2E de exclusión en producción; tipos, formato y builds correctos. Inspección visual móvil y escritorio, ancho de 320 px y movimiento reducido comprobados. Experiencia de Fase 2.5 validada satisfactoriamente por Sergio. Pendientes: revisión editorial y ejecución remota/nativa de Cloudflare. Sin merge a main ni despliegue. Detenerse aquí; no comenzar la siguiente fase.

## Ampliación del Exercise Engine — 2026-10-08

Rama `feat/exercise-engine-evaluation`, continuación de la experiencia 2.5 validada; sin merge a main. Siete formatos nuevos respaldados por taxonomía: ordering/matching (F7), transformación/reparación (F3), detección (F1), traducción dirigida/producción controlada (F4). Reutiliza las sesiones focales, instantáneas, IndexedDB/outbox y Worker. Contrato mantiene una oportunidad y Concept por actividad; añade habilidad (reconocimiento, recuperación, transformación, discriminación, producción controlada), contexto, facetas y apoyo de opciones visibles. Respuesta estructurada serializada conserva índices de opciones; matching valora el conjunto una sola vez, no cada pareja como evidencia independiente.

`canonical-match-v2` y `observations-v2`: `correct` solo por variante aceptada; `typo` incorrecto por variantes sospechadas explícitas, sin distancia de edición/autocorrección; `linguistic-error` por rechazo conocido/alcance cerrado; `not-evaluable` fuera del criterio; vacío sin oportunidad. `noe → noi` es typo, `voi` es error lingüístico. Original, aceptadas, patrón de typo, ayudas y reintentos persistidos; typo tiene contador separado y no incrementa aciertos ni errores conceptuales. Habilidades se proyectan separadamente sin porcentaje global. Históricos `verifiable-error`/política v1 siguen siendo legibles; no se recalifican hechos anteriores.

Ocho fixtures nuevos candidate (incluyen detección de frase correcta), dentro del subalcance existente, más el caso de errata. Catálogo técnico: 3 actividades C03-01 y 11 C04-01; no representa cobertura A1. UI italiana con apoyo español, chips con deshacer/teclado para ordenar, selectores para matching, ✓/✕ y feedback “Quasi!”; borradores y feedback reanudables. Candidate continúa excluido en build normal; nada reviewed/published.

Validación: 52 pruebas locales (incluyen persistencia, reconstrucción y transporte Worker/SQLite de nuevos formatos/typo), tipos y builds; 8 E2E candidate y 1 de exclusión en producción; formato y capturas móviles. Validación manual de Fase 3A confirmada por Sergio al autorizar Fase 3B; revisión editorial pendiente. Cloudflare remoto/nativo no validado en este bloque. Sin Reading/Writing completos, scheduler nuevo ni carga de todo A1. Fase 3A validada; Fase 3B autorizada explícitamente para Content & Curriculum Engine.

## Fase 3B — Content & Curriculum Engine (2026-10-08)

Rama `feat/content-curriculum-engine`, desde `5257ee2`, estado de Fase 3A validado manualmente. `LanguagePack` agrupa currículo/niveles/unidades, Concepts existentes, grafo navegable, Theory estructurada, vocabulario y templates. Se reutiliza ContentRepository; Learning/Evidence/Review/Exercise no importan italiano. El manifiesto esperado contiene 34 bloques/99 IDs, sin crear contenido para los huecos. Muestra candidate: C03-01/C04-01 parciales, dos fichas, cuatro entradas léxicas y las 14 actividades anteriores. Una actividad se instancia mediante template y forma canónica versionada; conserva ID/versión para reconocer exposición previa.

Carga validada con referencias/versiones/ciclos, compatibilidad, respuestas, provenance y pipeline candidate→reviewed→published con revisión de versión y dependencias. Producción excluye candidate/reviewed. La evidencia nueva conserva trace, versión de actividad y provenance contrastadas con la instantánea; históricos legibles, sin migraciones de almacenamiento. No hay publicación lingüística ni otro idioma implementado.

`npm run content:coverage` (añadir `-- --json` para datos) informa los 99 conceptos esperados, familias/habilidades, Theory, vocabulario, alcance y huecos: **2 presentes, 0 listos para producción**. Presencia no acredita cobertura completa. Detalle de contratos, límites editoriales y tooling: [CONTENT_ENGINE](../architecture/CONTENT_ENGINE.md).

UX: navegación principal y transición a práctica/resumen comienzan arriba; envío y cambio de actividad cierran la teoría visual, conservando ayudas registradas y la política pedagógica previa. Sin rediseño. Validación: 74 pruebas locales, 9 E2E candidate y 1 E2E de exclusión en producción; regresiones de teoría/scroll repetidas tras integrar la UI; tipos, formato, builds y diff correctos, ficha móvil inspeccionada. Worker/SQLite e IndexedDB probados, runtime nativo/remoto de Cloudflare no validado en este entorno. Commits separados para UX, motor/contenido y documentación; rama sin cambios pendientes al cierre. Fase 3B validada manualmente por Sergio; primer lote curricular C01–C05 autorizado explícitamente. Sin merge/push/despliegue.

## Primer lote curricular — C01–C05

Rama `feat/italian-a1-c01-c05`, desde `c703c4a` (3B validada). Pack activo `it-A1-candidate-4` en `src/content/italian-a1/course.ts`; los fixtures anteriores se conservan para regresiones. Sin nuevo motor, dependencias ni rediseño. Lote secuencial: C01 (3 Concepts), C02 (3), C03 (2), C04 (5), C05 (4). **17 Concepts con Theory, reglas/ejemplos, vocabulario y práctica focal; 15 nuevos y 2 ampliados.** 138 actividades (124 nuevas), 74 entradas léxicas (70 nuevas), dos templates explícitos con nueve variantes de formas canónicas. Grafo con preparación recomendada, relaciones, contrastes y refuerzos. Las fuentes lingüísticas de contraste se registran en provenance; no acreditan revisión editorial de los ejemplos originales.

Baseline/resultado preservados en [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md): 2→17 presentes de 99, 0→0 ready. Todos candidate; `coverage=complete` describe el objetivo focal escrito del lote, no publicación ni cumplimiento completo de CC1–CC10. C06–C34: 82 ausentes. Sin Reading/Writing extensos ni Review avanzado. C03-01/C04-01 pasan a versión 2 por ampliación de alcance; las sesiones anteriores siguen reanudables y sus hechos no se modifican. La evidencia de versión 1 no se atribuye automáticamente al alcance ampliado de versión 2.

La UI usa el pack activo. Se sustituyen las marcas fijas de los dos fixtures en Biblioteca y se distingue «Confronta» de «Prima» en enlaces de conceptos. Diseño conservado. Validación: 97 pruebas locales, 14 E2E candidate y 1 E2E de exclusión en producción; tipos, formato, builds, coverage sin errores y diff correctos. Incluye respuestas aceptadas, facetas, templates y sesiones de los 17 Concepts con ayudas/reintentos/Evidence, reanudación histórica y regresiones offline/sync. Ficha móvil a 320 px inspeccionada; contraste del grafo vuelto a comprobar tras corregir su etiqueta. Pendientes validación manual del lote y revisión editorial independiente; runtime nativo/remoto Cloudflare no verificado aquí. Detenerse tras este lote. Recomendación posterior: C06–C10, sin iniciarlo automáticamente; V1 sigue siendo C01–C34 completos.

## Segundo lote curricular — C06–C10 (2026-10-09)

C01–C05 validados por Sergio al autorizar este bloque. Rama `feat/italian-a1-c06-c10`, desde `9e2c0f9`; pack activo `it-A1-candidate-5`. Añadidos los **12 Concepts previstos** (3/2/2/3/2), 12 Theory, 87 actividades explícitas y 22 entradas léxicas; 25 entradas anteriores reutilizadas. Coverage: **17→29/99 Concepts, 17→29 Theory, 138→225 actividades, 74→96 entradas; 0 ready**. Baseline y desglose en [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md). C11–C34: **70 ausentes**, sin modificar el manifiesto ni implementar C11.

Mantiene `Lesson → materialize`, cinco archivos de lote, extensiones léxicas versionadas y 28 relaciones nuevas sin hard locks. Ocho formatos, familias F1/F2/F3/F4/F7 y cinco habilidades; no se fuerza producción de frases para evaluar género léxico. Artículos separan elección de forma y referencia discursiva. Nuevas actividades explícitas; se conservan 2 templates/9 variantes. C01–C05 sin cambios en Theory/enunciados; solo asociaciones, cinco plurales léxicos necesarios y metadatos del pack. No cambia UX, motor, infraestructura ni almacenamiento.

Validación: 112 pruebas locales; tipos, formato y builds; 16 E2E candidate y 1 E2E de exclusión de producción, con regresiones de C01–C05, offline/sync y ficha a 320 px. Todo candidate, sin reviewed/published. Pendientes validación manual del lote y revisión editorial; Cloudflare nativo/remoto no comprobado en este entorno. Sin merge, push ni despliegue. Siguiente lote recomendado **C11–C15**, solo tras autorización; detenerse tras C06–C10. V1 sigue siendo C01–C34 y los 99 conceptos.

## Tercer lote curricular — C11–C17 (2026-10-09)

C01–C10 confirmados por Sergio al autorizar este bloque. Rama `feat/italian-a1-c11-c17`, desde `d970489`; pack activo `it-A1-candidate-6`. Añadidos **22 Concepts** (2/1/3/2/3/8/3), 22 Theory, 206 actividades explícitas y 76 entradas léxicas; 38 entradas anteriores reutilizadas. Coverage: **29→51/99 Concepts, 29→51 Theory, 225→431 actividades, 96→172 entradas; 0 ready**. Baseline, distribución y límites en [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md). Quedan **48 Concepts ausentes en C18–C34**; no se modifica el inventario de V1.

Mantiene Lesson→materialize, sin nuevos templates: 2 templates/9 variantes previos. Añade 55 relaciones recomendadas/relacionadas/de contraste/refuerzo (33 hacia C01–C10), sin hard locks. Recuperación, transformación y producción controlada acompañan al reconocimiento; formas verbales y numerales tienen Theory previa. Un grupo nominal o modal integrado atribuye la oportunidad únicamente al concepto objetivo. C01–C10 conservan teoría, enunciados y criterios; cambian asociaciones léxicas y metadatos de pack. Sin cambios de UI, evaluación, mastery/review, persistencia ni despliegue.

Validación: **139 pruebas locales**; la batería completa de 137 pasó y se repitieron las 65 curriculares afectadas tras añadir dos comprobaciones de atribución/repair. Typecheck, formato, builds, coverage, diff, **18 E2E candidate y 1 de exclusión de producción**, con regresiones offline/sync y ficha C17 a 320 px inspeccionada. Todo candidate, sin reviewed/published. Pendientes validación manual del usuario y revisión editorial independiente; Cloudflare nativo/remoto no ejecutado. Sin merge, push ni despliegue. Detenerse tras C17; siguiente lote recomendado **C18–C22**, solo con autorización. V1 sigue siendo C01–C34 y sus 99 conceptos.

## Cuarto lote curricular — C18–C25 (2026-10-09)

C01–C17 validados por Sergio al autorizar este lote. Rama `feat/italian-a1-c18-c25`, desde `94c920b`; pack `it-A1-candidate-7`. Añadidos **22 Concepts** (2/2/6/2/4/2/2/2), 22 Theory y 182 actividades explícitas. Coverage: **51→73/99 Concepts, 51→73 Theory, 431→613 actividades, 172→234 entradas; 0 ready**. Se añaden 62 entradas (19 días/meses) y se reutilizan 65 anteriores: ≈51 % de entradas distintas vinculadas, no de tokens. Baseline, desglose y lista léxica en [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md).

Mantiene Lesson→materialize y 2 templates/9 variantes; sin nuevos templates ni generación runtime. Nuevas actividades F1/F2/F3/F4, con 149/182 de recuperación/transformación/producción; F7 previo conservado. Añade 46 relaciones (31 con C01–C17), total 150; preparación recomendada sin hard locks. La cita evalúa coherencia entre disponibilidad, fecha y hora con una sola oportunidad objetivo. Las 51 Theory y enunciados/criterios previos permanecen intactos; solo metadata del pack, asociaciones y ampliación versionada de glosas/usos de di/a/in/con/loro. Sin cambios de UI, motor, evaluación, persistencia, Review/Mastery ni dependencias.

Validación: **194 pruebas locales**, typecheck, formato, builds normal/candidate, coverage y diff; **19 E2E candidate y 1 de exclusión de producción**, con regresiones offline/sync y cita incompatible, ficha C22-04 a 320 px. Corregida falta inicial de variedad contextual de C23-02; batería completa repetida. Tras aclarar notas didácticas pasaron de nuevo 112 pruebas curriculares, build candidate y E2E de citas. Aviso de build: chunk minificado >500 kB, sin refactor fuera de alcance. Todo candidate; revisión editorial y validación humana pendientes. Cloudflare nativo/remoto no ejecutado; sin merge, push ni despliegue. **Detenerse en C25: quedan 26 Concepts C26–C34; C26 no iniciado.** Próximo lote sugerido C26–C30, solo tras autorización. V1 sigue siendo los 99 conceptos de C01–C34.

## Cierre de carga curricular — C26–C34 (2026-10-12)

Lote autorizado para intentar los 26 conceptos restantes, sin subagentes ni auditoría global. Rama `feat/italian-a1-c26-c34`, desde `1e4afa3`; pack `it-A1-candidate-8`. **C26–C34 implementados íntegros: 73→99/99 conceptos, 73→99 Theory, 613→849 actividades, 234→316 entradas, 150→207 relaciones; 0 ready**. Fuente y granularidad coinciden: 2/3/2/4/2/2/3/1/7. Sin bloques parciales, Theory/práctica ausentes ni referencias rotas. Baseline, detalle y vocabulario en [A1_COVERAGE_MATRIX](../product/A1_COVERAGE_MATRIX.md).

Añade 82 entradas y reutiliza 87 anteriores (≈51,5 % de entradas distintas vinculadas, no tokens). 236 actividades explícitas; 229 de recuperación/transformación/producción. Conserva Lesson→materialize y 2 templates/9 variantes. Repertorios de C34 explícitos y limitados; comprensión del imperativo, forma de participio, construcción del pasado, auxiliar, uso temporal y concordancia permanecen como objetivos separados. Evidence solo del objetivo, sin penalizar conocimientos incidentales. 73 Theory y 613 actividades previas intactas salvo metadata de pack; 234 entradas previas conservan glosas/formas/versiones y amplían asociaciones.

Validación: **252 pruebas locales**; tras precisar metadatos y habilidad receptiva, **137 pruebas afectadas repetidas**. Tipos, formato, builds y coverage correctos. **21 E2E candidate + 1 exclusión de producción**, con regresiones offline/sync y fichas C33-01/C34-07 inspeccionadas a 320 px. [Hallazgos](../product/A1_COVERAGE_FINDINGS.md): reservas de 6–7 actividades en 21 conceptos anteriores, C03-02 sin retrieval explícita, repetición previa de enunciado C09/C10, límites de producción guiada y reserva diferida. Sin Theory vacías, vocabulario huérfano ni actividades sin trace/versionado. Aviso de bundle ≈667 kB, deuda posterior; Cloudflare nativo/remoto no ejecutado.

**Todo candidate. 99/99 = currículo focal implementado, no aprobado editorialmente ni V1 íntegra entregada.** Validación humana y editorial pendientes; no se inicia Reading/Writing completo, Review avanzado, revisión editorial ni publicación. Sin cambios de UI, evaluación, persistencia o dependencias. Sin merge, push ni despliegue. **Detenerse tras esta entrega.** Próxima fase recomendada: validación humana y revisión pedagógica/editorial acotada, con nueva autorización.

## Auditoría pedagógica de cobertura — 2026-10-13

Fase autorizada de auditoría/corrección, no ampliación ni editorial final. Rama `feat/a1-pedagogical-audit`, baseline `c3f9019`; pack `it-A1-candidate-9`. **99/99 Concepts, 99 Theory, 316 entradas, 865 actividades, 210 relaciones; todo candidate, 0 ready/publicado.** No confundir recorrido focal implementado con A1 pedagógicamente validado.

Revisados progresión, los 99 objetivos/Theory/práctica, las 316 entradas y las 207 relaciones iniciales; inspección lingüística distribuida, no editorial exhaustiva. De los 21 con 6–7 actividades: 18 suficientes para práctica focal, C01-03/C11-02 mejorables y C03-02 insuficiente en recuperación contextual. Se añaden 16 actividades únicamente en C01-03, C03-02, C13-01, C22-01 y C32-02; 38 modificadas, ninguna eliminada. Se corrigen duplicado C09/C10, redundancia de fixtures de essere, respuesta suministrada, nueve listas de variantes y 20 etiquetas de habilidad. Reconocimiento/recuperación/discriminación/transformación/producción: 90/392/58/139/170 → 107/381/67/139/171; parte del cambio es corrección de metadata, no dificultad nueva.

Cuatro enlaces mal dirigidos corregidos y tres prerequisites recomendados añadidos, sin ciclos/hard locks. Cuatro glosas completan sentidos ya exigidos (caro, italiano, spagnolo, avere); Theory C29-02 prepara caro como precio. Ítems/criterios modificados versionados; fixtures históricos y snapshots preservados. `npm run content:pedagogy` (+ `-- --json`) ofrece señales explicables por Concept y vocabulario, sin score. [Auditoría y juicio por los 99](../product/A1_PEDAGOGICAL_AUDIT.md); [baseline conservado](../product/A1_PEDAGOGY_BASELINE.json).

Validación: 259 pruebas locales, tipos/formato, builds, coverage y 21 E2E candidate + 1 producción correctos; diff revisado. Continúa aviso bundle ≈675 kB, sin optimización. Sin cambios de motor/evaluación/Evidence/infraestructura/UX ni dependencias. No Cloudflare remoto/nativo, publicación, merge a main ni despliegue.

Pendiente 5B: naturalidad/paráfrasis, retirada de apoyos (C11-02 y producción con piezas), reserva diferida, ritmo de C16 y transversalidad de C34; revisión humana/editorial independiente. Hay práctica escrita de las funciones previstas, no prueba de autonomía, retención ni habilidades orales. **Detenerse tras esta fase; no iniciar 5B, Reading/Writing completos ni Review avanzado automáticamente.**

## Piloto editorial 5B.1 — C01–C10 (2026-10-13)

Rama `feat/editorial-review-c01-c10`, baseline `e902653`, pack `it-A1-editorial-1`. Revisión integral de 29 Concepts/Theory, todas las 227 actividades, 96 entradas léxicas, 2 templates/9 variantes y 115 relaciones incidentes. **29 Concepts reviewed, 0 candidate en el piloto; C11–C34 conserva 70 candidate. 0 published y 0 ready.** Reviewed es autorrevisión editorial asistida explícitamente autorizada, no aprobación humana independiente ni publicación.

Correcciones: 6 Theory, 42 actividades, 15 listas accepted y 2 entradas léxicas. Consignas acotadas por registro/formato, variantes equivalentes, errores de mezcla de lenguas, generalizaciones de género/plural/semiconsonantes y ejemplos poco contextualizados. Alcance curricular, evaluator/typos y grafo conservados. No se reaudita C11–C34.

Recibos por Concept con inventario/versiones, motivo, fecha, revisor, provenance, flags y huella del contenido/relaciones. Reutilizan reviewContent; recibos obsoletos fallan explícitamente. `npm run content:editorial` (+ `-- --json`) informa sin score. Reviewed queda habilitado en desarrollo y proyecciones de validación; producción sigue excluyendo candidate/reviewed. Sesiones históricas intactas. [Reporte editorial](../product/A1_EDITORIAL_REVIEW_C01_C10.md) e [inventario de cambios](../product/A1_EDITORIAL_CHANGES_C01_C10.json).

268 pruebas locales, tipos/formato, ambos builds, coverage/pedagogy/editorial, 21 E2E de validación + 1 E2E de exclusión en producción correctos. Revisión del diff y comparación con baseline confirman conservación de C11–C34 (salvo sello global de pack), 220 entradas fuera del piloto y las 210 relaciones. Aviso bundle >500 kB conservado; sin Cloudflare remoto/nativo, dependencias nuevas ni despliegue.

0 flags lingüísticos bloqueantes conocidos. Pendiente validación humana del proceso y revisión independiente antes de publicar. No son revisión con alumnos ni eficacia demostrada. **Detenerse tras 5B.1: no C11–C34 editorial, publicación, merge ni push.**

## Reglas y mantenimiento

Hablar español; implementar solo el bloque autorizado y detenerse al entregarlo. No merge a main ni gasto sin autorización explícita. No sobrescribir trabajo ni ocultar fallos. No presentar propuesta/publicación como funcionalidad probada. Mantener trazabilidad del A1, canon, ayudas y versiones. Modificar reglas globales únicamente dentro de una autorización explícita de Sergio.

Actualizar solo apartados afectados de este resumen al cambiar una decisión o cerrar una fase; eliminar estados transitorios resueltos. Mantenerlo compacto, sin copiar matrices, transcripciones, logs, secretos ni banco de ejemplos. Si fuente y resumen discrepan, resolver la sección concreta antes de actuar.

Detalle: instrucciones globales R2 aplicables; [DECISIONS](../DECISIONS.md). El resumen no amplía permisos ni reemplaza instrucciones superiores.
