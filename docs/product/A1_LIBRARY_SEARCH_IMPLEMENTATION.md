# Biblioteca — búsqueda y filtros V1

2026-10-27. Mejora puntual durante la fase 8. Rama `feat/a1-library-search`, derivada de `feat/a1-v1-validation` en `252f055`. Validación humana de la mejora pendiente; no supone superar la fase 8.

## Modelo y fuentes

Índice derivado en memoria de `activeContent.pack` y del catálogo efectivo, reutilizado durante la sesión. No hay servicios remotos, IA, dependencias nuevas ni otro catálogo editorial. Se conservan las 99 fichas iniciales; buscar o aplicar filtros amplía los resultados a conceptos, vocabulario, grupos Mixed, Reading y Writing existentes. Los resultados filtrados se muestran de 20 en 20.

Fuentes reutilizadas:

- IDs/versiones, títulos, objetivos y teoría autorizada de los conceptos; unidades C01–C34 y relaciones del currículo.
- Lemas, glosas, formas, categoría gramatical, etiquetas y asociaciones del vocabulario.
- Grupos/actividades/versiones permitidas de Mixed y su preparación canónica.
- Lecturas con recibo vigente, objetivos y conceptos presentes/requeridos.
- Opciones de Writing ya disponibles: objetivo de la actividad controlada y preparación declarada del texto abierto.
- Hechos locales, versiones actuales y señales de `reviewPlans`, sin otra persistencia pedagógica.

Búsqueda parcial con normalización Unicode de acentos/mayúsculas y alias controlados español/italiano. Coincidencia exacta de título/lema/forma antes que coincidencia parcial, metadatos principales y relaciones secundarias. Los títulos de bloque permiten localizar tareas de essere aunque el microconcepto se titule «Di dove sei». No se buscan respuestas, cuerpos de lectura ni palabras incidentales de consignas Writing. Los sufijos de IDs técnicos tampoco se usan como etiquetas gramaticales.

## Taxonomía y filtros

`src/library/taxonomy.ts` agrupa unidades existentes en verbos, artículos, pronombres, preposiciones, vocabulario, construcción de frases y sustantivos/adjetivos. El vocabulario reutiliza su `partOfSpeech`; noun/adjective/proper-noun se agrupan en nominal. Temas comunicativos derivados de contextos/etiquetas/objetivos declarados, con equivalencias explícitas; solo se ofrecen categorías y temas con contenido asociado.

Se distingue **objetivo principal** de **conceptos relacionados / preparación**. Reading, vocabulario y Writing abierto no se convierten en evaluaciones gramaticales por contener palabras. Las tarjetas explican que una relación no significa que la actividad evalúe ese concepto. Categorías/bloques de una entrada sin objetivo gramatical proceden de sus asociaciones declaradas.

Los filtros tipo, categoría, tema y estado se combinan con la búsqueda mediante intersección. Los enlaces desde fichas también pueden fijar un concepto exacto, visible encima de los resultados y eliminable con «Limpiar búsqueda y filtros».

Estados orientativos:

- Conceptos: «Sin empezar», «En progreso» por exposición/sesión vigente y «Necesita repaso» por vencimiento o prioridad 0–2 de Review.
- Vocabulario: estado de los conceptos asociados, **no dominio de la palabra**.
- Mixed/Reading/Writing: «En progreso» significa que existe sesión de esa modalidad/elemento; no certifica finalización, acierto o dominio. La ausencia de sesión se muestra como «Sin empezar». La elegibilidad se indica aparte.

## Navegación, evidencias y preparación

Búsqueda visible, filtros plegables, etiquetas, contador anunciado, vacío explícito y limpieza conjunta. URL + `sessionStorage` conservan la búsqueda al volver; no se altera IndexedDB por buscar. El campo mantiene foco al actualizar resultados. Se reutilizan tarjetas, controles y rutas actuales.

Conceptos enlazan a teoría y práctica. La ficha ofrece accesos a otras prácticas relacionadas solo si hay opciones elegibles. Mixed pasa el ID del grupo concreto a `startMixed`; la ruta habitual `mixed=1` conserva su selección anterior. Un grupo no preparado muestra los conceptos de su preparación, sin iniciar otra sesión de forma silenciosa. Reading/Writing siguen sus pantallas de preparación y sus motores vuelven a comprobar requisitos al comenzar.

Única integración interna de Reading/Writing: sus helpers de preparación aceptan opcionalmente el conjunto de conceptos introducidos ya calculado por Review. Evita recalcularlo para cada tarjeta; se verifica equivalencia con el cálculo original. Los inicios de sesión siguen usando la comprobación canónica. No cambia evaluación, persistencia, esquema de hechos, service worker ni contenido editorial.

Abrir teoría conserva la exposición que ya registraba la aplicación; nunca se convierte en intento correcto o dominio. Buscar, filtrar y consultar listados no generan evidencias.

## Validación técnica

Resultados sobre la implementación `d4ce2c7`:

| Comprobación | Resultado |
|---|---|
| Unitarias afectadas: library-search, reading, writing y mixed | **48/48**, cuatro archivos; 7 pruebas nuevas, 9,85 s |
| E2E búsqueda a 320/390 px + selección/preparación Mixed | **3/3**; repetición tras ajuste visual **3/3**, 41,8 s |
| Recorrido candidato existente + transversal V1, junto con los tres nuevos | **5/5**, 1,6 min; teoría, práctica, Review, Mixed, Reading, Writing, evidencias e historial offline |
| Build normal: exclusión editorial, incluidas URLs de búsqueda y grupo Mixed concreto | **1/1**, 18,6 s |
| Typecheck, formato, build normal y build de validación | Correctos |
| Revisión visual | Capturas Chrome a 320/390 px inspeccionadas; filtros abiertos <300 px de alto, sin desbordamiento horizontal |
| Revisión del diff | Sin cambios en currículo, corpus, recibos, manifiestos, dependencias, persistencia ni evaluación |

Total **6 escenarios E2E únicos comprobados**, además de repeticiones focales. No se ejecutó de nuevo la suite completa de 381 tests de la fase anterior.

Las iteraciones unitarias iniciales tuvieron fallos: mapeo nominal pendiente y aserciones demasiado estrictas sobre el orden de sinónimos y títulos de microconceptos. Se corrigieron el mapeo y la búsqueda por metadatos curriculares, se excluyeron sufijos de IDs incidentales y se ajustaron las aserciones para verificar equivalencia de conjuntos y relaciones reales C04/C33/W-C01. La ejecución final de los cuatro archivos pasa completa; no se omitió ningún test fallido. Los E2E ejecutados no registraron fallos.

QA asesor revisó el código sin ejecutar otra suite: sus dos P2 (nominal y preparación Mixed) quedaron corregidos y comprobados. Dictamen favorable para entregar a validación del usuario, sin P0/P1 identificados; la condición de repetir los E2E quedó satisfecha con 3/3. No acredita revisión humana ni iPhone físico.

Comandos de comprobación (Node 22.23.3):

```sh
npx vitest run tests/library-search.test.ts tests/reading.test.ts tests/writing.test.ts tests/mixed.test.ts
npm run format:check
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e -- tests/e2e/library-search.spec.ts tests/e2e/v1-integration.spec.ts tests/e2e/learning.spec.ts --grep 'library|V1 integrated|candidate loop'
npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only E2E_PRODUCTION=1 npm run test:e2e -- tests/e2e/learning.spec.ts --grep 'production build'
```

Tras la comprobación restrictiva se reconstruyó `dist` con contenido de validación para facilitar la prueba local. Servidores de prueba detenidos. Commit técnico local `d4ce2c7`; este informe y el contexto se guardan en un commit documental posterior.

No se repiten auditorías editoriales: currículo, actividades, recibos, manifiestos y dependencias editoriales permanecen idénticos al punto de partida. El build normal debe seguir excluyendo contenido no publicado; el build de validación lo habilita exclusivamente para pruebas locales.

## Probar la mejora

Desde la carpeta del proyecto, con Node 22.23.3 disponible:

```sh
export PATH=/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin:$PATH
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Abre **http://127.0.0.1:4178/library** en el perfil de pruebas. Prueba `essere`, `avere`, `artículos`, `preposiciones`, `conjugaciones`, `restaurante` y `escritura`. Combina `essere` + Writing + Verbos, abre una preparación y vuelve. Después prueba una búsqueda sin resultados, limpia y accede a teoría/práctica. Comprueba que al regresar se conserva la búsqueda.

Para iPhone, HTTPS y copias de prueba se mantiene la [guía de validación real](A1_V1_USER_VALIDATION.md). La búsqueda offline requiere la carga previa del build/service worker, igual que el resto de la aplicación.

## Límites

- Alias acotados al currículo: no traducción general, corrección ortográfica ni búsqueda semántica abierta.
- Los temas reflejan metadatos existentes, no análisis lingüístico exhaustivo de cada frase.
- Estados orientativos y específicos del elemento/modalidad; no indicadores de dominio ni una nueva evaluación.
- Chrome de escritorio con viewport móvil no valida teclado/Safari/iPhone físico ni tecnologías asistivas reales. Esas pruebas siguen pendientes del usuario.
- Aviso conocido de bundle grande por imports estáticos. Sin división de paquetes ni rediseño en esta mejora.
- Contenido aún sin publicar; sin push, merge, despliegue ni fase 9. Al entregar se detiene el trabajo para validación del usuario.
