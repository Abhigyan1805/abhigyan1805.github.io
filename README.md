# Abhigyan Kumar Singh: portfolio

A static personal site built with [Astro](https://astro.build) and TypeScript. No
server, no client framework, no tracking. Design rationale is in [DESIGN.md](DESIGN.md).

## Commands

Requires Node 18.20+ (developed on Node 22).

| Command | What it does |
|---|---|
| `npm install` | install dependencies |
| `npm run dev` | dev server at http://localhost:4321/ |
| `npm run build` | type-check (`astro check`) and build the static site into `dist/` |
| `npm run preview` | serve the production build at http://localhost:4321/ |

## Editing content

Everything the site says lives in **`src/content/site.ts`**:

- `profile`: name, headline, intro, about paragraphs, education, email and links.
- `projects`: each project's summary, measured finding, stack, links and an optional
  `figure` (a small chart drawn from real numbers). Projects with a `caseStudy` get
  their own page at `/work/<slug>/`. Projects without a `figure` are listed under
  "Other work".
- `experience`, `research`, `activities`, `skills`.

Only add facts that appear in the source documents listed at the top of that file.

### Adding a resume PDF

`profile.resumePdf` is intentionally empty. Put a PDF **without a phone number** in
`public/` (for example `public/abhigyan-kumar-singh-resume.pdf`) and set
`resumePdf: 'abhigyan-kumar-singh-resume.pdf'`. A "Resume (PDF)" link then appears
in the contact section.

## Deploying to GitHub Pages

The site is live at https://abhigyan1805.github.io (a user site, served from the root).

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site with
Node 22 and publishes `dist/` using the official GitHub Pages actions. It can also be
run by hand from the Actions tab (`workflow_dispatch`). The workflow sets
`SITE_URL=https://abhigyan1805.github.io` and `BASE_PATH=/`.

The base path and site URL come from environment variables at build time:

```sh
# user page (what the workflow uses)
SITE_URL=https://abhigyan1805.github.io BASE_PATH=/ npm run build

# project page: https://abhigyan1805.github.io/portfolio-site/
SITE_URL=https://abhigyan1805.github.io BASE_PATH=/portfolio-site/ npm run build
```

All internal links go through `src/lib/url.ts`, so they follow `BASE_PATH`.

## Regenerating assets

- **Fonts** (`src/assets/fonts/`): subsets of Mona Sans (variable, weight and width
  axes) and STIX Two Text italic, both SIL Open Font License, made with fontTools:

  ```sh
  uvx --from 'fonttools[woff]' pyftsubset MonaSans.woff2 \
    --unicodes="U+0020-007E,U+00A0-00BF,U+00D7,U+00E9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2032,U+2192,U+2212,U+2248,U+2264,U+2265,U+20B9" \
    --layout-features='kern,liga,tnum,lnum,case,ss01,ss02' --flavor=woff2 \
    --output-file=src/assets/fonts/mona-sans-var.woff2
  ```

  The source files came from the `@fontsource-variable/mona-sans` and
  `@fontsource/stix-two-text` packages.
- **Portrait** (`src/assets/portrait.jpg`): a cropped copy of the original photo;
  Astro produces AVIF and WebP sizes at build time.
- **Open Graph image** (`public/og.jpg`): open `scripts/og.html` in a browser at a
  1200×630 viewport, screenshot it, and save it as JPEG.
- **Favicons**: `public/favicon.svg` is the source; the PNGs are rendered from it with
  sharp.
- **Contrast check**: `node scripts/contrast.mjs 10233B F2F4F6` prints the WCAG ratio
  for any pair of colours.

## Structure

```
src/content/site.ts      all content (typed)
src/pages/index.astro    home page sections
src/pages/work/[slug].astro  case-study pages
src/components/          Header, Footer, Hero, WorkList, Figure
src/scripts/wave-field.ts    hero canvas animation
src/styles/global.css    tokens, type scale, section grid
```
