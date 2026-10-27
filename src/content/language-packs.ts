import { isRelease } from '../release';
import { italianCourse } from './italian-a1/course';
import { loadLanguagePack } from './loader';
export type { LanguagePack } from './model';
export const activeContent = loadLanguagePack(
  italianCourse,
  !isRelease &&
    (import.meta.env?.DEV ||
      import.meta.env?.VITE_ENABLE_CANDIDATE_CONTENT === 'true'),
);
export const catalog = activeContent.repository;
export const activeTheories = Object.fromEntries(
  Object.keys(italianCourse.theories).flatMap((id) => {
    const theory = activeContent.theory(id);
    return theory ? [[id, theory]] : [];
  }),
);
export const italian = {
  id: italianCourse.id,
  targetLanguage: italianCourse.targetLanguage,
  explanationLanguage: italianCourse.supportLanguage,
  version: italianCourse.version,
  publishedConcepts: italianCourse.concepts
    .filter((c) => c.status === 'published')
    .map((c) => c.id),
};
