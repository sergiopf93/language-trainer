import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import { readingCorpus, type ReadingText } from '../src/reading/corpus';
import {
  eligibleReading,
  readingActivities,
  readingEligibility,
  readingFingerprint,
  reviewedReadings,
} from '../src/reading/engine';
import { readingReceipts } from '../src/reading/receipts';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine, type SessionView } from '../src/learning/session';
import { mixedPlans, mixedPrerequisites } from '../src/mixed/engine';
import { reviewPlans } from '../src/review/engine';
import { evaluate } from '../src/exercises/evaluate';
import { project } from '../src/evidence/project';
import { validFact, validLinks } from '../shared/protocol';

const catalog = loadLanguagePack(italianCourse, true).repository;
const stores: LocalStore[] = [];
const originalReceipts = [...readingReceipts];
afterEach(() => {
  for (const store of stores) store.close();
  stores.length = 0;
  readingReceipts.splice(0, readingReceipts.length, ...originalReceipts);
});
async function setup(name = crypto.randomUUID()) {
  const store = await LocalStore.open(name);
  stores.push(store);
  return { store, engine: new SessionEngine(store, catalog), name };
}
function fixtureText(): ReadingText {
  const text = readingCorpus.find((t) => !t.dependencies.length)!;
  expect(text).toBeDefined();
  // Test-only authorization fixture: never an editorial approval of the corpus.
  readingReceipts.splice(0, readingReceipts.length, {
    id: text.id,
    version: text.version,
    fingerprint: readingFingerprint(text),
    decision: 'reviewed',
    reviewer: 'automated-test-fixture',
    date: '2026-10-24',
    verdict: 'Test fixture only',
    flags: [],
  });
  return reviewedReadings()[0];
}
async function prepare(engine: SessionEngine, text: ReadingText) {
  for (const id of new Set(
    text.requiredConcepts.flatMap((id) => [
      id,
      ...mixedPrerequisites(catalog, id),
    ]),
  ))
    await engine.study(id, catalog.concept(id)!.version);
}
async function answer(
  engine: SessionEngine,
  view: SessionView,
  response = view.root.payload.activities[view.state.index].criterion
    .accepted[0],
) {
  return engine.submit(await engine.update(view, 'draft', response));
}

describe('Reading editorial gate and selection', () => {
  it('requires a matching receipt and rejects modified or flagged content and production candidates', async () => {
    const text = fixtureText();
    const { store, engine } = await setup();
    expect(eligibleReading(text, catalog, [])).toBe(false);
    await prepare(engine, text);
    const facts = await store.allFacts();
    expect(eligibleReading(text, catalog, facts)).toBe(true);
    expect(
      eligibleReading(
        { ...text, body: text.body + ' Alterato.' },
        catalog,
        facts,
      ),
    ).toBe(false);
    expect(
      eligibleReading(text, loadLanguagePack(italianCourse).repository, facts),
    ).toBe(false);
    readingReceipts[0].flags.push('unresolved');
    expect(reviewedReadings()).toEqual([]);
    readingReceipts.splice(0);
    expect(reviewedReadings()).toEqual([]);
    await expect(engine.startReading(text)).rejects.toThrow();
  });

  it('expands prerequisites transitively, rejects unknown prerequisites and is order independent', async () => {
    const { engine, store } = await setup();
    const text = { ...fixtureText(), requiredConcepts: ['it-a1-c22-02'] };
    await engine.study('it-a1-c22-02', '1');
    expect(
      readingEligibility(text, catalog, await store.allFacts()).missingConcepts
        .length,
    ).toBeGreaterThan(0);
    await prepare(engine, text);
    const facts = await store.allFacts();
    expect(readingEligibility(text, catalog, facts).eligible).toBe(true);
    expect(
      readingEligibility(text, catalog, [...facts].reverse().concat(facts)),
    ).toEqual(readingEligibility(text, catalog, facts));
    expect(
      readingEligibility(
        { ...text, requiredConcepts: ['missing-concept'] },
        catalog,
        facts,
      ).eligible,
    ).toBe(false);
  });

  it('requires full prerequisite readings, not partial completion or another version', async () => {
    const text = fixtureText();
    const { engine, store } = await setup();
    await prepare(engine, text);
    const next = { ...text, id: 'dependent-test', dependencies: [text.id] };
    let view = await engine.startReading(text);
    view = await engine.update(view, 'finish');
    expect(
      readingEligibility(next, catalog, await store.allFacts()).missingReadings,
    ).toContain(text.id);
    view = await engine.startReading(text);
    while (view.state.status === 'active')
      view = await engine.update(await answer(engine, view), 'next');
    const facts = await store.allFacts();
    expect(readingEligibility(next, catalog, facts).eligible).toBe(true);
    expect(
      readingEligibility(next, catalog, facts, [{ ...text, version: 'future' }])
        .eligible,
    ).toBe(false);
  });

  it('creates stable comprehension-only activities and canonical evaluation', () => {
    expect(readingCorpus.length).toBeGreaterThan(0);
    for (const text of readingCorpus) {
      const activities = readingActivities(text, catalog);
      expect(activities).toEqual(readingActivities(text, catalog));
      expect(new Set(activities.map((a) => a.id)).size).toBe(activities.length);
      for (const a of activities) {
        expect(a.conceptId).toBe('reading:' + text.id);
        expect(a.dimension).toBe('reading-comprehension');
        expect(a.task?.skill).toBe('reading-comprehension');
        for (const response of a.criterion.accepted)
          expect(evaluate(a, response).judgment).toBe('correct');
        for (const response of a.criterion.rejected)
          expect(evaluate(a, response).judgment).not.toBe('correct');
        expect(evaluate(a, '').judgment).toBe('no-opportunity');
      }
    }
  });
});

describe('Reading observations and persistence', () => {
  it('distinguishes verifiable errors, unknown responses and abstention without affecting Mixed', async () => {
    const text = fixtureText();
    const { engine, store } = await setup();
    await prepare(engine, text);
    const now = new Date('2026-10-24');
    const before = mixedPlans(catalog, await store.allFacts(), now);
    for (const [response, judgment] of [
      [text.questions[0].rejected[0], 'verifiable-error'],
      ['outside-the-reading-criterion', 'not-evaluable'],
      ['', 'no-opportunity'],
    ]) {
      const view = await answer(
        engine,
        await engine.startReading(text),
        response,
      );
      const facts = await store.allFacts();
      const evaluation = facts.find(
        (f) =>
          f.kind === 'evaluation' &&
          f.payload.attemptId === view.state.attemptId,
      );
      expect(
        evaluation?.kind === 'evaluation' && evaluation.payload.judgment,
      ).toBe(judgment);
      const evidence = facts.filter(
        (f) =>
          f.kind === 'evidence' && f.payload.attemptId === view.state.attemptId,
      );
      expect(evidence).toHaveLength(judgment === 'verifiable-error' ? 1 : 0);
      const known = new Map(facts.map((f) => [f.id, f]));
      expect(facts.every((f) => validFact(f) && validLinks(f, known))).toBe(
        true,
      );
    }
    expect(mixedPlans(catalog, await store.allFacts(), now)).toEqual(before);
  });

  it('carries help across questions and sessions without changing grammar Review or awarding retention', async () => {
    const text = fixtureText();
    const { engine, store } = await setup();
    await prepare(engine, text);
    const before = reviewPlans(
      catalog,
      await store.allFacts(),
      new Date('2026-10-24'),
    );
    let view = await engine.startReading(text);
    view = await engine.update(view, 'reading-help');
    while (view.state.status === 'active') {
      view = await answer(engine, view);
      view = await engine.update(view, 'next');
      expect(view.state.readingHelp).toBe(true);
    }
    view = await answer(engine, await engine.startReading(text));
    const facts = await store.allFacts();
    const evidence = facts.filter((f) => f.kind === 'evidence');
    expect(evidence.length).toBeGreaterThan(1);
    expect(
      evidence.every(
        (f) =>
          f.payload.independent === false &&
          f.payload.dimension === 'reading-comprehension' &&
          f.payload.conceptId === 'reading:' + text.id,
      ),
    ).toBe(true);
    expect(reviewPlans(catalog, facts, new Date('2026-10-24'))).toEqual(before);
    const projection = project(facts, 'reading:' + text.id, text.version, true);
    expect(
      projection.observations.find(
        (o) => o.dimension === 'reading-comprehension',
      )?.assisted,
    ).toBe(evidence.length);
    expect(
      projection.observations
        .filter((o) => o.dimension !== 'reading-comprehension')
        .every((o) => !o.supportingFactIds.length),
    ).toBe(true);
    expect(
      project(facts, 'reading:' + text.id, text.version).observations.every(
        (o) => !o.supportingFactIds.length,
      ),
    ).toBe(true);
  });

  it('does not count a solution seen in feedback as independent on retry or a new session', async () => {
    const text = fixtureText();
    const { engine, store } = await setup();
    await prepare(engine, text);
    let view = await answer(engine, await engine.startReading(text));
    const firstAttempt = view.state.attemptId;
    view = await answer(engine, await engine.update(view, 'retry'));
    const retriedAttempt = view.state.attemptId;
    const repeated = await answer(engine, await engine.startReading(text));
    const evidence = (await store.allFacts()).filter(
      (f) => f.kind === 'evidence',
    );
    expect(evidence).toHaveLength(3);
    for (const [attemptId, independent] of [
      [firstAttempt, true],
      [retriedAttempt, false],
      [repeated.state.attemptId, false],
    ] as const) {
      const attempt = (await store.allFacts()).find(
        (f) => f.kind === 'evaluation' && f.payload.attemptId === attemptId,
      );
      expect(
        evidence.find((f) => f.payload.evaluationId === attempt?.id)?.payload
          .independent,
      ).toBe(independent);
    }
  });

  it('reopens drafts/help and feedback, rejects duplicate/stale submissions, and round-trips linked facts', async () => {
    const text = fixtureText();
    const { engine, store, name } = await setup();
    await prepare(engine, text);
    let view = await engine.startReading(text);
    const stale = view;
    view = await engine.update(view, 'reading-help');
    view = await engine.update(
      view,
      'draft',
      view.root.payload.activities[0].criterion.accepted[0],
    );
    await expect(engine.update(stale, 'draft', 'stale')).rejects.toThrow();
    store.close();
    const reopened = await setup(name);
    view = await reopened.engine.load(view.head.id);
    for (const entry of text.vocabulary)
      expect(view.root.payload.reading?.help).toContain(
        entry.word + ': ' + entry.gloss,
      );
    expect(view.state.readingHelp).toBe(true);
    expect(view.state.draft).not.toBe('');
    const attempts = await Promise.allSettled([
      reopened.engine.submit(view),
      reopened.engine.submit(view),
    ]);
    expect(attempts.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const success = attempts.find((r) => r.status === 'fulfilled');
    if (success?.status !== 'fulfilled') throw new Error('No saved submission');
    view = await reopened.engine.load(success.value.head.id);
    expect(view.state.phase).toBe('feedback');
    const facts = await reopened.store.allFacts();
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(facts.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    expect(facts.filter((f) => f.kind === 'attempt')).toHaveLength(1);
    const target = await setup();
    const backup = JSON.stringify(await reopened.store.exportBackup());
    await target.store.importBackup(backup);
    await target.store.importBackup(backup);
    expect(await target.store.allFacts()).toHaveLength(facts.length);
    expect((await target.engine.load(view.head.id)).state).toEqual(view.state);
    view = await target.engine.update(
      await target.engine.load(view.head.id),
      'finish',
    );
    await expect(target.engine.update(view, 'draft', 'late')).rejects.toThrow();
  });
});
