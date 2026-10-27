import type { Fact } from '../../shared/protocol';
import type { ContentRepository } from '../content/catalog';
import type { LanguagePack } from '../content/model';
import { mixedGroups } from '../mixed/manifest';
import {
  eligibleMixedActivities,
  mixedPlans,
  mixedGroupPrerequisites,
} from '../mixed/engine';
import { reviewPlans } from '../review/engine';
import { reviewedReadings, readingEligibility } from '../reading/engine';
import { writingOptions, writingPreparation } from '../writing/engine';
import {
  categories,
  themes,
  practiceTypes,
  practiceAliases,
  normalize,
  themeIds,
  learningStates,
} from './taxonomy';
export type PracticeType = keyof typeof practiceTypes;
export type LearningState = keyof typeof learningStates;
export interface SearchEntry {
  id: string;
  sourceId: string;
  version: string;
  type: PracticeType;
  title: string;
  description: string;
  primary: string[];
  related: string[];
  blocks: string[];
  categories: string[];
  themes: string[];
  exact: string[];
  main: string;
  secondary: string;
  href: string;
  preparation?: (
    facts: readonly Fact[],
    introduced: ReadonlySet<string>,
  ) => boolean;
}
export interface SearchFilter {
  q?: string;
  type?: string;
  category?: string;
  theme?: string;
  state?: string;
  concept?: string;
}
export interface SearchResult {
  entry: SearchEntry;
  state: LearningState;
  eligible: boolean;
  score: number;
}
export function buildSearchIndex(
  pack: LanguagePack,
  catalog: ContentRepository,
): SearchEntry[] {
  const concepts = catalog.available();
  const ids = new Set(concepts.map((c) => c.id));
  const units = pack.curriculum.levels.flatMap((l) => l.units);
  const titles = (values: string[]) =>
    values.flatMap((id) => {
      const c = catalog.concept(id);
      const t = pack.theories[id];
      return c
        ? [c.title, ...(t && catalog.allowed(t.status) ? [t.title] : [])]
        : [];
    });
  const vocab = pack.vocabulary.filter((v) => catalog.allowed(v.status));
  const blockIds = (values: string[]) =>
    units
      .filter((u) => u.expectedConceptIds.some((id) => values.includes(id)))
      .map((u) => u.sourceId);
  const entries: SearchEntry[] = [];
  const add = (
    value: Omit<
      SearchEntry,
      'blocks' | 'categories' | 'exact' | 'main' | 'secondary'
    > & { extra?: string[]; secondary?: string[]; categoryIds?: string[] },
  ) => {
    const primary = value.primary.filter((id) => ids.has(id));
    const related = [...new Set(value.related)].filter(
      (id) => ids.has(id) && !primary.includes(id),
    );
    const blocks = blockIds([...primary, ...related]);
    const categoryIds =
      value.categoryIds ??
      categories
        .filter((c) =>
          blockIds(primary.length ? primary : related).some((b) =>
            c.units.includes(b),
          ),
        )
        .map((c) => c.id);
    const labels = categoryIds.flatMap((id) => {
      const c = categories.find((c) => c.id === id)!;
      return [c.label, ...c.aliases];
    });
    const topicLabels = value.themes.flatMap((id) => {
      const t = themes.find((t) => t.id === id)!;
      return [t.label, ...t.aliases];
    });
    const exact = [value.title, ...titles(primary), ...(value.extra ?? [])].map(
      normalize,
    );
    entries.push({
      ...value,
      primary,
      related,
      blocks,
      categories: categoryIds,
      exact,
      main: normalize(
        [
          ...exact,
          ...units
            .filter((u) =>
              u.expectedConceptIds.some((id) => primary.includes(id)),
            )
            .map((u) => u.title),
          ...blocks,
          ...(value.type === 'concept' || value.type === 'vocabulary'
            ? [value.description]
            : []),
          ...labels,
          ...topicLabels,
          practiceTypes[value.type],
          ...practiceAliases[value.type],
        ].join(' '),
      ),
      secondary: normalize(
        [
          ...titles(related),
          ...units
            .filter((u) =>
              u.expectedConceptIds.some((id) => related.includes(id)),
            )
            .map((u) => u.title),
          ...(value.secondary ?? []),
        ].join(' '),
      ),
    });
  };
  for (const c of concepts) {
    const t = pack.theories[c.id];
    const theory = t && catalog.allowed(t.status) ? t : undefined;
    const own = catalog.select(c.id);
    const vocabulary = vocab.filter((v) => v.conceptIds.includes(c.id));
    add({
      id: 'concept:' + c.id,
      sourceId: c.id,
      version: c.version,
      type: 'concept',
      title: theory?.title ?? c.title,
      description: theory?.goal ?? c.objective,
      primary: [c.id],
      related: catalog
        .connections(c.id)
        .map((r) => (r.from === c.id ? r.to : r.from)),
      themes: themeIds(own.flatMap((a) => (a.task ? [a.task.context] : []))),
      href: '/concept?id=' + c.id,
      extra: [c.title],
      secondary: vocabulary.flatMap((v) => [
        v.lemma,
        v.gloss,
        ...v.forms.map((f) => f.text),
      ]),
    });
  }
  for (const v of vocab) {
    const related = v.conceptIds.filter((id) => ids.has(id));
    if (!related.length) continue;
    add({
      id: 'vocabulary:' + v.id,
      sourceId: v.id,
      version: v.version,
      type: 'vocabulary',
      title: v.lemma,
      description: v.gloss,
      primary: [],
      related,
      themes: themeIds(v.tags),
      extra: [v.displayForm, v.gloss, ...v.forms.map((f) => f.text)],
      categoryIds: [
        categories.some((c) => c.id === v.partOfSpeech)
          ? v.partOfSpeech
          : ['noun', 'adjective', 'proper-noun'].includes(v.partOfSpeech)
            ? 'nominal'
            : 'vocabulary',
      ],
      href: '/library?type=concept&concept=' + encodeURIComponent(related[0]),
    });
  }
  for (const group of mixedGroups) {
    if (!group.conceptIds.every((id) => ids.has(id))) continue;
    const activities = eligibleMixedActivities(catalog, group);
    if (
      !group.conceptIds.every(
        (id) => activities.filter((a) => a.conceptId === id).length >= 2,
      ) ||
      new Set(activities.map((a) => a.status)).size !== 1
    )
      continue;
    add({
      id: 'mixed:' + group.id,
      sourceId: group.id,
      version: 'mixed-v1',
      type: 'mixed',
      title:
        'Mixed · ' +
        titles(group.conceptIds)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(' / '),
      description: 'Contrastar objetivos ya introducidos.',
      primary: group.conceptIds,
      related: mixedGroupPrerequisites(catalog, group),
      themes: themeIds(
        activities.flatMap((a) => (a.task ? [a.task.context] : [])),
      ),
      href: '/practice?mixed=' + encodeURIComponent(group.id),
    });
  }
  for (const text of reviewedReadings().filter((t) =>
    catalog.allowed(t.status),
  )) {
    add({
      id: 'reading:' + text.id,
      sourceId: text.id,
      version: text.version,
      type: 'reading',
      title: text.title,
      description: text.objectives.join(' · '),
      primary: [],
      related: [...text.requiredConcepts, ...text.presentConcepts],
      themes: themeIds([text.genre, ...text.objectives]),
      href: '/practice?reading=' + text.id,
      preparation: (facts, introduced) =>
        readingEligibility(text, catalog, facts, undefined, introduced)
          .eligible,
    });
  }
  for (const option of writingOptions(catalog)) {
    const a = option.activity;
    const open = a.family === 'F6';
    add({
      id: 'writing:' + option.id,
      sourceId: option.id,
      version: option.version,
      type: 'writing',
      title: option.title,
      description: open ? option.context : a.prompt,
      primary: open ? [] : [a.conceptId],
      related: option.requiredConcepts,
      themes: themeIds([a.task?.context ?? option.context]),
      href: '/practice?writing=' + encodeURIComponent(option.id),
      preparation: (facts, introduced) =>
        writingPreparation(option, catalog, facts, introduced).length === 0,
    });
  }
  return entries;
}
export function createSearchView(
  entries: SearchEntry[],
  catalog: ContentRepository,
  facts: readonly Fact[],
  now = new Date(),
) {
  const reviews = new Map(
    reviewPlans(catalog, facts, now).map((p) => [p.conceptId, p]),
  );
  const introduced = new Set(reviews.keys());
  const mixed = new Set(mixedPlans(catalog, facts, now).map((p) => p.groupId));
  const roots = facts.filter(
    (f): f is Extract<Fact, { kind: 'practice-session' }> =>
      f.kind === 'practice-session' &&
      f.payload.packId === catalog.packId &&
      catalog.allowed(f.payload.contentStatus),
  );
  const conceptState = (ids: string[]): LearningState =>
    ids.some((id) => {
      const p = reviews.get(id);
      return p && (p.due || p.priority <= 2);
    })
      ? 'review'
      : ids.some(
            (id) =>
              introduced.has(id) ||
              roots.some((r) =>
                r.payload.activities.some(
                  (a) =>
                    a.conceptId === id &&
                    a.conceptVersion === catalog.concept(id)?.version,
                ),
              ),
          )
        ? 'started'
        : 'new';
  const results = entries.map((entry): SearchResult => {
    const hasSession = roots.some(
      (r) =>
        r.payload.mode === entry.type &&
        (entry.type === 'mixed'
          ? r.payload.mixed?.groupId === entry.sourceId
          : entry.type === 'reading'
            ? r.payload.reading?.id === entry.sourceId &&
              r.payload.reading.version === entry.version
            : entry.type === 'writing'
              ? r.payload.writing?.id === entry.sourceId &&
                r.payload.activities[0]?.version === entry.version
              : false),
    );
    return {
      entry,
      state:
        entry.type === 'concept'
          ? conceptState(entry.primary)
          : entry.type === 'vocabulary'
            ? conceptState(entry.related)
            : hasSession
              ? 'started'
              : 'new',
      eligible: entry.type === 'mixed' ? mixed.has(entry.sourceId) : true,
      score: 0,
    };
  });
  const readiness = new Map<string, boolean>();
  return {
    results,
    ready(entry: SearchEntry) {
      if (!readiness.has(entry.id))
        readiness.set(entry.id, entry.preparation?.(facts, introduced) ?? true);
      return readiness.get(entry.id)!;
    },
  };
}
export function searchLibrary(
  results: SearchResult[],
  filter: SearchFilter,
): SearchResult[] {
  const q = normalize(filter.q ?? '');
  const tokens = q.split(' ').filter(Boolean);
  return results
    .flatMap((result) => {
      const e = result.entry;
      if (
        (filter.type && e.type !== filter.type) ||
        (filter.category && !e.categories.includes(filter.category)) ||
        (filter.theme && !e.themes.includes(filter.theme)) ||
        (filter.state && result.state !== filter.state) ||
        (filter.concept &&
          ![...e.primary, ...e.related].includes(filter.concept))
      )
        return [];
      if (
        tokens.some(
          (token) => !e.main.includes(token) && !e.secondary.includes(token),
        )
      )
        return [];
      const score = !q
        ? 0
        : e.exact.includes(q)
          ? 100
          : normalize(e.title) === q
            ? 100
            : e.exact.some((v) => v.split(' ').includes(q))
              ? 80
              : e.exact.some((v) => v.includes(q))
                ? 60
                : tokens.every((t) => e.main.includes(t))
                  ? 30
                  : 10;
      return [{ ...result, score }];
    })
    .sort((a, b) => b.score - a.score);
}
