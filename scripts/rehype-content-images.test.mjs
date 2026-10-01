import { test } from 'node:test';
import assert from 'node:assert/strict';
import rehypeContentImages from './rehype-content-images.mjs';

const webpOnDisk = new Set(['/pub/bausteine/x/scene.webp']);
const plugin = () => rehypeContentImages({ publicDir: '/pub', exists: (f) => webpOnDisk.has(f) });
const run = (tree) => (plugin()(tree), tree);

test('hast img elements get lazy/async defaults, explicit values win', () => {
	const tree = run({
		type: 'root',
		children: [
			{ type: 'element', tagName: 'img', properties: { src: '/a.svg' }, children: [] },
			{ type: 'element', tagName: 'img', properties: { src: '/b.svg', loading: 'eager' }, children: [] },
			{ type: 'element', tagName: 'p', properties: {}, children: [] },
		],
	});
	assert.deepEqual(tree.children[0].properties, { src: '/a.svg', loading: 'lazy', decoding: 'async' });
	assert.equal(tree.children[1].properties.loading, 'eager');
	assert.equal(tree.children[1].properties.decoding, 'async');
	assert.deepEqual(tree.children[2].properties, {});
});

test('MDX JSX <img> nodes get the attributes appended once', () => {
	const img = { type: 'mdxJsxFlowElement', name: 'img', attributes: [{ type: 'mdxJsxAttribute', name: 'src', value: '/c.svg' }], children: [] };
	const figure = { type: 'mdxJsxFlowElement', name: 'Figure', attributes: [], children: [img] };
	run({ type: 'root', children: [figure] });
	run({ type: 'root', children: [figure] });
	assert.deepEqual(
		img.attributes.map((a) => [a.name, a.value]),
		[
			['src', '/c.svg'],
			['loading', 'lazy'],
			['decoding', 'async'],
		],
	);
});

test('a /bausteine/ PNG is served as its WebP sibling only when that file exists', () => {
	const jsx = (src) => ({ type: 'mdxJsxFlowElement', name: 'img', attributes: [{ type: 'mdxJsxAttribute', name: 'src', value: src }], children: [] });
	const hast = (src) => ({ type: 'element', tagName: 'img', properties: { src }, children: [] });
	const nodes = [jsx('/bausteine/x/scene.png'), jsx('/bausteine/x/other.png'), jsx('/bausteine/x/scene.svg'), hast('/bausteine/x/scene.png'), jsx('/merch/scene.png')];
	run({ type: 'root', children: nodes });
	const src = (n) => n.properties?.src ?? n.attributes.find((a) => a.name === 'src').value;
	assert.deepEqual(nodes.map(src), ['/bausteine/x/scene.webp', '/bausteine/x/other.png', '/bausteine/x/scene.svg', '/bausteine/x/scene.webp', '/merch/scene.png']);
});
