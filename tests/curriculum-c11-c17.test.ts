import 'fake-indexeddb/auto';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { describe, expect, it } from 'vitest';
import { italianCourse, lessons } from '../src/content/italian-a1/course';
import { evaluate } from '../src/exercises/evaluate';
import { loadLanguagePack } from '../src/content/loader';
import { curriculumCoverage } from '../src/content/coverage';
const { repository } = loadLanguagePack(italianCourse, true);
const activity = (suffix: string) =>
  repository.activities.find((a) => a.id === 'it-a1-c' + suffix)!;
describe('C11–C17 linguistic and attribution boundaries', () => {
  it('distinguishes explicit correct forms from conceptual errors, unknown responses and empty answers', () => {
    const cases = [
      ['11-01-grande', 'grande', 'granda'],
      ['11-01-descrivi', 'Gli amici sono stanchi', 'Gli amici sono stanche'],
      ['11-02-amico', 'da molto tempo', 'necessariamente anziano'],
      ['12-01-studenti', 'gli studenti italiani', 'i studenti italiani'],
      ['13-01-ventitre', 'ventitré', 'ventitre'],
      ['13-01-ventotto', 'ventotto', 'ventiotto'],
      ['13-02-centottanta', 'centottanta', 'centoottanta'],
      ['13-03-telefono', '0298', '298'],
      ['13-03-importo', 'tre euro e venti centesimi', 'trecentoventi euro'],
      ['14-01-studiare', 'studi', 'studii'],
      ['14-02-lavoro', 'Lavoriamo in hotel', 'Abitiamo in hotel'],
      ['15-01-forma-voi', 'leggete', 'leggiate'],
      ['15-02-forma-io', 'dormo', 'dormisco'],
      ['15-03-forma-noi', 'capiamo', 'capisciamo'],
      ['16-01-forma-lui-lei', 'fa', 'fà'],
      ['16-02-cambia', 'Noi andiamo a casa', 'Noi vadiamo a casa'],
      ['16-03-essere', 'Sono stanco', 'Sto stanco'],
      ['16-04-contrasto', 'vieni', 'vai'],
      ['16-05-forma-lui-lei', 'dà', 'da'],
      ['16-06-forma-io', 'bevo', 'bero'],
      ['16-07-forma-voi', 'dite', 'dicete'],
      ['16-08-forma-noi', 'usciamo', 'esciamo'],
      ['17-01-infinito', 'leggere', 'leggo'],
      ['17-02-registro', 'no', 'sì'],
      ['17-03-infinito', 'Devo lavorare', 'Devo che lavorare'],
    ];
    for (const [id, right, wrong] of cases) {
      const a = activity(id);
      expect(evaluate(a, right).judgment, id).toBe('correct');
      expect(evaluate(a, wrong).judgment, id).toBe('linguistic-error');
      expect(evaluate(a, '').judgment, id).toBe('no-opportunity');
      expect(evaluate(a, 'respuesta ajena 987').judgment, id).toBe(
        'not-evaluable',
      );
    }
    expect(evaluate(activity('13-02-centotto'), 'centootto').judgment).toBe(
      'correct',
    );
    expect(evaluate(activity('13-02-centotto'), 'centotto').judgment).toBe(
      'correct',
    );
    expect(evaluate(activity('17-03-forma-io'), 'debbo').judgment).toBe(
      'correct',
    );
    expect(evaluate(activity('17-03-forma-loro'), 'debbono').judgment).toBe(
      'correct',
    );
    expect(evaluate(activity('16-05-forma-lui-lei'), 'dá').judgment).toBe(
      'not-evaluable',
    );
    expect(evaluate(activity('03-01-noi'), 'noe').judgment).toBe('typo');
  });
  it('adds exactly the expected seven complete candidate blocks and preserves the earlier activity inventory', () => {
    const report = curriculumCoverage(italianCourse);
    expect(report.errors).toEqual([]);
    expect(report.units.slice(10, 17).map((u) => u.concepts.length)).toEqual([
      2, 1, 3, 2, 3, 8, 3,
    ]);
    expect(italianCourse.concepts).toHaveLength(51);
    expect(Object.keys(italianCourse.theories)).toHaveLength(51);
    expect(
      italianCourse.canonicalActivities.filter(
        (a) => Number(a.conceptId.slice(7, 9)) <= 10,
      ),
    ).toHaveLength(225);
    expect(italianCourse.canonicalActivities).toHaveLength(431);
    expect(italianCourse.vocabulary).toHaveLength(172);
    expect(italianCourse.templates).toHaveLength(2);
    expect(
      report.units.slice(17).every((u) => u.concepts.every((c) => !c.concept)),
    ).toBe(true);
    for (const l of lessons.filter((l) => Number(l.code.slice(0, 2)) >= 11)) {
      const id = 'it-a1-c' + l.code;
      expect(italianCourse.theories[id].provenance).toContain('C11–C17');
      expect(repository.connections(id).length, id).toBeGreaterThan(0);
      expect(
        repository
          .select(id)
          .every(
            (a) =>
              a.status === 'candidate' &&
              a.conceptId === id &&
              a.trace?.sourceId === a.id,
          ),
      ).toBe(true);
    }
  });
  it('retains six-person paradigms, modal infinitives and reuse of earlier lexical support', () => {
    for (const lemma of [
      'parlare',
      'lavorare',
      'abitare',
      'studiare',
      'leggere',
      'prendere',
      'dormire',
      'capire',
      'fare',
      'andare',
      'stare',
      'venire',
      'dare',
      'bere',
      'dire',
      'uscire',
      'potere',
      'volere',
      'dovere',
    ]) {
      const entry = italianCourse.vocabulary.find(
        (v) => v.id === 'it-' + lemma,
      )!;
      expect(entry.forms.slice(0, 6).map((f) => f.key)).toEqual([
        'io',
        'tu',
        'lui-lei',
        'noi',
        'voi',
        'loro',
      ]);
    }
    expect(
      italianCourse.vocabulary.find((v) => v.id === 'it-casa')?.conceptIds,
    ).toContain('it-a1-c11-01');
    expect(
      italianCourse.vocabulary.find((v) => v.id === 'it-casa')?.conceptIds,
    ).toContain('it-a1-c07-01');
    expect(
      repository
        .prerequisites('it-a1-c12-01')
        .every((r) => r.strength === 'recommended'),
    ).toBe(true);
    const target = activity('12-01-studenti');
    expect(target.conceptId).toBe('it-a1-c12-01');
    expect(target.task?.opportunityId).toBe(target.id + ':target');
    expect(target.criterion.accepted).toEqual(['gli studenti italiani']);
  });
});

it.each(['it-a1-c12-01', 'it-a1-c17-01'])(
  'records a failed integrated response only against %s and retains the repair trace',
  async (conceptId) => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, repository);
      let view = await engine.start(conceptId);
      const item = view.root.payload.activities[0];
      const wrong = item.options.find(
        (o) => !item.criterion.accepted.includes(o),
      )!;
      const original = '  ' + wrong + '  ';
      view = await engine.update(view, 'draft', original);
      view = await engine.submit(view);
      view = await engine.update(view, 'retry');
      view = await engine.update(view, 'hint');
      view = await engine.update(view, 'draft', item.criterion.accepted[0]);
      view = await engine.submit(view);
      const facts = await store.allFacts();
      const attempts = facts.filter((f) => f.kind === 'attempt');
      const first = attempts.find((f) => f.payload.retryOf === null)!;
      const repair = attempts.find((f) => f.payload.retryOf === first.id)!;
      expect(first.payload.response).toBe(original);
      expect(repair.payload.hintShown).toBe(true);
      const evidence = facts.filter((f) => f.kind === 'evidence');
      expect(evidence).toHaveLength(2);
      expect(new Set(evidence.map((f) => f.payload.conceptId))).toEqual(
        new Set([conceptId]),
      );
      expect(new Set(evidence.map((f) => f.payload.judgment))).toEqual(
        new Set(['linguistic-error', 'correct']),
      );
      expect(
        evidence.find((f) => f.payload.attemptId === repair.id)?.payload
          .independent,
      ).toBe(false);
      for (const f of evidence) {
        expect(f.payload.activityVersion).toBe(item.version);
        expect(f.payload.task?.skill).toBe(item.task?.skill);
        expect(f.payload.provenance).toBe(item.provenance);
        expect(f.payload.trace).toEqual(item.trace);
      }
      expect((await engine.load(view.head.id)).state.phase).toBe('feedback');
    } finally {
      store.close();
    }
  },
);
