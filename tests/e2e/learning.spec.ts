import { test, expect, type Page } from '@playwright/test';
async function start(page: Page) {
  await page.goto('/library');
  await page
    .getByRole('link', { name: 'Practicar Presente de essere', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Iniciar práctica', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: /Selecciona la forma/ }),
  ).toBeVisible();
}
const answer = (page: Page) =>
  page
    .getByRole('button', { name: 'Comprobar respuesta', exact: true })
    .click();
const saved = (page: Page) =>
  expect(
    page.getByText('Práctica guardada en este dispositivo', { exact: true }),
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
    page.getByRole('heading', { name: 'Error verificable', exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Error verificable', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await page.getByLabel('sono', { exact: true }).check();
  await answer(page);
  await expect(
    page.getByText(
      'Observación asistida o ítem ya expuesto: no acredita recuperación independiente.',
    ),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Siguiente actividad', exact: true })
    .click();
  await page.getByRole('button', { name: 'Ver pista', exact: true }).click();
  await page.getByLabel('Completa el hueco').fill('sei');
  await saved(page);
  await page.reload();
  await expect(page.getByLabel('Completa el hueco')).toHaveValue('sei');
  await expect(page.getByText(/^Pista:/)).toBeVisible();
  await answer(page);
  await page
    .getByRole('button', { name: 'Siguiente actividad', exact: true })
    .click();
  await page.getByLabel('Tu respuesta breve').fill('Noi siamo');
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Respuesta correcta', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: 'test-results/learning-feedback-mobile.png',
    fullPage: true,
  });
  await page
    .getByRole('button', { name: 'Finalizar y ver resumen', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Resumen de sesión', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('3 de 3 actividades respondidas · 4 intentos conservados.'),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Resumen de sesión', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('link', { name: 'Ver progreso del concepto', exact: true })
    .click();
  await expect(
    page.getByText(
      '1 aciertos y 0 errores sin ayuda; 1 observaciones asistidas. 2 ítems distintos.',
    ),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Retención diferida', exact: true }),
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
    page.getByRole('heading', { name: 'Sin respuesta evaluable', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Siguiente actividad', exact: true })
    .click();
  await page.getByLabel('Completa el hueco').fill('risposta fuori criterio');
  await answer(page);
  await expect(
    page.getByRole('heading', { name: 'Respuesta no evaluable', exact: true }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Terminar sesión ahora', exact: true })
    .click();
  await expect(
    page.getByText('2 de 3 actividades respondidas · 2 intentos conservados.'),
  ).toBeVisible();
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
    await page.getByRole('button', { name: 'Ajustes', exact: true }).click();
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
  await pa.getByLabel('sono', { exact: true }).check();
  await answer(pa);
  await expect(
    pa.getByRole('heading', { name: 'Respuesta correcta', exact: true }),
  ).toBeVisible();
  await expect(pa.locator('.sync-status')).toHaveText('Sincronizado');
  const sessionPath = new URL(pa.url()).pathname + new URL(pa.url()).search;
  await pb.goto('/');
  await link(pb);
  await pb.goto(sessionPath);
  await expect(
    pb.getByRole('heading', { name: 'Respuesta correcta', exact: true }),
  ).toBeVisible();
  await pb
    .getByRole('button', { name: 'Siguiente actividad', exact: true })
    .click();
  await pb.getByLabel('Completa el hueco').fill('sei');
  await answer(pb);
  await expect(pb.locator('.sync-status')).toHaveText('Sincronizado');
  await link(pa);
  await pa.reload();
  await expect(
    pa.getByText('Tu respuesta: sei', { exact: true }),
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
      name: 'Practicar Presente de essere',
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
    page.getByRole('button', { name: 'Iniciar práctica', exact: true }),
  ).toHaveCount(0);
});
