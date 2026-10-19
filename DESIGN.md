# Design notes

## Concept: "Interference"

Abhigyan's work sits where physics meets machine learning: a GPU Method of Moments
solver for metasurfaces, a mechanical-engineering and physics dual degree, amateur
rocketry and stargazing, and ML projects whose READMEs care more about honest
measurement than headline numbers. The site borrows two things from that world.

1. **A live wave field.** The hero shows superposed cylindrical waves from six point
   sources spaced half a wavelength apart, with a slowly sweeping phase gradient that
   steers a beam: the job a metasurface or phased array does. The pointer (or a tap)
   becomes a seventh source, so the pattern answers you.
   It is the one memorable moment on the page; everything else is quiet.
2. **Every project shows its own figure.** Each project gets a small chart drawn from
   the real numbers in its repo or report (WER before and after LoRA, MASE per model,
   routing coverage with confidence intervals, held-out accuracy with Wilson intervals).
   The pitch is "measured, not asserted", which is how his own repos describe themselves.
   Charts replace stock screenshots, emoji icons and feature cards.

Why it fits: recruiters see an ML engineer in the first line, while engineers see the
physics background in the very first pixels, without a paragraph of explanation.

## Type

| Role | Face | Notes |
|---|---|---|
| Display | Mona Sans, wide (wdth 110-125), weight 620-700 (the surname at 380) | Wide grotesque reads as engineered and confident; the width axis does the work a second display face would. |
| Body and UI | Mona Sans, normal width, 400 / 560 | Same family keeps the page coherent; tabular lining figures for every number. |
| Notation | STIX Two Text italic | Only for math (the hero's wave equation and variables like *k*, *ω*, *h*). The scientific-publishing face, used the way a paper uses it. |

Scale: a 1.25 (major third) ratio from a 16-17 px body: 14 / 17 / 21 / 27 / 33 / 42.
The name is sized from the line it has to fill: "Kumar Singh" in wide Mona Sans is
about 6.1 em, so the display size is `min(7.4rem, (100vw - 2 gutters) / 6.5)`. Body measure is held to
about 62-68 characters, line-height 1.55. No all-caps labels and no monospace labels.

Fonts are self-hosted and subset with `pyftsubset` (Mona Sans variable: 77 KB;
STIX italic latin and greek: about 10 KB each). See the README for how to regenerate them.

## Color

Named after the two things that colour his world: Prussian blue (cyanotype,
the photographic process from early physics) and the sodium D-line (589 nm), the
yellow of sodium lamps and the classic spectroscopy line.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F2F4F6` cool paper | `#0A1729` night | page background |
| `--ink` | `#10233B` Prussian ink | `#DCE4EE` starlight | body text |
| `--muted` | `#4A5B70` | `#9BAAC0` | secondary text (AA on paper) |
| `--line` | `#C9D2DC` | `#22344D` | rules, chart axes |
| `--prussian` | `#1D4E89` | `#7FB0EA` | links, chart primary series |
| `--sodium` | `#8A5F00` (text and focus ring) / `#F2B630` (fills) | `#F5C04A` | highlight series, focus ring, the field's positive phase |

Both themes are designed, not inverted: light is a cyanotype print, dark is the night
sky over an observatory. All text pairs pass WCAG AA (`node scripts/contrast.mjs`):
ink 14.4:1 / 14.0:1, muted 6.3:1 / 7.6:1, links 7.6:1 / 8.0:1, sodium text 5.1:1 / 10.7:1.

## Layout

12-column grid, max 1240 px, 16 px gutters at 360 px rising to 40 px.

```
+--------------------------------------------------------------+
| AKS          work  experience  research  about  contact   ◐ |
+--------------------------------------------------------------+
|                                                              |
|  Abhigyan                       (live wave field fills the   |
|  Kumar Singh                     whole hero, type sits on it)|
|                                                              |
|  One line on what he does.      ψ = Σ cos(k r − ωt) / √r     |
|  links                          caption                      |
+------------------+-------------------------------------------+
| Selected work    |  title                 | figure           |
| (sticky margin   |  one-line finding      | (real data)      |
|  heading)        |  stack, links          |                  |
|                  |-------------------------------------------|
|                  |  ...                                       |
+------------------+-------------------------------------------+
```

Section headings live in a left margin column (3 of 12) like a lab notebook's margin;
content takes the other 9. Project rows do not alternate: consistent left alignment,
text left, figure right, collapsing to a single column under 1000 px (the margin
column itself collapses under 860 px). Everything is
left-aligned; nothing is centered except the favicon.

The five strongest projects open into their own case-study pages
(`/work/<slug>/`) with context, method, results, caveats and links.

## Motion

- One orchestrated moment: the wave field. It starts after first paint (idle callback),
  runs on a low-resolution grid scaled up by the browser, pauses off-screen and in
  hidden tabs, and renders a single still frame under `prefers-reduced-motion`.
- Motion only answers actions otherwise: a theme toggle cross-fade, focus rings,
  link underline thickness on hover. No scroll-triggered fade-ins, no card hovers.

## Accessibility and performance rules

- Semantic landmarks, one `h1`, skip link, visible 3 px sodium focus ring with offset.
- The canvas is decorative (`aria-hidden`); the hero text stands alone.
- Charts are built from HTML text plus CSS bars, so every label and number is
  real text that screen readers and search engines read; the bars themselves are
  `aria-hidden`. The rocket flight sketch is an SVG with a `<title>`.
- No layout shift: fonts are preloaded and use `font-display: swap` with a
  metric-adjusted fallback, images carry width and height, and the canvas is
  absolutely positioned behind the hero so it never moves content.

## References and what each taught

- **Brittany Chiang (brittanychiang.com)**: the sticky left column that keeps the
  section in view while content scrolls; dense but calm experience entries.
- **Rauno Freiberg (rauno.me)**: restraint, and craft shown in small interactions
  instead of announced.
- **Paco Coursey (paco.me)**: projects as compact one-line entries; trust the content.
- **Lee Robinson (leerob.com)**: the bio leads with what you do and lets credibility
  sit in plain facts.
- **Josh W. Comeau (joshwcomeau.com)**: a personal, interactive element that teaches
  something about the author, plus designed (not inverted) light and dark themes.
- **Bruno Simon (bruno-simon.com)**: one interactive idea can carry a whole identity,
  and the counter-lesson: never hide the information behind the toy.
- **Awwwards portfolio winners, siteinspire "typographic" and "unusual layout"
  collections**: type as the main visual element; motion concentrated in one place.

Deliberately avoided: purple-blue gradient hero, Inter everywhere, identical card
grids with emoji icons, stock illustrations, cream-and-terracotta serif, black with an
acid accent, all-caps eyebrows, numbered "01 / 02" markers on non-sequential content.
