# Registro de decisiones

Fecha: 2026-10-06. Todas las propuestas pendientes de revisión de Sergio. «Restricción confirmada» refleja el encargo, no autorización para desarrollar.

| ID | DECISION | RATIONALE | SOURCE | TRADE-OFF | STATUS |
|---|---|---|---|---|---|
| D01 | Diseñar y documentar; no implementar | La revisión del producto precede al desarrollo | Encargo §25–26 | Demora construcción hasta cerrar alcance | Restricción confirmada |
| D02 | Separar evidencia y dominio; no porcentaje global | El rendimiento inmediato no demuestra retención | Research 00, 01, 04; E-S delimitada → R de producto | Más explicación que una barra única | Principio del encargo; representación propuesta |
| D03 | Diez objetivos acotados y tres contextos | Probar ciclo verbal y nominal, atribución y mezcla | Research 02 C03–C11; decisión R2/H | Más autoría que solo essere/avere; menos cobertura que A1 | Propuesto |
| D04 | Tema navegable + concepto evaluable + facetas | Evitar un nodo por forma sin perder cobertura | Research 01 §1, 02 §4; Architecture | Requiere reglas editoriales de división | Propuesto |
| D05 | Relaciones de preparación sin bloqueo por dominio total | Práctica apoyada permite avanzar antes de perfección | Research 01/02; R | Preparación depende también de tarea | Propuesto |
| D06 | Perfil de cinco dimensiones y reglas versionadas | Conservar reconocimiento, recuperación, uso, selección y tiempo | Research 04; R; estados concretos H | Umbrales aún por calibrar | Propuesto, sin fórmula final |
| D07 | Mezcla por prioridades y variedad, sin cuotas | No hay porcentajes validados y cambia la disponibilidad | Research 01 §5, 04 §7; H de selección | Debe vigilarse que ningún objetivo quede relegado | Propuesto |
| D08 | Vencimiento de revisión separado de dominio | Antigüedad aumenta incertidumbre, no demuestra olvido | Research 04; R | Menos simplicidad que «olvidado» | Propuesto |
| D09 | Evaluación por oportunidad con abstención | Desconocido/ambiguo no equivale a incorrecto | Research 03–05; Architecture/UX | Algunas respuestas quedan sin evaluar | Propuesto |
| D10 | Escritura guiada acotada sin IA en ejecución | Permite producción y coste recurrente cero por IA | Research 03/05; decisión producto | No corrige cualquier texto libre | Pendiente de Sergio |
| D11 | Canon versionado y publicación editorial separada del origen | Generación no es autoridad lingüística | Research 05; R | Trabajo humano de revisión | Propuesto; responsable pendiente |
| D12 | Web instalable, almacenamiento local y respaldo manual | Piloto personal sin backend ni cuenta | Architecture; inferencia de alcance | Sin sincronización; almacenamiento puede borrarse | Pendiente de Sergio |
| D13 | Módulos internos, no microservicios ni base de grafos | Grafo pequeño y necesidades acotadas | Architecture; decisión técnica | Cambios mayores futuros se resolverán con evidencia | Propuesto |
| D14 | Motor independiente del pack italiano | Segundo idioma sin reconstruir sesión/evidencia | Encargo multiidioma; Architecture | Algunos evaluadores siguen siendo específicos del idioma | Propuesto |
| D15 | Inicio / Practicar / Biblioteca / Progreso | Jerarquía adulta y modos de sesión reutilizables | UX/UI; H de navegación | Lectura/escritura con accesos secundarios | Propuesto |
| D16 | 5/10/15 minutos orientativos, sin reloj evaluador | Restricción práctica de uso móvil | Research 01 §6; H | Duración real varía por tarea y ayuda | Hipótesis por validar |
| D17 | No afirmar A1 integral ni eficacia causal | No se evalúa oralidad y el piloto no valida toda la intervención | Research 00/02/06; REF y límites de evidencia | Promesa de producto más limitada | Restricción de alcance |
| D18 | No gasto ni contratación asumidos | Encargo de coste y control | Encargo §21 | Revisión externa podría requerir acuerdo aparte | Restricción confirmada |

## Trazabilidad de la síntesis

- [00 Executive Summary](research/00_Executive_Research_Summary.md): principios y límites de inferencia.
- [01 Learning Model](research/01_Learning_Model.md): ciclo, foco, mezcla y ayudas móviles.
- [04 Mastery/Review/Error](research/04_Mastery_Review_Error_Model.md): oportunidades, independencia, tiempo, patrones y calibración.
- [02 Italian Curriculum](research/02_Italian_A1_Curriculum.md): recorte C03–C11 y apoyos C01/C02/C13/C34; no A1 completo.
- [03 Exercise Taxonomy](research/03_Exercise_Taxonomy.md): cinco familias reutilizables y separación habilidad/formato; lectura y escritura.
- [05 Content Strategy](research/05_Content_Strategy.md): canon, variantes, revisión y límites de evaluación.
- [06 Sources](research/06_Sources.md): se mantienen etiquetas y límites reportados; no se presenta una nueva verificación independiente de publicaciones.

## Integración de especialistas

Architecture y UX/UI leyeron los siete documentos y asesoraron sin modificar producción. R2 adopta registro sencillo de intentos y proyecciones, abstención y navegación común de sesión. Architecture propone como corte mínimo solo recorrido verbal; R2 propone añadir una muestra nominal estrecha para validar errores relacionados y evitar un motor pensado exclusivamente para conjugación. Es un trade-off explícito de autoría, sometido a Sergio (D03), no una conclusión pedagógica del pack.

QA revisó coherencia, alcance y escenarios y confirmó el cierre de los tres hallazgos documentales; no se ejecutaron tests de software inexistente. Las observaciones y resolución se registran en [DESIGN_REVIEW](mvp/DESIGN_REVIEW.md).

## Hipótesis prioritarias

H1: el usuario comprende un perfil de evidencia sin puntuación global.
H2: el corte de diez objetivos permite suficiente variedad con autoría asumible.
H3: escritura acotada y abstención frecuente no frustran el propósito de aprender a usar el idioma.
H4: mezcla tras preparación y revisión contextual aportan mejores respuestas nuevas diferidas; no se presupone resultado.
H5: la navegación y presupuestos breves facilitan continuidad real en móvil.
H6: las reglas de evidencia y scheduler predicen necesidades suficientemente bien; se contrastan con respuestas posteriores, no con satisfacción.

## OPEN QUESTIONS FOR SERGIO

1. **Dispositivos y datos:** ¿aceptas comenzar con progreso local en un navegador y respaldo manual, o necesitas sincronización móvil/ordenador desde el MVP? Recomendación: local; sincronización cambia arquitectura y alcance.
2. **Escritura:** ¿aceptas escritura guiada con corrección del alcance revisado y abstención fuera de él? Recomendación: sí; corrección libre fiable requiere otra estrategia y posiblemente coste.
3. **Corte curricular:** ¿aprobamos los diez objetivos acotados, incluida muestra de género/plural/artículos/concordancia, o priorizamos una primera versión solo verbal? Recomendación: los diez si se puede asumir revisión editorial; la alternativa reduce autoría y retrasa validación de errores nominales relacionados.
4. **Revisión del italiano:** ¿quién puede revisar reglas, variantes y actividades antes del piloto? Recomendación: persona cualificada; si no está disponible, limitar la fase siguiente a contenido candidato y no afirmar validación lingüística. Contratar a alguien requiere autorización de coste aparte.

No se solicita elegir framework, colores ni intervalos arbitrarios. Tras responder y aprobar la propuesta se concretarán políticas iniciales verificables y contenido piloto, antes de ampliar implementación. Ninguna respuesta aislada autoriza merge a main.
