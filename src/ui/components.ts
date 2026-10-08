import { el } from './dom';
import { language } from './language';
import { catalog, activeTheories as theories } from '../content/language-packs';
import type { Observation } from '../evidence/project';
export function link(label: string, href: string, primary = false) {
  const node = el('a', label, primary ? 'primary-link' : 'text-link');
  node.href = href;
  return node;
}
export function support(text: string, className = 'muted') {
  const node = el('p', text, className);
  node.lang = language.supportLanguage;
  return node;
}
export function previewNotice() {
  const node = el('aside', undefined, 'preview-note');
  node.append(
    el('span', 'Contenuti di prova', 'pill'),
    support(
      'Material provisional para probar la experiencia; todavía no revisado para publicación.',
    ),
  );
  return node;
}
export function theoryPanel(conceptId: string) {
  const t = catalog.concept(conceptId) ? theories[conceptId] : undefined;
  const panel = el('section', undefined, 'theory-panel');
  panel.setAttribute('aria-label', 'Teoria');
  if (!t) {
    panel.append(support('La teoría de este concepto aún no está disponible.'));
    return panel;
  }
  panel.append(
    el('h3', 'La regola'),
    support(t.introduction, ''),
    ...t.rules.map((rule) => support(rule, 'rule')),
  );
  const forms = el('dl', undefined, 'forms');
  for (const [form, meaning] of t.forms) {
    const row = el('div');
    row.append(el('dt', form));
    const dd = el('dd', meaning);
    dd.lang = language.supportLanguage;
    row.append(dd);
    forms.append(row);
  }
  panel.append(forms, el('h3', 'Esempi'));
  for (const [example, translation] of t.examples) {
    const block = el('blockquote');
    block.append(el('p', example), support(translation));
    panel.append(block);
  }
  panel.append(
    el('h3', 'Attenzione'),
    ...t.frequentErrors.map((error) => support(error, '')),
    ...t.usageNotes.map((note) => support(note)),
  );
  for (const exception of t.exceptions) panel.append(support(exception));
  for (const contrast of t.contrasts)
    panel.append(support(contrast.explanation));
  return panel;
}
export function metric(value: string | number, label: string) {
  const node = el('div', undefined, 'metric');
  node.append(el('strong', String(value)), el('span', label));
  return node;
}
export const dimensionCopy = {
  comprehension: ['Capire', 'Reconocer una forma y entender qué significa.'],
  retrieval: ['Ricordare', 'Encontrar la forma sin verla entre opciones.'],
  'contextual-use': [
    'Usare nel contesto',
    'Elegir una expresión en una situación concreta.',
  ],
  discrimination: ['Distinguere', 'Diferenciar formas o usos parecidos.'],
  retention: [
    'Ricordare nel tempo',
    'Volver a recordar en una comprobación posterior.',
  ],
};
export function observations(rows: Observation[]) {
  const list = el('div', undefined, 'observations');
  for (const row of rows) {
    const section = el('section', undefined, 'observation');
    const [title, description] = dimensionCopy[row.dimension];
    section.append(el('h3', title), support(description));
    const total = row.correct + row.errors + row.typos + row.assisted;
    if (!total)
      section.append(
        el('span', 'Non ancora osservato', 'pill'),
        support(
          'Todavía faltan respuestas que permitan valorar esta habilidad.',
        ),
      );
    else {
      const bar = el('div', undefined, 'result-bar');
      bar.setAttribute('aria-hidden', 'true');
      for (const [count, cls] of [
        [row.correct, 'positive'],
        [row.errors, 'negative'],
        [row.typos, 'negative'],
        [row.assisted, 'assisted'],
      ] as const) {
        if (count) {
          const part = el('span', '', cls);
          part.style.flexGrow = String(count);
          bar.append(part);
        }
      }
      section.append(
        bar,
        support(
          `${row.correct} aciertos · ${row.errors} errores sin ayuda · ${row.assisted} respuestas con ayuda`,
        ),
        support(
          `${row.activityIds.length} actividades distintas · Última práctica: ${new Date(row.lastObserved!).toLocaleDateString(language.supportLanguage)}`,
        ),
      );
      if (row.typos)
        section.append(
          support(
            `${row.typos} posibles erratas sin ayuda; no cuentan como aciertos ni como errores conceptuales.`,
          ),
        );
    }
    if (row.unassessed)
      section.append(
        support(
          `${row.unassessed} respuestas sin valorar; no cuentan como errores.`,
        ),
      );
    list.append(section);
  }
  return list;
}
