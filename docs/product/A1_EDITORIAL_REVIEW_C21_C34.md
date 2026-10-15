# Fase 5B.4 — C21–C34: punto de reanudación

**INCOMPLETA. Revisión independiente inicial completada; dos seguimientos pendientes por nuevo límite de uso.** Actualización: 2026-10-15; referencia de reanudación e6bf368. No se cierra el proceso editorial A1 ni se aprueba el lote. Este documento es un informe de avance y reanudación, no el informe final de cierre.

## 1. Conceptos revisados inicialmente

R2 realizó la lectura inicial de los 38 conceptos C21–C34. Los 38 conceptos tienen Theory revisada independientemente; falta cerrar dos seguimientos y decidir recibos por concepto. Inventario exacto de Theory y selección independiente en [manifest.json](editorial-cross-review-c21-c34/manifest.json).

## 2. Theory

Primera iteración: 38 fichas leídas; una corregida: C34-06, que presentaba una oposición incorrecta entre al centro como destino e in centro como ubicación. In centro también indica destino. Versión nueva theory-c34-06-1-editorial-1. La construcción está documentada en [Treccani, centro](https://www.treccani.it/vocabolario/ricerca/centro/Sinonimi_e_Contrari/).

## 3. Actividades

346 actividades leídas inicialmente, sin muestreo. 46 actividades modificadas hasta congelar los paquetes. Se conservan IDs y se incrementan versiones; el materializador propaga criterio y trace. El dictamen ciego cubre las 46 versiones modificadas iniciales. Las versiones posteriores y su seguimiento se detallan abajo.

## 4. Vocabulario y relaciones

226 entradas vinculadas y 85 relaciones incidentes leídas. Sin modificaciones. C34 mantiene siete ámbitos transversales; no se amplía repertorio ni funciones. El total global permanece en 316 entradas y 210 relaciones.

## 5. Accepted answers

Cuatro listas modificadas: C22-03-periodica (a/alla/la settimana), C27-01-mele (chilogrammo), C34-02-camera (stanza) y C34-06-andare (in stazione). Las variantes ausentes en criterios no exhaustivos producían abstención: no se acreditan como falsos rechazos. **Revisar su clasificación final como mejora opcional frente a ambigüedad**, sin ampliar indiscriminadamente listas.

## 6. Hallazgos lingüísticos

[Registro inicial por entidad](A1_EDITORIAL_CHANGES_C21_C34.json): problema, evidencia literal anterior, gravedad, propuesta, campos y decisión provisional. Incluye la regla locativa C34-06, contracción ai libri y consignas con respuestas entregadas. Las decisiones del registro siguen pendientes de contraste; no son aprobaciones.

## 7. Ambigüedades

Se delimitan referencia del destinatario, negación simple, vocativo frente a sujeto y datos de nacionalidad. Se retiran rechazos indiscriminados de fechas con di y de del tras un po’. [Treccani documenta un po’ del](https://www.treccani.it/vocabolario/ricerca/p%C3%B2/); esa posibilidad exige considerar referencia, no declarar siempre incorrecta la combinación.

## 8. Dictamen independiente completado

Los 14 dictámenes están conservados en [verdicts](editorial-cross-review-c21-c34/verdicts/), uno por paquete, con hash, IDs leídos y limitaciones. Tres revisores con `fork_turns: none` recibieron exclusivamente criterios y paquetes congelados; emitieron sus dictámenes antes de conocer las conclusiones de R2:

| Revisor | Lote | Theory | Actividades |
| --- | --- | ---: | ---: |
| blind_c21_c25_resume | C21–C25 | 12 | 84 |
| blind_c26_c31_resume | C26–C31 | 15 | 95 |
| blind_c32_c34_resume | C32–C34 | 11 | 112 |
| Total | C21–C34 | 38 | 291 |

Las 46 actividades modificadas y las cuatro listas accepted iniciales están incluidas. Las 55 actividades excluidas de la muestra tienen primera lectura de R2, no segunda lectura independiente. Cobertura por concepto/formato y riesgos conservada sin regenerar paquetes. Los 14 hashes e inventarios de lectura coinciden exactamente con el manifiesto.

## 9. Hallazgos, discrepancias y decisiones

| Incidencia | Clasificación | Evidencia y decisión |
| --- | --- | --- |
| C22-01, C22-03-periodica | Mejora opcional | Pista «la primera/la segunda» sin referentes: sustituida por pista autónoma. Seguimiento confirmado. |
| C24-01, C24-01-richiesta | Error lingüístico confirmado | bolígrafo incrustado en italiano; corregido a penna. Coincide con observación pendiente de R2. Seguimiento confirmado. |
| C25-01 y C25-02, ambas domanda | Error lingüístico confirmado | «sin sujeto explícito» contradice leggere/i libri como sujeto de piacere. Se pide pronombre indirecto átono para destinatario. El revisor detectó errores introducidos en la primera revisión. Seguimiento confirmado. |
| C26-01, Theory C26-02 | Mejora opcional | Precisado alle con horas plurales y all’una para la una. Seguimiento pendiente. |
| C30-01, Theory C30-01 | Ambigüedad relevante | «tomad / tomen (vosotros)» separada en tomad (vosotros) / tomen (ustedes). Seguimiento pendiente. |
| C34-F01, C34-05-pausa | Ambigüedad relevante | Desayunar era compatible con una interrupción breve; se pide el nombre genérico de la interrupción y se explica por qué colazione nombra otra cosa. Seguimiento pendiente. |
| C34-F02, C34-04-scegli y C34-02-descrivi/C34-03-mele/conto | Mejora opcional | Delimitado el español y corregido prenda a indumento, conservando recuperación léxica. Seguimiento pendiente. |
| R2-HORA, C22-04-proponi/conferma | Mejora opcional | Añadido quindici junto a tre para las 15; previamente producía abstención, no falso rechazo. Seguimiento confirmado. |

El registro [resolution-decisions.json](editorial-cross-review-c21-c34/resolution-decisions.json) conserva evidencia, propuesta, clasificación, gravedad, IDs y versiones. Ocho incidencias independientes: tres errores, dos ambigüedades y tres mejoras opcionales. No se convierte el dictamen en validación humana. Las cuatro ampliaciones accepted iniciales se interpretan como mejoras de reconocimiento de variantes, no falsos rechazos; sus motivos iniciales se conservan como historia.

## 10. Correcciones y seguimiento

Esta reanudación modifica **11 actividades y dos Theory**. Siete actividades ya habían cambiado en la primera iteración y cuatro se añaden a ese inventario. Total acumulado de la fase: **50 actividades, tres Theory y seis listas accepted modificadas**. Todas incrementan versión; materialización conserva criterio/trace coherentes. No se cambia vocabulario, relaciones, interfaz o evaluador.

Se guardaron tres paquetes finales separados y [resolution-manifest.json](editorial-cross-review-c21-c34/resolution-manifest.json), sin alterar los originales. El seguimiento C21–C25 quedó escrito antes del error por límite de uso: **seis actividades y cinco Theory de contexto confirmadas, sin hallazgos nuevos**. SHA-256 e IDs verificados; se conserva en [resolution-verdict-c21-c25.json](editorial-cross-review-c21-c34/verdicts/resolution-verdict-c21-c25.json).

**Pendiente:** C26–C31 (dos Theory) y C32–C34 (cinco actividades y cuatro Theory de contexto). El primer agente devolvió límite de uso sin dictamen; el segundo se detuvo sin leer, dejando un registro explícito sin cobertura. No se inventan resoluciones.

## 11. Estados y recibos

**Cero conceptos promovidos en esta reanudación.** Se detiene el proceso antes de la decisión individual e integración de recibos, conforme a la instrucción expresa ante nuevo límite de uso. No significa que los 38 conceptos tengan errores: falta finalizar el proceso y emitir decisiones justificadas. C30-01 y C34-05 conservan bloqueos de seguimiento; las demás decisiones también se mantienen pendientes, sin aprobación automática.

61 recibos anteriores vigentes, sin errores. No se han emitido recibos nuevos. Las pruebas editoriales existentes confirman invalidación ante alteraciones de contenido/dependencias/versiones. La comprobación del lote nuevo deberá acompañar su futura integración.

## 12. Tests y validaciones de esta reanudación

- **75/75 pruebas, 4/4 suites:** curriculum-c18-c25, curriculum-c26-c34, editorial-review y editorial-c11-c20.
- Typecheck correcto; formato de los seis archivos TypeScript modificados correcto; git diff --check correcto.
- Coverage curricular: 99/99 presentes, cero errores, cero listos para producción.
- Auditoría editorial: 61 recibos vigentes, cero errores, estados conservados.
- 14 hashes originales y tres hashes de seguimiento correctos. Los 14 dictámenes ciegos tienen cobertura exacta y sin material seleccionado pendiente. Seguimiento C21–C25 completo y verificado.
- Sin build ni E2E generales: solo contenido/documentación; se reutiliza la validación previa conforme a la instrucción de eficiencia.
- Diff revisado; solo seis fuentes C22/C24/C25/C26/C30/C34 y documentación de la fase. C01–C20, vocabulario, relaciones y recibos anteriores conservados.

## 13. Estado global C01–C34

| Entidad | reviewed | candidate | published |
| --- | ---: | ---: | ---: |
| Conceptos | 61 | 38 | 0 |
| Theory | 61 | 38 | 0 |
| Actividades | 519 | 346 | 0 |
| Vocabulario | 187 | 129 | 0 |
| Templates | 2 | 0 | 0 |

## 14. Limitaciones

La revisión asistida no equivale a validación humana cualificada. El dictamen ciego inicial está completo; faltan dos seguimientos y los recibos. No se cierra A1 ni se publica. No se acredita segunda lectura de las 55 actividades no seleccionadas ni auditoría independiente exhaustiva de vocabulario/relaciones.

## 15. Git

Rama `feat/editorial-review-c21-c34`, reanudada desde `e6bf368`; el desarrollo conserva baseline original `164bdc7`. Se guarda commit local de avance con los dictámenes persistentes y las correcciones pendientes de seguimiento; hash comunicado tras crearlo. Sin merge, push, despliegue ni publicación.

## 16. Punto exacto de reanudación

**No repetir primera revisión, 14 dictámenes ciegos ni seguimiento C21–C25.** Revisar únicamente `resolution-c26-c31.json` y `resolution-c32-c34.json` con sus dictámenes previos respectivos; este trabajo es seguimiento explícito, no revisión ciega nueva. Después resolver incidencias residuales, decidir por concepto, emitir recibos y ejecutar validaciones afectadas. Detalles en [resume.json](editorial-cross-review-c21-c34/resume.json). No iniciar 5C. Detenerse ahora por nuevo límite de uso.
