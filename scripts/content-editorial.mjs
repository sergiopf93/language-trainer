import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const bundled = await build({
  stdin: {
    contents:
      "export { italianCourse } from './src/content/italian-a1/course'; export { editorialC01C10 } from './src/content/italian-a1/editorial-c01-c10'; export { validatePack } from './src/content/validate'; export { reviewFingerprint } from './src/content/editorial-review';",
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
  editorialC01C10: batch,
  validatePack,
  reviewFingerprint,
} = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundled.outputFiles[0].text).toString('base64')
);
const { changes } = JSON.parse(
  await readFile(
    new URL(
      '../docs/product/A1_EDITORIAL_CHANGES_C01_C10.json',
      import.meta.url,
    ),
    'utf8',
  ),
);
const counts = (items) =>
  Object.fromEntries(
    ['candidate', 'reviewed', 'published'].map((status) => [
      status,
      items.filter((i) => i.status === status).length,
    ]),
  );
const rows = batch.concepts.map((r) => ({
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
}));
const report = {
  batch: batch.id,
  date: batch.date,
  reviewer: batch.reviewer,
  provenance: batch.provenance,
  pack: { id: pack.id, version: pack.version, status: pack.status },
  scope:
    'C01–C10; revisión asistida, no independiente ni aprobación para publicar',
  totals: {
    concepts: counts(pack.concepts),
    theories: counts(Object.values(pack.theories)),
    activities: counts(pack.canonicalActivities),
    vocabulary: counts(pack.vocabulary),
    templates: counts(pack.templates),
    pilotConcepts: rows.length,
    pilotReviewed: rows.filter((r) => r.status === 'reviewed').length,
    pilotCandidate: rows.filter((r) => r.status === 'candidate').length,
    activitiesReviewed: rows.reduce((n, r) => n + r.activitiesReviewed, 0),
    modifiedTheories: changes.filter((c) => c.kind === 'theory').length,
    modifiedActivities: changes.filter((c) => c.kind === 'activity').length,
    modifiedAcceptedAnswers: changes.filter((c) => c.acceptedChanged).length,
    correctedVocabulary: changes.filter((c) => c.kind === 'vocabulary').length,
  },
  concepts: rows,
  errors: [
    ...validatePack(pack),
    ...rows
      .filter((r) => !r.receiptCurrent)
      .map((r) => `${r.id}: recibo obsoleto`),
  ],
};
if (process.argv.includes('--json'))
  console.log(JSON.stringify(report, null, 2));
else {
  console.log(
    `${batch.id}: ${report.totals.pilotReviewed}/${rows.length} reviewed; ${report.totals.pilotCandidate} candidate; ${report.totals.concepts.published} published.`,
  );
  for (const row of rows)
    console.log(
      `${row.id} [${row.status}] Theory=${row.theory.version}; actividades=${row.activitiesReviewed}; cambios=${row.changes.length}; flags=${row.flags.join('; ') || 'ninguno'}`,
    );
  console.log(JSON.stringify(report.totals, null, 2));
  for (const error of report.errors) console.error(error);
}
if (report.errors.length) process.exitCode = 1;
