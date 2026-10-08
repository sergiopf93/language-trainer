import type { Editorial } from './model';
import { editorialErrors } from './validate';
// Records an editorial decision supplied by the caller; does not perform linguistic review.
export function reviewContent<T extends Editorial & { version: string }>(
  item: T,
  reviewer: string,
  date: string,
): T {
  if (item.status !== 'candidate')
    throw new Error('Solo candidate puede pasar a reviewed.');
  const next: T = {
    ...structuredClone(item),
    status: 'reviewed',
    review: { reviewer, date, version: item.version },
  };
  if (editorialErrors(next).length) throw new Error('Revisión inválida.');
  return next;
}
export function publishContent<T extends Editorial & { version: string }>(
  item: T,
  date: string,
): T {
  if (item.status !== 'reviewed' || editorialErrors(item).length)
    throw new Error('Publicar exige revisión de esta versión.');
  const next: T = {
    ...structuredClone(item),
    status: 'published',
    publication: { date, version: item.version },
  };
  if (editorialErrors(next).length) throw new Error('Publicación inválida.');
  return next;
}
