import { el, heading } from '../dom';
export function progress() {
  const page = heading(
    'Progreso',
    'Comprender lo que sabes y lo que necesita otra oportunidad.',
  );
  const card = el('article', undefined, 'card');
  card.append(
    el('h2', 'Aún no hay valoraciones de aprendizaje'),
    el(
      'p',
      'Guardar un borrador o sincronizarlo no demuestra dominio. Aquí aparecerá la evidencia cuando estén disponibles las actividades y su evaluación.',
    ),
  );
  page.append(card);
  return page;
}
