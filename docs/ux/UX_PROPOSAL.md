# Propuesta UX mobile-first

Estado: recomendación de UX/UI integrada por R2; pendiente de validación humana. Base: Research 01 §3–6, 03 §4–6, 04 §2–7 y 05 §4–6. No hay pantallas implementadas ni pruebas de usabilidad realizadas.

Alcance: **V1 italiano A1 completo según Research 02**, incluidos C01–C34, su vocabulario, funciones y contextos. [V1 Scope](../mvp/V1_SCOPE.md) delimita el producto y [A1 Coverage Matrix](../product/A1_COVERAGE_MATRIX.md) controla su cobertura. Las fases internas podrán validar unidades piloto, pero la entrega V1 exige todo el recorrido integrado. Topic agrupa; Concept expresa un alcance evaluable. La interfaz no supone un Concept por Cxx ni una celda verbal por Concept.

## Arquitectura de información

| Destino principal | Propósito |
|---|---|
| Inicio | Retomar y elegir una siguiente acción útil. |
| Practicar | Buscar Topics y conceptos de todo A1; elegir alcance, grupo, práctica mixta o repaso; misma experiencia de sesión. |
| Biblioteca | Referencia completa A1 por concepto/intención; lecturas y escritura a lo largo del recorrido. |
| Progreso | Evidencia por concepto y habilidad, patrones observados, última comprobación. |

Barra inferior de cuatro destinos en móvil; organización equivalente en escritorio. Cuenta y sincronización están accesibles desde ajustes, con estado breve visible cuando requiere atención; el respaldo manual es secundario. V1 ofrece italiano como objetivo y español como explicación. No presentar un grafo técnico ni pantallas vacías de futuros idiomas.

### Encontrar contenido en todo el currículo

Búsqueda compartida entre Practicar y Biblioteca, con términos italianos, nombres habituales en español e intenciones: «essere», «artículos determinados», «pasado», «passato prossimo», «plural», «pedir un café». Resultados agrupados por Topic, alcances evaluables y actividades pertinentes; cada resultado explica su propósito sin exigir conocer IDs internos. Conservar consulta, filtros y posición al volver.

Ofrecer exploración por áreas —grafía, funciones, grupo nominal, verbos, relaciones, frase/texto y vocabulario— y por situaciones cotidianas. Estas áreas son accesos a Topics, no un inventario nuevo de Concepts. Filtros opcionales de preparación, práctica pendiente y situación reducen listas grandes; «Todo el currículo» sigue visible. Un resultado sin coincidencia propone términos relacionados y exploración por área, sin afirmar que el contenido no existe por no reconocer una palabra.

Un Topic amplio abre un resumen: propósito, subalcances y «Practicar el grupo». En verbos, presentar forma/uso/tiempo y facetas de persona o regularidad cuando proceda; en artículos, selección de forma y referencia; en preposiciones, usos y construcciones. Seleccionar un grupo muestra qué alcances entrarán y qué apoyos faltan. No exigir marcar individualmente numerosas celdas de un paradigma.

### Estados independientes

| Dimensión | Qué significa y cómo se muestra |
|---|---|
| Currículo publicado | Cobertura editorial incluida en la versión del pack. Toda la cobertura A1 debe estar publicada en la entrega V1; un hueco interno bloquea esa entrega, no se convierte en «próximamente» aceptable. |
| Disponibilidad local | Contenido del pack disponible en este dispositivo. «Necesita descargarse» o un fallo de almacenamiento describe disponibilidad, no aprendizaje ni exclusión curricular. |
| Preparación | Apoyos que facilitan practicar sin ayuda. «Recomendamos repasar…» permite empezar con apoyo; no es un candado permanente. |
| Evidencia | Qué se ha observado en este usuario, con fecha, habilidad y ayudas. «Sin evidencia» no significa no publicado, no descargado ni incapacidad. |

Estas dimensiones nunca comparten un único candado o porcentaje. Abrir teoría de un concepto posterior es posible; la introducción deliberada en Focus se distingue de la mezcla automática de conocimiento accesible.

## Home

Jerarquía propuesta:

1. «Italiano A1 · Lectura y escritura».
2. Si existe sesión: «Continuar — Presentarnos», como acción principal.
3. Si no: «Practicar ahora», con una sola recomendación explicada, por ejemplo «Comprobar essere con ejemplos nuevos».
4. Accesos secundarios: Repasar, Elegir concepto, Leer, Escribir.
5. Un siguiente objetivo sugerido con motivo, sin competir con la acción primaria.

Primer uso: breve explicación de propósito y propuesta «Presentarme», junto a acceso al currículo completo. Intento inicial opcional, con salida «Estoy empezando» hacia ejemplos. Sin formulario de nivel extenso. Sin repasos pendientes: estado neutral y alternativas; sin contenido accesible para mezcla: practicar un objetivo primero. El rótulo A1 describe cobertura del pack, no certificación oficial ni evaluación de todas las competencias MCER.

5/10/15 minutos son opciones orientativas H. No hay cuenta atrás ni penalización por tardar. La interfaz ofrece terminar en un punto útil, aunque el tiempo real varíe.

## Sesión común

Consigna breve → respuesta → Comprobar → feedback → Siguiente. No avanzar automáticamente; mantener ayuda y «Terminar por ahora» accesibles. Instrucciones separadas del texto italiano, una demanda principal por pantalla. Con teclado abierto, mantener visible respuesta y acción, permitir recuperar consigna/texto sin perder borrador.

Focus muestra el objetivo. Mixed usa encabezado neutral para no revelar qué verbo elegir. Review comienza con intento antes de explicación. Las diferencias están en intención y selección, no en tres patrones de interacción distintos.

Feedback focal inicial breve con ampliación opcional. Para un error verificable: fragmento, explicación, concepto y «Intentar de nuevo / Ver explicación / Practicar este concepto». Si el alumno abre una práctica desde el error, guardar la sesión original y volver a su punto al terminar; evitar cadenas anidadas de sesiones. El reintento conserva la huella de las ayudas.

Cierre: qué se practicó, qué se observó sin ayuda y qué se comprobará después. Un resumen parcial es válido; no confundir omisiones o abandono con desconocimiento.

## Flujos específicos

### Focus

Practicar → buscar «essere» → elegir alcance «formas del presente» o «identidad, origen y ubicación» → tiempo orientativo → comprobación → apoyo cuando haga falta → variación y frase contextual → cierre y revisión futura. Un resumen del grupo muestra lagunas por objetivo, sin «essere dominado».

El mismo recorrido cubre cualquier Concept evaluable donde Focus sea pedagógicamente aplicable, incluidos artículos completos, regulares e irregulares, preposiciones, pronombres y pasado. «Practicar el grupo» muestrea alcances con un propósito y tiempo manejables, sin prometer agotar el Topic en una sesión. Permitir cambiar subalcance y continuar; explicar los apoyos antes de introducir contenido nuevo.

### Mixed

Practicar → Mezclar lo conocido → ver propósito general → tareas con selección real y variedad → feedback identifica conceptos después de responder → resumen por dimensiones. No mostrar nombres de conceptos en pistas involuntarias antes del intento.

La selección puede cruzar todas las áreas del currículo y sigue la preparación real, no un lote fijo de conceptos iniciales. Resumen previo por situación y propósito, sin revelar la respuesta del ítem. Un concepto desconocido necesario exige una introducción explícita o sustituir la actividad; nunca introducirlo silenciosamente para completar una cuota. Ajustes opcionales por área o situación no deben convertir cada sesión en una configuración compleja.

### Review

Inicio/Practicar → conceptos recomendados y motivo → comenzar → recuperación nueva → reparación cuando proceda → próxima comprobación orientativa. Tras ausencia: «Retomemos con una sesión breve», sin deuda ni vergüenza.

Review admite cualquier Concept evaluable del A1. Agrupar necesidades por objetivo o patrón relacionado y ofrecer un lote manejable, evitando una lista interminable y múltiples castigos por el mismo origen de error. El usuario puede revisar el motivo y elegir un concepto concreto. Un lote terminado no implica que todo el currículo haya sido comprobado.

### Theory y detalle

Biblioteca → concepto o intención → para qué sirve → regla mínima y ejemplos → Practicar. Desde actividad, volver conserva el borrador; consultar teoría objetivo cuenta como ayuda. Detalle enlaza progreso y errores pertinentes. Distinguir «aún no publicado» de «recomendamos practicar un apoyo»; no usar un candado único para ambos.

La referencia V1 cubre todo Research 02: explicaciones, paradigmas cuando correspondan, límites A1, excepciones relevantes, errores frecuentes, relaciones y acceso a práctica. Detalles ampliables evitan una página inicial abrumadora. En vocabulario, distinguir palabras objetivo de glosas de apoyo; mostrar género, usos y combinaciones pertinentes. Una página teórica sola no satisface la integración curricular: debe enlazar actividades y evidencia apropiadas. El estado «aún no publicado» puede aparecer en revisión interna, pero no justificar huecos A1 en la entrega final.

### Reading

Elegir texto por situación → propósito → lectura con glosas accesibles → comprensión global/detalles → respuesta contextual opcional. El texto sigue disponible para comprensión. Una respuesta copiada del texto no se presenta como producción independiente. Conservar posición y borrador al abrir glosas.

La biblioteca permite filtrar por situación y apoyos, mostrando dificultad y objetivo en lenguaje cotidiano. La matriz editorial, vinculada a la matriz A1, distribuye lecturas por tramo y cubre formas textuales, funciones, conceptos, vocabulario objetivo/de apoyo, tareas de comprensión y oportunidades posteriores de producción. La suficiencia depende de esa cobertura y de variantes nuevas para revisión, no de una cuota arbitraria de textos.

| Progresión orientativa | Formatos y demandas |
|---|---|
| Entrada | Avisos, perfiles, menús y mensajes: identificar personas, objetos, precios y datos explícitos. |
| Desarrollo | Diálogos, anuncios de vivienda, horarios, peticiones y descripciones: relacionar referencias, ubicación, cantidad, gustos y rutinas. |
| Integración | Mensajes y relatos breves cotidianos: integrar relaciones, conectores, referencias y hechos pasados dentro del alcance enseñado. |

Regular léxico, sintaxis, densidad, referentes y apoyo además de longitud. Los contextos de Research 02 se distribuyen en la matriz; esta tabla no los reduce a tres lecturas ni prescribe un orden rígido. El lector puede explorar todo el banco y elegir material con apoyos explicados.

### Writing

«Escribir» → intención y grado de apoyo → indicar qué se podrá revisar → escribir → revisión al terminar el tramo → reparación focal → enlace a práctica. No interrumpir cada palabra escrita. No reemplazar automáticamente el mensaje por un texto avanzado.

El banco cubre completar con significado, construir frases con apoyo, frases propias, varias frases relacionadas, mensajes guiados y mensajes más autónomos del nivel, incluidos hechos pasados. «Guiada» describe una modalidad, no un límite de toda Writing. Mostrar destinatario, propósito y requisitos comprensibles; ejemplos completos opcionales se identifican como ayuda. La matriz editorial controla variedad de funciones, contextos, conceptos y apoyos, sin limitarse a escenarios iniciales ni exigir longitud por sí misma.

La ejecución normal utiliza contenido revisado y evaluación determinista local; no depende de IA online. En mensajes autónomos, declarar límites antes de enviar: «Revisaremos solo los aspectos que podamos comprobar con seguridad». Puede existir evaluación parcial: un aspecto verificable recibe feedback y evidencia dentro de su alcance; el resto queda sin evaluar. Una coincidencia de palabras aislada no verifica intención, gramática global ni los demás conceptos. Si no se puede atribuir una oportunidad con seguridad, tampoco se acredita ni penaliza. La práctica autónoma permanece disponible aunque el juicio global requiera abstención.

| Juicio | Mensaje y opciones |
|---|---|
| Correcto dentro del alcance | «Esta forma cumple el objetivo». Indicar qué se evaluó. |
| Error verificable | Qué, por qué y concepto; permitir reparar. |
| No evaluable | «No puedo evaluar esta respuesta con seguridad. No afectará a tu progreso». Editar, ver ejemplo o continuar. |
| Objetivo no observado | «Aquí todavía no hemos comprobado este uso». Ofrecer otra consigna. |
| Aspecto fuera de cobertura | «Este aspecto no se ha revisado». No marcar todo el texto como correcto. |

Una sugerencia de estilo nunca lleva el mismo estado que un error gramatical. «Creo que mi respuesta es válida» conserva respuesta y suspende el juicio negativo del ítem discutido mientras se revisa. En V1 la incidencia se conserva como parte del historial del usuario, puede sincronizarse y exportarse; sincronizarla no abre un canal de soporte ni promete revisión por un profesor. Se ofrece continuar con otra tarea. «Sin evaluar» no debe convertirse en error, acierto global ni instrucción para reformular hasta coincidir con una cadena aceptada. Ver un ejemplo permite aprender, pero su copia no aporta recuperación independiente.

## Progreso comprensible

Mostrar primero una explicación concreta —«recuperas formas sin tabla; falta comprobarlas en mezcla»— y permitir desplegar cinco dimensiones. Cada evidencia incluye fecha y contexto suficiente, no un dashboard de puntuaciones. Se distingue «sin evidencia» de «necesita práctica». Una fecha antigua invita a comprobar; no demuestra olvido.

Agrupar por Topic con acceso a subalcances y facetas, manteniendo búsqueda y filtros. El resumen de un Topic no promedia sus Concepts en un porcentaje ni atribuye evidencia de una persona verbal a todo el paradigma. Separar cobertura editorial completa del pack de progreso personal: tener disponible todo A1 no significa haberlo estudiado. Permitir revisar qué capacidades faltan por observar sin llenar Inicio de indicadores.

## Continuidad entre dispositivos

V1 mantiene el estudio local y sin conexión, y sincroniza el historial del mismo usuario entre dispositivos mediante el servicio previsto en Cloudflare Worker/D1. La interfaz habla de cuenta, guardado y sincronización; no expone detalles de infraestructura. La propuesta de Architecture usa un único propietario, un código privado de recuperación y sesiones revocables por dispositivo. El código se introduce para vincular el dispositivo y no aparece en progreso ni backups.

| Estado | Mensaje y comportamiento |
|---|---|
| Pendiente | «Guardado en este dispositivo · Pendiente de sincronizar». Se puede seguir estudiando con contenido local; no afirmar que otro dispositivo ya lo recibe. |
| Sincronizado | «Sincronizado» con última confirmación consultable. Solo mostrarlo después de confirmación del servicio. |
| Error | «Tu trabajo sigue guardado aquí. No se ha podido sincronizar». Conservar cambios y ofrecer reintentar y detalle útil. Un fallo de guardado local tiene mensaje distinto y conserva el texto en pantalla. |
| Sesión de acceso vencida | «Vuelve a identificarte para sincronizar». Conservar historial y borradores locales; no confundirlo con sesión de estudio terminada o progreso perdido. |

En un dispositivo nuevo: identificarse como el mismo usuario → recuperar historial sincronizado → mostrar qué se ha recuperado → disponer del contenido necesario → continuar. Durante la recuperación no mostrar el historial vacío como un reinicio real ni generar conclusiones de «sin aprendizaje». Si hay cambios aún pendientes en el dispositivo anterior, explicar que todavía no están disponibles aquí. El respaldo manual y su restauración complementan este flujo; no son el mecanismo habitual para cambiar de dispositivo.

La reconexión no interrumpe una respuesta en curso. Al recuperar una sesión de estudio, conservar consigna, intento, ayudas ya vistas y borrador. Si existen versiones concurrentes de un borrador, preservar ambas con contexto y fecha, permitir elegir o copiar texto y evitar sobrescribir silenciosamente. Un borrador alternativo no se envía ni evalúa automáticamente. Cuando hay sesiones distintas abiertas, ofrecer cuál continuar sin descartar la otra; una sesión ya completada en otro dispositivo conserva el texto pendiente como borrador recuperable, sin crear un nuevo intento por sincronizar.

Una pérdida de red, expiración de acceso o revocación no borra historial local ni simula un borrado remoto. Suspender sincronización cuando no hay autorización y explicar cómo recuperar acceso, sin modificar evidencia pedagógica. V1 no ofrece cambio de usuario: una identidad inesperada detiene la vinculación sin mezclar ni subir el historial local. La reautenticación corresponde al mismo propietario. La revocación suspende acceso remoto, pero no promete borrar o bloquear copias offline; bloqueo/borrado local es una acción aparte.

## Estados y accesibilidad

- Pausa, recarga y llamada: conservar envíos confirmados y borrador; reanudar sin penalización. Una solución vista sigue constando como vista.
- Respuesta vacía: pedir completar o permitir omitir, sin error lingüístico.
- Doble envío: un solo intento. Estado de guardado claro; ante fallo mantener texto y ofrecer reintentar.
- Sin conexión: contenido descargado y progreso local disponibles, cambios pendientes de sincronizar; una actividad no descargada muestra indisponibilidad sin iniciar evaluación.
- Banco agotado: ofrecer repetir para practicar o cambiar objetivo; no etiquetar la repetición como ejemplo nuevo.
- Texto ampliable, contraste legible, foco visible, etiquetas completas y acciones cómodas para una mano.
- Feedback textual además de color, anuncios accesibles sin mover foco arbitrariamente, idioma marcado en fragmentos italianos.
- Sin tiempos límite. No depender de hover, arrastre, audio o animaciones para responder.

## Validación propuesta

Con un prototipo posterior, comprobar si el usuario encuentra un concepto, inicia práctica, entiende la ayuda, interpreta una abstención, reanuda y explica el progreso. Revisar móvil pequeño, teclado abierto, ampliación y lector de pantalla. No se asigna una tasa de éxito científica a esta navegación: son criterios de diseño pendientes de probar.

Añadir tareas con el currículo completo: buscar artículos determinados y seleccionar subalcance/grupo; localizar passato prossimo y sus apoyos; volver desde error de preposición; distinguir contenido disponible de preparación; iniciar Mixed entre áreas; retomar Review tras ausencia; encontrar lectura de un tramo avanzado; escribir un mensaje autónomo e interpretar feedback parcial. Comprobar que ninguna rama curricular queda solo en teoría o desaparece bajo filtros. Validar con el volumen real del inventario, no únicamente con una unidad piloto.

Validar continuidad: estudiar sin red, reconectar, recuperar el mismo usuario en otro dispositivo, distinguir pendiente de sincronizado, gestionar error o acceso vencido sin perder texto, resolver dos borradores concurrentes y rechazar una identidad inesperada sin mezclar historial. Comprobar que revocación y fallos de red no borran trabajo, y que una incidencia sincronizada no promete atención docente.

Riesgos a revisar: resultados de búsqueda demasiado amplios, Topics confundidos con dominio global, exceso de filtros, matrices editoriales completas en papel pero sin variación real y abstenciones frecuentes que hagan poco útil la escritura. La solución combina alcances claros, defaults simples, muestras nuevas revisadas y criterios de aceptación de utilidad por tramo; ampliar libertad de escritura no autoriza inventar correcciones. La cobertura A1 completa exige validación editorial y de interacción antes de declarar V1 entregada.
