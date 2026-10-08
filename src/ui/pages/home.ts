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
      'Elige un concepto disponible en Biblioteca o guarda tu intención para una próxima sesión.',
    ),
  );
  const link = el('a', 'Preparar práctica', 'primary-link');
  link.href = '/practice';
  card.append(link);
  page.append(card);
  page.append(
    el(
      'p',
      'El lote candidate, cuando está habilitado, permite validar la práctica y su historial. No representa la cobertura ni el contenido definitivo de V1.',
      'muted',
    ),
  );
  return page;
}
