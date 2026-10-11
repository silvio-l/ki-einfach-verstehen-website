// Vite plugin that replaces the built-in 500 kB chunk-size warning.
//
// The only chunks above that size are the BPE rank tables of the real
// tokenizers (gpt-tokenizer's bpeRanks/*: o200k_base ~2 MB, cl100k_base
// ~1 MB). They are data, not code: each table is needed whole, cannot be
// split further, and is already its own lazy chunk that loads only when a
// reader uses a tokenizer demo (src/scripts/demos/real-tokens.js). The
// built-in warning cannot exempt single chunks, so it is switched off in
// astro.config.mjs and this guard keeps the same limit for everything else:
// a chunk only passes when it is within the limit after subtracting its
// rank-table modules.

export const CHUNK_LIMIT_BYTES = 500 * 1024;

/** True for gpt-tokenizer's rank-table modules (any build flavour). */
export function isRankTable(id) {
	return /[\\/]gpt-tokenizer[\\/](?:.*[\\/])?bpeRanks[\\/]/.test(id);
}

/**
 * Chunks that exceed the limit once their rank tables are left out.
 * @param {Record<string, any>} bundle Rollup/Rolldown output bundle
 * @param {number} [limit]
 * @returns {{ fileName: string, bytes: number }[]}
 */
export function oversizedChunks(bundle, limit = CHUNK_LIMIT_BYTES) {
	const result = [];
	for (const chunk of Object.values(bundle)) {
		if (chunk.type !== 'chunk') continue;
		const total = Buffer.byteLength(chunk.code ?? '');
		if (total <= limit) continue;
		const tables = Object.entries(chunk.modules ?? {})
			.filter(([id]) => isRankTable(id))
			.reduce((sum, [, m]) => sum + (m?.renderedLength ?? 0), 0);
		if (total - tables > limit) result.push({ fileName: chunk.fileName, bytes: total - tables });
	}
	return result;
}

/** @returns {import('vite').Plugin} */
export function chunkSizeGuard(limit = CHUNK_LIMIT_BYTES) {
	return {
		name: 'kev-chunk-size-guard',
		apply: 'build',
		generateBundle(_options, bundle) {
			// Only what readers download counts. The server build of this static
			// site runs once at build time (prerendering), so its content-layer
			// chunk may be large; Vite's own warning skips it the same way.
			if (this.environment && this.environment.name !== 'client') return;
			for (const { fileName, bytes } of oversizedChunks(bundle, limit))
				this.warn(`chunk ${fileName} is ${Math.round(bytes / 1024)} kB without tokenizer rank tables (limit ${Math.round(limit / 1024)} kB)`);
		},
	};
}
