// Download variant of a figure with the CC BY attribution set under it.
import type { APIRoute } from 'astro';
import { figureWithSource } from '../../../../../lib/figure-raster';
import { absolute, figureStaticPaths, type ShareFigure, type ShareLesson } from '../../../../../lib/figures';

export const getStaticPaths = () => figureStaticPaths('de');

export const GET: APIRoute = async ({ props }) => {
	const { lesson, figure } = props as { lesson: ShareLesson; figure: ShareFigure };
	const png = await figureWithSource({ file: figure.file, title: lesson.title, url: absolute(figure.pagePath), lang: 'de' });
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
