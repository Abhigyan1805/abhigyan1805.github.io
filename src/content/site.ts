/**
 * All site content lives here. Edit this file to change what the site says;
 * components only decide how it looks.
 *
 * Fact sources (do not add claims that are not in them):
 * - /mnt/d/LaTeX/resume/PROFILE.md (master profile)
 * - the gnani-ai-engineer and pwc-combined tailored resume packets
 * - each project repo's README on its default branch
 * - the NCC 2027 paper draft (/mnt/d/conference_paper v6/ncc2027-example.tex),
 *   which owns the GPU Method of Moments solver figures and caveats
 */

export interface Link {
  label: string;
  href: string;
}

/** A small chart drawn from real, published numbers. */
export type Figure =
  | {
      kind: 'bars';
      caption: string;
      unit: string;
      /** Upper end of the axis; defaults to the largest value. */
      max?: number;
      lowerIsBetter?: boolean;
      items: { label: string; value: number; display?: string; highlight?: boolean }[];
    }
  | {
      kind: 'intervals';
      caption: string;
      unit: string;
      axis: [number, number];
      reference?: { value: number; label: string };
      items: { label: string; value: number; lo: number; hi: number; highlight?: boolean }[];
    }
  | {
      kind: 'dots';
      caption: string;
      unit: string;
      axis: [number, number];
      reference?: { value: number; label: string };
      lowerIsBetter?: boolean;
      items: { label: string; value: number; highlight?: boolean }[];
    };

export interface CaseStudy {
  context: string[];
  approach: string[];
  results: string[];
  caveats: string[];
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  /** One sentence: what it is. */
  summary: string;
  /** One sentence: the measured finding. */
  finding: string;
  stack: string[];
  links: Link[];
  status?: string;
  figure?: Figure;
  /** Projects with a case study get their own page at /work/<slug>/. */
  caseStudy?: CaseStudy;
}

export interface Role {
  title: string;
  org: string;
  place: string;
  start: string;
  end: string;
  points: string[];
}

export const profile = {
  name: 'Abhigyan Kumar Singh',
  shortName: 'Abhigyan',
  role: 'Machine learning engineer',
  headline: 'I build machine learning systems and measure what they actually do.',
  intro:
    'Final-year dual-degree student at Birla Institute of Technology & Science, Pilani, reading Mechanical Engineering and Physics. I work on speech recognition, LLM agents, retrieval and forecasting, and on GPU solvers for electromagnetics at CSIR-National Aerospace Laboratories.',
  about: [
    'My training is in mechanical engineering and physics, and it shapes how I do machine learning: start from the physics or the data, build the measurement before the model, and report the number that generalises rather than the flattering one.',
    'Right now that means a GPU-accelerated Method of Moments solver for metasurfaces at CSIR-NAL, with a first-author paper submitted to NCC 2027 and under review. Before that I evaluated and trained LLMs through RLHF at Outlier.ai and forecast train delays at the Centre for Railway Information Systems.',
    'Outside the lab I am a senior member of the Astro Club at BITS Pilani, where I have helped run stargazing nights and worked on an amateur rocket.',
  ],
  education: {
    school: 'Birla Institute of Technology & Science, Pilani',
    degree: 'B.E. Mechanical Engineering + M.Sc. Physics',
    place: 'Pilani, Rajasthan',
    period: 'Oct 2022 – present',
  },
  email: 'abhigyan18@gmail.com',
  links: {
    github: 'https://github.com/Abhigyan1805',
    linkedin: 'https://www.linkedin.com/in/abhigyan-singh-429568224',
  },
  /**
   * Resume download: intentionally empty for now. The existing PDFs include a
   * phone number. Put a phone-free PDF in /public (for example
   * /public/abhigyan-kumar-singh-resume.pdf) and set the path here, relative to
   * the site root without a leading slash; the contact section shows the link
   * only when this is set.
   */
  resumePdf: '' as string,
};

export const seo = {
  title: 'Abhigyan Kumar Singh: machine learning engineer',
  description:
    'Portfolio of Abhigyan Kumar Singh, machine learning engineer and dual-degree student at Birla Institute of Technology & Science, Pilani: speech recognition, LLM agents, RAG, forecasting benchmarks and GPU electromagnetics solvers.',
};

export const projects: Project[] = [
  {
    slug: 'gpu-method-of-moments',
    title: 'GPU Method of Moments solver for metasurfaces',
    year: '2026',
    summary:
      'An electromagnetics solver written in PyTorch that computes how metasurface designs respond, fast enough to generate training data for ML models.',
    finding:
      'Validated against CST on 4 designs. Projected at about 130× faster than CST for 1,000 sweeps, extrapolated from measured single sweeps.',
    stack: ['PyTorch', 'FFT', 'GMRES', 'Computational electromagnetics'],
    links: [],
    status: 'CSIR-NAL, first-author paper submitted to NCC 2027, under review',
    figure: {
      kind: 'bars',
      caption: 'Projected time for 1,000 sweeps, extrapolated from 4 measured designs',
      unit: 'minutes',
      lowerIsBetter: true,
      items: [
        { label: 'CST', value: 2196, display: '~36.6 h' },
        { label: 'This solver, 4×A100', value: 17, display: '~17 min', highlight: true },
      ],
    },
    caseStudy: {
      context: [
        'Machine learning models that predict how a metasurface scatters need thousands of simulated designs to learn from. A commercial full-wave solver such as CST is accurate but slow enough that building a 1,000-design dataset takes well over a day.',
      ],
      approach: [
        'I built a Method of Moments solver in PyTorch so the whole pipeline runs on GPUs.',
        'The interaction matrix is never formed. An FFT-based, matrix-free operator applies it, and batched GMRES solves many designs at once.',
        'The solver output feeds a response-prediction pipeline, which I improved with vision transformers. I also explored diffusion and GAN generative models for the same computational engineering problems.',
      ],
      results: [
        'Validated against CST on 4 designs: the principal resonances agree within 4.8% in frequency and 6.2 dB in depth.',
        'Measured on 4 designs, one 201-point sweep each (2 to 18 GHz): the solver on 4×A100 was 24× to 253× faster than CST, and 33× to 50× faster than the same FFT-based method on one CPU.',
        'Scaled to 1,000 sweeps using the mean times of those 4 designs, that projects to about 36.6 hours in CST and 11.8 hours on one CPU, against about 17 minutes on 4×A100, about 130× faster than CST.',
        'A first-author paper has been submitted to NCC 2027 and is under review.',
      ],
      caveats: [
        'The 130× figure is a projection (1,000 times the mean measured single-sweep time of 4 designs), not a measured end-to-end run, and the spread across designs is wide (24× to 253×).',
        'The CST reference is a FEM unit-cell model with Floquet ports, while the solver models the pattern as a zero-thickness sheet.',
        'The 33× to 50× CPU comparison is not at the same precision: the GPU solver runs in single precision (complex64) with a tolerance of 5×10^-4, since tighter values stall in single precision, while the CPU baseline runs the same solver in double precision (complex128) with a tolerance of 10^-8.',
        'This is ongoing internship work at CSIR-NAL, so the code is not public.',
      ],
    },
  },
  {
    slug: 'hindi-voice-asr',
    title: 'Hindi Voice ASR',
    year: '2026',
    summary:
      'Hindi speech-to-text: Whisper-small fine-tuned with LoRA on FLEURS Hindi, with a Python API, a CLI and a published adapter.',
    finding:
      'Test WER fell from 79.19% to 24.53%, beating zero-shot whisper-medium (42.95%), a model three times larger.',
    stack: ['Python', 'PyTorch', 'Hugging Face Transformers', 'PEFT / LoRA', 'Whisper'],
    links: [
      { label: 'Code on GitHub', href: 'https://github.com/Abhigyan1805/hindi-voice-asr' },
      {
        label: 'Adapter on Hugging Face',
        href: 'https://huggingface.co/Dratinia/whisper-small-hindi-lora',
      },
    ],
    figure: {
      kind: 'bars',
      caption: 'Word error rate on FLEURS Hindi test, 418 utterances',
      unit: 'WER %',
      max: 100,
      lowerIsBetter: true,
      items: [
        { label: 'whisper-small, zero-shot', value: 79.19, display: '79.19' },
        { label: 'whisper-medium, zero-shot', value: 42.95, display: '42.95' },
        { label: 'whisper-small + LoRA r32', value: 24.53, display: '24.53', highlight: true },
      ],
    },
    caseStudy: {
      context: [
        'Off-the-shelf whisper-small handles Hindi poorly: on the FLEURS Hindi test set it gets 79.19% word error rate, and 35 of 418 outputs fall into runaway repetition loops.',
      ],
      approach: [
        'LoRA (rank 32) on the query, key, value and output projections of every encoder and decoder attention block: 7.08M trainable parameters, 2.8% of the model.',
        'A plain PyTorch training loop on a Kaggle T4 with fp16, AdamW, warmup and linear decay, five epochs, and the best epoch chosen on 200 validation utterances.',
        'Seeded augmentation: three-way speed perturbation plus white noise at 10–30 dB SNR.',
        'A custom text normaliser, because Whisper’s BasicTextNormalizer deletes Devanagari matras and viramas and so under-counts errors.',
        'Packaged as transcribe() in Python, a CLI and a small Gradio demo, with the adapter merged into the base model so decoding costs exactly what the base model costs.',
      ],
      results: [
        'WER 79.19% → 24.53% and CER 49.44% → 10.11% on the full FLEURS Hindi test split (418 utterances).',
        'Beats zero-shot whisper-medium (42.95% WER), which is three times larger.',
        'Runaway outputs drop from 35 to 1. Re-scored only on clips where no model loops, WER still falls from 55.9 to 23.4.',
        'Single-stream real-time factor of 0.130 on a T4, faster than the zero-shot base (0.173).',
        'Ablations: LoRA rank 8 gives 26.98% WER and dropping augmentation gives 25.67%.',
      ],
      caveats: [
        'Ablations are one seed each.',
        'FLEURS is read speech of Wikipedia-style sentences, so conversational, noisy, telephone or strongly code-switched audio will be worse.',
      ],
    },
  },
  {
    slug: 'guardrailed-sql-analyst',
    title: 'Guardrailed SQL Analyst',
    year: '2026',
    summary:
      'Ask questions about sales data in plain English and get SQL, a chart and caveats back, with every query behind layered guardrails.',
    finding:
      'Blocked 51/51 adversarial attacks with zero executed violations, and reports held-out accuracy instead of the flattering dev number.',
    stack: ['TypeScript', 'Next.js', 'LangGraph', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    links: [
      { label: 'Code on GitHub', href: 'https://github.com/Abhigyan1805/guardrailed-sql-analyst' },
    ],
    figure: {
      kind: 'intervals',
      caption: 'Held-out accuracy by engine, with Wilson 95% intervals (42 scored questions)',
      unit: '%',
      axis: [0, 100],
      items: [
        { label: 'templates', value: 7.1, lo: 2.5, hi: 19.0 },
        { label: 'hybrid', value: 32.5, lo: 17.2, hi: 43.6 },
        { label: 'LLM', value: 53.2, lo: 39.9, hi: 68.8, highlight: true },
      ],
    },
    caseStudy: {
      context: [
        'Letting an LLM write SQL against a business database is useful and dangerous in equal measure. The analyst had to answer real questions while making unsafe or cross-tenant queries impossible, and its accuracy had to be measured on questions it was not built against.',
      ],
      approach: [
        'A LangGraph agent links the question to relevant views, generates SQL, validates it, and passes it through a confidence gate that asks a clarifying question instead of guessing.',
        'Defense in depth: a read-only database role, row-level security for tenant isolation, an AST statement gate parsed with a real Postgres grammar, relation and function allowlists, injected row caps, an EXPLAIN cost gate, and an append-only audit log.',
        'An evaluation harness with frozen dev (40), held-out (60), paraphrase (12) and attack (51) sets, two independent gold queries per question, positional row-set scoring, Wilson intervals and confidence calibration.',
        'Served through a Next.js API route and web UI, packaged as a Docker image with an embedded Postgres, with an Expo (React Native) companion app on the same API.',
      ],
      results: [
        '51/51 attacks blocked or clarified, 0 executed violations, business-table checksum unchanged, on real Postgres.',
        'Templates score 100% on dev but 7.1% on held-out; the LLM engine scores 53.2% on held-out. Publishing that collapse was the point of the harness.',
        'Defense-in-depth ablation: 11 of 13 attack-family by layer cells still block with one layer disabled, and the two gaps are named.',
      ],
      caveats: [
        'On 42 scored held-out questions the interval is about ±14 points wide, so rank order matters more than point differences.',
        'It runs locally with Docker; there is no hosted instance.',
      ],
    },
  },
  {
    slug: 'costsmart-rag',
    title: 'CostSmart RAG',
    year: '2026',
    summary:
      'A routed RAG agent that retrieves before it routes, so retrieval signals help choose the model, retrieval depth and reasoning strategy for each query.',
    finding:
      'An exhaustive oracle puts the achievable saving at about 94% with no measured quality loss; a 3B cheap tier is the first to clear the routing gate.',
    stack: ['Python', 'RAG', 'LLM routing', 'Qwen2.5', 'Bootstrap statistics'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/Abhigyan1805/cost-smart-RAG' }],
    figure: {
      kind: 'intervals',
      caption:
        'Cheap closed-book tier coverage with 95% bootstrap intervals, 200 real NQ, HotpotQA and MuSiQue queries',
      unit: 'coverage',
      axis: [0, 0.25],
      reference: { value: 0.1, label: '0.10 gate' },
      items: [
        { label: 'Qwen2.5-1.5B', value: 0.095, lo: 0.055, hi: 0.14 },
        { label: 'Qwen2.5-3B', value: 0.155, lo: 0.105, hi: 0.205, highlight: true },
        { label: 'Qwen2.5-7B', value: 0.15, lo: 0.1, hi: 0.2 },
      ],
    },
    caseStudy: {
      context: [
        'Most LLM routers treat the query as the only input and the model as the only choice. In retrieval-augmented generation, retrieval already produces strong difficulty signals for free, and retrieval depth is itself a cheap action.',
      ],
      approach: [
        'Retrieval (BM25 and hybrid, with reranking) runs before routing, so score margins, coverage and agreement become router features.',
        'The router chooses over the joint space of model × retrieval depth × reasoning strategy, using open-weight Qwen2.5 models served on remote Colab or Kaggle GPUs.',
        'Every claim is scored against an exhaustive oracle that evaluates every route for every query, with 10,000-resample bootstrap intervals, McNemar tests and 3× repeats graded by strict majority.',
      ],
      results: [
        'The oracle ceiling is about 94% saving at no measured quality loss.',
        'The cheap closed-book route first clears the 0.10 exploitable-separation gate at Qwen2.5-3B (coverage 0.155, 95% CI 0.105–0.205). Qwen2.5-7B is statistically indistinguishable (0.150, 0.100–0.200) and Apache-2.0.',
        'The lever is tier capability, not query difficulty: reweighting the query mix did not open the gate.',
      ],
      caveats: [
        'The strong route is a stub that is correct on every query, so real cloud accuracy is untested, and actual cloud spend was $0, so dollar figures are estimates.',
        'Router training and the agent loop ship as scaffolds and are not yet benchmarked.',
      ],
    },
  },
  {
    slug: 'tsfm-benchmark',
    title: 'TSFM Benchmark',
    year: '2026',
    summary:
      'A reproducible, leakage-audited benchmark of when time-series foundation models beat classical, ML and deep forecasters, measured on accuracy and inference cost.',
    finding:
      'Zero-shot foundation models win at every horizon: Chronos-Bolt reaches MASE 0.79 at the 24-step horizon against 1.00 for seasonal naive.',
    stack: ['Python', 'PyTorch', 'statsforecast', 'XGBoost', 'Chronos-Bolt', 'TimesFM 2.5'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/Abhigyan1805/tsfm-benchmark' }],
    figure: {
      kind: 'dots',
      caption: 'Seasonal MASE at the 24-step horizon on Monash Electricity Hourly',
      unit: 'MASE',
      axis: [0.5, 2],
      reference: { value: 1, label: 'seasonal naive' },
      lowerIsBetter: true,
      items: [
        { label: 'Chronos-Bolt', value: 0.79, highlight: true },
        { label: 'TimesFM 2.5', value: 0.88, highlight: true },
        { label: 'AutoETS', value: 1.14 },
        { label: 'XGBoost lags', value: 1.29 },
        { label: 'Transformer', value: 1.74 },
        { label: 'LSTM', value: 1.75 },
      ],
    },
    caseStudy: {
      context: [
        'Time-series foundation models promise zero-shot forecasts, but their value depends on what they are compared against and how much each forecast costs. The question was when they actually beat conventional models, and at what latency.',
      ],
      approach: [
        'Nine forecasters behind one interface: naive and seasonal-naive floors, AutoETS and AutoARIMA, an XGBoost lag-feature model, seeded LSTM and Transformer models, and zero-shot TimesFM 2.5 and Chronos-Bolt.',
        'Frozen, leakage-audited splits of the Monash Electricity Hourly dataset, a rolling-origin backtest over horizons of 24, 48, 96 and 192 steps, paired statistics and a license gate on every model.',
        'CPU families ran locally; the GPU tier ran on Kaggle T4s on the same frozen windows.',
      ],
      results: [
        'At the 24-step horizon Chronos-Bolt leads (MASE 0.79 at about 35 ms per forecast), TimesFM 2.5 is second (0.88 at about 122 ms), and both beat seasonal naive (1.00).',
        'AutoETS is the best trained model (1.14), XGBoost is competitive (1.29), and from-scratch LSTM (1.75) and Transformer (1.74) models fall behind the seasonal floor.',
        'The zero-shot lead holds at every horizon: Chronos-Bolt goes from 0.79 to 1.04 as the horizon grows, against 1.00 to 1.30 for the seasonal floor.',
      ],
      caveats: [
        'One dataset family (electricity demand) on a bounded origin sample, so the ranking is evidence, not a general law.',
      ],
    },
  },
  {
    slug: 'ev-grid-feasibility',
    title: 'EV Transition and Grid Feasibility Study',
    year: '',
    summary:
      'A Study of Projects forecasting India’s electric-vehicle sales and cumulative energy demand through 2035.',
    finding:
      'Assessed whether the electrical grid can carry the added load, with a focus on integrating renewable sources, and proposed strategies for scaling infrastructure.',
    stack: ['Python', 'Forecasting', 'Energy modelling'],
    links: [],
  },
  {
    slug: 'qwen-distillation',
    title: 'Qwen3.5-2B reasoning distillation',
    year: '2026',
    status: 'In progress',
    summary:
      'A pre-registered LoRA SFT-distillation study of Qwen3.5-2B from Qwen3.5-9B reasoning traces, run on free Kaggle T4s.',
    finding:
      'Seed 2 against the base model: GSM8K 79.4 → 82.7 and MATH-500 69.0 → 70.4. Seed 1 was mixed (MATH-500 down 2.8), and is reported as is.',
    stack: ['PyTorch', 'LoRA / Unsloth', 'vLLM'],
    links: [],
  },
];

export const experience: Role[] = [
  {
    title: 'Machine Learning Intern',
    org: 'CSIR-National Aerospace Laboratories (NAL), CEM Division',
    place: 'Bangalore',
    start: 'Jul 2026',
    end: 'present',
    points: [
      'Built a GPU-accelerated Method of Moments solver in PyTorch (FFT-based matrix-free operator, batched GMRES), validated against CST on 4 designs, with 1,000 sweeps projected at about 130× faster than CST (extrapolated from measured single sweeps).',
      'Improved the response-prediction pipeline with vision transformers, and explored diffusion and GAN generative models for computational engineering.',
      'First-author paper submitted to NCC 2027, under review.',
    ],
  },
  {
    title: 'AI Content Evaluator & Trainer',
    org: 'Outlier.ai',
    place: 'Remote',
    start: 'Dec 2025',
    end: 'May 2026',
    points: [
      'Evaluated and ranked LLM responses on accuracy, reasoning and instruction-following to improve models through RLHF.',
      'Authored ground-truth responses and prompts for complex technical and logical tasks.',
      'Documented hallucinations, biases and edge cases in model outputs with detailed feedback for iterative training.',
    ],
  },
  {
    title: 'Machine Learning Intern',
    org: 'Centre for Railway Information Systems (CRIS)',
    place: 'Delhi',
    start: 'May 2024',
    end: 'Jul 2024',
    points: [
      'Built a model forecasting train delays from large-scale historical transit data to improve estimated arrival times.',
      'Engineered preprocessing pipelines for structured railway data, and worked with cross-functional teams on visualisation tools and reports for railway management.',
    ],
  },
];

export const research = [
  {
    title: 'GPU-accelerated Method of Moments for metasurface design',
    venue: 'First-author paper submitted to NCC 2027, under review',
    note: 'CSIR-National Aerospace Laboratories, CEM Division',
    summary:
      'A Method of Moments solver in PyTorch with an FFT-based matrix-free operator and batched GMRES, validated against CST on 4 designs, with 1,000 sweeps projected at about 130× faster than CST (extrapolated from measured single sweeps).',
    href: 'work/gpu-method-of-moments/',
  },
];

export const activities = [
  {
    title: 'Senior Member, Astro Club',
    org: 'BITS Pilani',
    period: 'Nov 2022 – present',
    points: [
      'Contributed to the structural design and flight stabilisation of a custom-built amateur rocket that reached Mach 1.5 and a 2.8 km apogee.',
      'Led a 20+ member team running large stargazing events, with 800+ participants and Rs 80,000+ in revenue.',
    ],
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'SQL (Postgres)', 'TypeScript', 'C++', 'Java', 'R', 'JavaScript'] },
  {
    group: 'Machine learning',
    items: [
      'LLM fine-tuning (PEFT / LoRA)',
      'Speech recognition (Whisper)',
      'RAG and retrieval',
      'Agents (LangGraph)',
      'LLM guardrails',
      'RLHF',
      'Benchmark design and evaluation',
      'Forecasting',
    ],
  },
  {
    group: 'Frameworks',
    items: ['PyTorch', 'Hugging Face Transformers', 'PEFT', 'vLLM', 'scikit-learn', 'pandas', 'NumPy', 'FastAPI', 'Next.js', 'React'],
  },
  { group: 'Tools', items: ['Git', 'Docker', 'GitHub Actions', 'Kaggle GPU workflows', 'Google Cloud Platform'] },
  {
    group: 'Engineering and physics',
    items: ['Computational electromagnetics', 'Aerodynamic optimisation', 'Structural analysis'],
  },
];
