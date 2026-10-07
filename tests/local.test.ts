import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { LocalStore } from '../src/persistence/local';
import { canonical } from '../shared/protocol';
const opened: LocalStore[] = [];
async function open() {
  const store = await LocalStore.open('test-' + crypto.randomUUID());
  opened.push(store);
  return store;
}
afterEach(() => {
  for (const store of opened) store.close();
  opened.length = 0;
});
describe('atomic local history', () => {
  it('persists facts with outbox, identity and monotonic sequences', async () => {
    const store = await open();
    const first = await store.saveDraft('Presentarme');
    await store.saveDraft('Pedir un café', first);
    expect(await store.allFacts()).toHaveLength(2);
    expect(await store.pending()).toHaveLength(2);
    expect((await store.identity()).sequence).toBe(2);
    expect(await store.heads()).toHaveLength(1);
  });
  it('serializes two writers without losing local sequence or either draft', async () => {
    const store = await open();
    await Promise.all([store.saveDraft('uno'), store.saveDraft('dos')]);
    expect((await store.allFacts()).map((f) => f.sequence).sort()).toEqual([
      1, 2,
    ]);
    expect(await store.pending()).toHaveLength(2);
  });
  it('keeps concurrent revisions as two heads', async () => {
    const store = await open();
    const root = await store.saveDraft('Inicio');
    await store.saveDraft('Versión A', root);
    await store.saveDraft('Versión B', root);
    expect(
      (await store.heads()).map((f) => f.payload.intention).sort(),
    ).toEqual(['Versión A', 'Versión B']);
    expect(await store.allFacts()).toHaveLength(3);
  });
  it('rolls back page and cursor together on conflicting content', async () => {
    const store = await open();
    const identity = await store.identity();
    const ownerId = crypto.randomUUID();
    await store.bind(ownerId, identity.deviceId);
    const existing = await store.saveDraft('Original');
    const other = await open();
    const remote = await other.saveDraft('Remoto');
    await expect(
      store.applyPage(
        ownerId,
        [
          { cursor: 1, receivedAt: new Date().toISOString(), fact: remote },
          {
            cursor: 2,
            receivedAt: new Date().toISOString(),
            fact: {
              ...existing,
              payload: { intention: 'Conflicto', state: 'draft' },
            },
          },
        ],
        2,
      ),
    ).rejects.toThrow('Conflicto');
    expect(await store.allFacts()).toEqual([existing]);
    expect((await store.identity()).cursor).toBe(0);
  });
  it('does not rebind an existing owner or erase pending changes', async () => {
    const store = await open();
    const id = await store.identity();
    await store.bind(crypto.randomUUID(), id.deviceId);
    await store.saveDraft('Conservar');
    await expect(store.bind(crypto.randomUUID(), id.deviceId)).rejects.toThrow(
      'otro usuario',
    );
    expect(await store.pending()).toHaveLength(1);
  });
  it('imports a backup by union, deduplicates and does not restore credentials', async () => {
    const source = await open();
    const root = await source.saveDraft('Original');
    await source.saveDraft('Revisión', root);
    const backup = JSON.stringify(await source.exportBackup());
    expect(backup).not.toContain('token');
    const target = await open();
    await target.saveDraft('No sobrescribir');
    await target.importBackup(backup);
    await target.importBackup(backup);
    expect(await target.allFacts()).toHaveLength(3);
    expect(await target.pending()).toHaveLength(3);
  });
  it('rejects another owner and modified IDs before importing anything', async () => {
    const store = await open();
    await store.saveDraft('Original');
    const backup = await store.exportBackup();
    await expect(
      store.importBackup(
        JSON.stringify({ ...backup, ownerId: crypto.randomUUID() }),
      ),
    ).rejects.toThrow('otra identidad');
    backup.facts[0].payload.intention = 'Alterado';
    await expect(store.importBackup(JSON.stringify(backup))).rejects.toThrow(
      'contenido distinto',
    );
    expect((await store.allFacts())[0].payload.intention).toBe('Original');
  });
  it('does not discard blocked operations when independent work is added', async () => {
    const store = await open();
    await store.saveDraft('Fallido');
    const [op] = await store.pending();
    await store.block(op.id, 'fact_conflict');
    await store.saveDraft('Independiente');
    expect((await store.pending()).map((op) => op.state)).toEqual([
      'blocked',
      'pending',
    ]);
    await store.retryBlocked();
    expect((await store.pending()).every((op) => op.state === 'pending')).toBe(
      true,
    );
  });
  it('canonicalizes object keys without changing array order', () => {
    expect(canonical({ b: 2, a: 1 })).toBe(canonical({ a: 1, b: 2 }));
    expect(canonical([1, 2])).not.toBe(canonical([2, 1]));
  });
});
