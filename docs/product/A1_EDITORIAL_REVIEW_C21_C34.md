# Fase 5B.4 — C21–C34: punto de reanudación

**INCOMPLETA. Detenida por límite de uso del revisor independiente, sin dictamen.** Fecha: 2026-10-14. No se cierra el proceso editorial A1 ni se aprueba el lote. Este documento es un informe de avance y reanudación, no el informe final de cierre.

## 1. Conceptos revisados inicialmente

R2 realizó la lectura inicial de los 38 conceptos C21–C34. La revisión cruzada sigue pendiente en todos ellos. Inventario exacto de Theory y selección independiente en [manifest.json](editorial-cross-review-c21-c34/manifest.json).

## 2. Theory

38 fichas leídas; una corregida: C34-06, que presentaba una oposición incorrecta entre al centro como destino e in centro como ubicación. In centro también indica destino. Versión nueva theory-c34-06-1-editorial-1. La construcción está documentada en [Treccani, centro](https://www.treccani.it/vocabolario/ricerca/centro/Sinonimi_e_Contrari/).

## 3. Actividades

346 actividades leídas inicialmente, sin muestreo. 46 actividades modificadas hasta congelar los paquetes. Se conservan IDs y se incrementan versiones; el materializador propaga criterio y trace. Las correcciones aún no tienen aprobación independiente.

## 4. Vocabulario y relaciones

226 entradas vinculadas y 85 relaciones incidentes leídas. Sin modificaciones. C34 mantiene siete ámbitos transversales; no se amplía repertorio ni funciones. El total global permanece en 316 entradas y 210 relaciones.

## 5. Accepted answers

Cuatro listas modificadas: C22-03-periodica (a/alla/la settimana), C27-01-mele (chilogrammo), C34-02-camera (stanza) y C34-06-andare (in stazione). Las variantes ausentes en criterios no exhaustivos producían abstención: no se acreditan como falsos rechazos. **Revisar su clasificación final como mejora opcional frente a ambigüedad**, sin ampliar indiscriminadamente listas.

## 6. Hallazgos lingüísticos

[Registro inicial por entidad](A1_EDITORIAL_CHANGES_C21_C34.json): problema, evidencia literal anterior, gravedad, propuesta, campos y decisión provisional. Incluye la regla locativa C34-06, contracción ai libri y consignas con respuestas entregadas. Las decisiones del registro siguen pendientes de contraste; no son aprobaciones.

## 7. Ambigüedades

Se delimitan referencia del destinatario, negación simple, vocativo frente a sujeto y datos de nacionalidad. Se retiran rechazos indiscriminados de fechas con di y de del tras un po’. [Treccani documenta un po’ del](https://www.treccani.it/vocabolario/ricerca/p%C3%B2/); esa posibilidad exige considerar referencia, no declarar siempre incorrecta la combinación.

## 8. Dictamen independiente

**No existe dictamen.** Se convocó `/root/italian_independent_c21_c34` con `fork_turns: none`, únicamente criterios y paquetes. Recibió 38 Theory y 291 actividades: todas las modificadas, primera actividad por formato/concepto y cobertura íntegra de C27 y C32–C34. Las 55 no seleccionadas están enumeradas. El revisor comunicó avance C21–C25, pero terminó con error de límite de uso, sin guardar dictamen. No se acredita revisión cruzada parcial ni resultados inventados. Detalle en [resume.json](editorial-cross-review-c21-c34/resume.json).

## 9. Pendientes concretos

- Reiniciar revisión independiente aislada sobre los 14 paquetes congelados; no regenerarlos ni exponer antes las conclusiones de R2.
- Tras el dictamen, resolver hallazgos y someter nuevas versiones al mismo revisor como seguimiento explícito.
- Observación de R2 al revisar el diff, todavía sin corregir: C24-01-richiesta introduce la palabra española bolígrafo dentro de la consigna italiana; corregir y enviar al seguimiento.
- Revisar la precisión de las nuevas consignas de hora C22-04 (15 admite quindici y tre), C34-05-pausa y la clasificación de variantes que antes producían abstención. No se declaran resueltas anticipadamente.
- Completar trazabilidad final por versión, recibos, integración y tests de cobertura independiente antes de cualquier reviewed.

## 10. Estados editoriales resultantes

Ninguna promoción: C21–C34 permanece con 38 candidate. No se emiten recibos nuevos.

## 11. Recibos y trazabilidad

Se preservan los 61 recibos anteriores; auditoría editorial sin errores y huellas vigentes. Los 14 paquetes se guardan con SHA-256 y sus hashes se comprobaron al guardar este punto. No cambia infraestructura editorial. Antes de aprobar habrá que comprobar invalidación ante cambios de actividades, Theory, vocabulario y relaciones con las pruebas existentes y el lote nuevo.

## 12. Tests y validaciones

- Typecheck: correcto.
- Primera ejecución general: 272/273 tests correctos, 14/15 suites correctas. El fallo era una búsqueda por sufijo en el test C26–C34 que confundía medico con cita-medico; se corrigió para comparar el ID completo.
- Repetición afectada tras corregir el test: **32/32 pruebas correctas** en curriculum-c26-c34.test.ts.
- Coverage curricular: 99/99 presentes, 0 listos para producción.
- Auditoría pedagógica: sin errores estructurales, conflictos de respuestas, ciclos, relaciones duplicadas ni prerrequisitos adelantados. Las heurísticas no acreditan corrección lingüística.
- Auditoría editorial anterior: 61 recibos vigentes, sin errores.
- Formato de los 11 archivos de contenido modificados y del test: correcto. git diff --check: correcto. Diff revisado; no cambios en C01–C20, vocabulario, relaciones, evaluador o interfaz.
- Build, integración de nuevos recibos y comprobación final global pendientes. No se ejecutan E2E generales: no cambia el flujo de aplicación.

## 13. Estado global C01–C34

| Entidad | reviewed | candidate | published |
| --- | ---: | ---: | ---: |
| Conceptos | 61 | 38 | 0 |
| Theory | 61 | 38 | 0 |
| Actividades | 519 | 346 | 0 |
| Vocabulario | 187 | 129 | 0 |
| Templates | 2 | 0 | 0 |

## 14. Limitaciones

La primera revisión asistida no equivale a validación humana cualificada. No hay dictamen independiente de este lote; no cabe cerrar A1. La aprobación humana antes de publicación sigue pendiente. La muestra independiente prevista no cubre 55 actividades; todas tuvieron primera lectura de R2.

## 15. Git y commits

Rama `feat/editorial-review-c21-c34`, creada desde `164bdc7` para conservar las fases anteriores no integradas en main, conforme a la continuación solicitada. Main no se modifica. Se guarda un commit local de avance, sin merge, push, publicación ni despliegue; el hash se entrega por separado.

## 16. Reanudación

Cuando haya capacidad, encargar a un subagente nuevo con contexto aislado únicamente `criteria.md`, `manifest.json` y `C21.json`–`C34.json` de `editorial-cross-review-c21-c34`. Debe leer todo y emitir el dictamen antes de consultar este informe o el registro inicial. Después resolver y verificar nuevas versiones, emitir únicamente recibos justificados, ejecutar validaciones finales y actualizar este informe/contexto. **Detenerse ahora conforme a la instrucción expresa del usuario ante límites de uso.**
