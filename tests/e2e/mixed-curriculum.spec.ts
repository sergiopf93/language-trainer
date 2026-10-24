import 'fake-indexeddb/auto';
import { test, expect } from '@playwright/test';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
import { LocalStore } from '../../src/persistence/local';
import { SessionEngine } from '../../src/learning/session';
import { mixedGroups } from '../../src/mixed/manifest';
import { mixedGroupPrerequisites } from '../../src/mixed/engine';
import type { Fact } from '../../shared/protocol';
import { validFact, validLinks } from '../../shared/protocol';

const catalog = loadLanguagePack(italianCourse, true).repository;
for (const groupId of ['genere-lessicale', 'past-events', 'home-travel']) {
  test(`6B.2 ${groupId}: reviewed snapshot, mobile offline resume and evidence`, async ({
    page,
    context,
  }) => {
    test.skip(
      process.env.E2E_PRODUCTION === '1',
      'Reviewed content is excluded from production.',
    );
    const group = mixedGroups.find((g) => g.id === groupId)!;
    const store = await LocalStore.open(crypto.randomUUID());
    let seed;
    try {
      const engine = new SessionEngine(store, catalog);
      for (const id of mixedGroupPrerequisites(catalog, group))
        await engine.study(id, '1');
      const view = await engine.startMixed(groupId);
      seed = {
        facts: await store.allFacts(),
        identity: await store.identity(),
        view,
      };
    } finally {
      store.close();
    }
    // Arrange a real SessionEngine snapshot; browser performs all answers and offline transitions.
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/practice');
    await expect(
      page.getByRole('link', { name: 'Pratica mista', exact: true }),
    ).toBeVisible();
    await page.evaluate(
      async ({ facts, identity }) => {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const r = indexedDB.open('language-trainer-v1');
          r.onsuccess = () => resolve(r.result);
          r.onerror = () => reject(r.error);
        });
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction(['facts', 'meta'], 'readwrite');
          for (const f of facts) tx.objectStore('facts').put(f);
          tx.objectStore('meta').put(identity, 'identity');
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        });
        db.close();
      },
      { facts: seed.facts, identity: seed.identity },
    );
    await page.goto('/practice?session=' + seed.view.head.id);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    for (const [index, a] of seed.view.root.payload.activities.entries()) {
      await expect(page.locator('.theory-panel')).toHaveCount(0);
      await expect(
        page.getByRole('heading', { name: a.prompt, exact: true }),
      ).toBeVisible();
      const value = a.criterion.accepted[0];
      if (a.format === 'selection')
        await page.getByLabel(value, { exact: true }).check();
      else await page.locator('#learning-answer').fill(value);
      await expect(
        page.getByText('Pratica salvata su questo dispositivo', {
          exact: true,
        }),
      ).toBeVisible();
      if (index === 0) {
        await page.reload();
        if (a.format === 'selection')
          await expect(page.getByLabel(value, { exact: true })).toBeChecked();
        else await expect(page.locator('#learning-answer')).toHaveValue(value);
      }
      await page
        .getByRole('button', { name: 'Controlla', exact: true })
        .click();
      await expect(page.locator('.feedback h3')).toHaveText('Corretto!');
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page
        .getByRole('button', {
          name:
            index + 1 === seed.view.root.payload.activities.length
              ? 'Vedi il riepilogo'
              : 'Continua',
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: 'Riepilogo della sessione' }),
    ).toBeVisible();
    const facts = await page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve) => {
        const r = indexedDB.open('language-trainer-v1');
        r.onsuccess = () => resolve(r.result);
      });
      const facts = await new Promise<Fact[]>((resolve) => {
        const r = db.transaction('facts').objectStore('facts').getAll();
        r.onsuccess = () => resolve(r.result);
      });
      db.close();
      return facts;
    });
    const known = new Map(facts.map((f) => [f.id, f]));
    expect(facts.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    const evidence = facts.filter((f) => f.kind === 'evidence');
    expect(evidence).toHaveLength(seed.view.root.payload.activities.length);
    for (const f of evidence)
      if (f.kind === 'evidence') {
        const a = seed.view.root.payload.activities.find(
          (a) => a.id === f.payload.activityId,
        )!;
        expect(f.payload.conceptId).toBe(a.conceptId);
        expect(f.payload.dimension).toBe(a.dimension);
      }
    await context.setOffline(false);
    await page.goto('/practice');
    for (const id of group.conceptIds)
      await expect(
        page.locator(`a[href="/practice?review=${id}"]`),
      ).toBeVisible();
  });
}
