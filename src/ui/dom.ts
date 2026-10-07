export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text?: string,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function button(
  text: string,
  action: () => void | Promise<void>,
  secondary = false,
) {
  const node = el('button', text, secondary ? 'secondary' : '');
  node.type = 'button';
  node.addEventListener('click', () => void action());
  return node;
}
export function heading(title: string, description: string) {
  const section = el('section');
  section.append(el('h1', title), el('p', description, 'lead'));
  return section;
}
export function message(error: unknown) {
  return error instanceof Error
    ? error.message
    : 'No se ha podido completar la acción.';
}
