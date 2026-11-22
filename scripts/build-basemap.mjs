// 地図の下絵データを作る: node scripts/build-basemap.mjs
//
// 国土地理院の「最適化ベクトルタイル」から、宮津市周辺の 海・湖 / 道路 / 鉄道 / 川 だけを取り出して
// src/data/basemap/ に JSON で保存します。サイトはこの JSON を自前の配色で描くので、
// 表示のたびに外部の地図サーバーへ取りに行くことはありません。
// 出典: 国土地理院ベクトルタイル https://maps.gsi.go.jp/development/vt.html
//
// ネットワークは curl 経由（プロキシ環境でも動くように）。タイルは .cache/basemap/ に保存して再利用します。
import { VectorTile } from '@mapbox/vector-tile';
import { PbfReader } from 'pbf';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';

const SRC = 'https://cyberjapandata.gsi.go.jp/xyz/optimal_bvmap-v1';
const CACHE = '.cache/basemap';
const OUT = 'src/data/basemap';

// name: 出力名 / z: 取り出すタイルのズーム / bbox: [南, 西, 北, 東] / digits: 座標の小数桁
// roads: 入れる道路の種類 / river: 川の線を入れるか / minLake: これより小さい湖・池（度の2乗）は省く
const LEVELS = [
  { name: 'wide', z: 9, bbox: [34.95, 134.25, 36.15, 136.1], digits: 3, roads: ['roadMajor'], river: false, minLake: 1e-4 },
  { name: 'mid', z: 12, bbox: [35.3, 134.85, 35.85, 135.55], digits: 4, roads: ['roadMajor', 'roadMid'], river: true, minLake: 3e-6 },
  { name: 'detail', z: 14, bbox: [35.44, 135.1, 35.71, 135.31], digits: 5, roads: ['roadMajor', 'roadMid', 'roadMinor'], river: false, minLake: 2e-7 },
];

const ringArea = (r) => Math.abs(r.reduce((a, p, i) => a + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0)) / 2;

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

const round = (n, d) => Number(n.toFixed(d));

/** GeoJSON の座標列 [lng, lat] → 丸めた [lat, lng]。連続して同じ点は省く */
function toLatLngs(coords, digits) {
  const out = [];
  for (const [lng, lat] of coords) {
    const p = [round(lat, digits), round(lng, digits)];
    const q = out[out.length - 1];
    if (!q || q[0] !== p[0] || q[1] !== p[1]) out.push(p);
  }
  return out;
}

function lines(geometry, digits) {
  const parts = geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates;
  return parts.map((c) => toLatLngs(c, digits)).filter((c) => c.length >= 2);
}

function polygons(geometry, digits) {
  const polys = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polys
    .map((rings) => rings.map((r) => toLatLngs(r, digits)).filter((r) => r.length >= 4))
    .filter((rings) => rings.length);
}

mkdirSync(OUT, { recursive: true });
for (const level of LEVELS) {
  const { z, bbox, digits } = level;
  const [s, w, n, e] = bbox;
  const data = { sea: [], lake: [], roadMajor: [], roadMid: [], roadMinor: [], rail: [], ropeway: [], river: [] };
  let tiles = 0;
  for (let x = tileX(w, z); x <= tileX(e, z); x++) {
    for (let y = tileY(n, z); y <= tileY(s, z); y++) {
      const buf = fetchTile(z, x, y);
      if (!buf) continue;
      tiles++;
      const tile = new VectorTile(new PbfReader(buf));
      const each = (name, fn) => {
        const layer = tile.layers[name];
        if (!layer) return;
        for (let i = 0; i < layer.length; i++) {
          const f = layer.feature(i);
          fn(f.properties, f.toGeoJSON(x, y, z).geometry);
        }
      };
      each('WA', (p, g) => {
        // 5100番台が海、5200番台が湖・池・川幅のある水面
        const polys = polygons(g, digits);
        if (Math.floor(p.vt_code / 100) === 51) data.sea.push(...polys);
        else data.lake.push(...polys.filter((rings) => ringArea(rings[0]) >= level.minLake));
      });
      each('RdCL', (p, g) => {
        if (p.vt_lvorder < 0) return; // 地下
        const cat = p.vt_rdctg;
        const key = p.vt_motorway === 1 || cat === '国道' || cat === '高速自動車国道等' ? 'roadMajor' : cat === '都道府県道' ? 'roadMid' : 'roadMinor';
        if (!level.roads.includes(key) || (key === 'roadMinor' && p.vt_rnkwidth === '3m未満')) return;
        data[key].push(...lines(g, digits));
      });
      each('RailCL', (p, g) => {
        (p.vt_rtcode === '索道' ? data.ropeway : data.rail).push(...lines(g, digits));
      });
      if (level.river) each('RvrCL', (_p, g) => data.river.push(...lines(g, digits)));
    }
  }
  const file = `${OUT}/${level.name}.json`;
  writeFileSync(file, JSON.stringify({ z, bbox, ...data }));
  const counts = Object.entries(data).map(([k, v]) => `${k} ${v.length}`).join(', ');
  console.log(`${level.name}: ${tiles} tiles → ${(statSync(file).size / 1024).toFixed(0)} KB (${counts})`);
}
