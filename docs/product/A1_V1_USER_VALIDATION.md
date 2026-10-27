# Language Trainer V1 — guía de validación real

Preparación completada el 2026-10-27. **Pruebas humanas y de iPhone pendientes; fase 8 no superada.** Esta guía permite decidir qué funciona, qué impide usar la aplicación y qué debe corregirse antes de lanzar. No añade contenido ni publica el catálogo.

## 1. Preparación en el Mac

Usa datos inventados y un perfil normal de navegador exclusivo para pruebas. Evita navegación privada para evaluar persistencia. No vincules una cuenta ni importes un respaldo real. Este servidor no sincroniza: el aviso «Identifica este dispositivo para sincronizar» es esperado. El guardado de práctica en el dispositivo sí debe funcionar.

En Terminal, copia este bloque completo:

```sh
cd /Users/sergiopardo/Desktop/language-trainer
export PATH=/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin:$PATH
VITE_ENABLE_CANDIDATE_CONTENT=true npm run build
npx vite preview --config docs/product/user-validation/preview.config.mjs
```

Abre **http://127.0.0.1:4178/**. Deja Terminal abierta. Para detener: Ctrl+C. Si ya existe un build de validación preparado y no has cambiado código, basta ejecutar la última línea con Node 22 en PATH. El Node antiguo del sistema no sirve; el proyecto requiere Node >=22.12.

Es un build con contenido de prueba; no se usa `npm run dev` para este recorrido porque el service worker solo se registra en build. Un build normal sin la variable de validación no muestra el contenido no publicado. Si el puerto está ocupado, el servidor falla explícitamente en vez de cambiar la dirección silenciosamente.

## 2. Acceso desde iPhone: preparación inicial con ayuda técnica

**HTTPS y confianza del certificado son necesarios.** `http://192.168…` no permite validar estas funciones PWA. La excepción de HTTP seguro en localhost corresponde al propio dispositivo; `localhost` en el iPhone no es el Mac. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

El camino local sencillo es **mkcert**, gratuito, sin desplegar servicios. Actualmente no está instalado. Una persona que administre el Mac debe realizar estos pasos manualmente. No se ha instalado ninguna raíz ni cambiado la seguridad del iPhone/Mac durante esta preparación. Si no quieres confiar un certificado local, puedes completar la prueba en el Mac y dejar iPhone/offline pendiente; no hace falta contratar un túnel o desplegar públicamente.

### Una vez: certificado para esta prueba

1. Con Homebrew ya disponible, instala la herramienta con `brew install mkcert`. Si no tienes Homebrew, usa una distribución oficial de [mkcert](https://github.com/FiloSottile/mkcert); no instales gestores nuevos sin decidirlo primero.
2. Conecta Mac e iPhone a la misma Wi-Fi privada. Consulta en el Mac la dirección de Wi-Fi, o ejecuta `ipconfig getifaddr en0` (si en0 no es Wi-Fi, usa la dirección mostrada en Ajustes del Sistema → Wi-Fi → Detalles → TCP/IP). Se observó `192.168.0.20`; **comprueba el valor actual**, puede cambiar.
3. Sustituye la IP de ejemplo por la actual y ejecuta:

```sh
lt_ip="192.168.0.20"
lt_cert_dir="$HOME/Library/Application Support/LanguageTrainerValidation"
mkdir -p "$lt_cert_dir/ca"
chmod 700 "$lt_cert_dir" "$lt_cert_dir/ca"
CAROOT="$lt_cert_dir/ca" mkcert \
  -cert-file "$lt_cert_dir/server.pem" \
  -key-file "$lt_cert_dir/server-key.pem" \
  localhost 127.0.0.1 "$lt_ip"
chmod 600 "$lt_cert_dir/server-key.pem"
```

No se ejecuta `mkcert -install`: no se modifica automáticamente la confianza del Mac. Los certificados quedan fuera del repositorio y de la carpeta servida. Envía por AirDrop al iPhone **solo** `ca/rootCA.pem`. **Nunca** envíes `rootCA-key.pem` ni `server-key.pem`; las claves permanecen en el Mac. La raíz de esta prueba puede firmar certificados: no la compartas con terceros.

4. En el iPhone acepta el perfil recibido. En Ajustes → General → VPN y gestión de dispositivos (o «Perfil descargado»), instala el perfil conscientemente. Después, Ajustes → General → Información → Ajustes de confianza de certificados: activa confianza total para esa raíz. Verifica que es la que acabas de generar. Una raíz instalada manualmente no obtiene confianza SSL automáticamente. [Instrucciones de Apple](https://support.apple.com/en-us/102390).

### Cada sesión: arrancar y abrir

Detén el servidor HTTP con Ctrl+C. En una terminal del proyecto, con el build preparado, ejecuta:

```sh
cd /Users/sergiopardo/Desktop/language-trainer
export PATH=/Users/sergiopardo/.nvm/versions/node/v22.23.3/bin:$PATH
lt_ip="192.168.0.20"
lt_cert_dir="$HOME/Library/Application Support/LanguageTrainerValidation"
LT_VALIDATION_HOST="$lt_ip" \
LT_VALIDATION_CERT="$lt_cert_dir/server.pem" \
LT_VALIDATION_KEY="$lt_cert_dir/server-key.pem" \
npx vite preview --config docs/product/user-validation/preview.config.mjs
```

En Safari del iPhone abre **https://192.168.0.20:4178/**, sustituyendo la IP si corresponde. Debe abrir **sin advertencia de certificado**. Saltar una advertencia no demuestra HTTPS válido para la PWA. Puedes usar Compartir → Añadir a pantalla de inicio; registra si pruebas Safari o la aplicación añadida y no presupongas que ambos comparten almacenamiento.

El servidor escucha únicamente en la IP elegida, no en `0.0.0.0`. No abras puertos en el router, no actives reenvío de puertos ni túneles públicos. Mientras esté activo, otros equipos con acceso a esa red pueden alcanzar esa IP: usa una red privada de confianza y detenlo al acabar. Si macOS pregunta por conexiones entrantes/red local para Node, autorízalas solo para esta prueba; no desactives todo el firewall. Una red de invitados puede aislar dispositivos; usa otra red privada o deja la prueba pendiente. VPN/permisos de red también pueden impedir la conexión. Mantén el Mac despierto durante el uso online.

Si cambia la IP, emite de nuevo el certificado para esa IP, manteniendo la misma CA. La nueva dirección es otro origen con otro almacenamiento: conserva la anterior o importa una copia de prueba. Al terminar definitivamente, elimina en el iPhone el perfil de esa raíz de prueba y detén el servidor. No elimines perfiles ajenos.

**Límite explícito:** se comprobó HTTPS con verificación de certificado/nombre en loopback, sin instalar confianza del sistema. La conexión Wi-Fi, instalación de raíz y confianza en iPhone requieren todavía tu ejecución. La revisión automática del entorno rechazó escuchar en todas las interfaces; se sustituyó por loopback por defecto y selección explícita de IP. No se ejecutó exposición LAN como parte de las pruebas automáticas.

## 3. Antes del recorrido

Reserva **unos 80 minutos**, sin contar la configuración inicial del certificado. Usa el mismo dispositivo y dirección durante el recorrido. Si empiezas en Mac y sigues en iPhone, no esperes sincronización: comienza otro perfil o transfiere **solo un respaldo de prueba** mediante los controles descritos abajo.

Anota fecha, dispositivo, versión de iOS/navegador, dirección y si usas Safari o pantalla de inicio. No uses nombres ni textos sensibles. Para cada fila marca **OK / fallo / no probado**. Un resultado no probado queda pendiente, nunca se considera aprobado.

Para registrar cualquier fallo usa [el registro de incidencias](A1_V1_VALIDATION_ISSUES.md): número de paso, pantalla, texto exacto escrito/elegido, pasos, esperado, observado, hora y captura si ayuda. Si parece perderse información, detén la prueba, no borres nada y guarda un respaldo si todavía puedes.

## 4. Recorrido práctico (80 minutos)

| Paso y tiempo | Qué hacer | Qué debería ocurrir | Señal de fallo y qué registrar |
|---|---|---|---|
| 1 · Primer acceso · 4 min | Abre la dirección de prueba en un perfil nuevo. Recorre Home, Biblioteca, Pratica y Progressi. | Pantallas legibles y navegación operativa; sin prácticas previas. Aviso de sincronización permitido en este entorno. | Pantalla vacía, enlaces inactivos o historial inesperado: registra dirección, perfil y pantalla; no borres datos. |
| 2 · Teoría · 5 min | En Biblioteca abre «Il presente di essere» (C04-01). Lee tabla, ejemplos y errores frecuentes. También puedes añadir `/concept?id=it-a1-c04-01` a la dirección. | Explicación comprensible, tabla visible; leer no equivale a acertar ni dominar el concepto. | Texto cortado/ambiguo o promesa de dominio: registra frase y C04-01. |
| 3 · Práctica y feedback · 8 min | Pulsa Inizia la pratica. En el ejercicio de «io», elige «sei» y Controlla. Lee la corrección. Pulsa Riprova y elige «sono». Continúa 2–3 ejercicios; no hace falta completar todo el banco. | Error explícito primero; reparación correcta conservando que ya viste ayuda/corrección. Feedback coherente con lo enviado. | Respuesta perdida, doble intento por un envío, error sin explicación o reparación contada como independiente: anota consigna y ambas respuestas. |
| 4 · Ayudas · 4 min | En otro ejercicio pide Rivedi la teoria o Mostra un aiuto. Vuelve al ejercicio y responde. Termina la sessione. | Borrador conservado; ayuda registrada; resumen de respuestas enviadas, sin penalizar ausencia de intentos. | Borrador cambia, ayuda no se registra o resumen duplica: captura antes/después y consigna. |
| 5 · Progreso · 4 min | Abre Vedi i progressi / Progressi. Busca el concepto trabajado y las observaciones. | Diferencia errores, aciertos y respuestas asistidas; no presenta porcentaje de dominio. | Cantidades incompatibles o información contradictoria: registra resumen y progreso juntos. |
| 6 · Review · 5 min | En Pratica busca Ripasso para el concepto estudiado, entra con Ripassa e Inizia il ripasso. Responde y termina. | Hay motivo del repaso, feedback e historial; repetir soluciones vistas no certifica retención. | No permite entrar tras estudiar/responder, atribuye mal objetivo o pierde resultado: registra concepto/motivo. |
| 7 · Mixed · 10 min | En Biblioteca consulta «Io, tu, lui, lei, noi, voi, loro» (C03-01), «Il presente di avere» (C05-01), «Sono stanco, sono pronta» (C04-05) y «Ho fame, ho sete» (C05-04); C04-01 ya está visto. Vuelve a Pratica → Pratica mista, inicia y responde la sesión. Si indica otra preparación, sigue sus enlaces. | Se habilita un grupo preparado; mezcla objetivos sin anticipar su teoría; resumen atribuye cada respuesta a su objetivo. Leer la preparación no acredita dominio. | Sigue bloqueado tras consultar toda la preparación indicada, se pierde una respuesta o la atribución es incorrecta: registra lista de preparación y ejercicios. |
| 8 · Reading · 9 min | Home → Letture A1 → «Chi è Chiara?» (R01). Si aparece Preparati, sigue los enlaces pendientes y vuelve. Lee, responde sus tres preguntas, pide Vocabolario e aiuto y termina. | Texto accesible al responder; ayuda visible; resultado de comprensión separado de gramática. | Texto cortado, pregunta no resoluble, ayuda borra respuesta o progreso gramatical artificial: anota R01 y pregunta. |
| 9 · Writing · 9 min | Home → Scrittura A1 → 3 · Messaggi guidati → «Un nuovo gruppo». Consulta preparación pendiente. Escribe un mensaje inventado de 3–4 frases, usa Rileggi il testo, pide ayuda y envía. | Guarda párrafos, permite relectura y explica que el texto abierto no se evalúa automáticamente. No inventa una nota ni acredita dominio. | Texto truncado, corrección automática injustificada o aviso incomprensible: copia mensaje, consigna y feedback. |
| 10 · Historial · 4 min | Termina Writing y vuelve a su lista; abre Rivedi. En Reading abre Riepilogo. En Pratica comprueba resúmenes de Review/Mixed. | Textos y respuestas recuperables en cada historial. La cronología general tiene el P2 conocido descrito abajo. | Falta un resumen específico o cambian respuestas: registra modo, título y fecha. |
| 11 · Cierre y recuperación · 5 min | Inicia otra práctica o Writing, escribe sin enviar y espera «Pratica salvata su questo dispositivo». Cierra la pestaña/app y vuelve a la **misma dirección y contexto**. Abre Continua. | Borrador y ayudas conservados; puedes seguir sin repetir lo ya enviado. | Falta el borrador o aparece otro: anota el texto, si viste guardado y cómo cerraste/abriste. |
| 12 · Offline · 7 min | Sigue la secuencia detallada de la sección siguiente: visita online, recarga, guarda borrador, desconecta realmente, cierra/reabre, responde y recarga. | Inicio, recursos y sesión accesibles sin red; guardado local y feedback sobreviven. | Solo funciona sin recargar, pantalla vacía o datos ausentes: registra pasos exactos, conexión y aviso de guardado. |
| 13 · iPhone y respaldo · 6 min | En iPhone prueba teclado, desplazamiento, giro, botones inferiores y párrafos largos. Descarga un respaldo de prueba y guárdalo en Archivos. | Controles alcanzables con teclado, sin desplazamiento horizontal obligado; archivo de copia disponible. | Botón tapado sin posibilidad de desplazar, zoom ilegible, copia no descargada: registra orientación, teclado y captura. |

Si alguna parte consume más tiempo, detén el recorrido a los 90 minutos y marca el resto «no probado». La revisión lingüística cualificada se realiza aparte con la [muestra seleccionada](A1_V1_LINGUISTIC_SAMPLE.md); no es obligatorio hacerla en estos 80 minutos.

## 5. Offline, paso a paso

1. Con red y servidor activo, abre la app, espera a que termine de cargar y recarga una vez. Visita la práctica elegida. No pruebes el primer acceso de un dispositivo nuevo sin red.
2. Escribe un borrador inventado y espera el aviso de guardado. Si aparece «No se ha podido preparar el inicio sin conexión», registra incidencia y no des por preparada la caché.
3. En iPhone activa modo avión **y comprueba que Wi-Fi y datos móviles estén desactivados** (iOS puede conservar Wi-Fi). En Mac desconecta Wi-Fi/Ethernet, sin cambiar la dirección.
4. Cierra la pestaña y vuelve a abrir la misma URL o la misma app de pantalla de inicio. Comprueba Home → Continua, borrador y ayudas. No alternes Safari/pantalla de inicio para esta prueba.
5. Envía una respuesta, recarga y comprueba feedback. Vuelve a conectar y comprueba que no desaparece. En este entorno no habrá sincronización remota, pero el guardado local debe permanecer.
6. Resultado: OK solo si también sobrevivió a recarga y reapertura. No borrar caché ni datos para «arreglar» un fallo antes de registrarlo.

## 6. Reiniciar pruebas y recuperar una copia sin tocar datos reales

En Impostazioni → **Descargar respaldo**, guarda el JSON con nombre y fecha (por ejemplo `prueba-antes-offline.json`). Contiene tus textos, aunque no credenciales. No lo publiques. **Restaurar un respaldo incorpora registros; no revierte ni elimina intentos posteriores.** El diálogo avisa y descarga una copia del estado actual antes de importar.

Para empezar de cero sin borrar nada, detén el servidor y vuelve a arrancar el mismo comando de preview añadiendo `--port 4179`. Abre la dirección terminada en `:4179`. El certificado sigue siendo válido porque el puerto no forma parte de su nombre. Ese puerto es otro origen: tendrá progreso nuevo. Conserva `:4178` para regresar a los datos anteriores. Nunca uses esta técnica para ocultar una pérdida de datos; registra primero la incidencia.

Para restaurar un checkpoint exacto: en el origen nuevo y vacío abre Impostazioni → Restaurar un respaldo, elige **la copia de prueba**, lee el diálogo y confirma. Recarga y comprueba historial/borrador. Importar sobre un historial con datos mezcla hechos, no hace rollback. Otra opción en Mac es un perfil nuevo de navegador dedicado a pruebas.

Si ya utilizaste el preview anterior con el fallo offline, sus respuestas antiguas pueden seguir en caché: vuelve online, exporta la copia de prueba y usa el nuevo puerto/perfil para preparar una caché limpia con la configuración corregida. El cambio de cabeceras no obliga a renovar automáticamente una caché ya instalada.

No uses «borrar todos los datos de Safari» ni borres la base desde herramientas de desarrollador. En iPhone no hace falta eliminar datos del sitio: usar otro puerto protege el estado anterior. Cambiar IP/esquema también crea otro origen, por eso debes anotar la URL exacta de cada prueba.

Si el problema está en el entorno, detén el servidor y conserva respaldos/orígenes. El código de aplicación sigue siendo el integrado; no hacen falta resets de Git ni reinstalar la app. Informa del fallo antes de reconstruir o limpiar cachés.

## 7. Resultado técnico de preparación

**V8-03 resuelto en el preview.** Reproducido con perfil nuevo: HTML offline presente, controlador y caché activos; JS/CSS precacheados devolvían `net::ERR_FAILED`. Las respuestas del preview tenían `Vary: Origin`. Desactivar CORS en este servidor de recursos del mismo origen elimina esa variación y el mismo recorrido pasa. No se modificaron service worker, IndexedDB, motores ni datos. [Diagnóstico](user-validation/OFFLINE_DIAGNOSIS.md).

El [smoke focal](user-validation/preview-smoke.mjs) verifica arranque, API aislada (401), borrador, cierre/reapertura offline, igualdad exacta de hechos, feedback tras recarga y exportación/importación en un perfil vacío: [resultado](user-validation/preview-smoke.json). Usa build y service worker reales; no se inyectan hechos. Simula desconexión en Chrome, no expulsión de almacenamiento ni cierre del proceso físico del iPhone.

[HTTPS loopback](user-validation/https-check.json): certificado y nombre verificados con confianza solo en el cliente de prueba; sin instalar raíces. No se declara confianza SSL ni funcionamiento offline comprobados en iPhone físico.

381/381 tests, 22 suites en la ejecución completa previa de fase8; Mixed no reprodujo timeout. Se conserva [el log](user-validation/unit-full.log). No repetida esa batería ni auditorías intactas por cambios solo en preview y documentación. No P0/P1 conocidos nuevos; queda P2 de cronología general y el aviso preexistente de bundle >500 kB. El registro distingue fallos, limitaciones y pruebas humanas pendientes.

## 8. Qué devolver al terminar

Envía el [registro](A1_V1_VALIDATION_ISSUES.md) con OK/fallo/no probado por paso, dispositivo/contexto/URL, incidencias reproducibles y tu decisión provisional: **listo para revisar lanzamiento / necesita correcciones / faltan pruebas**. La persona cualificada devuelve además la tabla de la muestra lingüística.

Rama `feat/a1-v1-validation`, desde `9f72bcc`, checkpoint `81a2301`; commit de preparación final indicado en la entrega. Árbol limpio al entregar. `dist` queda de validación local, contenido editorial sigue sin publicar. No push, merge, despliegue ni fase9. **Preparación terminada; se espera tu validación real antes de decidir el lanzamiento.**
