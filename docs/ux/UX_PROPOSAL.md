# Propuesta UX mobile-first

Estado: recomendación de UX/UI integrada por R2; pendiente de validación humana. Base: Research 01 §3–6, 03 §4–6, 04 §2–7 y 05 §4–6. No hay pantallas implementadas ni pruebas de usabilidad realizadas.

## Arquitectura de información

| Destino principal | Propósito |
|---|---|
| Inicio | Retomar y elegir una siguiente acción útil. |
| Practicar | Elegir un concepto, práctica mixta o repaso; misma experiencia de sesión. |
| Biblioteca | Teoría por concepto/intención; lecturas y escritura guiada publicadas. |
| Progreso | Evidencia por concepto y habilidad, patrones observados, última comprobación. |

Barra inferior de cuatro destinos en móvil; organización equivalente en escritorio. Ajustes, respaldo y selección de idioma de interfaz son secundarios; el MVP solo ofrece italiano como objetivo y español como explicación. No presentar un grafo técnico ni pantallas vacías de futuros idiomas.

## Home

Jerarquía propuesta:

1. «Italiano · Primeros pasos hacia A1».
2. Si existe sesión: «Continuar — Presentarnos», como acción principal.
3. Si no: «Practicar ahora», con una sola recomendación explicada, por ejemplo «Comprobar essere con ejemplos nuevos».
4. Accesos secundarios: Repasar, Elegir concepto, Leer, Escribir.
5. Un siguiente objetivo sugerido con motivo, sin competir con la acción primaria.

Primer uso: breve explicación de propósito y propuesta «Presentarme». Intento inicial opcional, con salida «Estoy empezando» hacia ejemplos. Sin formulario de nivel extenso. Sin repasos pendientes: estado neutral y alternativas; sin contenido accesible para mezcla: practicar un objetivo primero.

5/10/15 minutos son opciones orientativas H. No hay cuenta atrás ni penalización por tardar. La interfaz ofrece terminar en un punto útil, aunque el tiempo real varíe.

## Sesión común

Consigna breve → respuesta → Comprobar → feedback → Siguiente. No avanzar automáticamente; mantener ayuda y «Terminar por ahora» accesibles. Instrucciones separadas del texto italiano, una demanda principal por pantalla. Con teclado abierto, mantener visible respuesta y acción, permitir recuperar consigna/texto sin perder borrador.

Focus muestra el objetivo. Mixed usa encabezado neutral para no revelar qué verbo elegir. Review comienza con intento antes de explicación. Las diferencias están en intención y selección, no en tres patrones de interacción distintos.

Feedback focal inicial breve con ampliación opcional. Para un error verificable: fragmento, explicación, concepto y «Intentar de nuevo / Ver explicación / Practicar este concepto». Si el alumno abre una práctica desde el error, guardar la sesión original y volver a su punto al terminar; evitar cadenas anidadas de sesiones. El reintento conserva la huella de las ayudas.

Cierre: qué se practicó, qué se observó sin ayuda y qué se comprobará después. Un resumen parcial es válido; no confundir omisiones o abandono con desconocimiento.

## Flujos específicos

### Focus

Practicar → buscar «essere» → elegir alcance «formas del presente» o «identidad, origen y ubicación» → tiempo orientativo → comprobación → apoyo cuando haga falta → variación y frase contextual → cierre y revisión futura. Un resumen del grupo muestra lagunas por objetivo, sin «essere dominado».

### Mixed

Practicar → Mezclar lo conocido → ver propósito general → tareas con selección real y variedad → feedback identifica conceptos después de responder → resumen por dimensiones. No mostrar nombres de conceptos en pistas involuntarias antes del intento.

### Review

Inicio/Practicar → conceptos recomendados y motivo → comenzar → recuperación nueva → reparación cuando proceda → próxima comprobación orientativa. Tras ausencia: «Retomemos con una sesión breve», sin deuda ni vergüenza.

### Theory y detalle

Biblioteca → concepto o intención → para qué sirve → regla mínima y ejemplos → Practicar. Desde actividad, volver conserva el borrador; consultar teoría objetivo cuenta como ayuda. Detalle enlaza progreso y errores pertinentes. Distinguir «aún no publicado» de «recomendamos practicar un apoyo»; no usar un candado único para ambos.

### Reading

Elegir texto por situación → propósito → lectura con glosas accesibles → comprensión global/detalles → respuesta contextual opcional. El texto sigue disponible para comprensión. Una respuesta copiada del texto no se presenta como producción independiente. Conservar posición y borrador al abrir glosas.

### Writing

«Escritura guiada» → intención y pocos datos requeridos → indicar qué se revisará → escribir frase/mensaje breve → revisión al terminar el tramo → reparación focal → enlace a práctica. No interrumpir cada palabra escrita. No reemplazar automáticamente el mensaje por un texto avanzado.

| Juicio | Mensaje y opciones |
|---|---|
| Correcto dentro del alcance | «Esta forma cumple el objetivo». Indicar qué se evaluó. |
| Error verificable | Qué, por qué y concepto; permitir reparar. |
| No evaluable | «No puedo evaluar esta respuesta con seguridad. No afectará a tu progreso». Editar, ver ejemplo o continuar. |
| Objetivo no observado | «Aquí todavía no hemos comprobado este uso». Ofrecer otra consigna. |
| Aspecto fuera de cobertura | «Este aspecto no se ha revisado». No marcar todo el texto como correcto. |

Una sugerencia de estilo nunca lleva el mismo estado que un error gramatical. «Creo que mi respuesta es válida» conserva respuesta y suspende el juicio negativo del ítem discutido mientras se revisa. En el MVP la incidencia queda guardada localmente y puede exportarse; no se anuncia envío ni revisión por un profesor conectado. Se ofrece continuar con otra tarea.

## Progreso comprensible

Mostrar primero una explicación concreta —«recuperas formas sin tabla; falta comprobarlas en mezcla»— y permitir desplegar cinco dimensiones. Cada evidencia incluye fecha y contexto suficiente, no un dashboard de puntuaciones. Se distingue «sin evidencia» de «necesita práctica». Una fecha antigua invita a comprobar; no demuestra olvido.

## Estados y accesibilidad

- Pausa, recarga y llamada: conservar envíos confirmados y borrador; reanudar sin penalización. Una solución vista sigue constando como vista.
- Respuesta vacía: pedir completar o permitir omitir, sin error lingüístico.
- Doble envío: un solo intento. Estado de guardado claro; ante fallo mantener texto y ofrecer reintentar.
- Sin conexión: contenido descargado y progreso disponibles; una actividad no descargada muestra indisponibilidad sin iniciar evaluación.
- Banco agotado: ofrecer repetir para practicar o cambiar objetivo; no etiquetar la repetición como ejemplo nuevo.
- Texto ampliable, contraste legible, foco visible, etiquetas completas y acciones cómodas para una mano.
- Feedback textual además de color, anuncios accesibles sin mover foco arbitrariamente, idioma marcado en fragmentos italianos.
- Sin tiempos límite. No depender de hover, arrastre, audio o animaciones para responder.

## Validación propuesta

Con un prototipo posterior, comprobar si el usuario encuentra un concepto, inicia práctica, entiende la ayuda, interpreta una abstención, reanuda y explica el progreso. Revisar móvil pequeño, teclado abierto, ampliación y lector de pantalla. No se asigna una tasa de éxito científica a esta navegación: son criterios de diseño pendientes de probar.
