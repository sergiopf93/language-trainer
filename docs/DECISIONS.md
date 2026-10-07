# Registro de decisiones

Actualizado: 2026-10-07. Sergio ha fijado alcance A1 completo y sincronización Cloudflare. La solución concreta sigue pendiente de aprobación final para implementar. «Decidido por Sergio» no autoriza aún código ni despliegue.

| ID | DECISION | RATIONALE | SOURCE | TRADE-OFF | STATUS |
|---|---|---|---|---|---|
| D01 | Diseñar y documentar; no implementar | La revisión del producto precede al desarrollo | Encargo §25–26 | Demora construcción hasta cerrar alcance | Restricción confirmada |
| D02 | Separar evidencia y dominio; no porcentaje global | El rendimiento inmediato no demuestra retención | Research 00, 01, 04; E-S delimitada → R de producto | Más explicación que una barra única | Principio del encargo; representación propuesta |
| D03 | Todo el currículo A1 definido en Research 02, C01–C34 y sus funciones/contextos | La primera versión utilizable debe permitir estudiar el recorrido completo, incluido pasado | Corrección explícita de Sergio; Research 02 completo | Mayor autoría y QA; fases internas no reducen entrega | Decidido por Sergio; sustituye corte de diez objetivos |
| D04 | Tema navegable + concepto evaluable + facetas | Evitar un nodo por forma sin perder cobertura | Research 01 §1, 02 §4; Architecture | Requiere reglas editoriales de división | Propuesto |
| D05 | Relaciones de preparación sin bloqueo por dominio total | Práctica apoyada permite avanzar antes de perfección | Research 01/02; R | Preparación depende también de tarea | Propuesto |
| D06 | Perfil de cinco dimensiones y reglas versionadas | Conservar reconocimiento, recuperación, uso, selección y tiempo | Research 04; R; estados concretos H | Umbrales aún por calibrar | Propuesto, sin fórmula final |
| D07 | Mezcla por prioridades y variedad, sin cuotas | No hay porcentajes validados y cambia la disponibilidad | Research 01 §5, 04 §7; H de selección | Debe vigilarse que ningún objetivo quede relegado | Propuesto |
| D08 | Vencimiento de revisión separado de dominio | Antigüedad aumenta incertidumbre, no demuestra olvido | Research 04; R | Menos simplicidad que «olvidado» | Propuesto |
| D09 | Evaluación por oportunidad con abstención | Desconocido/ambiguo no equivale a incorrecto | Research 03–05; Architecture/UX | Algunas respuestas quedan sin evaluar | Propuesto |
| D10 | Writing desde completar con significado hasta mensajes autónomos A1; evaluación por alcance y abstención | Cubrir progresión completa sin fabricar correcciones | Sergio; Research 03/05 | La libertad de escribir supera lo automáticamente evaluable; ofrecer ruta focal fiable | Alcance decidido; solución propuesta |
| D11 | Canon versionado y publicación editorial separada del origen | Generación no es autoridad lingüística | Research 05; R | Trabajo humano de revisión | Propuesto; responsable pendiente |
| D12 | PWA local-first → almacenamiento local → Worker → D1; recuperación entre dispositivos | Progreso durable y offline sin depender de backup manual | Decisión explícita de Sergio; revisión healt-tracker | Requiere identidad, protocolo de sync y conflictos | Decidido por Sergio; reemplaza local-only |
| D13 | Módulos de aprendizaje internos y un Worker de sincronización, sin microservicios ni base de grafos | Catálogo completo no implica infraestructura compleja | Architecture; decisión técnica | Validar rendimiento y cuotas con historial completo | Propuesto |
| D14 | Motor independiente del pack italiano | Segundo idioma sin reconstruir sesión/evidencia | Encargo multiidioma; Architecture | Algunos evaluadores siguen siendo específicos del idioma | Propuesto |
| D15 | Inicio / Practicar / Biblioteca / Progreso | Jerarquía adulta y modos de sesión reutilizables | UX/UI; H de navegación | Lectura/escritura con accesos secundarios | Propuesto |
| D16 | 5/10/15 minutos orientativos, sin reloj evaluador | Restricción práctica de uso móvil | Research 01 §6; H | Duración real varía por tarea y ayuda | Hipótesis por validar |
| D17 | Cobertura completa del currículo A1 del pack, sin certificación oficial ni evaluación oral integral | Cobertura curricular y acreditación MCER son afirmaciones diferentes | Corrección Sergio; Research 00/02/06 | No inferir competencia oral desde tareas escritas | Alcance y límites confirmados |
| D18 | No gasto ni contratación asumidos | Encargo de coste y control | Encargo §21 | Revisión externa podría requerir acuerdo aparte | Restricción confirmada |
| D19 | Matriz A1 por Topics/Concepts y artefactos de cobertura | Evitar pérdida silenciosa de temas y contenido exclusivamente teórico | Encargo V1; Architecture | La matriz debe mantenerse durante desarrollo | Requerido por Sergio; inventario propuesto |
| D20 | Templates restringidos + lexical sets + variantes aprobadas | Hacer viable autoría de todo A1 sin sacrificar calidad | Research 05; decisión editorial R2 | Determinismo no prueba naturalidad; validar combinaciones | Propuesto |
| D21 | Siete familias F1–F7, incluida composición y asociación/ordenación | Cubrir demandas completas de Research 03 con interacción reutilizable | Research 03; Architecture/UX | Más contratos que cinco familias, sin motor por formato | Propuesto |
| D22 | Historial original sincronizado; perfiles y repasos reconstruibles | Cambios de políticas no deben destruir observaciones anteriores | Decisión Sergio; Architecture | Versiones, invalidaciones y exposición tardía requieren replay | Requerido; diseño propuesto |
| D23 | Outbox durable, IDs globales, ACK idempotente y descarga por cursor | Offline y red inestable no deben duplicar ni perder aprendizaje | Decisión Sergio; diseño Architecture/R2 | Conflictos de texto requieren conservar ramas/revisiones | Propuesto |
| D24 | Un propietario con código de recuperación y sesiones revocables por dispositivo | Recuperar mismo usuario sin sistema público multiusuario ni correo de pago | R2/Architecture; patrón de acceso privado revisado | Sergio custodia código; recuperación administrativa si se pierde | Propuesto, revisable en aprobación final |
| D25 | Reutilizar patrón local/Worker/D1 y revisión condicional de healt-tracker, no snapshot global | Historial educativo crece y necesita hechos originales | Inspección de código healt-tracker; Architecture | Cambia protocolo de transporte y almacenamiento del historial | Propuesto |
| D26 | Backup manual complementario, importación idempotente por hechos | Portabilidad sin sobrescribir historial remoto con estado antiguo | Decisión Sergio; R2 | Esquema/owner/versiones deben validarse antes de importar | Requerido; diseño propuesto |

## Trazabilidad de la síntesis

- [00 Executive Summary](research/00_Executive_Research_Summary.md): principios y límites de inferencia.
- [01 Learning Model](research/01_Learning_Model.md): ciclo, foco, mezcla y ayudas móviles.
- [04 Mastery/Review/Error](research/04_Mastery_Review_Error_Model.md): oportunidades, independencia, tiempo, patrones y calibración.
- [02 Italian Curriculum](research/02_Italian_A1_Curriculum.md): C01–C34 completos, 14 situaciones, funciones y alcance final de pasado; ninguna ampliación A1 pospuesta.
- [03 Exercise Taxonomy](research/03_Exercise_Taxonomy.md): siete familias reutilizables y separación habilidad/formato; lectura y escritura progresivas completas.
- [05 Content Strategy](research/05_Content_Strategy.md): canon, variantes, revisión y límites de evaluación.
- [06 Sources](research/06_Sources.md): se mantienen etiquetas y límites reportados; no se presenta una nueva verificación independiente de publicaciones.

## Integración de especialistas y cambio de alcance

Architecture conserva el dominio, deriva el inventario completo y revisa verbos, léxico, generación restringida y escalabilidad. Examina también el patrón real de healt-tracker para distinguir reutilización de infraestructura y cambio necesario de sincronización. UX conserva los cuatro destinos y amplía búsqueda por Topic/subalcance, catálogo completo, Reading/Writing progresivos y estados de sync.

La propuesta anterior de diez objetivos quedó sustituida por decisión explícita de Sergio; no se mantiene como alternativa de entrega. Sus unidades pueden servir de hito interno. La decisión anterior de almacenamiento exclusivamente local también queda sustituida: Cloudflare forma parte de V1. No volver a preguntar si se quiere todo A1 ni si la sincronización debe estar incluida.

QA revisó la cobertura completa, integridad de IDs y coherencia de documentos, además de escenarios de sincronización; confirmó el cierre documental de los hallazgos. [DESIGN_REVIEW](mvp/DESIGN_REVIEW.md) recoge comprobaciones realmente ejecutadas y sus límites; no se han realizado tests de aplicación inexistente.

Inventario propuesto y comprobado: **34 Topics, 99 Concepts evaluables y 14 contextos**, detallados en [A1_COVERAGE_MATRIX](product/A1_COVERAGE_MATRIX.md). Los conteos no indican contenido ya publicado ni aplicación implementada.

## Hipótesis prioritarias

H1: el usuario comprende un perfil de evidencia sin puntuación global.
H2: la estrategia de plantillas y lexical sets permite suficiente variedad en todo A1 con revisión asumible; se mide en unidades representativas sin recortar alcance automáticamente.
H3: escritura autónoma con evaluación parcial y práctica focal alternativa resulta útil; medir abstención y falsos juicios por Concept/tramo.
H4: mezcla tras preparación y revisión contextual aportan mejores respuestas nuevas diferidas; no se presupone resultado.
H5: la navegación y presupuestos breves facilitan continuidad real en móvil.
H6: las reglas de evidencia y scheduler predicen necesidades suficientemente bien; se contrastan con respuestas posteriores, no con satisfacción.

H7: uso personal, lotes e índices caben en cuotas gratuitas compartidas de Cloudflare; verificar consumo real, sin asumir contratación ni borrado de historial.

## OPEN QUESTIONS FOR SERGIO

1. **Revisión del italiano:** ¿quién revisará reglas, variantes y actividades antes de publicar? Recomendación: una persona cualificada. Mientras no se resuelva, el contenido es candidato; cualquier contratación requiere autorización aparte. Esto afecta capacidad editorial, no elimina temas de V1.
2. **Acceso entre dispositivos:** propongo un código privado de recuperación guardado en tu gestor de contraseñas, con sesión revocable por dispositivo. ¿Hay alguna necesidad de acceso con correo/proveedor que obligue a cambiar esta opción? No se necesita un sistema público multiusuario.

El resto —todo A1, sincronización Cloudflare, respaldo secundario, offline y ausencia de IA online obligatoria— está decidido. Tras tu revisión y aprobación final comenzará el desarrollo completo organizado por fases internas. No se crea infraestructura, se contrata servicio ni se hace merge a main en esta revisión.
