import { el, heading } from '../dom';
import type { LocalStore } from '../../persistence/local';
import { catalog } from '../../content/validation-fixture';
import { project } from '../../evidence/project';
const labels = {
  comprehension: 'Comprensión / reconocimiento',
  retrieval: 'Recuperación',
  'contextual-use': 'Uso contextual',
  discrimination: 'Discriminación',
  retention: 'Retención diferida',
};
export async function progress(store: LocalStore) {
  const page = heading(
    'Progreso',
    'Observaciones por concepto y dimensión. Sin porcentaje global de dominio.',
  );
  const facts = await store.allFacts();
  if (!facts.some((f) => f.kind === 'evidence'))
    page.append(el('h2', 'Aún no hay valoraciones de aprendizaje'));
  const requested = new URLSearchParams(location.search).get('concept');
  for (const concept of catalog
    .available()
    .filter((c) => !requested || c.id === requested)) {
    const projection = project(
      facts,
      concept.id,
      concept.version,
      catalog.allowCandidates,
    );
    const card = el('article', undefined, 'card');
    card.append(
      el('h2', concept.title),
      el(
        'p',
        `${concept.status.toUpperCase()} · Historial de validación técnica`,
        'muted',
      ),
    );
    for (const row of projection.observations) {
      card.append(el('h3', labels[row.dimension]));
      card.append(
        el(
          'p',
          row.supportingFactIds.length
            ? `${row.correct} aciertos y ${row.errors} errores sin ayuda; ${row.assisted} observaciones asistidas. ${row.activityIds.length} ítems distintos.`
            : 'Sin evidencia observada. No significa desconocimiento.',
        ),
      );
      if (row.unassessed)
        card.append(
          el(
            'p',
            `${row.unassessed} respuestas sin evaluación concluyente; no cuentan como errores.`,
          ),
        );
      if (row.lastObserved)
        card.append(
          el(
            'p',
            'Última observación: ' +
              new Date(row.lastObserved).toLocaleString('es'),
            'muted',
          ),
        );
      if (row.supportingFactIds.length) {
        const details = el('details');
        details.append(el('summary', 'Ver trazabilidad'));
        for (const id of row.supportingFactIds)
          details.append(el('p', id, 'fact-id'));
        card.append(details);
      }
    }
    card.append(
      el('p', projection.uncertainty, 'muted'),
      el(
        'p',
        'Política: ' +
          projection.policyVersion +
          ' · Reconstruido desde hechos originales.',
        'muted',
      ),
    );
    page.append(card);
  }
  return page;
}
