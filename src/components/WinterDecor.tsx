const PALETTE = {
  frost: "#6c8faa",
  navy: "#2f4858",
  berry: "#8b3a42",
  gold: "#c9a66b",
  pine: "#3f5d4a",
};

// One tile, tiled via a CSS background (not stretched per-section), so
// the motifs are the exact same size everywhere and the pattern always
// fully covers a section no matter how tall it grows — no per-section
// scaling, no empty gaps at the bottom.
const TILE_W = 320;
const TILE_H = 360;

type Decoration = {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  color: string;
  kind: "snowflake" | "sprig";
};

const DECORATIONS: Decoration[] = [
  { x: 55, y: 65, scale: 1.1, rotate: -15, color: PALETTE.frost, kind: "snowflake" },
  { x: 185, y: 45, scale: 0.9, rotate: 10, color: PALETTE.pine, kind: "sprig" },
  { x: 272, y: 115, scale: 1.1, rotate: 25, color: PALETTE.navy, kind: "snowflake" },
  { x: 38, y: 205, scale: 0.95, rotate: -20, color: PALETTE.pine, kind: "sprig" },
  { x: 155, y: 235, scale: 1.15, rotate: -35, color: PALETTE.gold, kind: "snowflake" },
  { x: 255, y: 265, scale: 0.9, rotate: 15, color: PALETTE.pine, kind: "sprig" },
  { x: 95, y: 315, scale: 1, rotate: 40, color: PALETTE.frost, kind: "snowflake" },
  { x: 225, y: 335, scale: 0.85, rotate: -10, color: PALETTE.navy, kind: "snowflake" },
];

function snowflakeMarkup({ x, y, scale, rotate, color }: Decoration) {
  const t = `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
  const arms = [0, 60, 120]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const dx = (Math.cos(rad) * 26).toFixed(1);
      const dy = (Math.sin(rad) * 26).toFixed(1);
      const tick = (dist: number, side: 1 | -1) => {
        const bx = Math.cos(rad) * dist;
        const by = Math.sin(rad) * dist;
        const perp = rad + (side * Math.PI) / 4;
        const tx = (bx + Math.cos(perp) * 6).toFixed(1);
        const ty = (by + Math.sin(perp) * 6).toFixed(1);
        return `M${bx.toFixed(1)} ${by.toFixed(1)} L${tx} ${ty} M${(-bx).toFixed(1)} ${(-by).toFixed(1)} L${(-Number(tx)).toFixed(1)} ${(-Number(ty)).toFixed(1)}`;
      };
      return `
        <path d="M${-Number(dx)} ${-Number(dy)} L${dx} ${dy}" stroke="${color}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <path d="${tick(16, 1)} ${tick(16, -1)}" stroke="${color}" stroke-width="1.7" stroke-linecap="round" fill="none"/>
      `;
    })
    .join("");
  return `<g transform="${t}" opacity="0.85"><circle r="2.4" fill="${color}"/>${arms}</g>`;
}

function sprigMarkup({ x, y, scale, rotate, color }: Decoration) {
  const t = `translate(${x} ${y}) rotate(${rotate}) scale(${scale})`;
  const needles = [-18, -9, 0, 9, 18]
    .map((off) => {
      const len = (16 - Math.abs(off) * 0.3).toFixed(1);
      return `
        <path d="M0 ${off} L${-Number(len)} ${off - 6}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" fill="none"/>
        <path d="M0 ${off} L${len} ${off - 6}" stroke="${color}" stroke-width="1.6" stroke-linecap="round" fill="none"/>
      `;
    })
    .join("");
  return `
    <g transform="${t}" opacity="0.85">
      <path d="M0 -24 L0 20" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/>
      ${needles}
      <circle cx="0" cy="24" r="3.4" fill="${PALETTE.berry}"/>
      <circle cx="-5.5" cy="27" r="2.6" fill="${PALETTE.berry}" opacity="0.8"/>
    </g>
  `;
}

function decorationMarkup(d: Decoration) {
  return d.kind === "snowflake" ? snowflakeMarkup(d) : sprigMarkup(d);
}

const TILE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">
  ${DECORATIONS.map(decorationMarkup).join("")}
</svg>`;

const TILE_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(TILE_SVG)}")`;

export default function WinterDecor({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: TILE_DATA_URI,
        backgroundRepeat: "repeat",
        backgroundSize: `${TILE_W}px ${TILE_H}px`,
      }}
      aria-hidden="true"
    />
  );
}
