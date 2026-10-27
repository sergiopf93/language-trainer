# Registro de validación V1

**Resultados humanos pendientes.** No convertir mejoras opcionales en bloqueantes.

Sesión: fecha ____ · persona ____ · dispositivo/SO/navegador ____ · Safari/pantalla de inicio ____ · URL/puerto ____ · commit ____.

| Paso de guía | OK / fallo / no probado | Incidencia relacionada / comentario |
|---|---|---|
| 1–13 (crear una fila por paso al probar) | No probado | Pendiente de usuario |

## Incidencias conocidas

| ID | Pantalla/función | Descripción y pasos | Esperado | Observado | Severidad | Estado |
|---|---|---|---|---|---|---|
| V8-01 | Test Mixed | Ejecutar suite completa maxWorkers=2 | 381 casos correctos | Timeout en fase7 bajo concurrencia; fase8 completa 381/381 en 59,62 s | P2 técnico | No reproducido; sin aumento de timeout; vigilar |
| V8-02 | Progressi / Attività recente | Responder solo Reading/Writing abierto y abrir cronología general | Mensaje coherente con todo el historial | Filtro por Concepts excluye esos modos y puede decir que no hay respuestas; historiales específicos sí conservan datos | P2 | Diferido; no corregido ni pérdida de datos conocida |
| V8-03 | Preview offline | Guardar, cerrar pestaña, reabrir sin red | App y borrador disponibles | Antes fallaban JS/CSS con Vary: Origin; tras cors:false pasa recuperación y respaldo | P1 del entorno de validación | Resuelto; no defecto de persistencia |
| V8-04 | iPhone HTTPS | Configurar CA de prueba y abrir IP del Mac por Wi-Fi | Certificado válido y PWA operativa | TLS loopback comprobado; confianza/iPhone real aún sin probar | Limitación, sin severidad de defecto | Pendiente de usuario; no instalación automática |
| V8-05 | Carga inicial | Abrir en móvil/red real | Inicio razonable | Bundle ~1.075 kB / 218 kB gzip; medidas previas locales no prueban red móvil | Riesgo, no bloqueo demostrado | Observar; sin optimización anticipada |

## Plantilla de nueva incidencia

- ID y paso de guía:
- Pantalla o funcionalidad / ID del ejercicio:
- Descripción:
- Pasos para reproducir (incluye respuesta exacta y conexión):
- Resultado esperado:
- Resultado observado:
- Datos conservados / posible pérdida / desconocido:
- Captura y hora (sin información personal):
- Severidad propuesta:
- Estado / responsable / resultado al repetir:

**P0:** impide usar o riesgo de pérdida de datos. **P1:** función esencial gravemente afectada. **P2:** defecto menor con recorrido alternativo. **P3:** mejora opcional. Si no sabes clasificar, escribe «por revisar»; un problema sospechoso no es un fallo confirmado.

Estados: nueva → por reproducir → confirmada → corregida → verificada; o diferida/no reproducida. Ante posible pérdida, no borrar datos: guardar copia y detener el paso afectado.

## Decisión humana

Recorrido completado: pendiente. Revisión lingüística: pendiente. P0/P1 abiertos: por valorar tras pruebas reales. Decisión de lanzamiento: **pendiente**, sin autorización implícita de publicación/merge/despliegue.
