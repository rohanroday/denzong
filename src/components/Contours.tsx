// Topographic contour lines as background texture, plus a drawn silhouette
// of the Kanchenjunga massif as seen from the south. Both are illustrations,
// generated here rather than photos.

function contourPath(i: number, width: number, height: number) {
  const base = height * (0.18 + i * 0.075);
  const amp = 14 + (i % 4) * 7;
  const steps = 12;
  let d = `M 0 ${base.toFixed(1)}`;
  for (let s = 1; s <= steps; s++) {
    const x = (s / steps) * width;
    const y = base + Math.sin(s * 0.9 + i * 0.7) * amp + Math.cos(s * 0.37 + i) * amp * 0.6;
    const cx = x - width / steps / 2;
    const cy = base + Math.sin((s - 0.5) * 0.9 + i * 0.7) * amp * 1.25;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

export function ContourField({ className = "", lines = 11 }: { className?: string; lines?: number }) {
  const w = 1200;
  const h = 800;
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className={className}>
      {Array.from({ length: lines }, (_, i) => (
        <path
          key={i}
          d={contourPath(i, w, h)}
          fill="none"
          stroke="currentColor"
          strokeWidth={i % 5 === 0 ? 1.2 : 0.7}
          opacity={i % 5 === 0 ? 0.55 : 0.35}
        />
      ))}
    </svg>
  );
}

// Simplified ridge: Kabru, Talung, Kanchenjunga main summits, Pandim to the right.
const RIDGE: [number, number][] = [
  [0, 300], [70, 262], [120, 248], [170, 214], [215, 196], [250, 170], [282, 182], [318, 150],
  [352, 166], [392, 128], [430, 104], [458, 82], [478, 92], [500, 70], [526, 58], [548, 76],
  [572, 66], [600, 96], [640, 120], [676, 112], [712, 140], [752, 132], [790, 162], [834, 150],
  [872, 182], [918, 170], [960, 206], [1010, 196], [1060, 232], [1120, 226], [1200, 262], [1200, 300],
];

export function Ridge({ className = "" }: { className?: string }) {
  const line = RIDGE.slice(0, -1).map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ");
  const fill = `${RIDGE.map(([x, y], i) => `${i ? "L" : "M"} ${x} ${y}`).join(" ")} Z`;
  // Snow on the upper massif fading into the forested slopes below.
  return (
    <svg aria-hidden viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" className={className}>
      <defs>
        <linearGradient id="ridge-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.15" stopColor="var(--color-paper)" />
          <stop offset="0.6" stopColor="var(--color-mist-deep)" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#ridge-snow)" />
      <path d={line} fill="none" className="stroke-slate" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
