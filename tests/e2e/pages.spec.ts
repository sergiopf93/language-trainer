import { test, expect, assetPath } from './publication';
test('Pages publishes compiled assets and a scoped offline shell', async ({
  page,
  request,
  context,
}) => {
  test.skip(!process.env.E2E_APP_BASE, 'Pages publication only');
  const base = process.env.E2E_APP_BASE!;
  const consoleErrors: string[] = [];
  const failedAssets: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('response', (response) => {
    if (
      response.status() >= 400 &&
      /\.(js|css|webmanifest|png|svg)(\?|$)/.test(response.url())
    )
      failedAssets.push(response.url());
  });
  const html = await request.get(base);
  expect(html.status()).toBe(200);
  const text = await html.text();
  expect(text).not.toContain('/src/main.ts');
  expect(text).toContain(base + 'assets/');
  for (const path of [
    ...text.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g),
  ].map((match) => match[1])) {
    const asset = await request.get(path);
    expect(asset.status()).toBe(200);
    expect(asset.headers()['content-type']).toMatch(/javascript|css/);
  }
  const manifest = await (
    await request.get(assetPath('manifest.webmanifest'))
  ).json();
  expect(manifest.scope).toBe(base);
  expect(manifest.start_url).toBe(base);
  expect(manifest.id).toBe(base);
  for (const icon of manifest.icons)
    expect(icon.src.startsWith(base)).toBe(true);
  await page.goto('/library');
  await expect(
    page.getByRole('searchbox', { name: 'Buscar en la Biblioteca' }),
  ).toBeVisible();
  const libraryUrl = page.url();
  await page.locator('.skip').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(page.url()).toBe(libraryUrl);
  await page.getByRole('link', { name: 'Pratica', exact: true }).click();
  await expect(page).toHaveURL(/#\/practice$/);
  await page.goBack();
  await expect(
    page.getByRole('searchbox', { name: 'Buscar en la Biblioteca' }),
  ).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  expect(
    await page.evaluate(
      async () => (await navigator.serviceWorker.ready).scope,
    ),
  ).toBe(new URL(base, page.url()).href);
  await page.reload();
  await expect(page.locator('.concept-grid')).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole('searchbox', { name: 'Buscar en la Biblioteca' }),
  ).toBeVisible();
  expect(failedAssets).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
