import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadGas, repoRoot } from '../scripts/gas-loader.mjs';

const gas = loadGas();
const fixture = (name) => readFileSync(join(repoRoot, 'test', 'fixtures', name), 'utf8');

test('三井住友カード: テキスト形式の通知を読める', () => {
  const tx = gas.parseSmbcCardMail(fixture('smbc-card-plain.txt'));
  assert.deepEqual({ ...tx }, {
    cardName: '三井住友カード(NL)',
    date: '2026-11-20',
    time: '12:34',
    merchant: 'サンプルストア',
    kind: '買物',
    amount: -1234,
    fx: ''
  });
});

test('三井住友カード: 要約形式（HTML から変換された本文）も読める', () => {
  const tx = gas.parseSmbcCardMail(fixture('smbc-card-summary.txt'));
  assert.deepEqual({ ...tx }, {
    cardName: '三井住友カード(NL)',
    date: '2026-11-21',
    time: '08:05',
    merchant: 'サンプルカフェ',
    kind: '買物',
    amount: -480,
    fx: ''
  });
});

test('三井住友カード: 外貨だけのときは amount を null にして fx に残す', () => {
  const tx = gas.parseSmbcCardMail(fixture('smbc-card-foreign.txt'));
  assert.equal(tx.amount, null);
  assert.equal(tx.fx, '100.00 USD');
  assert.equal(tx.merchant, 'SAMPLE SUBSCRIPTION');
  assert.equal(tx.cardName, '三井住友カード サンプル(NL)');
});

test('三井住友カード: 取消はプラスの金額になる', () => {
  const body = fixture('smbc-card-plain.txt').replace('◇利用取引：買物', '◇利用取引：取消');
  assert.equal(gas.parseSmbcCardMail(body).amount, 1234);
});

test('三井住友カード: CRLF の改行でも読める', () => {
  const tx = gas.parseSmbcCardMail(fixture('smbc-card-plain.txt').replace(/\n/g, '\r\n'));
  assert.equal(tx.merchant, 'サンプルストア');
  assert.equal(tx.amount, -1234);
});

test('三井住友カード: 利用以外のお知らせは null', () => {
  assert.equal(gas.parseSmbcCardMail('いつもご利用ありがとうございます。\nお手続きが完了しました。'), null);
  assert.equal(gas.parseSmbcCardMail(''), null);
});

test('カード名と accounts.mail_match の対応（長く一致するほうを優先、無効な口座は除外）', () => {
  const accounts = [
    { id: 'nl', mail_match: '(NL)', active: true },
    { id: 'sample', mail_match: 'サンプル(NL)', active: true },
    { id: 'old', mail_match: 'サンプルＶＩＳＡ（ＮＬ）', active: false }
  ];
  assert.equal(gas.matchAccountByMail(accounts, '三井住友サンプルVISA(NL)').id, 'nl');
  assert.equal(gas.matchAccountByMail(accounts, '三井住友カード サンプル(NL)').id, 'sample');
  assert.equal(gas.matchAccountByMail(accounts, '別のカード'), null);
});
