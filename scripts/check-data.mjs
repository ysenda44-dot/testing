// イベントデータの簡易チェック: npm run check-data
// 必須項目・日付の形式・会場IDの存在・重複IDなどを確認します。
import { events } from '../src/data/events.js';
import { venues } from '../src/data/venues.js';
import { categories } from '../src/config.js';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const HM = /^\d{1,2}:\d{2}$/;
const REQUIRED = ['id', 'title', 'description', 'category', 'venueId', 'dates', 'time', 'ageLabel', 'priceLabel', 'reservation', 'sourceName', 'sourceUrl', 'verifiedAt'];
const TRI = [true, false, null];
const RESERVATION = ['none', 'required', 'closed', 'unknown'];
const AGES = ['baby', 'preschool', 'elementary', 'junior', 'high', 'adult'];

const errors = [];
const err = (id, msg) => errors.push(`[${id}] ${msg}`);
const ids = new Set();

for (const [vid, v] of Object.entries(venues)) {
  if (!v.name || !v.address) err(`venue:${vid}`, 'name と address は必須です');
  const [lat, lng] = v.coordinates || [];
  if (!(lat > 20 && lat < 46 && lng > 122 && lng < 154)) err(`venue:${vid}`, `座標が日本の範囲外です: ${v.coordinates}`);
}

for (const e of events) {
  const id = e.id || '(idなし)';
  for (const k of REQUIRED) if (e[k] === undefined || e[k] === '') err(id, `${k} がありません`);
  if (ids.has(e.id)) err(id, 'id が重複しています');
  ids.add(e.id);
  if (!venues[e.venueId]) err(id, `venueId "${e.venueId}" が venues.js にありません`);
  if (!categories[e.category]) err(id, `category "${e.category}" が config.js にありません`);
  if (!Array.isArray(e.dates) || !e.dates.length) err(id, 'dates が空です');
  else {
    for (const d of e.dates) if (!ISO.test(d)) err(id, `dates の形式が不正です: ${d}`);
    const sorted = [...e.dates].sort();
    if (sorted.join() !== e.dates.join()) err(id, 'dates は日付順に並べてください');
    if (new Set(e.dates).size !== e.dates.length) err(id, 'dates に重複があります');
  }
  for (const k of ['indoor', 'free']) if (!TRI.includes(e[k])) err(id, `${k} は true / false / null のいずれかです`);
  if (typeof e.residentsOnly !== 'boolean') err(id, 'residentsOnly は true / false です');
  if (!RESERVATION.includes(e.reservation)) err(id, `reservation は ${RESERVATION.join(' / ')} のいずれかです`);
  if (!Array.isArray(e.ages) || e.ages.some((a) => !AGES.includes(a))) err(id, `ages は ${AGES.join(' / ')} の配列です`);
  if (!/^https?:\/\//.test(e.sourceUrl || '')) err(id, 'sourceUrl は http(s) のURLにしてください');
  if (!ISO.test(e.verifiedAt || '')) err(id, 'verifiedAt は YYYY-MM-DD です');
  for (const [k, v] of Object.entries(e.hours || {})) {
    if (k !== 'default' && !e.dates.includes(k)) err(id, `hours の日付 ${k} が dates にありません`);
    if (!Array.isArray(v) || !v.length || v.some((t) => !HM.test(t))) err(id, `hours.${k} は ['10:00', '12:00'] の形式です`);
  }
  for (const k of Object.keys(e.timeByDate || {})) if (!e.dates.includes(k)) err(id, `timeByDate の日付 ${k} が dates にありません`);
  for (const k of Object.keys(e.dateNotes || {})) if (!e.dates.includes(k)) err(id, `dateNotes の日付 ${k} が dates にありません`);
}

if (errors.length) {
  console.error(`データに ${errors.length} 件の問題があります:\n` + errors.map((x) => `  - ${x}`).join('\n'));
  process.exit(1);
}
const all = events.flatMap((e) => e.dates).sort();
console.log(`OK: イベント ${events.length} 件 / 会場 ${Object.keys(venues).length} 件（${all[0]} 〜 ${all.at(-1)}）`);
