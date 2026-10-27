# Diagnóstico offline del preview — 2026-10-27

## Fallo confirmado y aislamiento

Baseline `81a2301`, preview Vite en `http://127.0.0.1:4178`, perfil Chrome nuevo. Tras guardar una respuesta de C04-01 y esperar serviceWorker.ready, cerrar pestaña y reabrir Home con `context.setOffline(true)`:

- La URL era `/`, el controlador `/sw.js` estaba activo y Cache Storage contenía `lt-shell-378844dfbfc58c5c`.
- El HTML mostraba solo «Vai al contenuto». JavaScript no iniciaba la aplicación.
- `/assets/index-DcL3tsR-.js` y `/assets/index-Fg6QZoe0.css` fallaban con `net::ERR_FAILED`.
- Ambos assets estaban precacheados con estado200 y tipos correctos; sus respuestas tenían `Vary: Origin`. No era ausencia del precache ni un fallo observado de IndexedDB o selección de sesión.

Se cambió **solo** `preview.cors` a `false` y se repitió el mismo smoke con perfil nuevo y el mismo build. Resultado correcto: recuperación offline de borrador y feedback. La interacción de las cabeceras CORS/Vary del preview con los recursos precacheados era el disparador reproducido. No se modifica la estrategia de caché de producción ni se usa `ignoreVary` para ocultar variaciones legítimas.

## Corrección limitada al entorno

`preview.config.mjs` sirve recursos del mismo origen, por lo que no necesita CORS. CORS desactivado elimina `Vary: Origin`; respuestas de assets comprobadas también bajo HTTPS sin Vary. La API local continúa aislada (401, sin proxy a cuentas). Configuración por defecto limitada a loopback; LAN requiere IP explícita y TLS. Se rechazan bind globales `0.0.0.0`/`::` y LAN sin certificado.

El intento inicial de verificar TLS escuchando en todas las interfaces fue rechazado por revisión automática por exposición amplia de contenido no publicado. Se adoptó la alternativa segura: TLS solo en127.0.0.1, sin instalar confianza del sistema. No se abrió ningún puerto del router ni se desplegó servicio externo.

## Verificación afectada

El smoke conservado usa perfil desechable, UI y service worker del build real, sin inyectar datos:

1. Inicio y respuesta de API401.
2. Lectura C04-01, inicio, respuesta guardada.
3. Cierre de pestaña y reapertura offline; borrador y **hechos completos idénticos** antes/después.
4. Envío offline y feedback conservado tras recarga.
5. Descarga de respaldo desde ajustes, importación en otro perfil vacío mediante diálogo y **hechos idénticos** al estado exportado; sesión/feedback accesibles tras recarga.

[Resultado HTTP](preview-smoke.json). [Resultado TLS](https-check.json): handshake con verificación de certificado y nombre, assets200 y sin Vary; CA temporal confiada solo por el cliente de comprobación, no instalada en el sistema. No se declara smoke navegador HTTPS/iPhone ejecutado: la recuperación se verificó en HTTP loopback seguro y la capa TLS aparte.

Reproducción del smoke desde raíz, con preview HTTP activo y Node22:

```sh
node docs/product/user-validation/preview-smoke.mjs
```

El escenario es representativo del build y del flujo local-first, pero no del despliegue remoto completo: API deshabilitada, red offline emulada por Chrome, sin cuotas agotadas, expulsión del almacenamiento ni dispositivos físicos. El backend/headers de Cloudflare no se validan aquí. No hubo evidencia de pérdida de datos; no se tocó `src/`, `shared/`, `worker/` ni `scripts/build-sw.mjs`.

## Cachés anteriores

La corrección se verificó con perfiles nuevos; no cambia el hash del build ni fuerza reinstalación del SW. Un origen que precacheó cabeceras antiguas puede conservarlas. Para validación sin borrar datos: exportar online el respaldo de prueba, abrir preview en otro puerto/perfil, preparar caché nueva y restaurar allí. No se afirma migración automática de caché histórica.

## Estado

V8-03 resuelto como defecto del **entorno de validación**, no como defecto de recuperación de sesiones. El fallo original se conserva en [preview-smoke-failure.txt](preview-smoke-failure.txt). No se repite la suite completa ni las auditorías editoriales ya correctas: cambian solamente configuración del preview, comprobación focal y documentos.
