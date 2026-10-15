import { test, expect, type Page } from '@playwright/test';
import { italianCourse } from '../../src/content/italian-a1/course';
import type { Fact } from '../../shared/protocol';
import { validFact, validLinks } from '../../shared/protocol';
import { project } from '../../src/evidence/project';
const click = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).click();
async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('language-trainer-v1');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const result = await new Promise<Fact[]>((resolve, reject) => {
      const req = db.transaction('facts').objectStore('facts').getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  });
}
async function start(page: Page, id: string) {
  await page.goto('/concept?id=' + id);
  await expect(page.locator('.theory-panel')).toBeVisible();
  await click(page, 'Inizia la pratica');
}
async function submit(page: Page, answer: string) {
  await expect(
    page.locator('#learning-answer, input[name=answer]').first(),
  ).toBeVisible();
  if (await page.locator('#learning-answer').count())
    await page.locator('#learning-answer').fill(answer);
  else await page.getByLabel(answer, { exact: true }).check();
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await click(page, 'Controlla');
  await expect(page.locator('.feedback')).toBeVisible();
}
async function integrity(page: Page) {
  const all = await facts(page);
  const known = new Map(all.map((f) => [f.id, f]));
  expect(all.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
  const attempts = all.filter((f) => f.kind === 'attempt');
  const evaluations = all.filter((f) => f.kind === 'evaluation');
  expect(evaluations).toHaveLength(attempts.length);
  expect(new Set(evaluations.map((f) => f.payload.attemptId)).size).toBe(
    attempts.length,
  );
  return all;
}
test('5C A/F/G: complete first concept, traverse blocks manually and complete C34-07', async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Da dove cominciamo?' }),
  ).toBeVisible();
  for (const id of [
    'it-a1-c01-01',
    'it-a1-c06-01',
    'it-a1-c14-01',
    'it-a1-c21-01',
    'it-a1-c26-01',
    'it-a1-c32-01',
    'it-a1-c34-07',
  ]) {
    await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
    await page.locator(`a[href="/concept?id=${id}"]`).click();
    await expect(page.locator('.theory-panel')).toBeVisible();
    await click(page, 'Inizia la pratica');
    const items = italianCourse.canonicalActivities.filter(
      (a) => a.conceptId === id,
    );
    const complete = ['it-a1-c01-01', 'it-a1-c34-07'].includes(id);
    for (const [i, item] of (complete ? items : items.slice(0, 2)).entries()) {
      await submit(page, item.criterion.accepted[0]);
      await expect(page.locator('.feedback h3')).toHaveText('Corretto!');
      if (complete || i === 0)
        await click(
          page,
          i === items.length - 1 ? 'Vedi il riepilogo' : 'Continua',
        );
    }
    if (!complete) await click(page, 'Termina la sessione');
    await expect(
      page.getByRole('heading', { name: 'Riepilogo della sessione' }),
    ).toBeVisible();
    await expect(
      page.getByRole('img', {
        name: `${complete ? items.length : 2} di ${items.length} esercizi con risposta inviata`,
      }),
    ).toBeVisible();
  }
  const all = await integrity(page);
  expect(all.filter((f) => f.kind === 'practice-session')).toHaveLength(7);
  const final = italianCourse.concepts.find((c) => c.id === 'it-a1-c34-07')!;
  expect(
    project(all, final.id, final.version, true).observations.find(
      (o) => o.dimension === 'retention',
    )?.supportingFactIds,
  ).toEqual([]);
});
test('5C B/C/E: repeated errors, recognition versus retrieval and returning to earlier concepts', async ({
  page,
}) => {
  await start(page, 'it-a1-c04-01');
  await submit(page, 'sono');
  await click(page, 'Continua');
  await submit(page, 'sono');
  await click(page, 'Riprova');
  await submit(page, 'sono');
  await click(page, 'Riprova');
  await submit(page, 'sei');
  await expect(page.locator('.feedback')).toContainText('Con aiuto');
  await click(page, 'Termina la sessione');
  await page.getByRole('link', { name: 'Vedi i progressi' }).click();
  await expect(
    page.getByText(
      '1 aciertos · 0 errores sin ayuda · 0 respuestas con ayuda',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      '0 aciertos · 1 errores sin ayuda · 2 respuestas con ayuda',
      { exact: true },
    ),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Rivedi il concetto' }).click();
  await click(page, 'Inizia la pratica');
  await submit(page, 'sono');
  await expect(page.locator('.feedback')).toContainText('Con aiuto');
  const all = await integrity(page);
  expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(5);
  expect(
    all.filter(
      (f) =>
        f.kind === 'evaluation' && f.payload.judgment === 'linguistic-error',
    ),
  ).toHaveLength(2);
});
test('5C D/H: close page with saved draft, reopen offline, double submit and resume feedback', async ({
  page,
  context,
}) => {
  await start(page, 'it-a1-c34-07');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.locator('#learning-answer').fill('il telefono');
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await page.close();
  await context.setOffline(true);
  const resumed = await context.newPage();
  await resumed.goto('/');
  await resumed.getByRole('link', { name: /Continua la pratica/ }).click();
  await expect(resumed.locator('#learning-answer')).toHaveValue('il telefono');
  await resumed
    .getByRole('button', { name: 'Controlla', exact: true })
    .evaluate((button) => {
      (button as HTMLButtonElement).click();
      (button as HTMLButtonElement).click();
    });
  await expect(resumed.locator('.feedback h3')).toHaveText('Corretto!');
  await resumed.reload();
  await expect(resumed.locator('.feedback h3')).toHaveText('Corretto!');
  const all = await integrity(resumed);
  expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(1);
  expect(all.filter((f) => f.kind === 'evidence')).toHaveLength(1);
  await click(resumed, 'Riprova');
  await submit(resumed, 'il telefono');
  await expect(resumed.locator('.feedback')).toContainText('Con aiuto');
  await click(resumed, 'Continua');
  await expect(resumed.getByText(/^Esercizio 2 di/)).toBeVisible();
  await integrity(resumed);
});
for (const width of [320, 375, 390, 768]) {
  test(`5C mobile ${width}: main views, input, feedback, summary and errors`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 844 });
    const layout = async (name: string) => {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        name,
      ).toBe(true);
      await page.screenshot({ path: info.outputPath(`${name}.png`) });
    };
    for (const [path, name] of [
      ['/', 'home'],
      ['/library', 'library'],
      ['/practice', 'practice-empty'],
      ['/progress', 'progress-empty'],
      ['/concept?id=missing', 'concept-missing'],
      ['/practice?session=missing', 'session-missing'],
    ]) {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      await layout(name);
    }
    await start(page, 'it-a1-c34-07');
    const input = page.locator('#learning-answer');
    await input.focus();
    await page.keyboard.type('il telefono');
    expect(
      await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBeGreaterThanOrEqual(16);
    await layout('input');
    // Reduced viewport approximates occlusion only; this is not a native mobile keyboard.
    await page.setViewportSize({ width, height: 420 });
    await click(page, 'Controlla');
    await expect(page.locator('.feedback h3')).toHaveText('Corretto!');
    await layout('feedback-reduced-height');
    await page.setViewportSize({ width, height: 844 });
    await click(page, 'Termina la sessione');
    await layout('summary');
    await page.getByRole('link', { name: 'Vedi i progressi' }).click();
    await layout('progress');
    await page.getByRole('link', { name: 'Rivedi il concetto' }).click();
    await layout('theory');
  });
}

test('5C persistence: editing a saved answer immediately reports pending storage', async ({
  page,
}) => {
  await start(page, 'it-a1-c34-07');
  await page.locator('#learning-answer').fill('il telefono');
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  const immediate = await page.locator('#learning-answer').evaluate((input) => {
    (input as HTMLInputElement).value = 'il messaggio';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return document.querySelector(
      '[aria-label="Pratica del concetto"] > [role="status"]',
    )?.textContent;
  });
  expect(immediate).toBe('Salvataggio…');
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.locator('#learning-answer')).toHaveValue('il messaggio');
});
