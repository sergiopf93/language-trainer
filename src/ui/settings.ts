import { api, SyncClient } from '../sync/client';
import { LocalStore } from '../persistence/local';
import { button, el, message } from './dom';
function download(value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const link = el('a');
  link.href = url;
  link.download =
    'language-trainer-' + new Date().toISOString().slice(0, 10) + '.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function settings(store: LocalStore, sync: SyncClient) {
  const dialog = el('dialog');
  dialog.setAttribute('aria-labelledby', 'settings-title');
  const title = el('h2', 'Tu dispositivo');
  title.id = 'settings-title';
  const status = el('p');
  status.setAttribute('role', 'status');
  const form = el('form');
  const label = el('label', 'Código privado de acceso');
  label.htmlFor = 'access-code';
  const input = el('input');
  input.type = 'password';
  input.id = 'access-code';
  input.autocomplete = 'off';
  input.required = true;
  input.maxLength = 256;
  const submit = el('button', 'Vincular dispositivo');
  submit.type = 'submit';
  form.append(label, input, submit);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    const code = input.value;
    input.value = '';
    try {
      await sync.access(code);
      status.textContent = sync.detail;
    } catch (error) {
      status.textContent = message(error);
    } finally {
      submit.disabled = false;
    }
  });
  const act = (fn: () => Promise<void>) => async () => {
    try {
      await fn();
    } catch (error) {
      status.textContent = message(error);
    }
  };
  const retry = button(
    'Sincronizar ahora',
    act(async () => {
      await store.retryBlocked();
      await sync.run();
      status.textContent = sync.detail;
    }),
  );
  const devices = el('div');
  const list = button(
    'Ver dispositivos vinculados',
    act(async () => {
      const result = await api<{
        devices: { deviceId: string; expiresAt: number }[];
      }>('devices');
      const current = await store.identity();
      devices.replaceChildren();
      for (const device of result.devices) {
        const row = el(
          'p',
          device.deviceId === current.deviceId
            ? 'Este dispositivo'
            : 'Dispositivo ' + device.deviceId.slice(0, 8),
        );
        row.append(
          button(
            'Revocar acceso',
            act(async () => {
              await api('revoke', { deviceId: device.deviceId });
              row.remove();
              status.textContent =
                'Acceso revocado. El contenido local se conserva.';
              if (device.deviceId === current.deviceId) await sync.run();
            }),
            true,
          ),
        );
        devices.append(row);
      }
    }),
    true,
  );
  const logout = button(
    'Cerrar acceso en este dispositivo',
    act(async () => {
      await sync.logout();
      status.textContent = sync.detail;
    }),
    true,
  );
  const exportButton = button(
    'Descargar respaldo',
    act(async () => {
      download(await store.exportBackup());
      status.textContent = 'Respaldo descargado, sin credenciales.';
    }),
    true,
  );
  const fileLabel = el('label', 'Restaurar un respaldo');
  fileLabel.htmlFor = 'backup';
  const file = el('input');
  file.id = 'backup';
  file.type = 'file';
  file.accept = 'application/json,.json';
  file.addEventListener(
    'change',
    () =>
      void act(async () => {
        const selected = file.files?.[0];
        if (!selected) return;
        if (selected.size > 10_000_000)
          throw new Error('El respaldo supera el límite de 10 MB.');
        const text = await selected.text();
        const preview = await store.inspectBackup(text);
        status.textContent = `Respaldo válido: ${preview.additions} registros nuevos.`;
        if (
          !window.confirm(
            `Se incorporarán ${preview.additions} registros sin reemplazar el historial. Primero se descargará un respaldo del estado actual. ¿Continuar?`,
          )
        )
          return;
        download(await store.exportBackup());
        await store.importBackup(text);
        file.value = '';
        status.textContent =
          'Respaldo incorporado. Se conserva el historial anterior.';
        void sync.run();
      })(),
  );
  const close = button('Cerrar', () => dialog.close(), true);
  dialog.append(
    title,
    el(
      'p',
      'Vincula tus dispositivos con el mismo código privado para recuperar el historial sincronizado.',
    ),
    form,
    retry,
    status,
    list,
    devices,
    logout,
    el('h3', 'Respaldo secundario'),
    el(
      'p',
      'La sincronización es la forma habitual de continuar en otro dispositivo. El archivo sirve como copia adicional.',
    ),
    exportButton,
    fileLabel,
    file,
    close,
  );
  return dialog;
}
