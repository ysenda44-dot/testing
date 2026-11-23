// 自前の配色で描く地図の下絵。
//
// Leaflet のタイル（256px四方）ごとに canvas を作り、そのタイルに重なる分だけを描く。
// 一度描いたタイルは Leaflet が保持して使い回すので、ドラッグやズームのたびに全体を描き直さずに済む。
// データは scripts/build-basemap.mjs が作る3段階（wide / mid / detail）で、必要になった段階だけ読み込む。
import L from 'leaflet';
import boundary from '../data/miyazu-boundary.json';

const LOADERS = {
  wide: () => import('../data/basemap/wide.json'),
  mid: () => import('../data/basemap/mid.json'),
  detail: () => import('../data/basemap/detail.json'),
};

// 表示ズームごとに使う段階。先頭から順に、そのタイルのデータがある最初のものを使う
const levelsFor = (z) => (z >= 14 ? ['detail', 'mid', 'wide'] : z >= 12 ? ['mid', 'wide'] : ['wide']);

const COLOR = {
  outside: '#f9f6f0', // 市外の陸
  land: '#f3eee2', // 宮津市の陸
  boundary: 'rgba(14, 79, 128, 0.35)',
  water: '#bfdcec',
  river: '#a9cfe3',
  casing: '#e2d9c6',
  road: '#ffffff',
  roadMajor: '#fff7e3',
  rail: '#8b97a0',
};

// 線の太さ（px）。[〜13, 14, 15, 16〜]
const pick = (z, widths) => widths[Math.max(0, Math.min(3, z - 13))];
const WIDTH = {
  majorCasing: [5, 6, 8, 11],
  major: [3.4, 4.4, 6, 9],
  midCasing: [3.6, 4.6, 6.5, 9],
  mid: [2.2, 3.2, 5, 7.5],
  minorCasing: [0, 0, 3.8, 6.4],
  minor: [1.4, 1.6, 2.6, 5],
  rail: [2.6, 2.8, 3.2, 4],
};

// 市境をメルカトルの世界座標（0〜1）にしておく
const cityRings = boundary.geometry.coordinates.map((poly) =>
  poly[0].map(([lng, lat]) => [
    (lng + 180) / 360,
    (1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2,
  ]),
);

/** 線や面ごとに、囲む四角形（タイル座標）を付けておく。描くときに画面外のものを飛ばすため */
function index(level) {
  const box = (pts, b) => {
    for (let i = 0; i < pts.length; i += 2) {
      if (pts[i] < b[0]) b[0] = pts[i];
      if (pts[i + 1] < b[1]) b[1] = pts[i + 1];
      if (pts[i] > b[2]) b[2] = pts[i];
      if (pts[i + 1] > b[3]) b[3] = pts[i + 1];
    }
    return b;
  };
  for (const tile of Object.values(level.tiles)) {
    for (const [key, items] of Object.entries(tile)) {
      const isArea = key === 'sea' || key === 'lake';
      tile[key] = items.map((item) => {
        const b = [Infinity, Infinity, -Infinity, -Infinity];
        if (isArea) item.forEach((ring) => box(ring, b));
        else box(item, b);
        return { pts: item, box: b };
      });
    }
  }
  return level;
}

// タイルの描画は1コマあたり数ミリ秒ずつに分ける。ズーム直後に何十枚も一度に描くと画面が固まるため
const queue = [];
let scheduled = false;
function runQueue() {
  scheduled = false;
  const start = performance.now();
  while (queue.length && performance.now() - start < 6) queue.shift()();
  if (queue.length) schedule();
}
function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(runQueue);
}

export function createBasemapLayer(options = {}) {
  const cache = {}; // 段階名 → Promise<データ>
  const load = (name) => (cache[name] ||= LOADERS[name]().then((m) => index(m.default)));
  // 拡大したときに待たせないよう、手が空いたときに細かい段階も読んでおく
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  idle(() => ['mid', 'wide', 'detail'].forEach(load));

  const Layer = L.GridLayer.extend({
    createTile(coords, done) {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const size = this.getTileSize().x;
      const canvas = L.DomUtil.create('canvas', 'leaflet-tile');
      canvas.width = canvas.height = size * ratio;
      Promise.all(levelsFor(coords.z).map(load))
        .then((levels) => {
          queue.push(() => {
            if (!canvas.isConnected) return; // もう画面から外れたタイル
            const ctx = canvas.getContext('2d');
            ctx.scale(ratio, ratio);
            drawTile(ctx, coords, size, levels);
            done(null, canvas);
          });
          schedule();
        })
        .catch((err) => done(err, canvas));
      return canvas;
    },
  });
  return new Layer({ tileSize: 256, keepBuffer: 2, updateWhenZooming: false, ...options });
}

function drawTile(ctx, { x, y, z }, size, levels) {
  // 陸：市外は淡く、宮津市は少し濃く
  ctx.fillStyle = COLOR.outside;
  ctx.fillRect(0, 0, size, size);
  const n = 2 ** z;
  ctx.beginPath();
  for (const ring of cityRings) {
    ring.forEach(([wx, wy], i) => {
      const px = (wx * n - x) * size;
      const py = (wy * n - y) * size;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    });
    ctx.closePath();
  }
  ctx.fillStyle = COLOR.land;
  ctx.fill();

  // このタイルを含む元タイルを、細かい段階から順に探す
  let data = null;
  let scale = 1;
  let ox = 0;
  let oy = 0;
  for (const level of levels) {
    const dz = z - level.z;
    if (dz < 0) continue;
    const sx = x >> dz;
    const sy = y >> dz;
    const found = level.tiles[`${sx}/${sy}`];
    if (!found) continue;
    data = found;
    scale = (size * 2 ** dz) / level.extent;
    ox = (x - (sx << dz)) * size;
    oy = (y - (sy << dz)) * size;
    break;
  }

  // このタイルに重なるものだけ描く（線の太さぶんの余白を見る）
  const pad = 12 / scale;
  const x0 = ox / scale - pad;
  const y0 = oy / scale - pad;
  const x1 = (ox + size) / scale + pad;
  const y1 = (oy + size) / scale + pad;
  const visible = (b) => b[2] >= x0 && b[0] <= x1 && b[3] >= y0 && b[1] <= y1;

  const trace = (pts) => {
    ctx.moveTo(pts[0] * scale - ox, pts[1] * scale - oy);
    for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i] * scale - ox, pts[i + 1] * scale - oy);
  };
  const fill = (polys, color) => {
    if (!polys) return;
    ctx.beginPath();
    for (const poly of polys) {
      if (!visible(poly.box)) continue;
      for (const ring of poly.pts) {
        trace(ring);
        ctx.closePath();
      }
    }
    ctx.fillStyle = color;
    ctx.fill('nonzero');
  };
  const stroke = (lines, color, width, dash) => {
    if (!lines || !width) return;
    ctx.beginPath();
    for (const line of lines) if (visible(line.box)) trace(line.pts);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash || []);
    ctx.lineCap = dash ? 'butt' : 'round';
    ctx.stroke();
  };

  if (data) {
    ctx.lineJoin = 'round';
    fill(data.sea, COLOR.water);
    fill(data.lake, COLOR.water);
    stroke(data.river, COLOR.river, 1.2);
  }

  // 市境は海の上にも見えるよう、水面のあとに描く
  ctx.beginPath();
  for (const ring of cityRings) {
    ring.forEach(([wx, wy], i) => {
      const px = (wx * n - x) * size;
      const py = (wy * n - y) * size;
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    });
    ctx.closePath();
  }
  ctx.strokeStyle = COLOR.boundary;
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.stroke();

  if (!data) return;
  stroke(data.roadMinor, COLOR.casing, pick(z, WIDTH.minorCasing));
  stroke(data.roadMinor, COLOR.road, pick(z, WIDTH.minor));
  stroke(data.roadMid, COLOR.casing, pick(z, WIDTH.midCasing));
  stroke(data.roadMid, COLOR.road, pick(z, WIDTH.mid));
  stroke(data.roadMajor, COLOR.casing, pick(z, WIDTH.majorCasing));
  stroke(data.roadMajor, COLOR.roadMajor, pick(z, WIDTH.major));
  stroke(data.ropeway, COLOR.rail, 1, [2, 5]);
  const rail = pick(z, WIDTH.rail);
  stroke(data.rail, COLOR.rail, rail);
  stroke(data.rail, '#ffffff', rail * 0.45, [7, 7]);
}
