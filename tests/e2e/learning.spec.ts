import { test, expect, type Page } from '@playwright/test';
async function start(page: Page) {
  await page.goto('/library');
  await page.screenshot({
    path: 'test-results/library-mobile.png',
    fullPage: true,
  });
  await page.locator('a[href="/concept?id=it-a1-c04-01"]').click();
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: /Scegli la forma/ }),
  ).toBeVisible();
}
const answer = (page: Page) =>
  page.getByRole('button', { name: 'Controlla', exact: true }).click();
const saved = (page: Page) =>
  expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
test('candidate loop on mobile: offline reload, repair, hints, summary and projection', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await start(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.getByLabel('sei', { exact: true }).check();
  await saved(page);
  await page.reload();
  await expect(page.getByLabel('sei', { exact: true })).toBeChecked();
  await context.setOffline(true);
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Da rivedere', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Da rivedere', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await page.getByLabel('sono', { exact: true }).check();
  await answer(page);
  await expect(
    page.getByText(
      'Con aiuto · Hai consultato un supporto o già visto questo esercizio.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await page
    .getByRole('button', { name: 'Mostra un aiuto', exact: true })
    .click();
  await page.getByLabel('Completa lo spazio').fill('sei');
  await saved(page);
  await page.reload();
  await expect(page.getByLabel('Completa lo spazio')).toHaveValue('sei');
  await expect(page.getByText(/^Ayuda:/)).toBeVisible();
  await answer(page);
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await page.getByLabel('La tua risposta').fill('Noi siamo');
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Corretto!', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: 'test-results/learning-feedback-mobile.png',
    fullPage: true,
  });
  await page
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Riepilogo della sessione',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByText('3 di 19 esercizi · 4 tentativi.')).toBeVisible();
  await expect(
    page.getByRole('img', { name: '3 di 19 esercizi con risposta inviata' }),
  ).toBeVisible();
  await expect(
    page
      .locator('.metric')
      .filter({ hasText: 'corrette senza aiuto' })
      .locator('strong'),
  ).toHaveText('1');
  await expect(
    page
      .locator('.metric')
      .filter({ hasText: 'risposte con aiuto' })
      .locator('strong'),
  ).toHaveText('2');
  await page.screenshot({
    path: 'test-results/summary-mobile.png',
    fullPage: true,
  });
  await page.reload();
  await expect(
    page.getByRole('heading', {
      name: 'Riepilogo della sessione',
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Vedi i progressi', exact: true })
    .click();
  await expect(
    page.getByText('1 aciertos · 0 errores sin ayuda · 1 respuestas con ayuda'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Ricordare nel tempo', exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: 'test-results/learning-progress-mobile.png',
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test('unknown response stays unevaluable and a partial session can finish', async ({
  page,
}) => {
  await start(page);
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Nessuna risposta', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await page.getByLabel('Completa lo spazio').fill('risposta fuori criterio');
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Da verificare', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(page.getByText('2 di 19 esercizi · 2 tentativi.')).toBeVisible();
});

test('two browsers sync learning facts and resume without duplicate attempts', async ({
  browser,
}) => {
  test.skip(
    !process.env.E2E_ACCESS_CODE,
    'Requires the local authenticated test server.',
  );
  const a = await browser.newContext();
  const b = await browser.newContext();
  const pa = await a.newPage();
  const pb = await b.newPage();
  const link = async (page: Page) => {
    await page
      .getByRole('button', { name: 'Impostazioni', exact: true })
      .click();
    await page
      .getByLabel('Código privado de acceso')
      .fill(process.env.E2E_ACCESS_CODE!);
    await page
      .getByRole('button', { name: 'Vincular dispositivo', exact: true })
      .click();
    await expect(page.locator('.sync-status')).toHaveText('Sincronizado');
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  };
  await start(pa);
  await link(pa);
  await pa
    .getByRole('button', { name: 'Rivedi la teoria', exact: true })
    .click();
  await pa.getByRole('button', { name: 'Torna all’esercizio' }).click();
  await pa.getByLabel('sono', { exact: true }).check();
  await answer(pa);
  await expect(
    pa.getByRole('heading', { name: 'Corretto!', exact: true }),
  ).toBeVisible();
  await expect(pa.locator('.sync-status')).toHaveText('Sincronizado');
  const sessionPath = new URL(pa.url()).pathname + new URL(pa.url()).search;
  await pb.goto('/');
  await link(pb);
  await pb.goto(sessionPath);
  await expect(
    pb.getByRole('heading', { name: 'Corretto!', exact: true }),
  ).toBeVisible();
  await pb.getByRole('button', { name: 'Continua', exact: true }).click();
  await pb.getByLabel('Completa lo spazio').fill('sei');
  await answer(pb);
  await expect(pb.locator('.sync-status')).toHaveText('Sincronizado');
  await link(pa);
  await pa.reload();
  await expect(
    pa.getByText('La tua risposta: sei', { exact: true }),
  ).toBeVisible();
  const counts = await pa.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open('language-trainer-v1');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const facts = await new Promise<Array<{ kind: string }>>((resolve) => {
      const req = db.transaction('facts').objectStore('facts').getAll();
      req.onsuccess = () => resolve(req.result);
    });
    db.close();
    return facts.filter((f) => f.kind === 'attempt').length;
  });
  expect(counts).toBe(2);
  await a.close();
  await b.close();
});

test('production build excludes candidate content', async ({ page }) => {
  test.skip(
    process.env.E2E_PRODUCTION !== '1',
    'Run explicitly against a build without the candidate flag.',
  );
  await page.goto('/library');
  await expect(
    page.getByText('Aún no hay contenido publicado.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', {
      name: 'Scopri il concetto',
      exact: true,
    }),
  ).toHaveCount(0);
  await page.goto('/practice?concept=it-a1-c04-01');
  await expect(
    page.getByText('Concepto no habilitado en esta compilación.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Inizia la pratica', exact: true }),
  ).toHaveCount(0);
  await page.goto('/practice?review=it-a1-c04-01');
  await expect(
    page.getByText('Concepto no habilitado en esta compilación.', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Inizia il ripasso', exact: true }),
  ).toHaveCount(0);
  await page.goto('/practice');
  await expect(page.locator('a[href*="?review="]')).toHaveCount(0);
  await page.goto('/practice?mixed=1');
  await expect(page.getByText(/Servono più concetti/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Inizia la pratica mista', exact: true }),
  ).toHaveCount(0);
  await page.goto('/writing');
  await expect(page.locator('a[href*="?writing="]')).toHaveCount(0);
  for (const id of [
    'W-C01',
    'it-a1-writing-presentazione',
    'it-a1-c04-01-sei',
  ]) {
    await page.goto('/practice?writing=' + id);
    await expect(
      page.getByRole('button', { name: 'Inizia a scrivere', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByText('Scrittura non disponibile in questa versione.', {
        exact: true,
      }),
    ).toBeVisible();
  }
  await page.goto('/reading');
  await expect(
    page.getByRole('link', { name: /^(Leggi|Preparati):/ }),
  ).toHaveCount(0);
  for (const id of ['R01', 'R25', 'R26']) {
    await page.goto('/practice?reading=' + id);
    await expect(
      page.getByRole('button', { name: 'Inizia la lettura', exact: true }),
    ).toHaveCount(0);
  }
});

test('theory detail and in-session help keep the draft and mark assisted answers', async ({
  page,
  context,
}) => {
  await page.goto('/library');
  await page.locator('a[href="/concept?id=it-a1-c04-01"]').click();
  await expect(page.getByRole('heading', { name: 'La regola' })).toBeVisible();
  await expect(page.locator('.theory-panel')).toContainText('noi siamo');
  await page.screenshot({
    path: 'test-results/concept-mobile.png',
    fullPage: true,
  });
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  await page.getByLabel('sono', { exact: true }).check();
  await saved(page);
  await page
    .getByRole('button', { name: 'Rivedi la teoria', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'La regola' })).toBeVisible();
  await page.getByRole('button', { name: 'Torna all’esercizio' }).click();
  await expect(page.getByLabel('sono', { exact: true })).toBeChecked();
  await context.setOffline(true);
  await page.reload();
  await answer(page);
  await expect(page.locator('.feedback')).toContainText('Con aiuto');
  await expect(page.locator('.feedback-symbol')).toHaveText('✓');
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await page.getByLabel('Completa lo spazio').fill('sei');
  await answer(page);
  await expect(page.locator('.feedback')).toContainText('Con aiuto');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('.feedback')
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test('main navigation resets scroll and help closes without losing assistance', async ({
  page,
}) => {
  await page.goto('/concept?id=it-a1-c04-01');
  await expect(page.locator('.theory-panel')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.getByRole('link', { name: 'Biblioteca', exact: true }).click();
  await expect(page).toHaveURL(/library/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await start(page);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page
    .getByRole('button', { name: 'Rivedi la teoria', exact: true })
    .click();
  await expect(page.locator('#session-theory')).toBeVisible();
  await page.getByLabel('sono', { exact: true }).check();
  await answer(page);
  await expect(page.locator('#session-theory')).toBeHidden();
  await expect(
    page.getByText(
      'Con aiuto · Hai consultato un supporto o già visto questo esercizio.',
    ),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Continua', exact: true }).click();
  await expect(page.locator('#session-theory')).toBeHidden();
  await expect(
    page.getByRole('button', { name: 'Rivedi la teoria', exact: true }),
  ).toHaveAttribute('aria-expanded', 'false');
  await page
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(
    page.getByRole('heading', {
      name: 'Riepilogo della sessione',
      exact: true,
    }),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});
