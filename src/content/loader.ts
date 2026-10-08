import { ContentRepository } from './catalog';
import type { LanguagePack } from './model';
import { validatePack } from './validate';
import { instantiate } from './templates';
export function loadLanguagePack(pack: LanguagePack, allowCandidates = false) {
  const errors = validatePack(pack);
  if (errors.length) throw new Error(errors.join('\n'));
  const derived = new Map(
    pack.templates.flatMap((t) =>
      t.variants.map(
        (v) => [v.source.id, instantiate(pack, t.id, v.key)] as const,
      ),
    ),
  );
  // Preserve authored IDs and order while substituting deterministic instances.
  const activities = pack.canonicalActivities.map(
    (a) => derived.get(a.id) ?? a,
  );
  const repository = new ContentRepository(
    pack.id,
    pack.version,
    pack.topics,
    pack.concepts,
    pack.relations,
    activities,
    allowCandidates,
  );
  return {
    pack,
    repository,
    theory: (id: string) => {
      const t = pack.theories[id];
      return repository.concept(id) && t && repository.allowed(t.status)
        ? t
        : undefined;
    },
  };
}
