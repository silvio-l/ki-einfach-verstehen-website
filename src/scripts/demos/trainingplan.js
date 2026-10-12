// The training plan of Baustein batch-epoch-step-tokenbudget: steps are the
// token budget divided by the batch size, epochs per source follow from the
// token budget alone. Starting values from the GPT-3 paper (Brown et al. 2020):
// 300 billion tokens, 3.2 million tokens per batch, and Table 2.2 for the mix.
// The table's epochs at 300 billion tokens are scaled linearly with the
// budget; recomputing them from the rounded shares would not match the paper.

/** Token budgets in billions the slider steps through. */
export const BUDGETS_BN = [100, 300, 600, 1000, 3000];

/** Batch sizes in millions of tokens the slider steps through. */
export const BATCHES_M = [0.8, 1.6, 3.2, 6.4, 12.8];

export const GPT3_BUDGET_BN = 300;
export const GPT3_BATCH_M = 3.2;

/** GPT-3 training mix: size in billions of tokens, share in percent, epochs at 300 billion tokens. */
export const GPT3_SOURCES = [
	{ key: 'cc', tokensBn: 410, share: 60, epochs: 0.44 },
	{ key: 'webtext2', tokensBn: 19, share: 22, epochs: 2.9 },
	{ key: 'books1', tokensBn: 12, share: 8, epochs: 1.9 },
	{ key: 'books2', tokensBn: 55, share: 8, epochs: 0.43 },
	{ key: 'wiki', tokensBn: 3, share: 3, epochs: 3.4 },
];

/** Optimizer steps for a token budget (billions) at a batch size (millions of tokens). */
export function steps(budgetBn, batchM) {
	return (budgetBn * 1000) / batchM;
}

/** How often a source of the mix is read through at a token budget (billions). */
export function epochsAt(source, budgetBn) {
	return (source.epochs * budgetBn) / GPT3_BUDGET_BN;
}

/** "93.750" / "93,750": whole numbers with the language's thousands separator. */
export function formatInt(n, lang) {
	return Math.round(n).toLocaleString(lang === 'de' ? 'de-DE' : 'en-US');
}

/** "0,44", "2,9", "34": epochs rounded the way the text writes them. */
export function formatEpochs(e, lang) {
	const s = e < 1 ? e.toFixed(2) : e < 10 ? e.toFixed(1) : String(Math.round(e));
	return lang === 'de' ? s.replace('.', ',') : s;
}

/** "3,2" / "3.2", "12,8": decimals in the language's notation. */
export function formatDecimal(n, lang) {
	const s = String(n);
	return lang === 'de' ? s.replace('.', ',') : s;
}
