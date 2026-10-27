import { beforeAll, describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
// @ts-expect-error Build-only Node script has no browser types.
import * as release from '../scripts/release-content.mjs';
const {
  createReleaseModules,
  loadReleaseSnapshot,
  snapshotHash,
  validateReleaseApproval,
} = release;
import type { LanguagePack } from '../src/content/model';

describe('V1 release content boundary', () => {
  let snapshot: Awaited<ReturnType<typeof loadReleaseSnapshot>>;
  let approval: Record<string, unknown>;
  let modules: Map<string, string>;
  beforeAll(async () => {
    snapshot = await loadReleaseSnapshot();
    approval = JSON.parse(
      await readFile('docs/product/release-v1/approval.json', 'utf8'),
    );
    modules = await createReleaseModules();
  }, 30000);

  it('matches the fixed authorized source and exact editorial receipt inventories', () => {
    expect(() => validateReleaseApproval(approval, snapshot)).not.toThrow();
    expect(snapshot.sourceSha256).toBe(approval.sourceSha256);
    expect(snapshot.inventory.concepts).toHaveLength(99);
    expect(snapshot.inventory.activities).toHaveLength(923);
    expect(snapshot.inventory.reading).toHaveLength(26);
    expect(snapshot.inventory.writing).toHaveLength(18);
    expect(snapshot.inventory.controlled).toHaveLength(1);
  });

  it('rejects source or inventory changes without refreshing approval', () => {
    expect(() =>
      validateReleaseApproval(approval, {
        ...snapshot,
        sourceSha256: snapshotHash({ ...snapshot.source, changed: true }),
      }),
    ).toThrow(/obsoleta/);
    expect(() =>
      validateReleaseApproval({ ...approval, inventory: {} }, snapshot),
    ).toThrow(/obsoleta/);
    expect(() =>
      validateReleaseApproval({ ...approval, approvedAt: 'invalid' }, snapshot),
    ).toThrow(/obsoleta/);
  });

  it('emits only approved data and publishes through the existing editorial transitions', () => {
    const code = modules.get('src/content/italian-a1/course.ts')!;
    const pack: LanguagePack = JSON.parse(
      code.slice('export const italianCourse = '.length, -1),
    );
    expect(pack.status).toBe('published');
    const values = [
      ...pack.concepts,
      ...Object.values(pack.theories),
      ...pack.vocabulary,
      ...pack.templates,
      ...pack.canonicalActivities,
    ];
    expect(
      values.every(
        (value) =>
          value.status === 'published' &&
          value.publication?.version === value.version,
      ),
    ).toBe(true);
    expect(snapshot.m.validatePack(pack)).toEqual([]);
    expect(code).not.toContain('validation-fixture');
    expect(code).not.toContain('authoredItalianCourse');
    expect(code).not.toContain('import ');
    expect(modules.size).toBe(4);
  });

  it('retains Writing source fingerprints and validates every Reading and Writing receipt', () => {
    const writing = [...snapshot.source.writing, ...snapshot.source.controlled];
    expect(
      writing.every(
        (value) =>
          value.status === 'candidate' && snapshot.m.hasWritingReceipt(value),
      ),
    ).toBe(true);
    expect(snapshot.m.reviewedReadings()).toHaveLength(
      snapshot.source.reading.length,
    );
    expect(snapshot.source.pack.status).toBe('candidate');
    expect(
      snapshot.source.pack.concepts.every(
        (value: { status: string }) => value.status === 'reviewed',
      ),
    ).toBe(true);
  });
});
