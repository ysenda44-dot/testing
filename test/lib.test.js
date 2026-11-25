import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadWebLib } from '../scripts/gas-loader.mjs';

const L = loadWebLib();
const plain = (v) => JSON.parse(JSON.stringify(v));

const txs = [
  { id: '1', date: '2026-11-20', time: '12:00', name: 'A', amount: -1000, category: '食費', subcategory: '外食' },
  { id: '2', date: '2026-11-20', time: '18:00', name: 'B', amount: -500, category: '食費', subcategory: 'カフェ' },
  { id: '3', date: '2026-11-21', name: '給与', amount: 300000, category: '給与', subcategory: '本給' },
  { id: '4', date: '2026-11-22', name: 'カード引き落とし', amount: -50000, category: '振替', transfer: true },
  { id: '5', date: '2026-11-22', name: '外貨', amount: null, fx: '10.00 USD', category: '趣味・娯楽' },
  { id: '6', date: '2026-10-05', name: '先月', amount: -2000, category: '日用品', subcategory: '' }
];

test('金額の表示', () => {
  assert.equal(L.yen(-1234567), '¥1,234,567');
  assert.equal(L.signedYen(-500), '¥-500');
  assert.equal(L.signedYen(500), '¥500');
  assert.equal(L.compactYen(120000000), '1.2億円');
  assert.equal(L.compactYen(57630000), '5763万円');
  assert.equal(L.compactYen(900), '900円');
});

test('日付の表示', () => {
  assert.equal(L.dateLabel('2026-11-16'), '2026年11月16日（月）');
  assert.equal(L.monthLabel('2026-09'), '2026年9月');
  assert.equal(L.monthRangeLabel('2026-11', '2026-11-25'), '11月1日 〜 11月25日');
  assert.equal(L.monthRangeLabel('2026-02', '2026-11-25'), '2月1日 〜 2月28日');
  assert.equal(L.prevMonthEnd('2026-03-15'), '2026-02-28');
  assert.equal(L.prevMonthEnd('2026-01-10'), '2025-12-31');
});

test('groupByDate: 新しい日付順・同じ日は時刻の新しい順、振替と外貨は日別支出に入れない', () => {
  const g = plain(L.groupByDate(txs));
  assert.deepEqual(g.map((x) => x.date), ['2026-11-22', '2026-11-21', '2026-11-20', '2026-10-05']);
  assert.equal(g[0].expense, 0);
  assert.deepEqual(g[2].items.map((t) => t.id), ['2', '1']);
  assert.equal(g[2].expense, -1500);
});

test('monthlySummary: 振替と円の金額がない取引を除いて、大項目・中項目ごとに集計する', () => {
  const s = plain(L.monthlySummary(txs, '2026-11'));
  assert.equal(s.income, 300000);
  assert.equal(s.expense, 1500);
  assert.deepEqual(s.expenseCats, [
    { name: '食費', amount: 1500, subs: [{ name: '外食', amount: 1000 }, { name: 'カフェ', amount: 500 }] }
  ]);
  assert.equal(s.incomeCats[0].name, '給与');
  const oct = plain(L.monthlySummary(txs, '2026-10'));
  assert.deepEqual(oct.expenseCats[0].subs, [{ name: '未分類', amount: 2000 }]);
});

test('availableMonths: 取引のある月と今月', () => {
  assert.deepEqual(plain(L.availableMonths(txs, '2026-12-01')), ['2026-10', '2026-11', '2026-12']);
  assert.deepEqual(plain(L.availableMonths([], '2026-12-01')), ['2026-12']);
});

test('totals: 資産クラスごとの合計と純資産', () => {
  const t = plain(L.totals({
    classes: [{ id: 'cash' }, { id: 'fund' }, { id: 'point' }],
    institutions: [
      { accounts: [{ assetClass: 'cash', balance: 1000 }, { assetClass: 'fund', balance: 500 }] },
      { accounts: [{ assetClass: 'liability', balance: -300 }] }
    ]
  }));
  assert.deepEqual(t, { byClass: { cash: 1000, fund: 500, point: 0 }, assets: 1500, liabilities: -300, net: 1200 });
});

test('推移: 期間で絞り込み、前月末の値を探す', () => {
  const history = [
    { date: '2020-12-31', values: { cash: 1 } },
    { date: '2025-11-01', values: { cash: 2 } },
    { date: '2026-10-31', values: { cash: 3 } },
    { date: '2026-11-25', values: { cash: 4 } }
  ];
  assert.equal(L.filterPeriod(history, '1y', '2026-11-25').length, 2);
  assert.equal(L.filterPeriod(history, '5y', '2026-11-25').length, 3);
  assert.equal(L.filterPeriod(history, 'all', '2026-11-25').length, 4);
  assert.equal(L.pointAtOrBefore(history, '2026-10-31').values.cash, 3);
  assert.equal(L.pointAtOrBefore(history, '2019-01-01'), null);
  assert.equal(L.pointTotal({ values: { cash: 1, fund: 2, liability: -5 } }, ['cash', 'fund']), 3);
});

test('stackedArea: 下から積み上げた path と目盛りを作る', () => {
  const points = [
    { date: '2026-01-01', values: { a: 100, b: 50 } },
    { date: '2026-12-31', values: { a: 200, b: 100 } }
  ];
  const c = plain(L.stackedArea(points, ['a', 'b'], { left: 0, right: 100, top: 0, bottom: 100 }));
  assert.equal(c.max, 300);
  assert.equal(c.layers[0].d, 'M0,66.7 L100,33.3 L100,100 L0,100 Z');
  assert.equal(c.layers[1].d, 'M0,50 L100,0 L100,33.3 L0,66.7 Z');
  assert.equal(c.yLabels[0].text, '300円');
  assert.equal(c.xLabels[0].text, '26年1月');
  assert.equal(c.xLabels[4].anchor, 'end');
  assert.equal(L.stackedArea(points.slice(0, 1), ['a'], { left: 0, right: 1, top: 0, bottom: 1 }), null);
});

test('niceMax: 切りのいい上限', () => {
  assert.equal(L.niceMax(115268000), 120000000);
  assert.equal(L.niceMax(9100), 10000);
  assert.equal(L.niceMax(0), 1);
});
