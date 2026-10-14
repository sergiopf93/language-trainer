import type { Editorial, LanguagePack, Reference } from './model';
import { reviewContent } from './editorial';
import { editorialErrors } from './validate';

export interface ConceptReview {
  concept: Reference;
  decision: 'candidate' | 'reviewed';
  reason: string;
  flags: string[];
  fingerprint: string;
  entities: { kind: string; id: string; version: string }[];
}
export interface ReviewBatch {
  id: string;
  reviewer: string;
  date: string;
  provenance: string;
  concepts: ConceptReview[];
}

export function reviewEntities(pack: LanguagePack, conceptId: string) {
  const concept = pack.concepts.find((c) => c.id === conceptId);
  const theory = pack.theories[conceptId];
  if (!concept || !theory) throw new Error('Concepto o Theory inexistente.');
  const activities = pack.canonicalActivities.filter(
    (a) => a.conceptId === conceptId,
  );
  const templates = pack.templates.filter((t) => t.concept.id === conceptId);
  const vocabularyIds = new Set([
    ...theory.vocabularyIds,
    ...templates.flatMap((t) =>
      t.variants.flatMap((v) => v.vocabulary.map((r) => r.id)),
    ),
  ]);
  const vocabulary = pack.vocabulary.filter(
    (v) => vocabularyIds.has(v.id) || v.conceptIds.includes(conceptId),
  );
  if ([...vocabularyIds].some((id) => !vocabulary.some((v) => v.id === id)))
    throw new Error('Vocabulario de revisión inexistente.');
  return [
    { kind: 'concept', item: concept },
    { kind: 'theory', item: theory },
    ...activities.map((item) => ({ kind: 'activity', item })),
    ...vocabulary.map((item) => ({ kind: 'vocabulary', item })),
    ...templates.map((item) => ({ kind: 'template', item })),
  ];
}

export function reviewReferences(pack: LanguagePack, id: string) {
  return reviewEntities(pack, id).map(({ kind, item }) => ({
    kind,
    id: item.id,
    version: item.version,
  }));
}

// Change detector, not a signature or an independent linguistic assessment.
// Editorial state is excluded so applying a receipt does not invalidate itself.
export function reviewFingerprint(pack: LanguagePack, id: string): string {
  const clean = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(clean);
    if (value && typeof value === 'object')
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !['status', 'review', 'publication'].includes(key))
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, item]) => [key, clean(item)]),
      );
    return value;
  };
  const snapshot = JSON.stringify(
    clean({
      entities: reviewEntities(pack, id),
      relations: pack.relations.filter((r) => r.from === id || r.to === id),
    }),
  );
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < snapshot.length; i++) {
    hash ^= BigInt(snapshot.charCodeAt(i));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
}

export function applyReviewBatch(
  source: LanguagePack,
  batch: ReviewBatch,
): LanguagePack {
  if (
    !batch.id.trim() ||
    !batch.reviewer.trim() ||
    !batch.provenance.trim() ||
    !Number.isFinite(Date.parse(batch.date))
  )
    throw new Error('Lote editorial sin trazabilidad.');
  const seen = new Set<string>();
  for (const receipt of batch.concepts) {
    const { id, version } = receipt.concept;
    if (
      seen.has(id) ||
      !['candidate', 'reviewed'].includes(receipt.decision) ||
      !receipt.reason.trim() ||
      (receipt.decision === 'reviewed' && receipt.flags.length) ||
      (receipt.decision === 'candidate' && !receipt.flags.length)
    )
      throw new Error(`Decisión editorial inválida: ${id}`);
    seen.add(id);
    if (
      source.concepts.find((c) => c.id === id)?.version !== version ||
      JSON.stringify(reviewReferences(source, id)) !==
        JSON.stringify(receipt.entities) ||
      reviewFingerprint(source, id) !== receipt.fingerprint
    )
      throw new Error(`Revisión obsoleta o incompleta: ${id}`);
  }
  const pack = structuredClone(source);
  const approved = new Set(
    batch.concepts
      .filter((r) => r.decision === 'reviewed')
      .map((r) => r.concept.id),
  );
  const approvedEntities = new Set(
    batch.concepts
      .filter((r) => approved.has(r.concept.id))
      .flatMap((r) => r.entities.map((e) => `${e.kind}:${e.id}`)),
  );
  const apply = <T extends Editorial & Reference>(kind: string, item: T): T => {
    if (!approvedEntities.has(`${kind}:${item.id}`)) return item;
    // A shared dependency can already have a valid review from an earlier batch.
    // The complete inventory and content fingerprint were checked above.
    if (item.status === 'reviewed') {
      if (editorialErrors(item).length)
        throw new Error(`Revisión inválida: ${item.id}`);
      return item;
    }
    return reviewContent(item, batch.reviewer, batch.date);
  };
  pack.concepts = pack.concepts.map((c) => apply('concept', c));
  pack.theories = Object.fromEntries(
    Object.entries(pack.theories).map(([id, t]) => [id, apply('theory', t)]),
  );
  pack.canonicalActivities = pack.canonicalActivities.map((a) =>
    apply('activity', a),
  );
  pack.vocabulary = pack.vocabulary.map((v) => apply('vocabulary', v));
  pack.templates = pack.templates.map((t) => apply('template', t));
  return pack;
}
