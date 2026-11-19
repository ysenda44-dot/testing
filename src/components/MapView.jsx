import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapConfig, categories } from '../config.js';
import boundary from '../data/miyazu-boundary.json';

const toLatLngs = (ring) => ring.map(([lng, lat]) => [lat, lng]);

function pinHtml({ color, count, active }) {
  return `
    <div class="pin${active ? ' pin--active' : ''}" style="--pin:${color}">
      <svg viewBox="0 0 32 42" aria-hidden="true">
        <path d="M16 41s13-14.2 13-24.5A13 13 0 0 0 3 16.5C3 26.8 16 41 16 41Z" />
        <circle cx="16" cy="16.5" r="5.2" />
      </svg>
      ${count > 1 ? `<span class="pin__count">${count}</span>` : ''}
    </div>`;
}

/**
 * markers: [{ venueId, venue, count, category }]
 * activeVenueId: 強調する会場
 * bottomInset: 画面下を覆うパネルの高さ（スマホ）。地図の中心をずらすのに使う
 */
export default function MapView({ markers, activeVenueId, onSelectVenue, bottomInset = 0, rightInset = 0 }) {
  const el = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const boundsRef = useRef(null);
  const insetRef = useRef({ bottom: bottomInset, right: rightInset });
  const fittingRef = useRef(false); // 日付変更で表示範囲を合わせている最中か
  insetRef.current = { bottom: bottomInset, right: rightInset };

  // 地図の初期化（1回だけ）
  useEffect(() => {
    const map = L.map(el.current, {
      center: mapConfig.center,
      zoom: mapConfig.zoom,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
      maxBounds: mapConfig.maxBounds,
      maxBoundsViscosity: 0.8,
      zoomControl: false,
      attributionControl: false,
    });
    const attribution = L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map);
    L.control.zoom({ position: 'topleft', zoomInTitle: '拡大', zoomOutTitle: '縮小' }).addTo(map);

    L.tileLayer(mapConfig.tileUrl, {
      attribution: mapConfig.tileAttribution,
      maxNativeZoom: 18,
      maxZoom: mapConfig.maxZoom,
      className: 'map-tiles',
    }).addTo(map);

    // 宮津市の外側を淡く覆うマスク
    const rings = boundary.geometry.coordinates.map((poly) => toLatLngs(poly[0]));
    const world = [
      [85, -180],
      [85, 180],
      [-85, 180],
      [-85, -180],
    ];
    L.polygon([world, ...rings], {
      stroke: false,
      fillColor: '#dfeef6',
      fillOpacity: 0.78,
      interactive: false,
    }).addTo(map);
    const outline = L.polygon(rings, {
      color: '#0e4f80',
      weight: 2,
      opacity: 0.7,
      dashArray: '6 6',
      fill: false,
      interactive: false,
    }).addTo(map);
    boundsRef.current = outline.getBounds();
    attribution.addAttribution(mapConfig.boundaryAttribution);

    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      map.remove();
    };
  }, []);

  // マーカーの描き直し
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const m of markers) {
      const active = m.venueId === activeVenueId;
      const color = active ? '#0e4f80' : categories[m.category]?.color || '#1f6fa8';
      const marker = L.marker(m.venue.coordinates, {
        icon: L.divIcon({
          className: 'pin-wrap',
          html: pinHtml({ color, count: m.count, active }),
          iconSize: active ? [40, 52] : [32, 42],
          iconAnchor: active ? [20, 51] : [16, 41],
        }),
        title: m.venue.name,
        alt: `${m.venue.name}（${m.count}件）`,
        keyboard: true,
        riseOnHover: true,
        zIndexOffset: active ? 1000 : 0,
      });
      marker.bindTooltip(m.venue.shortName || m.venue.name, {
        direction: 'top',
        offset: active ? [0, -50] : [0, -40],
        permanent: active,
        className: 'pin-tooltip',
      });
      marker.on('click', () => onSelectVenue(m.venueId));
      marker.addTo(layer);
    }
  }, [markers, activeVenueId, onSelectVenue]);

  // 表示範囲：日付が変わったら（またはパネルの大きさが変わったら）その日の会場が収まるように
  const markerKey = markers.map((m) => m.venueId).join(',');
  const insetKey = `${Math.round(bottomInset / 40)}:${Math.round(rightInset / 40)}`;
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const { bottom, right } = insetRef.current;
    const small = el.current.clientWidth < 600;
    const opts = {
      paddingTopLeft: small ? [40, 110] : [60, 130],
      paddingBottomRight: small ? [40, 24 + bottom] : [40 + right, 60 + bottom],
      maxZoom: 15,
      animate: true,
    };
    fittingRef.current = true;
    map.once('moveend', () => {
      fittingRef.current = false;
    });
    if (markers.length) {
      map.flyToBounds(L.latLngBounds(markers.map((m) => m.venue.coordinates)), { ...opts, duration: 0.6 });
    } else if (boundsRef.current) {
      map.flyToBounds(boundsRef.current, { ...opts, maxZoom: 13, duration: 0.6 });
    }
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
