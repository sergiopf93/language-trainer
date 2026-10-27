import 'fake-indexeddb/auto';
import { describe, it, expect } from 'vitest';
import { italianCourse } from '../src/content/italian-a1/course';
import { loadLanguagePack } from '../src/content/loader';
import {
  buildSearchIndex,
  createSearchView,
  searchLibrary,
} from '../src/library/search';
import { normalize } from '../src/library/taxonomy';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { mixedGroups } from '../src/mixed/manifest';
import { mixedGroupPrerequisites } from '../src/mixed/engine';
import { writingOptions, writingPreparation } from '../src/writing/engine';
import { reviewedReadings, readingEligibility } from '../src/reading/engine';
import { reviewPlans } from '../src/review/engine';
const catalog = loadLanguagePack(italianCourse, true).repository;
const entries = buildSearchIndex(italianCourse, catalog);
const view = createSearchView(entries, catalog, []);
const search = (q: string) => searchLibrary(view.results, { q });
describe('local library discovery', () => {
  it('indexes the available curriculum and all real practice types', () => {
    expect(entries.filter((e) => e.type === 'concept')).toHaveLength(99);
    expect(new Set(entries.map((e) => e.type))).toEqual(
      new Set(['concept', 'vocabulary', 'mixed', 'reading', 'writing']),
    );
    expect(
      entries.every((e) =>
        e.primary.concat(e.related).every((id) => catalog.concept(id)),
      ),
    ).toBe(true);
  });
  it('normalizes case and accents, supports partial forms and bilingual aliases', () => {
    expect(search('ARTÍCULOS')).toEqual(search('articulos'));
    for (const q of [
      'esser',
      'avere',
      'articoli',
      'preposiciones',
      'preposizioni',
      'conjugaciones',
      'restaurante',
      'ristorante',
      'escritura',
      'scrittura',
    ])
      expect(search(q).length, q).toBeGreaterThan(0);
    expect(new Set(search('writing').map((r) => r.entry.id))).toEqual(
      new Set(search('escritura').map((r) => r.entry.id)),
    );
    expect(normalize(' ÁÈÌÒÙ ')).toBe('aeiou');
  });
  it('ranks the exact verb above incidental vocabulary associations', () => {
    const results = search('essere');
    expect(results[0].entry.type).toBe('vocabulary');
    expect(results[0].entry.title).toBe('essere');
    const primary = results.findIndex((r) =>
      r.entry.primary.includes('it-a1-c04-01'),
    );
    const secondary = results.findIndex((r) => r.score === 10);
    expect(primary).toBeGreaterThanOrEqual(0);
    expect(secondary).toBeGreaterThan(primary);
  });
  it('combines all filters and returns empty results without fallback', () => {
    const result = searchLibrary(view.results, {
      q: 'essere',
      type: 'writing',
      category: 'verb',
      state: 'new',
    });
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (r) =>
          r.entry.type === 'writing' &&
          r.entry.categories.includes('verb') &&
          r.state === 'new',
      ),
    ).toBe(true);
    expect(
      searchLibrary(view.results, { type: 'vocabulary', category: 'nominal' })
        .length,
    ).toBeGreaterThan(0);
    const themed = searchLibrary(view.results, {
      theme: 'restaurant',
      type: 'writing',
    });
    expect(themed.length).toBeGreaterThan(0);
    expect(themed.every((r) => r.entry.themes.includes('restaurant'))).toBe(
      true,
    );
    expect(searchLibrary(view.results, { q: 'zzzznothing' })).toEqual([]);
    expect(searchLibrary(view.results, { type: 'unknown' })).toEqual([]);
  });
  it('never treats prompt mentions as a Writing grammar objective', () => {
    const candidates = searchLibrary(view.results, {
      q: 'essere',
      type: 'writing',
    });
    expect(candidates.length).toBeGreaterThan(0);
    expect(
      candidates.some((r) => r.entry.sourceId === 'it-a1-c01-02-essere'),
    ).toBe(false);
    for (const { entry } of candidates) {
      expect(
        [...entry.primary, ...entry.related].some(
          (id) =>
            id.startsWith('it-a1-c04-') ||
            id.startsWith('it-a1-c33-') ||
            /essere/i.test(
              (italianCourse.theories[id]?.title ?? '') +
                ' ' +
                (catalog.concept(id)?.title ?? ''),
            ),
        ),
        entry.id + ' ' + entry.main + ' / ' + entry.secondary,
      ).toBe(true);
    }
    const open = entries.filter(
      (e) => e.type === 'writing' && e.primary.length === 0,
    );
    expect(open.length).toBeGreaterThan(0);
    expect(open.every((e) => e.related.length > 0)).toBe(true);
  });
  it('excludes every unpublished item from the production catalog', () => {
    expect(
      buildSearchIndex(
        italianCourse,
        loadLanguagePack(italianCourse, false).repository,
      ),
    ).toEqual([]);
  });
  it('searching never writes facts; states and prerequisites follow existing engines', async () => {
    const store = await LocalStore.open(crypto.randomUUID());
    try {
      const engine = new SessionEngine(store, catalog);
      const group = mixedGroups[0];
      const mixedEntry = entries.find((e) => e.id === 'mixed:' + group.id)!;
      expect(view.results.find((r) => r.entry === mixedEntry)?.eligible).toBe(
        false,
      );
      for (const id of mixedGroupPrerequisites(catalog, group))
        await engine.study(id, italianCourse.theories[id].version);
      const facts = await store.allFacts();
      const after = createSearchView(entries, catalog, facts);
      expect(after.results.find((r) => r.entry === mixedEntry)?.eligible).toBe(
        true,
      );
      expect(
        after.results.find(
          (r) => r.entry.id === 'concept:' + group.conceptIds[0],
        )?.state,
      ).toBe('started');
      const later = createSearchView(
        entries,
        catalog,
        facts,
        new Date(Date.now() + 48 * 60 * 60 * 1000),
      );
      expect(
        later.results.find(
          (r) => r.entry.id === 'concept:' + group.conceptIds[0],
        )?.state,
      ).toBe('review');
      const prepared = new Set(
        reviewPlans(catalog, facts, new Date()).map((p) => p.conceptId),
      );
      for (const option of writingOptions(catalog).slice(0, 8))
        expect(writingPreparation(option, catalog, facts, prepared)).toEqual(
          writingPreparation(option, catalog, facts),
        );
      for (const text of reviewedReadings().slice(0, 3))
        expect(
          readingEligibility(text, catalog, facts, undefined, prepared),
        ).toEqual(readingEligibility(text, catalog, facts));
      searchLibrary(after.results, { q: 'essere', type: 'writing' }).forEach(
        (r) => after.ready(r.entry),
      );
      expect(await store.allFacts()).toEqual(facts);
    } finally {
      store.close();
    }
  });
});
