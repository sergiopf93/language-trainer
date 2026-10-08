import { test, expect } from '@playwright/test';
import { italianCourse } from '../../src/content/italian-a1/course';
for (const id of [
  'it-a1-c01-01',
  'it-a1-c02-02',
  'it-a1-c03-02',
  'it-a1-c04-03',
  'it-a1-c05-04',
  'it-a1-c06-03',
  'it-a1-c10-01',
]) {
  test(`curriculum ${id}: library, study, retrieval, reload, summary and progress`, async ({
    page,
  }) => {
    await page.goto('/library');
    await expect(
      page.getByRole('link', { name: 'Scopri il concetto', exact: true }),
    ).toHaveCount(29);
    await page.locator(`a[href="/concept?id=${id}"]`).click();
    await expect(page.locator('.theory-panel')).toBeVisible();
    await expect(page.locator('.theory-panel')).toContainText(
      italianCourse.theories[id].examples[0][0],
    );
    if (id === 'it-a1-c05-04') {
      await expect(
        page.getByRole('link', {
          name: 'Prima: Il presente di avere',
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole('link', {
          name: 'Confronta: Sono stanco, sono pronta',
          exact: true,
        }),
      ).toBeVisible();
    }
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (id === 'it-a1-c01-01' || id === 'it-a1-c05-04' || id === 'it-a1-c10-01')
      await page.screenshot({
        path: `test-results/${id}-theory.png`,
        fullPage: true,
      });
    await page
      .getByRole('button', { name: 'Inizia la pratica', exact: true })
      .click();
    const activities = italianCourse.canonicalActivities.filter(
      (a) => a.conceptId === id,
    );
    for (const [i, item] of activities.slice(0, 2).entries()) {
      const answer = item.criterion.accepted[0];
      if (item.format === 'selection')
        await page.getByLabel(answer, { exact: true }).check();
      else
        await page
          .getByLabel(
            item.format === 'cloze' ? 'Completa lo spazio' : 'La tua risposta',
            { exact: true },
          )
          .fill(answer);
      await expect(
        page.getByText('Pratica salvata su questo dispositivo', {
          exact: true,
        }),
      ).toBeVisible();
      if (i === 1) await page.reload();
      await page
        .getByRole('button', { name: 'Controlla', exact: true })
        .click();
      await expect(page.locator('.feedback-symbol')).toHaveText('✓');
      if (i === 0)
        await page
          .getByRole('button', { name: 'Continua', exact: true })
          .click();
    }
    await page
      .getByRole('button', { name: 'Termina la sessione', exact: true })
      .click();
    await expect(
      page.getByText(`2 di ${activities.length} esercizi · 2 tentativi.`, {
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: 'Vedi i progressi', exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp('/progress\\?concept=' + id));
    await expect(
      page.getByRole('heading', {
        name: italianCourse.theories[id].title,
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}
