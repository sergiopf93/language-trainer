import { writing } from './ui/pages/writing';
import './ui/styles.css';
import { LocalStore } from './persistence/local';
import { SyncClient } from './sync/client';
import { button, el, message } from './ui/dom';
import { home } from './ui/pages/home';
import { reading } from './ui/pages/reading';
import { practice } from './ui/pages/practice';
import { library } from './ui/pages/library';
import { progress } from './ui/pages/progress';
import { conceptDetail } from './ui/pages/concept';
import { copy, language } from './ui/language';
import { settings } from './ui/settings';
async function start() {
  document.documentElement.lang = language.targetLanguage;
  const app = document.querySelector<HTMLDivElement>('#app')!;
  const store = await LocalStore.open();
  const header = el('header');
  const brand = el('a', 'italiano', 'brand');
  brand.href = '/';
  const badge = el('span', 'IL TUO SPAZIO A1', 'eyebrow');
  const status = el('p', 'Guardado en este dispositivo', 'sync-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const sync = new SyncClient(store, () => {
    status.textContent = sync.detail;
    status.dataset.state = sync.state;
  });
  const dialog = settings(store, sync);
  dialog.lang = language.supportLanguage;
  status.lang = language.supportLanguage;
  header.append(
    brand,
    badge,
    button('Impostazioni', () => dialog.showModal(), true),
  );
  const main = el('main');
  main.id = 'main';
  main.tabIndex = -1;
  const nav = el('nav');
  nav.setAttribute('aria-label', 'Navigazione principale');
  for (const [path, label] of [
    ['/', copy.home],
    ['/practice', copy.practice],
    ['/library', copy.library],
    ['/progress', copy.progress],
  ]) {
    const link = el('a', label);
    link.href = path;
    nav.append(link);
  }
  app.append(header, status, main, nav, dialog);
  let isDirty = () => false;
  let routeVersion = 0;
  let activePath = location.pathname + location.search;
  history.scrollRestoration = 'manual';
  const render = async (focus = false) => {
    const changedView = activePath !== location.pathname + location.search;
    const version = ++routeVersion;
    let page: HTMLElement;
    isDirty = () => false;
    switch (location.pathname) {
      case '/':
        page = await home(store);
        break;
      case '/practice': {
        const result = await practice(store, () => {
          activePath = location.pathname + location.search;
          void sync.run();
        });
        page = result.page;
        isDirty = result.isDirty;
        break;
      }
      case '/concept':
        page = await conceptDetail(
          store,
          () => {
            void sync.run();
          },
          (id) => {
            history.pushState({}, '', '/practice?session=' + id);
            void render(true);
          },
        );
        break;
      case '/writing':
        page = await writing(store);
        break;
      case '/reading':
        page = await reading(store);
        break;
      case '/library':
        page = await library(store);
        break;
      case '/progress':
        page = await progress(store);
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
    activePath = location.pathname + location.search;
    document.title =
      (page.querySelector('h1')?.textContent ?? 'Italiano') + ' · Italiano';
    nav.querySelectorAll('a').forEach((link) => {
      if (
        new URL(link.href).pathname ===
        (location.pathname === '/concept'
          ? '/library'
          : ['/reading', '/writing'].includes(location.pathname)
            ? '/practice'
            : location.pathname)
      )
        link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    if (focus) main.focus({ preventScroll: true });
    if (changedView) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
    history.pushState({}, '', anchor.pathname + anchor.search);
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
