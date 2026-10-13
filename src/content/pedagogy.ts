import type { LanguagePack } from './model';
import type { Activity, Skill } from '../../shared/learning';
import { curriculumCoverage } from './coverage';
import { normalize } from '../exercises/evaluate';

const skills: Skill[] = [
  'recognition',
  'retrieval',
  'discrimination',
  'transformation',
  'controlled-production',
];
const countSkills = (items: Activity[]) =>
  Object.fromEntries(
    skills.map((s) => [s, items.filter((a) => a.task?.skill === s).length]),
  );
const words = (value: string) =>
  normalize(value).match(/[\p{L}\p{N}]+/gu) ?? [];
function contains(text: string, phrase: string) {
  const source = ' ' + words(text).join(' ') + ' ';
  const target = words(phrase).join(' ');
  return !!target && source.includes(' ' + target + ' ');
}
function repeated(items: Activity[], key: (a: Activity) => string) {
  const groups = new Map<string, string[]>();
  for (const item of items) {
    const value = key(item);
    groups.set(value, [...(groups.get(value) ?? []), item.id]);
  }
  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([value, activityIds]) => ({ value, activityIds }));
}
/** Inventory signals, never a sufficiency score or evidence of student learning. */
export function pedagogicalCoverage(pack: LanguagePack) {
  const structural = curriculumCoverage(pack);
  // Templates replace their canonical sources one-for-one; count each authored opportunity once.
  const items = pack.canonicalActivities;
  const duplicates = repeated(items, (a) => normalize(a.prompt));
  const supportedProduction = items.filter(
    (a) =>
      a.task?.skill === 'controlled-production' &&
      (a.options.length > 0 || a.prompt.includes(' + ')),
  );
  const visibleAnswer = items.filter(
    (a) =>
      a.task?.skill === 'retrieval' &&
      a.criterion.accepted.some((answer) => contains(a.prompt, answer)),
  );
  const concepts = structural.units.flatMap((unit) =>
    unit.concepts.map((c) => {
      const own = items.filter((a) => a.conceptId === c.id);
      const concept = pack.concepts.find((x) => x.id === c.id);
      const relations = pack.relations.filter(
        (r) => r.from === c.id || r.to === c.id,
      );
      const uncoveredFacets = (concept?.facets ?? []).filter(
        (f) => !own.some((a) => a.task?.facets.includes(f)),
      );
      const flags = [
        ...(own.length && own.length <= 7
          ? ['small-reserve: inspect facets, not an automatic failure']
          : []),
        ...(!own.some((a) => a.task?.skill === 'retrieval')
          ? ['no-explicit-retrieval: justify for this objective']
          : []),
        ...(new Set(own.map((a) => a.task?.skill)).size === 1
          ? ['single-skill']
          : []),
        ...(uncoveredFacets.length
          ? ['facet-label-without-item: labels may differ semantically']
          : []),
        ...(visibleAnswer.some((a) => a.conceptId === c.id)
          ? ['retrieval-answer-visible: inspect copying or incidental mention']
          : []),
        ...(supportedProduction.some((a) => a.conceptId === c.id)
          ? ['production-with-supplied-parts: not autonomous writing']
          : []),
        ...(duplicates.some((g) =>
          own.some((a) => g.activityIds.includes(a.id)),
        )
          ? ['duplicate-prompt']
          : []),
        ...(!relations.length ? ['no-relations'] : []),
      ];
      return {
        id: c.id,
        title: concept?.title,
        activities: own.length,
        skills: countSkills(own),
        families: c.families,
        theory: c.theory,
        relations,
        vocabularyIds: c.vocabularyIds,
        contexts: [...new Set(own.map((a) => a.task?.context))],
        uncoveredFacets,
        flags,
      };
    }),
  );
  const vocabulary = pack.vocabulary.map((entry) => {
    const forms = [
      ...new Set([
        entry.lemma,
        entry.displayForm,
        ...entry.forms.map((f) => f.text),
      ]),
    ];
    // Surface mention only, includes mixed-language prompts/options. No lemmatization, mastery or target attribution.
    const hits = items.filter((a) =>
      forms.some((f) =>
        contains(
          [a.prompt, ...a.options, ...a.criterion.accepted].join(' '),
          f,
        ),
      ),
    );
    return {
      id: entry.id,
      lemma: entry.lemma,
      associatedConcepts: entry.conceptIds,
      surfaceActivityIds: hits.map((a) => a.id),
      surfaceConcepts: [...new Set(hits.map((a) => a.conceptId))],
      flags: [
        ...(!entry.conceptIds.length ? ['orphan-association'] : []),
        ...(!hits.length
          ? [
              'no-surface-practice-match: inflections or split phrases may be missed',
            ]
          : []),
        ...(hits.length && new Set(hits.map((a) => a.conceptId)).size === 1
          ? ['surface-mentions-in-one-concept']
          : []),
      ],
    };
  });
  const adjacency = new Map(
    pack.concepts.map((c) => [
      c.id,
      pack.relations
        .filter((r) => r.from === c.id && r.type === 'prerequisite')
        .map((r) => r.to),
    ]),
  );
  const cycles: string[][] = [];
  const done = new Set<string>();
  const visit = (id: string, path: string[]) => {
    if (path.includes(id)) {
      cycles.push([...path.slice(path.indexOf(id)), id]);
      return;
    }
    if (done.has(id)) return;
    for (const target of adjacency.get(id) ?? []) visit(target, [...path, id]);
    done.add(id);
  };
  for (const id of adjacency.keys()) visit(id, []);
  const relationKeys = pack.relations.map((r) => `${r.from}/${r.type}/${r.to}`);
  return {
    packVersion: pack.version,
    limitations: [
      'Flags are review signals, not automatic pedagogical verdicts.',
      'Vocabulary surface matches include prompts, options and accepted answers; they do not prove retrieval, sense coverage or reuse.',
      'No reserved delayed opportunities or oral skills are certified.',
    ],
    structuralErrors: structural.errors,
    totals: {
      concepts: concepts.length,
      activities: items.length,
      theories: Object.keys(pack.theories).length,
      vocabulary: pack.vocabulary.length,
      relations: pack.relations.length,
      productionReady: structural.totals.productionReady,
      skills: countSkills(items),
    },
    stages: [
      [1, 10],
      [11, 17],
      [18, 25],
      [26, 32],
      [33, 34],
    ].map(([start, end]) => {
      const selected = items.filter((a) => {
        const n = Number(a.conceptId.slice(7, 9));
        return n >= start && n <= end;
      });
      return {
        stage: `C${start}–C${end}`,
        activities: selected.length,
        skills: countSkills(selected),
      };
    }),
    concepts,
    vocabulary,
    duplicates,
    repeatedAnswersWithinConcept: repeated(
      items,
      (a) => `${a.conceptId}/${normalize(a.criterion.accepted[0] ?? '')}`,
    ),
    visibleRetrievalAnswerIds: visibleAnswer.map((a) => a.id),
    supportedProductionIds: supportedProduction.map((a) => a.id),
    graph: {
      prerequisiteCycles: cycles,
      duplicateRelations: relationKeys.filter(
        (k, i) => relationKeys.indexOf(k) !== i,
      ),
      forwardPrerequisites: pack.relations.filter(
        (r) => r.type === 'prerequisite' && r.to > r.from,
      ),
    },
    answerConflicts: items.flatMap((a) =>
      a.criterion.accepted
        .filter((answer) =>
          [...a.criterion.rejected, ...(a.criterion.typos ?? [])].some(
            (x) => normalize(x) === normalize(answer),
          ),
        )
        .map((answer) => ({ activityId: a.id, answer })),
    ),
    typoDeclarations: items
      .filter((a) => a.criterion.typos?.length)
      .map((a) => ({
        activityId: a.id,
        accepted: a.criterion.accepted,
        rejected: a.criterion.rejected,
        typos: a.criterion.typos,
      })),
  };
}
