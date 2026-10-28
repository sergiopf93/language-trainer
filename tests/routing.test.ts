import { describe, it, expect } from 'vitest';
import { appUrl, routeLocation } from '../src/routing';
describe('publication routes', () => {
  it('preserves root-host paths and queries', () => {
    const url = new URL('https://example.test/practice?session=one');
    expect(appUrl('/practice?session=one', '/')).toBe('/practice?session=one');
    expect(routeLocation(url, '/')).toBe(url);
  });
  it('keeps Pages navigation and search within the repository fragment', () => {
    const path = appUrl('/library?q=essere&type=concept', '/language-trainer/');
    expect(path).toBe('/language-trainer/#/library?q=essere&type=concept');
    const route = routeLocation(
      new URL(path, 'https://example.test'),
      '/language-trainer/',
    );
    expect(route.pathname).toBe('/library');
    expect(route.searchParams.get('q')).toBe('essere');
  });
  it('opens the home page from the Pages root or a skip anchor', () => {
    for (const path of ['/language-trainer/', '/language-trainer/#main']) {
      expect(
        routeLocation(
          new URL(path, 'https://example.test'),
          '/language-trainer/',
        ).pathname,
      ).toBe('/');
    }
  });
});
