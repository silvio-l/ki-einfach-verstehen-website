import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { DEVICES, chipsNeeded, fitStatus, formatGb, memoryGb, trainingGb } from './memory.js';

test('the figures of the Baustein come out of the rule', () => {
	assert.equal(memoryGb(8, 16), 16);
	assert.equal(memoryGb(70, 16), 140);
	assert.equal(memoryGb(405, 16), 810);
	assert.equal(memoryGb(175, 16), 350);
	assert.equal(memoryGb(8, 4), 4);
	assert.equal(memoryGb(3, 2), 0.75);
	assert.equal(trainingGb(8), 128);
});

test('chips are counted up and never zero', () => {
	assert.equal(chipsNeeded(16, 80), 1);
	assert.equal(chipsNeeded(810, 80), 11);
	assert.equal(chipsNeeded(0.75, 24), 1);
});

test('numbers are written per language', () => {
	assert.equal(formatGb(0.75, 'de'), '0,75');
	assert.equal(formatGb(0.75, 'en'), '0.75');
	assert.equal(formatGb(810, 'de'), '810');
	assert.equal(formatGb(1.5, 'de'), '1,5');
});

test('a model that fills a device to the brim only fits tightly', () => {
	assert.equal(fitStatus(16, 24), 'fits');
	assert.equal(fitStatus(24, 24), 'tight');
	assert.equal(fitStatus(8, 8), 'tight');
	assert.equal(fitStatus(35, 24), 'no');
});

test('the phone leaves room for the system and the apps', () => {
	const phone = DEVICES.find((d) => d.key === 'phone');
	assert.equal(fitStatus(memoryGb(8, 8), phone.gb, phone), 'no');
	assert.equal(fitStatus(memoryGb(3, 16), phone.gb, phone), 'tight');
	assert.equal(fitStatus(memoryGb(8, 4), phone.gb, phone), 'tight');
	assert.equal(fitStatus(memoryGb(8, 2), phone.gb, phone), 'fits');
	assert.equal(fitStatus(memoryGb(3, 2), phone.gb, phone), 'fits');
});
