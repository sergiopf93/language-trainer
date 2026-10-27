import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
const origin = process.env.LT_SMOKE_ORIGIN || 'http://127.0.0.1:4178';
async function facts(page) {
  return page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const r = indexedDB.open('language-trainer-v1');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    const rows = await new Promise((resolve, reject) => {
      const r = db.transaction('facts').objectStore('facts').getAll();
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    db.close();
    return rows;
  });
}
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
try {
  await page.goto(origin + '/');
  await page.getByRole('heading', { name: 'Da dove cominciamo?' }).waitFor();
  const identity = await page.request.get(origin + '/api/identity');
  if (identity.status() !== 401) throw new Error('API isolation failed');
  await page.goto(origin + '/concept?id=it-a1-c04-01');
  await page.locator('.theory-panel').waitFor();
  await page
    .getByRole('button', { name: 'Inizia la pratica', exact: true })
    .click();
  await page.getByLabel('sono', { exact: true }).check();
  await page
    .getByText('Pratica salvata su questo dispositivo', { exact: true })
    .waitFor();
  await page.evaluate(() => navigator.serviceWorker.ready);
  const before = await facts(page);
  await page.close();
  await context.setOffline(true);
  const resumed = await context.newPage();
  resumed.on('pageerror', (e) => errors.push(e.message));
  await resumed.goto(origin + '/');
  await resumed.getByRole('link', { name: /Continua la pratica/ }).click();
  if (!(await resumed.getByLabel('sono', { exact: true }).isChecked()))
    throw new Error('Draft missing');
  assert.deepEqual(await facts(resumed), before);
  await resumed.getByRole('button', { name: 'Controlla', exact: true }).click();
  await resumed.locator('.feedback').waitFor();
  await resumed.reload();
  await resumed.locator('.feedback').waitFor();
  const after = await facts(resumed);
  await context.setOffline(false);
  await resumed
    .getByRole('button', { name: 'Impostazioni', exact: true })
    .click();
  const downloadPromise = resumed.waitForEvent('download');
  await resumed
    .getByRole('button', { name: 'Descargar respaldo', exact: true })
    .click();
  const backup = await readFile(await (await downloadPromise).path());
  const restoredContext = await browser.newContext();
  const restored = await restoredContext.newPage();
  await restored.goto(origin + '/');
  await restored
    .getByRole('button', { name: 'Impostazioni', exact: true })
    .click();
  restored.on('dialog', (d) => d.accept());
  await restored
    .getByLabel('Restaurar un respaldo')
    .setInputFiles({
      name: 'validation-backup.json',
      mimeType: 'application/json',
      buffer: backup,
    });
  await restored
    .getByText('Respaldo incorporado. Se conserva el historial anterior.', {
      exact: true,
    })
    .waitFor();
  assert.deepEqual(await facts(restored), after);
  await restored.reload();
  await restored.getByRole('link', { name: /Continua la pratica/ }).click();
  await restored.locator('.feedback').waitFor();
  await restoredContext.close();
  const secure = await resumed.evaluate(() => window.isSecureContext);
  await writeFile(
    'docs/product/user-validation/preview-smoke.json',
    JSON.stringify(
      {
        origin,
        secure,
        apiStatus: identity.status(),
        reopenedOffline: true,
        draftRestored: true,
        factsPreserved: true,
        backupRestoredInFreshProfile: true,
        feedbackRestored: true,
        errors,
        physicalIPhoneTested: false,
      },
      null,
      2,
    ) + '\n',
  );
  if (errors.length) throw new Error(errors.join('\n'));
} finally {
  await browser.close();
}
