import { el, heading } from '../dom';
import {
  catalog,
  activeTheories as theories,
} from '../../content/language-packs';
import { link, previewNotice, support } from '../components';
export function library() {
  const page = heading(
    'Biblioteca',
    'Un concetto alla volta. Leggi, scopri, prova.',
  );
  const concepts = catalog.available();
  if (!concepts.length)
    page.append(
      el('h2', 'Presto, nuovi contenuti'),
      support(
        'Aún no hay contenido publicado. Aquí encontrarás conceptos para estudiar y practicar.',
      ),
    );
  const grid = el('div', undefined, 'concept-grid');
  for (const [index, concept] of concepts.entries()) {
    const card = el('article', undefined, 'card concept-card');
    card.append(
      el(
        'span',
        `${String(index + 1).padStart(2, '0')} / ${concept.cefr ?? 'A1'}`,
        'eyebrow',
      ),
      el(
        'span',
        theories[concept.id]?.forms[0]?.[0] ?? concept.title,
        'concept-mark',
      ),
      el('h2', theories[concept.id]?.title ?? concept.title),
      support(theories[concept.id]?.goal ?? concept.objective, ''),
      link('Scopri il concetto', '/concept?id=' + concept.id, true),
    );
    grid.append(card);
  }
  page.append(grid);
  if (concepts.some((c) => c.status !== 'published'))
    page.append(previewNotice());
  return page;
}
