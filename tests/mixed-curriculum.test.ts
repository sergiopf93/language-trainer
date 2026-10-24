import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { mixedItems } from '../src/content/italian-a1/mixed-items';
import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import {
  italianCourse,
  mixedCandidateCourse,
  reviewedItalianCourse6B,
} from '../src/content/italian-a1/course';
import { editorialMixed } from '../src/content/italian-a1/editorial-mixed';
import {
  reviewFingerprint,
  reviewReferences,
  applyReviewBatch,
} from '../src/content/editorial-review';
import { loadLanguagePack } from '../src/content/loader';
import { mixedGroups } from '../src/mixed/manifest';
import {
  eligibleMixedActivities,
  mixedGroupPrerequisites,
  mixedPlans,
} from '../src/mixed/engine';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { reviewPlans } from '../src/review/engine';

const catalog = loadLanguagePack(italianCourse, true).repository;

describe('6B.2 curriculum Mixed coverage and editorial integrity', () => {
  it('matches every authored addition to the exact independently approved packet', () => {
    const packetItems: typeof mixedItems = [];
    for (const part of ['early', 'middle', 'late']) {
      const base = new URL(
        '../docs/product/mixed-coverage-review/',
        import.meta.url,
      );
      const bytes = readFileSync(new URL(`final-${part}.json`, base));
      const verdict = JSON.parse(
        readFileSync(new URL(`final-verdict-${part}.json`, base), 'utf8'),
      );
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(
        verdict.sha256 ?? verdict.sourceSha256,
      );
      if (part === 'early') expect(verdict.status).toBe('approved');
      if (part === 'middle') expect(verdict.blockedIds).toEqual([]);
      if (part === 'late') expect(verdict.blocked).toBe(0);
      packetItems.push(...JSON.parse(bytes.toString()));
    }
    expect(packetItems).toEqual(mixedItems);
  });

  it('represents every applicable A1 concept in a coherent, usable group', () => {
    expect(new Set(mixedGroups.flatMap((g) => g.conceptIds))).toEqual(
      new Set(italianCourse.concepts.map((c) => c.id)),
    );
    expect(new Set(mixedGroups.map((g) => g.id)).size).toBe(mixedGroups.length);
    for (const group of mixedGroups) {
      expect(group.conceptIds.length).toBeGreaterThanOrEqual(2);
      expect(group.conceptIds.length).toBeLessThanOrEqual(3);
      expect(new Set(group.items.map((i) => i.id)).size).toBe(
        group.items.length,
      );
      const pool = eligibleMixedActivities(catalog, group);
      expect(pool).toHaveLength(group.items.length);
      for (const id of group.conceptIds)
        expect(
          pool.filter((a) => a.conceptId === id).length,
        ).toBeGreaterThanOrEqual(2);
      expect(pool.every((a) => a.status === 'reviewed')).toBe(true);
      for (const id of mixedGroupPrerequisites(catalog, group))
        expect(catalog.concept(id)).toBeDefined();
    }
  });

  it('preserves the complete previous bank and requires explicit receipts for additions', () => {
    const old = new Map(
      reviewedItalianCourse6B.canonicalActivities.map((a) => [a.id, a]),
    );
    for (const a of italianCourse.canonicalActivities) {
      if (old.has(a.id)) expect(a).toEqual(old.get(a.id));
      else {
        expect(
          mixedCandidateCourse.canonicalActivities.find((x) => x.id === a.id)
            ?.status,
        ).toBe('candidate');
        expect(a.status).toBe('reviewed');
        expect(
          editorialMixed.concepts.some((r) =>
            r.entities.some((e) => e.id === a.id && e.version === a.version),
          ),
        ).toBe(true);
      }
    }
    expect(italianCourse.concepts).toEqual(reviewedItalianCourse6B.concepts);
    expect(italianCourse.theories).toEqual(reviewedItalianCourse6B.theories);
    expect(italianCourse.relations).toEqual(reviewedItalianCourse6B.relations);
    expect(italianCourse.vocabulary).toEqual(
      reviewedItalianCourse6B.vocabulary,
    );
    expect(italianCourse.templates).toEqual(reviewedItalianCourse6B.templates);
    for (const r of editorialMixed.concepts) {
      expect(r.flags).toEqual([]);
      expect(r.entities).toEqual(reviewReferences(italianCourse, r.concept.id));
      expect(r.fingerprint).toBe(
        reviewFingerprint(italianCourse, r.concept.id),
      );
    }
    const altered = structuredClone(mixedCandidateCourse);
    altered.canonicalActivities.find((a) => !old.has(a.id))!.prompt +=
      ' Changed';
    expect(() => applyReviewBatch(altered, editorialMixed)).toThrow('obsoleta');
    expect(loadLanguagePack(italianCourse).repository.available()).toEqual([]);
  });

  it('requires the complete preparation of each group, not just its target concepts', async () => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, catalog);
      for (const concept of italianCourse.concepts)
        await engine.study(concept.id, '1');
      const facts = await store.allFacts();
      const now = new Date();
      expect(mixedPlans(catalog, facts, now)).toHaveLength(mixedGroups.length);
      const preparation = new Map(
        mixedGroups.map((g) => [g.id, mixedGroupPrerequisites(catalog, g)]),
      );
      for (const id of new Set([...preparation.values()].flat())) {
        const missing = facts.filter(
          (f) => !(f.kind === 'theory-exposure' && f.payload.conceptId === id),
        );
        const enabled = new Set(
          mixedPlans(catalog, missing, now).map((p) => p.groupId),
        );
        for (const group of mixedGroups)
          if (preparation.get(group.id)!.includes(id))
            expect(enabled.has(group.id), `${group.id} requires ${id}`).toBe(
              false,
            );
      }
    } finally {
      store.close();
    }
  }, 60000);

  it.each(mixedGroups)(
    '$id: evaluator, evidence and Review integration',
    async (group) => {
      const store = await LocalStore.open(crypto.randomUUID());
      try {
        const engine = new SessionEngine(store, catalog);
        for (const id of mixedGroupPrerequisites(catalog, group))
          await engine.study(id, '1');
        let view = await engine.startMixed(group.id);
        const root = view.root;
        while (view.state.status === 'active') {
          const a = root.payload.activities[view.state.index];
          view = await engine.submit(
            await engine.update(view, 'draft', a.criterion.accepted[0]),
          );
          view = await engine.update(view, 'next');
        }
        const facts = await store.allFacts();
        const evidence = facts.filter(
          (f) => f.kind === 'evidence' && f.payload.sessionId === root.id,
        );
        expect(evidence).toHaveLength(root.payload.activities.length);
        for (const f of evidence)
          if (f.kind === 'evidence') {
            const a = root.payload.activities.find(
              (a) => a.id === f.payload.activityId,
            )!;
            expect(f.payload.conceptId).toBe(a.conceptId);
            expect(f.payload.dimension).toBe(a.dimension);
            expect(f.payload.judgment).toBe('correct');
          }
        const reviews = reviewPlans(catalog, facts, new Date());
        for (const id of group.conceptIds)
          expect(
            reviews.find((r) => r.conceptId === id)?.lastPracticedAt,
          ).toBeTruthy();
      } finally {
        store.close();
      }
    },
    60000,
  );
});
