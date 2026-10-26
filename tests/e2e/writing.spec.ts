import { test, expect, type Page } from '@playwright/test';
import { writingOptions, writingPreparation } from '../../src/writing/engine';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
import { validFact, validLinks, type Fact } from '../../shared/protocol';
const catalog = loadLanguagePack(italianCourse, true).repository;
async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('language-trainer-v1');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const result = await new Promise<Fact[]>((resolve, reject) => {
      const r = db.transaction('facts').objectStore('facts').getAll();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return result;
  });
}
async function saved(page: Page) {
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
}
async function begin(page: Page, id: string) {
  const option = writingOptions(catalog).find((o) => o.id === id)!;
  expect(option).toBeDefined();
  for (const concept of writingPreparation(option, catalog, [])) {
    await page.goto('/concept?id=' + concept);
    await expect(page.locator('.theory-panel')).toBeVisible();
  }
  await page.goto('/practice?writing=' + id);
  await page
    .getByRole('button', { name: 'Inizia a scrivere', exact: true })
    .click();
  await saved(page);
}
for (const width of [320, 375, 390, 768])
  test(`Writing ${width}: compose, reread, help, abstain, repair and history`, async ({
    page,
  }) => {
    page.on('pageerror', (e) => {
      throw e;
    });
    await page.setViewportSize({ width, height: 844 });
    await begin(page, 'it-a1-writing-presentazione');
    const input = page.getByLabel('La tua risposta', { exact: true });
    await expect(input).toHaveJSProperty('tagName', 'TEXTAREA');
    await expect(input).toHaveAttribute('lang', 'it');
    const response = 'Ciao! Sono María.\nSono di Málaga. A presto!';
    await input.fill(response);
    await saved(page);
    await expect(input).toBeFocused();
    await page
      .getByRole('button', { name: 'Rileggi il testo', exact: true })
      .click();
    await expect(page.getByText(response, { exact: true })).toBeVisible();
    await page
      .getByRole('button', { name: 'Mostra un aiuto', exact: true })
      .click();
    await saved(page);
    await expect(input).toHaveValue(response);
    await page
      .getByRole('button', { name: 'Controlla', exact: true })
      .dblclick();
    await expect(
      page.getByText('Testo non valutato automaticamente', { exact: true }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/writing-${width}-feedback.png`,
      fullPage: true,
    });
    await page.getByRole('button', { name: 'Riprova', exact: true }).click();
    await expect(input).toHaveValue(response);
    await expect(
      page.getByText(
        'Rivedi il testo dopo il feedback: non è una correzione automatica.',
        { exact: true },
      ),
    ).toBeVisible();
    await input.fill(response + ' Grazie.');
    await saved(page);
    await page.getByRole('button', { name: 'Controlla', exact: true }).click();
    await page
      .getByRole('button', { name: 'Vedi il riepilogo', exact: true })
      .click();
    await expect(
      page.getByText(response + ' Grazie. · Da verificare', { exact: true }),
    ).toBeVisible();
    const all = await facts(page);
    const known = new Map(all.map((f) => [f.id, f]));
    expect(all.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(2);
    expect(all.filter((f) => f.kind === 'evidence')).toHaveLength(0);
    await page.goto('/writing');
    await expect(
      page.getByRole('link', { name: 'Rivedi: Un nuovo gruppo', exact: true }),
    ).toBeVisible();
  });
test('Writing offline draft and feedback survive reload without duplicates', async ({
  page,
  context,
}) => {
  await begin(page, 'it-a1-writing-presentazione');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect(
    page.getByLabel('La tua risposta', { exact: true }),
  ).toBeVisible();
  await context.setOffline(true);
  const input = page.getByLabel('La tua risposta', { exact: true });
  await input.fill('Ciao! Sono Anna.\nSono di Roma.');
  await saved(page);
  await page.reload();
  await expect(input).toHaveValue('Ciao! Sono Anna.\nSono di Roma.');
  await page.getByRole('button', { name: 'Controlla', exact: true }).dblclick();
  await expect(page.locator('.feedback')).toBeVisible();
  await page.reload();
  await expect(page.locator('.feedback')).toBeVisible();
  expect((await facts(page)).filter((f) => f.kind === 'attempt')).toHaveLength(
    1,
  );
});
test('Writing bounded criterion distinguishes error, repair and neutral alternative', async ({
  page,
}) => {
  await begin(page, 'W-C01');
  const input = page.getByLabel('La tua risposta', { exact: true });
  await input.fill('Io siamo Luca e siamo italiano.');
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(
    page.getByText('Errore verificato', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await expect(input).toHaveValue('Io siamo Luca e siamo italiano.');
  await input.fill('Sono Luca e sono italiano.');
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  const evidence = (await facts(page)).filter((f) => f.kind === 'evidence');
  expect(evidence).toHaveLength(2);
  expect(
    evidence.find((f) => f.payload.judgment === 'correct')?.payload.independent,
  ).toBe(false);
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await input.fill('Mi chiamo Luca e vengo dall’Italia.');
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(
    page.getByText('Struttura non dimostrata', { exact: true }),
  ).toBeVisible();
  expect((await facts(page)).filter((f) => f.kind === 'evidence')).toHaveLength(
    2,
  );
});
