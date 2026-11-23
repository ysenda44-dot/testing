import { describe, expect, it } from 'vitest';
import { matchesKeyword } from './search.js';
import { events } from '../data/events.js';
import { venues } from '../data/venues.js';

const TODAY = '2026-11-20';
const hits = (q) =>
  events.filter((e) => e.dates.some((d) => d >= TODAY) && matchesKeyword(e, venues[e.venueId], q, TODAY)).map((e) => e.id);

describe('matchesKeyword（実データ）', () => {
  it('レビューで0件だった言葉が当たる', () => {
    for (const q of ['こども', '親子', '無料', 'まつり', '12月', '週末']) {
      expect(hits(q).length, q).toBeGreaterThan(0);
    }
  });
  it('表記ゆれは同じ結果になる', () => {
    expect(hits('こども')).toEqual(hits('子ども'));
    expect(hits('キッズ')).toEqual(hits('子供'));
    expect(hits('ﾜｰｸｼｮｯﾌﾟ')).toEqual(hits('ワークショップ'));
  });
  it('まつり・フェスタはSDGsフェスタに当たる', () => {
    expect(hits('まつり')).toContain('miyazu-sdgs-festa-2026');
    expect(hits('祭り')).toContain('miyazu-sdgs-festa-2026');
  });
  it('無料は、無料と確認できた催しだけ', () => {
    for (const id of hits('無料')) {
      const e = events.find((x) => x.id === id);
      expect(e.free === true || /無料/.test(e.priceLabel), id).toBe(true);
    }
  });
  it('月は完全一致（「1月」が11月の催しに当たらない）', () => {
    expect(hits('1月')).not.toContain('takaoka-ai-20th-2026');
    expect(hits('1月')).toContain('library-ohanashikai');
    expect(hits('12月')).toContain('geishun-hashidate-clean-20');
  });
  it('複数語はすべてに合うものだけ', () => {
    expect(hits('無料 12月')).not.toContain('zaitaku-iryo-symposium-2026');
    expect(hits('図書館 絵本').length).toBeGreaterThan(0);
  });
  it('該当のない言葉は0件のまま', () => {
    expect(hits('音楽')).toEqual([]);
  });
  it('空の検索語はすべてに合う', () => {
    expect(matchesKeyword(events[0], venues[events[0].venueId], '  ', TODAY)).toBe(true);
  });
});
