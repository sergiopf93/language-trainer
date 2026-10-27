import { writingOptions, writingPreparation } from '../../writing/engine';
import { copy, language, instruction } from '../language';
import {
  link,
  dimensionCopy,
  metric,
  previewNotice,
  support,
  theoryPanel,
} from '../components';
import {
  catalog,
  activeTheories as theories,
} from '../../content/language-packs';
import { button, el, message } from '../dom';
import type { LocalStore } from '../../persistence/local';
import { SessionEngine, type SessionView } from '../../learning/session';
import { displayResponse } from '../../exercises/response';
import { structuredAnswer } from '../structured-answer';
import { reviewOverview } from './review';
import { mixedPlans, mixedGroupPrerequisites } from '../../mixed/engine';
import { mixedGroups } from '../../mixed/manifest';
import { reviewedReadings, readingEligibility } from '../../reading/engine';
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
    if (!failed) status.textContent = 'Salvataggio…';
    queue = queue
      .then(async () => {
        if (failed) return;
        const previousView = view ? `${view.root.id}:${view.state.status}` : '';
        const previousItem = view?.state.index;
        await action();
        if (previousItem !== view?.state.index) theoryOpen = false;
        const changedView =
          previousView !== (view ? `${view.root.id}:${view.state.status}` : '');
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
            target.focus({ preventScroll: changedView });
          }
        }
        if (changedView)
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        status.textContent = pending > 1 ? 'Salvataggio…' : copy.saved;
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
            | HTMLButtonElement
            | HTMLInputElement
            | HTMLSelectElement
            | HTMLTextAreaElement
          >('button,input,select,textarea')
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
    if (root.payload.mode === 'review')
      content.append(el('p', 'Ripasso · ' + root.payload.selectionReason));
    const title =
      root.payload.writing?.title ??
      root.payload.reading?.title ??
      catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ??
      root.payload.conceptId;
    content.append(
      el(
        'h2',
        root.payload.mode === 'mixed'
          ? 'Pratica mista'
          : (root.payload.writing?.title ??
              theories[root.payload.conceptId]?.title ??
              title),
      ),
    );
    if (root.payload.contentStatus !== 'published')
      content.append(el('span', 'Contenuti di prova', 'pill'));
    if (root.payload.mode === 'mixed' && state.status === 'completed')
      content.append(el('p', root.payload.selectionReason));
    if (root.payload.reading) {
      const article = el('article', undefined, 'reading-text');
      article.setAttribute('aria-label', 'Testo della lettura');
      article.lang = 'it';
      for (const paragraph of root.payload.reading.body.split('\n'))
        article.append(el('p', paragraph));
      content.append(article);
      if (state.readingHelp)
        content.append(support(root.payload.reading.help, 'reading-help'));
      else if (state.status !== 'completed')
        content.append(
          command(
            'Vocabolario e aiuto',
            async () => {
              view = await engine.update(view!, 'reading-help');
            },
            true,
          ),
        );
    }
    if (state.status === 'completed') {
      if (root.payload.reading || root.payload.writing) {
        const details = el('section');
        details.append(el('h3', 'Le tue risposte'));
        for (const a of root.payload.activities) {
          details.append(el('h4', a.prompt));
          for (const attempt of facts
            .filter(
              (f) =>
                f.kind === 'attempt' &&
                f.payload.sessionId === root.id &&
                f.payload.activityId === a.id,
            )
            .sort((x, y) =>
              x.deviceId === y.deviceId
                ? x.sequence - y.sequence
                : x.occurredAt.localeCompare(y.occurredAt) ||
                  x.id.localeCompare(y.id),
            )) {
            if (attempt.kind !== 'attempt') continue;
            const result = facts.find(
              (f) =>
                f.kind === 'evaluation' && f.payload.attemptId === attempt.id,
            );
            if (result?.kind === 'evaluation') {
              const response = el(
                'p',
                `${attempt.payload.response || '(vuota)'} · ${judgmentLabels[result.payload.judgment]}`,
              );
              response.style.whiteSpace = 'pre-wrap';
              if (root.payload.writing)
                details.append(
                  el(
                    'p',
                    `${attempt.payload.retryOf ? 'Revisione' : 'Primo tentativo'} · ${attempt.payload.hintShown || attempt.payload.theoryVersion || attempt.payload.solutionSeen || attempt.payload.exposureId ? 'con aiuto' : 'senza aiuto'}`,
                    'muted',
                  ),
                );
              details.append(response);
            }
          }
          if (
            facts.some(
              (f) =>
                f.kind === 'attempt' &&
                f.payload.sessionId === root.id &&
                f.payload.activityId === a.id,
            )
          )
            details.append(support(a.explanation));
          else details.append(el('p', 'Non risposta'));
        }
        details.append(
          support(
            root.payload.writing
              ? 'Las producciones abiertas se conservan sin calificación. Solo los criterios delimitados generan observaciones del objetivo; una reparación no acredita recuperación autónoma.'
              : 'Estas observaciones corresponden a comprensión lectora. No acreditan producción, dominio gramatical ni retención.',
          ),
          root.payload.writing
            ? link('Scegli un’altra attività di scrittura', '/writing')
            : link('Scegli un’altra lettura', '/reading'),
        );
        content.append(details);
      }
      if (root.payload.mixed) {
        const details = el('section');
        details.append(el('h3', 'Concetti e osservazioni'));
        root.payload.mixed.conceptIds.forEach((id, i) => {
          details.append(
            el('h4', catalog.concepts.find((c) => c.id === id)?.title ?? id),
            el(
              'p',
              'Motivo della selezione iniziale: ' +
                root.payload.mixed!.reasons[i],
            ),
          );
          const observations = facts.filter(
            (f) =>
              f.kind === 'evidence' &&
              f.payload.sessionId === root.id &&
              f.payload.conceptId === id,
          );
          for (const f of observations)
            if (f.kind === 'evidence')
              details.append(
                el(
                  'p',
                  `${dimensionCopy[f.payload.dimension][0]} · ${judgmentLabels[f.payload.judgment]} · ${f.payload.independent ? 'senza aiuto' : 'con aiuto'}`,
                ),
              );
          if (!observations.length)
            details.append(
              el('p', 'Nessuna evidenza valutabile per questo concetto.'),
            );
          details.append(
            link('Progressi del concetto', '/progress?concept=' + id),
          );
        });
        details.append(
          support(
            'Reconocimiento, recuperación, discriminación y uso contextual conservan su dimensión. Practicar después de un intervalo no acredita automáticamente retención.',
          ),
        );
        content.append(details);
      }
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
              (f.payload.readingHelp ||
                f.payload.theoryVersion ||
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
      progress.href = ['mixed', 'reading', 'writing'].includes(
        root.payload.mode,
      )
        ? '/progress'
        : '/progress?concept=' + root.payload.conceptId;
      const back = el('a', 'Torna alla biblioteca');
      back.href = '/library';
      content.append(progress, el('p'), back);
      if (root.payload.mode === 'review')
        content.append(el('p'), link('Torna al ripasso', '/practice'));
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
    if (activity.writing) {
      if (activity.writing.policy === 'open')
        content.append(
          support(
            'Texto abierto: se conserva sin nota ni corrección automática.',
          ),
        );
      const rubric = el('details');
      rubric.setAttribute('aria-label', 'Criteri per rileggere');
      rubric.append(el('summary', 'Prima di inviare, rileggi'));
      const list = el('ul');
      for (const criterion of activity.writing.rubric)
        list.append(el('li', criterion));
      rubric.append(
        list,
        support(
          activity.writing.policy === 'open'
            ? 'Esta rúbrica te orienta al revisar; el sistema no evalúa automáticamente estas dimensiones. Tu texto se conservará sin nota.'
            : 'Solo se verifican las respuestas y errores descritos por este criterio. Otras expresiones se conservan sin penalización.',
        ),
      );
      content.append(rubric);
    }
    const meter = el('progress');
    meter.max = root.payload.activities.length;
    meter.value = state.index;
    meter.setAttribute('aria-label', 'Esercizi completati');
    content.insertBefore(meter, content.lastElementChild);
    if (theories[activity.conceptId]) {
      const panel = theoryPanel(activity.conceptId);
      panel.hidden = true;
      panel.id = 'session-theory';
      const toggle = command(
        copy.theory,
        async () => {
          view = await engine.update(
            view!,
            'theory',
            theories[activity.conceptId].version,
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
      if (root.payload.mode !== 'mixed' || theoryOpen) content.append(panel);
    }
    if (state.phase === 'answer') {
      if (state.attemptId)
        content.append(
          el(
            'p',
            activity.writing?.policy === 'open'
              ? 'Rivedi il testo dopo il feedback: non è una correzione automatica.'
              : 'Riprova con la correzione: questa risposta conta come pratica con aiuto.',
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
        const input = root.payload.writing ? el('textarea') : el('input');
        if (input instanceof HTMLTextAreaElement)
          input.rows = activity.family === 'F6' ? 8 : 3;
        input.id = 'learning-answer';
        input.value = state.draft;
        input.maxLength = 4000;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.lang = language.targetLanguage;
        let lastQueuedValue = state.draft;
        input.addEventListener('input', () => {
          const value = input.value;
          // A multiline paste can dispatch repeated events with the same final value.
          if (root.payload.writing && value === lastQueuedValue) return;
          lastQueuedValue = value;
          void enqueue(async () => {
            view = await engine.update(view!, 'draft', value);
          }, false);
        });
        content.append(label, input);
        if (root.payload.writing) {
          const preview = el('p');
          preview.style.whiteSpace = 'pre-wrap';
          preview.setAttribute('aria-live', 'polite');
          content.append(
            button(
              'Rileggi il testo',
              () => {
                preview.textContent =
                  input.value || 'Non hai ancora scritto un testo.';
                preview.tabIndex = -1;
                preview.focus();
              },
              true,
            ),
            preview,
          );
        }
      }
      if (!root.payload.reading) {
        if (state.hintShown) content.append(support('Ayuda: ' + activity.hint));
        else {
          content.append(command(copy.hint, change('hint'), true));
          if (root.payload.writing)
            content.append(
              command('Ho usato un aiuto esterno', change('hint'), true),
            );
        }
      }
      content.append(
        command(copy.check, async () => {
          view = await engine.submit(view!);
          theoryOpen = false;
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
        if (root.payload.writing) feedback.style.whiteSpace = 'pre-wrap';
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
              : evaluation.payload.judgment === 'not-evaluable' &&
                  !root.payload.writing
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
            attempt.payload.readingHelp ||
              attempt.payload.theoryVersion ||
              attempt.payload.hintShown ||
              attempt.payload.solutionSeen ||
              attempt.payload.exposureId
              ? 'Con aiuto · Hai consultato un supporto o già visto questo esercizio.'
              : 'Senza aiuto · Un passo avanti nella pratica.',
            'muted',
          ),
        );
        if (evaluation.payload.writingOutcome) {
          const labels = {
            canonical: 'Risposta verificata',
            'accepted-variant': 'Variante accettata',
            'confirmed-error': 'Errore verificato',
            typo: 'Possibile refuso',
            empty: 'Risposta vuota',
            incomplete: 'Risposta incompleta',
            'off-task': 'Consegna non rispettata',
            'target-not-demonstrated': 'Struttura non dimostrata',
            unassessed: 'Testo non valutato automaticamente',
          };
          feedback.append(el('p', labels[evaluation.payload.writingOutcome]));
        }
        if (
          root.payload.writing &&
          evaluation.payload.judgment === 'not-evaluable'
        ) {
          const option = writingOptions(catalog).find(
            (o) => o.id === root.payload.writing!.id,
          );
          if (option)
            feedback.append(
              link(
                'Pratica con un obiettivo verificabile',
                '/practice?concept=' + option.alternativeConceptId,
              ),
            );
        }
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
    content.append(el('p'), link('Pausa e torna alla pratica', '/practice'));
    content.append(command(copy.finish, change('finish'), true));
  };
  const params = new URLSearchParams(location.search);
  try {
    const sessionId = params.get('session');
    const reviewId = params.get('review');
    const conceptId = params.get('concept') ?? reviewId;
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
    } else if (params.has('writing')) {
      const option = writingOptions(catalog).find(
        (o) => o.id === params.get('writing'),
      );
      if (!option)
        throw new Error('Scrittura non disponibile in questa versione.');
      const missing = writingPreparation(
        option,
        catalog,
        await store.allFacts(),
      );
      content.append(
        el('h2', option.title),
        el('p', option.objectives.join(' · ')),
        el('p', option.context),
      );
      if (missing.length) {
        content.append(el('p', 'Prima di scrivere, esplora questi concetti:'));
        for (const id of missing)
          content.append(
            el('p'),
            link(catalog.concept(id)?.title ?? id, '/concept?id=' + id),
          );
      } else
        content.append(
          command('Inizia a scrivere', async () => {
            view = await engine.startWriting(option.id);
          }),
        );
      content.append(
        el('p'),
        link('Tutte le attività di scrittura', '/writing'),
      );
    } else if (params.has('reading')) {
      const text = reviewedReadings().find(
        (t) => t.id === params.get('reading'),
      );
      if (!text || !catalog.allowed(text.status))
        throw new Error('Lettura non disponibile in questa versione.');
      const readiness = readingEligibility(
        text,
        catalog,
        await store.allFacts(),
      );
      content.append(
        el('h2', text.title),
        el('p', text.objectives.join(' · ')),
      );
      if (!readiness.eligible) {
        content.append(
          el('p', 'Prima di questa lettura, esplora la preparazione indicata.'),
        );
        for (const id of readiness.missingConcepts)
          content.append(
            el('p'),
            link(catalog.concept(id)?.title ?? id, '/concept?id=' + id),
          );
        for (const id of readiness.missingReadings)
          content.append(
            el('p'),
            link('Lettura: ' + id, '/practice?reading=' + id),
          );
      } else
        content.append(
          command('Inizia la lettura', async () => {
            view = await engine.startReading(text);
          }),
        );
      content.append(el('p'), link('Tutte le letture', '/reading'));
    } else if (params.has('mixed')) {
      const plans = mixedPlans(catalog, await store.allFacts(), new Date());
      content.append(el('h2', 'Pratica mista'));
      const selectedGroup = params.get('mixed');
      const selectedPlan =
        selectedGroup === '1'
          ? plans[0]
          : plans.find((p) => p.groupId === selectedGroup);
      if (!selectedPlan) {
        content.append(
          el(
            'p',
            'Servono più concetti già studiati, con preparazione e attività compatibili. Esplora la biblioteca.',
          ),
        );
        const group = mixedGroups.find(
          (g) =>
            g.id === selectedGroup &&
            g.conceptIds.every((id) => catalog.concept(id)),
        );
        if (group) {
          content.append(
            support(
              'Preparación del grupo: consulta estos conceptos antes de volver a intentarlo.',
            ),
          );
          for (const id of mixedGroupPrerequisites(catalog, group))
            content.append(
              link(
                theories[id]?.title ?? catalog.concept(id)?.title ?? id,
                '/concept?id=' + id,
              ),
            );
        }
      } else {
        const plan = selectedPlan;
        content.append(
          el('p', plan.reason),
          el(
            'p',
            `${plan.conceptIds.length} concetti · ${plan.activities.length} attività · ${plan.freshActivities} non ancora risposte.`,
          ),
          support(
            'Las actividades conocidas pueden volver a aparecer al agotar el banco. Puedes pedir ayuda; quedará registrada. Los conceptos se muestran al terminar para no anticipar la estructura.',
          ),
        );
        content.append(
          command('Inizia la pratica mista', async () => {
            view = await engine.startMixed(plan.groupId);
          }),
        );
      }
    } else if (conceptId) {
      const concept = catalog.concept(conceptId);
      if (!concept)
        throw new Error('Concepto no habilitado en esta compilación.');
      content.append(
        el('h2', theories[conceptId]?.title ?? concept.title),
        support(theories[concept.id]?.goal ?? concept.objective, ''),
      );
      content.append(link('← Teoria ed esempi', '/concept?id=' + conceptId));
      if (concept.status !== 'published') content.append(previewNotice());
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
        command(reviewId ? 'Inizia il ripasso' : copy.start, async () => {
          view = await engine.start(conceptId, reviewId ? 'review' : 'focus');
        }),
      );
    } else {
      content.append(link('Scrittura A1', '/writing', true));
      content.append(link('Letture A1', '/reading', true));
      content.append(link('Pratica mista', '/practice?mixed=1', true));
      content.append(await reviewOverview(store));
      content.append(el('h2', 'Scegli la tua pratica'));
      const libraryLink = el('a', 'Esplora la biblioteca', 'primary-link');
      libraryLink.href = '/library';
      content.append(libraryLink);
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
          `${head.payload.state.status === 'completed' ? 'Riepilogo' : 'Continua'}${root.payload.mode === 'review' ? ' ripasso' : root.payload.mode === 'mixed' ? ' pratica mista' : ''}: ${root.payload.mode === 'mixed' ? 'Concetti in contesto' : (root.payload.writing?.title ?? root.payload.reading?.title ?? catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ?? root.payload.conceptId)} · ${new Date(head.occurredAt).toLocaleString(language.targetLanguage)}`,
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
