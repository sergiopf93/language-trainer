import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { italianCourse, lessons } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import { curriculumCoverage } from '../src/content/coverage';
import { evaluate } from '../src/exercises/evaluate';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
const { repository } = loadLanguagePack(italianCourse, true);
const find = (suffix: string) =>
  repository.activities.find((a) => a.id === 'it-a1-c' + suffix)!;
const finalLessons = lessons.filter((l) => Number(l.code.slice(0, 2)) >= 26);

describe('C26–C34: final A1 candidate curriculum', () => {
  it.each([
    ['26-01-noi', 'Ci chiamiamo', 'Si chiamiamo'],
    ['26-02-anna', 'si veste', 'si vestisce'],
    ['27-01-grafia', "un po'", 'un pò'],
    ['27-02-adverbio', 'molto', 'molte'],
    ['27-03-numero', 'Ho due libri', 'Ho dei libri'],
    ['28-01-me', 'me', 'io'],
    ['28-02-mele', 'le', 'li'],
    ['29-01-aggiungi', 'e', 'è'],
    ['29-02-contrasto', 'ma', 'perché'],
    ['29-03-grafia', 'Non vengo perché lavoro', 'Non vengo perche lavoro'],
    ['29-04-unisci', 'Studio, poi esco', 'Esco, poi studio'],
    ['30-01-sequenza', 'Prendi il pane', 'Aggiungi il formaggio'],
    ['30-02-negativo', 'Non parlare', 'Non parla'],
    ['31-01-capito', 'capito', 'capiscito'],
    ['31-02-preso', 'preso', 'prenduto'],
    ['32-01-noi', 'Abbiamo lavorato ieri', 'Hanno lavorato ieri'],
    ['32-02-camminare', 'ha', 'è'],
    ['32-03-passato', 'Ieri ho lavorato', 'Ieri lavoro'],
    ['33-01-donne', 'uscite', 'usciti'],
    ['34-01-paese', 'Spagna', 'spagnolo'],
    ['34-02-singola', 'Vorrei una camera singola', 'Vorrei una camera doppia'],
    ['34-03-latte', 'latte', 'lattina'],
    ['34-04-taglia', 'Avete la taglia M?', 'Avete il taglio M?'],
    ['34-05-musica', 'ascoltare musica', 'vedere musica'],
    ['34-06-partenza', 'partenza', 'arrivo'],
    ['34-07-testa', 'Ho mal di testa', 'Sono mal di testa'],
  ])(
    '%s distinguishes its target from the documented interference',
    (id, right, wrong) => {
      const activity = find(id);
      expect(evaluate(activity, right).judgment).toBe('correct');
      expect(evaluate(activity, wrong).judgment).toBe('linguistic-error');
      expect(evaluate(activity, '').judgment).toBe('no-opportunity');
      expect(evaluate(activity, 'fuera del criterio 987').judgment).toBe(
        'not-evaluable',
      );
    },
  );
  it('keeps meaningful spelling while accepting explicit apostrophe variants', () => {
    for (const answer of ["un po'", 'un po’'])
      expect(evaluate(find('27-01-grafia'), answer).judgment).toBe('correct');
    for (const answer of ['un po', 'un pò'])
      expect(evaluate(find('27-01-grafia'), answer).judgment).not.toBe(
        'correct',
      );
    for (const answer of ["dell'", 'dell’'])
      expect(evaluate(find('27-03-acqua'), answer).judgment).toBe('correct');
    expect(evaluate(find('27-03-acqua'), 'dell').judgment).not.toBe('correct');
    expect(evaluate(find('29-03-domanda'), 'perche').judgment).not.toBe(
      'correct',
    );
    for (const answer of ['Vai dritto', "Va' dritto", 'Va’ dritto'])
      expect(evaluate(find('30-02-vai'), answer).judgment).toBe('correct');
    for (const answer of ['visto', 'veduto'])
      expect(evaluate(find('31-02-visto'), answer).judgment).toBe('correct');
    expect(evaluate(find('33-01-avere'), 'lavorata').judgment).toBe(
      'linguistic-error',
    );
    expect(evaluate(find('03-01-noi'), 'noe').judgment).toBe('typo');
  });
  it('has the 26 expected targets with theory, retrieval, graph, provenance and bounded practice', () => {
    const report = curriculumCoverage(italianCourse);
    expect(report.errors).toEqual([]);
    expect(report.totals).toEqual({
      units: 34,
      expectedConcepts: 99,
      existingConcepts: 99,
      productionReady: 0,
    });
    expect(report.units.slice(25).map((u) => u.concepts.length)).toEqual([
      2, 3, 2, 4, 2, 2, 3, 1, 7,
    ]);
    expect(finalLessons).toHaveLength(26);
    expect(Object.keys(italianCourse.theories)).toHaveLength(99);
    expect(italianCourse.canonicalActivities).toHaveLength(865);
    expect(italianCourse.vocabulary).toHaveLength(316);
    expect(italianCourse.relations).toHaveLength(210);
    expect(italianCourse.templates).toHaveLength(2);
    for (const lesson of finalLessons) {
      const id = 'it-a1-c' + lesson.code;
      const items = repository.select(id);
      expect(items.length, id).toBeGreaterThanOrEqual(8);
      expect(
        items.some((a) => a.task?.skill === 'retrieval'),
        id,
      ).toBe(true);
      if (!['30-01', '31-01', '31-02'].includes(lesson.code))
        expect(
          items.some((a) => a.task?.skill === 'controlled-production'),
          id,
        ).toBe(true);
      expect(repository.connections(id).length, id).toBeGreaterThan(0);
      expect(italianCourse.theories[id].examples.length).toBeGreaterThanOrEqual(
        2,
      );
      expect(italianCourse.theories[id].provenance).toContain('C26–C34');
      for (const a of items) {
        expect(a.status).toBe('reviewed');
        expect(a.version).toBe(
          lesson.items.find((i) => a.id === id + '-' + i.key)?.version ?? '1',
        );
        expect(a.criterion.version).toBe(a.version);
        expect(a.trace?.kind).toBe('canonical');
        expect(a.task?.opportunityId).toBe(a.id + ':target');
      }
    }
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
  });
  it('reuses existing vocabulary without orphan additions or duplicated prompts', () => {
    const earlier = new Set(
      italianCourse.vocabulary
        .filter((v) => v.conceptIds.some((id) => Number(id.slice(7, 9)) <= 25))
        .map((v) => v.id),
    );
    const used = new Set(finalLessons.flatMap((l) => l.vocabularyIds));
    expect([...used].filter((id) => earlier.has(id))).toHaveLength(87);
    expect([...used].filter((id) => !earlier.has(id))).toHaveLength(82);
    const prompts = finalLessons.flatMap((l) => l.items.map((a) => a.prompt));
    expect(new Set(prompts).size).toBe(prompts.length);
    expect(italianCourse.vocabulary.every((v) => v.conceptIds.length > 0)).toBe(
      true,
    );
    expect(italianCourse.vocabulary.every((v) => v.status === 'reviewed')).toBe(
      true,
    );
    const items = repository.activities.filter(
      (a) => Number(a.conceptId.slice(7, 9)) >= 26,
    );
    expect(
      items.filter((a) => a.task?.skill === 'recognition').length /
        items.length,
    ).toBeLessThan(0.15);
  });
  it.each(['28-02', '33-01', '34-07'])(
    'keeps negative evidence and assisted repair on %s, never its context concepts',
    async (code) => {
      const store = await LocalStore.open(crypto.randomUUID());
      try {
        const engine = new SessionEngine(store, repository);
        let view = await engine.start('it-a1-c' + code);
        const activity = view.root.payload.activities[0];
        const response = '  ' + activity.criterion.rejected[0] + '  ';
        view = await engine.update(view, 'draft', response);
        view = await engine.submit(view);
        view = await engine.update(view, 'retry');
        view = await engine.update(view, 'hint');
        view = await engine.update(
          view,
          'draft',
          activity.criterion.accepted[0],
        );
        view = await engine.submit(view);
        const facts = await store.allFacts();
        const attempts = facts.filter((f) => f.kind === 'attempt');
        const first = attempts.find((f) => f.payload.retryOf === null)!;
        expect(first.payload.response).toBe(response);
        const repair = attempts.find((f) => f.payload.retryOf === first.id)!;
        expect(repair.payload.hintShown).toBe(true);
        const evidence = facts.filter((f) => f.kind === 'evidence');
        expect(evidence).toHaveLength(2);
        expect(new Set(evidence.map((f) => f.payload.conceptId))).toEqual(
          new Set(['it-a1-c' + code]),
        );
        expect(new Set(evidence.map((f) => f.payload.judgment))).toEqual(
          new Set(['linguistic-error', 'correct']),
        );
        expect(
          evidence.find((f) => f.payload.attemptId === repair.id)?.payload
            .independent,
        ).toBe(false);
        for (const fact of evidence) {
          expect(fact.payload.provenance).toBe(activity.provenance);
          expect(fact.payload.trace).toEqual(activity.trace);
          expect(fact.payload.task?.skill).toBe(activity.task?.skill);
          expect(fact.payload.activityVersion).toBe(activity.version);
        }
        expect((await engine.load(view.head.id)).state.phase).toBe('feedback');
      } finally {
        store.close();
      }
    },
  );
});
