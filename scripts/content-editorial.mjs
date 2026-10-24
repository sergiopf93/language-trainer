import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const bundled = await build({
  stdin: {
    contents:
      "export { italianCourse, reviewedItalianCourse6B } from './src/content/italian-a1/course'; export { editorialMixed } from './src/content/italian-a1/editorial-mixed'; export { editorialC01C10 } from './src/content/italian-a1/editorial-c01-c10'; export { editorialC11C20 } from './src/content/italian-a1/editorial-c11-c20'; export { editorialC21C34 } from './src/content/italian-a1/editorial-c21-c34'; export { validatePack } from './src/content/validate'; export { reviewFingerprint } from './src/content/editorial-review';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  define: { 'import.meta.env': '{}' },
});
const {
  italianCourse: pack,
  reviewedItalianCourse6B,
  editorialMixed,
  editorialC01C10,
  editorialC11C20,
  editorialC21C34,
  validatePack,
  reviewFingerprint,
} = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundled.outputFiles[0].text).toString('base64')
);
const historicalBatches = [editorialC01C10, editorialC11C20, editorialC21C34];
const replaced = new Set(editorialMixed.concepts.map((r) => r.concept.id));
const batches = [
  ...historicalBatches.map((b) => ({
    ...b,
    concepts: b.concepts.filter((r) => !replaced.has(r.concept.id)),
  })),
  editorialMixed,
];
const changes = (
  await Promise.all(
    ['C01_C10', 'C11_C20', 'C21_C34'].map(async (scope) => {
      const log = JSON.parse(
        await readFile(
          new URL(
            scope === 'C21_C34'
              ? '../docs/product/editorial-cross-review-c21-c34/closure-decisions.json'
              : `../docs/product/A1_EDITORIAL_CHANGES_${scope}.json`,
            import.meta.url,
          ),
          'utf8',
        ),
      );
      return log.changes;
    }),
  )
).flat();
const counts = (items) =>
  Object.fromEntries(
    ['candidate', 'reviewed', 'published'].map((status) => [
      status,
      items.filter((i) => i.status === status).length,
    ]),
  );
const rows = batches.flatMap((batch) =>
  batch.concepts.map((r) => ({
    batch: batch.id,
    reviewer: batch.reviewer,
    date: batch.date,
    id: r.concept.id,
    version: r.concept.version,
    status: pack.concepts.find((c) => c.id === r.concept.id).status,
    reason: r.reason,
    flags: r.flags,
    theory: r.entities.find((e) => e.kind === 'theory'),
    activitiesReviewed: r.entities.filter((e) => e.kind === 'activity').length,
    vocabularyReviewed: r.entities
      .filter((e) => e.kind === 'vocabulary')
      .map((e) => ({ id: e.id, version: e.version })),
    changes: changes.filter((c) =>
      r.entities.some((e) => e.kind === c.kind && e.id === c.id),
    ),
    receiptCurrent: reviewFingerprint(pack, r.concept.id) === r.fingerprint,
  })),
);
const report = {
  batches: batches.map(({ concepts, ...metadata }) => ({
    ...metadata,
    concepts: concepts.length,
  })),
  pack: { id: pack.id, version: pack.version, status: pack.status },
  scope:
    'C01–C34; revisión asistida con cobertura independiente documentada por lote; no aprobación para publicar',
  totals: {
    concepts: counts(pack.concepts),
    theories: counts(Object.values(pack.theories)),
    activities: counts(pack.canonicalActivities),
    vocabulary: counts(pack.vocabulary),
    templates: counts(pack.templates),
    reviewConcepts: rows.length,
    reviewedConcepts: rows.filter((r) => r.status === 'reviewed').length,
    candidateConcepts: rows.filter((r) => r.status === 'candidate').length,
    activitiesReviewed: rows.reduce((n, r) => n + r.activitiesReviewed, 0),
    modifiedTheories: changes.filter((c) => c.kind === 'theory').length,
    modifiedActivities: changes.filter((c) => c.kind === 'activity').length,
    modifiedAcceptedAnswers: changes.filter((c) => c.acceptedChanged).length,
    correctedVocabulary: changes.filter((c) => c.kind === 'vocabulary').length,
  },
  concepts: rows,
  errors: [
    ...validatePack(pack),
    ...historicalBatches.flatMap((b) =>
      b.concepts
        .filter(
          (r) =>
            reviewFingerprint(reviewedItalianCourse6B, r.concept.id) !==
            r.fingerprint,
        )
        .map((r) => `${r.concept.id}: recibo histórico obsoleto`),
    ),
    ...rows
      .filter((r) => !r.receiptCurrent)
      .map((r) => `${r.id}: recibo obsoleto`),
  ],
};
if (process.argv.includes('--json'))
  console.log(JSON.stringify(report, null, 2));
else {
  console.log(
    `${batches.map((b) => b.id).join(' + ')}: ${report.totals.reviewedConcepts}/${rows.length} reviewed; ${report.totals.candidateConcepts} candidate; ${report.totals.concepts.published} published.`,
  );
  for (const row of rows)
    console.log(
      `${row.id} [${row.status}] Theory=${row.theory.version}; actividades=${row.activitiesReviewed}; cambios=${row.changes.length}; flags=${row.flags.join('; ') || 'ninguno'}`,
    );
  console.log(JSON.stringify(report.totals, null, 2));
  for (const error of report.errors) console.error(error);
}
if (report.errors.length) process.exitCode = 1;
