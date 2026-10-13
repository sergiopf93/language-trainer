import { describe, expect, it } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { pedagogicalCoverage } from '../src/content/pedagogy';
import { loadLanguagePack } from '../src/content/loader';
import { evaluate, normalize } from '../src/exercises/evaluate';
const report = pedagogicalCoverage(italianCourse);
const activity = (id: string) =>
  italianCourse.canonicalActivities.find((a) => a.id === 'it-a1-c' + id)!;
describe('pedagogical audit signals', () => {
  it('counts template opportunities once and preserves candidate-only publication', () => {
    const loaded = loadLanguagePack(italianCourse, true);
    expect(report.totals.activities).toBe(loaded.repository.activities.length);
    expect(report.totals.productionReady).toBe(0);
    expect(report.structuralErrors).toEqual([]);
    expect(report.answerConflicts).toEqual([]);
    expect(report.graph.prerequisiteCycles).toEqual([]);
    expect(report.duplicates).toEqual([]);
    expect(report.stages.reduce((n, s) => n + s.activities, 0)).toBe(
      report.totals.activities,
    );
    expect(report.concepts.reduce((n, c) => n + c.activities, 0)).toBe(
      report.totals.activities,
    );
  });
  it('reports visible answer, duplicate prompt and one-skill signals without scoring sufficiency', () => {
    const pack = structuredClone(italianCourse);
    const target = pack.canonicalActivities.find(
      (a) => a.conceptId === 'it-a1-c03-02',
    )!;
    pack.canonicalActivities = pack.canonicalActivities.filter(
      (a) => a.conceptId !== target.conceptId,
    );
    target.prompt = 'Copia loro';
    target.criterion.accepted = ['loro'];
    target.task!.skill = 'retrieval';
    pack.canonicalActivities.push(target, {
      ...structuredClone(target),
      id: target.id + '-duplicate',
    });
    const r = pedagogicalCoverage(pack);
    expect(r.duplicates.some((g) => g.activityIds.includes(target.id))).toBe(
      true,
    );
    expect(r.visibleRetrievalAnswerIds).toContain(target.id);
    expect(r.concepts.find((c) => c.id === target.conceptId)!.flags).toContain(
      'single-skill',
    );
  });
  it('detects recommended prerequisite cycles, duplicate relations and normalized answer conflicts', () => {
    const pack = structuredClone(italianCourse);
    const r = pack.relations.find((r) => r.type === 'prerequisite')!;
    pack.relations.push({ ...r }, { ...r, from: r.to, to: r.from });
    pack.canonicalActivities[0].criterion.typos = [
      ' ' +
        pack.canonicalActivities[0].criterion.accepted[0].toUpperCase() +
        ' ',
    ];
    const result = pedagogicalCoverage(pack);
    expect(result.graph.prerequisiteCycles.length).toBeGreaterThan(0);
    expect(result.graph.duplicateRelations.length).toBeGreaterThan(0);
    expect(result.answerConflicts.length).toBeGreaterThan(0);
  });
  it('uses token boundaries and reports vocabulary absence as a surface signal only', () => {
    const pack = structuredClone(italianCourse);
    const v = pack.vocabulary[0];
    v.lemma = 'inesistenteaudit';
    v.displayForm = v.lemma;
    v.forms = [];
    v.conceptIds = [];
    pack.canonicalActivities[0].prompt = 'inesistenteauditx';
    const r = pedagogicalCoverage(pack).vocabulary[0];
    expect(r.surfaceActivityIds).toEqual([]);
    expect(r.flags).toContain('orphan-association');
    expect(
      report.vocabulary.find((v) => v.id === 'it-ghiaccio')!.flags.join(' '),
    ).toContain('inflections or split phrases');
  });
});
describe('confirmed pedagogical regressions', () => {
  it('separates copying and semantic identification from retrieval', () => {
    expect(activity('31-01-identifica').task?.skill).toBe('recognition');
    expect(activity('18-01-registro').task?.skill).toBe('discrimination');
    expect(activity('03-02-referente').task?.skill).toBe('retrieval');
    expect(activity('32-02-cammina-frase').prompt).not.toContain('Ho +');
    expect(activity('23-02-madre').prompt).not.toContain('(mia)');
    expect(evaluate(activity('23-02-madre'), 'mia madre').judgment).toBe(
      'correct',
    );
  });
  it('accepts explicit optional subjects without permitting changed person or losing accents', () => {
    expect(
      evaluate(activity('26-02-traduce'), 'Noi ci vestiamo.').judgment,
    ).toBe('correct');
    expect(evaluate(activity('28-02-traduci'), 'Io li leggo.').judgment).toBe(
      'correct',
    );
    expect(
      evaluate(activity('26-02-traduce'), 'Voi vi vestite').judgment,
    ).not.toBe('correct');
    expect(normalize('è')).not.toBe(normalize('e'));
    const pronoun = activity('03-01-noi');
    expect(evaluate(pronoun, 'noe').judgment).toBe('typo');
    expect(evaluate(pronoun, 'voi').judgment).toBe('linguistic-error');
    expect(evaluate(pronoun, 'estraneo').judgment).toBe('not-evaluable');
    expect(evaluate(pronoun, '').judgment).toBe('no-opportunity');
  });
  it('links preparatory concepts by meaning and versions changed live fixtures', () => {
    expect(italianCourse.relations).toContainEqual(
      expect.objectContaining({
        from: 'it-a1-c26-02',
        to: 'it-a1-c15-02',
        type: 'prerequisite',
      }),
    );
    expect(italianCourse.relations).toContainEqual(
      expect.objectContaining({
        from: 'it-a1-c16-03',
        to: 'it-a1-c04-05',
        type: 'contrast',
      }),
    );
    expect(activity('04-01-engine-1').version).toBe('2');
    expect(activity('04-01-engine-1').trace?.sourceVersion).toBe('2');
    expect(evaluate(activity('04-01-engine-1'), 'tu sei').judgment).toBe(
      'correct',
    );
  });
});
