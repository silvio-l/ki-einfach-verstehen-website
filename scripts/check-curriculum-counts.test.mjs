// Guard against curriculum-count drift: the number of Themenbereiche and
// Bausteine grows over time, so site copy must take it from
// getCurriculumCounts() (src/data/themenbereiche.ts) or stay neutral
// ("die Bausteine"). A literal such as "16 Bausteine" or "drei
// Themenbereiche" goes stale with the next Themenbereich and fails here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SCAN = ['src/components', 'src/layouts', 'src/pages', 'src/data', 'src/lib', 'src/scripts', 'src/content/themenbereiche', 'src/content/glossar', 'public'];
const EXTENSIONS = /\.(astro|ts|mjs|js|md|mdx|json|txt|webmanifest)$/;
const NUMBER = String.raw`(?:\d+|[Zz]wei|[Dd]rei|[Vv]ier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|sechzehn|two|[Tt]hree|[Ff]our|five|six|seven|eight|nine|ten|eleven|twelve|sixteen)`;
const NOUN = String.raw`(?:Bausteine|Bausteinen|Themenbereiche|Themenbereichen|lessons|topics|topic areas)`;
// Up to two plain words may sit between number and noun ("16 aufeinander
// aufbauenden Bausteinen"); "~100 Bausteine" (a capacity estimate) is exempt.
const COUNT = new RegExp(String.raw`(?<![\w$}~])${NUMBER}\s+(?:\p{L}+\s+){0,2}${NOUN}\b`, 'gu');

function* files(dir) {
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) yield* files(path);
		else if (EXTENSIONS.test(name) && !name.endsWith('.test.mjs')) yield path;
	}
}

test('site copy derives curriculum counts instead of hard-coding them', () => {
	const hits = [];
	for (const dir of SCAN) {
		for (const path of files(join(root, dir))) {
			readFileSync(path, 'utf8').split('\n').forEach((line, i) => {
				for (const match of line.matchAll(COUNT)) hits.push(`${relative(root, path)}:${i + 1}: ${match[0]}`);
			});
		}
	}
	assert.deepEqual(hits, [], `Hard-coded curriculum counts -- use getCurriculumCounts() or neutral wording:\n${hits.join('\n')}`);
});
