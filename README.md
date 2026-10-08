# Language Trainer

Base técnica de una PWA personal para italiano A1, con interfaz en español. La V1 prevista mantiene **todo el currículo A1 del proyecto**. La Fase 2 añade práctica focal, evaluación canónica y progreso por dimensiones. No hay contenido publicado ni acreditación de dominio estable; el lote `candidate` es exclusivamente de validación técnica.

## Requisitos y arranque

Node **22.12+**, npm y un sistema compatible con el runtime de Cloudflare ([macOS 13.5+ o Linux compatible](https://developers.cloudflare.com/workers/wrangler/install-and-update/)). `.nvmrc` fija Node 22. No se requiere cuenta Cloudflare para desarrollar con D1 local.

```sh
npm ci
npm run secrets:local
npm run build
npm run db:migrate
npm run dev:api
```

En otra terminal:

```sh
npm run dev
```

Abre `http://localhost:5173`. El proxy `/api` conserva el mismo origen. En **Ajustes**, introduce el código local mostrado por `secrets:local`. El script crea `.dev.vars` con un propietario estable y el hash del código; no sobrescribe un archivo existente. Guarda el código y no cambies `OWNER_ID` después de vincular dispositivos. `.dev.vars.example` documenta los secretos; el cliente no necesita variables de entorno ni credenciales.

Para comprobar la PWA de producción, detén el servidor API y ejecuta `npm run preview`; abre `http://localhost:8787`. El service worker se registra solo en producción. Tras una primera carga completa, las cuatro rutas y los borradores guardados funcionan offline. La instalación depende del soporte del navegador; en iOS se usa «Añadir a pantalla de inicio». Una actualización del shell se aplica al cerrar las pestañas antiguas y volver a abrir.

macOS 12 no ejecuta el runtime actual de Cloudflare. Allí puede usarse Vite para el shell y el servidor **solo de pruebas** descrito abajo para validar flujos; para desarrollo nativo D1 hace falta un sistema compatible. No rebajar la seguridad o reemplazar D1 en producción para sortear esta limitación.

## Estructura

```text
src/ui/             Shell, Home, Practice, Library, Progress y ajustes
src/learning/       Sesiones focales persistentes y selección de actividades
src/exercises/      Actividades y evaluación canónica sin llamadas externas
src/evidence/       Observaciones y proyecciones reconstruibles por dimensión
src/review/         Contrato del planificador de repaso
src/content/        Catálogo versionado y fixture candidate; nada publicado
src/persistence/   IndexedDB: identidad, hechos y outbox transaccional
src/sync/          Autenticación, envío, descarga, reintentos y estados
shared/            Contrato validado de transporte, versiones y hash
worker/            API privada, sesiones y acceso D1
migrations/        Esquema SQL inicial
public/, scripts/  Manifest, iconos, precaché y herramientas locales
tests/            IndexedDB, protocolo, SQL y flujos de navegador
```

TypeScript + Vite, DOM nativo e `idb` como envoltorio pequeño de IndexedDB. No hay framework UI, IA en ejecución ni servicios de pago. El motor focal está implementado; Mixed, Review avanzado, Error Learning y Reading/Writing extensos quedan fuera de esta fase, pero siguen dentro de V1.

## Validar el motor de Fase 2

`candidate → reviewed → published`: desarrollo y testing pueden usar candidatos; la revisión editorial independiente condiciona la publicación definitiva, no la implementación. El fixture incluye C03-01/C04-01 y seis actividades, sin cubrir por completo esos conceptos ni reducir V1.

En `npm run dev` está habilitado. Para probar la PWA offline y los E2E de aprendizaje:

```sh
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e
```

Recorrido: Biblioteca → elegir concepto → Iniciar práctica → responder/ver pista → comprobar/reintentar → avanzar → resumen → progreso. Practicar lista sesiones y versiones concurrentes. Respuesta, ayudas y corrección sobreviven a la recarga. Los borradores de intención anteriores siguen disponibles. Las respuestas fuera del criterio se declaran no evaluables; las vacías no aportan evidencia. La política provisional separa observaciones por dimensión, asistencia e ítems distintos; no demuestra dominio estable ni retención. No utiliza IA ni llamadas externas para corregir.

Un build normal excluye candidate del catálogo y de las proyecciones. Para comprobarlo:

```sh
npm run build
E2E_PRODUCTION=1 PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 npm run test:e2e -- --grep 'production build'
```

## Historial y sincronización

- Hecho y outbox se guardan en una transacción IndexedDB. UUID, dispositivo, secuencia, versiones, referencias y revisiones mantienen procedencia; el servidor deriva el propietario de la sesión.
- El esquema remoto incluye propietarios, dispositivos, sesiones de acceso, hechos, referencias y recibos. El contrato valida borradores antiguos y hechos tipados de sesión de práctica, estado, intento, evaluación y evidencia. Los envíos se guardan atómicamente con su corrección y cambio de estado. El transporte, las tablas D1 y la versión IndexedDB no cambian; las ayudas quedan registradas en estados y las exposiciones previas se enlazan desde intentos. No se aceptan payloads arbitrarios como evidencia.
- Cada operación admite hasta 10 hechos y 128 KiB. El Worker valida referencias/versiones y D1 confirma hechos + recibo en un batch atómico. Mismo ID/contenido se deduplica; contenido diferente produce 409 y se conserva en la outbox, sin sobrescribir historia.
- Descarga paginada de 100 hechos por cursor de servidor; aplicación y cursor se confirman juntos localmente. Guardado, apertura, reconexión, regreso a la pestaña y acción manual disparan sincronización; hay backoff con variación y exclusión entre pestañas. No se promete sincronizar con la PWA cerrada.
- Las revisiones conservan su base. Dos ramas de un borrador se muestran como alternativas; elegir una no borra la otra. Un lote rechazado se aparta y permite avanzar otros independientes; Ajustes permite reintentar.
- Exportación/importación JSON es respaldo secundario: valida propietario, versión, IDs y referencias; ofrece vista previa y descarga del estado previo; incorpora por unión. Conserva procedencia original y nunca importa credenciales ni puntuaciones derivadas.
- La caché PWA contiene solo el shell público, nunca respuestas `/api`. No hay garantía de conservación frente al borrado de datos del navegador: sincroniza o exporta antes de borrarlos.

## Acceso y Cloudflare

Un propietario, código privado aleatorio de alta entropía, sesiones por dispositivo con cookie Secure/HttpOnly/SameSite=Strict y vencimiento de 30 días. Solo el hash del token se guarda en D1. Las mutaciones exigen Origin exacto y JSON; el acceso limita intentos por IP/ventana. Ajustes permite cerrar o revocar acceso; no borra copias offline. Reautenticar conserva identidad y outbox. El código no se guarda en el navegador, backup ni logs de la aplicación.

**No se ha creado ni desplegado ningún recurso remoto.** `database_id` contiene un marcador para el desarrollo local. Para desplegar, desde un sistema compatible y una cuenta en plan gratuito:

1. Comprueba las cuotas compartidas de la cuenta. No actives un plan de pago.
2. `npx wrangler login` y `npx wrangler d1 create language-trainer`.
3. Sustituye únicamente el `database_id` de `wrangler.jsonc` por el recibido.
4. Provisiona un UUID estable con `npx wrangler secret put OWNER_ID` y el SHA-256 de un código aleatorio de al menos 32 bytes con `npx wrangler secret put ACCESS_CODE_SHA256`. Usa valores propios de producción, no el código de pruebas. Conserva el código en un gestor de contraseñas. D1 es un binding privado del Worker.
5. `npx wrangler d1 migrations apply language-trainer --remote`.
6. `npm run build` y `npx wrangler deploy`.
7. Comprueba bajo HTTPS acceso, migración, sincronización entre dispositivos y arranque offline antes de dar por validado el despliegue.

Rotar el código implica cambiar su hash **conservando OWNER_ID**. Las sesiones existentes se revocan por dispositivo. No hay un sistema multiusuario ni endpoint SQL público.

Referencias oficiales: [assets y routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/), [batch D1](https://developers.cloudflare.com/d1/worker-api/d1-database/), [límites D1](https://developers.cloudflare.com/d1/platform/limits/).

## Comprobaciones

```sh
npm run check           # tipos, pruebas con SQLite/IndexedDB y build
npm run format:check    # formato del código de esta fase
npm run test:cloudflare # misma batería API con Miniflare/D1 nativo
npx playwright install chromium
# Con D1 local migrada y .dev.vars configurado:
E2E_ACCESS_CODE='<código local>' npm run test:e2e
```

`test:e2e` arranca y detiene su propio servidor en 8787; ese puerto debe estar libre. El código se pasa solo al proceso de prueba. Si se omite, se omite explícitamente la prueba autenticada entre dispositivos.

Alternativa **solo de pruebas** usada en macOS 12:

```sh
PLAYWRIGHT_CHANNEL=chrome E2E_NODE_FALLBACK=1 E2E_ACCESS_CODE=local-test-only npm run test:e2e
```

Ejecuta el mismo Worker y SQL con SQLite en memoria, código exclusivo de prueba y Chrome instalado. No usa Cloudflare remoto, no conserva una base de desarrollo y no acredita compatibilidad del runtime D1. `npm test` usa ese adaptador SQLite y `fake-indexeddb`; `test:cloudflare` usa Miniflare. La API de SQLite de Node 22 muestra un aviso experimental solo en este harness.

Base previa verificada: 26 pruebas locales, 2 E2E con Chrome, auditoría y empaquetado de Worker. Fase 2 verificada: 36 pruebas locales, 5 E2E del build candidate y 1 E2E del build normal que comprueba su exclusión; tipos, formato, builds y revisión visual móvil correctos. Las pruebas entre navegadores usan Worker + SQLite local, no Cloudflare remoto. La batería `test:cloudflare` falla al arrancar por macOS 12; sus 10 pruebas quedan sin ejecutar. El despliegue real y la validación humana del shell quedan pendientes. `sharp` está fijado mediante override en 0.35.5 para resolver el aviso de seguridad transitivo de las herramientas Cloudflare; revisar al actualizar Wrangler.
