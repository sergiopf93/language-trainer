import { test as base, expect } from '@playwright/test';
export type { Page } from '@playwright/test';
export function appPath(path: string) {
  const base = process.env.E2E_APP_BASE;
  return base ? base + '#' + path : path;
}
export function assetPath(path: string) {
  return (process.env.E2E_APP_BASE || '/') + path.replace(/^\//, '');
}
export const test = base.extend({
  page: async ({ page }, use) => {
    const goto = page.goto.bind(page);
    page.goto = (url, options) =>
      goto(url.startsWith('/') ? appPath(url) : url, options);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await use(page);
    expect(errors).toEqual([]);
  },
});
export { expect };
