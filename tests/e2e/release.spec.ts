import { appPath, assetPath, test, expect } from './publication';
test('release serves approved content, PWA assets and local-only settings', async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(
    process.env.E2E_RELEASE !== '1',
    'Only the approved release build.',
  );
  const apiCalls: string[] = [];
  page.on('request', (r) => {
    if (new URL(r.url()).pathname.startsWith('/api/')) apiCalls.push(r.url());
  });
  await page.goto('/library');
  await expect(
    page.getByRole('link', { name: 'Scopri il concetto', exact: true }),
  ).toHaveCount(99);
  await expect(page.locator('.sync-status')).toContainText(
    'Sin sincronización remota',
  );
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Descargar respaldo', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('Restaurar un respaldo', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Vincular dispositivo', exact: true }),
  ).toHaveCount(0);
  expect(apiCalls).toEqual([]);
  const manifest = await request.get(assetPath('/manifest.webmanifest'));
  expect(manifest.ok()).toBe(true);
  const data = await manifest.json();
  expect(data.display).toBe('standalone');
  for (const icon of data.icons)
    expect((await request.get(icon.src)).ok()).toBe(true);
  const sw = await request.get(assetPath('/sw.js'));
  expect(sw.ok()).toBe(true);
  expect(sw.headers()['content-type']).toMatch(/javascript/);
  await page.evaluate(() => navigator.serviceWorker.ready);
  if (baseURL?.startsWith('https:')) {
    expect(await page.evaluate(() => window.isSecureContext)).toBe(true);
    if (!process.env.E2E_APP_BASE) {
      expect(sw.headers()['cache-control']).toContain('no-cache');
      expect((await request.get('/')).headers()['x-content-type-options']).toBe(
        'nosniff',
      );
    }
  }
});

test('release backup restores a published session in a separate browser profile', async ({
  page,
  browser,
  baseURL,
}, info) => {
  test.skip(
    process.env.E2E_RELEASE !== '1',
    'Only the approved release build.',
  );
  await page.goto('/practice?concept=it-a1-c04-01');
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  await page.getByLabel('sono', { exact: true }).check();
  await expect(
    page.getByText('Pratica salvata su questo dispositivo', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Impostazioni', exact: true }).click();
  const download = page.waitForEvent('download');
  await page
    .getByRole('button', { name: 'Descargar respaldo', exact: true })
    .click();
  const path = info.outputPath('release-backup.json');
  await (await download).saveAs(path);
  const restored = await browser.newContext({ baseURL });
  try {
    const other = await restored.newPage();
    await other.goto(appPath('/'));
    await other
      .getByRole('button', { name: 'Impostazioni', exact: true })
      .click();
    other.on('dialog', (d) => d.accept());
    await other.locator('#backup').setInputFiles(path);
    await expect(
      other.getByText(
        'Respaldo incorporado. Se conserva el historial anterior.',
        { exact: true },
      ),
    ).toBeVisible();
    await other.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await other.getByRole('link', { name: 'Pratica', exact: true }).click();
    await other.getByRole('link', { name: /^Continua:/ }).click();
    await expect(other.getByLabel('sono', { exact: true })).toBeChecked();
    await other.getByRole('button', { name: 'Controlla', exact: true }).click();
    await expect(other.locator('.feedback-symbol')).toHaveText('✓');
  } finally {
    await restored.close();
  }
});
