// web/public/sample-data.json（?demo で表示する見本データ）を作る。
// 金融機関名・金額はすべて架空。GAS と同じ buildPayload を通すので、シートの書き方の見本にもなる。
//   node scripts/make-sample.mjs
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadGas, repoRoot } from './gas-loader.mjs';

const gas = loadGas();
const NOW = new Date('2026-11-25T07:00:00+09:00');
const TODAY = '2026-11-25';

let seed = 42;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function pick(list) {
  return list[Math.floor(rand() * list.length)];
}
function round(n, unit = 10) {
  return Math.round(n / unit) * unit;
}

const institutions = [
  { id: 'himawari', name: 'ひまわり銀行', type: 'bank', color1: '#0f6fb4', color2: '#0a4f82', sort: 1 },
  { id: 'komorebi', name: 'こもれび銀行', type: 'bank', color1: '#3f9e4d', color2: '#2c7a39', sort: 2 },
  { id: 'akane', name: 'あかね銀行', type: 'bank', color1: '#c8102e', color2: '#9c0b23', sort: 3 },
  { id: 'hoshizora', name: 'ほしぞら証券', type: 'securities', color1: '#5c7a2e', color2: '#42591f', sort: 4 },
  { id: 'tsubasa', name: 'つばさカード', type: 'card', color1: '#b9975b', chip: 'つばさ\nGOLD', sort: 5 },
  { id: 'sora', name: 'そらカード', type: 'card', color1: '#00a0e9', chip: 'SORA\nCard', sort: 6 },
  { id: 'samplepay', name: 'サンプルPay', type: 'emoney', color1: '#e60012', chip: 'Pay', sort: 7 },
  { id: 'manual', name: '自分で管理する資産', type: 'other', color1: '#6b7686', chip: '資産', sort: 8 }
];

const accounts = [
  { id: 'himawari-futsu', institution_id: 'himawari', name: '普通預金', asset_class: 'cash' },
  { id: 'komorebi-futsu', institution_id: 'komorebi', name: '普通預金', asset_class: 'cash' },
  { id: 'akane-futsu', institution_id: 'akane', name: '普通預金', asset_class: 'cash' },
  { id: 'akane-usd', institution_id: 'akane', name: '外貨普通預金', asset_class: 'cash' },
  { id: 'hoshizora-fund', institution_id: 'hoshizora', name: '投資信託', asset_class: 'fund' },
  { id: 'hoshizora-jp', institution_id: 'hoshizora', name: '国内株式', asset_class: 'stock' },
  { id: 'hoshizora-us', institution_id: 'hoshizora', name: '米国株式', asset_class: 'stock' },
  { id: 'tsubasa-gold', institution_id: 'tsubasa', name: 'ゴールド', asset_class: 'liability', mail_match: 'つばさゴールド', note: '毎月26日 引き落とし' },
  { id: 'sora-family', institution_id: 'sora', name: '家族カード', asset_class: 'liability', note: '毎月27日 引き落とし' },
  { id: 'sora-personal', institution_id: 'sora', name: '個人カード', asset_class: 'liability', note: '毎月27日 引き落とし' },
  { id: 'samplepay-balance', institution_id: 'samplepay', name: '残高', asset_class: 'cash' },
  { id: 'home', institution_id: 'manual', name: '自宅マンション', asset_class: 'realestate', note: '年1回見直し' },
  { id: 'startup', institution_id: 'manual', name: '非上場株式', asset_class: 'private', note: 'エンジェル投資' },
  { id: 'points', institution_id: 'manual', name: 'ポイント', asset_class: 'point' }
].map((a, i) => ({ currency: 'JPY', sort: i + 1, active: true, mail_match: '', note: '', ...a }));

const balances = [
  ['2026-11-01', 'himawari-futsu', 2840000],
  ['2026-11-01', 'komorebi-futsu', 1260000],
  ['2026-11-01', 'akane-futsu', 3420000],
  ['2026-11-01', 'akane-usd', 1580000, 10367.45, 'USD'],
  ['2026-11-24', 'hoshizora-fund', 26600000],
  ['2026-11-24', 'hoshizora-jp', 9400000],
  ['2026-11-24', 'hoshizora-us', 8800000],
  ['2026-11-10', 'tsubasa-gold', -48320],
  ['2026-11-10', 'sora-family', -162871],
  ['2026-11-10', 'sora-personal', -56926],
  ['2026-11-01', 'samplepay-balance', 18420],
  ['2026-04-01', 'home', 52000000],
  ['2026-06-30', 'startup', 6500000],
  ['2026-11-01', 'points', 312000]
].map(([date, account_id, amount_jpy, amount_fx = '', fx_currency = '']) => ({
  date, account_id, amount_jpy, amount_fx, fx_currency, source: '手入力', memo: ''
}));

// ---- 取引（9〜11月）
const transactions = [];
let n = 0;
function tx(date, account_id, name, amount, category, subcategory, extra = {}) {
  if (date > TODAY) return;
  n += 1;
  transactions.push({
    tx_id: 'sample-' + String(n).padStart(4, '0'),
    date, time: extra.time || '', account_id, name, amount,
    fx: extra.fx || '', category, subcategory,
    status: extra.status || (date >= '2026-11-11' && account_id.startsWith('tsubasa') ? '速報' : '確定'),
    transfer: !!extra.transfer, source: 'sample', source_id: '', memo: ''
  });
}
function day(month, d) {
  return `2026-${month}-${String(d).padStart(2, '0')}`;
}

for (const month of ['09', '10', '11']) {
  tx(day(month, 25), 'himawari-futsu', '給与 サンプル株式会社', 512000, '給与', '本給');
  tx(day(month, 10), 'komorebi-futsu', '業務委託 報酬', { '09': 86400, '10': 98872, '11': 120000 }[month], '副収入', '業務委託');
  tx(day(month, 5), 'akane-futsu', 'ポイント交換', round(4000 + rand() * 8000, 100), 'ポイント・その他', 'ポイント');
  tx(day(month, 27), 'himawari-futsu', '住宅ローン返済', -112400, '住宅', 'ローン返済');
  tx(day(month, 27), 'himawari-futsu', 'マンション管理費', -32500, '住宅', '管理費・積立金');
  tx(day(month, 15), 'tsubasa-gold', 'サンプル電力', -round(9000 + rand() * 3000), '水道・光熱費', '電気');
  tx(day(month, 18), 'tsubasa-gold', 'サンプルガス', -round(4000 + rand() * 2000), '水道・光熱費', 'ガス');
  tx(day(month, 3), 'sora-personal', 'サンプル音楽配信', -980, '趣味・娯楽', '映画・音楽・ゲーム');
  tx(day(month, 14), 'tsubasa-gold', 'AIサブスク', -15240, '趣味・娯楽', 'サブスク', { fx: '100.00 USD' });
  for (let i = 0; i < 9; i++) {
    tx(day(month, 1 + Math.floor(rand() * 28)), 'sora-family', pick(['ひまわりマート', 'サンプルスーパー', 'まちの八百屋']), -round(2000 + rand() * 6000), '食費', '食料品', { time: '18:' + String(10 + i * 5) });
  }
  for (let i = 0; i < 5; i++) {
    tx(day(month, 1 + Math.floor(rand() * 28)), 'tsubasa-gold', pick(['定食屋こもれび', 'サンプル食堂', 'ラーメンほしぞら']), -round(1200 + rand() * 6000), '食費', '外食', { time: '12:' + String(10 + i * 7) });
  }
  for (let i = 0; i < 6; i++) {
    tx(day(month, 1 + Math.floor(rand() * 28)), 'samplepay-balance', pick(['サンプルカフェ', '喫茶つばさ']), -round(400 + rand() * 900), '食費', 'カフェ', { time: '09:' + String(10 + i * 6) });
  }
  for (let i = 0; i < 3; i++) {
    tx(day(month, 1 + Math.floor(rand() * 28)), 'sora-family', 'サンプルドラッグ', -round(800 + rand() * 3000), '日用品', 'ドラッグストア');
    tx(day(month, 1 + Math.floor(rand() * 28)), 'tsubasa-gold', '交通系ICチャージ', -3000, '交通費', '電車');
  }
  tx(day(month, 26), 'himawari-futsu', 'つばさカード 引き落とし', -round(40000 + rand() * 30000), '振替', 'カード引き落とし', { transfer: true });
  tx(day(month, 27), 'akane-futsu', 'そらカード 引き落とし', -round(150000 + rand() * 60000), '振替', 'カード引き落とし', { transfer: true });
}
tx('2026-10-12', 'tsubasa-gold', 'サンプル旅行社', -57900, '趣味・娯楽', '旅行');
tx('2026-11-24', 'tsubasa-gold', 'サンプルストア', -587, '未分類', '未分類', { time: '19:17', status: '速報' });

// ---- 今の値を出してから、そこにつながる過去の推移を作る
const now = gas.buildPayload({ institutions, accounts, balances, transactions, history: [], now: NOW });
const end = now.history[now.history.length - 1].values;
const start = { realestate: 45000000, cash: 3000000, fund: 1500000, stock: 800000, private: 0, point: 20000, liability: -80000 };
const history = [];
const first = Date.UTC(2017, 11, 31);
const last = Date.UTC(2026, 10, 24);
const points = [];
for (let y = 2017, m = 11; Date.UTC(y, m + 1, 0) < Date.UTC(2026, 10, 1); m++) {
  if (m > 11) { m = 0; y++; }
  points.push(Date.UTC(y, m + 1, 0));
}
for (let d = Date.UTC(2026, 10, 1); d <= last; d += 86400000) points.push(d);
for (const t of points) {
  const r = (t - first) / (last - first);
  const wave = Math.sin(r * 23) * 0.03 + Math.sin(r * 61) * 0.015;
  const row = { date: new Date(t).toISOString().slice(0, 10) };
  for (const k of Object.keys(start)) {
    const base = start[k] + (end[k] - start[k]) * Math.pow(r, k === 'fund' || k === 'stock' ? 1.6 : 1);
    const noisy = k === 'fund' || k === 'stock' ? base * (1 + wave) : base;
    row[k] = k === 'private' && row.date < '2023-06-30' ? 0 : Math.round(noisy);
  }
  history.push(row);
}

const payload = gas.buildPayload({ institutions, accounts, balances, transactions, history, now: NOW });
if (payload.warnings.length) {
  console.error(payload.warnings);
  process.exit(1);
}
const out = join(repoRoot, 'web', 'public', 'sample-data.json');
writeFileSync(out, JSON.stringify(payload, null, 1) + '\n');
console.log(`wrote ${out}: ${payload.transactions.length} transactions, ${payload.history.length} history points`);
