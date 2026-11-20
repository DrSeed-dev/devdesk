type BackgroundItem = {
  text: string;
  top: string;
  left: string;
  rotate: number;
  size: string;
};

type Tier = {
  columns: number;
  rows: number;
  seed: number;
  nameSizes: string[];
  symbolSizes: string[];
};

// Tech stack names, tools and languages.
const NAMES = [
  "React", "TypeScript", "JavaScript", "Next.js", "Node.js", "Vite",
  "Tailwind CSS", "HTML5", "CSS3", "Angular", "Vue", "Svelte", "Redux",
  "Zustand", "Framer Motion", "React Router", "GraphQL", "REST API", "JSON",
  "SQL", "PostgreSQL", "MongoDB", "Prisma", "Supabase", "Firebase", "Docker",
  "Git", "GitHub", "Vercel", "Netlify", "Cloudflare", "npm", "pnpm", "ESLint",
  "Prettier", "Vitest", "Jest", "Cypress", "Playwright", "Figma", "VS Code",
  "Cursor", "PowerShell", "Bash", "Linux", "Python", "Java", "Go", "Rust",
  "PHP", "Kotlin", "WebSocket", "OAuth", "JWT", "CI/CD", "Webpack", "Babel",
  "Storybook", "Sass", "Redis", "Express", "NestJS", "Three.js", "WebAssembly",
  "Postman",
];

// Code symbols and keywords.
const SYMBOLS = [
  "{ }", "</>", "=>", "//", "01", "&&", "( )", "[ ]", ";", "===", "||", "<T>",
  "#!", "async", "await", "const", "import", "export", "return",
  "npm run dev", "git push", "sudo",
];

// A tiny seeded random number generator. Same seed, same layout, every time,
// so the background never jumps around between renders.
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

// Lays words out on an even grid of cells, then nudges each one a little
// inside its own cell. That gives a loose, hand-placed look with no big
// empty patches and no words piling on top of each other.
function buildItems(tier: Tier): BackgroundItem[] {
  const random = createRandom(tier.seed);
  const names = shuffle(NAMES, random);
  const symbols = shuffle(SYMBOLS, random);
  const total = tier.columns * tier.rows;
  const items: BackgroundItem[] = [];

  let nameIndex = 0;
  let symbolIndex = 0;

  for (let index = 0; index < total; index++) {
    const isSymbol = random() < 0.28;
    const sizes = isSymbol ? tier.symbolSizes : tier.nameSizes;

    const text = isSymbol
      ? symbols[symbolIndex++ % symbols.length]
      : names[nameIndex++ % names.length];

    const column = index % tier.columns;
    const row = Math.floor(index / tier.columns);

    const left = ((column + 0.04 + random() * 0.2) / tier.columns) * 100;
    const top = ((row + 0.08 + random() * 0.45) / tier.rows) * 100;

    items.push({
      text,
      top: `${top.toFixed(1)}%`,
      left: `${left.toFixed(1)}%`,
      rotate: Math.round((random() - 0.5) * 28),
      size: sizes[Math.floor(random() * sizes.length)],
    });
  }

  return items;
}

// Phones get fewer, smaller words so nothing crowds or gets cut off.
const MOBILE_ITEMS = buildItems({
  columns: 3,
  rows: 14,
  seed: 11,
  nameSizes: ["text-xs", "text-sm"],
  symbolSizes: ["text-lg", "text-2xl"],
});

// Large screens get a full wall of them.
const DESKTOP_ITEMS = buildItems({
  columns: 9,
  rows: 6,
  seed: 29,
  nameSizes: ["text-base", "text-lg", "text-xl", "text-2xl"],
  symbolSizes: ["text-3xl", "text-4xl", "text-5xl"],
});

function renderItems(items: BackgroundItem[]) {
  return items.map((item, index) => (
    <span
      key={index}
      className={`absolute whitespace-nowrap font-mono font-bold text-slate-900/[0.12] dark:text-white/[0.14] ${item.size}`}
      style={{
        top: item.top,
        left: item.left,
        transform: `rotate(${item.rotate}deg)`,
      }}
    >
      {item.text}
    </span>
  ));
}

function CodeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <div className="absolute inset-0 lg:hidden">
        {renderItems(MOBILE_ITEMS)}
      </div>

      <div className="absolute inset-0 hidden lg:block">
        {renderItems(DESKTOP_ITEMS)}
      </div>
    </div>
  );
}

export default CodeBackground;