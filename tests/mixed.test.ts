import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import { validationCatalog } from '../src/content/validation-fixture';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine, type SessionView } from '../src/learning/session';
import { mixedGroups } from '../src/mixed/manifest';
import {
  eligibleMixedActivities,
  mixedPlans,
  mixedPrerequisites,
  mixedGroupPrerequisites,
} from '../src/mixed/engine';
import { evaluate } from '../src/exercises/evaluate';
import { reviewPlans, reviewIntervalMs } from '../src/review/engine';
import { project } from '../src/evidence/project';
import { validFact, validLinks } from '../shared/protocol';

const catalog = loadLanguagePack(italianCourse, true).repository;
const epoch = new Date('2026-10-01T10:00:00.000Z');
const stores: LocalStore[] = [];
async function setup(name = crypto.randomUUID()) {
  const store = await LocalStore.open(name);
  stores.push(store);
  return { store, engine: new SessionEngine(store, catalog), name };
}
const prepared = new WeakMap<SessionEngine, Set<string>>();
async function introduce(engine: SessionEngine, group = mixedGroups[0]) {
  const ids = mixedGroupPrerequisites(catalog, group);
  const seen = prepared.get(engine) ?? new Set<string>();
  prepared.set(engine, seen);
  for (const id of ids)
    if (!seen.has(id)) {
      await engine.study(id, '1');
      seen.add(id);
    }
}
async function answer(
  engine: SessionEngine,
  view: SessionView,
  response: string,
) {
  return engine.submit(await engine.update(view, 'draft', response));
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

describe('mixed selection against the editorial catalog', () => {
  it('pins explicit activity versions and excludes focus prompts and unapproved additions', () => {
    for (const group of mixedGroups) {
      const activities = eligibleMixedActivities(catalog, group);
      expect(activities).toHaveLength(group.items.length);
      expect(new Set(activities.map((a) => a.conceptId))).toEqual(
        new Set(group.conceptIds),
      );
      for (const a of activities) {
        expect(a.task?.context.trim()).toBeTruthy();
        expect(a.prompt).not.toMatch(
          /completa con|usando (essere|avere)|usa (essere|avere)|forma di (essere|avere)/i,
        );
        expect(a.criterion.accepted.length).toBeGreaterThan(0);
        expect(group.items).toContainEqual({
          id: a.id,
          version: a.version,
          conceptId: a.conceptId,
        });
      }
      expect(
        eligibleMixedActivities(catalog, {
          ...group,
          items: group.items.map((a) => ({ ...a, version: 'obsolete' })),
        }),
      ).toEqual([]);
      expect(
        eligibleMixedActivities(
          loadLanguagePack(italianCourse).repository,
          group,
        ),
      ).toEqual([]);
    }
  });

  it('requires every target and recursive prerequisite to have been introduced', async () => {
    const { store, engine } = await setup();
    expect(mixedPlans(catalog, [], epoch)).toEqual([]);
    await expect(engine.startMixed()).rejects.toThrow('compatible');
    const group = mixedGroups.find((g) => g.id === 'states-needs')!;
    for (const id of group.conceptIds) await engine.study(id, '1');
    expect(
      group.conceptIds.flatMap((id) => mixedPrerequisites(catalog, id)).length,
    ).toBeGreaterThan(0);
    expect(
      mixedPlans(catalog, await store.allFacts(), epoch).some(
        (p) => p.groupId === group.id,
      ),
    ).toBe(false);
    await introduce(engine, group);
    expect(
      mixedPlans(catalog, await store.allFacts(), epoch).some(
        (p) => p.groupId === group.id,
      ),
    ).toBe(true);
  });

  it('requires contextual support and its transitive prerequisites before enabling a group', async () => {
    const { store, engine } = await setup();
    const base = mixedGroups.find((g) => g.id === 'states-needs')!;
    const group = {
      ...base,
      id: 'test-contextual-preparation',
      prerequisiteIds: ['it-a1-c22-02'],
    };
    mixedGroups.push(group);
    try {
      await introduce(engine, base);
      await engine.study('it-a1-c22-02', '1');
      const preparation = mixedGroupPrerequisites(catalog, group);
      expect(preparation).toContain('it-a1-c22-02');
      expect(preparation).toEqual(
        expect.arrayContaining(mixedPrerequisites(catalog, 'it-a1-c22-02')),
      );
      expect(
        mixedPlans(catalog, await store.allFacts(), epoch).some(
          (p) => p.groupId === group.id,
        ),
      ).toBe(false);
      await introduce(engine, group);
      expect(
        mixedPlans(catalog, await store.allFacts(), epoch).some(
          (p) => p.groupId === group.id,
        ),
      ).toBe(true);
      const view = await engine.startMixed(group.id);
      expect(view.root.payload.mixed?.conceptIds).toEqual(base.conceptIds);
      expect(
        view.root.payload.activities.every((a) =>
          base.conceptIds.includes(a.conceptId),
        ),
      ).toBe(true);
    } finally {
      mixedGroups.splice(mixedGroups.indexOf(group), 1);
    }
  });

  it('selects coherent complete groups deterministically without duplicate activities', async () => {
    const { store, engine } = await setup();
    for (const group of mixedGroups) await introduce(engine, group);
    const facts = await store.allFacts();
    const plans = mixedPlans(catalog, facts, epoch);
    expect(plans).toHaveLength(mixedGroups.length);
    expect(
      mixedPlans(catalog, [...facts].reverse().concat(facts), epoch),
    ).toEqual(plans);
    for (const plan of plans) {
      expect(plan.activities.length).toBeLessThanOrEqual(6);
      expect(new Set(plan.activities.map((a) => a.id)).size).toBe(
        plan.activities.length,
      );
      expect(new Set(plan.activities.map((a) => a.conceptId))).toEqual(
        new Set(plan.conceptIds),
      );
      for (const id of plan.conceptIds)
        expect(
          plan.activities.filter((a) => a.conceptId === id).length,
        ).toBeGreaterThanOrEqual(2);
      expect(plan.reasons).toHaveLength(plan.conceptIds.length);
      expect(plan.reasons.every(Boolean)).toBe(true);
    }
  });

  it('prioritizes recurrent difficulties while keeping favorable groups available for maintenance', async () => {
    const { store, engine } = await setup();
    for (const group of mixedGroups) await introduce(engine, group);
    for (const groupId of ['intentions', 'states-needs']) {
      let view = await engine.startMixed(groupId);
      while (view.state.status === 'active') {
        const activity = view.root.payload.activities[view.state.index];
        const response =
          groupId === 'states-needs'
            ? (activity.criterion.rejected[0] ??
              activity.options.find(
                (v) => !activity.criterion.accepted.includes(v),
              ) ??
              activity.criterion.accepted[0])
            : activity.criterion.accepted[0];
        expect(response).toBeDefined();
        view = await answer(engine, view, response);
        view = await engine.update(view, 'next');
      }
    }
    const facts = await store.allFacts();
    const reviews = reviewPlans(catalog, facts, epoch);
    expect(
      reviews.some(
        (p) =>
          p.priority === 0 &&
          ['it-a1-c04-05', 'it-a1-c05-04'].includes(p.conceptId),
      ),
    ).toBe(true);
    const plans = mixedPlans(
      catalog,
      facts,
      new Date(+epoch + reviewIntervalMs),
    );
    expect(plans[0].priority).toBe(0);
    expect(
      plans[0].conceptIds.some((id) =>
        ['it-a1-c04-05', 'it-a1-c05-04'].includes(id),
      ),
    ).toBe(true);
    const maintenance = plans.find((p) => p.groupId === 'intentions')!;
    expect(maintenance).toBeDefined();
    expect(
      maintenance.reasons.every((reason) => reason.includes('differita')),
    ).toBe(true);
    expect(maintenance.priority).toBeGreaterThan(plans[0].priority);
  });

  it('rotates toward unanswered items after a completed mixed session', async () => {
    const { store, engine } = await setup();
    await introduce(engine);
    let view = await engine.startMixed(mixedGroups[0].id);
    const used = view.root.payload.activities.map((a) => a.id);
    while (view.state.status === 'active') {
      view = await answer(
        engine,
        view,
        view.root.payload.activities[view.state.index].criterion.accepted[0],
      );
      view = await engine.update(view, 'next');
    }
    const plan = mixedPlans(catalog, await store.allFacts(), epoch).find(
      (p) => p.groupId === mixedGroups[0].id,
    )!;
    expect(plan.activities.some((a) => !used.includes(a.id))).toBe(true);
    expect(plan.freshActivities).toBeGreaterThan(0);
  });
});

describe('mixed evaluation, evidence and persistence', () => {
  it('uses canonical variants, errors, abstentions and unevaluable responses without inventing correctness', () => {
    const activities = mixedGroups.flatMap((g) =>
      eligibleMixedActivities(catalog, g),
    );
    for (const a of activities) {
      for (const accepted of a.criterion.accepted)
        expect(evaluate(a, accepted).judgment).toBe('correct');
      for (const rejected of a.criterion.rejected)
        expect(evaluate(a, rejected).judgment).toBe('linguistic-error');
      expect(evaluate(a, '').judgment).toBe('no-opportunity');
    }
    const open = activities.find(
      (a) =>
        !a.criterion.exhaustive && !['ordering', 'matching'].includes(a.format),
    )!;
    expect(open).toBeDefined();
    expect(
      evaluate(open, 'Questa è una frase italiana alternativa.').judgment,
    ).toBe('not-evaluable');
    const typo = validationCatalog(true).activities.find((a) =>
      a.criterion.typos?.includes('noe'),
    )!;
    expect(evaluate(typo, 'noe').judgment).toBe('typo');
  });

  it('attributes every observation to its activity target and informs Review beyond the session anchor', async () => {
    const { store, engine } = await setup();
    await introduce(engine);
    vi.setSystemTime(+epoch + 1000);
    let view = await engine.startMixed(mixedGroups[0].id);
    while (view.state.status === 'active') {
      const activity = view.root.payload.activities[view.state.index];
      view = await answer(
        engine,
        view,
        activity.criterion.rejected[0] ?? activity.criterion.accepted[0],
      );
      view = await engine.update(view, 'next');
    }
    const facts = await store.allFacts();
    const evidence = facts.filter((f) => f.kind === 'evidence');
    expect(evidence).toHaveLength(view.root.payload.activities.length);
    for (const f of evidence) {
      if (f.kind !== 'evidence') continue;
      const a = view.root.payload.activities.find(
        (a) => a.id === f.payload.activityId,
      )!;
      expect(f.payload.conceptId).toBe(a.conceptId);
      expect(f.payload.dimension).toBe(a.dimension);
      expect(f.payload.task).toEqual(a.task);
      expect(f.payload.independent).toBe(true);
      expect(f.references).toContain(f.payload.evaluationId);
    }
    const plans = reviewPlans(catalog, facts, new Date());
    for (const id of mixedGroups[0].conceptIds) {
      const plan = plans.find((p) => p.conceptId === id)!;
      expect(plan.lastPracticedAt).toBe(new Date(+epoch + 1000).toISOString());
      const errors = evidence.filter(
        (f) =>
          f.kind === 'evidence' &&
          f.payload.conceptId === id &&
          f.payload.judgment === 'linguistic-error',
      );
      if (errors.length)
        expect(plan.sourceFactIds).toEqual(
          expect.arrayContaining(errors.map((f) => f.id)),
        );
      expect(
        project(
          facts,
          id,
          catalog.concept(id)!.version,
          true,
        ).observations.find((o) => o.dimension === 'retention')
          ?.supportingFactIds,
      ).toEqual([]);
    }
    expect(
      reviewPlans(catalog, facts, new Date(+epoch + reviewIntervalMs + 1000))
        .filter((p) => mixedGroups[0].conceptIds.includes(p.conceptId))
        .every((p) => p.due),
    ).toBe(true);
  });

  it('does not turn empty or unverified answers into evidence', async () => {
    const { store, engine } = await setup();
    await introduce(engine);
    let view = await engine.startMixed();
    view = await answer(engine, view, '');
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'evidence'),
    ).toEqual([]);
    view = await engine.update(view, 'retry');
    view = await answer(engine, view, 'Risposta alternativa non prevista');
    const evaluations = (await store.allFacts()).filter(
      (f) => f.kind === 'evaluation',
    );
    expect(
      evaluations
        .map((f) => f.kind === 'evaluation' && f.payload.judgment)
        .sort(),
    ).toEqual(['no-opportunity', 'not-evaluable']);
    expect(
      (await store.allFacts()).filter((f) => f.kind === 'evidence'),
    ).toEqual([]);
  });

  it('resumes offline draft and feedback, preserves backup links, and queues each submission atomically', async () => {
    const { store, engine, name } = await setup();
    await introduce(engine);
    let view = await engine.startMixed();
    view = await engine.update(
      view,
      'draft',
      view.root.payload.activities[0].criterion.accepted[0],
    );
    store.close();
    const reopened = await setup(name);
    view = await reopened.engine.load(view.head.id);
    expect(view.state.draft).not.toBe('');
    const results = await Promise.allSettled([
      reopened.engine.submit(view),
      reopened.engine.submit(view),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const submitted = results.find((r) => r.status === 'fulfilled');
    if (submitted?.status !== 'fulfilled')
      throw new Error('Missing submission');
    view = await reopened.engine.load(submitted.value.head.id);
    expect(view.state.phase).toBe('feedback');
    const facts = await reopened.store.allFacts();
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(facts.every(validFact)).toBe(true);
    expect(
      validFact({
        ...view.root,
        versions: { ...view.root.versions, policy: 'observations-v2' },
      }),
    ).toBe(false);
    expect(facts.every((f) => validLinks(f, known))).toBe(true);
    const pending = await reopened.store.pending();
    const submission = pending.find((p) =>
      p.facts.some((f) => f.kind === 'attempt'),
    )!;
    expect(submission.facts.map((f) => f.kind).sort()).toEqual([
      'attempt',
      'evaluation',
      'evidence',
      'practice-state',
    ]);
    const target = await setup();
    const backup = JSON.stringify(await reopened.store.exportBackup());
    await target.store.importBackup(backup);
    await target.store.importBackup(backup);
    expect(await target.store.allFacts()).toHaveLength(facts.length);
    expect((await target.engine.load(view.head.id)).state).toEqual(view.state);
    expect(mixedPlans(catalog, await target.store.allFacts(), epoch)).toEqual(
      mixedPlans(catalog, facts, epoch),
    );
    view = await target.engine.update(
      await target.engine.load(view.head.id),
      'finish',
    );
    expect(view.state.status).toBe('completed');
    expect(view.root.payload.mode).toBe('mixed');
    expect(view.root.versions.policy).toBe('mixed-v1');
  });
});

it('does not credit a valid message that avoids the target construction', () => {
  const activity = catalog.activities.find(
    (a) => a.id === 'it-a1-c05-04-sete',
  )!;
  expect(evaluate(activity, "Vorrei un bicchiere d'acqua.").judgment).toBe(
    'not-evaluable',
  );
});
it('links theory exposure to a non-anchor target and keeps known items assisted after a delay', async () => {
  const { store, engine } = await setup();
  const group = mixedGroups.find((g) => g.id === 'states-needs')!;
  await introduce(engine, group);
  let view = await engine.startMixed(group.id);
  while (
    view.root.payload.activities[view.state.index].conceptId ===
    view.root.payload.conceptId
  ) {
    view = await answer(engine, view, '');
    view = await engine.update(view, 'next');
  }
  const activity = view.root.payload.activities[view.state.index];
  vi.setSystemTime(+epoch + 1000);
  await engine.study(activity.conceptId, '1');
  view = await answer(engine, view, activity.criterion.accepted[0]);
  const firstFacts = await store.allFacts();
  const firstEvidence = firstFacts.find((f) => f.kind === 'evidence');
  expect(
    firstEvidence?.kind === 'evidence' && firstEvidence.payload.independent,
  ).toBe(false);
  const known = new Map(firstFacts.map((f) => [f.id, f]));
  expect(firstFacts.every((f) => validFact(f) && validLinks(f, known))).toBe(
    true,
  );
  view = await engine.update(view, 'finish');
  vi.setSystemTime(+epoch + reviewIntervalMs * 7);
  // Focus uses the very same editorial item, so prior mixed feedback remains an exposure.
  let focal = await engine.start(activity.conceptId);
  while (focal.root.payload.activities[focal.state.index].id !== activity.id) {
    focal = await answer(engine, focal, '');
    focal = await engine.update(focal, 'next');
  }
  focal = await answer(engine, focal, activity.criterion.accepted[0]);
  const finalFacts = await store.allFacts();
  const repeated = finalFacts.find(
    (f) => f.kind === 'evidence' && f.payload.sessionId === focal.root.id,
  );
  expect(repeated?.kind === 'evidence' && repeated.payload.independent).toBe(
    false,
  );
  expect(
    project(
      finalFacts,
      activity.conceptId,
      activity.conceptVersion,
      true,
    ).observations.find((o) => o.dimension === 'retention')?.supportingFactIds,
  ).toEqual([]);
});
