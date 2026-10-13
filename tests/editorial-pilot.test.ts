import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  authoredItalianCourse,
  italianCourse,
} from '../src/content/italian-a1/course';
import { editorialC01C10 } from '../src/content/italian-a1/editorial-c01-c10';
import { reviewFingerprint } from '../src/content/editorial-review';
import { validatePack } from '../src/content/validate';
import { loadLanguagePack } from '../src/content/loader';
import { evaluate } from '../src/exercises/evaluate';
const pilot = (id: string) => /^it-a1-c(0[1-9]|10)-/.test(id);
const activity = (suffix: string) =>
  italianCourse.canonicalActivities.find((a) => a.id === 'it-a1-c' + suffix)!;
describe('C01–C10 editorial pilot receipts', () => {
  it('accounts for every concept and every activity, with current receipts and no publication', () => {
    const expected = italianCourse.curriculum.levels[0].units
      .slice(0, 10)
      .flatMap((u) => u.expectedConceptIds);
    expect(editorialC01C10.concepts.map((r) => r.concept.id)).toEqual(expected);
    expect(expected).toHaveLength(29);
    expect(
      italianCourse.canonicalActivities.filter((a) => pilot(a.conceptId)),
    ).toHaveLength(227);
    expect(validatePack(italianCourse)).toEqual([]);
    expect(italianCourse.status).toBe('candidate');
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
    for (const receipt of editorialC01C10.concepts) {
      expect(receipt.decision).toBe('reviewed');
      expect(receipt.flags).toEqual([]);
      expect(reviewFingerprint(italianCourse, receipt.concept.id)).toBe(
        receipt.fingerprint,
      );
    }
    expect(
      italianCourse.vocabulary.filter((v) => v.status === 'reviewed'),
    ).toHaveLength(96);
    expect(italianCourse.templates.every((t) => t.status === 'reviewed')).toBe(
      true,
    );
  });
  it('does not review later concepts or their theory/activities through shared vocabulary', () => {
    for (const concept of authoredItalianCourse.concepts.filter(
      (c) => !pilot(c.id),
    )) {
      expect(italianCourse.concepts.find((c) => c.id === concept.id)).toEqual(
        concept,
      );
      expect(italianCourse.theories[concept.id]).toEqual(
        authoredItalianCourse.theories[concept.id],
      );
      expect(
        italianCourse.canonicalActivities.filter(
          (a) => a.conceptId === concept.id,
        ),
      ).toEqual(
        authoredItalianCourse.canonicalActivities.filter(
          (a) => a.conceptId === concept.id,
        ),
      );
    }
    expect(italianCourse.relations).toEqual(authoredItalianCourse.relations);
  });
  it('records a new entity version for each substantive correction and an equally versioned answer criterion', () => {
    const log = JSON.parse(
      readFileSync(
        new URL(
          '../docs/product/A1_EDITORIAL_CHANGES_C01_C10.json',
          import.meta.url,
        ),
        'utf8',
      ),
    );
    const entities = [
      ...italianCourse.canonicalActivities,
      ...Object.values(italianCourse.theories),
      ...italianCourse.vocabulary,
    ];
    for (const change of log.changes) {
      expect(change.from, change.id).not.toBe(change.to);
      expect(entities.find((e) => e.id === change.id)?.version, change.id).toBe(
        change.to,
      );
      if (change.kind === 'activity') {
        const a = italianCourse.canonicalActivities.find(
          (e) => e.id === change.id,
        )!;
        expect(a.criterion.version).toBe(a.version);
        expect(a.trace?.sourceVersion).toBe(a.version);
      }
    }
  });
  it('accepts explicit equivalent variants and preserves significant accents, apostrophes, number and typo policy', () => {
    for (const [id, answer] of [
      ['02-01-amica', 'Ciao!'],
      ['02-02-prego', 'Prego.'],
      ['02-03-formula', 'può ripetere, per favore'],
      ['04-01-engine-1', 'tu sei.'],
      ['04-01-engine-6', 'sì, sono io.'],
      ['05-03-loro', 'loro hanno entrambi 40 anni'],
      ['08-02-ordine', 'Per favore, due caffè.'],
      ['10-02-chiedi', 'Per favore un caffè'],
    ])
      expect(evaluate(activity(id), answer).judgment, id).toBe('correct');
    for (const [id, answer] of [
      ['01-02-essere', 'e'],
      ['01-03-pena', 'penna'],
      ['03-01-noi', 'voi'],
      ['05-01-loro', 'anno'],
      ['10-01-amico', "un'amico"],
      ['10-01-amica', 'un amica'],
    ])
      expect(evaluate(activity(id), answer).judgment, id).toBe(
        'linguistic-error',
      );
    expect(evaluate(activity('03-01-noi'), 'noe').judgment).toBe('typo');
    expect(
      evaluate(activity('02-03-formula'), 'potrebbe ripetere?').judgment,
    ).toBe('not-evaluable');
    expect(evaluate(activity('02-03-formula'), '').judgment).toBe(
      'no-opportunity',
    );
  });
});
