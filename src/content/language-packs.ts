import { italianPack } from './validation-fixture';
export type { LanguagePack } from './model';
export const italian = {
  id: italianPack.id,
  targetLanguage: italianPack.targetLanguage,
  explanationLanguage: italianPack.supportLanguage,
  version: italianPack.version,
  publishedConcepts: italianPack.concepts
    .filter((c) => c.status === 'published')
    .map((c) => c.id),
};
