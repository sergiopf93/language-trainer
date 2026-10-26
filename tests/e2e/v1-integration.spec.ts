import { test, expect, type Page } from '@playwright/test';
import { validFact, validLinks, type Fact } from '../../shared/protocol';
import { italianCourse } from '../../src/content/italian-a1/course';
import { loadLanguagePack } from '../../src/content/loader';
import { readingCorpus } from '../../src/reading/corpus';
import { readingEligibility } from '../../src/reading/engine';
import { writingOptions, writingPreparation } from '../../src/writing/engine';
import { project } from '../../src/evidence/project';

async function facts(page: Page): Promise<Fact[]> {
  return page.evaluate(async () => {
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
    return rows;
  });
}
const click = (page: Page, name: string) =>
  page.getByRole('button', { name, exact: true }).click();
const saved = (page: Page) =>
  expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
async function answer(page: Page, value: string) {
  if (await page.locator('select[id^="pair-"]').count()) {
    for (const [i, selected] of (JSON.parse(value) as number[]).entries())
      await page.locator(`#pair-${i}`).selectOption(String(selected));
  } else if (await page.locator('.word-chips').count()) {
    for (const word of value.split(' '))
      await page
        .locator('.word-chips button:enabled')
        .getByText(word, { exact: true })
        .first()
        .click();
  } else if (await page.locator('#learning-answer').count())
    await page.locator('#learning-answer').fill(value);
  else await page.getByLabel(value, { exact: true }).check();
  await saved(page);
  await page.getByRole('button', { name: 'Controlla', exact: true }).dblclick();
  await expect(page.locator('.feedback')).toBeVisible();
}
async function introduce(page: Page, ids: string[]) {
  for (const id of ids) {
    await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
    await page.locator(`a[href="/concept?id=${id}"]`).click();
    await expect(page.locator('.theory-panel')).toBeVisible();
    expect(
      (await facts(page)).some(
        (f) => f.kind === 'theory-exposure' && f.payload.conceptId === id,
      ),
    ).toBe(true);
  }
}
async function complete(page: Page, mode: string) {
  await expect(
    page.getByRole('button', { name: 'Controlla', exact: true }),
  ).toBeVisible();
  const root = (await facts(page)).find(
    (f) => f.kind === 'practice-session' && f.payload.mode === mode,
  );
  if (root?.kind !== 'practice-session')
    throw new Error('Missing session ' + mode);
  for (const [i, activity] of root.payload.activities.entries()) {
    await answer(page, activity.criterion.accepted[0]);
    await click(
      page,
      i + 1 === root.payload.activities.length
        ? 'Vedi il riepilogo'
        : 'Continua',
    );
  }
  await expect(
    page.getByRole('heading', { name: 'Riepilogo della sessione' }),
  ).toBeVisible();
}

test('V1 integrated learner journey preserves all modes, evidence and history offline', async ({
  page,
  context,
}, info) => {
  test.setTimeout(120000);
  page.on('pageerror', (error) => {
    throw error;
  });
  const catalog = loadLanguagePack(italianCourse, true).repository;
  const started = Date.now();
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Da dove cominciamo?' }),
  ).toBeVisible();
  const startupMs = Date.now() - started;
  await introduce(page, ['it-a1-c04-01']);
  await click(page, 'Inizia la pratica');
  await complete(page, 'focus');
  await page.getByRole('link', { name: 'Vedi i progressi' }).click();
  await expect(page.locator('.timeline li').first()).toBeVisible();
  await page.getByRole('link', { name: 'Pratica', exact: true }).click();
  await page.locator('a[href="/practice?review=it-a1-c04-01"]').click();
  await click(page, 'Inizia il ripasso');
  await complete(page, 'review');
  await introduce(page, [
    'it-a1-c03-01',
    'it-a1-c05-01',
    'it-a1-c04-05',
    'it-a1-c05-04',
  ]);
  await page.getByRole('link', { name: 'Pratica', exact: true }).click();
  await page.getByRole('link', { name: 'Pratica mista', exact: true }).click();
  await click(page, 'Inizia la pratica mista');
  await complete(page, 'mixed');
  const reading = readingCorpus.find((t) => !t.dependencies.length)!;
  await introduce(
    page,
    readingEligibility(reading, catalog, await facts(page)).missingConcepts,
  );
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('link', { name: 'Letture A1', exact: true }).click();
  await page
    .getByRole('link', { name: 'Leggi: ' + reading.title, exact: true })
    .click();
  await click(page, 'Inizia la lettura');
  await saved(page);
  await click(page, 'Vocabolario e aiuto');
  await complete(page, 'reading');
  const writing = writingOptions(catalog).find(
    (o) => o.id === 'it-a1-writing-presentazione',
  )!;
  await introduce(
    page,
    writingPreparation(writing, catalog, await facts(page)),
  );
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('link', { name: 'Scrittura A1', exact: true }).click();
  await page
    .locator('summary')
    .filter({ hasText: '3 · Messaggi guidati' })
    .click();
  await page.locator(`a[href="/practice?writing=${writing.id}"]`).click();
  await click(page, 'Inizia a scrivere');
  const response = 'Ciao! Sono Anna.\nSono di Roma. A presto!';
  await page.getByLabel('La tua risposta', { exact: true }).fill(response);
  await saved(page);
  await click(page, 'Mostra un aiuto');
  await saved(page);
  const before = await facts(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.close();
  await context.setOffline(true);
  const resumed = await context.newPage();
  resumed.on('pageerror', (error) => {
    throw error;
  });
  await resumed.goto('/');
  await resumed.getByRole('link', { name: /Continua la pratica/ }).click();
  await expect(
    resumed.getByLabel('La tua risposta', { exact: true }),
  ).toHaveValue(response);
  const restored = await facts(resumed);
  expect(restored).toEqual(before);
  const concept = italianCourse.concepts.find((c) => c.id === 'it-a1-c04-01')!;
  expect(project(restored, concept.id, concept.version, true)).toEqual(
    project(before, concept.id, concept.version, true),
  );
  await resumed
    .getByRole('button', { name: 'Controlla', exact: true })
    .dblclick();
  await expect(
    resumed.getByText('Testo non valutato automaticamente', { exact: true }),
  ).toBeVisible();
  await resumed.reload();
  await expect(resumed.locator('.feedback')).toBeVisible();
  await click(resumed, 'Vedi il riepilogo');
  await resumed.getByRole('link', { name: 'Home', exact: true }).click();
  await resumed
    .getByRole('link', { name: 'Scrittura A1', exact: true })
    .click();
  await resumed
    .getByRole('link', { name: 'Rivedi: ' + writing.title, exact: true })
    .click();
  await expect(
    resumed.getByText(response + ' · Da verificare', { exact: true }),
  ).toBeVisible();
  await resumed.getByRole('link', { name: 'Home', exact: true }).click();
  await resumed.getByRole('link', { name: 'Letture A1', exact: true }).click();
  await expect(
    resumed.getByRole('link', {
      name: 'Riepilogo: ' + reading.title,
      exact: true,
    }),
  ).toBeVisible();
  await resumed.getByRole('link', { name: 'Pratica', exact: true }).click();
  await expect(
    resumed.getByRole('link', { name: /^Riepilogo ripasso:/ }),
  ).toBeVisible();
  await expect(
    resumed.getByRole('link', { name: /^Riepilogo pratica mista:/ }),
  ).toBeVisible();
  const all = await facts(resumed);
  const known = new Map(all.map((f) => [f.id, f]));
  expect(all.every((f) => validFact(f) && validLinks(f, known))).toBe(true);
  const roots = all.filter((f) => f.kind === 'practice-session');
  expect(roots.map((f) => f.payload.mode).sort()).toEqual([
    'focus',
    'mixed',
    'reading',
    'review',
    'writing',
  ]);
  const attempts = all.filter((f) => f.kind === 'attempt');
  const evaluations = all.filter((f) => f.kind === 'evaluation');
  expect(evaluations).toHaveLength(attempts.length);
  expect(new Set(evaluations.map((f) => f.payload.attemptId)).size).toBe(
    attempts.length,
  );
  const evidence = all.filter((f) => f.kind === 'evidence');
  expect(new Set(evidence.map((f) => f.payload.evaluationId)).size).toBe(
    evidence.length,
  );
  for (const e of evidence) {
    const root = roots.find((r) => r.id === e.payload.sessionId)!;
    const activity = root.payload.activities.find(
      (a) => a.id === e.payload.activityId,
    )!;
    expect(e.payload.conceptId).toBe(activity.conceptId);
    expect(e.payload.dimension).toBe(activity.dimension);
    expect(e.payload.dimension).not.toBe('retention');
    if (root.payload.mode === 'reading') {
      expect(e.payload.dimension).toBe('reading-comprehension');
      expect(e.payload.independent).toBe(false);
    }
    if (root.payload.mode === 'review')
      expect(e.payload.independent).toBe(false);
    expect(root.payload.mode).not.toBe('writing');
  }
  expect(
    attempts.filter(
      (f) =>
        f.payload.sessionId ===
        roots.find((r) => r.payload.mode === 'writing')!.id,
    ),
  ).toHaveLength(1);
  await resumed.getByRole('link', { name: 'Progressi', exact: true }).click();
  await expect(
    resumed.getByRole('heading', { name: 'Comprensione scritta', exact: true }),
  ).toBeVisible();
  expect(
    await resumed.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await resumed.screenshot({
    path: info.outputPath('integrated-progress-offline.png'),
    fullPage: true,
  });
  await info.attach('journey-metrics', {
    body: JSON.stringify({
      startupMs,
      facts: all.length,
      attempts: attempts.length,
      evidence: evidence.length,
    }),
    contentType: 'application/json',
  });
});
