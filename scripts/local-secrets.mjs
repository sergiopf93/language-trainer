import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
const code = randomBytes(32).toString('base64url');
await writeFile(
  '.dev.vars',
  `OWNER_ID=${randomUUID()}\nACCESS_CODE_SHA256=${createHash('sha256').update(code).digest('hex')}\n`,
  { flag: 'wx', mode: 0o600 },
);
console.log(
  'Código SOLO para desarrollo local (guárdalo; no se volverá a mostrar):\n' +
    code,
);
