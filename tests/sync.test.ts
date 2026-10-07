import 'fake-indexeddb/auto';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { LocalStore } from '../src/persistence/local';
import { SyncClient } from '../src/sync/client';
import type { Operation } from '../shared/protocol';
let store: LocalStore;
let client: SyncClient;
let ownerId: string;
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  vi.stubGlobal('navigator', { onLine: true });
  store = await LocalStore.open('sync-' + crypto.randomUUID());
  ownerId = crypto.randomUUID();
  client = new SyncClient(store, () => {});
});
afterEach(() => {
  store.close();
  vi.clearAllTimers();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
function transport(
  push: (op: Operation) => Promise<Response>,
  identityOwner = ownerId,
) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (path: string, init?: RequestInit) => {
      if (path === '/api/identity')
        return Response.json({
          ownerId: identityOwner,
          deviceId: (await store.identity()).deviceId,
        });
      if (path.startsWith('/api/sync/pull'))
        return Response.json({
          ownerId: identityOwner,
          items: [],
          cursor: 0,
          hasMore: false,
        });
      if (path === '/api/sync/push')
        return push(JSON.parse(init?.body as string));
      throw new Error('Unexpected route');
    }),
  );
}
it('retains a lost ACK and retries the exact operation ID', async () => {
  await store.saveDraft('Original');
  const ids: string[] = [];
  transport(async (op) => {
    ids.push(op.id);
    if (ids.length === 1) throw new TypeError('Failed to fetch');
    return Response.json({ ack: op.id });
  });
  await client.run();
  expect(await store.pending()).toHaveLength(1);
  expect(client.state).toBe('error');
  await client.run();
  expect(ids[0]).toBe(ids[1]);
  expect(await store.pending()).toHaveLength(0);
  expect(client.state).toBe('synced');
});
it.each([409, 413, 422])(
  'isolates a rejected operation (%s) and sends independent work',
  async (status) => {
    await store.saveDraft('Bloqueado');
    await store.saveDraft('Independiente');
    transport(async (op) =>
      op.facts[0].payload.intention === 'Bloqueado'
        ? Response.json({ error: 'fact_conflict' }, { status })
        : Response.json({ ack: op.id }),
    );
    await client.run();
    const remaining = await store.pending();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].state).toBe('blocked');
    expect(client.state).toBe('conflict');
  },
);
it('keeps identity and outbox when access expires', async () => {
  const identity = await store.identity();
  await store.bind(ownerId, identity.deviceId);
  await store.saveDraft('Pendiente');
  vi.stubGlobal(
    'fetch',
    vi.fn(async () =>
      Response.json({ error: 'authentication_required' }, { status: 401 }),
    ),
  );
  await client.run();
  expect(client.state).toBe('access');
  expect((await store.identity()).ownerId).toBe(ownerId);
  expect(await store.pending()).toHaveLength(1);
  expect(vi.getTimerCount()).toBe(0);
});
it('does not upload local facts to an unexpected owner', async () => {
  const identity = await store.identity();
  await store.bind(ownerId, identity.deviceId);
  await store.saveDraft('Privado');
  const push = vi.fn(async (op: Operation) => Response.json({ ack: op.id }));
  transport(push, crypto.randomUUID());
  await client.run();
  expect(push).not.toHaveBeenCalled();
  expect(await store.pending()).toHaveLength(1);
  expect(client.state).toBe('error');
});
it('does not contact the service offline', async () => {
  vi.stubGlobal('navigator', { onLine: false });
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  await store.saveDraft('Sin red');
  await client.run();
  expect(fetch).not.toHaveBeenCalled();
  expect(client.state).toBe('offline');
  expect(await store.pending()).toHaveLength(1);
});
