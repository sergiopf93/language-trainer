import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import {
  engineFixtures,
  fixtureActivities,
  validationCatalog,
} from '../src/content/validation-fixture';
import { evaluate } from '../src/exercises/evaluate';
import { validActivity } from '../shared/learning';
import { validFact, validOperation } from '../shared/protocol';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { project } from '../src/evidence/project';
const response = (a: (typeof engineFixtures)[number]) =>
  a.format === 'ordering' ? '[1,0]' : a.criterion.accepted[0];
describe('extended engine', () => {
  for (const activity of engineFixtures)
    it(`${activity.id}: correct, error, abstention and empty`, () => {
      expect(validActivity(activity)).toBe(true);
      expect(evaluate(activity, response(activity)).judgment).toBe('correct');
      expect(
        evaluate(
          activity,
          activity.format === 'ordering'
            ? '[0,1]'
            : activity.criterion.rejected[0],
        ).judgment,
      ).toBe('linguistic-error');
      expect(evaluate(activity, '').judgment).toBe('no-opportunity');
      expect(evaluate(activity, 'fuori criterio').judgment).toBe(
        'not-evaluable',
      );
    });
  it('does not award spelling similarity or confuse a different pronoun with a typo', () => {
    const a = fixtureActivities[2];
    expect(evaluate(a, 'noi').judgment).toBe('correct');
    expect(evaluate(a, 'noe').judgment).toBe('typo');
    expect(evaluate(a, 'voi').judgment).toBe('linguistic-error');
    expect(evaluate(a, 'nio').judgment).toBe('not-evaluable');
    expect(
      evaluate({ ...a, criterion: { ...a.criterion, typos: ['voi'] } }, 'voi')
        .judgment,
    ).toBe('linguistic-error');
  });
  it('rejects incomplete, repeated and out of range structured responses', () => {
    for (const a of engineFixtures.filter((a) =>
      ['ordering', 'matching'].includes(a.format),
    )) {
      for (const text of ['[0]', '[0,0]', '[99,1]', '{}', '[0,1,2,3]'])
        expect(evaluate(a, text).judgment).toBe('not-evaluable');
    }
    expect(validActivity({ ...engineFixtures[5], task: undefined })).toBe(
      false,
    );
    expect(validActivity({ ...engineFixtures[0], family: 'F1' })).toBe(false);
  });
  it('preserves typo original, expected form, retry, hints and separate evidence across backup', async () => {
    const store = await LocalStore.open(crypto.randomUUID());
    const target = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, validationCatalog(true));
      let v = await engine.start('it-a1-c03-01');
      for (let i = 0; i < 2; i++) {
        v = await engine.submit(v);
        v = await engine.update(v, 'next');
      }
      v = await engine.update(v, 'draft', '  noe  ');
      v = await engine.submit(v);
      const first = v.state.attemptId;
      v = await engine.update(v, 'retry');
      v = await engine.update(v, 'hint');
      v = await engine.update(v, 'draft', 'noi');
      v = await engine.submit(v);
      const facts = await store.allFacts();
      expect(facts.find((f) => f.id === first)?.payload).toMatchObject({
        response: '  noe  ',
      });
      expect(
        facts.find(
          (f) => f.kind === 'evaluation' && f.payload.judgment === 'typo',
        )?.payload,
      ).toMatchObject({ accepted: ['noi'], typoPattern: 'noe→noi' });
      expect(
        facts.find((f) => f.id === v.state.attemptId)?.payload,
      ).toMatchObject({ retryOf: first, hintShown: true });
      const projection = project(facts, 'it-a1-c03-01', '1', true);
      expect(
        projection.observations.find((o) => o.dimension === 'retrieval'),
      ).toMatchObject({ correct: 0, errors: 0, typos: 1, assisted: 1 });
      expect(facts.every(validFact)).toBe(true);
      expect(
        (await store.pending()).every(({ id, facts }) =>
          validOperation({ id, facts }),
        ),
      ).toBe(true);
      await target.importBackup(JSON.stringify(await store.exportBackup()));
      const restored = new SessionEngine(target, validationCatalog(true));
      expect((await restored.load(v.head.id)).state.phase).toBe('feedback');
      expect(
        project(await target.allFacts(), 'it-a1-c03-01', '1', true),
      ).toEqual(projection);
    } finally {
      store.close();
      target.close();
    }
  });
  it('resumes all new formats and reconstructs distinct skills without a mastery score', async () => {
    const name = crypto.randomUUID();
    const store = await LocalStore.open(name);
    try {
      const engine = new SessionEngine(store, validationCatalog(true));
      let v = await engine.start('it-a1-c04-01');
      while (v.state.status === 'active') {
        const a = v.root.payload.activities[v.state.index];
        v = await engine.update(v, 'draft', response(a));
        const reopened = await LocalStore.open(name);
        try {
          v = await new SessionEngine(reopened, validationCatalog(true)).load(
            v.head.id,
          );
          expect(v.state.draft).toBe(response(a));
        } finally {
          reopened.close();
        }
        v = await engine.submit(v);
        v = await engine.update(v, 'next');
      }
      const facts = await store.allFacts();
      expect(facts.every(validFact)).toBe(true);
      const p = project(facts, 'it-a1-c04-01', '1', true);
      expect(p.skills.map((s) => [s.skill, s.correct])).toEqual([
        ['reading-comprehension', 0],
        ['recognition', 2],
        ['retrieval', 2],
        ['transformation', 2],
        ['discrimination', 2],
        ['controlled-production', 3],
        ['communicative-production', 0],
      ]);
      expect(
        project([...facts].reverse().concat(facts), 'it-a1-c04-01', '1', true),
      ).toEqual(p);
    } finally {
      store.close();
    }
  });
  it('accepts historical snapshots without task metadata', () => {
    const { task: _, ...legacy } = fixtureActivities[0];
    expect(validActivity(legacy)).toBe(true);
  });
});
