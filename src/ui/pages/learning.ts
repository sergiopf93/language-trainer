import { copy, language, instruction } from '../language';
import {
  link,
  metric,
  previewNotice,
  support,
  theoryPanel,
} from '../components';
import { theories } from '../../content/theory';
import { button, el, message } from '../dom';
import type { LocalStore } from '../../persistence/local';
import { catalog } from '../../content/validation-fixture';
import { SessionEngine, type SessionView } from '../../learning/session';
import { displayResponse } from '../../exercises/response';
import { structuredAnswer } from '../structured-answer';
export const judgmentLabels = {
  correct: copy.correct,
  typo: 'Quasi!',
  'linguistic-error': copy.error,
  'verifiable-error': copy.error,
  'not-evaluable': copy.unknown,
  'no-opportunity': copy.empty,
};
export async function learning(store: LocalStore, saved: () => void) {
  const page = el('section', undefined, 'card');
  page.setAttribute('aria-label', 'Pratica del concetto');
  const engine = new SessionEngine(store, catalog);
  const content = el('div');
  const status = el('p', '', 'muted');
  status.setAttribute('role', 'status');
  page.append(content, status);
  let view: SessionView | undefined;
  let queue = Promise.resolve();
  let pending = 0;
  let failed = false;
  let busy = false;
  let theoryOpen = false;
  const remember = () => {
    if (view && page.isConnected && location.pathname === '/practice')
      history.replaceState({}, '', '/practice?session=' + view.head.id);
  };
  const enqueue = (action: () => Promise<void>, redraw: boolean) => {
    pending++;
    if (redraw) status.textContent = 'Salvataggio…';
    queue = queue
      .then(async () => {
        if (failed) return;
        await action();
        remember();
        saved();
        if (redraw) {
          draw();
          const target = content.querySelector<HTMLElement>(
            theoryOpen
              ? '.theory-panel h3'
              : view?.state.phase === 'feedback'
                ? '[role=status] h3'
                : 'h2',
          );
          if (target) {
            target.tabIndex = -1;
            target.focus();
          }
        }
        status.textContent = copy.saved;
      })
      .catch((error) => {
        failed = true;
        status.textContent =
          'No se ha guardado. ' +
          message(error) +
          ' Conserva tu respuesta y recarga para recuperar la última versión guardada.';
      })
      .finally(() => {
        pending--;
        busy = false;
      });
    return queue;
  };
  const command = (
    label: string,
    action: () => Promise<void>,
    secondary = false,
  ) =>
    button(
      label,
      () => {
        if (busy || failed) return;
        busy = true;
        content
          .querySelectorAll<
            HTMLButtonElement | HTMLInputElement | HTMLSelectElement
          >('button,input,select')
          .forEach((n) => (n.disabled = true));
        return enqueue(action, true);
      },
      secondary,
    );
  const change = (action: 'hint' | 'retry' | 'next' | 'finish') => async () => {
    theoryOpen = false;
    view = await engine.update(view!, action);
  };
  const draw = () => {
    content.replaceChildren();
    if (!view) return;
    const { root, state, facts } = view;
    const title =
      catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ??
      root.payload.conceptId;
    content.append(el('h2', theories[root.payload.conceptId]?.title ?? title));
    if (root.payload.contentStatus === 'candidate')
      content.append(el('span', 'Contenuti di prova', 'pill'));
    if (state.status === 'completed') {
      const attempts = facts.filter(
        (f) => f.kind === 'attempt' && f.payload.sessionId === root.id,
      );
      const attemptIds = new Set(attempts.map((f) => f.id));
      const evaluations = facts.filter(
        (f) => f.kind === 'evaluation' && attemptIds.has(f.payload.attemptId),
      );
      content.append(
        el('h3', copy.summary),
        el(
          'p',
          `${new Set(attempts.flatMap((f) => (f.kind === 'attempt' ? [f.payload.itemIndex] : []))).size} di ${root.payload.activities.length} esercizi · ${attempts.length} tentativi.`,
        ),
      );
      const answered = new Set(
        attempts.flatMap((f) =>
          f.kind === 'attempt' ? [f.payload.itemIndex] : [],
        ),
      ).size;
      const ring = el(
        'div',
        `${answered} / ${root.payload.activities.length}`,
        'completion-ring',
      );
      ring.style.setProperty(
        '--completion',
        `${(answered / root.payload.activities.length) * 100}%`,
      );
      ring.setAttribute('role', 'img');
      ring.setAttribute(
        'aria-label',
        `${answered} di ${root.payload.activities.length} esercizi con risposta inviata`,
      );
      content.append(ring);
      const stats = el('div', undefined, 'metrics');
      const evidence = facts.filter(
        (f) => f.kind === 'evidence' && f.payload.sessionId === root.id,
      );
      stats.append(
        metric(
          evidence.filter(
            (f) =>
              f.kind === 'evidence' &&
              f.payload.independent &&
              f.payload.judgment === 'correct',
          ).length,
          'corrette senza aiuto',
        ),
        metric(
          attempts.filter(
            (f) =>
              f.kind === 'attempt' &&
              (f.payload.theoryVersion ||
                f.payload.hintShown ||
                f.payload.solutionSeen ||
                f.payload.exposureId),
          ).length,
          'risposte con aiuto',
        ),
        metric(
          evaluations.filter(
            (f) =>
              f.kind === 'evaluation' &&
              ['verifiable-error', 'linguistic-error'].includes(
                f.payload.judgment,
              ),
          ).length,
          'da rivedere',
        ),
        metric(
          evaluations.filter(
            (f) => f.kind === 'evaluation' && f.payload.judgment === 'typo',
          ).length,
          'possibili refusi',
        ),
        metric(
          evaluations.filter(
            (f) =>
              f.kind === 'evaluation' &&
              ['not-evaluable', 'no-opportunity'].includes(f.payload.judgment),
          ).length,
          'senza valutazione',
        ),
      );
      content.append(
        stats,
        support(
          'Cada cifra cuenta respuestas, incluidos reintentos; las respuestas con ayuda pueden incluir errores.',
        ),
      );
      content.append(
        support(
          'Buen trabajo: has dedicado tiempo a practicar. Consultar teoría, pistas o correcciones cuenta como ayuda. Una sesión no demuestra que ya lo recuerdes a largo plazo.',
        ),
      );
      const progress = el('a', 'Vedi i progressi', 'primary-link');
      progress.href = '/progress?concept=' + root.payload.conceptId;
      const back = el('a', 'Torna alla biblioteca');
      back.href = '/library';
      content.append(progress, el('p'), back);
      return;
    }
    const activity = root.payload.activities[state.index];
    content.append(
      el(
        'p',
        `Esercizio ${state.index + 1} di ${root.payload.activities.length}`,
      ),
      el('h3', instruction(activity)),
    );
    const meter = el('progress');
    meter.max = root.payload.activities.length;
    meter.value = state.index;
    meter.setAttribute('aria-label', 'Esercizi completati');
    content.insertBefore(meter, content.lastElementChild);
    if (theories[root.payload.conceptId]) {
      const panel = theoryPanel(root.payload.conceptId);
      panel.hidden = true;
      panel.id = 'session-theory';
      const toggle = command(
        copy.theory,
        async () => {
          view = await engine.update(
            view!,
            'theory',
            theories[root.payload.conceptId].version,
          );
          theoryOpen = true;
        },
        true,
      );
      toggle.setAttribute('aria-controls', panel.id);
      toggle.setAttribute('aria-expanded', String(theoryOpen));
      content.append(toggle);
      if (theoryOpen) {
        panel.hidden = false;
        panel.prepend(
          support(
            'Consultar esta ficha cuenta como ayuda en lo que queda de sesión. Puedes volver a responder cuando quieras.',
          ),
        );
        panel.append(
          button(
            'Torna all’esercizio',
            () => {
              theoryOpen = false;
              draw();
              content.querySelector<HTMLButtonElement>('button')?.focus();
            },
            true,
          ),
        );
      }
      content.append(panel);
    }
    if (state.phase === 'answer') {
      if (state.attemptId)
        content.append(
          el(
            'p',
            'Riprova con la correzione: questa risposta conta come pratica con aiuto.',
            'muted',
          ),
        );
      if (['ordering', 'matching'].includes(activity.format)) {
        content.append(
          structuredAnswer(activity, state.draft, (value) => {
            void enqueue(async () => {
              view = await engine.update(view!, 'draft', value);
            }, false);
          }),
        );
      } else if (['selection', 'error-detection'].includes(activity.format)) {
        const choices = el('fieldset');
        choices.append(el('legend', 'Scegli la risposta'));
        for (const [i, option] of activity.options.entries()) {
          const label = el('label', undefined, 'answer-choice');
          const input = el('input');
          input.type = 'radio';
          input.name = 'answer';
          input.value = option;
          input.id = 'answer-' + i;
          input.checked = state.draft === option;
          input.addEventListener(
            'change',
            () =>
              void enqueue(async () => {
                view = await engine.update(view!, 'draft', option);
              }, false),
          );
          label.append(input, document.createTextNode(option));
          choices.append(label);
        }
        content.append(choices);
      } else {
        const label = el(
          'label',
          activity.format === 'cloze'
            ? 'Completa lo spazio'
            : 'La tua risposta',
        );
        label.htmlFor = 'learning-answer';
        const input = el('input');
        input.id = 'learning-answer';
        input.value = state.draft;
        input.maxLength = 4000;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.lang = language.targetLanguage;
        input.addEventListener('input', () => {
          const value = input.value;
          void enqueue(async () => {
            view = await engine.update(view!, 'draft', value);
          }, false);
        });
        content.append(label, input);
      }
      if (state.hintShown) content.append(support('Ayuda: ' + activity.hint));
      else content.append(command(copy.hint, change('hint'), true));
      content.append(
        command(copy.check, async () => {
          view = await engine.submit(view!);
        }),
      );
    } else {
      const attempt = facts.find((f) => f.id === state.attemptId);
      const evaluation = facts.find(
        (f) =>
          f.kind === 'evaluation' && f.payload.attemptId === state.attemptId,
      );
      if (attempt?.kind === 'attempt' && evaluation?.kind === 'evaluation') {
        const feedback = el(
          'div',
          undefined,
          'feedback ' +
            (evaluation.payload.judgment === 'correct'
              ? 'positive'
              : ['verifiable-error', 'linguistic-error', 'typo'].includes(
                    evaluation.payload.judgment,
                  )
                ? 'negative'
                : 'neutral'),
        );
        const symbol = el(
          'span',
          evaluation.payload.judgment === 'correct'
            ? '✓'
            : ['verifiable-error', 'linguistic-error', 'typo'].includes(
                  evaluation.payload.judgment,
                )
              ? '✕'
              : '?',
          'feedback-symbol',
        );
        symbol.setAttribute('aria-hidden', 'true');
        feedback.append(symbol);
        feedback.setAttribute('role', 'status');
        feedback.append(
          el('h3', judgmentLabels[evaluation.payload.judgment]),
          el(
            'p',
            'La tua risposta: ' +
              (displayResponse(activity, attempt.payload.response) ||
                '(vuota)'),
          ),
          support(
            evaluation.payload.judgment === 'no-opportunity'
              ? 'Todavía no has enviado una respuesta. Puedes volver a intentarlo.'
              : evaluation.payload.judgment === 'not-evaluable'
                ? 'No podemos comprobar esta respuesta con seguridad. No cuenta como error. Consulta la teoría si necesitas ayuda.'
                : evaluation.payload.explanation.replace(
                    'La consigna pide el pronombre; este ítem no evalúa la omisión del sujeto.',
                    'En este ejercicio, escribe también el pronombre noi.',
                  ),
            '',
          ),
        );
        feedback.append(
          el(
            'p',
            attempt.payload.theoryVersion ||
              attempt.payload.hintShown ||
              attempt.payload.solutionSeen ||
              attempt.payload.exposureId
              ? 'Con aiuto · Hai consultato un supporto o già visto questo esercizio.'
              : 'Senza aiuto · Un passo avanti nella pratica.',
            'muted',
          ),
        );
        content.append(feedback);
      }
      content.append(
        command(copy.retry, change('retry'), true),
        command(
          state.index + 1 === root.payload.activities.length
            ? 'Vedi il riepilogo'
            : copy.next,
          change('next'),
        ),
      );
    }
    content.append(el('p'), command(copy.finish, change('finish'), true));
  };
  const params = new URLSearchParams(location.search);
  try {
    const sessionId = params.get('session');
    const conceptId = params.get('concept');
    if (sessionId) {
      const heads = await engine.sessions();
      const requested = await engine.load(sessionId);
      const matching = heads.filter((h) => h.entityId === requested.root.id);
      if (matching.length === 1) view = await engine.load(matching[0].id);
      else if (matching.some((h) => h.id === sessionId)) view = requested;
      else
        throw new Error(
          'Hay versiones concurrentes. Vuelve a Practicar para elegir cuál continuar.',
        );
      draw();
    } else if (conceptId) {
      const concept = catalog.concept(conceptId);
      if (!concept)
        throw new Error('Concepto no habilitado en esta compilación.');
      content.append(
        el('h2', theories[conceptId]?.title ?? concept.title),
        support(theories[concept.id]?.goal ?? concept.objective, ''),
      );
      content.append(link('← Teoria ed esempi', '/concept?id=' + conceptId));
      if (concept.status === 'candidate') content.append(previewNotice());
      for (const r of catalog.relations.filter(
        (r) => r.from === conceptId && r.type === 'prerequisite',
      ))
        content.append(
          el(
            'p',
            'Preparación recomendada: ' +
              (catalog.concepts.find((c) => c.id === r.to)?.title ?? r.to) +
              '. ' +
              r.reason,
          ),
        );
      content.append(
        command(copy.start, async () => {
          view = await engine.start(conceptId);
        }),
      );
    } else {
      content.append(el('h2', 'Scegli la tua pratica'));
      const link = el('a', 'Esplora la biblioteca', 'primary-link');
      link.href = '/library';
      content.append(link);
      const history = await store.allFacts();
      for (const head of await engine.sessions()) {
        const root = history.find((f) => f.id === head.entityId);
        if (
          root?.kind !== 'practice-session' ||
          !catalog.allowed(root.payload.contentStatus)
        )
          continue;
        const link = el(
          'a',
          `${head.payload.state.status === 'completed' ? 'Riepilogo' : 'Continua'}: ${catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ?? root.payload.conceptId} · ${new Date(head.occurredAt).toLocaleString(language.targetLanguage)}`,
        );
        link.href = '/practice?session=' + head.id;
        content.append(el('p'));
        content.append(link);
      }
      content.append(
        el(
          'p',
          'Se hai praticato su più dispositivi, puoi ritrovare qui le diverse sessioni.',
          'muted',
        ),
      );
    }
  } catch (error) {
    status.textContent = message(error);
  }
  return { page, isDirty: () => pending > 0 || failed };
}
