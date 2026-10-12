# Hallazgos de cobertura A1 — 2026-10-12

Comprobación acotada al alcanzar 99/99 en `it-A1-candidate-8`, baseline `1e4afa3`. No constituye revisión editorial ni certificación de suficiencia. Las señales numéricas sirven para priorizar una fase posterior; no son umbrales científicos de aprendizaje. No se corrige automáticamente contenido previo.

| Comprobación | Resultado | Clasificación / acción posterior |
|---|---|---|
| Inventario, Theory, práctica y referencias | 99 conceptos / 99 fichas; 0 huecos y 0 errores de validación | Comprobado; no equivale a publicación |
| Muy pocas actividades | 0 conceptos con menos de 6; 21 con 6–7, todos anteriores a C26; nuevos con 8–11 | Reserva reducida, no fallo automático; ampliar oportunidades distintas según facetas |
| Sin retrieval explícita | C03-02 | Hecho confirmado; tiene transformación/discriminación/producción, revisar si necesita recuperación independiente |
| Sin controlled-production | C01-01, C01-02, C01-03, C05-01, C07-01, C07-02, C13-01, C30-01, C31-01, C31-02 | Forma/grafía, género léxico, numerales, comprensión de instrucciones y participios pueden justificar otras habilidades; revisar especialmente C05-01 sin inferir ausencia de uso posterior |
| Theory sin ejemplos | 0 | Comprobado |
| Conceptos sin relaciones | 0 | Comprobado |
| Vocabulario huérfano | 0 de 316 entradas | Comprobado por asociaciones; una asociación no acredita práctica de todos los sentidos |
| Enunciados exactamente repetidos | C09-01-studente / C10-01-studente | Hecho confirmado previo; revisar contexto de artículo determinado/indeterminado, no se modifica en esta fase |
| Repeticiones exactas nuevas | 0 | No garantiza diversidad semántica de cada patrón |
| Variantes aceptadas numerosas (>8) | C05-03-trenta (12), C34-01-professione (10) | Inspeccionadas: variantes de sujeto, elisión/apóstrofo, artículo y punto final; no se detectó aceptación de significados erróneos en ellas |
| Provenance/versionado/trace ausentes | 0 actividades | Comprobado en las 849 actividades |
| Editorial | 99 conceptos, 99 Theory, 316 entradas, 849 actividades y 2 templates candidate | Comportamiento esperado: no reviewed/published; 0 ready |

Conceptos con 6–7 actividades: C01-02, C01-03, C02-01, C02-02, C02-03, C03-02, C04-02, C04-03, C04-04, C04-05, C05-02, C06-01, C06-02, C07-01, C07-02, C08-01, C08-02, C09-03, C10-02, C11-02, C14-02.

## Límites de la práctica nueva

- C32-02 contiene varios huecos para auxiliar; la repetición es funcional al contraste por construcción, pero la reserva para nuevos contextos diferidos es limitada. C31 recupera varios participios con un formato compartido, sin hacer pasar esa tarea por dominio del pasado.
- La producción es controlada: algunas consignas aportan la estructura o un infinitivo. No demuestra escritura autónoma. C34 declara repertorios focales; la práctica de algunas entradas de apoyo y sentidos es indirecta. Conviene contrastar cada repertorio con muestras nuevas antes de la aprobación editorial.
- Las respuestas aceptadas son listas finitas. Acentos y apóstrofos significativos se conservan; variantes tipográficas previstas son explícitas. Una alternativa válida no enumerada puede quedar `not-evaluable`, no se convierte en error por similitud. No se hizo una auditoría exhaustiva de todas las paráfrasis.
- Los tests confirman contratos y casos lingüísticos seleccionados, no naturalidad de todas las frases ni eficacia pedagógica. Reading/Writing extensos, Review diferido y CC1–CC10 completos siguen en sus fases.

## Deuda técnica y entorno

- Persiste aviso Vite de chunk >500 kB: aproximadamente 667 kB minificados / 145 kB gzip en este lote. Build y carga funcionan. No se optimiza aquí por instrucción de alcance.
- Node 22.23.3 requerido en esta máquina; el Node antiguo del terminal falla antes de ejecutar coverage.
- Cloudflare remoto/nativo no ejecutado. E2E usa el fallback local Worker/SQLite; no acredita un despliegue real.
- Validación humana y revisión editorial independiente pendientes. No iniciar automáticamente revisión, publicación ni otra fase.
