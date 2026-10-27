# Language Trainer V1 — publicación

Estado a 2026-10-27: **no desplegada**. No hay URL de producción verificada ni etiqueta v1.0.0.

## Autorización y versión

El usuario confirma en su solicitud «R2 — PUBLICACIÓN FINAL DE LANGUAGE TRAINER V1» que las validaciones pendientes, editorial y lingüística están completadas y autoriza expresamente el despliegue definitivo en Cloudflare. Esta es una confirmación del usuario, no una prueba humana ejecutada por R2. No se inventan resultados detallados ni pruebas físicas en iPhone.

Base integrada: `1d4c440`, rama `feat/a1-library-search`, con implementación del buscador en `d4ce2c7`. Árbol limpio al comenzar. No se autoriza push ni merge de ramas principales; etiquetar v1.0.0 solo después de verificar el despliegue.

## Recuperación realizada

Leídos AGENTS, contexto, configuración Cloudflare, arquitectura, registro de validación y mecanismos de catálogo/publicación. La revisión previa de integración y buscador sigue disponible; no se han repetido auditorías cerradas ni pruebas técnicas durante esta preparación de publicación.

Cloudflare: Wrangler inicialmente no autenticado. Se ejecutó el acceso OAuth oficial; el usuario confirmó «He autorizado Cloudflare». `wrangler login` terminó correctamente y `wrangler whoami` confirmó una cuenta disponible con permisos Workers/D1/Pages. Credenciales guardadas por Wrangler fuera del repositorio; no copiadas a archivos del proyecto ni al bundle. No se han creado recursos, instalado certificados, cambiado dominios ni contratado servicios.

`wrangler.jsonc` tiene un binding D1 con UUID de ejemplo. La sincronización remota de producción no está acreditada. El usuario permite lanzar local-first sin bloquear por sincronización opcional: publicar inicialmente sin D1 salvo evidencia adicional de validación. IndexedDB y copias existentes deben conservarse.

## Trabajo pendiente antes de desplegar

1. Preparar una configuración de producción que no use el D1 de ejemplo; reutilizar Workers Static Assets y HTTPS de workers.dev, sin servicios de pago. Consultar los recursos existentes de esta cuenta antes de crear o reemplazar uno.
2. Verificar inventario y huellas de los recibos existentes y registrar la transición publicada del contenido autorizado. `publishContent` exige revisión/versionado; no activar globalmente `VITE_ENABLE_CANDIDATE_CONTENT` como sustituto de publicar.
3. Excluir físicamente del bundle los datos no autorizados. Actualmente los imports estáticos incluyen autoría y fixtures. Una posible solución pendiente de implementar/revisar es materializar un snapshot aprobado durante el build, manteniendo los recibos originales y evitando empaquetar fuentes ajenas al inventario autorizado.
4. Adaptar los controles de Reading/Writing a contenido publicado: actualmente hay filtros literales reviewed/allowCandidates, incluido startReading. No basta publicar los conceptos. Mantener comprobaciones de recibos y prerrequisitos.
5. Ejecutar pruebas afectadas y recorrido transversal sobre el build real de producción; verificar ausencia de secretos/contenido no autorizado. No repetir revisión lingüística completa.
6. Desplegar, verificar URL HTTPS, navegación, buscador, modalidades, persistencia, manifest, service worker y recuperación offline. Documentar versión de Cloudflare, commit, actualización/reversión y límites. Solo después crear v1.0.0.

La documentación oficial consultada confirma el despliegue de assets con Wrangler y el uso de workers.dev: [Static Assets](https://developers.cloudflare.com/workers/static-assets/), [configuración](https://developers.cloudflare.com/workers/wrangler/configuration/), [costes de assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/). No se ha seleccionado ni activado un plan de pago.

## Interrupción y reanudación

El especialista de arquitectura recibió un error explícito de límite de uso antes de emitir dictamen. Se guarda este checkpoint y se detiene el trabajo. **No es un fallo demostrado del producto ni una retirada de la autorización de despliegue.** No volver a solicitar una aprobación general: continuar desde este estado cuando haya disponibilidad, reutilizando la autenticación existente mientras sea válida.

Producción sin desplegar; catálogo sin transición editorial; sin cambios funcionales; sin push, merge ni tag. `dist` sigue siendo el build local de validación preparado en la iteración anterior y **no debe desplegarse como producción**. No se ha iniciado servidor durante esta preparación.
