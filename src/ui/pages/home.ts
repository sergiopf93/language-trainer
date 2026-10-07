import { el, heading } from '../dom';
export function home() {
  const page = heading(
    'Un espacio para tu italiano',
    'Aprende a tu ritmo, también sin conexión.',
  );
  const card = el('article', undefined, 'card');
  card.append(
    el('span', 'ITALIANO · NIVEL A1', 'eyebrow'),
    el('h2', 'Prepara tu próxima práctica'),
    el(
      'p',
      'Guarda lo que te gustaría trabajar. Las actividades y el contenido se incorporarán en los próximos bloques.',
    ),
  );
  const link = el('a', 'Preparar práctica', 'primary-link');
  link.href = '/practice';
  card.append(link);
  page.append(card);
  page.append(
    el(
      'p',
      'Esta primera versión prepara tu espacio personal. Todavía no ofrece actividades ni valora tu aprendizaje.',
      'muted',
    ),
  );
  return page;
}
