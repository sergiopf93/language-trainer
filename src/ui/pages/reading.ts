import { el, heading } from '../dom';
import { link, support } from '../components';
import { catalog } from '../../content/language-packs';
import { reviewedReadings, readingEligibility } from '../../reading/engine';
import type { LocalStore } from '../../persistence/local';
import { SessionEngine } from '../../learning/session';
export async function reading(store: LocalStore) {
  const page = heading(
    'Letture A1',
    'Messaggi, persone e situazioni quotidiane.',
  );
  const facts = await store.allFacts();
  const texts = reviewedReadings().filter((t) => catalog.allowed(t.status));
  page.append(
    support(
      'El recorrido avanza desde mensajes breves hasta relatos. La preparación indica conocimientos introducidos, no dominio. Consultar vocabulario o ayuda queda registrado como apoyo para toda la lectura.',
    ),
  );
  const history = el('section');
  history.append(el('h2', 'Riprendi e rivedi'));
  for (const head of await new SessionEngine(store, catalog).sessions()) {
    const root = facts.find((f) => f.id === head.entityId);
    if (
      root?.kind !== 'practice-session' ||
      root.payload.mode !== 'reading' ||
      !catalog.allowed(root.payload.contentStatus)
    )
      continue;
    history.append(
      el('p'),
      link(
        `${head.payload.state.status === 'completed' ? 'Riepilogo' : 'Continua'}: ${root.payload.reading?.title}`,
        '/practice?session=' + head.id,
      ),
    );
  }
  page.append(history);
  if (!texts.length)
    page.append(
      el('p', 'Non ci sono letture pubblicate disponibili in questa versione.'),
    );
  const list = el('div', undefined, 'reading-list');
  for (const text of texts) {
    const readiness = readingEligibility(text, catalog, facts);
    const card = el('article', undefined, 'card');
    card.append(
      el('h2', text.title),
      el(
        'p',
        `${text.blocks.join(' · ')} · ${text.genre} · ${text.difficulty === 'initial' ? 'Primi passi' : text.difficulty === 'developing' ? 'In cammino' : 'Verso la fine del percorso'}`,
      ),
      el('p', text.objectives.join(' · ')),
      link(
        readiness.eligible
          ? 'Leggi: ' + text.title
          : 'Preparati: ' + text.title,
        '/practice?reading=' + text.id,
        readiness.eligible,
      ),
    );
    if (!readiness.eligible)
      card.append(
        el(
          'p',
          `${readiness.missingConcepts.length} concetti da esplorare · ${readiness.missingReadings.length} letture preparatorie.`,
        ),
      );
    list.append(card);
  }
  page.append(list);
  return page;
}
