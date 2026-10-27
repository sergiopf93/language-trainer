import { test, expect, type Page } from '@playwright/test';
import type { Fact } from '../../shared/protocol';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
import { mixedGroups } from '../../src/mixed/manifest';
import { mixedGroupPrerequisites } from '../../src/mixed/engine';
async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('language-trainer-v1');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const all = await new Promise<Fact[]>((resolve, reject) => {
      const r = db.transaction('facts').objectStore('facts').getAll();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return all;
  });
}
for (const width of [320, 390])
  test(`library search mobile ${width}: filters, theory, practice, back and offline`, async ({
    page,
    context,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/library');
    await expect(
      page.getByRole('link', { name: 'Scopri il concetto', exact: true }),
    ).toHaveCount(99);
    const initial = await facts(page);
    const query = page.getByRole('searchbox', {
      name: 'Buscar en la Biblioteca',
    });
    await page.screenshot({
      path: `test-results/library-search-${width}-initial.png`,
      fullPage: false,
    });
    await query.fill('ESSERE');
    await expect(query).toBeFocused();
    await page.getByText('Filtros', { exact: true }).click();
    await page
      .getByLabel('Tipo de práctica', { exact: true })
      .selectOption('writing');
    await page
      .getByLabel('Categoría lingüística', { exact: true })
      .selectOption('verb');
    await expect(page.locator('.library-result').first()).toBeVisible();
    expect(await facts(page)).toEqual(initial);
    expect(
      (await page.locator('.library-filters').boundingBox())!.height,
    ).toBeLessThan(300);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/library-search-${width}.png`,
      fullPage: false,
    });
    await query.fill('zzzzmissing');
    await expect(
      page.getByText(/No hay resultados con esta combinación/),
    ).toBeVisible();
    await page
      .getByRole('button', { name: 'Limpiar búsqueda y filtros' })
      .click();
    await query.fill('essere');
    await page
      .getByLabel('Tipo de práctica', { exact: true })
      .selectOption('concept');
    await page.locator('a[href="/concept?id=it-a1-c04-01"]').click();
    await expect(page.locator('.theory-panel')).toBeVisible();
    await page.getByRole('link', { name: '← Biblioteca', exact: true }).click();
    await expect(query).toHaveValue('essere');
    await expect(
      page.getByLabel('Tipo de práctica', { exact: true }),
    ).toHaveValue('concept');
    const before = await facts(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await expect(query).toHaveValue('essere');
    await context.setOffline(true);
    await page.reload();
    await expect(query).toHaveValue('essere');
    await query.fill('artículos');
    await expect(page.locator('.library-result').first()).toContainText(
      /articoli|Artículos/i,
    );
    expect(await facts(page)).toEqual(before);
    await query.fill('essere');
    await page.locator('a[href="/practice?concept=it-a1-c04-01"]').click();
    await page
      .getByRole('button', { name: 'Inizia la pratica', exact: true })
      .click();
    await expect(
      page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
    ).toBeVisible();
    expect(
      (await facts(page)).filter((f) => f.kind === 'practice-session'),
    ).toHaveLength(1);
    await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
    await expect(query).toHaveValue('essere');
    expect(errors).toEqual([]);
  });
test('library Mixed selects the requested eligible group and blocks unprepared groups', async ({
  page,
}) => {
  const catalog = loadLanguagePack(italianCourse, true).repository;
  const selected = mixedGroups[1];
  await page.goto('/practice?mixed=' + selected.id);
  await expect(page.getByText(/Servono più concetti/)).toBeVisible();
  await expect(
    page.getByText('Preparación del grupo:', { exact: false }),
  ).toBeVisible();
  for (const id of new Set(
    [mixedGroups[0], selected].flatMap((g) =>
      mixedGroupPrerequisites(catalog, g),
    ),
  )) {
    await page.goto('/concept?id=' + id);
    await expect(page.locator('.theory-panel')).toBeVisible();
  }
  await page.goto('/library?type=mixed&concept=' + selected.conceptIds[0]);
  await page.locator(`a[href="/practice?mixed=${selected.id}"]`).click();
  await page
    .getByRole('button', { name: 'Inizia la pratica mista', exact: true })
    .click();
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  const root = (await facts(page)).find((f) => f.kind === 'practice-session');
  expect(root?.kind === 'practice-session' && root.payload.mixed?.groupId).toBe(
    selected.id,
  );
});
