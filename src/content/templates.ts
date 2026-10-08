import { validActivity, type Activity } from '../../shared/learning';
import type { ExerciseTemplate, LanguagePack } from './model';
export function instantiate(
  pack: LanguagePack,
  templateId: string,
  variantKey: string,
): Activity {
  const template = pack.templates.find((t) => t.id === templateId);
  const variant = template?.variants.find((v) => v.key === variantKey);
  if (!template || !variant)
    throw new Error('Variante fuera del espacio canónico permitido.');
  const source = pack.canonicalActivities.find(
    (a) => a.id === variant.source.id && a.version === variant.source.version,
  );
  if (
    !source ||
    source.trace?.kind === 'derived' ||
    source.family !== template.family ||
    source.format !== template.format ||
    source.conceptId !== template.concept.id ||
    source.conceptVersion !== template.concept.version
  )
    throw new Error('Template incompatible con su fuente canónica.');
  if (
    variant.vocabulary.some(
      (ref) =>
        !pack.vocabulary.some(
          (v) => v.id === ref.id && v.version === ref.version,
        ),
    )
  )
    throw new Error('Vocabulario canónico inexistente.');
  if (source.status !== template.status)
    throw new Error('Estado editorial incompatible.');
  let accepted = source.criterion.accepted;
  if (variant.answerFrom) {
    const { entryId, formKey } = variant.answerFrom;
    const form = pack.vocabulary
      .find((v) => v.id === entryId)
      ?.forms.find((f) => f.key === formKey);
    if (
      !variant.vocabulary.some((ref) => ref.id === entryId) ||
      !form ||
      source.criterion.accepted.length !== 1 ||
      source.criterion.accepted[0] !== form.text
    )
      throw new Error('Forma léxica incompatible con el canon del ítem.');
    accepted = [form.text];
  }
  const item: Activity = {
    ...structuredClone(source),
    id: source.id,
    version: source.version,
    provenance: template.provenance,
    criterion: {
      ...structuredClone(source.criterion),
      accepted: [...accepted],
    },
    trace: {
      kind: 'derived',
      packId: pack.id,
      packVersion: pack.version,
      curriculumId: pack.curriculum.id,
      curriculumVersion: pack.curriculum.version,
      sourceId: source.id,
      sourceVersion: source.version,
      templateId: template.id,
      templateVersion: template.version,
      variantKey,
    },
  };
  if (!validActivity(item)) throw new Error('Actividad derivada inválida.');
  return item;
}
export function templateSources(template: ExerciseTemplate) {
  return template.variants.map((v) => v.source.id);
}
