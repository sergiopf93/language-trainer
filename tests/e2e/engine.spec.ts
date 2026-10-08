import { test, expect } from '@playwright/test';
test('new interactions: keyboard ordering, matching reload and all feedback', async ({
  page,
}) => {
  await page.goto('/practice?concept=it-a1-c04-01');
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Controlla', exact: true }).click();
    await page.getByRole('button', { name: 'Continua', exact: true }).click();
  }
  const noi = page.getByRole('button', { name: 'noi', exact: true });
  await noi.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('button', { name: 'siamo', exact: true }).click();
  await page.getByRole('button', { name: 'Annulla ultima parola' }).click();
  await expect(page.locator('.ordered-answer')).toHaveText('noi');
  await page.reload();
  await expect(page.locator('.ordered-answer')).toHaveText('noi');
  await page.getByRole('button', { name: 'siamo', exact: true }).click();
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: 'test-results/engine-ordering-mobile.png',
    fullPage: true,
  });
  const check = async () => {
    await page.getByRole('button', { name: 'Controlla', exact: true }).click();
    await expect(page.locator('.feedback-symbol')).toHaveText('✓');
    await page.getByRole('button', { name: 'Continua', exact: true }).click();
  };
  await check();
  await page.getByLabel('La tua risposta').fill('noi siamo');
  await check();
  await page.getByLabel('sono', { exact: true }).check();
  await check();
  await page.getByLabel('La tua risposta').fill('noi siamo');
  await check();
  await page.getByLabel('La tua risposta').fill('noi siamo');
  await check();
  await page.getByLabel('io', { exact: true }).selectOption('1');
  await page.getByLabel('tu', { exact: true }).selectOption('2');
  await page.reload();
  await expect(page.getByLabel('io', { exact: true })).toHaveValue('1');
  await expect(page.getByLabel('tu', { exact: true })).toHaveValue('2');
  await page.getByLabel('noi', { exact: true }).selectOption('0');
  await page.screenshot({
    path: 'test-results/engine-matching-mobile.png',
    fullPage: true,
  });
  await check();
  await page.getByLabel('La tua risposta').fill('sono io');
  await check();
  await page.getByLabel('nessun errore', { exact: true }).check();
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(page.locator('.feedback-symbol')).toHaveText('✓');
  await page
    .getByRole('button', { name: 'Termina la sessione', exact: true })
    .click();
  await expect(
    page.getByText('11 di 18 esercizi · 11 tentativi.'),
  ).toBeVisible();
});
test('typo is a visible cross, survives reload and remains separate from linguistic error', async ({
  page,
}) => {
  await page.goto('/practice?concept=it-a1-c03-01');
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: 'Controlla', exact: true }).click();
    await page.getByRole('button', { name: 'Continua', exact: true }).click();
  }
  await page.getByLabel('La tua risposta').fill('noe');
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Quasi!', exact: true }),
  ).toBeVisible();
  await expect(page.locator('.feedback-symbol')).toHaveText('✕');
  await expect(page.locator('.feedback')).toContainText('Has escrito “noe”');
  await page.screenshot({
    path: 'test-results/engine-typo-mobile.png',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await page.getByLabel('La tua risposta').fill('voi');
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Da rivedere', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Riprova', exact: true }).click();
  await page.getByLabel('La tua risposta').fill('noi');
  await page.getByRole('button', { name: 'Controlla', exact: true }).click();
  await expect(page.locator('.feedback-symbol')).toHaveText('✓');
  await expect(page.locator('.feedback')).toContainText('Con aiuto');
});
