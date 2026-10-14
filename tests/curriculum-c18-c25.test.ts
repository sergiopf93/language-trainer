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

describe('C18–C25: linguistic boundaries and cumulative targets', () => {
  it.each([
    ['18-01-infinito', 'bere', 'bevo'],
    ['18-02-puo', 'può', 'puo'],
    ['18-02-scusi', 'Scusi, può ripetere?', 'Scusa, può ripetere?'],
    ['19-01-grafia', "C'è un bagno", "C'e un bagno"],
    ['19-01-plurale', 'Ci sono due letti', "C'è due letti"],
    ['19-02-libro', 'è', 'c’è'],
    ['20-01-cambia', 'Vengo da Madrid', 'Vengo di Madrid'],
    ['20-02-tra', 'fra', 'su'],
    ['20-03-anna', 'da', 'a'],
    ['20-04-me', 'me', 'io'],
    ['20-05-infinito', 'capire', 'capisco'],
    ['20-06-continua', 'da', 'tra'],
    ['21-01-apostrofo', "dell'amico", 'del amico'],
    ['21-01-sugli', 'sugli', 'sui'],
    ['21-02-origine', 'Sono di Roma', 'Sono della Roma'],
    ['22-01-data', 'il due maggio', 'il cinque febbraio'],
    ['22-01-martedi', 'martedì', 'martedi'],
    ['22-02-una-evento', "Vengo all'una", 'Vengo alle una'],
    [
      '22-02-meno',
      'Sono le quattro meno un quarto',
      'Sono le tre meno un quarto',
    ],
    ['22-03-mai', 'Non bevo mai caffè', 'Bevo non mai caffè'],
    ['22-04-alternativa', 'Posso alle tre', 'Posso alle due'],
    ['23-01-genere', 'suo', 'sua'],
    ['23-01-loro', 'loro', 'lore'],
    ['23-02-fratelli', 'i miei fratelli', 'miei fratelli'],
    ['23-02-loro', 'Il loro padre', 'Loro padre'],
    ['24-01-penne', 'queste penne', 'questi penne'],
    ['24-02-solo', 'Vorrei quello', 'Vorrei quel'],
    ['24-02-zaini', 'quegli zaini', 'quei zaini'],
    ['25-01-piace', 'piace', 'piaccio'],
    ['25-02-anna', 'piacciono', 'piace'],
  ])(
    '%s accepts the target and rejects the documented interference',
    (id, right, wrong) => {
      const a = find(id);
      expect(evaluate(a, right).judgment).toBe('correct');
      expect(evaluate(a, wrong).judgment).toBe('linguistic-error');
      expect(evaluate(a, '').judgment).toBe('no-opportunity');
      expect(evaluate(a, 'respuesta fuera de alcance 987').judgment).toBe(
        'not-evaluable',
      );
    },
  );
  it('keeps valid alternatives explicit, without dropping accents or apostrophes', () => {
    for (const response of ['tra', 'fra'])
      expect(evaluate(find('20-02-tra'), response).judgment).toBe('correct');
    for (const response of ['mezza', 'mezzo'])
      expect(evaluate(find('22-02-mezza'), response).judgment).toBe('correct');
    for (const response of ["dell'amico", 'dell’amico'])
      expect(evaluate(find('21-01-apostrofo'), response).judgment).toBe(
        'correct',
      );
    expect(evaluate(find('21-01-apostrofo'), 'dellamico').judgment).not.toBe(
      'correct',
    );
    expect(evaluate(find('18-02-puo'), 'puo').judgment).not.toBe('correct');
    expect(evaluate(find('22-01-martedi'), 'martedi').judgment).not.toBe(
      'correct',
    );
    expect(evaluate(find('03-01-noi'), 'noe').judgment).toBe('typo');
  });
  it('matches the 22 expected concepts, with unpublished content and bounded lexical growth', () => {
    const coverage = curriculumCoverage(italianCourse);
    expect(coverage.errors).toEqual([]);
    expect(coverage.totals).toEqual({
      units: 34,
      expectedConcepts: 99,
      existingConcepts: 99,
      productionReady: 0,
    });
    expect(coverage.units.slice(17, 25).map((u) => u.concepts.length)).toEqual([
      2, 2, 6, 2, 4, 2, 2, 2,
    ]);
    expect(
      coverage.units.slice(25).every((u) => u.concepts.every((c) => c.concept)),
    ).toBe(true);
    expect(
      italianCourse.canonicalActivities.filter(
        (a) => Number(a.conceptId.slice(7, 9)) <= 25,
      ),
    ).toHaveLength(628);
    expect(
      italianCourse.vocabulary.filter((v) =>
        v.conceptIds.some((id) => Number(id.slice(7, 9)) <= 25),
      ),
    ).toHaveLength(234);
    expect(italianCourse.templates).toHaveLength(2);
    const earlier = new Set(
      italianCourse.vocabulary
        .filter((v) => v.conceptIds.some((id) => Number(id.slice(7, 9)) <= 17))
        .map((v) => v.id),
    );
    const used = new Set(
      lessons
        .filter(
          (l) =>
            Number(l.code.slice(0, 2)) >= 18 &&
            Number(l.code.slice(0, 2)) <= 25,
        )
        .flatMap((l) => l.vocabularyIds),
    );
    expect([...used].filter((id) => earlier.has(id))).toHaveLength(65);
    expect([...used].filter((id) => !earlier.has(id))).toHaveLength(62);
    for (const c of italianCourse.concepts.filter(
      (c) => Number(c.id.slice(7, 9)) >= 18 && Number(c.id.slice(7, 9)) <= 25,
    )) {
      expect(['candidate', 'reviewed']).toContain(c.status);
      expect(italianCourse.theories[c.id].provenance).toContain('C18–C25');
      expect(repository.connections(c.id).length).toBeGreaterThan(0);
      expect(
        repository
          .select(c.id)
          .every(
            (a) =>
              a.task?.opportunityId === a.id + ':target' &&
              a.status === c.status,
          ),
      ).toBe(true);
    }
  });
  it('attributes an incompatible appointment only to the appointment concept and retains the repair', async () => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, repository);
      let view = await engine.start('it-a1-c22-04');
      const item = view.root.payload.activities[0];
      const response = '  lunedì alle 15  ';
      view = await engine.update(view, 'draft', response);
      view = await engine.submit(view);
      view = await engine.update(view, 'retry');
      view = await engine.update(view, 'hint');
      view = await engine.update(view, 'draft', 'martedì alle 18');
      view = await engine.submit(view);
      const facts = await store.allFacts();
      const attempts = facts.filter((f) => f.kind === 'attempt');
      const first = attempts.find((f) => f.payload.retryOf === null)!;
      const repair = attempts.find((f) => f.payload.retryOf === first.id)!;
      expect(first.payload.response).toBe(response);
      expect(repair.payload.hintShown).toBe(true);
      const evidence = facts.filter((f) => f.kind === 'evidence');
      expect(evidence).toHaveLength(2);
      expect(new Set(evidence.map((f) => f.payload.conceptId))).toEqual(
        new Set(['it-a1-c22-04']),
      );
      expect(new Set(evidence.map((f) => f.payload.judgment))).toEqual(
        new Set(['linguistic-error', 'correct']),
      );
      expect(
        evidence.find((f) => f.payload.attemptId === repair.id)?.payload
          .independent,
      ).toBe(false);
      for (const fact of evidence) {
        expect(fact.payload.activityVersion).toBe(item.version);
        expect(fact.payload.task?.skill).toBe(item.task?.skill);
        expect(fact.payload.provenance).toBe(item.provenance);
        expect(fact.payload.trace).toEqual(item.trace);
      }
      expect((await engine.load(view.head.id)).state.phase).toBe('feedback');
    } finally {
      store.close();
    }
  });
});
