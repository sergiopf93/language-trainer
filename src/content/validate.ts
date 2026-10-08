import { validActivity } from '../../shared/learning';
import { ContentRepository } from './catalog';
import type { Editorial, LanguagePack } from './model';
import { instantiate } from './templates';
export function editorialErrors(
  item: Editorial & { version: string },
): string[] {
  const errors: string[] = [];
  if (
    !item.version.trim() ||
    !item.provenance.trim() ||
    !['candidate', 'reviewed', 'published'].includes(item.status)
  )
    errors.push('metadata editorial inválida');
  if (
    item.status !== 'candidate' &&
    (!item.review?.reviewer.trim() ||
      !Number.isFinite(Date.parse(item.review.date)) ||
      item.review.version !== item.version)
  )
    errors.push('falta revisión de esta versión');
  if (
    item.status === 'published' &&
    (!item.publication ||
      item.publication.version !== item.version ||
      !Number.isFinite(Date.parse(item.publication.date)) ||
      Date.parse(item.publication.date) < Date.parse(item.review?.date ?? ''))
  )
    errors.push('publicación sin revisión previa');
  return errors;
}
export function validatePack(pack: LanguagePack): string[] {
  const errors: string[] = [];
  const check = (condition: boolean, message: string) => {
    if (!condition) errors.push(message);
  };
  const editorial = (item: Editorial & { id: string; version: string }) =>
    errors.push(...editorialErrors(item).map((e) => `${item.id}: ${e}`));
  editorial(pack);
  check(
    !!pack.id &&
      !!pack.targetLanguage &&
      !!pack.supportLanguage &&
      pack.curriculum.language === pack.targetLanguage,
    'Idioma/currículo incompatible',
  );
  check(
    !!pack.curriculum.id &&
      !!pack.curriculum.version &&
      pack.curriculum.levels.length > 0,
    'Currículo sin versión o niveles',
  );
  const units = pack.curriculum.levels.flatMap((l) => l.units);
  const expected = units.flatMap((u) => u.expectedConceptIds);
  const unique = (ids: string[], label: string) =>
    check(
      ids.every(Boolean) && new Set(ids).size === ids.length,
      `IDs duplicados/vacíos: ${label}`,
    );
  unique(
    pack.curriculum.levels.map((l) => l.id),
    'niveles',
  );
  unique(
    units.map((u) => u.topicId),
    'unidades',
  );
  unique(
    units.map((u) => u.sourceId),
    'fuentes curriculares',
  );
  unique(expected, 'inventario');
  unique(
    pack.templates.flatMap((t) => t.variants.map((v) => v.source.id)),
    'fuentes de variantes',
  );
  unique(
    pack.vocabulary.map((v) => v.id),
    'vocabulario',
  );
  unique(
    pack.templates.map((t) => t.id),
    'templates',
  );
  unique(
    Object.values(pack.theories).map((t) => t.id),
    'teoría',
  );
  try {
    new ContentRepository(
      pack.id,
      pack.version,
      pack.topics,
      pack.concepts,
      pack.relations,
      pack.canonicalActivities,
      true,
    );
  } catch (error) {
    errors.push(String(error));
  }
  for (const topic of pack.topics)
    check(
      !!topic.version && units.some((u) => u.topicId === topic.id),
      `${topic.id}: unidad inexistente`,
    );
  for (const c of pack.concepts) {
    editorial(c);
    check(
      units.some(
        (u) => u.topicId === c.topicId && u.expectedConceptIds.includes(c.id),
      ),
      `${c.id}: fuera del inventario`,
    );
    check(
      c.targetLanguage === pack.targetLanguage &&
        c.supportLanguage === pack.supportLanguage &&
        pack.curriculum.levels.some(
          (level) =>
            level.cefr === c.cefr &&
            level.units.some((unit) => unit.topicId === c.topicId),
        ) &&
        !!c.facets?.length &&
        !!c.compatibleFamilies?.length,
      `${c.id}: metadata curricular incompleta`,
    );
  }
  for (const r of pack.relations) {
    check(
      [
        'prerequisite',
        'related',
        'contrast',
        'reinforces',
        'supports',
        'contrasts',
      ].includes(r.type) &&
        r.from !== r.to &&
        !!r.reason.trim(),
      'Relación inválida',
    );
    check(
      !r.strength || ['recommended', 'required'].includes(r.strength),
      'Fuerza de prerrequisito inválida',
    );
  }
  for (const [conceptId, t] of Object.entries(pack.theories)) {
    editorial(t);
    check(
      conceptId === t.conceptId &&
        pack.concepts.some(
          (c) => c.id === conceptId && c.version === t.conceptVersion,
        ),
      `${t.id}: referencia de concepto inválida`,
    );
    check(
      t.targetLanguage === pack.targetLanguage &&
        t.supportLanguage === pack.supportLanguage,
      `${t.id}: idiomas incompatibles`,
    );
    check(
      !!t.introduction.trim() &&
        t.rules.length > 0 &&
        t.rules.every((rule) => !!rule.trim()) &&
        t.examples.length > 0 &&
        t.examples.every((row) => row.every((text) => !!text.trim())) &&
        t.forms.every((row) => row.every((text) => !!text.trim())),
      `${t.id}: teoría incompleta`,
    );
    check(
      t.vocabularyIds.every((id) => pack.vocabulary.some((v) => v.id === id)) &&
        t.contrasts.every((r) =>
          pack.concepts.some((c) => c.id === r.conceptId),
        ),
      `${t.id}: referencia rota`,
    );
  }
  for (const v of pack.vocabulary) {
    editorial(v);
    check(
      v.language === pack.targetLanguage &&
        v.supportLanguage === pack.supportLanguage &&
        !!v.lemma.trim() &&
        !!v.gloss.trim() &&
        !!v.partOfSpeech.trim(),
      `${v.id}: entrada léxica inválida`,
    );
    unique(
      v.forms.map((f) => f.key),
      `${v.id}: formas`,
    );
    check(
      v.forms.every((f) => !!f.text.trim()),
      `${v.id}: forma vacía`,
    );
    check(
      v.conceptIds.every((id) => pack.concepts.some((c) => c.id === id)) &&
        v.topicIds.every((id) => pack.topics.some((t) => t.id === id)),
      `${v.id}: asociación rota`,
    );
  }
  for (const a of pack.canonicalActivities) {
    const c = pack.concepts.find((c) => c.id === a.conceptId);
    check(
      validActivity(a) &&
        a.criterion.accepted.every((answer) => !!answer.trim()),
      `${a.id}: actividad/accepted answers inválidas`,
    );
    check(
      a.trace?.kind === 'canonical' &&
        a.trace.packId === pack.id &&
        a.trace.packVersion === pack.version &&
        a.trace.curriculumId === pack.curriculum.id &&
        a.trace.curriculumVersion === pack.curriculum.version &&
        a.trace.sourceId === a.id &&
        a.trace.sourceVersion === a.version,
      `${a.id}: canon/provenance inconsistente`,
    );
    check(
      !!c?.compatibleFamilies?.includes(a.family),
      `${a.id}: familia incompatible`,
    );
    // Canonical activity publication uses its own editorial record, never inherited from a pack.
    editorial(a);
  }
  for (const t of pack.templates) {
    editorial(t);
    unique(
      t.variants.map((v) => v.key),
      `${t.id}: variantes`,
    );
    check(
      t.constraints.length > 0 && t.variants.length > 0,
      `${t.id}: faltan restricciones/variantes`,
    );
    for (const v of t.variants) {
      try {
        instantiate(pack, t.id, v.key);
      } catch (error) {
        errors.push(`${t.id}: ${String(error)}`);
      }
    }
  }
  const published = (item: Editorial | undefined) =>
    item?.status === 'published' &&
    editorialErrors(item as Editorial & { version: string }).length === 0;
  for (const c of pack.concepts.filter((c) => c.status === 'published')) {
    check(
      published(pack) && published(pack.theories[c.id]),
      `${c.id}: pack/teoría no publicados`,
    );
    check(
      pack.vocabulary
        .filter(
          (v) =>
            v.conceptIds.includes(c.id) ||
            pack.theories[c.id]?.vocabularyIds.includes(v.id),
        )
        .every(published),
      `${c.id}: vocabulario no publicado`,
    );
  }
  for (const a of pack.canonicalActivities.filter(
    (a) => a.status === 'published',
  ))
    check(
      published(pack.concepts.find((c) => c.id === a.conceptId)),
      `${a.id}: concepto no publicado`,
    );
  for (const t of pack.templates.filter((t) => t.status === 'published'))
    check(
      t.variants.every((v) =>
        v.vocabulary.every((ref) =>
          published(pack.vocabulary.find((entry) => entry.id === ref.id)),
        ),
      ),
      `${t.id}: dependencia no publicada`,
    );
  return errors;
}
