import 'fake-indexeddb/auto';
import { afterEach, expect, it, vi } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import { SessionEngine, type SessionView } from '../src/learning/session';
import { LocalStore } from '../src/persistence/local';
import { project } from '../src/evidence/project';
import { validFact, validLinks } from '../shared/protocol';
const { repository } = loadLanguagePack(italianCourse, true);
const stores: LocalStore[] = [];
afterEach(() => {
  stores.forEach((s) => s.close());
  stores.length = 0;
  vi.useRealTimers();
});
async function setup() {
  const store = await LocalStore.open(crypto.randomUUID());
  stores.push(store);
  return { store, engine: new SessionEngine(store, repository) };
}
async function answer(engine: SessionEngine, view: SessionView, value: string) {
  return engine.submit(await engine.update(view, 'draft', value));
}
function projection(view: SessionView) {
  return project(
    view.facts,
    view.root.payload.conceptId,
    view.root.payload.conceptVersion,
    true,
  );
}
it('A/F/G: every concept can start, complete its first opportunity and preserve curriculum provenance', async () => {
  for (const concept of repository.available()) {
    const { store, engine } = await setup();
    await engine.study(concept.id, italianCourse.theories[concept.id].version);
    expect(
      project(await store.allFacts(), concept.id, concept.version, true)
        .sourceFactIds,
    ).toEqual([]);
    let view = await engine.start(concept.id);
    const item = view.root.payload.activities[0];
    view = await answer(engine, view, item.criterion.accepted[0]);
    const evidence = view.facts.filter((f) => f.kind === 'evidence');
    expect(evidence, concept.id).toHaveLength(1);
    expect(evidence[0].payload).toMatchObject({
      conceptId: concept.id,
      judgment: 'correct',
      dimension: item.dimension,
      activityId: item.id,
      activityVersion: item.version,
    });
    expect(
      projection(view).observations.find((o) => o.dimension === 'retention')
        ?.correct,
    ).toBe(0);
    const known = new Map(view.facts.map((f) => [f.id, f]));
    expect(
      view.facts.every((f) => validFact(f) && validLinks(f, known)),
      concept.id,
    ).toBe(true);
    await engine.update(view, 'finish');
  }
});
it('B/C: recognition success, repeated retrieval errors and repair remain distinct without erasing success', async () => {
  const { engine } = await setup();
  let view = await engine.start('it-a1-c04-01');
  view = await answer(engine, view, 'sono');
  view = await engine.update(view, 'next');
  view = await answer(engine, view, 'sono');
  const firstError = view.state.attemptId;
  view = await engine.update(view, 'retry');
  view = await answer(engine, view, 'sono');
  view = await engine.update(view, 'retry');
  view = await answer(engine, view, 'sei');
  const p = projection(view);
  expect(
    p.observations.find((o) => o.dimension === 'comprehension'),
  ).toMatchObject({ correct: 1, errors: 0 });
  expect(p.observations.find((o) => o.dimension === 'retrieval')).toMatchObject(
    { correct: 0, errors: 1, assisted: 2 },
  );
  expect(
    view.facts.filter(
      (f) =>
        f.kind === 'evaluation' && f.payload.judgment === 'linguistic-error',
    ),
  ).toHaveLength(2);
  expect(
    view.facts.some(
      (f) => f.kind === 'attempt' && f.payload.retryOf === firstError,
    ),
  ).toBe(true);
  expect(project(view.facts, 'it-a1-c34-07', '1', true).sourceFactIds).toEqual(
    [],
  );
});
it('E: after 1/7/30 days repeat practice preserves evidence but cannot manufacture retention or forgetting', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  const { engine } = await setup();
  vi.setSystemTime(new Date('2026-10-01T10:00:00Z'));
  let view = await answer(engine, await engine.start('it-a1-c04-01'), 'sono');
  const initial = projection(view);
  for (const days of [1, 7, 30]) {
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 1 + days, 10)));
    expect(projection(view)).toEqual(initial);
    const repeated = await answer(
      engine,
      await engine.start('it-a1-c04-01'),
      'sono',
    );
    expect(
      projection(repeated).observations.find(
        (o) => o.dimension === 'comprehension',
      ),
    ).toMatchObject({ correct: 1, errors: 0 });
    expect(
      projection(repeated).observations.find((o) => o.dimension === 'retention')
        ?.supportingFactIds,
    ).toEqual([]);
    const ev = repeated.facts.find(
      (f) =>
        f.kind === 'evidence' &&
        f.payload.attemptId === repeated.state.attemptId,
    );
    expect(ev?.payload).toMatchObject({ independent: false });
  }
});
it('evaluation: empty, unknown, accepted variant, explicit rejection and typo have matching facts', async () => {
  const cases = [
    ['it-a1-c03-01-noi', 'noe', 'typo', 1],
    ['it-a1-c03-01-noi', 'voi', 'linguistic-error', 1],
    ['it-a1-c27-01-grafia', 'un po’', 'correct', 1],
    ['it-a1-c27-01-grafia', '', 'no-opportunity', 0],
    ['it-a1-c27-01-grafia', 'fuori criterio 987', 'not-evaluable', 0],
  ] as const;
  for (const [id, value, judgment, count] of cases) {
    const { engine } = await setup();
    const item = repository.activities.find((a) => a.id === id)!;
    let view = await engine.start(item.conceptId);
    while (view.root.payload.activities[view.state.index].id !== id) {
      view = await engine.update(await engine.submit(view), 'next');
    }
    const before = view.facts.filter((f) => f.kind === 'evidence').length;
    view = await answer(engine, view, value);
    expect(
      view.facts.find(
        (f) =>
          f.kind === 'evaluation' &&
          f.payload.attemptId === view.state.attemptId,
      )?.payload,
    ).toMatchObject({ judgment });
    expect(view.facts.filter((f) => f.kind === 'evidence')).toHaveLength(
      before + count,
    );
  }
});
