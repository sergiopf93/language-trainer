import { el, heading } from '../dom';
import { link, metric, support } from '../components';
import type { LocalStore } from '../../persistence/local';
import { SessionEngine } from '../../learning/session';
import { catalog } from '../../content/language-packs';
export async function home(store: LocalStore) {
  const page = heading(
    'Il tuo italiano, ogni giorno.',
    'Un piccolo passo. Una nuova possibilità.',
  );
  const hero = el('article', undefined, 'card hero');
  hero.append(
    el('span', 'IL TUO SPAZIO · A1', 'eyebrow'),
    el('h2', 'Prima scopri. Poi prova.'),
    el('p', 'Scegli un concetto, leggi gli esempi e inizia la pratica.'),
    link('Esplora la biblioteca', '/library', true),
  );
  const steps = el('div', undefined, 'study-steps');
  for (const [number, label] of [
    ['01', 'Scopri'],
    ['02', 'Pratica'],
    ['03', 'Rifletti'],
  ])
    steps.append(metric(number, label));
  hero.append(steps);
  page.append(hero);
  const heads = await new SessionEngine(store, catalog).sessions();
  const facts = await store.allFacts();
  const active = heads.filter(
    (h) =>
      h.payload.state.status === 'active' &&
      facts.some(
        (f) =>
          f.id === h.entityId &&
          f.kind === 'practice-session' &&
          catalog.allowed(f.payload.contentStatus),
      ),
  );
  const card = el('section', undefined, 'card');
  card.append(
    el('h2', active.length ? 'Riprendi da qui' : 'Da dove cominciamo?'),
  );
  if (!active.length)
    card.append(
      support(
        'Empieza con un concepto de la Biblioteca. Tus sesiones quedarán guardadas para continuarlas a tu ritmo.',
      ),
    );
  for (const head of active)
    card.append(
      link(
        'Continua la pratica · ' +
          new Date(head.occurredAt).toLocaleDateString('it'),
        '/practice?session=' + head.id,
      ),
    );
  card.append(
    el('p'),
    link('Vai al ripasso', '/practice'),
    el('p'),
    link('Letture A1', '/reading'),
  );
  page.append(card);
  return page;
}
