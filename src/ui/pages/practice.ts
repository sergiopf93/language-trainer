import { learning } from './learning';
import { button, el, heading, message } from '../dom';
import type { LocalStore } from '../../persistence/local';
import type { DraftFact } from '../../../shared/protocol';
export async function practice(store: LocalStore, saved: () => void) {
  const page = heading(
    'Practicar',
    'Practica un concepto o conserva una intención para más adelante.',
  );
  const guided = await learning(store, saved);
  page.append(guided.page);
  const card = el('section', undefined, 'card');
  const label = el('label', '¿Qué te gustaría practicar?');
  label.htmlFor = 'intention';
  const input = el('textarea');
  input.id = 'intention';
  input.maxLength = 4000;
  input.rows = 5;
  input.placeholder = 'Por ejemplo: presentarme y conocer a otras personas';
  let base: DraftFact | undefined;
  let dirty = false;
  let editing = 0;
  const status = el(
    'p',
    'El borrador se guarda solo cuando pulsas Guardar.',
    'muted',
  );
  status.setAttribute('role', 'status');
  input.addEventListener('input', () => {
    dirty = true;
    editing++;
    status.textContent = 'Cambios sin guardar';
  });
  const choices = el('div');
  const refresh = async () => {
    choices.replaceChildren();
    const heads = await store.heads();
    if (!base && !dirty && heads.length === 1) {
      base = heads[0];
      input.value = base.payload.intention;
    }
    if (heads.length > 1)
      choices.append(
        el(
          'p',
          'Hay varios borradores o versiones. Elige cuál continuar; las demás se conservan.',
        ),
      );
    for (const fact of heads) {
      const pick = button(
        fact.payload.intention.slice(0, 70) || 'Borrador sin título',
        () => {
          if (
            dirty &&
            !window.confirm(
              'Hay texto sin guardar. ¿Quieres cambiar de borrador?',
            )
          )
            return;
          base = fact;
          input.value = fact.payload.intention;
          dirty = false;
          editing++;
          status.textContent = 'Borrador recuperado';
          input.focus();
        },
        true,
      );
      choices.append(pick);
    }
  };
  const save = button('Guardar borrador', async () => {
    save.disabled = true;
    const revision = editing;
    try {
      base = await store.saveDraft(input.value, base);
      if (editing === revision) dirty = false;
      status.textContent = dirty
        ? 'Borrador guardado. Hay cambios nuevos sin guardar.'
        : 'Guardado en este dispositivo';
      saved();
      await refresh();
    } catch (error) {
      status.textContent = 'No se ha guardado. ' + message(error);
    } finally {
      save.disabled = false;
    }
  });
  const reload = button(
    'Buscar borradores guardados',
    async () => {
      try {
        await refresh();
      } catch (error) {
        status.textContent = message(error);
      }
    },
    true,
  );
  card.append(
    label,
    input,
    save,
    status,
    el('h2', 'Continuar un borrador'),
    choices,
    reload,
  );
  let draftSection: HTMLElement = card;
  if (location.search) {
    const details = el('details');
    details.append(
      el('summary', 'Guardar una intención para otra sesión'),
      card,
    );
    draftSection = details;
  }
  page.append(
    draftSection,
    el(
      'p',
      'Guardar una intención no genera evidencia de aprendizaje.',
      'muted',
    ),
  );
  await refresh();
  return { page, isDirty: () => dirty || guided.isDirty() };
}
