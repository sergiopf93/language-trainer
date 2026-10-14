import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { italianPack as baseline } from '../src/content/validation-fixture';
import { loadLanguagePack } from '../src/content/loader';
import { validatePack } from '../src/content/validate';
import { curriculumCoverage } from '../src/content/coverage';
import { instantiate } from '../src/content/templates';
import { evaluate, normalize } from '../src/exercises/evaluate';
import type { Activity } from '../shared/learning';
import { validFact, validLinks } from '../shared/protocol';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { project } from '../src/evidence/project';
const { repository } = loadLanguagePack(italianCourse, true);
function answerFor(a: Activity, accepted = a.criterion.accepted[0]) {
  if (a.format !== 'ordering') return accepted;
  return JSON.stringify(
    accepted.split(' ').map((word) => a.options.indexOf(word)),
  );
}
describe('sequential Italian A1 lots C01–C34', () => {
  it('loads precisely the granular C01–C34 inventory with all final blocks', () => {
    expect(validatePack(italianCourse)).toEqual([]);
    for (const id of Object.keys(baseline.theories))
      expect(italianCourse.theories[id].id).toBe(baseline.theories[id].id);
    const expected = italianCourse.curriculum.levels[0].units
      .slice(0, 34)
      .flatMap((u) => u.expectedConceptIds);
    expect(italianCourse.concepts.map((c) => c.id)).toEqual(expected);
    expect(curriculumCoverage(baseline).totals.existingConcepts).toBe(2);
    const after = curriculumCoverage(italianCourse);
    expect(after.totals).toEqual({
      units: 34,
      expectedConcepts: 99,
      existingConcepts: 99,
      productionReady: 0,
    });
    expect(after.units.slice(0, 25).map((u) => u.concepts.length)).toEqual([
      3, 3, 2, 5, 4, 3, 2, 2, 3, 2, 2, 1, 3, 2, 3, 8, 3, 2, 2, 6, 2, 4, 2, 2, 2,
    ]);
    expect(
      after.units
        .slice(0, 25)
        .every((u) =>
          u.concepts.every(
            (c) =>
              c.theory &&
              c.rules &&
              c.examples &&
              c.exercises &&
              c.vocabulary &&
              c.fullScope &&
              c.editorialStatus ===
                (/^it-a1-c(0[1-9]|1[0-9]|20)-/.test(c.id)
                  ? 'reviewed'
                  : 'candidate'),
          ),
        ),
    ).toBe(true);
    expect(
      after.units.slice(25).every((u) => u.concepts.every((c) => c.concept)),
    ).toBe(true);
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
  });
  it('keeps answers disjoint, evaluates every accepted variant, and abstains outside open criteria', () => {
    for (const a of repository.activities) {
      const accepted = a.criterion.accepted.map(normalize);
      expect(new Set(accepted).size, a.id).toBe(accepted.length);
      expect(
        a.criterion.rejected.some((r) => accepted.includes(normalize(r))),
        a.id,
      ).toBe(false);
      for (const response of a.criterion.accepted)
        expect(
          evaluate(a, answerFor(a, response)).judgment,
          `${a.id}: ${response}`,
        ).toBe('correct');
      for (const response of a.criterion.rejected)
        expect(evaluate(a, response).judgment, a.id).not.toBe('correct');
      if (!a.criterion.exhaustive)
        expect(
          evaluate(a, 'respuesta ajena al criterio 987').judgment,
          a.id,
        ).toBe('not-evaluable');
    }
    const accent = repository.activities.find(
      (a) => a.id === 'it-a1-c01-02-essere',
    )!;
    expect(evaluate(accent, 'e').judgment).toBe('linguistic-error');
    expect(evaluate(accent, 'è').judgment).toBe('correct');
    const pronoun = repository.activities.find(
      (a) => a.id === 'it-a1-c03-01-noi',
    )!;
    expect(evaluate(pronoun, 'noe').judgment).toBe('typo');
    expect(evaluate(pronoun, 'voi').judgment).toBe('linguistic-error');
  });
  it('covers declared facets, multiple contexts, guided practice and retrieval', () => {
    for (const c of italianCourse.concepts) {
      const items = repository.select(c.id);
      expect(items.length).toBeGreaterThanOrEqual(6);
      expect(items.length).toBeLessThanOrEqual(30);
      const observed = new Set(items.flatMap((a) => a.task?.facets ?? []));
      for (const facet of c.facets!)
        expect(observed.has(facet), `${c.id}: ${facet}`).toBe(true);
      expect(
        new Set(items.map((a) => a.task!.context)).size,
        c.id,
      ).toBeGreaterThan(1);
      // Earlier lots include visible options; final A1 deliberately emphasizes recall.
      if (Number(c.id.slice(7, 9)) <= 25)
        expect(
          items.some((a) => a.task?.scaffolding === 'visible-options'),
          c.id,
        ).toBe(true);
      expect(
        items.some((a) => a.task?.scaffolding === 'none'),
        c.id,
      ).toBe(true);
      expect(
        italianCourse.theories[c.id].examples.length,
        c.id,
      ).toBeGreaterThan(1);
      expect(
        italianCourse.theories[c.id].frequentErrors.length,
        c.id,
      ).toBeGreaterThan(0);
    }
  });
  it('has six-person paradigms and safe versioned template variants', () => {
    for (const id of ['it-essere', 'it-avere'])
      expect(
        italianCourse.vocabulary.find((v) => v.id === id)?.forms,
      ).toHaveLength(6);
    const before = JSON.stringify(italianCourse);
    for (const t of italianCourse.templates)
      for (const v of t.variants) {
        const item = instantiate(italianCourse, t.id, v.key);
        expect(instantiate(italianCourse, t.id, v.key)).toEqual(item);
        expect(evaluate(item, item.criterion.accepted[0]).judgment).toBe(
          'correct',
        );
        expect(item.trace).toMatchObject({
          kind: 'derived',
          templateId: t.id,
          templateVersion: t.version,
          sourceVersion: v.source.version,
        });
      }
    expect(JSON.stringify(italianCourse)).toBe(before);
  });
  it('connects meaningful contrasts without requiring earlier completion', () => {
    expect(repository.prerequisites('it-a1-c05-04').map((r) => r.to)).toEqual([
      'it-a1-c05-01',
    ]);
    expect(
      repository
        .connections('it-a1-c04-03')
        .some((r) => r.type === 'contrast' && r.to === 'it-a1-c04-04'),
    ).toBe(true);
    expect(new Set(repository.relations.map((r) => r.type))).toEqual(
      new Set(['prerequisite', 'related', 'contrast', 'reinforces']),
    );
    expect(
      repository.relations.every(
        (r) => r.type !== 'prerequisite' || r.strength === 'recommended',
      ),
    ).toBe(true);
  });
});
it.each(italianCourse.concepts.map((c) => [c.id, c.version]))(
  'Theory → practice → Evidence for %s, with help, retry and projection',
  async (id, version) => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, repository);
      await engine.study(id, italianCourse.theories[id].version);
      let view = await engine.start(id);
      const first = view.root.payload.activities[0];
      view = await engine.update(view, 'hint');
      view = await engine.update(view, 'draft', answerFor(first));
      view = await engine.submit(view);
      view = await engine.update(view, 'retry');
      view = await engine.update(view, 'draft', answerFor(first));
      view = await engine.submit(view);
      view = await engine.update(view, 'next');
      while (view.state.status === 'active') {
        const a = view.root.payload.activities[view.state.index];
        view = await engine.update(view, 'draft', answerFor(a));
        view = await engine.submit(view);
        view = await engine.update(view, 'next');
      }
      const facts = await store.allFacts();
      expect(facts.every(validFact)).toBe(true);
      const known = new Map(facts.map((f) => [f.id, f]));
      expect(facts.every((f) => validLinks(f, known))).toBe(true);
      const evidence = facts.filter((f) => f.kind === 'evidence');
      expect(evidence).toHaveLength(repository.select(id).length + 1);
      expect(
        evidence.every(
          (f) =>
            f.payload.conceptVersion === version &&
            f.payload.provenance &&
            f.payload.trace?.packVersion === italianCourse.version &&
            f.payload.judgment === 'correct',
        ),
      ).toBe(true);
      expect(evidence.filter((f) => !f.payload.independent)).toHaveLength(2);
      expect(
        facts.some((f) => f.kind === 'attempt' && f.payload.retryOf !== null),
      ).toBe(true);
      const projected = project(facts, id, version, true);
      expect(
        projected.observations.reduce((sum, row) => sum + row.correct, 0),
      ).toBe(repository.select(id).length - 1);
      expect((await engine.load(view.head.id)).state.status).toBe('completed');
    } finally {
      store.close();
    }
  },
);

it('resumes previous-scope sessions without rewriting their facts or crediting expanded scope', async () => {
  const store = await LocalStore.open(crypto.randomUUID());
  try {
    const oldEngine = new SessionEngine(
      store,
      loadLanguagePack(baseline, true).repository,
    );
    let view = await oldEngine.start('it-a1-c04-01');
    const original = structuredClone(view.root);
    const currentEngine = new SessionEngine(store, repository);
    view = await currentEngine.load(view.head.id);
    expect(view.root).toEqual(original);
    view = await currentEngine.update(view, 'draft', 'sono');
    await currentEngine.submit(view);
    const facts = await store.allFacts();
    expect(facts.every(validFact)).toBe(true);
    expect(facts.find((f) => f.id === original.id)).toEqual(original);
    expect(
      project(facts, 'it-a1-c04-01', '1', true).observations.reduce(
        (n, r) => n + r.correct,
        0,
      ),
    ).toBe(1);
    expect(
      project(facts, 'it-a1-c04-01', '2', true).observations.reduce(
        (n, r) => n + r.correct,
        0,
      ),
    ).toBe(0);
  } finally {
    store.close();
  }
});
