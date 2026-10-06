import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { qrPath, qrSvg } from './progress-qr.mjs';
import { encodeProgressCode, importLink } from './progress-code.mjs';
import { emptyProgress } from './progress-model.mjs';

function hasZbar() {
	try {
		execFileSync('zbarimg', ['--version'], { stdio: 'ignore' });
		return true;
	} catch {
		return false;
	}
}

test('a link becomes a square module grid with a quiet zone', () => {
	const qr = qrPath('https://ki-einfach-verstehen.de/de/fortschritt/#c=AQ');
	assert.ok(qr);
	assert.equal(qr.viewBox, qr.size + 8);
	assert.match(qr.path, /^M\d+,\d+h1v1h-1z/);
});

test('text beyond QR capacity yields null instead of throwing', () => {
	assert.equal(qrPath('x'.repeat(4000)), null);
	assert.equal(qrSvg('x'.repeat(4000)), null);
});

test('the SVG is always black on white and escapes its label', () => {
	const svg = qrSvg('abc', { title: 'QR "Code" <x>' });
	assert.match(svg, /fill="#ffffff"/);
	assert.match(svg, /aria-label="QR &quot;Code&quot; &lt;x>"/);
});

// End-to-end: render, scan with zbar, compare. Runs where zbarimg exists
// (developer machines); skipped elsewhere, the unit tests above still run.
test('a scanner reads back the exact import link', { skip: !hasZbar() && 'zbarimg not installed' }, async () => {
	const sharp = (await import('sharp')).default;
	const doc = emptyProgress();
	for (let i = 0; i < 20; i += 1) doc.read[`baustein-${i}`] = { at: Date.UTC(2026, 8, 1) + i * 60000 };
	const link = importLink('https://ki-einfach-verstehen.de', 'de', await encodeProgressCode(doc));
	const dir = mkdtempSync(join(tmpdir(), 'kev-qr-'));
	const png = join(dir, 'qr.png');
	writeFileSync(png, await sharp(Buffer.from(qrSvg(link))).resize(800, 800, { kernel: 'nearest' }).png().toBuffer());
	const out = execFileSync('zbarimg', ['--raw', '-q', png]).toString().trim();
	assert.equal(out, link);
});
