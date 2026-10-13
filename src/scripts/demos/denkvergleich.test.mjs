import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { SERIES, SIZES, messung } from './denkvergleich.js';
import { formatNumber } from './softmax.js';

test('every series and size has one published value pair', () => {
	assert.deepEqual(SERIES, ['math500', 'aime24']);
	assert.deepEqual(SIZES, ['0.6', '1.7']);
	for (const reihe of SERIES) for (const groesse of SIZES) assert.ok(messung(reihe, groesse).mit > 0);
});

test('the published values are the ones of the report', () => {
	assert.deepEqual(messung('math500', '0.6'), { mit: 77.6, ohne: 55.2, abstand: 22.4 });
	assert.deepEqual(messung('math500', '1.7'), { mit: 93.4, ohne: 73.0, abstand: 20.4 });
	assert.deepEqual(messung('aime24', '0.6'), { mit: 10.7, ohne: 3.4, abstand: 7.3 });
	assert.deepEqual(messung('aime24', '1.7'), { mit: 48.3, ohne: 13.4, abstand: 34.9 });
});

test('the gap is shown with a German decimal comma', () => {
	assert.equal(formatNumber(messung('math500', '0.6').abstand, 'de', 1), '22,4');
	assert.equal(formatNumber(messung('aime24', '1.7').abstand, 'de', 1), '34,9');
});

test('thinking helps most on the hard series with the larger model', () => {
	const gaps = SERIES.flatMap((r) => SIZES.map((g) => [r, g, messung(r, g).abstand]));
	const [reihe, groesse] = gaps.reduce((a, b) => (b[2] > a[2] ? b : a));
	assert.equal(reihe, 'aime24');
	assert.equal(groesse, '1.7');
});

test('an unknown combination is refused, not invented', () => {
	assert.throws(() => messung('aime25', '1.7'));
	assert.throws(() => messung('math500', '4'));
});
