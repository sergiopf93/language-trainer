import { test, expect, type Page } from '@playwright/test';
import { readingCorpus } from '../../src/reading/corpus';
import { readingEligibility } from '../../src/reading/engine';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
import { validFact, validLinks, type Fact } from '../../shared/protocol';

const text = readingCorpus.find((t) => !t.dependencies.length)!;
async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('language-trainer-v1');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const rows = await new Promise<Fact[]>((resolve, reject) => {
      const request = db.transaction('facts').objectStore('facts').getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return rows;
  });
}
async function saved(page: Page) {
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
}
async function begin(page: Page, selected = text) {
  const catalog = loadLanguagePack(italianCourse, true).repository;
  for (const id of readingEligibility(selected, catalog, []).missingConcepts) {
    await page.goto('/concept?id=' + id);
    await expect(page.locator('.theory-panel')).toBeVisible();
  }
  await page.goto('/reading');
  await page
    .getByRole('link', { name: 'Leggi: ' + selected.title, exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Inizia la lettura', exact: true })
    .click();
  await saved(page);
}
async function draft(page: Page, value: string) {
  if (await page.locator('#learning-answer').count())
    await page.locator('#learning-answer').fill(value);
  else await page.getByLabel(value, { exact: true }).check();
  await saved(page);
}
for (const width of [320, 390, 768]) {
  test(`Reading ${width}: text, help, comprehension, summary and distinct progress`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await begin(page);
    if (width === 768)
      await page.evaluate(() => {
        document.documentElement.style.zoom = '2';
      });
    await expect(page.locator('.reading-text')).toBeVisible();
    await expect(page.locator('.reading-help')).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Vocabolario e aiuto', exact: true })
      .click();
    await expect(page.locator('.reading-help')).toBeVisible();
    for (const [index, question] of text.questions.entries()) {
      await draft(page, question.accepted[0]);
      await page
        .getByRole('button', { name: 'Controlla', exact: true })
        .dblclick();
      await expect(page.locator('.feedback')).toBeVisible();
      await expect(page.locator('.reading-text')).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (index === 0)
        await page.screenshot({
          path: `test-results/reading-${width}-feedback.png`,
          fullPage: true,
        });
      await page
        .getByRole('button', {
          name:
            index + 1 === text.questions.length
              ? 'Vedi il riepilogo'
              : 'Continua',
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
    expect(all.filter((f) => f.kind === 'attempt')).toHaveLength(
      text.questions.length,
    );
    const evidence = all.filter((f) => f.kind === 'evidence');
    expect(evidence).toHaveLength(text.questions.length);
    expect(
      evidence.every(
        (f) =>
          !f.payload.independent &&
          f.payload.dimension === 'reading-comprehension',
      ),
    ).toBe(true);
    await page.goto('/progress');
    await expect(
      page.getByRole('heading', { name: 'Comprensione scritta', exact: true }),
    ).toBeVisible();
    await page.goto('/reading');
    await expect(
      page.getByRole('link', { name: 'Riepilogo: ' + text.title, exact: true }),
    ).toBeVisible();
  });
}
test('Reading offline: reopen draft and help, submit once and restore feedback', async ({
  page,
  context,
}) => {
  await begin(page);
  await page
    .getByRole('button', { name: 'Vocabolario e aiuto', exact: true })
    .click();
  await draft(page, text.questions[0].accepted[0]);
  await page.goto('/reading');
  const resume = page.getByRole('link', {
    name: 'Continua: ' + text.title,
    exact: true,
  });
  await expect(resume).toBeVisible();
  const href = await resume.getAttribute('href');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.close();
  await context.setOffline(true);
  const reopened = await context.newPage();
  await reopened.goto(href!);
  await expect(reopened.locator('.reading-help')).toBeVisible();
  if (await reopened.locator('#learning-answer').count())
    await expect(reopened.locator('#learning-answer')).toHaveValue(
      text.questions[0].accepted[0],
    );
  else
    await expect(
      reopened.getByLabel(text.questions[0].accepted[0], { exact: true }),
    ).toBeChecked();
  await reopened
    .getByRole('button', { name: 'Controlla', exact: true })
    .dblclick();
  await expect(reopened.locator('.feedback')).toBeVisible();
  await reopened.reload();
  await expect(reopened.locator('.feedback h3')).toHaveText('Corretto!');
  expect(
    (await facts(reopened)).filter((f) => f.kind === 'attempt'),
  ).toHaveLength(1);
  await reopened
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(
    reopened.getByRole('heading', { name: 'Riepilogo della sessione' }),
  ).toBeVisible();
  await context.setOffline(false);
});

test('Reading keyboard: wrong answer, assisted retry and abstention keep their judgments', async ({
  page,
}) => {
  await begin(page);
  await expect(
    page.getByRole('article', { name: 'Testo della lettura' }),
  ).toHaveAttribute('lang', 'it');
  const wrong = page.getByRole('radio', {
    name: text.questions[0].rejected[0],
    exact: true,
  });
  await wrong.focus();
  await page.keyboard.press('Space');
  await saved(page);
  const check = page.getByRole('button', { name: 'Controlla', exact: true });
  await check.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.feedback h3')).toHaveText('Da rivedere');
  await expect(page.locator('.feedback h3')).toBeFocused();
  await expect(page.locator('.feedback')).toHaveAttribute('role', 'status');
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await draft(page, text.questions[0].accepted[0]);
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(page.locator('.feedback h3')).toHaveText('Corretto!');
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(page.locator('.feedback h3')).toHaveText('Nessuna risposta');
  const all = await facts(page);
  const evaluations = all.filter((f) => f.kind === 'evaluation');
  expect(evaluations.map((f) => f.payload.judgment).sort()).toEqual([
    'correct',
    'no-opportunity',
    'verifiable-error',
  ]);
  const evidence = all.filter((f) => f.kind === 'evidence');
  expect(evidence).toHaveLength(2);
  expect(
    evidence.find((f) => f.payload.judgment === 'correct')?.payload.independent,
  ).toBe(false);
  expect(
    evidence.find((f) => f.payload.judgment === 'verifiable-error')?.payload
      .independent,
  ).toBe(true);
});

test('Reading longest text: mobile short response outside criterion is not an error', async ({
  page,
}) => {
  test.setTimeout(90000);
  const longest = [...readingCorpus].sort(
    (a, b) => b.body.length - a.body.length,
  )[0];
  const shortIndex = longest.questions.findIndex(
    (q) => !q.options.length && !q.exhaustive,
  );
  expect(shortIndex).toBeGreaterThanOrEqual(0);
  await page.setViewportSize({ width: 320, height: 844 });
  await begin(page, longest);
  await expect(page.locator('.reading-text')).toHaveText(longest.body);
  await page
    .getByRole('button', { name: 'Vocabolario e aiuto', exact: true })
    .click();
  for (const entry of longest.vocabulary)
    await expect(page.locator('.reading-help')).toContainText(
      entry.word + ': ' + entry.gloss,
    );
  for (let i = 0; i < shortIndex; i++) {
    await draft(page, longest.questions[i].accepted[0]);
    await page.getByRole('button', { name: 'Controlla', exact: true }).click();
    await page.getByRole('button', { name: 'Continua', exact: true }).click();
  }
  await page
    .getByRole('textbox', { name: 'La tua risposta', exact: true })
    .fill('Risposta fuori dal criterio automatico');
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(page.locator('.feedback h3')).toHaveText('Da verificare');
  await expect(page.locator('.feedback h3')).toBeFocused();
  await expect(page.locator('.reading-text')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const all = await facts(page);
  const evaluation = all.find(
    (f) => f.kind === 'evaluation' && f.payload.judgment === 'not-evaluable',
  );
  expect(evaluation).toBeDefined();
  expect(
    all.filter(
      (f) => f.kind === 'evidence' && f.payload.evaluationId === evaluation?.id,
    ),
  ).toHaveLength(0);
  await page.screenshot({
    path: 'test-results/reading-longest-320-neutral.png',
    fullPage: true,
  });
});
