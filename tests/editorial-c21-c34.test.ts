import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  authoredItalianCourse,
  italianCourse,
} from '../src/content/italian-a1/course';
import { editorialC01C10 } from '../src/content/italian-a1/editorial-c01-c10';
import { editorialC11C20 } from '../src/content/italian-a1/editorial-c11-c20';
import { editorialC21C34 } from '../src/content/italian-a1/editorial-c21-c34';
import {
  applyReviewBatch,
  reviewFingerprint,
  reviewReferences,
} from '../src/content/editorial-review';
import { loadLanguagePack } from '../src/content/loader';
import { evaluate } from '../src/exercises/evaluate';
import type { Activity } from '../shared/learning';
import type { Theory } from '../src/content/theory';
const artifact = (name: string) =>
  new URL(
    '../docs/product/editorial-cross-review-c21-c34/' + name,
    import.meta.url,
  );
const parse = (name: string) =>
  JSON.parse(readFileSync(artifact(name), 'utf8'));
const scoped = (id: string) => /^it-a1-c(2[1-9]|3[0-4])-/.test(id);
const activity = (suffix: string) =>
  italianCourse.canonicalActivities.find((a) => a.id === 'it-a1-c' + suffix)!;

describe('5B.4 C21–C34 editorial closure', () => {
  it('promotes exactly 38 concepts with current inventories and retains production exclusion', () => {
    const ids = italianCourse.curriculum.levels[0].units
      .slice(20, 34)
      .flatMap((u) => u.expectedConceptIds);
    expect(ids).toHaveLength(38);
    expect(editorialC21C34.concepts.map((r) => r.concept.id)).toEqual(ids);
    for (const receipt of editorialC21C34.concepts) {
      expect(receipt.decision).toBe('reviewed');
      expect(receipt.flags).toEqual([]);
      expect(receipt.entities).toEqual(
        reviewReferences(authoredItalianCourse, receipt.concept.id),
      );
      expect(receipt.fingerprint).toBe(
        reviewFingerprint(italianCourse, receipt.concept.id),
      );
      expect(italianCourse.theories[receipt.concept.id].status).toBe(
        'reviewed',
      );
    }
    expect(
      italianCourse.concepts.filter((c) => c.status === 'reviewed'),
    ).toHaveLength(99);
    expect(
      italianCourse.canonicalActivities.filter((a) => scoped(a.conceptId)),
    ).toHaveLength(346);
    expect(
      italianCourse.canonicalActivities.every((a) => a.status === 'reviewed'),
    ).toBe(true);
    expect(italianCourse.status).toBe('candidate');
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
  });
  it('preserves all earlier receipts and shared reviewed dependencies', () => {
    const previous = applyReviewBatch(
      applyReviewBatch(authoredItalianCourse, editorialC01C10),
      editorialC11C20,
    );
    for (const c of previous.concepts.filter((c) => !scoped(c.id))) {
      expect(italianCourse.concepts.find((x) => x.id === c.id)).toEqual(c);
      expect(italianCourse.theories[c.id]).toEqual(previous.theories[c.id]);
      expect(
        italianCourse.canonicalActivities.filter((a) => a.conceptId === c.id),
      ).toEqual(
        previous.canonicalActivities.filter((a) => a.conceptId === c.id),
      );
    }
    for (const v of previous.vocabulary.filter((v) => v.status === 'reviewed'))
      expect(italianCourse.vocabulary.find((x) => x.id === v.id)).toEqual(v);
    expect(italianCourse.relations).toEqual(previous.relations);
    expect(italianCourse.templates).toEqual(previous.templates);
    for (const r of [...editorialC01C10.concepts, ...editorialC11C20.concepts])
      expect(reviewFingerprint(italianCourse, r.concept.id)).toBe(
        r.fingerprint,
      );
  });
  it('verifies immutable original and followup hashes, exact coverage and final source versions', () => {
    const original = parse('manifest.json');
    const final = parse('resolution-manifest.json');
    const latestActivities = new Map<string, Activity>();
    const latestTheories = new Map<string, Theory>();
    for (const entry of [...original.packets, ...final.packets]) {
      const bytes = readFileSync(artifact(entry.file));
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(
        entry.sha256,
      );
      const packet = JSON.parse(bytes.toString());
      const followup = entry.file.startsWith('resolution');
      const verdict = parse(
        'verdicts/' +
          (followup
            ? 'resolution-verdict-' + entry.file.slice(11)
            : 'blind-resume-' + entry.file),
      );
      expect(verdict.sha256).toBe(entry.sha256);
      expect(verdict.notRead).toEqual([]);
      expect(verdict.theoryIdsRead).toEqual(entry.theoryIds);
      expect(verdict.activityIdsRead).toEqual(entry.activityIds);
      if (!followup) expect(verdict.priorR2ConclusionsReceived).toBe(false);
      else expect(verdict.findings).toEqual([]);
      for (const a of packet.activities) latestActivities.set(a.id, a);
      for (const t of packet.theories) latestTheories.set(t.id, t);
    }
    expect(
      new Set(
        original.packets.flatMap(
          (p: { activityIds: string[] }) => p.activityIds,
        ),
      ).size,
    ).toBe(291);
    expect(latestTheories.size).toBe(38);
    for (const a of latestActivities.values()) {
      expect(
        authoredItalianCourse.canonicalActivities.find((x) => x.id === a.id),
      ).toEqual(a);
      expect(a.criterion.version).toBe(a.version);
      expect(a.trace?.sourceVersion).toBe(a.version);
    }
    for (const t of latestTheories.values())
      expect(authoredItalianCourse.theories[t.conceptId]).toEqual(t);
    for (const c of parse('resolution-decisions.json').changes) {
      expect(c.from).not.toBe(c.to);
      expect(
        (c.kind === 'activity' ? latestActivities : latestTheories).get(c.id)
          ?.version,
      ).toBe(c.to);
    }
  });
  it('keeps corrected answers and non-exhaustive abstention behavior', () => {
    for (const [id, answer] of [
      ['22-04-proponi', 'Puoi venire lunedì alle quindici?'],
      ['22-04-conferma', 'Sì, posso venire alle tre'],
      ['25-01-domanda', 'Ti piace leggere?'],
      ['25-02-domanda', 'Ti piacciono i libri?'],
      ['34-04-scegli', 'Vorrei questa maglietta blu'],
      ['34-05-pausa', 'pausa'],
    ])
      expect(evaluate(activity(id), answer).judgment).toBe('correct');
    expect(evaluate(activity('34-05-pausa'), 'colazione').judgment).toBe(
      'linguistic-error',
    );
    expect(evaluate(activity('34-05-pausa'), 'interruzione').judgment).toBe(
      'not-evaluable',
    );
    expect(evaluate(activity('34-05-pausa'), '').judgment).toBe(
      'no-opportunity',
    );
  });
});
