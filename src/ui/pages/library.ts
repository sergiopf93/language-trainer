import { appUrl, routeLocation } from '../../routing';
import { el, heading, button } from '../dom';
import {
  catalog,
  activeTheories as theories,
} from '../../content/language-packs';
import { link, previewNotice, support } from '../components';
import type { LocalStore } from '../../persistence/local';
import { libraryIndex } from '../../library/runtime';
import {
  createSearchView,
  searchLibrary,
  type SearchFilter,
} from '../../library/search';
import {
  categories,
  themes,
  practiceTypes,
  learningStates,
} from '../../library/taxonomy';
const stateKey = 'language-trainer-library-search';
export async function library(store: LocalStore) {
  const page = heading(
    'Biblioteca',
    'Un concetto alla volta. Leggi, scopri, prova.',
  );
  const concepts = catalog.available();
  if (!concepts.length) {
    page.append(
      el('h2', 'Presto, nuovi contenuti'),
      support(
        'Aún no hay contenido publicado. Aquí encontrarás conceptos para estudiar y practicar.',
      ),
    );
    return page;
  }
  const entries = libraryIndex();
  const view = createSearchView(entries, catalog, await store.allFacts());
  let saved = '';
  try {
    saved = sessionStorage.getItem(stateKey) ?? '';
  } catch {
    /* Search remains usable without browser storage. */
  }
  const params = new URLSearchParams(routeLocation().search || saved);
  const filter: SearchFilter = Object.fromEntries(
    ['q', 'type', 'category', 'theme', 'state', 'concept'].map((k) => [
      k,
      params.get(k) ?? '',
    ]),
  );
  let limit = 20;
  const controls = el('section', undefined, 'card library-controls');
  const label = el('label', 'Buscar en la Biblioteca');
  const input = el('input');
  input.type = 'search';
  input.id = 'library-query';
  input.placeholder = 'essere, artículos, restaurante, escritura…';
  input.value = filter.q ?? '';
  label.htmlFor = input.id;
  const details = el('details');
  details.open = !!(
    filter.type ||
    filter.category ||
    filter.theme ||
    filter.state
  );
  const summary = el('summary', 'Filtros');
  details.append(summary);
  const fields = el('div', undefined, 'library-filters');
  details.append(fields);
  const selects: HTMLSelectElement[] = [];
  const addFilter = (
    key: 'type' | 'category' | 'theme' | 'state',
    name: string,
    options: { id: string; label: string }[],
  ) => {
    const wrapper = el('label', name);
    const select = el('select');
    select.setAttribute('aria-label', name);
    for (const option of [{ id: '', label: 'Todos' }, ...options]) {
      const node = el('option', option.label);
      node.value = option.id;
      select.append(node);
    }
    select.value = filter[key] ?? '';
    selects.push(select);
    wrapper.append(select);
    fields.append(wrapper);
    select.addEventListener('change', () => {
      filter[key] = select.value;
      limit = 20;
      render();
    });
  };
  addFilter(
    'type',
    'Tipo de práctica',
    Object.entries(practiceTypes).map(([id, label]) => ({ id, label })),
  );
  addFilter(
    'category',
    'Categoría lingüística',
    categories.filter((c) => entries.some((e) => e.categories.includes(c.id))),
  );
  addFilter(
    'theme',
    'Tema comunicativo',
    themes.filter((t) => entries.some((e) => e.themes.includes(t.id))),
  );
  addFilter(
    'state',
    'Estado de aprendizaje',
    Object.entries(learningStates).map(([id, label]) => ({ id, label })),
  );
  const count = el('p');
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');
  const clear = button(
    'Limpiar búsqueda y filtros',
    () => {
      for (const key of Object.keys(filter))
        filter[key as keyof SearchFilter] = '';
      input.value = '';
      selects.forEach((s) => (s.value = ''));
      limit = 20;
      render();
      input.focus();
    },
    true,
  );
  const active = el('p', undefined, 'support');
  controls.append(label, input, details, active, clear, count);
  const grid = el('div', undefined, 'concept-grid');
  grid.id = 'library-results';
  input.setAttribute('aria-controls', grid.id);
  const more = button(
    'Mostrar más resultados',
    () => {
      limit += 20;
      render();
    },
    true,
  );
  const conceptTitle = (id: string) =>
    theories[id]?.title ?? catalog.concept(id)?.title ?? id;
  function render() {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filter))
      if (value) query.set(key, value);
    const suffix = query.toString();
    history.replaceState(
      history.state,
      '',
      appUrl('/library' + (suffix ? '?' + suffix : '')),
    );
    try {
      sessionStorage.setItem(stateKey, suffix);
    } catch {
      /* Optional navigation preference, never learning data. */
    }
    summary.textContent =
      'Filtros' +
      ([filter.type, filter.category, filter.theme, filter.state].filter(
        Boolean,
      ).length
        ? ' · activos'
        : '');
    active.textContent = filter.concept
      ? 'Concepto relacionado: ' + conceptTitle(filter.concept)
      : '';
    const filtering = Object.values(filter).some(Boolean);
    const results = searchLibrary(
      view.results,
      filtering ? filter : { type: 'concept' },
    );
    const visible = filtering ? results.slice(0, limit) : results;
    count.textContent = `${results.length} resultados${visible.length < results.length ? ` · mostrando ${visible.length}` : ''}`;
    clear.disabled = !filtering;
    grid.replaceChildren();
    more.hidden = visible.length >= results.length;
    if (!results.length)
      grid.append(
        support(
          'No hay resultados con esta combinación. Prueba otra palabra o limpia los filtros.',
        ),
      );
    for (const [index, result] of visible.entries()) {
      const e = result.entry;
      const card = el('article', undefined, 'card concept-card library-result');
      card.append(
        el(
          'span',
          `${String(index + 1).padStart(2, '0')} / ${practiceTypes[e.type]}`,
          'eyebrow',
        ),
      );
      if (e.type === 'concept')
        card.append(
          el(
            'span',
            theories[e.sourceId]?.forms[0]?.[0] ?? e.title,
            'concept-mark',
          ),
        );
      card.append(el('h2', e.title), support(e.description, ''));
      const tags = el('p', undefined, 'library-tags');
      for (const text of [
        ...e.blocks,
        ...e.categories.map((id) => categories.find((c) => c.id === id)!.label),
        ...e.themes.map((id) => themes.find((t) => t.id === id)!.label),
      ])
        tags.append(el('span', text));
      card.append(
        tags,
        support(
          (e.type === 'vocabulary' ? 'Conceptos asociados: ' : '') +
            learningStates[result.state],
        ),
      );
      if (e.primary.length && e.type !== 'concept')
        card.append(
          support('Objetivo: ' + e.primary.map(conceptTitle).join(' · ')),
        );
      if (e.related.length && e.type !== 'concept') {
        const related = el('details');
        related.append(el('summary', 'Conceptos relacionados / preparación'));
        related.append(
          support(
            'Esta relación no implica que la actividad evalúe cada concepto.',
          ),
        );
        for (const id of e.related)
          related.append(link(conceptTitle(id), '/concept?id=' + id));
        card.append(related);
      }
      if (e.type === 'concept')
        card.append(
          link('Scopri il concetto', e.href, true),
          link('Practicar', '/practice?concept=' + e.sourceId),
        );
      else if (e.type === 'vocabulary')
        card.append(
          support(
            'Consulta los conceptos asociados para estudiar y practicar esta palabra. Su estado no indica dominio de la palabra.',
          ),
        );
      else if (result.eligible && view.ready(e))
        card.append(link('Practicar ' + practiceTypes[e.type], e.href, true));
      else {
        card.append(
          support(
            'Preparación pendiente. Consulta primero la teoría y los requisitos de esta modalidad.',
          ),
        );
        card.append(link('Ver preparación', e.href));
      }
      grid.append(card);
    }
  }
  input.addEventListener('input', () => {
    filter.q = input.value;
    limit = 20;
    render();
  });
  page.append(
    controls,
    grid,
    more,
    support(
      'Los estados describen el trabajo registrado, no certifican dominio. «Necesita repaso» sigue las señales de Review para conceptos; Vocabulario refleja sus conceptos asociados.',
    ),
  );
  if (concepts.some((c) => c.status !== 'published'))
    page.append(previewNotice());
  render();
  return page;
}
