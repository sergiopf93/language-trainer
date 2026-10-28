import { routeLocation } from '../../routing';
import { libraryIndex } from '../../library/runtime';
import { createSearchView } from '../../library/search';
import { el, heading, button, message } from '../dom';
import {
  catalog,
  activeTheories as theories,
} from '../../content/language-packs';
import { SessionEngine } from '../../learning/session';
import type { LocalStore } from '../../persistence/local';
import { project } from '../../evidence/project';
import {
  link,
  observations,
  previewNotice,
  support,
  theoryPanel,
} from '../components';
import { copy } from '../language';
export async function conceptDetail(
  store: LocalStore,
  saved: () => void,
  openSession: (id: string) => void,
) {
  const id = new URLSearchParams(routeLocation().search).get('id') ?? '';
  const concept = catalog.concept(id);
  if (!concept)
    return heading(
      'Concetto non disponibile',
      'Torna alla Biblioteca per scegliere un concetto.',
    );
  const page = heading(
    theories[id]?.title ?? concept.title,
    'Leggi la teoria, poi mettila in pratica.',
  );
  page.prepend(link('← Biblioteca', '/library'));
  page.append(support(theories[concept.id]?.goal ?? concept.objective, 'lead'));
  const card = el('article', undefined, 'card');
  card.append(el('h2', 'Prima di iniziare'), theoryPanel(id));
  const status = el('p');
  status.setAttribute('role', 'status');
  const engine = new SessionEngine(store, catalog);
  let recorded = false;
  const record = async () => {
    if (!recorded && theories[id]) {
      await engine.study(id, theories[id].version);
      recorded = true;
      saved();
    }
  };
  // Reading is exposure, never evidence of successful practice.
  try {
    await record();
  } catch (error) {
    status.textContent = 'No se ha guardado la consulta. ' + message(error);
  }
  const retry = button(
    'Riprova a salvare',
    async () => {
      try {
        await record();
        status.textContent = 'Lettura salvata';
        retry.remove();
      } catch (error) {
        status.textContent = message(error);
      }
    },
    true,
  );
  if (!recorded && theories[id]) card.append(retry);
  const start = button(copy.start, async () => {
    start.disabled = true;
    try {
      await record();
      const session = await engine.start(id);
      saved();
      openSession(session.head.id);
    } catch (error) {
      status.textContent = 'No se ha podido iniciar. ' + message(error);
      start.disabled = false;
    }
  });
  card.append(status, start);
  page.append(card);
  for (const relation of catalog.relations.filter((r) => r.from === id)) {
    const related = catalog.concept(relation.to);
    if (related)
      page.append(
        link(
          (relation.type === 'prerequisite'
            ? 'Prima: '
            : ['contrast', 'contrasts'].includes(relation.type)
              ? 'Confronta: '
              : 'Vedi anche: ') +
            (theories[related.id]?.title ?? related.title),
          '/concept?id=' + related.id,
        ),
      );
  }
  const relatedPractice = el('section', undefined, 'card');
  relatedPractice.append(el('h2', 'Altre pratiche'));
  const searchView = createSearchView(
    libraryIndex(),
    catalog,
    await store.allFacts(),
  );
  const relatedResults = searchView.results.filter(
    (r) =>
      [...r.entry.primary, ...r.entry.related].includes(id) &&
      r.eligible &&
      searchView.ready(r.entry),
  );
  for (const [type, label] of [
    ['mixed', 'Practicar Mixed'],
    ['writing', 'Practicar Writing'],
    ['reading', 'Practicar Reading'],
  ] as const) {
    const match = relatedResults.find((r) => r.entry.type === type);
    if (match)
      relatedPractice.append(
        link(
          label,
          type === 'mixed'
            ? match.entry.href
            : `/library?type=${type}&concept=${encodeURIComponent(id)}`,
          true,
        ),
      );
  }
  if (relatedPractice.childElementCount > 1) page.append(relatedPractice);
  const progress = el('section', undefined, 'card');
  progress.append(el('h2', 'I tuoi progressi'));
  const detail = el('details');
  detail.append(
    el('summary', 'Mostra i progressi'),
    observations(
      project(
        await store.allFacts(),
        id,
        concept.version,
        catalog.allowCandidates,
      ).observations,
    ),
  );
  progress.append(detail);
  page.append(progress);
  if (concept.status !== 'published') page.append(previewNotice());
  return page;
}
