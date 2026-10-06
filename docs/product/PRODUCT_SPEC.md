# Language Trainer — propuesta de producto

Estado: propuesta para revisión de Sergio. Fecha: 2026-10-06. No autoriza implementación.

## Base y naturaleza de las decisiones

Se han leído los siete documentos del [Research Pack](../research/00_Executive_Research_Summary.md), incluidos currículo, taxonomía, contenido y fuentes. No se repite la investigación externa. Las etiquetas E-S/E-M pertenecen a conclusiones delimitadas del pack; REF describe cobertura, R recomienda y H plantea hipótesis. Ninguna de ellas prueba la eficacia conjunta de esta aplicación. Las decisiones de esta propuesta son de producto/arquitectura salvo indicación contraria; su registro está en [DECISIONS](../DECISIONS.md).

## Visión, usuario y problema

Entrenador mobile-first para adultos inicialmente hispanohablantes que empiezan italiano y quieren practicar objetivos concretos, utilizar lo aprendido y saber qué conviene revisar. El horizonte es A1 de lectura/escritura; el MVP es un subconjunto explícito, sin certificación ni evaluación oral.

El problema: completar ejercicios o recordar una respuesta reciente no permite saber si se puede recuperar y elegir una estructura en otra situación días después. El producto conecta explicación, práctica, evidencia y siguiente acción. La unidad visible es un objetivo comprensible —«usar essere para decir quién eres»—, no una lección que se supera para siempre.

## Principios

- Alcance evaluable por concepto; separar forma, función y habilidad observada.
- Registrar primer intento, ayuda y reparación por separado; no premiar la copia como recuperación.
- Contextos adultos, vocabulario accesible y tareas nuevas equivalentes.
- Distinguir falta de evidencia, dificultad observada e incertidumbre de corrección.
- Grafo orientativo: recomendar apoyos sin exigir perfección para explorar.
- Canon revisado para reglas y aceptación. Lo generado es candidato editorial.
- Uso inicial local, sin cuenta ni IA de pago como propuesta pendiente de validación.

## Learning loop propuesto

Objetivo comunicativo → comprobación inicial → explicación mínima si hace falta → práctica con apoyo → recuperación sin ayudas → producción con propósito → contraste y mezcla de lo conocido → comprobación diferida con ejemplos nuevos → valoración provisional → mantenimiento o reparación específica.

Feedback y reparación atraviesan el ciclo. Se puede saltar explicación cuando existe evidencia suficiente y retomar etapas en sesiones distintas. Leer teoría solo acredita exposición. Una sesión puede terminar con «pendiente de comprobar otro día» y haber cumplido su objetivo.

## Funcionalidades y modos

### Focus Practice

Elegir concepto o llegar desde teoría/error; ver alcance y tiempo orientativo; intentar una comprobación antes de recibir modelos; ajustar apoyos; variar persona, función y contexto dentro de lo conocido; finalizar con una aplicación nueva. El título focal se registra como pista de selección: recuperar essere anunciado no demuestra elegirlo entre verbos.

Ejemplo: practicar presente de essere → comprobar una persona → regla o pista según respuesta → recuperar otra → situar un grupo en una ciudad → practicar el patrón débil → preparar revisión posterior. Contraste con avere solo si ya resulta accesible. No imponer una secuencia ni un número fijo de ejercicios.

### Mixed Practice

Sesión recomendada que combina necesidades: revisión pendiente, error recurrente confirmado, objetivo reciente y uso de conocimientos previos. Selección por prioridades y cobertura, sin porcentajes permanentes. No anunciar el concepto antes de responder cuando se evalúa elección funcional. Explicar después por qué se propuso la tarea.

Con un solo concepto accesible se ofrece práctica variada focal y se explica por qué aún no hay mezcla. Con ausencia prolongada se comprueba una muestra, sin crear deuda ilimitada.

### Review

Lista accionable por conceptos, con motivo: «última comprobación hace tiempo», «necesita práctica de noi» o «falta comprobar sin ayudas». Empezar por recuperación antes de mostrar teoría. Usar huecos, contraste, comprensión y producción; no limitarlo a tarjetas. Vencimiento es una recomendación temporal, no un diagnóstico de olvido. Un fallo aislado provoca comprobación específica, no reinicio total.

### Reading

Microtextos adultos revisados: presentación de compañeros, mensaje de viaje, descripción de personas/objetos. Comprensión global y de detalle, forma-significado y respuesta breve cuando aporte valor. El MVP incluye tres paquetes editoriales; las longitudes son orientativas y la dificultad depende también de léxico, sintaxis y tarea. Las glosas no objetivo ayudan sin penalizar gramática; consultar una forma objetivo sí se registra como apoyo.

### Writing

Frase guiada → frase con intención y datos elegidos → mensaje guiado de dos o tres frases. En el MVP, escenarios y lenguaje evaluable acotados; se permite escribir variantes, pero solo se juzga aquello que el evaluador revisado puede resolver. Fuera de cobertura: conservar borrador, explicar límite y ofrecer reformular o comparar con un modelo; no registrar fallo ni dominio automático.

Feedback: qué fragmento presenta un error verificable, por qué y concepto relacionado, con «Practicar este concepto». Separar gramática, cumplimiento comunicativo y sugerencias de estilo. Corregir el texto original no demuestra transferencia: la siguiente comprobación usa otra situación.

### Theory y detalle de concepto

Biblioteca por concepto e intención. Cada ficha: propósito, regla breve, ejemplos, variantes, límites, apoyos y enlaces Practicar / Ver ejemplos. El detalle añade evidencias recientes, lo que falta comprobar y repaso. Búsqueda por «essere», «nosotros» o «presentarme» con etiquetas y alias editoriales, sin buscador de IA. Solo aparecen como disponibles las fichas publicadas del MVP.

### Progreso

Perfil por concepto: comprensión, recuperación de forma, uso contextual, discriminación y retención diferida. Cada dimensión puede mostrar sin evidencia, con apoyo, observada sin apoyo o pendiente de nueva comprobación, con fecha y alcance. «Estabilidad observada» requiere evidencia diferida y variada según una política explícita aún por calibrar. No hay porcentaje global de dominio ni equivalencia automática con nivel MCER.

## MVP y límites

El alcance vinculante para la propuesta está en [MVP_SCOPE](../mvp/MVP_SCOPE.md): diez objetivos acotados, tres contextos, cinco familias de ejercicio, tres lecturas y tres propuestas de escritura. Incluye Focus, Mixed, Review, errores, teoría, progreso y reanudación. No cubre todo A1 ni corrección libre universal.

## Criterios de éxito y validación

1. El recorrido completo puede demostrarse sobre essere y repetirse con otro concepto, incluida comprobación diferida.
2. El alumno entiende qué ha practicado, qué puede hacer sin ayuda y qué falta comprobar, sin interpretar un acierto como dominio definitivo.
3. Puede iniciar práctica, revisar un error y reanudar desde móvil sin perder respuestas enviadas.
4. El evaluador acepta variantes revisadas y se abstiene ante casos desconocidos. Los falsos rechazos del conjunto editorial bloquean publicación.
5. En un piloto, comparar respuesta inicial, recuperación posterior y uso en contexto nuevo; registrar ayudas, incertidumbre y tiempo de uso por separado. La satisfacción y el uso no prueban aprendizaje.

H: probar ventanas de revisión alrededor de una semana y otra posterior, con tareas reservadas y sin ayudas previas; calendario exacto, tamaño de muestra y metas se fijarán antes del piloto. Un piloto personal valida factibilidad y detecta problemas; no demuestra eficacia causal ni permite generalizar a la población. La aceptación funcional y editorial precede a esa validación pedagógica.
