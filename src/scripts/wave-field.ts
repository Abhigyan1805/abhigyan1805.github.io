/**
 * Hero wave field: superposed cylindrical waves from a short line of point
 * sources with a slowly sweeping phase gradient (a steered beam, the effect a
 * metasurface is designed to produce), plus one source that follows the pointer.
 *
 *   psi(r, t) = sum_i a_i cos(k |r - r_i| - w t + phi_i) / sqrt(|r - r_i|)
 *
 * The field is computed on a coarse grid and scaled up by the browser, so a
 * frame costs a few milliseconds. It pauses off-screen and in hidden tabs, and
 * draws one still frame when the visitor prefers reduced motion.
 */

const CELL = 5; // CSS pixels per field sample
const FPS = 30;

interface Source {
  x: number; // fraction of width
  y: number; // fraction of height
  amp: number;
  phase: number;
  dist?: Float32Array;
}

type RGB = [number, number, number];

function parseColor(value: string): RGB {
  const hex = value.trim().replace('#', '');
  const n = parseInt(hex.length === 3 ? hex.replace(/./g, '$&$&') : hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function startWaveField(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const COUNT = 6;
  const array: Source[] = Array.from({ length: COUNT }, () => ({ x: 0, y: 0, amp: 1, phase: 0 }));
  const pointer: Source = { x: 0.6, y: 0.5, amp: 0, phase: 0 };
  const sources = [...array, pointer];

  let cols = 0;
  let rows = 0;
  let k = 0;
  let image: ImageData | null = null;
  let paper: RGB = [242, 244, 246];
  let pos: RGB = [242, 182, 48];
  let neg: RGB = [29, 78, 137];
  let strength = 0.5;
  let visible = true;
  let running = false;
  let last = 0;
  let t = 0;

  function readTheme(): void {
    const css = getComputedStyle(canvas);
    paper = parseColor(css.getPropertyValue('--paper'));
    pos = parseColor(css.getPropertyValue('--sodium-fill'));
    neg = parseColor(css.getPropertyValue('--prussian'));
    const dark = paper[0] + paper[1] + paper[2] < 200;
    strength = dark ? 0.7 : 0.62;
  }

  function computeDistances(s: Source): void {
    const sx = s.x * cols;
    const sy = s.y * rows;
    const d = s.dist && s.dist.length === cols * rows ? s.dist : new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      const dy = y - sy;
      for (let x = 0; x < cols; x++) {
        const dx = x - sx;
        d[y * cols + x] = Math.sqrt(dx * dx + dy * dy);
      }
    }
    s.dist = d;
  }

  function resize(): void {
    const rect = canvas.getBoundingClientRect();
    cols = Math.max(8, Math.ceil(rect.width / CELL));
    rows = Math.max(8, Math.ceil(rect.height / CELL));
    canvas.width = cols;
    canvas.height = rows;
    // Wavelength in CSS pixels; sources sit half a wavelength apart, like the
    // elements of a phased array, so the sweeping phase steers a clean beam.
    const narrow = rect.width < 700;
    const lambda = narrow ? 34 : 58;
    k = (2 * Math.PI * CELL) / lambda;
    image = ctx!.createImageData(cols, rows);
    const spacing = lambda / 2 / rect.height;
    const cx = narrow ? 0.9 : 0.9;
    const cy = narrow ? 0.34 : 0.48;
    array.forEach((s, i) => {
      s.x = cx;
      s.y = cy + (i - (COUNT - 1) / 2) * spacing;
    });
    sources.forEach(computeDistances);
  }

  function draw(): void {
    if (!image) return;
    const data = image.data;
    const n = cols * rows;
    const w = 3; // angular frequency, rad/s
    // Phase gradient across the array sweeps slowly, steering the beam.
    const sweep = Math.sin(t * 0.16) * 2.4;
    array.forEach((s, i) => (s.phase = i * sweep));
    const active = sources.filter((s) => s.amp > 0.001);
    const norm = 1 / Math.max(1, active.reduce((a, s) => a + s.amp, 0) * 0.32);

    for (let p = 0; p < n; p++) {
      let v = 0;
      for (let j = 0; j < active.length; j++) {
        const s = active[j];
        const r = s.dist![p];
        v += (s.amp * Math.cos(k * r - w * t + s.phase)) / Math.sqrt(1 + r * 0.05);
      }
      v *= norm;
      if (v > 1) v = 1;
      else if (v < -1) v = -1;
      const c = v > 0 ? pos : neg;
      const a = Math.abs(v) * strength;
      const o = p * 4;
      data[o] = paper[0] + (c[0] - paper[0]) * a;
      data[o + 1] = paper[1] + (c[1] - paper[1]) * a;
      data[o + 2] = paper[2] + (c[2] - paper[2]) * a;
      data[o + 3] = 255;
    }
    ctx!.putImageData(image, 0, 0);
  }

  function frame(now: number): void {
    if (!running) return;
    if (now - last >= 1000 / FPS) {
      t += Math.min(0.1, (now - last) / 1000 || 1 / FPS);
      last = now;
      // Ease the pointer source in and out.
      pointer.amp += ((pointerActive ? 1.1 : 0) - pointer.amp) * 0.08;
      draw();
    }
    requestAnimationFrame(frame);
  }

  function play(): void {
    if (running || reduce.matches || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }

  function stop(): void {
    running = false;
  }

  let pointerActive = false;
  function movePointer(event: PointerEvent): void {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
    computeDistances(pointer);
    pointerActive = true;
    if (reduce.matches) {
      pointer.amp = 1.1;
      draw();
    }
  }

  // Listen on the hero so text over the canvas still moves the source.
  const host = canvas.closest('[data-wave-host]') ?? canvas;
  host.addEventListener('pointermove', (e) => {
    if ((e as PointerEvent).pointerType === 'mouse' && !reduce.matches) movePointer(e as PointerEvent);
  });
  host.addEventListener('pointerdown', (e) => movePointer(e as PointerEvent));
  host.addEventListener('pointerleave', () => {
    if (!reduce.matches) pointerActive = false;
  });

  readTheme();
  resize();
  draw();
  canvas.dataset.ready = '';

  new ResizeObserver(() => {
    resize();
    draw();
  }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  reduce.addEventListener('change', () => (reduce.matches ? stop() : play()));
  const onTheme = () => {
    readTheme();
    draw();
  };
  window.addEventListener('themechange', onTheme);
  new MutationObserver(onTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  play();
}
