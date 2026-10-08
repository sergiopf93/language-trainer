import type { LanguagePack } from './model';
import { validatePack } from './validate';
import { instantiate, templateSources } from './templates';
export function curriculumCoverage(pack: LanguagePack) {
  const errors = validatePack(pack);
  const replaced = new Set(pack.templates.flatMap(templateSources));
  const activities = pack.canonicalActivities.filter(
    (a) => !replaced.has(a.id),
  );
  for (const t of pack.templates)
    for (const v of t.variants) {
      try {
        activities.push(instantiate(pack, t.id, v.key));
      } catch {
        /* Validation errors remain visible in the report. */
      }
    }
  const units = pack.curriculum.levels.flatMap((level) =>
    level.units.map((unit) => ({
      sourceId: unit.sourceId,
      topicId: unit.topicId,
      title: unit.title,
      level: level.cefr,
      concepts: unit.expectedConceptIds.map((id) => {
        const concept = pack.concepts.find((c) => c.id === id);
        const theory = pack.theories[id];
        const items = activities.filter((a) => a.conceptId === id);
        const vocabulary = pack.vocabulary.filter(
          (v) =>
            v.conceptIds.includes(id) || theory?.vocabularyIds.includes(v.id),
        );
        const checks = {
          concept: !!concept,
          theory: !!theory?.introduction.trim(),
          rules: !!theory?.rules.some((rule) => !!rule.trim()),
          examples: !!theory?.examples.length,
          exercises: items.length > 0,
          vocabulary: vocabulary.length > 0,
          fullScope: concept?.coverage === 'complete',
          published: concept?.status === 'published',
        };
        return {
          id,
          ...checks,
          activityCount: items.length,
          families: [...new Set(items.map((a) => a.family))],
          skills: [
            ...new Set(items.flatMap((a) => (a.task ? [a.task.skill] : []))),
          ],
          dimensions: [...new Set(items.map((a) => a.dimension))],
          facets: [...new Set(items.flatMap((a) => a.task?.facets ?? []))],
          vocabularyIds: vocabulary.map((v) => v.id),
          editorialStatus: concept?.status ?? 'missing',
          scope: concept?.scope ?? null,
          exclusions: concept?.exclusions ?? null,
          missing: Object.entries(checks)
            .filter(([, present]) => !present)
            .map(([key]) => key),
          productionReady:
            errors.length === 0 &&
            Object.values(checks).every(Boolean) &&
            theory?.status === 'published' &&
            items.every((a) => a.status === 'published') &&
            vocabulary.every((v) => v.status === 'published'),
        };
      }),
    })),
  );
  const concepts = units.flatMap((u) => u.concepts);
  return {
    packId: pack.id,
    packVersion: pack.version,
    curriculumId: pack.curriculum.id,
    errors,
    totals: {
      units: units.length,
      expectedConcepts: concepts.length,
      existingConcepts: concepts.filter((c) => c.concept).length,
      productionReady: concepts.filter((c) => c.productionReady).length,
    },
    units,
  };
}
