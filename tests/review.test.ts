import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine, type SessionView } from '../src/learning/session';
import { validationCatalog } from '../src/content/validation-fixture';
import { project } from '../src/evidence/project';
import { validFact, validLinks } from '../shared/protocol';
import {
  LocalReviewScheduler,
  reviewIntervalMs,
  reviewPlans,
  selectReviewActivities,
} from '../src/review/engine';

const catalog = validationCatalog(true);
const c03 = 'it-a1-c03-01';
const c04 = 'it-a1-c04-01';
const epoch = new Date('2026-10-01T10:00:00.000Z');
const stores: LocalStore[] = [];
async function setup(name = crypto.randomUUID()) {
  const store = await LocalStore.open(name);
  stores.push(store);
  return { store, engine: new SessionEngine(store, catalog), name };
}
async function answer(
  engine: SessionEngine,
  view: SessionView,
  response: string,
) {
  return engine.submit(await engine.update(view, 'draft', response));
}
async function answerAt(
  engine: SessionEngine,
  conceptId: string,
  index: number,
  response: string,
) {
  let view = await engine.start(conceptId);
  for (let i = 0; i < index; i++) {
    view = await answer(
      engine,
      view,
      view.root.payload.activities[i].criterion.accepted[0],
    );
    view = await engine.update(view, 'next');
  }
  return answer(engine, view, response);
}
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(epoch);
});
afterEach(() => {
  for (const store of stores) store.close();
  stores.length = 0;
  vi.useRealTimers();
});

describe('review recommendations from recorded learning', () => {
  it('excludes unstudied concepts, unopened candidate content and obsolete concept versions', async () => {
    const { store, engine } = await setup();
    expect(reviewPlans(catalog, [], epoch)).toEqual([]);
    await expect(engine.start(c04, 'review')).rejects.toThrow('primero');
    await engine.start(c04);
    expect(reviewPlans(catalog, await store.allFacts(), epoch)).toEqual([]);
    await engine.study(c04, '1');
    const facts = await store.allFacts();
    expect(reviewPlans(catalog, facts, epoch).map((p) => p.conceptId)).toEqual([
      c04,
    ]);
    expect(reviewPlans(validationCatalog(), facts, epoch)).toEqual([]);
    const obsolete = facts.map((f) =>
      f.kind === 'theory-exposure'
        ? { ...f, payload: { ...f.payload, conceptVersion: 'obsolete' } }
        : f,
    );
    expect(reviewPlans(catalog, obsolete, epoch)).toEqual([]);
  });

  it('uses an explicit clock and configurable invitation interval without granting retention', async () => {
    const { store, engine } = await setup();
    await engine.study(c04, '1');
    const facts = await store.allFacts();
    const before = reviewPlans(
      catalog,
      facts,
      new Date(+epoch + reviewIntervalMs - 1),
    )[0];
    const due = reviewPlans(
      catalog,
      facts,
      new Date(+epoch + reviewIntervalMs),
    )[0];
    expect(before.due).toBe(false);
    expect(due.due).toBe(true);
    expect(due.nextCheckAt).toBe('2026-10-02T10:00:00.000Z');
    expect(
      reviewPlans(catalog, facts, new Date(+epoch + 1000), 1000)[0].due,
    ).toBe(true);
    expect(
      project(facts, c04, '1', true).observations.find(
        (o) => o.dimension === 'retention',
      )?.supportingFactIds,
    ).toEqual([]);
    expect(() => reviewPlans(catalog, facts, new Date('invalid'))).toThrow(
      'Reloj',
    );
    expect(() => reviewPlans(catalog, facts, epoch, 0)).toThrow('intervalo');
    const scheduler = new LocalReviewScheduler(store, catalog);
    expect(await scheduler.suggest(epoch, 0)).toEqual([]);
    await expect(scheduler.suggest(epoch, -1)).rejects.toThrow('Presupuesto');
  });

  it('breaks equal priorities by age then concept ID and updates invitations after practice', async () => {
    const { store, engine } = await setup();
    await engine.study(c04, '1');
    await engine.study(c03, '1');
    expect(
      reviewPlans(catalog, await store.allFacts(), epoch).map(
        (p) => p.conceptId,
      ),
    ).toEqual([c03, c04]);
    vi.setSystemTime(+epoch + 1000);
    await engine.study(c03, '1');
    expect(
      reviewPlans(catalog, await store.allFacts(), new Date()).map(
        (p) => p.conceptId,
      ),
    ).toEqual([c04, c03]);
    const view = await engine.start(c04, 'review');
    await answer(engine, view, '');
    const plan = reviewPlans(catalog, await store.allFacts(), new Date()).find(
      (p) => p.conceptId === c04,
    )!;
    expect(plan.lastPracticedAt).toBe(new Date(+epoch + 1000).toISOString());
    expect(plan.nextCheckAt).toBe(
      new Date(+epoch + 1000 + reviewIntervalMs).toISOString(),
    );
    expect(plan.errorDimensions).toEqual([]);
  });

  it('prioritizes recurrent difficulty over independent failed retrieval and missing evidence', async () => {
    const { store, engine } = await setup();
    await engine.study(c03, '1');
    await engine.study(c04, '1');
    await answerAt(engine, c04, 1, 'sono');
    let plans = reviewPlans(catalog, await store.allFacts(), epoch);
    expect(plans.map((p) => p.conceptId)).toEqual([c04, c03]);
    expect(plans[0].priority).toBe(1);
    await answerAt(engine, c03, 0, 'tu');
    await answerAt(engine, c03, 0, 'tu');
    const facts = await store.allFacts();
    plans = reviewPlans(catalog, facts, epoch);
    expect(plans.map((p) => p.conceptId)).toEqual([c03, c04]);
    expect(plans[0].priority).toBe(0);
    expect(
      reviewPlans(catalog, [...facts].reverse().concat(facts), epoch),
    ).toEqual(plans);
    expect(
      plans.every((p) =>
        p.sourceFactIds.every((id) => facts.some((f) => f.id === id)),
      ),
    ).toBe(true);
    expect(
      await new LocalReviewScheduler(store, catalog).suggest(epoch, 1),
    ).toEqual([plans[0]]);
  });

  it('keeps plans stable when errors span multiple dimensions', async () => {
    const { store, engine } = await setup();
    await engine.study(c04, '1');
    await answerAt(engine, c04, 0, 'sei');
    await answerAt(engine, c04, 1, 'sono');
    const facts = await store.allFacts();
    expect(reviewPlans(catalog, [...facts].reverse(), epoch)).toEqual(
      reviewPlans(catalog, facts, epoch),
    );
  });

  it('does not promote typos, abstentions or retries into recurrent linguistic difficulty', async () => {
    const { store, engine } = await setup();
    await engine.study(c03, '1');
    let view = await answerAt(engine, c03, 2, 'noe');
    view = await engine.update(view, 'retry');
    view = await answer(engine, view, 'Una variante no contemplada');
    view = await engine.update(view, 'retry');
    await answer(engine, view, '');
    let plan = reviewPlans(catalog, await store.allFacts(), epoch)[0];
    expect(plan.errorDimensions).toEqual([]);
    expect(plan.priority).toBeGreaterThan(2);
    view = await answerAt(engine, c03, 0, 'tu');
    view = await engine.update(view, 'retry');
    await answer(engine, view, 'tu');
    plan = reviewPlans(catalog, await store.allFacts(), epoch)[0];
    expect(plan.priority).toBe(2);
    expect(plan.reason).not.toContain('più occasioni');
  });

  it('retains past error provenance after a later independent success', async () => {
    const { store, engine } = await setup();
    await engine.study(c03, '1');
    await answerAt(engine, c03, 1, 'io');
    const before = await store.allFacts();
    const errorIds = before
      .filter(
        (f) =>
          f.kind === 'evidence' && f.payload.judgment === 'linguistic-error',
      )
      .map((f) => f.id);
    vi.setSystemTime(+epoch + 1000);
    await answerAt(engine, c03, 2, 'noi');
    const plan = reviewPlans(catalog, await store.allFacts(), new Date())[0];
    expect(plan.reason).toContain('successo successivo');
    expect(plan.priority).toBeGreaterThan(2);
    expect(plan.sourceFactIds).toEqual(expect.arrayContaining(errorIds));
    expect(plan.errorDimensions).toContain('retrieval');
  });
});

describe('review activity selection and persistent sessions', () => {
  it('prefers fresh recall activities, respects its budget and remains deterministic', async () => {
    const { store, engine } = await setup();
    await engine.study(c03, '1');
    await answerAt(engine, c03, 1, 'tu');
    const facts = await store.allFacts();
    const selected = selectReviewActivities(catalog, facts, c03, 3);
    expect(selected[0].id).toBe(c03 + '-noi');
    expect(new Set(selected.map((a) => a.id)).size).toBe(3);
    expect(
      selectReviewActivities(
        catalog,
        [...facts].reverse().concat(facts),
        c03,
        3,
      ),
    ).toEqual(selected);
    expect(selectReviewActivities(catalog, facts, c03, 1)).toEqual(
      selected.slice(0, 1),
    );
    expect(selectReviewActivities(catalog, facts, 'unknown')).toEqual([]);
    expect(() => selectReviewActivities(catalog, facts, c03, 0)).toThrow(
      'Presupuesto',
    );
    expect(() => selectReviewActivities(catalog, facts, c03, 31)).toThrow(
      'Presupuesto',
    );
    expect(
      selectReviewActivities(catalog, [], c03, 1, ['comprehension'])[0]
        .dimension,
    ).toBe('comprehension');
  });

  it('resumes draft and feedback, imports backups by union and validates every relationship', async () => {
    const { store, engine, name } = await setup();
    await engine.study(c04, '1');
    let view = await engine.start(c04, 'review');
    expect(view.root.payload.mode).toBe('review');
    expect(view.root.payload.activities).toHaveLength(4);
    expect(view.root.versions.policy).toBe('review-v1');
    view = await engine.update(
      view,
      'draft',
      view.root.payload.activities[0].criterion.accepted[0],
    );
    store.close();
    const reopened = await setup(name);
    view = await reopened.engine.load(view.head.id);
    expect(view.state.draft).not.toBe('');
    view = await reopened.engine.submit(view);
    expect((await reopened.engine.load(view.head.id)).state.phase).toBe(
      'feedback',
    );
    const facts = await reopened.store.allFacts();
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(facts.every(validFact)).toBe(true);
    expect(facts.every((f) => validLinks(f, known))).toBe(true);
    expect(
      validFact({
        ...view.root,
        payload: { ...view.root.payload, mode: 'mixed' },
      }),
    ).toBe(false);
    const remoteCopy = await setup();
    const owner = crypto.randomUUID();
    await remoteCopy.store.bind(
      owner,
      (await remoteCopy.store.identity()).deviceId,
    );
    await remoteCopy.store.applyPage(
      owner,
      facts.map((fact, index) => ({
        fact,
        cursor: index + 1,
        receivedAt: epoch.toISOString(),
      })),
      facts.length,
    );
    expect((await remoteCopy.engine.load(view.head.id)).state).toEqual(
      view.state,
    );
    const backup = JSON.stringify(await reopened.store.exportBackup());
    const target = await setup();
    await target.store.importBackup(backup);
    await target.store.importBackup(backup);
    expect(await target.store.allFacts()).toHaveLength(facts.length);
    expect((await target.engine.load(view.head.id)).state).toEqual(view.state);
    expect(reviewPlans(catalog, await target.store.allFacts(), epoch)).toEqual(
      reviewPlans(catalog, facts, epoch),
    );
    const pending = await target.store.pending();
    expect(pending.flatMap((p) => p.facts)).toHaveLength(facts.length);
    view = await target.engine.update(
      await target.engine.load(view.head.id),
      'finish',
    );
    expect(view.state.status).toBe('completed');
    expect((await reopened.engine.start(c03)).root.payload.mode).toBe('focus');
  });

  it('preserves previous exposure across days and rejects duplicate submissions atomically', async () => {
    const { store, engine } = await setup();
    await engine.study(c03, '1');
    let first = await engine.start(c03, 'review');
    while (first.state.status === 'active') {
      first = await answer(
        engine,
        first,
        first.root.payload.activities[first.state.index].criterion.accepted[0],
      );
      first = await engine.update(first, 'next');
    }
    vi.setSystemTime(+epoch + reviewIntervalMs);
    let view = await engine.start(c03, 'review');
    view = await engine.update(
      view,
      'draft',
      view.root.payload.activities[0].criterion.accepted[0],
    );
    const results = await Promise.allSettled([
      engine.submit(view),
      engine.submit(view),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const facts = await store.allFacts();
    const evidence = facts.filter(
      (f) => f.kind === 'evidence' && f.payload.sessionId === view.root.id,
    );
    expect(evidence).toHaveLength(1);
    expect(
      evidence[0].kind === 'evidence' && evidence[0].payload.independent,
    ).toBe(false);
    expect(
      project(facts, c03, '1', true).observations.find(
        (o) => o.dimension === 'retention',
      )?.supportingFactIds,
    ).toEqual([]);
  });
});
