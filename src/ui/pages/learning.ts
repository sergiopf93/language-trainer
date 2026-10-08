import { button, el, message } from '../dom';
import type { LocalStore } from '../../persistence/local';
import { catalog } from '../../content/validation-fixture';
import { SessionEngine, type SessionView } from '../../learning/session';
export const judgmentLabels = {
  correct: 'Respuesta correcta',
  'verifiable-error': 'Error verificable',
  'not-evaluable': 'Respuesta no evaluable',
  'no-opportunity': 'Sin respuesta evaluable',
};
export async function learning(store: LocalStore, saved: () => void) {
  const page = el('section', undefined, 'card');
  page.setAttribute('aria-label', 'Práctica del concepto');
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
  const remember = () => {
    if (view && page.isConnected && location.pathname === '/practice')
      history.replaceState({}, '', '/practice?session=' + view.head.id);
  };
  const enqueue = (action: () => Promise<void>, redraw: boolean) => {
    pending++;
    status.textContent = 'Guardando…';
    queue = queue
      .then(async () => {
        if (failed) return;
        await action();
        remember();
        saved();
        if (redraw) {
          draw();
          const target = content.querySelector<HTMLElement>(
            view?.state.phase === 'feedback' ? '[role=status] h3' : 'h2',
          );
          if (target) {
            target.tabIndex = -1;
            target.focus();
          }
        }
        status.textContent = 'Práctica guardada en este dispositivo';
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
          .querySelectorAll<HTMLButtonElement | HTMLInputElement>(
            'button,input',
          )
          .forEach((n) => (n.disabled = true));
        return enqueue(action, true);
      },
      secondary,
    );
  const change = (action: 'hint' | 'retry' | 'next' | 'finish') => async () => {
    view = await engine.update(view!, action);
  };
  const draw = () => {
    content.replaceChildren();
    if (!view) return;
    const { root, state, facts } = view;
    const title =
      catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ??
      root.payload.conceptId;
    content.append(
      el('h2', title),
      el(
        'p',
        root.payload.contentStatus === 'candidate'
          ? 'CANDIDATE · Validación técnica. Sin aprobación editorial; no es contenido definitivo de V1.'
          : 'Contenido publicado',
        'muted',
      ),
    );
    if (state.status === 'completed') {
      const attempts = facts.filter(
        (f) => f.kind === 'attempt' && f.payload.sessionId === root.id,
      );
      const attemptIds = new Set(attempts.map((f) => f.id));
      const evaluations = facts.filter(
        (f) => f.kind === 'evaluation' && attemptIds.has(f.payload.attemptId),
      );
      content.append(
        el('h3', 'Resumen de sesión'),
        el(
          'p',
          `${new Set(attempts.flatMap((f) => (f.kind === 'attempt' ? [f.payload.itemIndex] : []))).size} de ${root.payload.activities.length} actividades respondidas · ${attempts.length} intentos conservados.`,
        ),
      );
      for (const [judgment, label] of Object.entries(judgmentLabels))
        content.append(
          el(
            'p',
            `${label}: ${evaluations.filter((f) => f.kind === 'evaluation' && f.payload.judgment === judgment).length}`,
          ),
        );
      content.append(
        el(
          'p',
          'Los aciertos con pista o tras ver la corrección son asistidos. Completar esta sesión no demuestra dominio estable.',
        ),
      );
      const progress = el('a', 'Ver progreso del concepto', 'primary-link');
      progress.href = '/progress?concept=' + root.payload.conceptId;
      const back = el('a', 'Volver a Biblioteca');
      back.href = '/library';
      content.append(progress, el('p'), back);
      return;
    }
    const activity = root.payload.activities[state.index];
    content.append(
      el(
        'p',
        `Actividad ${state.index + 1} de ${root.payload.activities.length}`,
      ),
      el('h3', activity.prompt),
    );
    if (state.phase === 'answer') {
      if (state.attemptId)
        content.append(
          el(
            'p',
            'Reintento tras corrección: se registrará como reparación asistida.',
            'muted',
          ),
        );
      if (activity.format === 'selection') {
        const choices = el('fieldset');
        choices.append(el('legend', 'Selecciona tu respuesta'));
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
            ? 'Completa el hueco'
            : 'Tu respuesta breve',
        );
        label.htmlFor = 'learning-answer';
        const input = el('input');
        input.id = 'learning-answer';
        input.value = state.draft;
        input.maxLength = 4000;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.lang = 'it';
        input.addEventListener('input', () => {
          const value = input.value;
          void enqueue(async () => {
            view = await engine.update(view!, 'draft', value);
          }, false);
        });
        content.append(label, input);
      }
      if (state.hintShown) content.append(el('p', 'Pista: ' + activity.hint));
      else content.append(command('Ver pista', change('hint'), true));
      content.append(
        command('Comprobar respuesta', async () => {
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
        const feedback = el('div');
        feedback.setAttribute('role', 'status');
        feedback.append(
          el('h3', judgmentLabels[evaluation.payload.judgment]),
          el('p', 'Tu respuesta: ' + (attempt.payload.response || '(vacía)')),
          el('p', evaluation.payload.explanation),
        );
        feedback.append(
          el(
            'p',
            attempt.payload.hintShown ||
              attempt.payload.solutionSeen ||
              attempt.payload.exposureId
              ? 'Observación asistida o ítem ya expuesto: no acredita recuperación independiente.'
              : 'Intento sin ayudas de este ítem; no demuestra retención ni dominio estable.',
            'muted',
          ),
        );
        content.append(feedback);
      }
      content.append(
        command('Reintentar', change('retry'), true),
        command(
          state.index + 1 === root.payload.activities.length
            ? 'Finalizar y ver resumen'
            : 'Siguiente actividad',
          change('next'),
        ),
      );
    }
    content.append(
      el('p'),
      command('Terminar sesión ahora', change('finish'), true),
    );
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
        el('h2', concept.title),
        el('p', concept.objective),
        el('p', concept.scope),
        el(
          'p',
          'CANDIDATE · Solo validación técnica. No revisado ni publicado.',
          'muted',
        ),
      );
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
        command('Iniciar práctica', async () => {
          view = await engine.start(conceptId);
        }),
      );
    } else {
      content.append(el('h2', 'Práctica por concepto'));
      const link = el('a', 'Elegir concepto en Biblioteca', 'primary-link');
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
          `${head.payload.state.status === 'completed' ? 'Resumen' : 'Continuar'}: ${catalog.concepts.find((c) => c.id === root.payload.conceptId)?.title ?? root.payload.conceptId} · ${head.occurredAt} · ${head.id.slice(0, 8)}`,
        );
        link.href = '/practice?session=' + head.id;
        content.append(el('p'));
        content.append(link);
      }
      content.append(
        el(
          'p',
          'Cada versión concurrente se conserva como una opción separada.',
          'muted',
        ),
      );
    }
  } catch (error) {
    status.textContent = message(error);
  }
  return { page, isDirty: () => pending > 0 || failed };
}
