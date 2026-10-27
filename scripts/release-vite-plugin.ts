import type { Plugin } from 'vite';
import { relative } from 'node:path';
// @ts-expect-error Build-only Node module; never shipped to the browser.
import { createReleaseModules } from './release-content.mjs';

export function releaseContentPlugin(): Plugin {
  let root = '';
  let modules: Map<string, string> = new Map();
  return {
    name: 'approved-v1-content',
    enforce: 'pre',
    apply: (_config, env) => env.command === 'build' && env.mode === 'release',
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      modules = await createReleaseModules(root);
    },
    generateBundle(_options, bundle) {
      const shippedModules = new Set(
        Object.values(bundle).flatMap((asset) =>
          asset.type === 'chunk' ? Object.keys(asset.modules) : [],
        ),
      );
      for (const id of shippedModules) {
        const path = relative(root, id.split('?')[0]).replaceAll('\\', '/');
        if (
          path === 'src/content/validation-fixture.ts' ||
          (path.startsWith('src/content/italian-a1/') &&
            path !== 'src/content/italian-a1/course.ts')
        ) {
          this.error(
            `Fuente de autoría no autorizada en bundle público: ${path}`,
          );
        }
      }
      this.info(
        `Release: ${shippedModules.size} módulos verificados; sin fixtures ni fuentes de autoría curricular.`,
      );
    },
    load(id) {
      const key = relative(root, id.split('?')[0]).replaceAll('\\', '/');
      return modules.get(key) ?? null;
    },
  };
}
