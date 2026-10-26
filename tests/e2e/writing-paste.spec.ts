import type { Fact } from '../../shared/protocol';
import { test, expect } from '@playwright/test';
import { writingOptions, writingPreparation } from '../../src/writing/engine';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
test('Writing multiline paste saves once, preserves later edits and reloads', async ({
  page,
}) => {
  const catalog = loadLanguagePack(italianCourse, true).repository;
  const option = writingOptions(catalog).find(
    (o) => o.id === 'it-a1-writing-presentazione',
  )!;
  await page.setViewportSize({ width: 320, height: 844 });
  for (const id of writingPreparation(option, catalog, [])) {
    await page.goto('/concept?id=' + id);
    await expect(page.locator('.theory-panel')).toBeVisible();
  }
  await page.goto('/practice?writing=' + option.id);
  await page
    .getByRole('button', { name: 'Inizia a scrivere', exact: true })
    .click();
  const input = page.getByLabel('La tua risposta', { exact: true });
  const value = 'È già lunedì.\n'.repeat(260);
  await input.fill(value);
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await expect(input).toBeFocused();
  const count = () =>
    page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const r = indexedDB.open('language-trainer-v1');
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
      const rows = await new Promise<Fact[]>((resolve, reject) => {
        const r = db.transaction('facts').objectStore('facts').getAll();
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
      db.close();
      return rows.filter(
        (f) => f.kind === 'practice-state' && f.payload.state.draft.length > 0,
      ).length;
    });
  expect(await count()).toBe(1);
  await input.evaluate((el) => {
    for (let i = 0; i < 20; i++)
      el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await input.fill('Un testo diverso.');
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await input.fill(value);
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  expect(await count()).toBe(3);
  await page.reload();
  await expect(input).toHaveValue(value);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
