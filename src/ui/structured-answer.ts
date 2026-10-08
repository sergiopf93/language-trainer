import type { Activity } from '../../shared/learning';
import { indexes } from '../exercises/response';
import { button, el } from './dom';
export function structuredAnswer(
  activity: Activity,
  draft: string,
  change: (value: string) => void,
) {
  const group = el('fieldset');
  group.append(
    el(
      'legend',
      activity.format === 'ordering'
        ? 'Tocca le parole nell’ordine giusto'
        : 'Abbina ogni elemento',
    ),
  );
  let selected = indexes(draft);
  if (activity.format === 'matching') {
    selected = activity.options.map((_, i) => selected[i] ?? -1);
    activity.task!.matchingPrompts.forEach((prompt, i) => {
      const label = el('label', prompt);
      const select = el('select');
      select.id = `pair-${i}`;
      label.htmlFor = select.id;
      const empty = el('option', 'Scegli…');
      empty.value = '-1';
      select.append(empty);
      activity.options.forEach((text, n) => {
        const option = el('option', text);
        option.value = String(n);
        select.append(option);
      });
      select.value = String(selected[i]);
      select.addEventListener('change', () => {
        selected[i] = Number(select.value);
        change(JSON.stringify(selected));
      });
      group.append(label, select);
    });
  } else {
    const result = el('p', '', 'ordered-answer');
    result.setAttribute('aria-live', 'polite');
    const chips = el('div', undefined, 'word-chips');
    const buttons = activity.options.map((text, i) =>
      button(
        text,
        () => {
          selected.push(i);
          refresh();
          change(JSON.stringify(selected));
        },
        true,
      ),
    );
    const undo = button(
      'Annulla ultima parola',
      () => {
        const removed = selected.pop();
        refresh();
        change(JSON.stringify(selected));
        if (removed !== undefined) buttons[removed].focus();
      },
      true,
    );
    const refresh = () => {
      result.textContent =
        selected.map((i) => activity.options[i]).join(' ') || 'La tua frase…';
      buttons.forEach((b, i) => {
        b.disabled = selected.includes(i);
      });
      undo.disabled = !selected.length;
    };
    chips.append(...buttons);
    group.append(result, chips, undo);
    refresh();
  }
  return group;
}
