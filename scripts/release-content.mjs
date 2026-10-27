import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const approvalPath = 'docs/product/release-v1/approval.json';
const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, stable(value[key])]),
        )
      : value;
export const snapshotHash = (value) =>
  createHash('sha256')
    .update(JSON.stringify(stable(value)))
    .digest('hex');
const reference = ({ id, version }) => ({ id, version });

export async function loadReleaseSnapshot(root = defaultRoot) {
  const bundled = await build({
    stdin: {
      resolveDir: root,
      contents: `
      export { italianCourse } from './src/content/italian-a1/course';
      export { reviewContent, publishContent } from './src/content/editorial';
      export { validatePack } from './src/content/validate';
      export { readingCorpus } from './src/reading/corpus';
      export { reviewedReadings } from './src/reading/engine';
      export { readingReceipts } from './src/reading/receipts';
      export { writingCorpus } from './src/writing/corpus';
      export { controlledWriting } from './src/writing/controlled';
      export { hasWritingReceipt } from './src/writing/engine';
      export { writingReceipts } from './src/writing/receipts';
      export { editorialC01C10 } from './src/content/italian-a1/editorial-c01-c10';
      export { editorialC11C20 } from './src/content/italian-a1/editorial-c11-c20';
      export { editorialC21C34 } from './src/content/italian-a1/editorial-c21-c34';
      export { editorialMixed } from './src/content/italian-a1/editorial-mixed';
    `,
    },
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm',
  });
  const m = await import(
    'data:text/javascript;base64,' +
      Buffer.from(bundled.outputFiles[0].text).toString('base64')
  );
  const pack = m.italianCourse;
  const errors = m.validatePack(pack);
  if (errors.length) throw new Error(errors.join('\n'));
  const reviewed = m.reviewedReadings();
  if (reviewed.length !== m.readingCorpus.length)
    throw new Error('Reading: recibos incompletos u obsoletos.');
  if (![...m.writingCorpus, ...m.controlledWriting].every(m.hasWritingReceipt))
    throw new Error('Writing: recibos incompletos u obsoletos.');
  const collections = {
    concepts: pack.concepts,
    theories: Object.values(pack.theories),
    vocabulary: pack.vocabulary,
    templates: pack.templates,
    activities: pack.canonicalActivities,
  };
  for (const [kind, values] of Object.entries(collections)) {
    if (values.some((v) => v.status !== 'reviewed'))
      throw new Error(`${kind}: contenido sin revisión; no se puede publicar.`);
  }
  const source = {
    pack,
    reading: m.readingCorpus,
    writing: m.writingCorpus,
    controlled: m.controlledWriting,
    receipts: {
      reading: m.readingReceipts,
      writing: m.writingReceipts,
      concepts: [
        m.editorialC01C10,
        m.editorialC11C20,
        m.editorialC21C34,
        m.editorialMixed,
      ],
    },
  };
  const inventory = Object.fromEntries(
    Object.entries({
      ...collections,
      reading: m.readingCorpus,
      writing: m.writingCorpus,
      controlled: m.controlledWriting,
    }).map(([kind, values]) => [
      kind,
      values.map((value) => ({
        ...reference(value),
        sha256: snapshotHash(value),
      })),
    ]),
  );
  return { m, source, sourceSha256: snapshotHash(source), inventory };
}

export async function prepareApproval(root = defaultRoot) {
  const snapshot = await loadReleaseSnapshot(root);
  const approval = {
    schema: 1,
    release: '1.0.0',
    approvedBy: 'Sergio Pardo',
    approvalBasis:
      'Confirmación del usuario en R2 — PUBLICACIÓN FINAL DE LANGUAGE TRAINER V1, apartados 3 y 5; registrada en docs/product/A1_V1_RELEASE.md. Recibos existentes comprobados; R2 no ha ejecutado una nueva revisión humana.',
    approvedAt: new Date().toISOString(),
    sourceSha256: snapshot.sourceSha256,
    inventory: snapshot.inventory,
  };
  await mkdir(resolve(root, dirname(approvalPath)), { recursive: true });
  await writeFile(
    resolve(root, approvalPath),
    JSON.stringify(approval, null, 2) + '\n',
    { flag: 'wx' },
  );
  return approval;
}

export function validateReleaseApproval(approval, snapshot) {
  if (
    approval.schema !== 1 ||
    approval.release !== '1.0.0' ||
    !approval.approvedBy ||
    !Number.isFinite(Date.parse(approval.approvedAt)) ||
    approval.sourceSha256 !== snapshot.sourceSha256 ||
    snapshotHash(approval.inventory) !== snapshotHash(snapshot.inventory)
  )
    throw new Error(
      'Aprobación V1 ausente, alterada u obsoleta: la fuente actual necesita autorización explícita.',
    );
}

export async function createReleaseModules(root = defaultRoot) {
  const snapshot = await loadReleaseSnapshot(root);
  const approval = JSON.parse(
    await readFile(resolve(root, approvalPath), 'utf8'),
  );
  validateReleaseApproval(approval, snapshot);
  const { m, source } = snapshot;
  const publish = (value) => m.publishContent(value, approval.approvedAt);
  const rootPack =
    source.pack.status === 'candidate'
      ? m.reviewContent(source.pack, approval.approvedBy, approval.approvedAt)
      : source.pack;
  const pack = publish(rootPack);
  pack.concepts = pack.concepts.map(publish);
  pack.theories = Object.fromEntries(
    Object.entries(pack.theories).map(([id, value]) => [id, publish(value)]),
  );
  pack.vocabulary = pack.vocabulary.map(publish);
  pack.templates = pack.templates.map(publish);
  pack.canonicalActivities = pack.canonicalActivities.map(publish);
  const errors = m.validatePack(pack);
  if (errors.length) throw new Error(errors.join('\n'));
  const declaration = (name, value) =>
    `export const ${name} = ${JSON.stringify(value)};`;
  return new Map([
    ['src/content/italian-a1/course.ts', declaration('italianCourse', pack)],
    ['src/reading/corpus.ts', declaration('readingCorpus', source.reading)],
    ['src/writing/corpus.ts', declaration('writingCorpus', source.writing)],
    [
      'src/writing/controlled.ts',
      declaration('controlledWriting', source.controlled),
    ],
  ]);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  if (process.argv[2] === '--prepare') {
    const approval = await prepareApproval();
    console.log(`Aprobación V1 fijada: ${approval.sourceSha256}`);
  } else if (process.argv[2] === '--check') {
    const modules = await createReleaseModules();
    console.log(`Release V1 verificada: ${modules.size} módulos aprobados.`);
  } else
    throw new Error(
      'Uso: node scripts/release-content.mjs --prepare | --check',
    );
}
