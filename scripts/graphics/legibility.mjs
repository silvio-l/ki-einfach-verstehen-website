// Legibility of a generated graphic at the size it is actually shown.
//
// Diagrams and animations fill the column: on a phone about 317px of
// drawing width (343px column minus the frame); in the 6in print book the
// text block is about 324pt wide (4.5in, the narrowest the KDP margins
// allow) and about 540pt high, and a tall figure is scaled down until it
// fits the page. The smallest text must stay at least MIN_EFFECTIVE (px on
// the phone, pt in the book) after that scaling. Text-free graphics
// (icons) pass trivially.

export const MIN_EFFECTIVE = 7.5;
const PHONE_WIDTH_PX = 317;
const BOOK_WIDTH_PT = 324;
const BOOK_HEIGHT_PT = 540;

export function svgHeight(svg) {
  const viewBox = svg.match(/viewBox="[-\d.]+ [-\d.]+ [\d.]+ ([\d.]+)"/);
  if (viewBox) return parseFloat(viewBox[1]);
  const height = svg.match(/<svg[^>]*\sheight="([\d.]+)/);
  return height ? parseFloat(height[1]) : NaN;
}

export function svgWidth(svg) {
  const viewBox = svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+) [\d.]+"/);
  if (viewBox) return parseFloat(viewBox[1]);
  const width = svg.match(/<svg[^>]*\swidth="([\d.]+)/);
  return width ? parseFloat(width[1]) : NaN;
}

// D2 keeps real <text> with font-size; Satori records data-min-font.
export function svgMinFont(svg) {
  const declared = svg.match(/data-min-font="([\d.]+)"/);
  if (declared) return parseFloat(declared[1]);
  const sizes = [...svg.matchAll(/<text[^>]*font-size:\s*([\d.]+)px/g), ...svg.matchAll(/<text[^>]*font-size="([\d.]+)"/g)]
    .map((m) => parseFloat(m[1]));
  return sizes.length ? Math.min(...sizes) : Infinity;
}

export function legibility(svg) {
  const width = svgWidth(svg);
  const height = svgHeight(svg);
  const minFont = svgMinFont(svg);
  if (!Number.isFinite(minFont)) return { width, height, minFont, ok: true };
  const phonePx = +(minFont * Math.min(1, PHONE_WIDTH_PX / width)).toFixed(1);
  const bookPt = +(minFont * Math.min(1, BOOK_WIDTH_PT / width, BOOK_HEIGHT_PT / height)).toFixed(1);
  return { width, height, minFont, phonePx, bookPt, ok: phonePx >= MIN_EFFECTIVE && bookPt >= MIN_EFFECTIVE };
}
