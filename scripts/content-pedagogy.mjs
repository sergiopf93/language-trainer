import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
const result = await build({
  stdin: {
    contents:
      "export { italianCourse } from './src/content/italian-a1/course'; export { pedagogicalCoverage } from './src/content/pedagogy';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const { italianCourse, pedagogicalCoverage } = await import(
  'data:text/javascript;base64,' +
    Buffer.from(result.outputFiles[0].text).toString('base64')
);
const inputIndex = process.argv.indexOf('--input');
if (inputIndex >= 0 && !process.argv[inputIndex + 1])
  throw new Error('--input requires a pack JSON path');
const report = pedagogicalCoverage(
  inputIndex >= 0
    ? JSON.parse(await readFile(process.argv[inputIndex + 1], 'utf8'))
    : italianCourse,
);
if (process.argv.includes('--json'))
  console.log(JSON.stringify(report, null, 2));
else {
  console.log(
    `${report.packVersion}: ${JSON.stringify(report.totals)}\nSignals only; no pedagogical score or editorial approval.`,
  );
  for (const c of report.concepts)
    console.log(
      `${c.id} | ${c.activities} | ${JSON.stringify(c.skills)} | ${c.families.join(',')} | theory=${c.theory} relations=${c.relations.length} vocab=${c.vocabularyIds.length} | ${c.flags.join('; ') || 'no automatic flags'}`,
    );
  console.log(
    `Duplicates=${report.duplicates.length}; prerequisite cycles=${report.graph.prerequisiteCycles.length}; answer conflicts=${report.answerConflicts.length}`,
  );
  for (const error of report.structuralErrors) console.error(error);
}
if (
  report.structuralErrors.length ||
  report.answerConflicts.length ||
  report.graph.prerequisiteCycles.length
)
  process.exitCode = 1;
