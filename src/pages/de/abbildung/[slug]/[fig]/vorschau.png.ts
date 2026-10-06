// Social preview (og:image) of a figure page: exactly this graphic, 1200×630.
import type { APIRoute } from 'astro';
import { figureOgImage } from '../../../../../lib/figure-raster';
import { figureStaticPaths, type ShareFigure, type ShareLesson } from '../../../../../lib/figures';

export const getStaticPaths = () => figureStaticPaths('de');

export const GET: APIRoute = async ({ props }) => {
	const { lesson, figure } = props as { lesson: ShareLesson; figure: ShareFigure };
	const png = await figureOgImage({ file: figure.file, lessonTitle: lesson.title, lang: 'de' });
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
