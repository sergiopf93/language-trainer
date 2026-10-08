import type { Activity, EditorialStatus } from '../../shared/learning';
import type { Concept, ConceptRelation, Topic } from './catalog';
import type { Theory } from './theory';
export interface Reference {
  id: string;
  version: string;
}
export interface Editorial {
  status: EditorialStatus;
  provenance: string;
  review?: { reviewer: string; date: string; version: string };
  publication?: { date: string; version: string };
}
export interface Curriculum {
  id: string;
  version: string;
  language: string;
  title: string;
  levels: {
    id: string;
    cefr: string;
    title: string;
    units: {
      sourceId: string;
      topicId: string;
      title: string;
      expectedConceptIds: string[];
    }[];
  }[];
}
export interface VocabularyEntry extends Reference, Editorial {
  language: string;
  supportLanguage: string;
  lemma: string;
  displayForm: string;
  gloss: string;
  partOfSpeech: string;
  gender?: string;
  number?: string;
  forms: {
    key: string;
    text: string;
    features: Record<string, string>;
    irregular: boolean;
  }[];
  tags: string[];
  level: string;
  conceptIds: string[];
  topicIds: string[];
  examples: { target: string; support: string }[];
}
// An explicit allow-list of authored items; no Cartesian product of words/forms.
export interface ExerciseTemplate extends Reference, Editorial {
  family: Activity['family'];
  format: Activity['format'];
  concept: Reference;
  objective: string;
  constraints: string[];
  variants: {
    key: string;
    source: Reference;
    vocabulary: Reference[];
    answerFrom?: { entryId: string; formKey: string };
  }[];
}
export interface LanguagePack extends Reference, Editorial {
  targetLanguage: string;
  supportLanguage: string;
  curriculum: Curriculum;
  topics: Topic[];
  concepts: Concept[];
  relations: ConceptRelation[];
  theories: Record<string, Theory>;
  vocabulary: VocabularyEntry[];
  templates: ExerciseTemplate[];
  canonicalActivities: Activity[];
}
