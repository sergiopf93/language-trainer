# Language Trainer V1

PWA personal de italiano A1 con apoyo en español. Aplicación pública:

**https://sergiopf93.github.io/language-trainer/**

GitHub Pages es el entorno habitual. `origin/main` es la versión estable y cada actualización aprobada activa el workflow [Publish stable V1 to GitHub Pages](.github/workflows/pages.yml). Publica únicamente `dist` del catálogo autorizado y ejecuta E2E sobre la URL pública. Cloudflare conserva el despliegue previo de V1; no se actualiza con este workflow.

99 conceptos, teoría y práctica, buscador y filtros de Biblioteca, Review, 45 grupos Mixed, 26 lecturas y Writing controlado/abierto. La escritura abierta no recibe una corrección lingüística universal ni una nota automática. No se acredita dominio por completar actividades.

## Uso e instalación

Abre la dirección en un navegador. En iPhone: Safari → Compartir → Añadir a pantalla de inicio. No requiere certificados locales. Espera a que termine la primera carga con conexión antes de probar offline.

La V1 pública funciona **local-first, sin sincronización remota**. IndexedDB conserva sesiones, borradores, respuestas y ayudas en ese navegador. En Impostazioni puedes descargar y restaurar respaldos. Guarda una copia antes de borrar datos del navegador o cambiar de dispositivo. Otro navegador, dirección o contexto de instalación puede tener almacenamiento separado.

Una actualización de la PWA se activa al cerrar todas las pestañas/ventanas de la aplicación y volver a abrir con conexión; puede requerir una segunda reapertura. No es necesario borrar datos del sitio. Los respaldos generados por la versión pública permiten continuar sesiones publicadas; los datos `reviewed` de las pruebas previas no se convierten automáticamente en progreso público.

## Desarrollo y build

Node 22.12+; `.nvmrc` fija Node 22. Dependencias existentes: TypeScript, Vite, DOM e idb. No hay IA en ejecución ni nuevas dependencias de publicación.

```sh
npm ci
npm run dev
```

El modo desarrollo permite contenido de validación. El comando `npm run build` conserva el catálogo restrictivo de desarrollo; **para publicar V1 utiliza `npm run build:release`**:

```sh
npm run build:release
npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Para reproducir la publicación de Pages desde `main`:

```sh
git switch main
npm ci
LT_PAGES_BASE=/language-trainer/ npm run build:release
LT_PAGES_BASE=/language-trainer/ npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Abre `http://127.0.0.1:4178/language-trainer/`; detén con Ctrl+C. Este entorno es solo de pruebas. La publicación real es GitHub Pages. En Pages las rutas usan fragmentos, por ejemplo `#/library`, para admitir recargas sin reglas de servidor. El build release sin `LT_PAGES_BASE` conserva las rutas de raíz compatibles con Cloudflare.

Preview de raíz: `http://127.0.0.1:4178`. El build release verifica el inventario autorizado y los recibos antes de materializar el contenido publicado. Excluye del bundle módulos de autoría y fixtures. Un cambio en contenido o recibos invalida la aprobación fija; no regenerarla para hacer pasar una comprobación sin nueva autorización editorial.

## Pruebas

```sh
npm run typecheck
npm test
npm run format:check
npm run build:release
E2E_RELEASE=1 PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e -- tests/e2e/release.spec.ts tests/e2e/library-search.spec.ts tests/e2e/v1-integration.spec.ts
```

El servidor Node/SQLite es exclusivamente de pruebas y reproduce la redirección canónica de Cloudflare. Para desarrollar la API/D1 opcional se conservan `wrangler.jsonc`, migraciones y `npm run secrets:local`; el runtime nativo necesita un sistema compatible. Esa API no está desplegada en la V1 pública.

## Publicación y documentación

La publicación habitual usa GitHub Actions y Pages, con Node de `.nvmrc`, `build:release`, base del repositorio y verificación pública posterior. Pages debe tener **Settings → Pages → Source → GitHub Actions**. No hay D1, sincronización remota ni secretos en el cliente. La configuración `wrangler.release.jsonc` se conserva para el despliegue existente de Cloudflare.

[Release, verificaciones y reversión](docs/product/A1_V1_RELEASE.md) · [Contexto operativo](docs/context/R2_PROJECT_CONTEXT.md) · [Especificación](docs/product/PRODUCT_SPEC.md) · [Guía de validación](docs/product/A1_V1_USER_VALIDATION.md).
