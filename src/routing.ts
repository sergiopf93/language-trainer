// Pages has no SPA rewrites: keep routes inside the repository URL fragment.
export const appBase = import.meta.env.BASE_URL;
export function appUrl(path: string, base = appBase): string {
  return base === '/' ? path : base + '#' + path;
}
export function routeLocation(
  url = new URL(location.href),
  base = appBase,
): URL {
  return base === '/'
    ? url
    : new URL(url.hash.startsWith('#/') ? url.hash.slice(1) : '/', url.origin);
}
