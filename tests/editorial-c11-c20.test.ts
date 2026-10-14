import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  authoredItalianCourse,
  italianCourse,
} from '../src/content/italian-a1/course';
import { editorialC01C10 } from '../src/content/italian-a1/editorial-c01-c10';
import { editorialC11C20 } from '../src/content/italian-a1/editorial-c11-c20';
import {
  applyReviewBatch,
  reviewFingerprint,
  reviewReferences,
} from '../src/content/editorial-review';
import { loadLanguagePack } from '../src/content/loader';
import { evaluate } from '../src/exercises/evaluate';
import type { Activity } from '../shared/learning';
import type { Theory } from '../src/content/theory';
const scoped = (id: string) => /^it-a1-c(1[1-9]|20)-/.test(id);
const artifact = (name: string) =>
  new URL(
    '../docs/product/editorial-cross-review-c11-c20/' + name,
    import.meta.url,
  );
const parse = (name: string) =>
  JSON.parse(readFileSync(artifact(name), 'utf8'));
const activity = (suffix: string) =>
  italianCourse.canonicalActivities.find((a) => a.id === 'it-a1-c' + suffix)!;

describe('C11–C20 complete editorial review and independent evidence', () => {
  it('applies exactly the reviewed concept inventories without publishing', () => {
    const expected = italianCourse.curriculum.levels[0].units
      .slice(10, 20)
      .flatMap((u) => u.expectedConceptIds);
    expect(expected).toHaveLength(32);
    expect(editorialC11C20.concepts.map((r) => r.concept.id)).toEqual(expected);
    expect(
      italianCourse.canonicalActivities.filter((a) => scoped(a.conceptId)),
    ).toHaveLength(292);
    for (const receipt of editorialC11C20.concepts) {
      expect(receipt.decision).toBe('reviewed');
      expect(receipt.flags).toEqual([]);
      expect(receipt.entities).toEqual(
        reviewReferences(authoredItalianCourse, receipt.concept.id),
      );
      expect(receipt.fingerprint).toBe(
        reviewFingerprint(italianCourse, receipt.concept.id),
      );
      expect(
        italianCourse.concepts.find((c) => c.id === receipt.concept.id)?.status,
      ).toBe(receipt.decision);
      expect(italianCourse.theories[receipt.concept.id].status).toBe(
        receipt.decision,
      );
      expect(
        italianCourse.canonicalActivities
          .filter((a) => a.conceptId === receipt.concept.id)
          .every((a) => a.status === receipt.decision),
      ).toBe(true);
    }
    expect(
      italianCourse.concepts.filter((c) => c.status === 'reviewed'),
    ).toHaveLength(61);
    expect(
      italianCourse.concepts.filter((c) => c.status === 'candidate'),
    ).toHaveLength(38);
    expect(italianCourse.status).toBe('candidate');
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
  });
  it('preserves the earlier review and does not promote later concepts through shared vocabulary', () => {
    const pilot = applyReviewBatch(authoredItalianCourse, editorialC01C10);
    for (const c of pilot.concepts.filter((c) => !scoped(c.id))) {
      expect(italianCourse.concepts.find((x) => x.id === c.id)).toEqual(c);
      expect(italianCourse.theories[c.id]).toEqual(pilot.theories[c.id]);
      expect(
        italianCourse.canonicalActivities.filter((a) => a.conceptId === c.id),
      ).toEqual(pilot.canonicalActivities.filter((a) => a.conceptId === c.id));
    }
    for (const v of pilot.vocabulary.filter((v) => v.status === 'reviewed'))
      expect(italianCourse.vocabulary.find((x) => x.id === v.id)).toEqual(v);
    expect(italianCourse.relations).toEqual(authoredItalianCourse.relations);
    expect(italianCourse.templates).toEqual(pilot.templates);
  });
  it('keeps immutable package hashes and exact independent coverage, including later corrections', () => {
    const manifest = parse('manifest.json');
    const verdict = parse('independent-verdict.json');
    const finalManifest = parse('resolution-manifest.json');
    const resolution = parse('resolution-verdict.json');
    expect(resolution.newFindings).toEqual([]);
    expect(resolution.coverage.notReadWithinPacket).toEqual([]);
    expect(
      resolution.coverage.activities.map((a: { id: string }) => a.id),
    ).toEqual(finalManifest.activityIds);
    const independentlyRead = new Set([
      ...verdict.coverage.activityIdsRead,
      ...finalManifest.activityIds,
    ]);
    const packets: { theories: Theory[]; activities: Activity[] }[] = [];
    for (const entry of [...manifest.packets, finalManifest]) {
      const bytes = readFileSync(artifact(entry.file));
      expect(createHash('sha256').update(bytes).digest('hex'), entry.file).toBe(
        entry.sha256,
      );
      packets.push(JSON.parse(bytes.toString()));
    }
    expect(verdict.methodAndIndependence.priorR2ConclusionsReceived).toBe(
      false,
    );
    expect(verdict.coverage.selectedTheoryIdsNotRead).toEqual([]);
    expect(verdict.coverage.selectedActivityIdsNotRead).toEqual([]);
    expect(new Set(verdict.coverage.activityIdsRead)).toEqual(
      new Set(
        manifest.packets.flatMap(
          (p: { selectedActivityIds: string[] }) => p.selectedActivityIds,
        ),
      ),
    );
    expect(new Set(verdict.coverage.theoryIdsRead)).toEqual(
      new Set(
        Object.values(italianCourse.theories)
          .filter((t) => scoped(t.conceptId))
          .map((t) => t.id),
      ),
    );
    const latestActivities = new Map(
      packets.flatMap((p) => p.activities).map((a) => [a.id, a]),
    );
    const latestTheories = new Map(
      packets.flatMap((p) => p.theories).map((t) => [t.id, t]),
    );
    for (const a of latestActivities.values())
      expect(
        authoredItalianCourse.canonicalActivities.find((x) => x.id === a.id),
        a.id,
      ).toEqual(a);
    for (const t of latestTheories.values())
      expect(authoredItalianCourse.theories[t.conceptId], t.id).toEqual(t);
    const changes = JSON.parse(
      readFileSync(
        new URL(
          '../docs/product/A1_EDITORIAL_CHANGES_C11_C20.json',
          import.meta.url,
        ),
        'utf8',
      ),
    ).changes;
    const entities = [
      ...authoredItalianCourse.canonicalActivities,
      ...Object.values(authoredItalianCourse.theories),
      ...authoredItalianCourse.vocabulary,
    ];
    for (const c of changes) {
      expect(c.from, c.id).not.toBe(c.to);
      expect(entities.find((e) => e.id === c.id)?.version, c.id).toBe(c.to);
      if (c.kind === 'activity') {
        expect(latestActivities.has(c.id), c.id).toBe(true);
        expect(independentlyRead.has(c.id), c.id).toBe(true);
        const a = latestActivities.get(c.id)!;
        expect(a.criterion.version).toBe(a.version);
        expect(a.trace?.sourceVersion).toBe(a.version);
      }
    }
  });
  it('implements contextual variants and removes false universal rejections without opening the criteria', () => {
    for (const answer of ['in', 'a', 'ad'])
      expect(evaluate(activity('20-06-mese'), answer).judgment).toBe('correct');
    expect(evaluate(activity('20-06-mese'), 'su').judgment).toBe(
      'linguistic-error',
    );
    expect(
      evaluate(activity('13-02-centottanta'), 'centottanta').judgment,
    ).toBe('correct');
    expect(
      evaluate(activity('13-02-centottanta'), 'centoottanta').judgment,
    ).toBe('not-evaluable');
    expect(evaluate(activity('20-03-casa'), 'Vado in casa').judgment).toBe(
      'not-evaluable',
    );
    expect(evaluate(activity('16-06-forma-voi'), 'berete').judgment).toBe(
      'linguistic-error',
    );
    expect(
      evaluate(activity('19-01-domanda'), "C'è una camera?").judgment,
    ).toBe('correct');
    expect(
      evaluate(activity('18-01-biglietto'), 'Per favore, vorrei un biglietto.')
        .judgment,
    ).toBe('correct');
    expect(evaluate(activity('20-02-hotel'), 'Lavoro in hotel.').judgment).toBe(
      'correct',
    );
    expect(evaluate(activity('20-04-correggi'), 'me').judgment).toBe('correct');
    expect(evaluate(activity('20-06-mese'), '').judgment).toBe(
      'no-opportunity',
    );
  });
});
