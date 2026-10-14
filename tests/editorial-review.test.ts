import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { italianPack } from '../src/content/validation-fixture';
import {
  applyReviewBatch,
  reviewFingerprint,
  reviewReferences,
  type ReviewBatch,
} from '../src/content/editorial-review';
import { loadLanguagePack } from '../src/content/loader';
import { validatePack } from '../src/content/validate';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { project } from '../src/evidence/project';

const id = 'it-a1-c04-01';
function receipt(): ReviewBatch {
  return {
    id: 'synthetic-test-review',
    reviewer: 'Synthetic test only',
    date: '2026-10-13',
    provenance: 'Test fixture; does not approve real linguistic content.',
    concepts: [
      {
        concept: { id, version: '1' },
        decision: 'reviewed',
        reason: 'Synthetic complete experience.',
        flags: [],
        fingerprint: reviewFingerprint(italianPack, id),
        entities: reviewReferences(italianPack, id),
      },
    ],
  };
}
describe('explicit editorial review of a complete concept', () => {
  it('reviews exact dependencies without publishing or mutating the source; derived instances retain the review', () => {
    const before = JSON.stringify(italianPack);
    const reviewed = applyReviewBatch(italianPack, receipt());
    expect(validatePack(reviewed)).toEqual([]);
    expect(JSON.stringify(italianPack)).toBe(before);
    expect(reviewed.status).toBe('candidate');
    expect(reviewed.concepts[0].status).toBe('candidate');
    expect(loadLanguagePack(reviewed).repository.available()).toEqual([]);
    expect(loadLanguagePack(reviewed).theory(id)).toBeUndefined();
    const dev = loadLanguagePack(reviewed, true);
    expect(dev.repository.concept(id)?.status).toBe('reviewed');
    expect(dev.theory(id)?.status).toBe('reviewed');
    expect(
      dev.repository
        .select(id)
        .every(
          (a) => a.status === 'reviewed' && a.review?.version === a.version,
        ),
    ).toBe(true);
    expect(
      dev.repository.select(id).find((a) => a.trace?.kind === 'derived')?.review
        ?.reviewer,
    ).toBe('Synthetic test only');
    expect(reviewFingerprint(reviewed, id)).toBe(
      receipt().concepts[0].fingerprint,
    );
  });
  it('preserves valid earlier review metadata when batches share entities and rejects stale review metadata', () => {
    const first = applyReviewBatch(italianPack, receipt());
    const next = {
      ...receipt(),
      id: 'second-explicit-review',
      reviewer: 'Second reviewer',
    };
    expect(applyReviewBatch(first, next)).toEqual(first);
    const stale = structuredClone(first);
    const shared = stale.vocabulary.find((v) => v.status === 'reviewed')!;
    shared.review!.version = 'obsolete';
    expect(() => applyReviewBatch(stale, next)).toThrow('Revisión inválida');
    const altered = structuredClone(first);
    altered.vocabulary.find((v) => v.status === 'reviewed')!.gloss =
      'changed without a version bump';
    expect(() => applyReviewBatch(altered, next)).toThrow('obsoleta');
  });
  it('keeps a blocked decision candidate and requires an explicit reason and flags', () => {
    const batch = receipt();
    batch.concepts[0].decision = 'candidate';
    batch.concepts[0].flags = ['Human decision needed'];
    expect(
      applyReviewBatch(italianPack, batch).concepts.find((c) => c.id === id)
        ?.status,
    ).toBe('candidate');
    batch.concepts[0].decision = 'reviewed';
    expect(() => applyReviewBatch(italianPack, batch)).toThrow(
      'Decisión editorial',
    );
    batch.concepts[0].flags = [];
    batch.concepts[0].reason = ' ';
    expect(() => applyReviewBatch(italianPack, batch)).toThrow(
      'Decisión editorial',
    );
  });
  it('rejects incomplete inventories, duplicated decisions, missing provenance and publication decisions', () => {
    const missing = receipt();
    missing.concepts[0].entities.pop();
    expect(() => applyReviewBatch(italianPack, missing)).toThrow('incompleta');
    const duplicate = receipt();
    duplicate.concepts.push(duplicate.concepts[0]);
    expect(() => applyReviewBatch(italianPack, duplicate)).toThrow('inválida');
    expect(() =>
      applyReviewBatch(italianPack, { ...receipt(), provenance: ' ' }),
    ).toThrow('trazabilidad');
    expect(() =>
      applyReviewBatch(italianPack, { ...receipt(), date: 'invalid' }),
    ).toThrow('trazabilidad');
    const publication = receipt();
    Object.assign(publication.concepts[0], { decision: 'published' });
    expect(() => applyReviewBatch(italianPack, publication)).toThrow(
      'inválida',
    );
  });
  it('invalidates review after changes to answers, theory, vocabulary, graph or versions, even if an author forgets to bump a version', () => {
    for (const mutate of [
      (p: typeof italianPack) => {
        p.canonicalActivities
          .find((a) => a.conceptId === id)!
          .criterion.accepted.push('bad');
      },
      (p: typeof italianPack) => {
        p.theories[id].examples[0][0] = 'changed';
      },
      (p: typeof italianPack) => {
        p.vocabulary.find((v) => v.id === 'it-essere')!.gloss = 'changed';
      },
      (p: typeof italianPack) => {
        p.relations[0].reason = 'changed';
      },
      (p: typeof italianPack) => {
        p.concepts.find((c) => c.id === id)!.version = 'new';
      },
      (p: typeof italianPack) => {
        p.canonicalActivities = p.canonicalActivities.filter(
          (a) => a.id !== id + '-sei',
        );
      },
    ]) {
      const changed = structuredClone(italianPack);
      mutate(changed);
      expect(() => applyReviewBatch(changed, receipt())).toThrow('obsoleta');
    }
  });
  it('persists reviewed sessions and projects them only in development, preserving earlier candidate snapshots', async () => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const oldEngine = new SessionEngine(
        store,
        loadLanguagePack(italianPack, true).repository,
      );
      const historical = await oldEngine.start(id);
      const reviewed = applyReviewBatch(italianPack, receipt());
      const engine = new SessionEngine(
        store,
        loadLanguagePack(reviewed, true).repository,
      );
      const active = await engine.start(id);
      expect(active.root.payload.contentStatus).toBe('reviewed');
      const draft = await engine.update(active, 'draft', 'sono');
      const answered = await engine.submit(draft);
      expect(answered.root.payload.contentStatus).toBe('reviewed');
      const facts = await store.allFacts();
      expect(
        project(facts, id, '1', true).observations.reduce(
          (n, o) => n + o.correct,
          0,
        ),
      ).toBe(1);
      expect(
        project(facts, id, '1').observations.reduce((n, o) => n + o.correct, 0),
      ).toBe(0);
      expect(
        facts.find((f) => f.id === historical.root.id)?.payload,
      ).toMatchObject({ contentStatus: 'candidate' });
    } finally {
      store.close();
    }
  });
});
