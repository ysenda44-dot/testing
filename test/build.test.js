import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadGas } from '../scripts/gas-loader.mjs';

const gas = loadGas();
const plain = (v) => JSON.parse(JSON.stringify(v));

test('toYmd: Date は日本時間の日付、文字列は形をそろえる', () => {
  assert.equal(gas.toYmd(new Date('2026-11-24T15:30:00Z')), '2026-11-25');
  assert.equal(gas.toYmd('2026/1/5'), '2026-01-05');
  assert.equal(gas.toYmd('２０２６-１１-０２'), '2026-11-02');
  assert.equal(gas.toYmd('あとで'), '');
});

test('toHm: シートで時刻になった値も "HH:MM" に戻す', () => {
  assert.equal(gas.toHm('9:05'), '09:05');
  assert.equal(gas.toHm(new Date('1899-12-30T10:17:00Z')), '19:17');
  assert.equal(gas.toHm(''), '');
});

test('toNumber: カンマ・円記号・全角を読める', () => {
  assert.equal(gas.toNumber('¥1,234'), 1234);
  assert.equal(gas.toNumber('-５００円'), -500);
  assert.equal(gas.toNumber(''), null);
  assert.equal(gas.toNumber(12.5), 12.5);
});

test('rowsToObjects: 見出しでオブジェクトにし、空行は捨てる', () => {
  const rows = gas.rowsToObjects([
    ['id', 'name'],
    ['a', 'A'],
    ['', ''],
    ['b', 'B']
  ]);
  assert.deepEqual(plain(rows), [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }]);
});

test('classify: 優先度 → 長いキーワードの順に採用、全角半角は区別しない', () => {
  const rules = [
    { keyword: 'イオン', category: '食費', subcategory: '食料品', priority: 0 },
    { keyword: 'イオンシネマ', category: '趣味・娯楽', subcategory: '映画', priority: 0 },
    { keyword: 'amazon', category: '日用品', subcategory: '日用品', priority: 0 },
    { keyword: 'AMAZON PRIME', category: '趣味・娯楽', subcategory: 'サブスク', priority: 5 }
  ];
  assert.deepEqual(plain(gas.classify('イオンシネマ幕張', rules)), { category: '趣味・娯楽', subcategory: '映画' });
  assert.deepEqual(plain(gas.classify('イオン', rules)), { category: '食費', subcategory: '食料品' });
  assert.deepEqual(plain(gas.classify('ＡＭＡＺＯＮ．ＣＯ．ＪＰ', rules)), { category: '日用品', subcategory: '日用品' });
  assert.deepEqual(plain(gas.classify('Amazon Prime 会費', rules)), { category: '趣味・娯楽', subcategory: 'サブスク' });
  assert.deepEqual(plain(gas.classify('知らない店', rules)), { category: '未分類', subcategory: '未分類' });
});

test('computeBalances: 最後の入力残高に、その日より後の取引だけを足す', () => {
  const accounts = [{ id: 'bank' }, { id: 'card' }, { id: 'new' }];
  const balances = [
    { date: '2026-10-01', account_id: 'bank', amount_jpy: 100000 },
    { date: '2026-11-01', account_id: 'bank', amount_jpy: 200000, source: '手入力' },
    { date: '2026-11-10', account_id: 'card', amount_jpy: -5000, amount_fx: '', fx_currency: '' }
  ];
  const txs = [
    { accountId: 'bank', date: '2026-11-01', amount: -999 },
    { accountId: 'bank', date: '2026-11-02', amount: -1000 },
    { accountId: 'card', date: '2026-11-12', amount: -300 },
    { accountId: 'card', date: '2026-11-13', amount: null },
    { accountId: 'new', date: '2026-11-05', amount: 700 }
  ];
  const r = plain(gas.computeBalances(accounts, balances, txs));
  assert.equal(r.bank.balance, 199000);
  assert.equal(r.bank.asOf, '2026-11-02');
  assert.equal(r.bank.source, '推定');
  assert.equal(r.card.balance, -5300);
  assert.equal(r.new.balance, 700);
});

test('computeBalances: 取引がなければ入力した残高のまま', () => {
  const r = plain(gas.computeBalances([{ id: 'x' }], [{ date: '2026-11-01', account_id: 'x', amount_jpy: '1,000', source: '手入力' }], []));
  assert.deepEqual(r.x, { balance: 1000, fxAmount: null, fxCurrency: '', asOf: '2026-11-01', source: '手入力', estimated: false });
});

function sampleInput(extra = {}) {
  return {
    institutions: [
      { id: 'b', name: '銀行B', type: 'bank', color1: '#111', sort: 2 },
      { id: 'a', name: '銀行A', type: 'bank', color1: '#222', color2: '#333', sort: 1 },
      { id: 'c', name: 'カードC', type: 'card', color1: '#444' },
      { id: 'z', name: '変な種別', type: 'crypto' }
    ],
    accounts: [
      { id: 'a1', institution_id: 'a', name: '普通', asset_class: 'cash', active: true },
      { id: 'b1', institution_id: 'b', name: '投信', asset_class: 'fund', active: true },
      { id: 'c1', institution_id: 'c', name: 'カード', asset_class: 'liability', active: true },
      { id: 'off', institution_id: 'a', name: '解約済み', asset_class: 'cash', active: false },
      { id: 'lost', institution_id: 'nope', name: '迷子', asset_class: 'cash', active: true }
    ],
    balances: [
      { date: '2026-11-01', account_id: 'a1', amount_jpy: 1000000 },
      { date: '2026-11-01', account_id: 'b1', amount_jpy: 500000 },
      { date: '2026-11-01', account_id: 'c1', amount_jpy: -20000 }
    ],
    transactions: [
      { tx_id: 't1', date: '2026-11-20', time: '10:00', account_id: 'c1', name: '店', amount: -3000, category: '食費', subcategory: '外食', status: '速報', transfer: false },
      { tx_id: 't0', date: '2024-01-01', account_id: 'a1', name: '古い取引', amount: -1, category: '', transfer: '' },
      { tx_id: 't2', date: '2026-11-21', time: '', account_id: 'a1', name: '給与', amount: 300000, category: '給与', subcategory: '本給', transfer: 'FALSE' }
    ],
    history: [
      { date: '2026-10-31', realestate: 0, cash: 900000, fund: 450000, stock: 0, private: 0, point: 0, liability: -10000 },
      { date: '2026-11-25', realestate: 0, cash: 1, fund: 1, stock: 0, private: 0, point: 0, liability: 0 }
    ],
    now: new Date('2026-11-25T07:00:00+09:00'),
    ...extra
  };
}

test('buildPayload: 金融機関を sort 順に並べ、口座の残高を入れる', () => {
  const p = plain(gas.buildPayload(sampleInput()));
  assert.equal(p.version, 1);
  assert.equal(p.generatedAt, '2026-11-25T07:00:00+09:00');
  assert.deepEqual(p.institutions.map((i) => i.id), ['a', 'b', 'c', 'z']);
  assert.deepEqual(p.institutions[0].colors, ['#222', '#333']);
  assert.deepEqual(p.institutions[1].colors, ['#111', '#111']);
  const a1 = p.institutions[0].accounts[0];
  assert.equal(a1.id, 'a1');
  assert.equal(a1.balance, 1300000);
  assert.equal(a1.source, '推定');
  assert.equal(p.institutions[0].accounts.length, 1, '無効な口座は出さない');
  assert.equal(p.institutions[2].accounts[0].balance, -23000);
  assert.equal(p.institutions[3].type, 'other');
});

test('buildPayload: 取引は新しい順、400日より古いものは送らない', () => {
  const p = plain(gas.buildPayload(sampleInput()));
  assert.deepEqual(p.transactions.map((t) => t.id), ['t2', 't1']);
  assert.equal(p.transactions[0].transfer, false);
  assert.equal(p.transactions[1].status, '速報');
});

test('buildPayload: 今日の資産クラス合計を history に入れ、同じ日付は上書きする', () => {
  const p = plain(gas.buildPayload(sampleInput()));
  assert.equal(p.history.length, 2);
  assert.deepEqual(p.history[1], {
    date: '2026-11-25',
    values: { realestate: 0, cash: 1300000, fund: 500000, stock: 0, private: 0, point: 0, liability: -23000 }
  });
  assert.deepEqual(plain(gas.historyPointToRow(p.history[1])), ['2026-11-25', 0, 1300000, 500000, 0, 0, 0, -23000]);
  assert.deepEqual(plain(gas.historyColumns()), ['date', 'realestate', 'cash', 'fund', 'stock', 'private', 'point', 'liability']);
});

test('buildPayload: 設定ミスは warnings に出す', () => {
  const p = plain(gas.buildPayload(sampleInput()));
  assert.equal(p.warnings.length, 2);
  assert.match(p.warnings[0], /crypto/);
  assert.match(p.warnings[1], /nope/);
});

test('buildPayload: 知らない資産クラスは cash として扱い、警告する', () => {
  const input = sampleInput();
  input.accounts[0].asset_class = 'gold';
  const p = plain(gas.buildPayload(input));
  assert.equal(p.institutions[0].accounts[0].assetClass, 'cash');
  assert.ok(p.warnings.some((w) => w.includes('gold')));
});
