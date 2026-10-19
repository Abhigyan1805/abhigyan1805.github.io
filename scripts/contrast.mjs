// Prints WCAG contrast ratios for the palette in DESIGN.md.
const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
const lum = (h) => { const [r, g, b] = hex(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return ((x + 0.05) / (y + 0.05)).toFixed(2); };
const pairs = process.argv.slice(2);
for (let i = 0; i < pairs.length; i += 2) console.log(pairs[i], 'on', pairs[i + 1], ratio(pairs[i], pairs[i + 1]));
