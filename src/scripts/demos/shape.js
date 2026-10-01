// Shape arithmetic for the live demo in Baustein 4
// (skalar-vektor-matrix-tensor): a block of numbers is described by its
// axes; the shape lists the length of every axis, the product is the number
// of entries. An axis with a single entry adds no direction, so it is left
// out of the shape -- one city over seven days is a vector of 7, not a
// matrix of 1 × 7.

/** @param {number[]} lengths one entry per axis, in display order */
export function shapeOf(lengths) {
	const dims = lengths.filter((n) => n > 1);
	return {
		dims,
		axes: dims.length,
		count: lengths.reduce((product, n) => product * n, 1),
	};
}

const NAMES = {
	de: ['Skalar', 'Vektor', 'Matrix', 'Tensor'],
	en: ['Scalar', 'Vector', 'Matrix', 'Tensor'],
};

export function nameOf(axes, lang) {
	const names = NAMES[lang] ?? NAMES.de;
	return names[Math.min(axes, 3)];
}

export function formatShape(dims, lang) {
	if (dims.length === 0) return lang === 'en' ? 'no axis' : 'keine Achse';
	return dims.map((n) => formatNumber(n, lang)).join(' × ');
}

export function formatNumber(n, lang) {
	return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE').format(n);
}

// The four steps of the Baustein, in its order: today's temperature, the
// whole week, four cities, then wind and rain on top. Axis order is
// measure, city, day.
export const STEPS = [
	[1, 1, 1],
	[1, 1, 7],
	[1, 4, 7],
	[3, 4, 7],
];

// Invented weather values, stable per cell so the reader can tap the same
// cell twice and see the same number. Temperatures for Berlin are the ones
// printed in the Baustein (18, 21, 19, 15, 14, 17, 20).
export function weatherValue(measure, city, day) {
	const base = [[18, 21, 19, 15, 14, 17, 20], [16, 19, 17, 14, 13, 15, 18], [17, 20, 18, 14, 13, 16, 19], [19, 22, 20, 16, 15, 18, 21]];
	const temperature = base[city % 4][day % 7];
	if (measure === 0) return temperature;
	if (measure === 1) return 8 + ((city * 5 + day * 3) % 14); // wind km/h
	return (city * 7 + day * 4) % 9; // rain mm
}
