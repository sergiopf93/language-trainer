import { button, el, heading, message } from '../dom';
import type { LocalStore } from '../../persistence/local';
import type { Fact } from '../../../shared/protocol';
export async function practice(store: LocalStore, saved: () => void) {
  const page = heading(
    'Practicar',
    'Prepara tu intención para una próxima sesión.',
  );
  const card = el('section', undefined, 'card');
  const label = el('label', '¿Qué te gustaría practicar?');
  label.htmlFor = 'intention';
  const input = el('textarea');
  input.id = 'intention';
  input.maxLength = 4000;
  input.rows = 5;
  input.placeholder = 'Por ejemplo: presentarme y conocer a otras personas';
  let base: Fact | undefined;
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
  page.append(
    card,
    el(
      'p',
      'La práctica guiada todavía no está disponible. Este borrador no genera evidencia de aprendizaje.',
      'muted',
    ),
  );
  await refresh();
  return { page, isDirty: () => dirty };
}
