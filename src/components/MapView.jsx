import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapConfig } from '../config.js';
import boundary from '../data/miyazu-boundary.json';
import { labels } from '../data/basemap/labels.js';

// 下絵は3段階。ズームに合わせて読み込み、自前の配色で描く
const LEVELS = [
  { name: 'wide', maxZoom: 11.5, load: () => import('../data/basemap/wide.json') },
  { name: 'mid', maxZoom: 13.5, load: () => import('../data/basemap/mid.json') },
  { name: 'detail', maxZoom: 99, load: () => import('../data/basemap/detail.json') },
];
const levelFor = (zoom) => LEVELS.find((l) => zoom <= l.maxZoom);

const COLOR = {
  sea: '#bfdcec',
  river: '#a9cfe3',
  roadCasing: '#e2d9c6',
  road: '#ffffff',
  rail: '#8b97a0',
  boundary: '#0e4f80',
};
const PIN = { today: '#d9523a', upcoming: '#0e4f80', exp: '#1f8a8a' };

const toLatLngs = (ring) => ring.map(([lng, lat]) => [lat, lng]);

/** 1段階ぶんの下絵を、重ねる順にレイヤーにする */
function buildLevel(data, renderer) {
  const base = { renderer, interactive: false };
  const line = (lines, style) => L.polyline(lines, { ...base, lineCap: 'round', lineJoin: 'round', ...style });
  const g = L.layerGroup();
  // 海の面はタイルごとに少し重なっている。既定の塗り方（evenodd）だと重なりが抜けるので nonzero にする
  const water = { ...base, stroke: false, fillOpacity: 1, fillRule: 'nonzero' };
  L.polygon(data.sea, { ...water, fillColor: COLOR.sea }).addTo(g);
  if (data.lake.length) L.polygon(data.lake, { ...water, fillColor: COLOR.sea }).addTo(g);
  if (data.river.length) line(data.river, { color: COLOR.river, weight: 1.2 }).addTo(g);
  if (data.roadMinor.length) line(data.roadMinor, { color: COLOR.road, weight: 1.6 }).addTo(g);
  if (data.roadMid.length) {
    line(data.roadMid, { color: COLOR.roadCasing, weight: 3.6 }).addTo(g);
    line(data.roadMid, { color: COLOR.road, weight: 2.2 }).addTo(g);
  }
  line(data.roadMajor, { color: COLOR.roadCasing, weight: 5 }).addTo(g);
  line(data.roadMajor, { color: '#fff7e3', weight: 3.4 }).addTo(g);
  if (data.ropeway.length) line(data.ropeway, { color: COLOR.rail, weight: 1, dashArray: '2 5' }).addTo(g);
  line(data.rail, { color: COLOR.rail, weight: 2.6 }).addTo(g);
  line(data.rail, { color: '#ffffff', weight: 1.2, dashArray: '7 7', lineCap: 'butt' }).addTo(g);
  return g;
}

function pinHtml({ color, count, active }) {
  return `
    <div class="pin${active ? ' pin--active' : ''}" style="--pin:${color}">
      <svg viewBox="0 0 32 42" aria-hidden="true">
        <path d="M16 41s13-14.2 13-24.5A13 13 0 0 0 3 16.5C3 26.8 16 41 16 41Z" />
        ${count > 1 ? '' : '<circle cx="16" cy="16.5" r="5.2" />'}
      </svg>
      ${count > 1 ? `<span class="pin__count">${count}</span>` : ''}
    </div>`;
}

/** 画面上で近いピンを1つにまとめる */
function cluster(map, markers, activeVenueId) {
  const R = 34; // これより近いピンはまとめる（px）
  const groups = [];
  const sorted = [...markers].sort((a, b) => Number(b.venueId === activeVenueId) - Number(a.venueId === activeVenueId));
  for (const m of sorted) {
    const pt = map.latLngToLayerPoint(m.venue.coordinates);
    const g = groups.find((x) => x.pt.distanceTo(pt) < R);
    if (g) g.items.push(m);
    else groups.push({ pt, items: [m] });
  }
  return groups.map((g) => g.items);
}

/**
 * markers: [{ venueId, venue, count, kind: 'today' | 'upcoming' | 'exp' }]
 * activeVenueId: 強調する会場
 * bottomInset / rightInset: パネルに隠れる幅。表示範囲を合わせるときに避ける
 */
export default function MapView({ markers, activeVenueId, onSelectVenue, bottomInset = 0, rightInset = 0 }) {
  const el = useRef(null);
  const mapRef = useRef(null);
  const pinLayerRef = useRef(null);
  const boundsRef = useRef(null);
  const drawPinsRef = useRef(() => {});
  const insetRef = useRef({ bottom: bottomInset, right: rightInset });
  const fittingRef = useRef(false); // 表示範囲を合わせている最中か
  insetRef.current = { bottom: bottomInset, right: rightInset };

  // 地図の初期化（1回だけ）
  useEffect(() => {
    const map = L.map(el.current, {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
      maxBounds: mapConfig.maxBounds,
      maxBoundsViscosity: 0.9,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.5,
    });
    L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map).addAttribution(mapConfig.attribution);
    L.control.zoom({ position: 'topleft', zoomInTitle: '拡大', zoomOutTitle: '縮小' }).addTo(map);

    // 重ね順：市外を淡くする面 → 下絵（海・道路・線路） → 市境の線 → 地名
    map.createPane('mask').style.zIndex = 150;
    map.createPane('base').style.zIndex = 200;
    map.createPane('outline').style.zIndex = 300;
    map.createPane('labels').style.zIndex = 450;
    map.getPane('labels').style.pointerEvents = 'none';
    const baseRenderer = L.canvas({ pane: 'base', padding: 0.3 });

    // 下絵：ズームに合う段階を読み込んで差し替える
    const loaded = new Map();
    let shown = null;
    let alive = true;
    const showLevel = async () => {
      const level = levelFor(map.getZoom());
      if (shown === level.name) return;
      if (!loaded.has(level.name)) {
        const mod = await level.load();
        if (!alive) return;
        loaded.set(level.name, buildLevel(mod.default, baseRenderer));
      }
      if (levelFor(map.getZoom()) !== level) return; // 読み込み中にズームが変わった
      if (shown) map.removeLayer(loaded.get(shown));
      loaded.get(level.name).addTo(map);
      shown = level.name;
    };

    // 宮津市の外側を淡く覆い、市境を細い線で示す
    const rings = boundary.geometry.coordinates.map((poly) => toLatLngs(poly[0]));
    const world = [
      [85, -180],
      [85, 180],
      [-85, 180],
      [-85, -180],
    ];
    L.polygon([world, ...rings], { pane: 'mask', stroke: false, fillColor: '#ffffff', fillOpacity: 0.55, interactive: false }).addTo(map);
    const outline = L.polygon(rings, {
      pane: 'outline',
      color: COLOR.boundary,
      weight: 1.2,
      opacity: 0.45,
      dashArray: '2 5',
      fill: false,
      interactive: false,
    }).addTo(map);
    boundsRef.current = outline.getBounds();

    // 地名
    const labelLayer = L.layerGroup().addTo(map);
    const drawLabels = () => {
      const z = map.getZoom();
      labelLayer.clearLayers();
      for (const l of labels) {
        if (z < l.min || (l.max && z > l.max)) continue;
        L.marker(l.at, {
          pane: 'labels',
          interactive: false,
          keyboard: false,
          icon: L.divIcon({ className: `map-label map-label--${l.kind}`, html: `<span>${l.name}</span>`, iconSize: [0, 0] }),
        }).addTo(labelLayer);
      }
    };

    pinLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const onZoom = () => {
      showLevel();
      drawLabels();
      drawPinsRef.current();
    };
    map.on('zoomend', onZoom);
    onZoom();

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el.current);
    return () => {
      alive = false;
      ro.disconnect();
      map.remove();
    };
  }, []);

  // ピンの描き直し（近いものはまとめる）
  useEffect(() => {
    const draw = () => {
      const map = mapRef.current;
      const layer = pinLayerRef.current;
      if (!map || !layer) return;
      layer.clearLayers();
      for (const items of cluster(map, markers, activeVenueId)) {
        const active = items.some((m) => m.venueId === activeVenueId);
        const count = items.reduce((n, m) => n + m.count, 0);
        const kind = items.some((m) => m.kind === 'today') ? 'today' : items[0].kind;
        const lat = items.reduce((n, m) => n + m.venue.coordinates[0], 0) / items.length;
        const lng = items.reduce((n, m) => n + m.venue.coordinates[1], 0) / items.length;
        const names = items.map((m) => m.venue.shortName || m.venue.name);
        const label = names.length > 2 ? `${names.slice(0, 2).join('・')} ほか${names.length - 2}か所` : names.join('・');
        const marker = L.marker(items.length === 1 ? items[0].venue.coordinates : [lat, lng], {
          icon: L.divIcon({
            className: 'pin-wrap',
            html: pinHtml({ color: PIN[kind], count, active }),
            iconSize: active ? [40, 52] : [34, 44],
            iconAnchor: active ? [20, 51] : [17, 43],
          }),
          title: label,
          alt: `${label}（${count}件）`,
          keyboard: true,
          riseOnHover: true,
          zIndexOffset: active ? 1000 : 0,
        });
        marker.bindTooltip(label, {
          direction: 'top',
          offset: active ? [0, -50] : [0, -42],
          // 拡大したら会場名を出しっぱなしにする
          permanent: items.length === 1 && (active || map.getZoom() >= 15),
          className: 'pin-tooltip',
        });
        marker.on('click', () => {
          const canSplit = items.length > 1 && map.getZoom() < map.getMaxZoom() - 0.5;
          if (canSplit) {
            const { bottom, right } = insetRef.current;
            map.flyToBounds(L.latLngBounds(items.map((m) => m.venue.coordinates)), {
              paddingTopLeft: [70, 130],
              paddingBottomRight: [70 + right, 70 + bottom],
              maxZoom: map.getMaxZoom(),
              duration: 0.5,
            });
          } else {
            onSelectVenue(items[0].venueId);
          }
        });
        marker.addTo(layer);
      }
    };
    drawPinsRef.current = draw;
    draw();
  }, [markers, activeVenueId, onSelectVenue]);

  // 表示範囲：一覧の会場が変わったら（またはパネルの大きさが変わったら）収まるように
  const markerKey = markers.map((m) => m.venueId).join(',');
  const insetKey = `${Math.round(bottomInset / 40)}:${Math.round(rightInset / 40)}`;
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { bottom, right } = insetRef.current;
    const small = el.current.clientWidth < 600;
    const opts = {
      paddingTopLeft: small ? [40, 100] : [60, 120],
      paddingBottomRight: small ? [40, 24 + bottom] : [50 + right, 50 + bottom],
      maxZoom: 15,
      animate: true,
      duration: 0.6,
    };
    fittingRef.current = true;
    map.once('moveend', () => {
      fittingRef.current = false;
    });
    if (markers.length) map.flyToBounds(L.latLngBounds(markers.map((m) => m.venue.coordinates)), opts);
    else if (boundsRef.current) map.flyToBounds(boundsRef.current, { ...opts, maxZoom: 13 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, insetKey]);

  // 選択中の会場が見えるように
  useEffect(() => {
    const map = mapRef.current;
    const m = markers.find((x) => x.venueId === activeVenueId);
    // 範囲合わせの途中なら、その範囲に会場が含まれるので動かさない
    if (!map || !m || fittingRef.current) return;
    const { bottom, right } = insetRef.current;
    const small = el.current.clientWidth < 600;
    map.panInside(m.venue.coordinates, {
      paddingTopLeft: small ? [40, 110] : [60, 130],
      paddingBottomRight: [40 + right, 40 + bottom],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVenueId]);

  return <div ref={el} className="map" role="region" aria-label="イベント会場の地図" />;
}
