import type { Activity } from '../../shared/learning';
import type { Fact } from '../../shared/protocol';
import type { ContentRepository } from '../content/catalog';
import { reviewPlans } from '../review/engine';
import { mixedGroups, type MixedGroup } from './manifest';
export const mixedPolicyVersion = 'mixed-v1';
export interface MixedPlan {
  groupId: string;
  conceptIds: string[];
  reasons: string[];
  reason: string;
  activities: Activity[];
  freshActivities: number;
  priority: number;
  lastSession: string;
}
export function eligibleMixedActivities(
  catalog: ContentRepository,
  group: MixedGroup,
) {
  return group.items.flatMap((item) => {
    const a = catalog
      .select(item.conceptId)
      .find((a) => a.id === item.id && a.version === item.version);
    return a &&
      a.task &&
      a.task.context.trim() &&
      [
        'discrimination',
        'contextual-use',
        'retrieval',
        'comprehension',
      ].includes(a.dimension) &&
      !/completa con|usando (essere|avere)|usa (essere|avere)|forma di (essere|avere)/i.test(
        a.prompt,
      )
      ? [a]
      : [];
  });
}
// All prerequisite nodes must have been introduced, including recommended preparation.
export function mixedPrerequisites(
  catalog: ContentRepository,
  id: string,
): string[] {
  const ids = new Set<string>();
  const visit = (current: string) => {
    for (const r of catalog.prerequisites(current)) {
      if (!ids.has(r.to)) {
        ids.add(r.to);
        visit(r.to);
      }
    }
  };
  visit(id);
  return [...ids].sort();
}
function orderKey(id: string, seed: number) {
  let value = (2166136261 ^ seed) >>> 0;
  for (const c of id)
    value = Math.imul(value ^ c.charCodeAt(0), 16777619) >>> 0;
  return value;
}
export function mixedPlans(
  catalog: ContentRepository,
  facts: readonly Fact[],
  now: Date,
): MixedPlan[] {
  const all = [...new Map(facts.map((f) => [f.id, f])).values()];
  const reviews = reviewPlans(catalog, all, now);
  const introduced = new Map(reviews.map((p) => [p.conceptId, p]));
  const roots = all.filter(
    (f) =>
      f.kind === 'practice-session' &&
      f.payload.packId === catalog.packId &&
      catalog.allowed(f.payload.contentStatus),
  );
  const rootsById = new Map(roots.map((f) => [f.id, f]));
  const last = new Map<string, string>();
  for (const f of all) {
    if (f.kind !== 'attempt' || !rootsById.has(f.payload.sessionId)) continue;
    const key = f.payload.activityId + ':' + f.payload.activityVersion;
    if ((last.get(key) ?? '') < f.occurredAt) last.set(key, f.occurredAt);
  }
  return mixedGroups
    .flatMap((group): MixedPlan[] => {
      if (
        !group.conceptIds.every(
          (id) =>
            introduced.has(id) &&
            mixedPrerequisites(catalog, id).every((p) => introduced.has(p)),
        )
      )
        return [];
      const pool = eligibleMixedActivities(catalog, group);
      if (
        !group.conceptIds.every(
          (id) => pool.filter((a) => a.conceptId === id).length >= 2,
        )
      )
        return [];
      // Uniform editorial status keeps the existing session/sync contract conservative.
      if (new Set(pool.map((a) => a.status)).size !== 1) return [];
      const previous = roots.filter(
        (f) =>
          f.kind === 'practice-session' &&
          f.payload.mode === 'mixed' &&
          f.payload.mixed?.groupId === group.id,
      );
      const time = (a: Activity) => last.get(a.id + ':' + a.version) ?? '';
      pool.sort(
        (a, b) =>
          Number(!!time(a)) - Number(!!time(b)) ||
          time(a).localeCompare(time(b)) ||
          orderKey(a.id, previous.length) - orderKey(b.id, previous.length) ||
          a.id.localeCompare(b.id),
      );
      const chosen: Activity[] = [];
      // Two opportunities per concept, then fill a short session from the same coherent group.
      for (const id of group.conceptIds)
        chosen.push(...pool.filter((a) => a.conceptId === id).slice(0, 2));
      for (const a of pool)
        if (chosen.length < 6 && !chosen.includes(a)) chosen.push(a);
      chosen.sort(
        (a, b) =>
          orderKey(a.id, previous.length + 97) -
            orderKey(b.id, previous.length + 97) || a.id.localeCompare(b.id),
      );
      const plans = group.conceptIds.map((id) => introduced.get(id)!);
      const reasons = plans.map(
        (p) =>
          p.reason +
          (p.due
            ? ' Verifica differita disponibile.'
            : ' Esperienza recente: utile anche per scegliere in contesto.'),
      );
      return [
        {
          groupId: group.id,
          conceptIds: [...group.conceptIds],
          reasons,
          reason:
            'Concetti già introdotti e collegati per significato. Priorità alle difficoltà osservate, poi agli inviti di ripasso; a parità, ruotano i gruppi. Prima le attività non ancora risposte. I dettagli sono nel riepilogo.',
          activities: chosen,
          freshActivities: chosen.filter((a) => !time(a)).length,
          priority: Math.min(...plans.map((p) => p.priority)),
          lastSession:
            previous
              .map((f) => f.occurredAt)
              .sort()
              .at(-1) ?? '',
        },
      ];
    })
    .sort(
      (a, b) =>
        a.priority - b.priority ||
        a.lastSession.localeCompare(b.lastSession) ||
        a.groupId.localeCompare(b.groupId),
    );
}
