// 地図の下絵データを作る: node scripts/build-basemap.mjs
//
// 国土地理院の「最適化ベクトルタイル」から、宮津市周辺の 海・湖 / 道路 / 鉄道 / 川 だけを取り出して
// src/data/basemap/ に JSON で保存します。サイトはこの JSON を自前の配色で描くので、
// 表示のたびに外部の地図サーバーへ取りに行くことはありません。
// 出典: 国土地理院ベクトルタイル https://maps.gsi.go.jp/development/vt.html
//
// データは元のタイルごとに分けたまま保存します（座標はタイル内の整数 0〜4096）。
// 画面側は、表示中のタイルに重なる分だけを描きます。
//
// ネットワークは curl 経由（プロキシ環境でも動くように）。タイルは .cache/basemap/ に保存して再利用します。
import { VectorTile } from '@mapbox/vector-tile';
import { PbfReader } from 'pbf';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';

const SRC = 'https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1';
const CACHE = '.cache/basemap';
const OUT = 'src/data/basemap';
const EXTENT = 4096;

// name: 出力名 / z: 取り出すタイルのズーム / bbox: [南, 西, 北, 東]
// roads: 入れる道路の種類 / river: 川の線を入れるか / minLake: これより小さい湖・池（タイル座標の面積）は省く
const LEVELS = [
  { name: 'wide', z: 9, bbox: [34.95, 134.25, 36.15, 136.1], roads: ['roadMajor'], river: false, minLake: 6000 },
  { name: 'mid', z: 12, bbox: [35.3, 134.85, 35.85, 135.55], roads: ['roadMajor', 'roadMid'], river: true, minLake: 12000 },
  { name: 'detail', z: 14, bbox: [35.44, 135.1, 35.71, 135.31], roads: ['roadMajor', 'roadMid', 'roadMinor'], river: false, minLake: 12000 },
];

const tileX = (lon, z) => Math.floor(((lon + 180) / 360) * 2 ** z);
const tileY = (lat, z) =>
  Math.floor(((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** z);

function fetchTile(z, x, y) {
  const dir = `${CACHE}/${z}/${x}`;
  const file = `${dir}/${y}.pbf`;
  if (!existsSync(file) || statSync(file).size === 0) {
    mkdirSync(dir, { recursive: true });
    try {
      execFileSync('curl', ['-sS', '-f', '--retry', '2', '-o', file, `${SRC}/${z}/${x}/${y}.pbf`]);
    } catch {
      return null; // 海だけの場所などはタイルがない
    }
  }
  return readFileSync(file);
}

/** [{x,y}, …] → [x0, y0, x1, y1, …]。連続して同じ点は省く */
function flat(points, scale) {
  const out = [];
  for (const p of points) {
    const x = Math.round(p.x * scale);
    const y = Math.round(p.y * scale);
    const n = out.length;
    if (n && out[n - 2] === x && out[n - 1] === y) continue;
    out.push(x, y);
  }
  return out;
}

const ringArea = (r) => {
  let a = 0;
  for (let i = 0; i < r.length - 2; i += 2) a += r[i] * r[i + 3] - r[i + 2] * r[i + 1];
  return Math.abs(a) / 2;
};

mkdirSync(OUT, { recursive: true });
for (const level of LEVELS) {
  const { z, bbox } = level;
  const [s, w, n, e] = bbox;
  const tiles = {};
  const total = {};
  for (let x = tileX(w, z); x <= tileX(e, z); x++) {
    for (let y = tileY(n, z); y <= tileY(s, z); y++) {
      const buf = fetchTile(z, x, y);
      if (!buf) continue;
      const tile = new VectorTile(new PbfReader(buf));
      const data = {};
      const add = (key, parts) => {
        if (!parts.length) return;
        (data[key] ||= []).push(...parts);
        total[key] = (total[key] || 0) + parts.length;
      };
      const each = (name, fn) => {
        const layer = tile.layers[name];
        if (!layer) return;
        const scale = EXTENT / layer.extent;
        for (let i = 0; i < layer.length; i++) {
          const f = layer.feature(i);
          fn(f.properties, f.loadGeometry().map((ring) => flat(ring, scale)));
        }
      };
      each('WA', (p, rings) => {
        const ok = rings.filter((r) => r.length >= 8);
        // 5100番台が海、5200番台が湖・池・川幅のある水面。面はリングをまとめて1つの形として持つ
        if (Math.floor(p.vt_code / 100) === 51) add('sea', ok.length ? [ok] : []);
        else if (ok.length && ringArea(ok[0]) >= level.minLake) add('lake', [ok]);
      });
      each('RdCL', (p, lines) => {
        if (p.vt_lvorder < 0) return; // 地下
        const cat = p.vt_rdctg;
        const key = p.vt_motorway === 1 || cat === '国道' || cat === '高速自動車国道等' ? 'roadMajor' : cat === '都道府県道' ? 'roadMid' : 'roadMinor';
        if (!level.roads.includes(key) || (key === 'roadMinor' && p.vt_rnkwidth === '3m未満')) return;
        add(key, lines.filter((l) => l.length >= 4));
      });
      each('RailCL', (p, lines) => add(p.vt_rtcode === '索道' ? 'ropeway' : 'rail', lines.filter((l) => l.length >= 4)));
      if (level.river) each('RvrCL', (_p, lines) => add('river', lines.filter((l) => l.length >= 4)));
      if (Object.keys(data).length) tiles[`${x}/${y}`] = data;
    }
  }
  const file = `${OUT}/${level.name}.json`;
  writeFileSync(file, JSON.stringify({ z, extent: EXTENT, tiles }));
  const counts = Object.entries(total).map(([k, v]) => `${k} ${v}`).join(', ');
  console.log(`${level.name}: ${Object.keys(tiles).length} tiles → ${(statSync(file).size / 1024).toFixed(0)} KB (${counts})`);
}
