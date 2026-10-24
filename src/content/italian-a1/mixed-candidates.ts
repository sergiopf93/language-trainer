import type { LanguagePack } from '../model';
import { materialize, type Lesson } from './authoring';
import { mixedItems } from './mixed-items';

// Extend the reviewed bank without altering any existing entity or receipt.
export function appendMixedCandidates(
  source: LanguagePack,
  lessons: Lesson[],
): LanguagePack {
  const additions = mixedItems.map(({ code, ...item }) => {
    const lesson = lessons.find((l) => l.code === code);
    if (!lesson) throw new Error(`Unknown mixed concept: ${code}`);
    const activity = materialize({ ...lesson, items: [item] }).activities[0];
    return {
      ...activity,
      provenance:
        'R2 phase 6B.2: original candidate; independent review recorded separately. ' +
        lesson.source,
      trace: {
        kind: 'canonical' as const,
        packId: source.id,
        packVersion: source.version,
        curriculumId: source.curriculum.id,
        curriculumVersion: source.curriculum.version,
        sourceId: activity.id,
        sourceVersion: activity.version,
      },
    };
  });
  return {
    ...source,
    canonicalActivities: [...source.canonicalActivities, ...additions],
  };
}
