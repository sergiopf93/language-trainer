import { el, heading } from '../dom';
import { italian } from '../../content/language-packs';
import { catalog } from '../../content/validation-fixture';
export function library() {
  const page = heading(
    'Biblioteca',
    'Italiano A1. La V1 mantiene todo el currículo; este lote mínimo valida únicamente el motor.',
  );
  const concepts = catalog.available();
  if (!concepts.length)
    page.append(
      el(
        'p',
        'Aún no hay contenido publicado. El lote candidate solo se habilita en desarrollo y compilaciones de validación.',
      ),
    );
  for (const concept of concepts) {
    const card = el('article', undefined, 'card');
    card.dataset.pack = italian.id;
    card.append(
      el(
        'span',
        catalog.topics.find((t) => t.id === concept.topicId)!.title,
        'eyebrow',
      ),
      el('h2', concept.title),
      el('p', concept.objective),
      el('p', concept.scope),
      el('p', concept.exclusions, 'muted'),
      el(
        'p',
        `${concept.status.toUpperCase()} · Versión ${concept.version} · ${concept.provenance}`,
        'muted',
      ),
    );
    const link = el('a', 'Practicar ' + concept.title, 'primary-link');
    link.href = '/practice?concept=' + concept.id;
    card.append(link);
    page.append(card);
  }
  return page;
}
