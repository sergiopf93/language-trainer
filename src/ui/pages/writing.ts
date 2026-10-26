import { el, heading } from '../dom';
import { link, support } from '../components';
import { catalog } from '../../content/language-packs';
import { writingOptions, writingPreparation } from '../../writing/engine';
import type { LocalStore } from '../../persistence/local';
import { SessionEngine } from '../../learning/session';
export async function writing(store: LocalStore) {
  const page = heading(
    'Scrittura A1',
    'Dalle forme ai messaggi per la vita quotidiana.',
  );
  page.append(
    support(
      'Las respuestas delimitadas se comprueban con criterios explícitos. Los mensajes abiertos se guardan para revisarlos: no reciben corrección gramatical automática ni acreditan dominio. Las ayudas y las reparaciones quedan registradas.',
    ),
  );
  const facts = await store.allFacts();
  const history = el('section');
  history.append(el('h2', 'I tuoi testi e le tue bozze'));
  for (const head of await new SessionEngine(store, catalog).sessions()) {
    const root = facts.find((f) => f.id === head.entityId);
    if (
      root?.kind !== 'practice-session' ||
      root.payload.mode !== 'writing' ||
      !catalog.allowed(root.payload.contentStatus)
    )
      continue;
    history.append(
      el('p'),
      link(
        `${head.payload.state.status === 'completed' ? 'Rivedi' : 'Continua'}: ${root.payload.writing!.title}`,
        '/practice?session=' + head.id,
      ),
    );
  }
  page.append(history);
  const options = writingOptions(catalog);
  if (!options.length)
    page.append(
      el(
        'p',
        'Non ci sono attività di scrittura pubblicate disponibili in questa versione.',
      ),
    );
  const labels = [
    '1 · Forme senza opzioni',
    '2 · Costruisci una frase',
    '3 · Messaggi guidati',
    '4 · Scrivi con più autonomia',
  ];
  labels.forEach((label, i) => {
    const list = el('details');
    list.append(el('summary', label));
    for (const option of options.filter((o) => o.level === i + 1)) {
      const missing = writingPreparation(option, catalog, facts);
      const article = el('article', undefined, 'card');
      article.append(
        el('h3', option.title),
        el('p', option.context),
        el('p', option.objectives.join(' · ')),
        link(
          missing.length ? 'Esplora la preparazione' : 'Scegli questa attività',
          '/practice?writing=' + option.id,
          !missing.length,
        ),
      );
      list.append(article);
    }
    if (options.some((o) => o.level === i + 1)) page.append(list);
  });
  return page;
}
