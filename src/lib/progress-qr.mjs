// QR code for the progress import link (ADR-0025), drawn locally as SVG
// from the vendored Nayuki encoder (src/vendor/qrcodegen.js, MIT) -- no
// CDN, no third-party request, nothing leaves the page.
import { qrcodegen } from '../vendor/qrcodegen.js';

/** Quiet zone in modules; the QR spec asks for 4. */
export const QUIET_ZONE = 4;

/**
 * Encodes `text` and returns the module grid as one SVG path (dark modules
 * as 1x1 squares), or null when the text is too long for any QR code.
 * The smallest version that fits is used, with the highest error
 * correction that still fits in it (boostEcl).
 *
 * @param {string} text
 * @returns {{ size: number, viewBox: number, path: string, version: number } | null}
 */
export function qrPath(text) {
	let qr;
	try {
		qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.LOW);
	} catch {
		return null;
	}
	const parts = [];
	for (let y = 0; y < qr.size; y += 1) {
		for (let x = 0; x < qr.size; x += 1) {
			if (qr.getModule(x, y)) parts.push(`M${x + QUIET_ZONE},${y + QUIET_ZONE}h1v1h-1z`);
		}
	}
	return { size: qr.size, viewBox: qr.size + QUIET_ZONE * 2, path: parts.join(''), version: qr.version };
}

/** A complete standalone SVG: black on white in every theme, so scanners can read it. */
export function qrSvg(text, { title = '' } = {}) {
	const qr = qrPath(text);
	if (!qr) return null;
	const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${qr.viewBox} ${qr.viewBox}" shape-rendering="crispEdges" role="img"${title ? ` aria-label="${esc(title)}"` : ''}>` +
		`<rect width="${qr.viewBox}" height="${qr.viewBox}" fill="#ffffff"/>` +
		`<path d="${qr.path}" fill="#000000"/></svg>`
	);
}
