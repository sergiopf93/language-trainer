# Language Trainer V1.0.0 — publicación estable

## Entorno habitual

**https://sergiopf93.github.io/language-trainer/** es la URL habitual autorizada. `origin/main` representa la versión estable. Localhost sirve únicamente para desarrollo y pruebas. Toda entrega requiere integración en estable, publicación y verificación funcional de la URL pública; no basta el build o un workflow verde.

La etiqueta anotada `v1.0.0` se conserva en `18b341f50b0c97283f2eb58187f6643c86563f8c`. La corrección posterior adapta exclusivamente publicación, rutas y PWA de esa versión; no modifica el currículo autorizado ni los motores. Cloudflare mantiene su despliegue existente en https://language-trainer.sergio-pf93-794.workers.dev sin redespliegue.

## Diagnóstico y corrección de Pages

El 2026-10-28 Pages devolvía HTTP 200 con el HTML de las fuentes, incluido `<script type="module" src="/src/main.ts">`. El workflow dinámico `pages build and deployment` había publicado la rama main sin construir Vite; su ejecución 40692588719 figuraba correcta pese a no servir la aplicación compilada. Además Vite, rutas, manifest y service worker asumían la raíz `/`, incompatible con la subruta del repositorio.

El workflow `.github/workflows/pages.yml` construye exclusivamente el catálogo release autorizado y publica `dist`; después verifica la URL pública con navegador. Usa Node de `.nvmrc`, npm ci, tipos y pruebas focales antes del build, y permisos de escritura Pages/OIDC solo en el job deploy. No incluye secretos ni contenido de validación. Cada push aprobado de main publica automáticamente. El propietario confirmó Settings → Pages → Source → GitHub Actions.

`LT_PAGES_BASE=/language-trainer/` adapta assets y rutas. En Pages se usan fragmentos como `#/library`, que admiten enlaces y recargas sin depender de un fallback HTTP 404. Cloudflare conserva rutas de raíz cuando la variable no está definida. Manifest, iconos, registro/scope del SW y precaché usan la misma base. Los datos IndexedDB no se borran ni migran; los respaldos siguen siendo exportables/importables. Cloudflare y Pages son orígenes diferentes: no comparten automáticamente sus datos locales; usa el respaldo para trasladarlos.

## Pruebas y reproducción

```sh
cd /Users/sergiopardo/Desktop/language-trainer
# Node 22.12+ (versión fijada en .nvmrc)
npm ci
npm run typecheck
npm test -- tests/routing.test.ts tests/release-content.test.ts tests/library-search.test.ts tests/learning.test.ts tests/review.test.ts tests/mixed.test.ts tests/reading.test.ts tests/writing.test.ts
LT_PAGES_BASE=/language-trainer/ npm run build:release
LT_PAGES_BASE=/language-trainer/ npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Preview: http://127.0.0.1:4178/language-trainer/ ; detener con Ctrl+C. No usar candidate ni el build normal para publicar V1. El inventario y los recibos se comprueban contra `release-v1/approval.json`, sin renovar aprobaciones editoriales.

E2E públicos, con Chrome instalado:

```sh
E2E_RELEASE=1 E2E_APP_BASE=/language-trainer/ E2E_BASE_URL=https://sergiopf93.github.io/language-trainer/ PLAYWRIGHT_CHANNEL=chrome npm run test:e2e -- tests/e2e/pages.spec.ts tests/e2e/release.spec.ts tests/e2e/library-search.spec.ts tests/e2e/v1-integration.spec.ts
```

El workflow usa Chromium en Linux y archiva trazas si falla la verificación pública. Cubre catálogo, búsqueda, teoría, práctica focal, Review, Mixed, Reading, Writing, progreso/historial, respaldo entre perfiles, assets, scope y recuperación offline. No acredita Safari/iPhone físicos ni repite auditorías lingüísticas.

## Verificación final

Preparación local de la corrección: typecheck y formato correctos; 76 pruebas focales correctas (incluyen inventario/recibos y rutas); build release de raíz y de Pages correctos. Regresión de raíz: 6/6 E2E. Pages local: siete casos únicos correctos en dos ejecuciones (6/7 iniciales y repetición correcta de la transversal tras adaptar su pestaña reabierta a la subruta; el fallo inicial del test intentaba navegar offline fuera del scope). Inspección visual de Biblioteca a 390 px y comprobación automática sin overflow a 320/390 px.

La evidencia pública de cada commit está en el job **verify** del workflow [Publish stable V1 to GitHub Pages](https://github.com/sergiopf93/language-trainer/actions/workflows/pages.yml). Este job ejecuta los siete E2E contra la URL HTTPS publicada, después del despliegue. Consultar el SHA y resultado de esa ejecución: el resultado local anterior no sustituye esta verificación pública.

La primera verificación automatizada en Chromium/Linux expuso una carrera en el E2E transversal: inspeccionaba el control de respuesta antes de que terminara el render asíncrono de la pregunta siguiente y agotaba el tiempo esperando una opción de la pregunta anterior. El test espera ahora el número de ejercicio actual antes de elegir el control. No se han aumentado timeouts, eliminado aserciones ni modificado la aplicación por este fallo. El reporter GitHub publica errores detallados como anotaciones además del artefacto de trazas. La suite pública de siete casos pasó desde Chrome; el recorrido afectado volvió a pasar después de esta corrección de sincronización.
