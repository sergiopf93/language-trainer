import { el } from '../dom';
import { link, support } from '../components';
import { catalog, activeTheories } from '../../content/language-packs';
import { LocalReviewScheduler } from '../../review/engine';
import type { LocalStore } from '../../persistence/local';
export async function reviewOverview(store: LocalStore) {
  const section = el('section');
  section.setAttribute('aria-label', 'Ripasso');
  section.append(
    el('h2', 'Ripasso'),
    support(
      'Repasa un concepto estudiado antes de consultar la explicación. Las recomendaciones describen tu historial, no un porcentaje de dominio.',
    ),
  );
  const plans = await new LocalReviewScheduler(store, catalog).suggest(
    new Date(),
    catalog.available().length,
  );
  if (!plans.length)
    section.append(
      el(
        'p',
        'Non ci sono ancora concetti studiati da ripassare. Inizia dalla biblioteca.',
      ),
    );
  for (const plan of plans) {
    const card = el('article', undefined, 'card');
    card.append(
      el(
        'h3',
        activeTheories[plan.conceptId]?.title ??
          catalog.concept(plan.conceptId)!.title,
      ),
      el('p', plan.reason),
    );
    card.append(
      el(
        'p',
        'Ultima pratica o lettura: ' +
          new Date(plan.lastPracticedAt).toLocaleString('it') +
          '.',
      ),
    );
    card.append(
      el(
        'p',
        plan.due
          ? 'Invito al ripasso disponibile.'
          : 'Prossimo invito: ' +
              new Date(plan.nextCheckAt).toLocaleString('it') +
              '. Puoi praticare anche prima.',
      ),
    );
    card.append(
      support(
        plan.freshActivities
          ? 'Se priorizan actividades que todavía no has respondido; una sesión contiene hasta cuatro.'
          : 'Ya has respondido todas las actividades disponibles. Repetirlas sirve para practicar, pero no demuestra retención independiente.',
      ),
    );
    card.append(
      link(
        'Ripassa · ' +
          (activeTheories[plan.conceptId]?.title ??
            catalog.concept(plan.conceptId)!.title),
        '/practice?review=' + plan.conceptId,
        true,
      ),
    );
    section.append(card);
  }
  section.append(
    support(
      'El siguiente día (24 horas) es una invitación orientativa, no una medida de olvido. No hay deuda ni sesiones obligatorias.',
    ),
  );
  return section;
}
