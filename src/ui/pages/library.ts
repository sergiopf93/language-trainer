import { el, heading } from '../dom';
import { italian } from '../../content/language-packs';
export function library() {
  const page = heading(
    'Biblioteca',
    'Tu referencia de italiano A1, con explicaciones en español.',
  );
  const card = el('article', undefined, 'card');
  card.append(
    el('h2', 'El contenido llegará aquí'),
    el(
      'p',
      'La biblioteca aún no tiene contenido publicado. El recorrido previsto incluye todo el currículo A1 del proyecto.',
    ),
  );
  card.dataset.pack = italian.id;
  page.append(card);
  return page;
}
