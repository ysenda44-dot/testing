/** 画面下端の飾り：宮津湾の波と、松並木の続く天橋立のシルエット */
const PINES = Array.from({ length: 60 }, (_, i) => {
  const t = i / 59;
  return {
    x: 260 + t * 900,
    y: 40 - t * 16,
    r: 4 + ((i * 7) % 4) * 0.8,
  };
});

export default function Scenery() {
  return (
    <svg className="scenery" viewBox="0 0 1440 64" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="scenery-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f7fb8" stopOpacity="0.9" />
          <stop offset="1" stopColor="#0e4f80" />
        </linearGradient>
      </defs>
      {/* 砂州（天橋立） */}
      <path d="M230 44 C520 38 860 30 1170 22 C1190 22 1205 24 1212 26 C900 34 560 44 250 49 Z" fill="#f3e7cf" />
      {/* 松並木 */}
      <g fill="#2f6b4f">
        {PINES.map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y - p.r * 0.4} rx={p.r * 1.3} ry={p.r * 0.75} />
        ))}
      </g>
      {/* 海と波 */}
      <path d="M0 46 C180 40 300 52 480 46 S800 38 980 46 1260 52 1440 42 V64 H0 Z" fill="url(#scenery-sea)" />
      <path
        d="M0 55 C120 51 220 59 360 55 S620 50 760 55 1040 60 1200 55 1360 51 1440 54"
        stroke="#e6f1f8"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
