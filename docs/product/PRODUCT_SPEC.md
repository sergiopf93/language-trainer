# Language Trainer — propuesta de producto

Estado: propuesta para revisión de Sergio. Actualizado: 2026-10-07. No autoriza implementación.

## Base y naturaleza de las decisiones

Se han leído los siete documentos del [Research Pack](../research/00_Executive_Research_Summary.md), incluidos currículo, taxonomía, contenido y fuentes. No se repite la investigación externa. Las etiquetas E-S/E-M pertenecen a conclusiones delimitadas del pack; REF describe cobertura, R recomienda y H plantea hipótesis. Ninguna de ellas prueba la eficacia conjunta de esta aplicación. Las decisiones de esta propuesta son de producto/arquitectura salvo indicación contraria; su registro está en [DECISIONS](../DECISIONS.md).

## Visión, usuario y problema

Entrenador mobile-first para adultos inicialmente hispanohablantes que empiezan italiano y quieren practicar objetivos concretos, utilizar lo aprendido y saber qué conviene revisar. V1 cubre completamente el currículo italiano A1 definido por el Research Pack: C01–C34, sus funciones, vocabulario, contextos y progresión de lectura/escritura. Incluye la ampliación final de pasado próximo. No certifica oficialmente A1 ni evalúa competencia oral completa: esa limitación de modalidad no reduce la cobertura curricular acordada.

El problema: completar ejercicios o recordar una respuesta reciente no permite saber si se puede recuperar y elegir una estructura en otra situación días después. El producto conecta explicación, práctica, evidencia y siguiente acción. La unidad visible es un objetivo comprensible —«usar essere para decir quién eres»—, no una lección que se supera para siempre.

## Principios

- Alcance evaluable por concepto; separar forma, función y habilidad observada.
- Registrar primer intento, ayuda y reparación por separado; no premiar la copia como recuperación.
- Contextos adultos, vocabulario accesible y tareas nuevas equivalentes.
- Distinguir falta de evidencia, dificultad observada e incertidumbre de corrección.
- Grafo orientativo: recomendar apoyos sin exigir perfección para explorar.
- Canon revisado para reglas y aceptación. Lo generado es candidato editorial.
- Arquitectura local-first con persistencia/sincronización Cloudflare Worker/D1 y acceso sencillo del mismo propietario desde distintos dispositivos. Sin dependencia de IA online/de pago.

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

Microtextos adultos revisados: presentación de compañeros, mensaje de viaje, descripción de personas/objetos. Comprensión global y de detalle, forma-significado y respuesta breve cuando aporte valor. V1 incluye un banco progresivo cuya suficiencia se comprueba en la matriz editorial, sin fijar un número arbitrario de textos. Abarca avisos, mensajes, descripciones, instrucciones y relatos breves al final del recorrido; las longitudes son orientativas y la dificultad depende también de léxico, sintaxis y tarea. Las glosas no objetivo ayudan sin penalizar gramática; consultar una forma objetivo sí se registra como apoyo.

### Writing

Completar con significado → construir frase → frase propia → varias frases relacionadas → mensaje guiado → mensaje más autónomo dentro del nivel, incluido relato breve en pasado. El usuario puede redactar libremente dentro de una situación A1; no se limita la sección a tres escenarios. El alcance de la evaluación es independiente de la libertad de composición: se juzgan únicamente oportunidades que el evaluador revisado puede resolver y se declara lo no evaluado. Ante incertidumbre: conservar borrador, permitir revisión con rúbrica/modelo y ofrecer una comprobación focal alternativa. La autoevaluación se registra como tal y no acredita mastery automáticamente. La abstención no puede ser excusa para dejar un concepto sin ninguna vía fiable de obtener evidencia.

Feedback: qué fragmento presenta un error verificable, por qué y concepto relacionado, con «Practicar este concepto». Separar gramática, cumplimiento comunicativo y sugerencias de estilo. Corregir el texto original no demuestra transferencia: la siguiente comprobación usa otra situación.

### Theory y detalle de concepto

Biblioteca por concepto e intención. Cada ficha: propósito, regla breve, ejemplos, variantes, límites, apoyos y enlaces Practicar / Ver ejemplos. El detalle añade evidencias recientes, lo que falta comprobar y repaso. Búsqueda por «essere», «nosotros» o «presentarme» con etiquetas y alias editoriales, sin buscador de IA. La entrega V1 incluye teoría y práctica conectadas para todo el currículo. Los Topics amplios permiten escoger subalcance o practicar el grupo; buscar «pasado» o «preposiciones» no obliga a conocer los IDs. Durante hitos internos se distinguen material aún en preparación y contenidos publicados, pero un hito parcial no se presenta como V1 completa.

### Progreso

Perfil por concepto: comprensión, recuperación de forma, uso contextual, discriminación y retención diferida. Cada dimensión puede mostrar sin evidencia, con apoyo, observada sin apoyo o pendiente de nueva comprobación, con fecha y alcance. «Estabilidad observada» requiere evidencia diferida y variada según una política explícita aún por calibrar. No hay porcentaje global de dominio ni equivalencia automática con nivel MCER.

## V1: currículo A1 completo

La fuente de alcance es [Research 02](../research/02_Italian_A1_Curriculum.md), inventariada en [A1_COVERAGE_MATRIX](A1_COVERAGE_MATRIX.md). El contrato de entrega está en [V1_SCOPE](../mvp/V1_SCOPE.md). El alcance completo está decidido por Sergio; la implementación sigue pendiente de aprobación final.

Todo concepto evaluable dispone de teoría, ejemplos, Focus adecuado, contexto, errores explicados, acceso a reparación, Review, oportunidades de evidencia y recomendaciones. Mixed opera sobre todas las áreas accesibles y registra qué conceptos aparecen realmente. Una presencia incidental en un texto no satisface por sí sola este contrato.

La matriz vincula todos los elementos curriculares con capacidades evaluables sin equiparar Cxx con Concept. Vocabulario objetivo y de apoyo forman parte del contenido V1. Reading y Writing recorren todos los tramos y funciones. La suficiencia editorial se decide por oportunidades, facetas, variedad y reservas diferidas, no por número bruto de frases.

POST-V1: contenidos fuera del recorrido del pack, segundo idioma activo, voz y pronunciación automática, social, monetización y gamificación compleja. Ninguna ampliación A1 de Research 02 queda pospuesta. La arquitectura conserva separación motor/contenido y no depende de IA online durante el uso.

## Continuidad entre dispositivos

Estudiar offline con contenido descargado, conservar historial y sincronizar automáticamente cuando la app tenga conexión y pueda ejecutarse. Recuperar el mismo progreso confirmado desde otro dispositivo mediante identificación sencilla. Mostrar guardado local, pendiente y sincronizado como estados distintos. Reintentos no duplican intentos; conflictos conservan trabajo. Backup manual para portabilidad, no mecanismo principal de continuidad. Solo el Worker accede a D1; no credenciales de infraestructura en cliente.

## Criterios de éxito y validación

1. Todo C01–C34 y cada Concept derivado cumplen el contrato curricular de V1, incluida revisión diferida, sin conceptos huérfanos ni temas solo teóricos.
2. El alumno entiende qué ha practicado, qué puede hacer sin ayuda y qué falta comprobar, sin interpretar un acierto como dominio definitivo.
3. Puede iniciar práctica, revisar un error y reanudar desde móvil offline; reconectar sincroniza sin duplicados y otro dispositivo recupera historial confirmado sin perder trabajo concurrente.
4. El evaluador acepta variantes revisadas y se abstiene ante casos desconocidos. Los falsos rechazos y falsos positivos conocidos del conjunto editorial bloquean publicación; la abstención se mide por cobertura para no ocultar objetivos sin evaluación útil.
5. En un piloto, comparar respuesta inicial, recuperación posterior y uso en contexto nuevo; registrar ayudas, incertidumbre y tiempo de uso por separado. La satisfacción y el uso no prueban aprendizaje.

La entrega técnica/editorial de V1 exige cobertura completa. Un piloto temprano puede comprobar una unidad antes de producir el resto, pero no cierra el trabajo ni requiere otro encargo para integrar el resto del A1.

H: probar ventanas de revisión alrededor de una semana y otra posterior, con tareas reservadas y sin ayudas previas; calendario exacto, tamaño de muestra y metas se fijarán antes del piloto. Un piloto personal valida factibilidad y detecta problemas; no demuestra eficacia causal ni permite generalizar a la población. La aceptación funcional y editorial precede a esa validación pedagógica.
