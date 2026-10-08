import { test, expect } from '@playwright/test';
const accessCode = process.env.E2E_ACCESS_CODE;
async function link(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await page.getByLabel('Código privado de acceso').fill(accessCode!);
  await page
    .getByRole('button', { name: 'Vincular dispositivo', exact: true })
    .click();
  await expect(page.locator('.sync-status')).toHaveText('Sincronizado');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
}
test('mobile shell, deep routes, offline reload and draft continuity', async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/library');
  await expect(
    page.getByRole('heading', { name: 'Biblioteca', exact: true }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.getByRole('link', { name: 'Pratica', exact: true }).click();
  await page.getByLabel('Che cosa vuoi praticare?').fill('Borrador offline');
  await page
    .getByRole('button', { name: 'Salva la nota', exact: true })
    .click();
  await expect(
    page.getByText('Guardado en este dispositivo', { exact: true }),
  ).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel('Che cosa vuoi praticare?')).toHaveValue(
    'Borrador offline',
  );
  await page.getByLabel('Che cosa vuoi praticare?').fill('Revisión sin red');
  await page
    .getByRole('button', { name: 'Salva la nota', exact: true })
    .click();
  await expect(
    page.getByText('Guardado en este dispositivo', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Che cosa vuoi praticare?')).toHaveValue(
    'Revisión sin red',
  );
  await page.getByRole('link', { name: 'Progressi', exact: true }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Il primo passo ti aspetta',
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const cacheUrls = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const name of await caches.keys())
      for (const req of await (await caches.open(name)).keys())
        urls.push(req.url);
    return urls;
  });
  expect(cacheUrls.some((url) => url.includes('/api/'))).toBe(false);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: 'test-results/shell-mobile.png',
    fullPage: true,
  });
  await expect(page.locator('.sync-status')).not.toContainText(
    'Failed to fetch',
  );
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('main')).toBeFocused();
  await page.screenshot({
    path: 'test-results/shell-desktop.png',
    fullPage: true,
  });
});
test('two devices restore synced drafts, preserve forks and recover after access revocation', async ({
  browser,
}) => {
  test.skip(
    !accessCode,
    'Set E2E_ACCESS_CODE and matching Worker secrets to run authenticated integration.',
  );
  const a = await browser.newContext();
  const b = await browser.newContext();
  const pa = await a.newPage();
  const pb = await b.newPage();
  await pa.goto('/');
  await link(pa);
  await pa.getByRole('link', { name: 'Pratica', exact: true }).click();
  const text = 'Compartido ' + Date.now();
  await pa.getByLabel('Che cosa vuoi praticare?').fill(text);
  await pa.getByRole('button', { name: 'Salva la nota', exact: true }).click();
  await expect(pa.locator('.sync-status')).toHaveText('Sincronizado');
  await pb.goto('/');
  await link(pb);
  await pb.getByRole('link', { name: 'Pratica', exact: true }).click();
  await pb.getByRole('button', { name: text, exact: true }).click();
  await expect(pb.getByLabel('Che cosa vuoi praticare?')).toHaveValue(text);
  await a.setOffline(true);
  await b.setOffline(true);
  await pa.getByLabel('Che cosa vuoi praticare?').fill(text + ' A');
  await pa.getByRole('button', { name: 'Salva la nota', exact: true }).click();
  await expect(
    pa.getByText('Guardado en este dispositivo', { exact: true }),
  ).toBeVisible();
  await pb.getByLabel('Che cosa vuoi praticare?').fill(text + ' B');
  await pb.getByRole('button', { name: 'Salva la nota', exact: true }).click();
  await expect(
    pb.getByText('Guardado en este dispositivo', { exact: true }),
  ).toBeVisible();
  await a.setOffline(false);
  await expect(pa.locator('.sync-status')).toHaveText('Sincronizado');
  await b.setOffline(false);
  await expect(pb.locator('.sync-status')).toHaveText('Sincronizado');
  await pb.getByRole('button', { name: 'Cerca le note salvate' }).click();
  await expect(
    pb.getByRole('button', { name: text + ' A', exact: true }),
  ).toBeVisible();
  await expect(
    pb.getByRole('button', { name: text + ' B', exact: true }),
  ).toBeVisible();
  await pb.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await pb
    .getByRole('button', {
      name: 'Cerrar acceso en este dispositivo',
      exact: true,
    })
    .click();
  await expect(pb.locator('.sync-status')).toContainText('Acceso cerrado');
  await pb.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await expect(pb.getByLabel('Che cosa vuoi praticare?')).toHaveValue(
    text + ' B',
  );
  await link(pb);
  await expect(pb.locator('.sync-status')).toHaveText('Sincronizado');
  await a.close();
  await b.close();
});
