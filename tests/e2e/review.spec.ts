import { test, expect, type Page } from '@playwright/test';
import type { Fact } from '../../shared/protocol';
import { validFact, validLinks } from '../../shared/protocol';
async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('language-trainer-v1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const all = await new Promise<Fact[]>((resolve, reject) => {
      const request = db.transaction('facts').objectStore('facts').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return all;
  });
}
async function saved(page: Page) {
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
}
async function begin(page: Page) {
  await page.goto('/practice');
  await expect(
    page.getByText(
      'Non ci sono ancora concetti studiati da ripassare. Inizia dalla biblioteca.',
    ),
  ).toBeVisible();
  await page.goto('/concept?id=it-a1-c04-01');
  await expect(page.locator('.theory-panel')).toBeVisible();
  await page.goto('/practice');
  await page.locator('a[href="/practice?review=it-a1-c04-01"]').click();
  await page
    .getByRole('button', { name: 'Inizia il ripasso', exact: true })
    .click();
  await saved(page);
  const root = (await facts(page)).find(
    (f) => f.kind === 'practice-session' && f.payload.mode === 'review',
  );
  if (root?.kind !== 'practice-session')
    throw new Error('Review session missing');
  return root;
}
async function answer(page: Page, value: string) {
  await expect(
    page
      .locator(
        '#learning-answer, input[name=answer], .word-chips button, select',
      )
      .first(),
  ).toBeVisible();
  if (await page.locator('.word-chips').count()) {
    for (const word of value.split(' '))
      await page
        .locator('.word-chips')
        .getByRole('button', { name: word, exact: true })
        .filter({ visible: true })
        .first()
        .click();
  } else if (await page.locator('#learning-answer').count())
    await page.locator('#learning-answer').fill(value);
  else await page.getByLabel(value, { exact: true }).check();
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).dblclick();
  await expect(page.locator('.feedback')).toBeVisible();
}
for (const width of [320, 375, 390, 768]) {
  test(`6A review mobile ${width}: complete review, history and progress`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const root = await begin(page);
    expect(root.payload.activities).toHaveLength(4);
    for (const [i, activity] of root.payload.activities.entries()) {
      await answer(page, activity.criterion.accepted[0]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (i === 0)
        await page.screenshot({
          path: `test-results/review-${width}-feedback.png`,
          fullPage: true,
        });
      await page
        .getByRole('button', {
          name: i === 3 ? 'Vedi il riepilogo' : 'Continua',
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: 'Riepilogo della sessione' }),
    ).toBeVisible();
    const all = await facts(page);
    const known = new Map(all.map((f) => [f.id, f]));
    expect(all.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(4);
    expect(all.filter((f) => f.kind === 'evidence')).toHaveLength(4);
    await page.getByRole('link', { name: 'Vedi i progressi' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Progressi',
    );
    await page.goto('/practice');
    await expect(
      page.getByRole('link', { name: /^Riepilogo ripasso:/ }),
    ).toBeVisible();
  });
}
test('6A review: pause, close, reopen offline, recover draft and feedback without duplicates', async ({
  page,
  context,
}) => {
  const root = await begin(page);
  const first = root.payload.activities[0];
  await expect(page.locator('#learning-answer')).toBeVisible();
  await page.locator('#learning-answer').fill(first.criterion.accepted[0]);
  await saved(page);
  await page.getByRole('link', { name: 'Pausa e torna alla pratica' }).click();
  await expect(
    page.getByRole('link', { name: /^Continua ripasso:/ }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.close();
  await context.setOffline(true);
  const reopened = await context.newPage();
  await reopened.goto('/practice');
  await reopened.getByRole('link', { name: /^Continua ripasso:/ }).click();
  await expect(reopened.locator('#learning-answer')).toHaveValue(
    first.criterion.accepted[0],
  );
  await reopened
    .getByRole('button', { name: 'Controlla', exact: true })
    .dblclick();
  await expect(reopened.locator('.feedback')).toBeVisible();
  await reopened.reload();
  await expect(reopened.locator('.feedback h3')).toHaveText('Corretto!');
  const all = await facts(reopened);
  expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(1);
  expect(all.filter((f) => f.kind === 'evidence')).toHaveLength(1);
  await reopened
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(
    reopened.getByRole('heading', { name: 'Riepilogo della sessione' }),
  ).toBeVisible();
  await context.setOffline(false);
});
