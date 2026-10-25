import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const bundled = await build({
  stdin: {
    contents:
      "export { readingCorpus } from './src/reading/corpus'; export { readingReceipts } from './src/reading/receipts'; export { reviewedReadings, readingFingerprint, readingActivities } from './src/reading/engine'; export { italianCourse } from './src/content/italian-a1/course'; export { loadLanguagePack } from './src/content/loader'; export { validActivity } from './shared/learning';",
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  platform: 'node',
  format: 'esm',
});
const {
  readingCorpus,
  readingReceipts,
  reviewedReadings,
  readingFingerprint,
  readingActivities,
  italianCourse,
  loadLanguagePack,
  validActivity,
} = await import(
  'data:text/javascript;base64,' +
    Buffer.from(bundled.outputFiles[0].text).toString('base64')
);
const catalog = loadLanguagePack(italianCourse, true).repository;
const errors = [];
const ids = new Set(readingCorpus.map((t) => t.id));
if (ids.size !== readingCorpus.length) errors.push('Duplicate text IDs');
const questions = new Set();
for (const t of readingCorpus) {
  if (
    !t.body.trim() ||
    !t.help.trim() ||
    !t.objectives.length ||
    !t.vocabulary.length
  )
    errors.push(t.id + ': incomplete text');
  for (const id of [...t.requiredConcepts, ...t.presentConcepts])
    if (!catalog.concept(id)) errors.push(t.id + ': unknown concept ' + id);
  for (const id of t.dependencies)
    if (!ids.has(id) || id === t.id)
      errors.push(t.id + ': invalid dependency ' + id);
  const visit = (id, path = new Set()) => {
    if (path.has(id)) {
      errors.push(t.id + ': dependency cycle');
      return;
    }
    for (const next of readingCorpus.find((x) => x.id === id)?.dependencies ??
      [])
      visit(next, new Set([...path, id]));
  };
  visit(t.id);
  for (const q of t.questions) {
    const key = t.id + ':' + q.id;
    if (questions.has(key)) errors.push(key + ': duplicate question');
    questions.add(key);
    if (
      !q.accepted.length ||
      q.accepted.some((x) => q.rejected.includes(x)) ||
      !q.explanation.trim()
    )
      errors.push(key + ': invalid criterion');
    if (
      q.options.length &&
      (q.options.length < 2 ||
        new Set(q.options).size !== q.options.length ||
        q.accepted.some((x) => !q.options.includes(x)))
    )
      errors.push(key + ': invalid choices');
    if (!q.options.length && q.exhaustive)
      errors.push(key + ': open criterion cannot be exhaustive');
  }
  if (readingActivities(t, catalog).some((a) => !validActivity(a)))
    errors.push(t.id + ': invalid activities');
  const receipt = readingReceipts.find(
    (r) => r.id === t.id && r.version === t.version,
  );
  if (
    !receipt ||
    receipt.fingerprint !== readingFingerprint(t) ||
    receipt.flags.length ||
    !receipt.reviewer ||
    !receipt.verdict
  )
    errors.push(t.id + ': missing/stale review receipt');
}
if (readingReceipts.length !== readingCorpus.length)
  errors.push('Receipt inventory mismatch');
const verdict = JSON.parse(
  await readFile(
    'docs/product/reading-review/independent-followup.json',
    'utf8',
  ),
);
const packet = await readFile('docs/product/reading-review/final-packet.json');
if (verdict.packetSha256 !== createHash('sha256').update(packet).digest('hex'))
  errors.push('Independent packet hash mismatch');
const originalPacket = await readFile(
  'docs/product/reading-review/candidate-packet.json',
);
const originalVerdict = JSON.parse(
  await readFile(
    'docs/product/reading-review/independent-verdict.json',
    'utf8',
  ),
);
if (
  originalVerdict.packetSha256 !==
  createHash('sha256').update(originalPacket).digest('hex')
)
  errors.push('Original independent packet hash mismatch');
const finalTexts = JSON.parse(packet.toString()).texts;
if (
  finalTexts.length !== readingCorpus.length ||
  new Set(finalTexts.map((t) => t.id)).size !== readingCorpus.length
)
  errors.push('Final packet inventory mismatch');
for (const text of readingCorpus) {
  const frozen = finalTexts.find((t) => t.id === text.id);
  if (!frozen) {
    errors.push(text.id + ': missing final packet text');
    continue;
  }
  const { fingerprint, ...content } = frozen;
  if (
    fingerprint !== readingFingerprint(content) ||
    fingerprint !== readingFingerprint(text)
  )
    errors.push(text.id + ': final packet differs from current corpus');
}
if (new Set(readingReceipts.map((r) => r.id)).size !== readingReceipts.length)
  errors.push('Duplicate receipt IDs');
for (const receipt of readingReceipts)
  if (
    !verdict.texts.some(
      (t) =>
        t.id === receipt.id &&
        t.decision === 'approved' &&
        t.fingerprint === receipt.fingerprint,
    )
  )
    errors.push(receipt.id + ': no independent approval of current version');
const report = {
  texts: readingCorpus.length,
  questions: questions.size,
  reviewed: reviewedReadings().length,
  published: 0,
  genres: [...new Set(readingCorpus.map((t) => t.genre))],
  blocks: [...new Set(readingCorpus.flatMap((t) => t.blocks))].sort(),
  errors,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
