import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import {
  canonical,
  validFact,
  uuid,
  type Fact,
  type DraftFact,
  validLinks,
  type Operation,
  type RemoteFact,
} from '../../shared/protocol';
export class IdentityMismatchError extends Error {}
export interface Identity {
  deviceId: string;
  ownerId: string | null;
  sequence: number;
  cursor: number;
  lastSync: string | null;
}
export interface Pending extends Operation {
  state: 'pending' | 'blocked';
  error?: string;
}
interface LocalSchema extends DBSchema {
  meta: { key: string; value: Identity };
  facts: { key: string; value: Fact; indexes: { entity: string } };
  outbox: { key: string; value: Pending };
}
export class LocalStore {
  private constructor(private db: IDBPDatabase<LocalSchema>) {}
  static async open(name = 'language-trainer-v1') {
    const db = await openDB<LocalSchema>(name, 1, {
      upgrade(db) {
        db.createObjectStore('meta');
        const facts = db.createObjectStore('facts', { keyPath: 'id' });
        facts.createIndex('entity', 'entityId');
        db.createObjectStore('outbox', { keyPath: 'id' });
      },
      blocked() {
        window.dispatchEvent(new Event('storage-blocked'));
      },
    });
    const tx = db.transaction('meta', 'readwrite');
    if (!(await tx.store.get('identity')))
      await tx.store.put(
        {
          deviceId: crypto.randomUUID(),
          ownerId: null,
          sequence: 0,
          cursor: 0,
          lastSync: null,
        },
        'identity',
      );
    await tx.done;
    return new LocalStore(db);
  }
  close() {
    this.db.close();
  }
  async identity() {
    return (await this.db.get('meta', 'identity'))!;
  }
  async bind(ownerId: string, deviceId: string) {
    if (!uuid(ownerId)) throw new Error('Identidad del servicio no válida.');
    const tx = this.db.transaction('meta', 'readwrite');
    const identity = (await tx.store.get('identity'))!;
    if (
      identity.deviceId !== deviceId ||
      (identity.ownerId && identity.ownerId !== ownerId)
    ) {
      tx.abort();
      await tx.done.catch(() => {});
      throw new IdentityMismatchError(
        'El servicio pertenece a otro usuario o dispositivo. Se conserva el historial local.',
      );
    }
    await tx.store.put({ ...identity, ownerId }, 'identity');
    await tx.done;
  }
  async allFacts() {
    return this.db.getAll('facts');
  }
  async pending() {
    const pending = (await this.db.getAll('outbox')).sort(
      (a, b) => a.facts[0].sequence - b.facts[0].sequence,
    );
    const byFact = new Map(
      pending.flatMap((op) => op.facts.map((f) => [f.id, op] as const)),
    );
    const ordered: Pending[] = [];
    const added = new Set<string>();
    const visit = (op: Pending) => {
      if (added.has(op.id)) return;
      added.add(op.id);
      for (const fact of op.facts)
        for (const ref of fact.references) {
          const parent = byFact.get(ref);
          if (parent) visit(parent);
        }
      ordered.push(op);
    };
    for (const op of pending) visit(op);
    return ordered;
  }
  async heads() {
    const facts = await this.allFacts();
    const parents = new Set(facts.map((f) => f.baseRevision).filter(Boolean));
    return facts
      .filter(
        (f): f is DraftFact =>
          (f.kind === 'session' || f.kind === 'session-revision') &&
          !parents.has(f.id),
      )
      .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  }
  async saveDraft(intention: string, base?: DraftFact): Promise<DraftFact> {
    const tx = this.db.transaction(['meta', 'facts', 'outbox'], 'readwrite');
    const identity = (await tx.objectStore('meta').get('identity'))!;
    const id = crypto.randomUUID();
    const fact: DraftFact = {
      id,
      deviceId: identity.deviceId,
      sequence: identity.sequence + 1,
      occurredAt: new Date().toISOString(),
      schemaVersion: 1,
      kind: base ? 'session-revision' : 'session',
      entityId: base?.entityId ?? id,
      baseRevision: base?.id ?? null,
      references: base ? [...new Set([base.entityId, base.id])] : [],
      versions: { content: 'foundation-v1', policy: 'none' },
      payload: { intention, state: 'draft' },
    };
    if (
      !validFact(fact) ||
      (base && !(await tx.objectStore('facts').get(base.id)))
    ) {
      tx.abort();
      await tx.done.catch(() => {});
      throw new Error('No se puede guardar este borrador.');
    }
    await tx.objectStore('facts').add(fact);
    await tx
      .objectStore('outbox')
      .add({ id: crypto.randomUUID(), facts: [fact], state: 'pending' });
    await tx
      .objectStore('meta')
      .put({ ...identity, sequence: fact.sequence }, 'identity');
    await tx.done;
    return fact;
  }
  async appendLearning(
    inputs: Omit<
      Fact,
      'deviceId' | 'sequence' | 'occurredAt' | 'schemaVersion'
    >[],
    expectedHead?: string,
  ): Promise<Fact[]> {
    if (!inputs.length || inputs.length > 10)
      throw new Error('Lote de aprendizaje vacío o demasiado grande.');
    const tx = this.db.transaction(['meta', 'facts', 'outbox'], 'readwrite');
    try {
      const facts = tx.objectStore('facts');
      const identity = (await tx.objectStore('meta').get('identity'))!;
      const history = await facts.getAll();
      const known = new Map(history.map((f) => [f.id, f]));
      if (inputs.every((f) => known.has(f.id))) {
        const existing = inputs.map((f) => known.get(f.id)!);
        if (
          inputs.some(
            (f, i) =>
              canonical({ ...existing[i], ...f }) !== canonical(existing[i]),
          )
        )
          throw new Error('ID repetido con contenido distinto.');
        await tx.done;
        return existing;
      }
      if (
        expectedHead &&
        (!known.has(expectedHead) ||
          history.some((f) => f.baseRevision === expectedHead))
      )
        throw new Error(
          'La sesión cambió en otra pestaña o dispositivo. Recarga para elegir la versión que quieres continuar.',
        );
      const created = inputs.map(
        (input, i) =>
          ({
            ...input,
            deviceId: identity.deviceId,
            sequence: identity.sequence + i + 1,
            occurredAt: new Date().toISOString(),
            schemaVersion: 1,
          }) as Fact,
      );
      for (const fact of created) known.set(fact.id, fact);
      if (
        !created.length ||
        created.length > 10 ||
        created.some((f) => !validFact(f) || !validLinks(f, known))
      )
        throw new Error('Hechos de aprendizaje no válidos.');
      for (const fact of created) await facts.add(fact);
      await tx
        .objectStore('outbox')
        .add({ id: crypto.randomUUID(), facts: created, state: 'pending' });
      await tx
        .objectStore('meta')
        .put(
          { ...identity, sequence: identity.sequence + created.length },
          'identity',
        );
      await tx.done;
      return created;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* Already aborted. */
      }
      await tx.done.catch(() => {});
      throw error;
    }
  }
  async acknowledge(id: string) {
    await this.db.delete('outbox', id);
  }
  async block(id: string, error: string) {
    const tx = this.db.transaction('outbox', 'readwrite');
    const op = await tx.store.get(id);
    if (op) await tx.store.put({ ...op, state: 'blocked', error });
    await tx.done;
  }
  async retryBlocked() {
    const tx = this.db.transaction('outbox', 'readwrite');
    for (const op of await tx.store.getAll())
      await tx.store.put({ ...op, state: 'pending', error: undefined });
    await tx.done;
  }
  async applyPage(ownerId: string, items: RemoteFact[], cursor: number) {
    const tx = this.db.transaction(['meta', 'facts'], 'readwrite');
    try {
      const identity = (await tx.objectStore('meta').get('identity'))!;
      if (
        identity.ownerId !== ownerId ||
        !Number.isSafeInteger(cursor) ||
        cursor < identity.cursor ||
        (items.at(-1)?.cursor ?? identity.cursor) !== cursor
      )
        throw new Error('Página de sincronización inválida.');
      let last = identity.cursor;
      let sequence = identity.sequence;
      for (const item of items) {
        if (
          !validFact(item.fact) ||
          !Number.isSafeInteger(item.cursor) ||
          item.cursor <= last
        )
          throw new Error('Versión de historial no compatible.');
        const previous = await tx.objectStore('facts').get(item.fact.id);
        if (previous && canonical(previous) !== canonical(item.fact))
          throw new Error(
            'Conflicto de historial: ambas copias se conservan en su origen.',
          );
        await tx.objectStore('facts').put(item.fact);
        last = item.cursor;
        if (item.fact.deviceId === identity.deviceId)
          sequence = Math.max(sequence, item.fact.sequence);
      }
      await tx
        .objectStore('meta')
        .put({ ...identity, cursor, sequence }, 'identity');
      await tx.done;
    } catch (error) {
      try {
        tx.abort();
      } catch {
        /* Transaction may already have aborted. */
      }
      await tx.done.catch(() => {});
      throw error;
    }
  }
  async confirmed() {
    const tx = this.db.transaction('meta', 'readwrite');
    const identity = (await tx.store.get('identity'))!;
    await tx.store.put(
      { ...identity, lastSync: new Date().toISOString() },
      'identity',
    );
    await tx.done;
  }
  async exportBackup() {
    return {
      format: 'language-trainer-backup',
      version: 1,
      ownerId: (await this.identity()).ownerId,
      exportedAt: new Date().toISOString(),
      facts: await this.allFacts(),
    };
  }
  async inspectBackup(
    text: string,
  ): Promise<{ ownerId: string | null; facts: Fact[]; additions: number }> {
    if (text.length > 10_000_000)
      throw new Error('El respaldo supera el límite de 10 MB.');
    const backup = JSON.parse(text);
    if (
      backup.format !== 'language-trainer-backup' ||
      backup.version !== 1 ||
      !Array.isArray(backup.facts) ||
      !backup.facts.every(validFact) ||
      new Set(backup.facts.map((f: Fact) => f.id)).size !== backup.facts.length
    )
      throw new Error('Respaldo no compatible.');
    const identity = await this.identity();
    if (backup.ownerId !== identity.ownerId)
      throw new Error(
        'El respaldo pertenece a otra identidad. Vincula primero el dispositivo correcto.',
      );
    const known = new Map((await this.allFacts()).map((f) => [f.id, f]));
    let additions = 0;
    for (const fact of backup.facts as Fact[]) {
      const old = known.get(fact.id);
      if (old && canonical(old) !== canonical(fact))
        throw new Error('El respaldo contiene un ID con contenido distinto.');
      if (!old) additions++;
      known.set(fact.id, fact);
    }
    for (const fact of known.values())
      if (!validLinks(fact, known))
        throw new Error(
          'El respaldo contiene relaciones de aprendizaje inválidas.',
        );
    const causalKeys = new Map<string, string>();
    for (const fact of known.values()) {
      if (fact.references.some((id) => !known.has(id)))
        throw new Error('El respaldo contiene referencias incompletas.');
      const causalKey = fact.deviceId + ':' + fact.sequence;
      if (causalKeys.has(causalKey) && causalKeys.get(causalKey) !== fact.id)
        throw new Error(
          'El respaldo contiene secuencias de dispositivo en conflicto.',
        );
      causalKeys.set(causalKey, fact.id);
      if (
        fact.kind === 'session-revision' &&
        (known.get(fact.entityId)?.kind !== 'session' ||
          known.get(fact.baseRevision!)?.entityId !== fact.entityId)
      )
        throw new Error('El respaldo contiene una revisión no válida.');
    }
    return { ...backup, additions };
  }
  async importBackup(text: string) {
    const backup = await this.inspectBackup(text);
    const tx = this.db.transaction(['meta', 'facts', 'outbox'], 'readwrite');
    try {
      const identity = (await tx.objectStore('meta').get('identity'))!;
      let sequence = identity.sequence;
      if (identity.ownerId !== backup.ownerId)
        throw new Error('La identidad ha cambiado.');
      // Topological order keeps dependent revisions behind their parent operations.
      const ordered: Fact[] = [];
      const remaining = new Map(backup.facts.map((f) => [f.id, f]));
      const visited = new Set<string>();
      const visit = (f: Fact) => {
        if (visited.has(f.id))
          throw new Error('El respaldo contiene referencias cíclicas.');
        if (!remaining.has(f.id)) return;
        visited.add(f.id);
        for (const ref of f.references) {
          const parent = remaining.get(ref);
          if (parent) visit(parent);
        }
        visited.delete(f.id);
        remaining.delete(f.id);
        ordered.push(f);
      };
      for (const fact of backup.facts) visit(fact);
      for (const fact of ordered) {
        const existing = await tx.objectStore('facts').get(fact.id);
        if (existing && canonical(existing) !== canonical(fact))
          throw new Error('Conflicto con datos locales.');
        if (!existing) {
          await tx.objectStore('facts').add(fact);
          await tx
            .objectStore('outbox')
            .add({ id: crypto.randomUUID(), facts: [fact], state: 'pending' });
        }
        if (fact.deviceId === identity.deviceId)
          sequence = Math.max(sequence, fact.sequence);
      }
      await tx.objectStore('meta').put({ ...identity, sequence }, 'identity');
      await tx.done;
    } catch (error) {
      try {
        tx.abort();
      } catch {}
      await tx.done.catch(() => {});
      throw error;
    }
  }
}
