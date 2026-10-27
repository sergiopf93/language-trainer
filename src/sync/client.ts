import { localOnly } from '../release';
import { IdentityMismatchError, LocalStore } from '../persistence/local';
import type { RemoteFact } from '../../shared/protocol';
export type SyncState =
  'local' | 'offline' | 'syncing' | 'synced' | 'access' | 'error' | 'conflict';
export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
  ) {
    const messages: Record<string, string> = {
      invalid_access_code: 'El código privado no es correcto.',
      authentication_required: 'Vuelve a identificarte para sincronizar.',
      access_not_configured: 'La sincronización aún no está configurada.',
      too_many_attempts:
        'Has realizado varios intentos. Espera 15 minutos antes de volver a probar.',
      service_unavailable:
        'El servicio no está disponible. Tu trabajo sigue guardado aquí.',
    };
    super(
      messages[code] ??
        'No se ha podido completar la solicitud. Tu trabajo sigue guardado aquí.',
    );
  }
}
export async function api<T>(path: string, data?: unknown): Promise<T> {
  const response = await fetch('/api/' + path, {
    method: data === undefined ? 'GET' : 'POST',
    credentials: 'same-origin',
    headers: data === undefined ? {} : { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(15000),
  });
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok)
    throw new HttpError(response.status, result.error ?? 'request_failed');
  return result;
}
export class SyncClient {
  private running: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private failures = 0;
  private again = false;
  state: SyncState = 'local';
  detail = 'Guardado en este dispositivo';
  constructor(
    private store: LocalStore,
    private changed: () => void,
  ) {}
  private set(state: SyncState, detail: string) {
    this.state = state;
    this.detail = detail;
    this.changed();
  }
  async access(code: string) {
    const id = await this.store.identity();
    const identity = await api<{ ownerId: string; deviceId: string }>(
      'access',
      { code, deviceId: id.deviceId },
    );
    await this.store.bind(identity.ownerId, identity.deviceId);
    await this.run();
  }
  async logout() {
    await api('logout', {});
    clearTimeout(this.timer);
    this.set('access', 'Acceso cerrado. Tu trabajo sigue guardado aquí.');
  }
  run(): Promise<void> {
    if (localOnly) {
      this.set(
        navigator.onLine ? 'local' : 'offline',
        'Guardado en este dispositivo · Sin sincronización remota',
      );
      return Promise.resolve();
    }
    if (this.running) {
      this.again = true;
      return this.running;
    }
    clearTimeout(this.timer);
    this.running = (
      navigator.locks
        ? navigator.locks.request('language-trainer-sync', () => this.perform())
        : this.perform()
    ).finally(() => {
      this.running = null;
      if (this.again) {
        this.again = false;
        void this.run();
      }
    });
    return this.running;
  }
  private async perform() {
    if (!navigator.onLine) {
      this.set('offline', 'Sin conexión · Tu trabajo sigue guardado aquí');
      return;
    }
    this.set('syncing', 'Recuperando y sincronizando historial…');
    try {
      const identity = await api<{ ownerId: string; deviceId: string }>(
        'identity',
      );
      await this.store.bind(identity.ownerId, identity.deviceId);
      // Download first: restores missing ancestors before any local work is uploaded.
      await this.pull(identity.ownerId);
      for (const op of await this.store.pending()) {
        if (op.state === 'blocked') continue;
        try {
          const response = await api<{ ack: string }>('sync/push', {
            id: op.id,
            facts: op.facts,
          });
          if (response.ack !== op.id) throw new Error('Confirmación no válida');
          await this.store.acknowledge(op.id);
        } catch (error) {
          if (
            error instanceof HttpError &&
            [400, 409, 413, 415, 422].includes(error.status)
          ) {
            await this.store.block(op.id, error.code);
            continue;
          }
          throw error;
        }
      }
      await this.pull(identity.ownerId);
      this.failures = 0;
      const remaining = await this.store.pending();
      if (remaining.some((op) => op.state === 'blocked'))
        this.set(
          'conflict',
          'Hay cambios conservados que necesitan revisión. Puedes reintentar desde ajustes.',
        );
      else if (remaining.length) {
        this.again = true;
        this.set(
          'local',
          'Guardado en este dispositivo · Pendiente de sincronizar',
        );
      } else {
        await this.store.confirmed();
        this.set('synced', 'Sincronizado');
      }
    } catch (error) {
      if (!navigator.onLine) {
        this.set('offline', 'Sin conexión · Tu trabajo sigue guardado aquí');
        return;
      }
      if (error instanceof HttpError && error.status === 401) {
        this.set('access', 'Identifica este dispositivo para sincronizar');
        return;
      }
      this.set(
        'error',
        error instanceof HttpError || error instanceof TypeError
          ? 'Tu trabajo sigue guardado aquí. No se ha podido sincronizar.'
          : error instanceof Error
            ? error.message
            : 'No se ha podido sincronizar',
      );
      if (error instanceof IdentityMismatchError) return;
      if (
        error instanceof HttpError &&
        error.status < 500 &&
        error.status !== 429
      )
        return;
      const delay =
        Math.min(60000, 1000 * 2 ** Math.min(this.failures++, 6)) *
        (0.8 + Math.random() * 0.4);
      this.timer = setTimeout(() => void this.run(), delay);
    }
  }
  private async pull(ownerId: string) {
    let more = true;
    while (more) {
      const { cursor } = await this.store.identity();
      const page = await api<{
        ownerId: string;
        items: RemoteFact[];
        cursor: number;
        hasMore: boolean;
      }>('sync/pull?cursor=' + cursor);
      if (
        page.ownerId !== ownerId ||
        !Array.isArray(page.items) ||
        typeof page.hasMore !== 'boolean' ||
        (page.hasMore && page.cursor <= cursor)
      )
        throw new Error('Respuesta de sincronización no válida');
      await this.store.applyPage(ownerId, page.items, page.cursor);
      more = page.hasMore;
    }
  }
}
