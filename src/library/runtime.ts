import { activeContent, catalog } from '../content/language-packs';
import { buildSearchIndex } from './search';
let index: ReturnType<typeof buildSearchIndex> | undefined;
export function libraryIndex() {
  return (index ??= buildSearchIndex(activeContent.pack, catalog));
}
