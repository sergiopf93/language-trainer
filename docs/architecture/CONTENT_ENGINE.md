# Content & Curriculum Engine

Implementación de Fase 3B; muestra **candidate**, sin publicación ni carga completa del A1.

## Límites

`LanguagePack` reúne idioma objetivo/apoyo, currículo versionado, Topics, Concepts, relaciones, Theory, vocabulario, templates y actividades canónicas. `loadLanguagePack` valida y entrega el `ContentRepository` ya usado por Learning. El progreso sigue siendo una proyección de hechos del usuario, separado del contenido.

`Curriculum → Level → Unit/Topic → Concept` mantiene dos conjuntos distintos: inventario esperado y contenido presente. El manifiesto italiano registra las 34 unidades y los 99 IDs de la matriz de Work; **no crea conceptos ni contenido para cubrir huecos**. IDs deben ser estables y globalmente identificables; cada idioma aporta su propio espacio de IDs. Las familias curriculares admiten F1–F7; el runtime conserva únicamente las familias implementadas.

El grafo permite prerequisite, related, contrast y reinforces (acepta supports/contrasts antiguos). `connections` y `prerequisites` permiten recorrerlo; strength distingue preparación recomendada/requerida. Se validan referencias y ciclos de prerrequisitos. Learning no bloquea práctica por preparación ni interpreta esos enlaces como dominio demostrado.

Theory conserva explicación, reglas, tabla de formas, ejemplos bilingües, errores frecuentes, notas, excepciones y contrastes en campos separados. La UI renderiza componentes y consume el pack. Vocabulario mantiene lema/sentido pedagógico, formas con rasgos, asociaciones y metadatos propios; no pretende ser un diccionario.

## Canon, templates y trazabilidad

La familia define la estructura del motor. El template define objetivo, formato, concepto versionado, restricciones y una lista explícita de variantes canónicas permitidas. Cada variante referencia un ítem creado por autor y vocabulario versionado; puede obtener su respuesta de una forma léxica si coincide exactamente con el criterio canónico. No hay permutaciones libres, aleatoriedad ni generación lingüística runtime.

La instanciación es determinista y no modifica canon. Mantiene ID/versión del ítem lingüísticamente idéntico para conservar detección de exposición previa, y añade `trace.kind=derived`, template/versión/variante, fuente/versión, pack/versión y currículo/versión. Un cambio de contenido lingüístico exige versionar la fuente; cambiar metadatos de template no crea por sí solo una oportunidad nueva. Fuentes derivadas se rechazan como canon.

La muestra adapta C03-01/C04-01, las 14 actividades existentes, dos fichas y cuatro entradas léxicas. El template de essere instancia `Tu ___` desde la fuente existente y la forma `sei`. Se conserva el orden de práctica. Los templates se limitan deliberadamente a variantes explícitas; ampliar combinaciones exige autoría y validación lingüística suficientes.

Las sesiones conservan instantáneas. La evidencia nueva añade versión de actividad, provenance y trace; el protocolo comprueba su coincidencia con la instantánea. Históricos sin esos campos siguen siendo válidos. No cambia IndexedDB, D1 ni el transporte. Los clientes antiguos deben actualizarse para interpretar los nuevos campos opcionales; no se despliega aquí.

## Editorial y coverage

`candidate → reviewed → published`: las transiciones son explícitas, registran responsable/fecha/versión de revisión y fecha/versión de publicación. Registrar esos datos **no realiza ni acredita por sí solo una revisión lingüística**. Publicar requiere revisión vigente y dependencias publicadas. Todo el contenido real continúa candidate. Producción excluye candidate y reviewed; desarrollo admite candidate como antes.

`validatePack` comprueba IDs, inventario, referencias, versiones, grafo, teoría, vocabulario, templates/familias, respuestas aceptadas y trazabilidad. Errores impiden cargar el pack.

Con Node 22:

```sh
npm run content:coverage
npm run --silent content:coverage -- --json > /tmp/language-trainer-coverage.json
```

El reporte incluye cada ID esperado bajo C01–C34: existencia, Theory, reglas, ejemplos, ejercicios/familias/habilidades/dimensiones/facetas observadas, vocabulario, estado editorial, alcance/exclusiones y huecos. `productionReady` exige pack válido, publicación de dependencias, contenido mínimo presente y alcance marcado completo; es una comprobación estructural/editorial, **no demuestra eficacia ni cumplimiento automático de CC1–CC10**. Los dos conceptos actuales están marcados partial; resultado: 2/99 presentes y 0 listos. Los errores de validación producen salida no cero.

Otro idioma aporta pack, inventario, contenido, templates, copy de interfaz y, si lo necesita, evaluador lingüístico. Learning/Evidence/Review y el Exercise Engine base no importan italiano. Se prueba la independencia de identidad del pack sin implementar otro idioma. Review sigue siendo un contrato; no se construye su motor en esta fase.
