import { isRelease } from '../release';
import type { Activity } from '../../shared/learning';
import type { Fact } from '../../shared/protocol';
import type { ContentRepository } from '../content/catalog';
import { mixedPrerequisites } from '../mixed/engine';
import { reviewPlans } from '../review/engine';
import { readingCorpus, type ReadingText } from './corpus';
import { readingReceipts } from './receipts';

// Same deterministic change detector as the existing editorial receipts, not a signature.
export function readingFingerprint(text: ReadingText): string {
  const clean = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(clean)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.entries(v)
              .filter(([k]) => k !== 'status')
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([k, x]) => [k, clean(x)]),
          )
        : v;
  const snapshot = JSON.stringify(clean(text));
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < snapshot.length; i++) {
    hash ^= BigInt(snapshot.charCodeAt(i));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
}
export function reviewedReadings(): ReadingText[] {
  return readingCorpus.flatMap((text) => {
    const receipt = readingReceipts.find(
      (r) => r.id === text.id && r.version === text.version,
    );
    return receipt &&
      receipt.decision === 'reviewed' &&
      receipt.fingerprint === readingFingerprint(text) &&
      receipt.flags.length === 0
      ? [
          {
            ...text,
            status: isRelease ? ('published' as const) : ('reviewed' as const),
          },
        ]
      : [];
  });
}
export function readingEligibility(
  text: ReadingText,
  catalog: ContentRepository,
  facts: readonly Fact[],
  corpus = readingCorpus,
  preparedConcepts?: ReadonlySet<string>,
) {
  const introduced =
    preparedConcepts ??
    new Set(reviewPlans(catalog, facts, new Date()).map((p) => p.conceptId));
  const required = [
    ...new Set(
      text.requiredConcepts.flatMap((id) => [
        id,
        ...mixedPrerequisites(catalog, id),
      ]),
    ),
  ];
  const missingConcepts = required.filter(
    (id) => !catalog.concept(id) || !introduced.has(id),
  );
  const missingReadings = text.dependencies.filter((id) => {
    const previous = corpus.find((t) => t.id === id);
    return (
      !previous ||
      !facts.some((f) => {
        if (
          f.kind !== 'practice-state' ||
          f.payload.state.status !== 'completed'
        )
          return false;
        return facts.some(
          (r) =>
            r.kind === 'practice-session' &&
            r.id === f.payload.sessionId &&
            r.payload.mode === 'reading' &&
            r.payload.reading?.id === id &&
            r.payload.reading?.version === previous.version &&
            f.payload.state.index === r.payload.activities.length &&
            catalog.allowed(r.payload.contentStatus),
        );
      })
    );
  });
  return {
    missingConcepts,
    missingReadings,
    eligible: !missingConcepts.length && !missingReadings.length,
  };
}
export function eligibleReading(
  text: ReadingText,
  catalog: ContentRepository,
  facts: readonly Fact[],
) {
  return (
    catalog.allowed(text.status) &&
    ['reviewed', 'published'].includes(text.status) &&
    reviewedReadings().some(
      (t) =>
        t.id === text.id &&
        t.version === text.version &&
        t.status === text.status &&
        readingFingerprint(t) === readingFingerprint(text),
    ) &&
    readingEligibility(text, catalog, facts).eligible
  );
}
export function readingActivities(
  text: ReadingText,
  catalog: ContentRepository,
): Activity[] {
  return text.questions.map((q) => ({
    id: `${text.id}:${q.id}`,
    version: text.version,
    family: 'F5',
    format: q.options.length ? 'selection' : 'short',
    conceptId: `reading:${text.id}`,
    conceptVersion: text.version,
    dimension: 'reading-comprehension',
    prompt: q.prompt,
    options: q.options,
    hint: text.help,
    explanation: q.explanation,
    status: text.status,
    provenance: 'Reading A1 · authored corpus · independent editorial receipt',
    task: {
      skill: 'reading-comprehension',
      context: text.genre,
      facets: [q.kind],
      opportunityId: `${text.id}:${q.id}:meaning`,
      scaffolding: q.options.length ? 'visible-options' : 'none',
      matchingPrompts: [],
    },
    criterion: {
      version: text.version,
      canonVersion: text.version,
      accepted: q.accepted,
      rejected: q.rejected,
      exhaustive: q.exhaustive,
    },
    trace: {
      kind: 'canonical',
      packId: catalog.packId,
      packVersion: catalog.version,
      curriculumId: 'it-a1-reading',
      curriculumVersion: '1',
      sourceId: text.id,
      sourceVersion: text.version,
    },
  }));
}
