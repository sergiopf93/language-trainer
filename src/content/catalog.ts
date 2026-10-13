import {
  validActivity,
  type Activity,
  type EditorialStatus,
  type Dimension,
  type ExerciseFamily,
} from '../../shared/learning';
import type { Editorial } from './model';
export interface Topic {
  id: string;
  packId: string;
  title: string;
  version: string;
}
export interface Concept extends Editorial {
  targetLanguage?: string;
  supportLanguage?: string;
  cefr?: string;
  facets?: string[];
  compatibleFamilies?: ExerciseFamily[];
  coverage?: 'partial' | 'complete';
  id: string;
  topicId: string;
  version: string;
  title: string;
  objective: string;
  scope: string;
  exclusions: string;
  dimensions: Dimension[];
}
export interface ConceptRelation {
  from: string;
  to: string;
  type:
    | 'prerequisite'
    | 'related'
    | 'contrast'
    | 'reinforces'
    | 'supports'
    | 'contrasts';
  strength?: 'recommended' | 'required';
  reason: string;
}
export class ContentRepository {
  constructor(
    readonly packId: string,
    readonly version: string,
    readonly topics: Topic[],
    readonly concepts: Concept[],
    readonly relations: ConceptRelation[],
    readonly activities: Activity[],
    readonly allowCandidates = false,
  ) {
    if (activities.some((a) => !validActivity(a)))
      throw new Error('Actividad incompatible.');
    const ids = new Set(concepts.map((c) => c.id));
    if (
      ids.size !== concepts.length ||
      new Set(topics.map((t) => t.id)).size !== topics.length ||
      new Set(activities.map((a) => a.id)).size !== activities.length
    )
      throw new Error('IDs de catálogo duplicados.');
    if (
      topics.some((t) => t.packId !== packId) ||
      concepts.some((c) => !topics.some((t) => t.id === c.topicId)) ||
      activities.some(
        (a) =>
          !concepts.some(
            (c) => c.id === a.conceptId && c.version === a.conceptVersion,
          ),
      )
    )
      throw new Error('Referencias curriculares inválidas.');
    if (relations.some((r) => !ids.has(r.from) || !ids.has(r.to)))
      throw new Error('Relación huérfana.');
    const visit = (id: string, path: Set<string>) => {
      if (path.has(id)) throw new Error('Ciclo de prerrequisitos.');
      for (const r of relations.filter(
        (r) => r.from === id && r.type === 'prerequisite',
      ))
        visit(r.to, new Set([...path, id]));
    };
    for (const id of ids) visit(id, new Set());
  }
  connections(
    id: string,
    direction: 'outgoing' | 'incoming' | 'both' = 'both',
  ) {
    return this.relations.filter(
      (r) =>
        (direction !== 'incoming' && r.from === id) ||
        (direction !== 'outgoing' && r.to === id),
    );
  }
  prerequisites(id: string) {
    return this.connections(id, 'outgoing').filter(
      (r) => r.type === 'prerequisite',
    );
  }
  available() {
    return this.concepts.filter((c) => this.allowed(c.status));
  }
  allowed(status: EditorialStatus) {
    return (
      status === 'published' ||
      (this.allowCandidates &&
        (status === 'candidate' || status === 'reviewed'))
    );
  }
  concept(id: string) {
    return this.available().find((c) => c.id === id);
  }
  select(id: string) {
    const c = this.concept(id);
    return c
      ? this.activities.filter(
          (a) =>
            a.conceptId === id &&
            a.conceptVersion === c.version &&
            a.status === c.status &&
            this.allowed(a.status),
        )
      : [];
  }
}
