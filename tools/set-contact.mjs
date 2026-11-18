import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';

// Read from an interactive prompt or stdin; never put the address in public HTML.
const input = createInterface({ input: process.stdin, output: process.stdout });
if (process.stdin.isTTY) process.stdout.write('Contact email address: ');
let address = '';
for await (const line of input) { address = line.trim(); input.close(); break; }
if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/.test(address)) {
  throw new Error('Enter a valid ASCII email address.');
}
const bytes = Buffer.from(address, 'ascii');
const key = randomBytes(bytes.length);
const value = [...bytes].map((byte, i) => byte ^ key[i]);
const target = new URL('../public/contact.js', import.meta.url);
const original = await readFile(target, 'utf8');
const replacement = `// CONTACT_PAYLOAD_START\n  const contactPayload = ${JSON.stringify({ key: [...key], value })};\n  // CONTACT_PAYLOAD_END`;
if (!original.includes('// CONTACT_PAYLOAD_START')) throw new Error('Contact payload marker missing.');
await writeFile(target, original.replace(/\/\/ CONTACT_PAYLOAD_START[\s\S]*?\/\/ CONTACT_PAYLOAD_END/, () => replacement));
console.log('Randomized contact payload updated. Repackage before uploading.');
