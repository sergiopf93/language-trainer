import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const bundled = await build({
  stdin: {
    contents:
      "export {writingCorpus} from './src/writing/corpus'; export {controlledWriting} from './src/writing/controlled'; export {writingReceipts} from './src/writing/receipts'; export {writingOptions,writingFingerprint} from './src/writing/engine'; export {italianCourse} from './src/content/italian-a1/course'; export {loadLanguagePack} from './src/content/loader'; export {validActivity} from './shared/learning';",
    resolveDir: process.cwd(),
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
const catalog = m.loadLanguagePack(m.italianCourse, true).repository;
const authored = [...m.writingCorpus, ...m.controlledWriting];
const errors = [];
const options = m.writingOptions(catalog);
const production = m.writingOptions(
  m.loadLanguagePack(m.italianCourse, false).repository,
);
const plan = JSON.parse(
  await readFile('docs/product/writing-review/coverage-plan.json', 'utf8'),
);
if (new Set(authored.map((t) => t.id)).size !== authored.length)
  errors.push('Duplicate authoring IDs');
if (production.length)
  errors.push('Unpublished writing available in production');
for (const t of authored) {
  const receipt = m.writingReceipts.filter(
    (r) => r.id === t.id && r.version === t.version,
  );
  if (t.status !== 'candidate')
    errors.push(t.id + ': authoring must remain candidate');
  if (
    receipt.length !== 1 ||
    receipt[0]?.fingerprint !== m.writingFingerprint(t) ||
    receipt[0]?.flags.length ||
    receipt[0]?.decision !== 'reviewed'
  )
    errors.push(t.id + ': invalid receipt');
}
for (const t of m.writingCorpus) {
  if (
    t.rubric.length !== 6 ||
    !t.prompt.trim() ||
    !t.model.trim() ||
    !t.abstention.trim() ||
    !t.help.trim() ||
    !t.feedback.trim() ||
    !t.objectives.length
  )
    errors.push(t.id + ': incomplete editorial fields');
  for (const id of [...t.requiredConcepts, t.alternativeConceptId])
    if (!catalog.concept(id)) errors.push(t.id + ': unknown concept ' + id);
}
for (const o of options) {
  if (!m.validActivity(o.activity)) errors.push(o.id + ': invalid Activity');
  if (
    o.activity.family === 'F6' &&
    (o.activity.writing?.policy !== 'open' || o.activity.criterion.exhaustive)
  )
    errors.push(o.id + ': unsafe open evaluation');
  for (const id of o.requiredConcepts)
    if (!catalog.concept(id))
      errors.push(o.id + ': unknown prerequisite ' + id);
}
for (const c of catalog.concepts) {
  if (!plan.some((p) => p.conceptId === c.id))
    errors.push(c.id + ': missing planning row');
  if (!options.some((o) => o.activity.conceptId === c.id))
    errors.push(c.id + ': no controlled writing opportunity');
}
for (const row of plan)
  for (const a of row.activities)
    if (
      !catalog.activities.some((x) => x.id === a.id && x.version === a.version)
    )
      errors.push(a.id + ': changed baseline activity');
try {
  const finalRaw = await readFile(
    'docs/product/writing-review/final-packet.json',
    'utf8',
  );
  const final = JSON.parse(finalRaw);
  const verdict = JSON.parse(
    await readFile('docs/product/writing-review/final-verdict.json', 'utf8'),
  );
  const sha = createHash('sha256').update(finalRaw).digest('hex');
  if (verdict.packetSha256 !== sha)
    errors.push('Final verdict SHA256 mismatch');
  for (const t of authored) {
    const entry = final.find((e) => e.id === t.id);
    if (
      !entry ||
      entry.fingerprint !== m.writingFingerprint(t) ||
      JSON.stringify(entry.content) !== JSON.stringify(t)
    )
      errors.push(t.id + ': final packet differs');
    if (
      !verdict.items?.some(
        (v) =>
          v.id === t.id &&
          v.version === t.version &&
          v.fingerprint === m.writingFingerprint(t) &&
          v.decision === 'approved',
      )
    )
      errors.push(t.id + ': no independent approval');
  }
  const candidate = await readFile(
    'docs/product/writing-review/candidate-packet.json',
    'utf8',
  );
  const initial = JSON.parse(
    await readFile(
      'docs/product/writing-review/independent-verdict.json',
      'utf8',
    ),
  );
  if (
    initial.packetSha256 !==
    createHash('sha256').update(candidate).digest('hex')
  )
    errors.push('Initial verdict SHA256 mismatch');
} catch (e) {
  errors.push('Review artifacts unavailable: ' + e.message);
}
console.log(
  JSON.stringify(
    {
      concepts: catalog.concepts.length,
      authored: authored.length,
      open: m.writingCorpus.length,
      reused: options.filter((o) => !authored.some((t) => t.id === o.id))
        .length,
      reviewed: m.writingReceipts.length,
      production: production.length,
      errors,
    },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
