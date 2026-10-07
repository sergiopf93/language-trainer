import './ui/styles.css';
import { LocalStore } from './persistence/local';
import { SyncClient } from './sync/client';
import { button, el, message } from './ui/dom';
import { home } from './ui/pages/home';
import { practice } from './ui/pages/practice';
import { library } from './ui/pages/library';
import { progress } from './ui/pages/progress';
import { settings } from './ui/settings';
async function start() {
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const store = await LocalStore.open();
  const header = el('header');
  const brand = el('a', 'italiano', 'brand');
  brand.href = '/';
  const badge = el('span', 'TU ESPACIO A1', 'eyebrow');
  const status = el('p', 'Guardado en este dispositivo', 'sync-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const sync = new SyncClient(store, () => {
    status.textContent = sync.detail;
    status.dataset.state = sync.state;
  });
  const dialog = settings(store, sync);
  header.append(
    brand,
    badge,
    button('Ajustes', () => dialog.showModal(), true),
  );
  const main = el('main');
  main.id = 'main';
  main.tabIndex = -1;
  const nav = el('nav');
  nav.setAttribute('aria-label', 'Navegación principal');
  for (const [path, label] of [
    ['/', 'Inicio'],
    ['/practice', 'Practicar'],
    ['/library', 'Biblioteca'],
    ['/progress', 'Progreso'],
  ]) {
    const link = el('a', label);
    link.href = path;
    nav.append(link);
  }
  app.append(header, status, main, nav, dialog);
  let isDirty = () => false;
  let routeVersion = 0;
  let activePath = location.pathname;
  const render = async (focus = false) => {
    const version = ++routeVersion;
    let page: HTMLElement;
    isDirty = () => false;
    switch (location.pathname) {
      case '/':
        page = home();
        break;
      case '/practice': {
        const result = await practice(store, () => void sync.run());
        page = result.page;
        isDirty = result.isDirty;
        break;
      }
      case '/library':
        page = library();
        break;
      case '/progress':
        page = progress();
        break;
      default:
        page = el('section');
        page.append(el('h1', 'Esta página no existe'));
        const link = el('a', 'Volver al inicio');
        link.href = '/';
        page.append(link);
    }
    if (version !== routeVersion) return;
    main.replaceChildren(page);
    activePath = location.pathname;
    document.title =
      (page.querySelector('h1')?.textContent ?? 'Italiano') + ' · Italiano';
    nav.querySelectorAll('a').forEach((link) => {
      if (new URL(link.href).pathname === location.pathname)
        link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focus) main.focus();
  };
  document.addEventListener('click', (event) => {
    const anchor = (event.target as Element).closest<HTMLAnchorElement>('a');
    if (
      !anchor ||
      anchor.origin !== location.origin ||
      anchor.hash ||
      anchor.download ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    if (
      isDirty() &&
      !window.confirm(
        'Hay cambios sin guardar. ¿Quieres salir de esta pantalla?',
      )
    )
      return;
    history.pushState({}, '', anchor.pathname);
    void render(true);
  });
  window.addEventListener('popstate', () => {
    if (
      isDirty() &&
      !window.confirm(
        'Hay cambios sin guardar. ¿Quieres salir de esta pantalla?',
      )
    ) {
      history.pushState({}, '', activePath);
      return;
    }
    void render(true);
  });
  window.addEventListener('beforeunload', (event) => {
    if (isDirty()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  window.addEventListener('online', () => void sync.run());
  window.addEventListener('offline', () => void sync.run());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void sync.run();
  });
  await render();
  void sync.run();
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch {
      status.textContent +=
        ' · No se ha podido preparar el inicio sin conexión';
    }
  }
}
void start().catch((error) => {
  const app = document.querySelector('#app')!;
  app.replaceChildren(
    el('h1', 'No se puede abrir el almacenamiento local'),
    el('p', message(error)),
    el(
      'p',
      'Comprueba que tu navegador permite guardar datos para este sitio y vuelve a cargar.',
    ),
  );
});
