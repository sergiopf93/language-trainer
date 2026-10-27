# Language Trainer V1 — preparación de validación práctica

2026-10-27. **Documento provisional de reanudación: preparación incompleta, fase 8 NO superada.** Interrupción por límite de uso del subagente de muestra lingüística. No hay resultados humanos ni pruebas físicas de iPhone.

## Estado y Git

Rama `feat/a1-v1-validation` creada desde `feat/a1-v1-integration` / `9f72bcc`, árbol inicial limpio. Sin cambios de aplicación, catálogo, recibos ni dependencias. Solo configuración local de preview y evidencias de preparación. Sin push, merge, publicación ni despliegue. Servidor temporal detenido al guardar este checkpoint.

## Ya comprobado

Suite completa solicitada: **381/381, 22 suites, 59,62 s**, `npm test -- --maxWorkers=2`, Node 22.23.3. El timeout Mixed no se reprodujo en esta ejecución completa. No equivale a demostrar que nunca reaparecerá; causa de concurrencia anterior sigue sin demostrarse. [Log íntegro](user-validation/unit-full.log). No cambios en timeout ni motor; no repetir la batería salvo nueva evidencia que lo justifique.

Build de validación correcto: [log](user-validation/build-validation.log). Auditorías previas intactas, sin repetirlas. **dist actual es de validación**, permite contenido no publicado solo para prueba local; no se cambian estados editoriales.

## Entorno provisional y fallo pendiente

Creado [preview.config.mjs](user-validation/preview.config.mjs): puerto 4178 estricto; HTTP solo loopback; si se proporcionan certificado y clave TLS, escucha HTTPS en red local. `/api/` devuelve 401 y no reenvía datos a cuentas/servidores reales. Esta configuración solo sirve a la prueba local.

Comandos utilizados (arranque confirmado; recuperación offline de este preview aún NO validada):

```sh
cd /Users/sergiopardo/Desktop/language-trainer
export PATH=/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin:$PATH
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Dirección: `http://127.0.0.1:4178/`. Usar un perfil nuevo exclusivo de pruebas, sin datos reales ni vinculación de cuenta. Para detener, Ctrl+C.

El [smoke existente](user-validation/preview-smoke.mjs), ejecutable desde raíz con `node --input-type=module < docs/product/user-validation/preview-smoke.mjs`, llegó a guardar una respuesta y esperar serviceWorker.ready; falló al buscar «Continua la pratica» tras cerrar y reabrir Home offline. [Fallo conservado](user-validation/preview-smoke-failure.txt). Falta diagnóstico de DOM, facts, URL, controller y cachés; no atribuirlo todavía a datos, aplicación o test. No presentar el entorno como listo hasta resolverlo.

## iPhone: condición confirmada, preparación pendiente

Una IP de LAN por HTTP no es contexto seguro para service workers/crypto.randomUUID. Hace falta HTTPS con certificado confiado en iPhone; aceptar una advertencia de certificado no es validación de confianza. Fuentes oficiales consultadas: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), [Apple: confianza SSL de certificados instalados](https://support.apple.com/en-us/102390), [mkcert](https://github.com/FiloSottile/mkcert).

`mkcert` no está instalado; OpenSSL sí. No se instalaron herramientas/certificados ni se modificó confianza, firewall o permisos. IP Wi-Fi observada: `192.168.0.20` (`ipconfig getifaddr en0`); puede cambiar. Configuración ya acepta `LT_VALIDATION_CERT` y `LT_VALIDATION_KEY` con rutas a archivos fuera del repositorio. Falta documentar y probar rama HTTPS de configuración, generación de certificado para IP/localhost, transferencia exclusiva de certificado CA público (nunca clave privada), instalación/confianza en iPhone, misma Wi-Fi, permisos de red/firewall y retirada posterior. No desplegar servicios externos.

## Protección y recuperación: comportamiento ya inspeccionado

Usar perfil normal dedicado a pruebas, no modo privado para evaluar persistencia. No importar datos reales ni vincular cuentas en ese perfil. Mantener mismo esquema/host/puerto al reanudar: cada origen conserva datos propios.

Impostazioni → Descargar respaldo exporta historial sin credenciales. Restaurar un respaldo **incorpora** registros, no elimina lo posterior; antes descarga respaldo actual y pide confirmación. Para volver exactamente a un checkpoint, usar perfil nuevo de pruebas e importar la copia allí. No borrar datos globales de Safari/navegador ni datos reales. Falta redactar instrucciones finales específicas para reinicio en iPhone y comprobar importación en este preview.

## Incidencias conocidas

| ID | Área | Descripción y pasos | Esperado | Observado | Severidad | Estado |
|---|---|---|---|---|---|---|
| V8-01 | Test Mixed | Suite completa con maxWorkers=2 | Todos los tests dentro del límite | Fase7 timeout bajo concurrencia; fase8 381/381 completos | P2 técnico | No reproducido en fase8; vigilar, sin cambio |
| V8-02 | Progreso | Responder solo Reading/Writing abierto y consultar Attività recente | Mensaje acorde al historial | Filtro por Concepts omite esos modos; historiales específicos conservados | P2 | Diferido; no pérdida conocida, sin corrección |
| V8-03 | Preview local/offline | Ejecutar preview-smoke.mjs, cerrar y reabrir Home offline | Enlace de continuación y borrador | Timeout buscando enlace; DOM/causa sin capturar | Sin clasificar | Investigar antes de entregar entorno; no P0/P1 confirmado |

Aviso de bundle >500 kB preexistente. No nuevos defectos de lanzamiento confirmados; no sustituye pruebas reales.

## Punto exacto de reanudación

1. Leer este checkpoint; conservar rama y cambios. No repetir suite 381/381 ni auditorías intactas.
2. Instrumentar y repetir el smoke existente del preview para resolver V8-03. Completar comprobación local de backup/restauración con perfiles desechables. Validar TLS del preview sin afirmar confianza real en iPhone.
3. Completar instrucciones exactas de HTTPS/iPhone y permisos; no instalar confianza ni servicios externos silenciosamente.
4. Redactar recorrido práctico de 60–90 minutos con acción/esperado/registro por paso: inicio, concepto/teoría, acierto/error, ayudas, progreso, Review, Mixed (preparación explícita), Reading, Writing, historial, cierre/reanudación, offline y móvil. Hoy no está redactado.
5. Crear `docs/product/A1_V1_LINGUISTIC_SAMPLE.md`: muestra pequeña con datos exactos de distintos bloques, Theory, actividades/feedback/variantes, R01/R25/R26, W-C01 y textos abiertos, riesgos/ambigüedades y formulario humano. Subagente `/root/linguistic_sample_v1` agotó uso sin entregar. Exportación temporal disponible `/tmp/a1-linguistic-exports.json` (~3,54 MB, claves pack/readings/writing/writingCorpus/controlled); extraer muestra, no añadir catálogo completo al repositorio ni repetir revisión editorial. Si desaparece, regenerar desde fuentes vigentes con esbuild.
6. Completar registro sencillo de incidencias y formulario de resultados reales; priorizar P0/P1. Revisar documentos/config, evidencias, Git y guardar commit local.
7. Entregar preparación y detenerse a esperar al usuario. No declarar superada fase8, publicar, push, merge, desplegar ni iniciar fase9.
