import { build } from 'esbuild';
const result = await build({
  stdin: {
    contents:
      "export { italianPack } from './src/content/validation-fixture'; export { curriculumCoverage } from './src/content/coverage';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
  define: { 'import.meta.env': '{}' },
});
const { italianPack, curriculumCoverage } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const report = curriculumCoverage(italianPack);
if (process.argv.includes('--json'))
  console.log(JSON.stringify(report, null, 2));
else {
  console.log(
    `${report.packId}: ${report.totals.existingConcepts}/${report.totals.expectedConcepts} conceptos presentes; ${report.totals.productionReady} listos para producción. Presencia no equivale a cobertura completa.`,
  );
  for (const unit of report.units) {
    console.log(`\n${unit.sourceId} · ${unit.title}`);
    for (const c of unit.concepts)
      console.log(
        `  ${c.id} [${c.editorialStatus}] theory=${c.theory} rules=${c.rules} examples=${c.examples} activities=${c.activityCount} families=${c.families.join(',') || '-'} skills=${c.skills.join(',') || '-'} vocabulary=${c.vocabularyIds.join(',') || '-'} ready=${c.productionReady} missing=${c.missing.join(',') || '-'}`,
      );
  }
  for (const error of report.errors) console.error(error);
}
if (report.errors.length) process.exitCode = 1;
