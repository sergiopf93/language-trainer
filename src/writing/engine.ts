import type { Activity } from '../../shared/learning';
import { canonical, type Fact } from '../../shared/protocol';
import type { ContentRepository } from '../content/catalog';
import { mixedPrerequisites } from '../mixed/engine';
import { reviewPlans } from '../review/engine';
import { writingCorpus } from './corpus';
import { controlledWriting } from './controlled';
import { writingReceipts } from './receipts';
export interface WritingOption {
  id: string;
  version: string;
  title: string;
  level: 1 | 2 | 3 | 4;
  context: string;
  objectives: string[];
  requiredConcepts: string[];
  alternativeConceptId: string;
  activity: Activity;
}
export function writingFingerprint(value: unknown): string {
  const serialized = canonical(value);
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < serialized.length; i++) {
    hash ^= BigInt(serialized.charCodeAt(i));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
}
export function hasWritingReceipt(value: {
  id: string;
  version: string;
}): boolean {
  return writingReceipts.some(
    (r) =>
      r.id === value.id &&
      r.version === value.version &&
      r.fingerprint === writingFingerprint(value) &&
      r.decision === 'reviewed' &&
      r.flags.length === 0,
  );
}
export function writingOptions(catalog: ContentRepository): WritingOption[] {
  const reused = catalog.available().flatMap((c) => {
    const own = catalog
      .select(c.id)
      .filter((a) => a.status === 'reviewed' && !a.options.length);
    return ['retrieval', 'transformation', 'controlled-production'].flatMap(
      (skill) => {
        const activity = own.find((a) => a.task?.skill === skill);
        return activity
          ? [
              {
                id: activity.id,
                version: activity.version,
                title: c.title,
                level: (skill === 'retrieval' ? 1 : 2) as 1 | 2,
                context: activity.task!.context,
                objectives: [c.objective],
                requiredConcepts: [c.id],
                alternativeConceptId: c.id,
                activity,
              },
            ]
          : [];
      },
    );
  });
  const controlled: WritingOption[] = controlledWriting
    .filter(hasWritingReceipt)
    .filter(() => catalog.allowCandidates)
    .map((a) => ({
      id: a.id,
      version: a.version,
      title: 'Presentarsi con essere',
      level: 2,
      context: a.task!.context,
      objectives: ['Presentare nome e nazionalità con essere.'],
      requiredConcepts: [a.conceptId, 'it-a1-c04-03'],
      alternativeConceptId: a.conceptId,
      activity: { ...a, status: 'reviewed' },
    }));
  const open: WritingOption[] = writingCorpus
    .filter(hasWritingReceipt)
    .filter(() => catalog.allowCandidates)
    .map((t) => ({
      ...t,
      activity: {
        id: t.id,
        version: t.version,
        family: 'F6',
        format: 'composition',
        conceptId: 'writing:' + t.id,
        conceptVersion: t.version,
        dimension: 'contextual-use',
        prompt: t.context + '\n' + t.prompt,
        options: [],
        hint:
          t.help + '\nEsempio (non è l’unica risposta possibile): ' + t.model,
        explanation: t.abstention + ' ' + t.feedback,
        criterion: {
          version: t.version,
          canonVersion: t.version,
          accepted: [t.model],
          rejected: [],
          exhaustive: false,
        },
        writing: {
          policy: 'open',
          rubric: t.rubric,
          model: t.model,
          incomplete: [],
          offTask: [],
          noTarget: [],
        },
        task: {
          skill: 'communicative-production',
          context: t.context,
          facets: [t.kind],
          opportunityId: t.id + ':message',
          scaffolding: 'none',
          matchingPrompts: [],
        },
        status: 'reviewed',
        provenance: 'Writing A1 · original composition · independent receipt',
        trace: {
          kind: 'canonical',
          packId: catalog.packId,
          packVersion: catalog.version,
          curriculumId: 'it-a1-writing',
          curriculumVersion: '1',
          sourceId: t.id,
          sourceVersion: t.version,
        },
      },
    }));
  return [...reused, ...controlled, ...open];
}
export function writingPreparation(
  option: WritingOption,
  catalog: ContentRepository,
  facts: readonly Fact[],
  preparedConcepts?: ReadonlySet<string>,
) {
  const introduced =
    preparedConcepts ??
    new Set(reviewPlans(catalog, facts, new Date()).map((p) => p.conceptId));
  return [
    ...new Set(
      option.requiredConcepts.flatMap((id) => [
        id,
        ...mixedPrerequisites(catalog, id),
      ]),
    ),
  ].filter((id) => !catalog.concept(id) || !introduced.has(id));
}
