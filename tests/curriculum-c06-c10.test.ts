import { describe, expect, it } from 'vitest';
import { italianCourse, lessons } from '../src/content/italian-a1/course';
import { evaluate } from '../src/exercises/evaluate';
import { curriculumCoverage } from '../src/content/coverage';
import { loadLanguagePack } from '../src/content/loader';

const { repository } = loadLanguagePack(italianCourse, true);
const get = (suffix: string) =>
  repository.activities.find((a) => a.id === 'it-a1-c' + suffix)!;
describe('C06–C10 authored linguistic boundaries', () => {
  it('distinguishes accepted language, known errors, typos, unknown and empty answers', () => {
    const cases = [
      ['06-01-completa', 'non', 'no'],
      ['06-02-persona', 'ho', 'hai'],
      ['06-03-motivo', 'perché', 'perche'],
      ['07-01-letto', 'maschile', 'femminile'],
      ['07-02-problema', 'maschile', 'femminile'],
      ['08-01-trasforma', 'Ho due penne', 'Hanno due penne'],
      ['08-02-film', 'film', 'films'],
      ['09-01-studente', 'lo', 'il'],
      ['09-02-amica', 'le amiche', 'gli amiche'],
      ['09-03-biglietto', 'il', 'un'],
      ['10-01-amico', 'un amico', "un'amico"],
      ['10-01-amica', 'un’amica', 'un amica'],
      ['10-02-riprendi', 'la', 'una'],
    ];
    for (const [id, right, wrong] of cases) {
      const activity = get(id);
      expect(evaluate(activity, right).judgment, id).toBe('correct');
      expect(evaluate(activity, wrong).judgment, id).toBe('linguistic-error');
      expect(evaluate(activity, '').judgment, id).toBe('no-opportunity');
      expect(evaluate(activity, 'fuera de criterio 987').judgment, id).toBe(
        'not-evaluable',
      );
      expect(activity.explanation.length).toBeGreaterThan(20);
    }
    expect(evaluate(get('03-01-noi'), 'noe').judgment).toBe('typo');
    expect(evaluate(get('10-01-amico'), 'un amcio').judgment).toBe(
      'not-evaluable',
    );
    expect(evaluate(get('10-01-amica'), "un'amica").judgment).toBe('correct');
    expect(evaluate(get('10-01-amica'), 'una amica').judgment).toBe(
      'not-evaluable',
    );
  });
  it('keeps the old authored inventory and expected curriculum while adding exactly twelve candidates', () => {
    const old = italianCourse.canonicalActivities.filter(
      (a) => Number(a.conceptId.slice(7, 9)) <= 5,
    );
    expect(old).toHaveLength(138);
    expect(italianCourse.curriculum.levels[0].units).toHaveLength(34);
    expect(
      italianCourse.concepts.filter(
        (c) => Number(c.id.slice(7, 9)) >= 6 && Number(c.id.slice(7, 9)) <= 10,
      ),
    ).toHaveLength(12);
    expect(curriculumCoverage(italianCourse).totals.expectedConcepts).toBe(99);
    expect(italianCourse.concepts.every((c) => c.status === 'candidate')).toBe(
      true,
    );
    expect(
      italianCourse.canonicalActivities.every((a) => a.status === 'candidate'),
    ).toBe(true);
    expect(
      italianCourse.vocabulary.every((v) => v.status === 'candidate'),
    ).toBe(true);
    expect(
      Object.values(italianCourse.theories).every(
        (t) => t.status === 'candidate',
      ),
    ).toBe(true);
    expect(italianCourse.templates.every((t) => t.status === 'candidate')).toBe(
      true,
    );
  });
  it('reuses vocabulary, connects recommended preparation and exposes practice without locks', () => {
    for (const code of ['06-01', '07-01', '08-01', '09-01', '10-02']) {
      const id = 'it-a1-c' + code;
      expect(repository.select(id).length).toBeGreaterThan(0);
      expect(repository.connections(id).length).toBeGreaterThan(0);
    }
    expect(repository.prerequisites('it-a1-c06-01').map((r) => r.to)).toEqual([
      'it-a1-c04-01',
      'it-a1-c05-01',
    ]);
    const penna = italianCourse.vocabulary.find((v) => v.id === 'it-penna')!;
    expect(penna.conceptIds).toContain('it-a1-c05-02');
    expect(penna.conceptIds).toContain('it-a1-c07-01');
    expect(penna.conceptIds).toContain('it-a1-c10-02');
    expect(
      italianCourse.vocabulary.find((v) => v.id === 'it-foto')?.forms[0].text,
    ).toBe('foto');
    expect(
      italianCourse.vocabulary.find((v) => v.id === 'it-mano')?.gender,
    ).toBe('feminine');
    for (const lesson of lessons.filter(
      (l) =>
        Number(l.code.slice(0, 2)) >= 6 && Number(l.code.slice(0, 2)) <= 10,
    )) {
      expect(
        lesson.items.some((i) =>
          [
            'short',
            'transformation',
            'error-correction',
            'translation',
            'controlled-production',
          ].includes(i.format),
        ),
        lesson.code,
      ).toBe(true);
      expect(
        italianCourse.theories['it-a1-c' + lesson.code].provenance,
      ).toContain('C06–C10');
    }
  });
});
