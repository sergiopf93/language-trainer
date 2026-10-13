import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import {
  italianPack,
  validationCatalog,
} from '../src/content/validation-fixture';
import { loadLanguagePack } from '../src/content/loader';
import { validatePack } from '../src/content/validate';
import { curriculumCoverage } from '../src/content/coverage';
import { instantiate } from '../src/content/templates';
import { publishContent, reviewContent } from '../src/content/editorial';
import { evaluate } from '../src/exercises/evaluate';
import { LocalStore } from '../src/persistence/local';
import { SessionEngine } from '../src/learning/session';
import { validFact, validLinks } from '../shared/protocol';
import type { LanguagePack } from '../src/content/model';
const concept = 'it-a1-c04-01';
const template = 'it-essere-present-cloze';
const clone = () => structuredClone(italianPack);

describe('content and curriculum engine', () => {
  it('loads the pack with an explicit expected inventory, structured theory and reusable vocabulary', () => {
    const { repository, theory } = loadLanguagePack(italianPack, true);
    expect(validatePack(italianPack)).toEqual([]);
    expect(repository.available()).toHaveLength(2);
    expect(italianPack.curriculum.levels[0].units).toHaveLength(34);
    expect(theory(concept)?.forms).toContainEqual([
      'noi siamo',
      'nosotros somos / estamos',
    ]);
    expect(theory(concept)?.vocabularyIds).toEqual(['it-essere']);
    expect(
      italianPack.vocabulary
        .find((v) => v.id === 'it-essere')
        ?.forms.find((f) => f.key === 'tu')?.text,
    ).toBe('sei');
    expect(theory(concept)?.supportLanguage).toBe('es');
  });
  it('navigates all relation kinds and does not gate practice by prerequisites', () => {
    const pack = clone();
    for (const type of ['related', 'contrast', 'reinforces'] as const)
      pack.relations.push({
        from: concept,
        to: 'it-a1-c03-01',
        type,
        reason: 'Test de contrato',
      });
    const { repository } = loadLanguagePack(pack, true);
    expect(repository.connections(concept, 'outgoing')).toHaveLength(4);
    expect(repository.connections('it-a1-c03-01', 'incoming')).toHaveLength(4);
    expect(repository.prerequisites(concept)[0].strength).toBe('recommended');
    expect(repository.select(concept)).toHaveLength(11);
    pack.relations.push({
      from: 'it-a1-c03-01',
      to: concept,
      type: 'prerequisite',
      strength: 'required',
      reason: 'cycle',
    });
    expect(validatePack(pack).join()).toContain('Ciclo');
  });
  it('instantiates only permitted variants deterministically, without changing canon', () => {
    const before = JSON.stringify(italianPack);
    const a = instantiate(italianPack, template, 'tu');
    expect(a).toEqual(instantiate(italianPack, template, 'tu'));
    expect(a.criterion.accepted).toEqual(['sei']);
    expect(evaluate(a, 'sei').judgment).toBe('correct');
    expect(evaluate(a, 'sono').judgment).toBe('linguistic-error');
    expect(a.trace).toMatchObject({
      kind: 'derived',
      templateId: template,
      templateVersion: '1',
      sourceId: 'it-a1-c04-01-sei',
      sourceVersion: '2',
      curriculumId: italianPack.curriculum.id,
      packVersion: italianPack.version,
    });
    a.criterion.accepted[0] = 'bad';
    expect(JSON.stringify(italianPack)).toBe(before);
    expect(() => instantiate(italianPack, template, 'invented')).toThrow();
    const pack = clone();
    pack.vocabulary.find((v) => v.id === 'it-essere')!.forms[1].text = 'sono';
    expect(() => instantiate(pack, template, 'tu')).toThrow(/Forma léxica/);
  });
  it('excludes candidates and reviewed content from production, including theory', () => {
    const loaded = loadLanguagePack(italianPack);
    expect(loaded.repository.available()).toEqual([]);
    expect(loaded.repository.select(concept)).toEqual([]);
    expect(loaded.theory(concept)).toBeUndefined();
    const pack = clone();
    pack.concepts[0] = reviewContent(
      pack.concepts[0],
      'Test reviewer',
      '2026-10-08',
    );
    expect(
      loadLanguagePack(pack, true).repository.concept(pack.concepts[0].id)
        ?.status,
    ).toBe('reviewed');
    expect(loadLanguagePack(pack).repository.available()).toEqual([]);
  });
  it('requires reviewed before published and invalidates review after version changes', () => {
    const candidate = clone().concepts[0];
    expect(() => publishContent(candidate, '2026-10-08')).toThrow();
    const reviewed = reviewContent(candidate, 'Test reviewer', '2026-10-08');
    expect(publishContent(reviewed, '2026-10-09').status).toBe('published');
    expect(() =>
      publishContent({ ...reviewed, version: 'new' }, '2026-10-09'),
    ).toThrow();
    expect(() => publishContent(reviewed, '2026-10-07')).toThrow();
    const pack = clone();
    pack.concepts[0].status = 'published';
    expect(() => loadLanguagePack(pack)).toThrow(/revisión/);
  });
  it.each<[string, (pack: LanguagePack) => void]>([
    [
      'missing concept',
      (p) => {
        p.canonicalActivities[0].conceptId = 'missing';
      },
    ],
    [
      'invalid prerequisite',
      (p) => {
        p.relations[0].to = 'missing';
      },
    ],
    [
      'duplicate IDs',
      (p) => {
        p.vocabulary.push(p.vocabulary[0]);
      },
    ],
    [
      'empty accepted answers',
      (p) => {
        p.canonicalActivities[0].criterion.accepted = [];
      },
    ],
    [
      'blank accepted answer',
      (p) => {
        p.canonicalActivities[0].criterion.accepted = [' '];
      },
    ],
    [
      'missing provenance',
      (p) => {
        p.canonicalActivities[0].provenance = '';
      },
    ],
    [
      'wrong template family',
      (p) => {
        p.templates[0].family = 'F7';
      },
    ],
    [
      'wrong source version',
      (p) => {
        p.templates[0].variants[0].source.version = 'missing';
      },
    ],
    [
      'missing vocabulary',
      (p) => {
        p.templates[0].variants[0].vocabulary[0].id = 'missing';
      },
    ],
    [
      'broken theory reference',
      (p) => {
        p.theories[concept].vocabularyIds = ['missing'];
      },
    ],
    [
      'wrong concept version',
      (p) => {
        p.theories[concept].conceptVersion = 'missing';
      },
    ],
    [
      'derived disguised as canon',
      (p) => {
        p.canonicalActivities[0] = instantiate(p, template, 'tu');
      },
    ],
  ])('rejects %s', (_label, mutate) => {
    const pack = clone();
    mutate(pack);
    expect(validatePack(pack).length).toBeGreaterThan(0);
    expect(() => loadLanguagePack(pack, true)).toThrow();
  });
  it('reports actual gaps for all 99 expected concepts without claiming full scope', () => {
    const report = curriculumCoverage(italianPack);
    expect(report.totals).toEqual({
      units: 34,
      expectedConcepts: 99,
      existingConcepts: 2,
      productionReady: 0,
    });
    const present = report.units[3].concepts[0];
    expect(present).toMatchObject({
      theory: true,
      rules: true,
      examples: true,
      exercises: true,
      vocabulary: true,
      activityCount: 11,
      editorialStatus: 'candidate',
      productionReady: false,
    });
    expect(present.missing).toEqual(['fullScope', 'published']);
    expect(report.units[0].concepts[0].missing).toContain('concept');
    expect(report.units[3].concepts[1].editorialStatus).toBe('missing');
    const pack = clone();
    delete pack.theories[concept];
    expect(curriculumCoverage(pack).units[3].concepts[0].missing).toContain(
      'theory',
    );
  });
});

it('runs the derived activity through Exercise → Evaluation → Evidence and backup with immutable trace', async () => {
  const store = await LocalStore.open(crypto.randomUUID());
  const target = await LocalStore.open(crypto.randomUUID());
  try {
    const engine = new SessionEngine(store, validationCatalog(true));
    let view = await engine.start(concept);
    view = await engine.submit(view);
    view = await engine.update(view, 'next');
    view = await engine.update(view, 'draft', 'sei');
    view = await engine.submit(view);
    const facts = await store.allFacts();
    const evidence = facts.find((f) => f.kind === 'evidence');
    expect(evidence?.kind).toBe('evidence');
    if (evidence?.kind !== 'evidence') throw new Error('Missing evidence');
    expect(evidence.payload).toMatchObject({
      judgment: 'correct',
      activityVersion: '2',
      provenance: italianPack.templates[0].provenance,
      trace: { kind: 'derived', templateId: template, sourceVersion: '2' },
    });
    expect(facts.every(validFact)).toBe(true);
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(validLinks(evidence, known)).toBe(true);
    const corrupted = structuredClone(evidence);
    corrupted.payload.trace!.sourceVersion = 'tampered';
    expect(validLinks(corrupted, known)).toBe(false);
    await target.importBackup(JSON.stringify(await store.exportBackup()));
    expect((await target.allFacts()).find((f) => f.id === evidence.id)).toEqual(
      evidence,
    );
  } finally {
    store.close();
    target.close();
  }
});

it('permits publication only with a fully reviewed dependency chain (synthetic editorial receipts)', () => {
  const pack = clone();
  const publish = <
    T extends import('../src/content/model').Editorial & { version: string },
  >(
    item: T,
  ): T =>
    publishContent(
      reviewContent(item, 'Test only', '2026-10-08'),
      '2026-10-09',
    );
  pack.concepts = pack.concepts.map(publish);
  pack.vocabulary = pack.vocabulary.map(publish);
  pack.templates = pack.templates.map(publish);
  pack.canonicalActivities = pack.canonicalActivities.map(publish);
  pack.theories = Object.fromEntries(
    Object.entries(pack.theories).map(([id, t]) => [id, publish(t)]),
  );
  const published = publish(pack);
  expect(validatePack(published)).toEqual([]);
  expect(loadLanguagePack(published).repository.available()).toHaveLength(2);
  expect(loadLanguagePack(published).repository.select(concept)).toHaveLength(
    11,
  );
  expect(curriculumCoverage(published).totals.productionReady).toBe(0); // Scope is still partial.
  published.vocabulary[0].status = 'candidate';
  expect(validatePack(published).join()).toContain('no publicado');
});

it('does not require the Italian pack identity in the loader or session engine', async () => {
  const pack = clone();
  pack.id = 'contract-test-pack';
  pack.topics.forEach((t) => {
    t.packId = pack.id;
  });
  pack.canonicalActivities.forEach((a) => {
    a.trace!.packId = pack.id;
  });
  const { repository } = loadLanguagePack(pack, true);
  const store = await LocalStore.open(crypto.randomUUID());
  try {
    const engine = new SessionEngine(store, repository);
    expect(
      (
        await engine.select({
          mode: 'focus',
          languagePackId: pack.id,
          conceptIds: [concept],
        })
      ).status,
    ).toBe('ready');
    expect(
      (
        await engine.select({
          mode: 'focus',
          languagePackId: italianPack.id,
          conceptIds: [concept],
        })
      ).status,
    ).toBe('unavailable');
    expect((await engine.start(concept)).root.payload.packId).toBe(pack.id);
  } finally {
    store.close();
  }
});

it('rejects two derivations that would overwrite the same stable activity', () => {
  const pack = clone();
  pack.templates[0].variants.push({
    ...pack.templates[0].variants[0],
    key: 'duplicate-source',
  });
  expect(validatePack(pack).join()).toContain('fuentes de variantes');
  expect(() => loadLanguagePack(pack, true)).toThrow();
});
