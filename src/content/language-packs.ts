export interface LanguagePack {
  id: string;
  targetLanguage: string;
  explanationLanguage: string;
  version: string;
  publishedConcepts: readonly string[];
}
export const italian: LanguagePack = {
  id: 'it-A1',
  targetLanguage: 'it',
  explanationLanguage: 'es',
  version: 'foundation-v1',
  publishedConcepts: [],
};
