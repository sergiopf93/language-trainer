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
  await page.goto('/practice?mixed=1');
  await expect(page.getByText(/Servono più concetti/)).toBeVisible();
  for (const code of ['03-01', '04-01', '05-01', '04-05', '05-04']) {
    await page.goto('/concept?id=it-a1-c' + code);
    await expect(page.locator('.theory-panel')).toBeVisible();
  }
  await page.goto('/practice');
  await page.getByRole('link', { name: 'Pratica mista', exact: true }).click();
  await page
    .getByRole('button', { name: 'Inizia la pratica mista', exact: true })
    .click();
  await saved(page);
  const root = (await facts(page)).find(
    (f) => f.kind === 'practice-session' && f.payload.mode === 'mixed',
  );
  if (root?.kind !== 'practice-session')
    throw new Error('Missing mixed session');
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
  test(`6B mixed mobile ${width}: no concept cue, session, summary and review`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const root = await begin(page);
    expect(root.payload.mixed?.conceptIds).toHaveLength(2);
    for (const [i, activity] of root.payload.activities.entries()) {
      await expect(
        page.getByRole('heading', { name: 'Pratica mista', exact: true }),
      ).toBeVisible();
      await expect(page.locator('.theory-panel')).toHaveCount(0);
      await expect(
        page.getByRole('heading', { name: activity.prompt, exact: true }),
      ).toBeVisible();
      await answer(page, activity.criterion.accepted[0]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (i === 0)
        await page.screenshot({
          path: `test-results/mixed-${width}-feedback.png`,
          fullPage: true,
        });
      await page
        .getByRole('button', {
          name:
            i + 1 === root.payload.activities.length
              ? 'Vedi il riepilogo'
              : 'Continua',
          exact: true,
        })
        .click();
    }
    await expect(
      page.getByRole('heading', { name: 'Riepilogo della sessione' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Concetti e osservazioni' }),
    ).toBeVisible();
    const all = await facts(page);
    const known = new Map(all.map((f) => [f.id, f]));
    expect(all.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
    expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(
      root.payload.activities.length,
    );
    for (const a of root.payload.activities) {
      const e = all.find(
        (f) => f.kind === 'evidence' && f.payload.activityId === a.id,
      );
      expect(e?.kind === 'evidence' && e.payload.conceptId).toBe(a.conceptId);
      expect(e?.kind === 'evidence' && e.payload.dimension).toBe(a.dimension);
    }
    for (const id of root.payload.mixed!.conceptIds) {
      await page.goto('/progress?concept=' + id);
      await expect(page.locator('.timeline li')).toHaveCount(
        root.payload.activities.filter((a) => a.conceptId === id).length,
      );
    }
    await page.goto('/practice');
    await expect(
      page.getByRole('link', { name: /^Riepilogo pratica mista:/ }),
    ).toBeVisible();
    for (const id of root.payload.mixed!.conceptIds)
      await expect(
        page.locator(`a[href="/practice?review=${id}"]`),
      ).toBeVisible();
  });
}
test('6B mixed: offline draft and feedback resume without duplicates, partial finish', async ({
  page,
  context,
}) => {
  const root = await begin(page);
  const a = root.payload.activities[0];
  if (await page.locator('#learning-answer').count())
    await page.locator('#learning-answer').fill(a.criterion.accepted[0]);
  else await page.getByLabel(a.criterion.accepted[0], { exact: true }).check();
  await saved(page);
  await page.getByRole('link', { name: 'Pausa e torna alla pratica' }).click();
  await expect(
    page.getByRole('link', { name: /^Continua pratica mista:/ }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.close();
  await context.setOffline(true);
  const reopened = await context.newPage();
  await reopened.goto('/practice');
  await reopened
    .getByRole('link', { name: /^Continua pratica mista:/ })
    .click();
  if (await reopened.locator('#learning-answer').count())
    await expect(reopened.locator('#learning-answer')).toHaveValue(
      a.criterion.accepted[0],
    );
  else
    await expect(
      reopened.getByLabel(a.criterion.accepted[0], { exact: true }),
    ).toBeChecked();
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
test('6B mixed: requesting theory records help without leaking it initially', async ({
  page,
}) => {
  const root = await begin(page);
  await expect(page.locator('.theory-panel')).toHaveCount(0);
  await page
    .getByRole('button', { name: 'Rivedi la teoria', exact: true })
    .click();
  await expect(page.locator('.theory-panel')).toBeVisible();
  await page
    .getByRole('button', { name: 'Torna all’esercizio', exact: true })
    .click();
  await answer(page, root.payload.activities[0].criterion.accepted[0]);
  const evidence = (await facts(page)).find((f) => f.kind === 'evidence');
  expect(evidence?.kind === 'evidence' && evidence.payload.independent).toBe(
    false,
  );
});
