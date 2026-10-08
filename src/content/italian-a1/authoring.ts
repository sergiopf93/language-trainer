import type { Activity, Skill } from '../../../shared/learning';
import type { Concept } from '../catalog';
import type { Theory } from '../theory';
export const batchVersion = 'it-A1-candidate-5';
export const provenance =
  'Candidate de R2: Research 02 C01–C05 y A1_COVERAGE_MATRIX. Ejemplos originales; revisión editorial independiente pendiente.';
export const sources = {
  spelling:
    'https://www.treccani.it/enciclopedia/segni-diacritici_(La-grammatica-italiana)/',
  accent:
    'https://www.treccani.it/enciclopedia/accento_(La-grammatica-italiana)/',
  doubles:
    'https://www.treccani.it/enciclopedia/lettere-doppie_(Enciclopedia-dell%27Italiano)/',
  subject:
    'https://www.treccani.it/enciclopedia/pronomi-personali_(La-grammatica-italiana)/',
  essere: 'https://www.treccani.it/vocabolario/essere1/',
  avere: 'https://www.treccani.it/vocabolario/avere/',
};
export type Item = {
  key: string;
  format: Activity['format'];
  prompt: string;
  accepted: string[];
  rejected?: string[];
  options?: string[];
  hint: string;
  explanation: string;
  context: string;
  facets: string[];
  skill?: Skill;
  matchingPrompts?: string[];
};
export interface Lesson {
  code: string;
  title: string;
  objective: string;
  introduction: string;
  rules: string[];
  forms: [string, string][];
  examples: [string, string][];
  frequentErrors: string[];
  usageNotes: string[];
  exceptions?: string[];
  contrasts?: { conceptId: string; explanation: string }[];
  vocabularyIds: string[];
  facets: string[];
  source: string;
  items: Item[];
}
export const conceptId = (code: string) => 'it-a1-c' + code;
export function materialize(lesson: Lesson) {
  const id = conceptId(lesson.code);
  const lessonProvenance =
    Number(lesson.code.slice(0, 2)) >= 6
      ? 'Candidate de R2: Research 02 C06–C10 y A1_COVERAGE_MATRIX. Ejemplos originales; revisión editorial independiente pendiente.'
      : provenance;
  const version = ['03-01', '04-01'].includes(lesson.code) ? '2' : '1';
  const activities: Activity[] = lesson.items.map((item) => {
    const format = item.format;
    const family: Activity['family'] = [
      'selection',
      'error-detection',
    ].includes(format)
      ? 'F1'
      : ['transformation', 'error-correction'].includes(format)
        ? 'F3'
        : ['ordering', 'matching'].includes(format)
          ? 'F7'
          : ['translation', 'controlled-production'].includes(format)
            ? 'F4'
            : 'F2';
    const skill: Skill =
      item.skill ??
      (format === 'selection' || format === 'matching'
        ? 'recognition'
        : format === 'error-detection'
          ? 'discrimination'
          : family === 'F3'
            ? 'transformation'
            : family === 'F4' || format === 'ordering'
              ? 'controlled-production'
              : 'retrieval');
    return {
      id: `${id}-${item.key}`,
      version: '1',
      conceptId: id,
      conceptVersion: version,
      family,
      format,
      prompt: item.prompt,
      options: item.options ?? [],
      hint: item.hint,
      explanation: item.explanation,
      dimension:
        skill === 'recognition'
          ? 'comprehension'
          : skill === 'discrimination'
            ? 'discrimination'
            : skill === 'controlled-production'
              ? 'contextual-use'
              : 'retrieval',
      task: {
        skill,
        context: item.context,
        facets: item.facets,
        opportunityId: `${id}-${item.key}:target`,
        scaffolding: item.options?.length ? 'visible-options' : 'none',
        matchingPrompts: item.matchingPrompts ?? [],
      },
      criterion: {
        version: '1',
        canonVersion: batchVersion,
        accepted: item.accepted,
        rejected: item.rejected ?? [],
        exhaustive: [
          'selection',
          'error-detection',
          'matching',
          'ordering',
        ].includes(format),
      },
      status: 'candidate',
      provenance: `${lessonProvenance} ${lesson.source}`,
    };
  });
  const concept: Concept = {
    id,
    version,
    topicId: `it-a1-t${lesson.code.slice(0, 2)}`,
    title: lesson.title,
    objective: lesson.objective,
    scope: lesson.objective,
    exclusions:
      'Sin evaluación oral automática ni escritura libre. Reading/Writing extensos y reservas de Review pendientes de sus fases. Revisión editorial pendiente.',
    dimensions: [...new Set(activities.map((a) => a.dimension))],
    status: 'candidate',
    provenance: `${lessonProvenance} ${lesson.source}`,
    targetLanguage: 'it',
    supportLanguage: 'es',
    cefr: 'A1',
    facets: lesson.facets,
    compatibleFamilies: [...new Set(activities.map((a) => a.family))],
    coverage: 'complete',
  };
  const theory: Theory = {
    id: `it-a1-theory-c${['03-01', '04-01'].includes(lesson.code) ? lesson.code.slice(0, 2) : lesson.code}`,
    version: `theory-c${lesson.code}-${version}`,
    conceptId: id,
    conceptVersion: version,
    targetLanguage: 'it',
    supportLanguage: 'es',
    title: lesson.title,
    goal: lesson.objective,
    introduction: lesson.introduction,
    rules: lesson.rules,
    forms: lesson.forms,
    examples: lesson.examples,
    frequentErrors: lesson.frequentErrors,
    usageNotes: lesson.usageNotes,
    exceptions: lesson.exceptions ?? [],
    contrasts: lesson.contrasts ?? [],
    vocabularyIds: lesson.vocabularyIds,
    status: 'candidate',
    provenance: `${lessonProvenance} ${lesson.source}`,
  };
  return { concept, theory, activities };
}
