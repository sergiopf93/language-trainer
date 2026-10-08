import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import {
  validationCatalog,
  fixtureActivities,
} from '../src/content/validation-fixture';
import { ContentRepository } from '../src/content/catalog';
import { evaluate, normalize } from '../src/exercises/evaluate';
import { project } from '../src/evidence/project';
import { validFact, validOperation } from '../shared/protocol';
const stores: LocalStore[] = [];
async function setup(name = crypto.randomUUID()) {
  const store = await LocalStore.open(name);
  stores.push(store);
  return {
    store,
    engine: new SessionEngine(store, validationCatalog(true)),
    name,
  };
}
afterEach(() => {
  for (const s of stores) s.close();
  stores.length = 0;
});
const conceptId = 'it-a1-c04-01';
describe('catalog and canonical evaluation', () => {
  it('gates candidates, keeps stable curriculum IDs and checks prerequisite cycles', () => {
    expect(validationCatalog().available()).toEqual([]);
    const c = validationCatalog(true);
    expect(c.concept(conceptId)?.status).toBe('candidate');
    expect(c.select(conceptId)).toHaveLength(11);
    expect(c.select('not-present')).toEqual([]);
    expect(
      () =>
        new ContentRepository(
          c.packId,
          c.version,
          c.topics,
          c.concepts,
          [
            ...c.relations,
            {
              from: 'it-a1-c03-01',
              to: conceptId,
              type: 'prerequisite',
              reason: 'test',
            },
          ],
          c.activities,
        ),
    ).toThrow('Ciclo');
    expect(
      () =>
        new ContentRepository(
          c.packId,
          c.version,
          c.topics,
          c.concepts,
          [
            {
              from: conceptId,
              to: 'missing',
              type: 'supports',
              reason: 'test',
            },
          ],
          c.activities,
        ),
    ).toThrow('huérfana');
  });
  it('evaluates all fixture families, preserves accents and abstains outside known criterion scope', () => {
    for (const a of fixtureActivities) {
      expect(evaluate(a, a.criterion.accepted[0]).judgment).toBe('correct');
      expect(evaluate(a, a.criterion.rejected[0]).judgment).toBe(
        'linguistic-error',
      );
      expect(evaluate(a, '').judgment).toBe('no-opportunity');
      expect(evaluate(a, 'Una variante no contemplada').judgment).toBe(
        'not-evaluable',
      );
    }
    expect(evaluate(fixtureActivities[5], '  NOI   SIAMO  ').judgment).toBe(
      'correct',
    );
    expect(normalize('e')).not.toBe(normalize('è'));
    expect(normalize("c'e")).not.toBe(normalize('ce'));
  });
});
describe('learning loop with IndexedDB adapter transactions', () => {
  it('restores drafts and feedback, completes all formats and rebuilds explainable evidence', async () => {
    const { store, engine, name } = await setup();
    let view = await engine.start(conceptId);
    view = await engine.update(view, 'draft', 'sono');
    const reopened = await setup(name);
    view = await reopened.engine.load(view.head.id);
    expect(view.state.draft).toBe('sono');
    view = await reopened.engine.submit(view);
    expect(view.state.phase).toBe('feedback');
    view = await reopened.engine.load(view.head.id);
    view = await reopened.engine.update(view, 'next');
    view = await reopened.engine.update(view, 'draft', 'sei');
    view = await reopened.engine.submit(view);
    view = await reopened.engine.update(view, 'next');
    view = await reopened.engine.update(view, 'draft', 'noi siamo');
    view = await reopened.engine.submit(view);
    view = await reopened.engine.update(view, 'next');
    view = await reopened.engine.update(view, 'finish');
    expect(view.state.status).toBe('completed');
    const facts = await store.allFacts();
    expect(facts.filter((f) => f.kind === 'attempt')).toHaveLength(3);
    expect(facts.filter((f) => f.kind === 'evaluation')).toHaveLength(3);
    expect(facts.filter((f) => f.kind === 'evidence')).toHaveLength(3);
    expect(facts.every(validFact)).toBe(true);
    expect(
      (await store.pending()).every(({ id, facts }) =>
        validOperation({ id, facts }),
      ),
    ).toBe(true);
    const p = project(facts, conceptId, '1', true);
    expect(
      p.observations.find((o) => o.dimension === 'retrieval')?.correct,
    ).toBe(2);
    expect(
      p.observations.find((o) => o.dimension === 'retention')
        ?.supportingFactIds,
    ).toEqual([]);
    expect(
      project([...facts].reverse().concat(facts), conceptId, '1', true),
    ).toEqual(p);
    expect(project(facts, conceptId, '2', true).sourceFactIds).toEqual([]);
    expect(project(facts, conceptId, '1').sourceFactIds).toEqual([]);
    const backup = JSON.stringify(await store.exportBackup());
    const target = await setup();
    await target.store.importBackup(backup);
    await target.store.importBackup(backup);
    expect(await target.store.allFacts()).toHaveLength(facts.length);
    expect((await target.engine.load(view.head.id)).state.status).toBe(
      'completed',
    );
    expect(
      project(await target.store.allFacts(), conceptId, '1', true),
    ).toEqual(p);
  });
  it('retains original response, hints and linked retries without granting independent retrieval', async () => {
    const { store, engine } = await setup();
    let v = await engine.start(conceptId);
    v = await engine.update(v, 'draft', 'sei');
    v = await engine.submit(v);
    const original = v.state.attemptId;
    v = await engine.update(v, 'retry');
    v = await engine.update(v, 'draft', 'sono');
    v = await engine.submit(v);
    v = await engine.update(v, 'next');
    v = await engine.update(v, 'hint');
    v = await engine.update(v, 'draft', 'sei');
    v = await engine.submit(v);
    const facts = await store.allFacts();
    const attempts = facts.filter((f) => f.kind === 'attempt');
    expect(attempts.find((a) => a.id === original)?.payload.response).toBe(
      'sei',
    );
    expect(
      attempts.some(
        (a) => a.payload.retryOf === original && a.payload.solutionSeen,
      ),
    ).toBe(true);
    const p = project(facts, conceptId, '1', true);
    expect(
      p.observations.find((o) => o.dimension === 'comprehension'),
    ).toMatchObject({ errors: 1, correct: 0, assisted: 1 });
    expect(
      p.observations.find((o) => o.dimension === 'retrieval'),
    ).toMatchObject({ correct: 0, assisted: 1 });
  });
  it('does not turn abstention or an empty answer into negative evidence', async () => {
    const { store, engine } = await setup();
    let v = await engine.start(conceptId);
    v = await engine.submit(v);
    v = await engine.update(v, 'next');
    v = await engine.update(v, 'draft', 'forse');
    v = await engine.submit(v);
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'evidence'),
    ).toHaveLength(0);
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'evaluation'),
    ).toHaveLength(2);
    v = await engine.update(v, 'finish');
    expect(v.state.status).toBe('completed');
  });
  it('serializes double submit and rolls back stale writes without duplicate evidence', async () => {
    const { store, engine } = await setup();
    let v = await engine.start(conceptId);
    v = await engine.update(v, 'draft', 'sono');
    const results = await Promise.allSettled([
      engine.submit(v),
      engine.submit(v),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'attempt'),
    ).toHaveLength(1);
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'evidence'),
    ).toHaveLength(1);
    const count = (await store.allFacts()).length;
    const sequence = (await store.identity()).sequence;
    const invalid = {
      id: crypto.randomUUID(),
      kind: 'evidence' as const,
      entityId: crypto.randomUUID(),
      baseRevision: null,
      references: [],
      versions: { content: 'x', policy: 'observations-v1' },
      payload: {},
    };
    await expect(store.appendLearning([invalid as never])).rejects.toThrow();
    expect(await store.allFacts()).toHaveLength(count);
    expect((await store.identity()).sequence).toBe(sequence);
  });
  it('preserves concurrent device branches and local draft compatibility', async () => {
    const a = await setup();
    let v = await a.engine.start(conceptId);
    const b = await setup();
    await b.store.importBackup(JSON.stringify(await a.store.exportBackup()));
    await a.engine.update(v, 'draft', 'sono');
    await b.engine.update(await b.engine.load(v.head.id), 'draft', 'sei');
    await a.store.importBackup(JSON.stringify(await b.store.exportBackup()));
    expect(await a.engine.sessions()).toHaveLength(2);
    await expect(a.engine.submit(v)).rejects.toThrow('cambió');
    await a.store.saveDraft('Borrador compatible');
    expect(await a.store.heads()).toHaveLength(1);
    expect((await a.store.heads())[0].payload.intention).toBe(
      'Borrador compatible',
    );
  });
});

it('a new session preserves prior correction provenance instead of claiming independent recall', async () => {
  const { store, engine } = await setup();
  let first = await engine.start(conceptId);
  first = await engine.update(first, 'draft', 'sono');
  first = await engine.submit(first);
  let second = await engine.start(conceptId);
  second = await engine.update(second, 'draft', 'sono');
  second = await engine.submit(second);
  const attempts = (await store.allFacts()).filter((f) => f.kind === 'attempt');
  expect(attempts.filter((a) => a.payload.exposureId !== null)).toHaveLength(1);
  const p = project(await store.allFacts(), conceptId, '1', true);
  expect(
    p.observations.find((o) => o.dimension === 'comprehension'),
  ).toMatchObject({ correct: 1, assisted: 1 });
});

it('a hint from an unfinished session remains exposure in the next session', async () => {
  const { store, engine } = await setup();
  let first = await engine.start(conceptId);
  first = await engine.update(first, 'hint');
  let second = await engine.start(conceptId);
  second = await engine.update(second, 'draft', 'sono');
  await engine.submit(second);
  const evidence = (await store.allFacts()).find((f) => f.kind === 'evidence');
  expect(evidence?.kind === 'evidence' && evidence.payload.independent).toBe(
    false,
  );
});

it('theory assistance survives reload, next activity and backup with valid facts', async () => {
  const { store, engine, name } = await setup();
  let v = await engine.start(conceptId);
  v = await engine.update(v, 'draft', 'sono');
  v = await engine.update(v, 'theory', 'theory-c04-1');
  const reopened = await setup(name);
  v = await reopened.engine.load(v.head.id);
  expect(v.state.draft).toBe('sono');
  v = await reopened.engine.submit(v);
  v = await reopened.engine.update(v, 'next');
  expect(v.state.theoryVersion).toBe('theory-c04-1');
  v = await reopened.engine.update(v, 'draft', 'sei');
  v = await reopened.engine.submit(v);
  const facts = await store.allFacts();
  const evidence = facts.filter((f) => f.kind === 'evidence');
  expect(evidence).toHaveLength(2);
  expect(evidence.every((f) => !f.payload.independent)).toBe(true);
  expect(facts.every(validFact)).toBe(true);
  const target = await setup();
  await target.store.importBackup(JSON.stringify(await store.exportBackup()));
  expect((await target.engine.load(v.head.id)).state.theoryVersion).toBe(
    'theory-c04-1',
  );
});
it('reading before practice is exposure, reading during an active task is assistance even from another view', async () => {
  const { store, engine } = await setup();
  await engine.study(conceptId, 'theory-c04-1');
  expect(
    (await store.allFacts()).filter((f) => f.kind === 'evidence'),
  ).toHaveLength(0);
  let v = await engine.start(conceptId);
  v = await engine.update(v, 'draft', 'sono');
  v = await engine.submit(v);
  expect(v.facts.find((f) => f.kind === 'evidence')?.payload).toMatchObject({
    independent: true,
  });
  v = await engine.update(v, 'next');
  await engine.study(conceptId, 'theory-c04-1');
  v = await engine.update(v, 'draft', 'sei');
  v = await engine.submit(v);
  const attempts = v.facts.filter((f) => f.kind === 'attempt');
  expect(
    attempts.find((f) => f.payload.response === 'sei')?.payload.exposureId,
  ).not.toBeNull();
  const evidence = v.facts.filter((f) => f.kind === 'evidence');
  expect(evidence.filter((f) => !f.payload.independent)).toHaveLength(1);
  const target = await setup();
  await target.store.importBackup(JSON.stringify(await store.exportBackup()));
  expect(await target.store.allFacts()).toHaveLength(v.facts.length);
});
