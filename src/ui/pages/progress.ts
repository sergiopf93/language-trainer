import { routeLocation } from '../../routing';
import { reviewedReadings } from '../../reading/engine';
import { el, heading } from '../dom';
import type { LocalStore } from '../../persistence/local';
import {
  catalog,
  activeTheories as theories,
} from '../../content/language-packs';
import { project } from '../../evidence/project';
import {
  link,
  metric,
  observations,
  previewNotice,
  support,
} from '../components';
export async function progress(store: LocalStore) {
  const page = heading('Progressi', 'Guarda i passi che hai fatto.');
  const facts = await store.allFacts();
  const requested = new URLSearchParams(routeLocation().search).get('concept');
  const concepts = catalog
    .available()
    .filter((c) => !requested || c.id === requested);
  const rows = concepts.map((c) => ({
    concept: c,
    projection: project(facts, c.id, c.version, catalog.allowCandidates),
  }));
  const practiced = rows.filter(
    (r) => r.projection.sourceFactIds.length,
  ).length;
  const overview = el('div', undefined, 'metrics');
  overview.append(
    metric(practiced, 'concetti praticati'),
    metric(concepts.length - practiced, 'da esplorare'),
  );
  page.append(
    overview,
    support(
      'Las barras muestran respuestas registradas, no porcentajes de dominio. Verde: aciertos sin ayuda · terracota: errores sin ayuda · rayado: con ayuda.',
    ),
  );
  if (!practiced)
    page.append(
      el('h2', 'Il primo passo ti aspetta'),
      support(
        'Después de practicar verás aquí tus resultados. Estudiar teoría no cuenta como acertar una actividad.',
      ),
      link('Esplora la biblioteca', '/library', true),
    );
  for (const { concept, projection } of rows) {
    const card = el('article', undefined, 'card');
    const correct = projection.observations.reduce((n, r) => n + r.correct, 0);
    const errors = projection.observations.reduce((n, r) => n + r.errors, 0);
    card.append(el('h2', theories[concept.id]?.title ?? concept.title));
    if (correct)
      card.append(
        el('span', `${correct} risposte corrette senza aiuto`, 'pill positive'),
      );
    if (errors)
      card.append(el('span', `${errors} errori da rivedere`, 'pill negative'));
    card.append(
      observations(
        projection.observations.filter(
          (o) => o.dimension !== 'reading-comprehension',
        ),
      ),
      link('Rivedi il concetto', '/concept?id=' + concept.id),
    );
    page.append(card);
  }
  if (!requested) {
    const reading = el('section', undefined, 'card');
    reading.append(el('h2', 'Comprensione scritta'));
    for (const text of reviewedReadings().filter((t) =>
      catalog.allowed(t.status),
    )) {
      const projection = project(
        facts,
        'reading:' + text.id,
        text.version,
        catalog.allowCandidates,
      );
      if (!projection.sourceFactIds.length) continue;
      reading.append(
        el('h3', text.title),
        observations(
          projection.observations.filter(
            (o) => o.dimension === 'reading-comprehension',
          ),
        ),
      );
    }
    reading.append(
      link('Letture e riepiloghi', '/reading'),
      support(
        'La comprensión de un mensaje no se atribuye a todos sus conceptos gramaticales.',
      ),
    );
    page.append(reading);
  }
  const history = el('section', undefined, 'card');
  history.append(el('h2', 'Attività recente'));
  const roots = facts.filter(
    (f) =>
      f.kind === 'practice-session' && catalog.allowed(f.payload.contentStatus),
  );
  const attempts = facts.filter(
    (f) =>
      f.kind === 'attempt' &&
      roots.some((r) => {
        if (r.kind !== 'practice-session' || r.id !== f.payload.sessionId)
          return false;
        const activity = r.payload.activities[f.payload.itemIndex];
        return concepts.some(
          (c) =>
            c.id === activity?.conceptId &&
            c.version === activity.conceptVersion,
        );
      }),
  );
  const recent = attempts
    .slice()
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .slice(0, 8);
  if (!recent.length)
    history.append(
      support(
        'Todavía no hay respuestas. Aquí aparecerán tus prácticas recientes con su fecha real.',
      ),
    );
  const list = el('ol', undefined, 'timeline');
  for (const attempt of recent) {
    if (attempt.kind !== 'attempt') continue;
    const result = facts.find(
      (f) => f.kind === 'evaluation' && f.payload.attemptId === attempt.id,
    );
    if (result?.kind !== 'evaluation') continue;
    const item = el('li');
    const session = facts.find((f) => f.id === attempt.payload.sessionId);
    const title =
      (session?.kind === 'practice-session'
        ? session.payload.writing?.title
        : undefined) ??
      theories[result.payload.conceptId]?.title ??
      result.payload.conceptId;
    const label = {
      correct: '✓ Corretto',
      typo: '✕ Quasi — possibile refuso',
      'linguistic-error': '✕ Da rivedere',
      'verifiable-error': '✕ Da rivedere',
      'not-evaluable': '? Da verificare',
      'no-opportunity': '— Nessuna risposta',
    }[result.payload.judgment];
    item.append(
      el('strong', label),
      el('span', title),
      el('time', new Date(attempt.occurredAt).toLocaleString('it')),
    );
    list.append(item);
  }
  history.append(list);
  page.append(
    history,
    link('Testi e bozze di scrittura', '/writing'),
    support(
      'Recordar hoy no garantiza recordarlo más adelante. Review y práctica mixta comparten estas observaciones; una invitación diferida no acredita retención por sí sola.',
    ),
  );
  if (concepts.some((c) => c.status !== 'published'))
    page.append(previewNotice());
  return page;
}
