import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import { controlledWriting } from '../src/writing/controlled';
import { writingCorpus } from '../src/writing/corpus';
import { writingReceipts } from '../src/writing/receipts';
import {
  writingFingerprint,
  writingOptions,
  writingPreparation,
  type WritingOption,
} from '../src/writing/engine';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine, type SessionView } from '../src/learning/session';
import { mixedPlans, mixedPrerequisites } from '../src/mixed/engine';
import { reviewPlans } from '../src/review/engine';
import { evaluate } from '../src/exercises/evaluate';
import { validFact, validLinks } from '../shared/protocol';

const catalog = loadLanguagePack(italianCourse, true).repository;
const stores: LocalStore[] = [];
const originalReceipts = [...writingReceipts];
afterEach(() => {
  stores.splice(0).forEach((s) => s.close());
  writingReceipts.splice(0, writingReceipts.length, ...originalReceipts);
});
async function setup(name = crypto.randomUUID()) {
  const store = await LocalStore.open(name);
  stores.push(store);
  return { store, engine: new SessionEngine(store, catalog), name };
}
function fixture(open = false) {
  const source = open ? writingCorpus[0] : controlledWriting[0];
  expect(source).toBeDefined();
  // Test-only authorization: this receipt does not constitute editorial review.
  writingReceipts.splice(0, writingReceipts.length, {
    id: source.id,
    version: source.version,
    fingerprint: writingFingerprint(source),
    decision: 'reviewed',
    reviewer: 'automated-test-fixture',
    date: '2026-10-25',
    verdict: 'Test fixture only; no editorial approval',
    flags: [],
  });
  return writingOptions(catalog).find((t) => t.id === source.id)!;
}
async function prepare(engine: SessionEngine, option: WritingOption) {
  for (const id of new Set(
    option.requiredConcepts.flatMap((id) => [
      id,
      ...mixedPrerequisites(catalog, id),
    ]),
  ))
    await engine.study(id, catalog.concept(id)!.version);
}
async function answer(
  engine: SessionEngine,
  view: SessionView,
  response: string,
) {
  return engine.submit(await engine.update(view, 'draft', response));
}
const cases = [
  ['Sono Luca e sono italiano.', 'correct', 'canonical', 1],
  ['Io sono Luca e sono italiano.', 'correct', 'accepted-variant', 1],
  ['Io siamo Luca e siamo italiano.', 'linguistic-error', 'confirmed-error', 1],
  ['Sno Luca e sono italiano.', 'typo', 'typo', 1],
  ['', 'no-opportunity', 'empty', 0],
  ['Sono Luca.', 'not-evaluable', 'incomplete', 0],
  ['Sono Paolo e sono francese.', 'not-evaluable', 'off-task', 0],
  [
    'Mi chiamo Luca e vengo dall’Italia.',
    'not-evaluable',
    'target-not-demonstrated',
    0,
  ],
  ['Sono Luca, un italiano che studia qui.', 'not-evaluable', 'unassessed', 0],
] as const;

describe('Writing criteria and editorial gate', () => {
  it.each(cases)(
    'records %s as %s / %s without unsupported evidence',
    async (response, judgment, outcome, count) => {
      const option = fixture();
      expect(evaluate(option.activity, response).judgment).toBe(judgment);
      const { engine, store } = await setup();
      await prepare(engine, option);
      const view = await answer(
        engine,
        await engine.startWriting(option.id),
        response,
      );
      const facts = await store.allFacts();
      const evaluation = facts.find(
        (f) =>
          f.kind === 'evaluation' &&
          f.payload.attemptId === view.state.attemptId,
      );
      expect(
        evaluation?.kind === 'evaluation' && evaluation.payload,
      ).toMatchObject({ judgment, writingOutcome: outcome });
      expect(facts.filter((f) => f.kind === 'evidence')).toHaveLength(count);
      const known = new Map(facts.map((f) => [f.id, f]));
      expect(facts.every((f) => validFact(f) && validLinks(f, known))).toBe(
        true,
      );
    },
  );

  it('rejects missing, altered and flagged receipts and excludes production', async () => {
    const option = fixture();
    expect(writingOptions(catalog).some((t) => t.id === option.id)).toBe(true);
    writingReceipts[0].fingerprint = writingFingerprint({
      ...controlledWriting[0],
      prompt: 'altered',
    });
    expect(writingOptions(catalog).some((t) => t.id === option.id)).toBe(false);
    fixture();
    writingReceipts[0].flags.push('unresolved');
    expect(writingOptions(catalog).some((t) => t.id === option.id)).toBe(false);
    fixture();
    expect(writingOptions(loadLanguagePack(italianCourse).repository)).toEqual(
      [],
    );
    writingReceipts.splice(0);
    const { engine } = await setup();
    await expect(engine.startWriting(option.id)).rejects.toThrow();
  });

  it('reuses existing IDs and versions and enforces transitive preparation', async () => {
    const option = fixture();
    const { engine, store } = await setup();
    expect(writingPreparation(option, catalog, [])).toContain(
      option.requiredConcepts[0],
    );
    await expect(engine.startWriting(option.id)).rejects.toThrow();
    await prepare(engine, option);
    expect(writingPreparation(option, catalog, await store.allFacts())).toEqual(
      [],
    );
    const reused = writingOptions(catalog).filter((t) => !t.activity.writing);
    expect(reused.length).toBeGreaterThan(0);
    for (const item of reused)
      expect(catalog.select(item.activity.conceptId)).toContainEqual(
        item.activity,
      );
  });

  it('abstains on open text including the exact model and leaves Review/Mixed unchanged', async () => {
    const option = fixture(true);
    const { engine, store } = await setup();
    await prepare(engine, option);
    const now = new Date('2026-10-25T12:00:00Z');
    const factsBefore = await store.allFacts();
    const beforeReview = reviewPlans(catalog, factsBefore, now);
    const beforeMixed = mixedPlans(catalog, factsBefore, now);
    for (const response of [
      option.activity.writing!.model,
      'Un messaggio diverso da tutti gli esempi.',
    ]) {
      expect(evaluate(option.activity, response).judgment).toBe(
        'not-evaluable',
      );
      await answer(engine, await engine.startWriting(option.id), response);
    }
    const facts = await store.allFacts();
    expect(facts.filter((f) => f.kind === 'evidence')).toEqual([]);
    expect(reviewPlans(catalog, facts, now)).toEqual(beforeReview);
    expect(mixedPlans(catalog, facts, now)).toEqual(beforeMixed);
    expect(
      facts
        .filter((f) => f.kind === 'evaluation')
        .every((f) => f.payload.writingOutcome === 'unassessed'),
    ).toBe(true);
  });
});

describe('Writing repairs and persistence', () => {
  it('preserves the original draft for repair and never counts repair or repeated correction as independent', async () => {
    const option = fixture();
    const { engine, store } = await setup();
    await prepare(engine, option);
    const wrong = option.activity.criterion.rejected[0];
    let view = await answer(
      engine,
      await engine.startWriting(option.id),
      wrong,
    );
    const first = view.state.attemptId;
    view = await engine.update(view, 'retry');
    expect(view.state.draft).toBe(wrong);
    view = await answer(engine, view, option.activity.criterion.accepted[0]);
    await answer(
      engine,
      await engine.startWriting(option.id),
      option.activity.criterion.accepted[0],
    );
    const facts = await store.allFacts();
    const repaired = facts.find(
      (f) => f.kind === 'attempt' && f.id === view.state.attemptId,
    );
    expect(repaired?.kind === 'attempt' && repaired.payload.retryOf).toBe(
      first,
    );
    const evidence = facts.filter((f) => f.kind === 'evidence');
    expect(evidence).toHaveLength(3);
    expect(
      evidence.every(
        (f) => f.payload.independent === (f.payload.attemptId === first),
      ),
    ).toBe(true);
    const original = facts.find((f) => f.kind === 'attempt' && f.id === first);
    expect(original?.kind === 'attempt' && original.payload.response).toBe(
      wrong,
    );
  });

  it('records help and focal error priority without granting independent success', async () => {
    const option = fixture();
    const { engine, store } = await setup();
    await prepare(engine, option);
    await answer(
      engine,
      await engine.startWriting(option.id),
      option.activity.criterion.rejected[0],
    );
    const plans = reviewPlans(catalog, await store.allFacts(), new Date());
    expect(plans[0].conceptId).toBe(option.activity.conceptId);
    expect(plans[0].errorDimensions).toContain(option.activity.dimension);
    let view = await engine.startWriting(option.id);
    view = await engine.update(view, 'hint');
    await answer(engine, view, option.activity.criterion.accepted[0]);
    const evidence = (await store.allFacts()).filter(
      (f) => f.kind === 'evidence' && f.payload.judgment === 'correct',
    );
    expect(evidence).toHaveLength(1);
    expect(
      evidence[0].kind === 'evidence' && evidence[0].payload.independent,
    ).toBe(false);
  });

  it('reopens draft and feedback, rejects stale/duplicate submit atomically, and round-trips backup', async () => {
    const option = fixture();
    const { engine, store, name } = await setup();
    await prepare(engine, option);
    let view = await engine.startWriting(option.id);
    const stale = view;
    view = await engine.update(view, 'hint');
    const response = option.activity.criterion.accepted[0];
    view = await engine.update(view, 'draft', response);
    await expect(engine.update(stale, 'draft', 'stale')).rejects.toThrow();
    store.close();
    const reopened = await setup(name);
    view = await reopened.engine.load(view.head.id);
    expect(view.state.draft).toBe(response);
    expect(view.state.hintShown).toBe(true);
    const results = await Promise.allSettled([
      reopened.engine.submit(view),
      reopened.engine.submit(view),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const success = results.find((r) => r.status === 'fulfilled');
    if (success?.status !== 'fulfilled') throw new Error('Missing submission');
    view = success.value;
    await expect(reopened.engine.submit(view)).rejects.toThrow();
    const facts = await reopened.store.allFacts();
    expect(facts.filter((f) => f.kind === 'attempt')).toHaveLength(1);
    expect(facts.filter((f) => f.kind === 'evaluation')).toHaveLength(1);
    expect(facts.filter((f) => f.kind === 'evidence')).toHaveLength(1);
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(facts.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    const target = await setup();
    const backup = JSON.stringify(await reopened.store.exportBackup());
    await target.store.importBackup(backup);
    await target.store.importBackup(backup);
    expect(await target.store.allFacts()).toHaveLength(facts.length);
    expect((await target.engine.load(view.head.id)).state).toEqual(view.state);
    expect(
      (await target.store.allFacts()).find((f) => f.kind === 'attempt')
        ?.payload,
    ).toMatchObject({ response });
  });
});

describe('Writing import boundaries', () => {
  it('rejects a forged correct evaluation of open text and imports nothing', async () => {
    const option = fixture(true);
    const { engine, store } = await setup();
    await prepare(engine, option);
    await answer(
      engine,
      await engine.startWriting(option.id),
      option.activity.writing!.model,
    );
    const backup = await store.exportBackup();
    const evaluation = backup.facts.find((f) => f.kind === 'evaluation');
    if (evaluation?.kind !== 'evaluation')
      throw new Error('Missing evaluation');
    evaluation.payload.judgment = 'correct';
    evaluation.payload.writingOutcome = 'canonical';
    const known = new Map(backup.facts.map((f) => [f.id, f]));
    expect(validFact(evaluation)).toBe(true);
    expect(validLinks(evaluation, known)).toBe(false);
    const target = await setup();
    await expect(
      target.store.importBackup(JSON.stringify(backup)),
    ).rejects.toThrow();
    expect(await target.store.allFacts()).toEqual([]);
  });

  it('rejects positive evidence for an open activity even when its fields match the forged evaluation', async () => {
    const option = fixture(true);
    const { engine, store } = await setup();
    await prepare(engine, option);
    const view = await answer(
      engine,
      await engine.startWriting(option.id),
      option.activity.writing!.model,
    );
    const backup = await store.exportBackup();
    const evaluation = backup.facts.find((f) => f.kind === 'evaluation');
    if (evaluation?.kind !== 'evaluation')
      throw new Error('Missing evaluation');
    evaluation.payload.judgment = 'correct';
    evaluation.payload.writingOutcome = 'canonical';
    const a = view.root.payload.activities[0];
    const id = crypto.randomUUID();
    const evidence: import('../shared/protocol').Fact = {
      ...evaluation,
      id,
      entityId: id,
      kind: 'evidence',
      sequence: Math.max(...backup.facts.map((f) => f.sequence)) + 1,
      references: [evaluation.payload.attemptId, evaluation.id, view.root.id],
      payload: {
        attemptId: evaluation.payload.attemptId,
        evaluationId: evaluation.id,
        sessionId: view.root.id,
        conceptId: a.conceptId,
        conceptVersion: a.conceptVersion,
        activityId: a.id,
        activityVersion: a.version,
        provenance: a.provenance,
        ...(a.trace ? { trace: a.trace } : {}),
        ...(a.task ? { task: a.task } : {}),
        dimension: a.dimension,
        judgment: 'correct',
        independent: true,
        contentStatus: a.status,
      },
    };
    backup.facts.push(evidence);
    const known = new Map(backup.facts.map((f) => [f.id, f]));
    expect(validFact(evidence)).toBe(true);
    expect(validLinks(evidence, known)).toBe(false);
    const target = await setup();
    await expect(
      target.store.importBackup(JSON.stringify(backup)),
    ).rejects.toThrow();
    expect(await target.store.allFacts()).toEqual([]);
  });

  it('rejects a bounded evaluation whose outcome contradicts its judgment', async () => {
    const option = fixture();
    const { engine, store } = await setup();
    await prepare(engine, option);
    await answer(
      engine,
      await engine.startWriting(option.id),
      option.activity.criterion.accepted[0],
    );
    const backup = await store.exportBackup();
    const evaluation = backup.facts.find((f) => f.kind === 'evaluation');
    if (evaluation?.kind !== 'evaluation')
      throw new Error('Missing evaluation');
    evaluation.payload.writingOutcome = 'off-task';
    const known = new Map(backup.facts.map((f) => [f.id, f]));
    expect(validFact(evaluation)).toBe(true);
    expect(validLinks(evaluation, known)).toBe(false);
    const target = await setup();
    await expect(
      target.store.importBackup(JSON.stringify(backup)),
    ).rejects.toThrow();
    expect(await target.store.allFacts()).toEqual([]);
  });
});

describe('Writing metadata regressions', () => {
  it.each(['id', 'version'] as const)(
    'rejects root writing %s inconsistent with its activity',
    async (field) => {
      const option = fixture();
      const { engine, store } = await setup();
      await prepare(engine, option);
      await engine.startWriting(option.id);
      const backup = await store.exportBackup();
      const root = backup.facts.find((f) => f.kind === 'practice-session');
      if (root?.kind !== 'practice-session' || !root.payload.writing)
        throw new Error('Missing writing root');
      root.payload.writing[field] += '-different';
      expect(validFact(root)).toBe(false);
      const target = await setup();
      await expect(
        target.store.importBackup(JSON.stringify(backup)),
      ).rejects.toThrow();
      expect(await target.store.allFacts()).toEqual([]);
    },
  );

  it('uses canonical whitespace normalization for reused activities', async () => {
    const option = writingOptions(catalog).find(
      (o) =>
        !o.activity.writing && o.activity.criterion.accepted[0].includes(' '),
    );
    if (!option) throw new Error('Missing reused multiword activity');
    const { engine, store } = await setup();
    await prepare(engine, option);
    const response =
      '  ' +
      option.activity.criterion.accepted[0].replaceAll(' ', '   ') +
      '  ';
    await answer(engine, await engine.startWriting(option.id), response);
    const evaluation = (await store.allFacts()).find(
      (f) => f.kind === 'evaluation',
    );
    expect(
      evaluation?.kind === 'evaluation' && evaluation.payload,
    ).toMatchObject({ judgment: 'correct', writingOutcome: 'canonical' });
  });
});
