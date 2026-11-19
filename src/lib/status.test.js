import { describe, expect, it } from 'vitest';
import { compareItems, displayDate, eventStatus, jstClock } from './status.js';
import { eventChips } from './chips.js';

const at = (date, hm) => {
  const [h, m] = hm.split(':').map(Number);
  return { date, minutes: h * 60 + m };
};
const talk = { dates: ['2026-11-28'], hours: { default: ['14:00', '16:00'] }, reservation: 'none' };
const story = { dates: ['2026-11-21', '2026-11-28'], hours: { default: ['10:30'] }, reservation: 'none' };

describe('jstClock', () => {
  it('端末の時間帯に関係なく日本時間で返す', () => {
    expect(jstClock(new Date('2026-11-27T15:30:00Z'))).toEqual({ date: '2026-11-28', minutes: 30 });
    expect(jstClock(new Date('2026-11-28T11:00:00Z'))).toEqual({ date: '2026-11-28', minutes: 20 * 60 });
  });
});

describe('eventStatus', () => {
  it('開始前・開催中・終了を時刻で分ける', () => {
    expect(eventStatus(talk, '2026-11-28', at('2026-11-28', '13:59'))).toBe('upcoming');
    expect(eventStatus(talk, '2026-11-28', at('2026-11-28', '14:00'))).toBe('ongoing');
    expect(eventStatus(talk, '2026-11-28', at('2026-11-28', '15:59'))).toBe('ongoing');
    expect(eventStatus(talk, '2026-11-28', at('2026-11-28', '16:00'))).toBe('ended');
  });
  it('終了時刻が不明なら「終了」と言い切らず started にする', () => {
    expect(eventStatus(story, '2026-11-21', at('2026-11-21', '10:29'))).toBe('upcoming');
    expect(eventStatus(story, '2026-11-21', at('2026-11-21', '20:00'))).toBe('started');
  });
  it('別の日は時刻に関係なく決まる', () => {
    expect(eventStatus(talk, '2026-11-28', at('2026-11-27', '23:00'))).toBe('upcoming');
    expect(eventStatus(talk, '2026-11-28', at('2026-11-29', '00:00'))).toBe('ended');
  });
  it('時刻の情報がなければ当日はずっと upcoming', () => {
    expect(eventStatus({ dates: ['2026-11-28'] }, '2026-11-28', at('2026-11-28', '23:00'))).toBe('upcoming');
  });
});

describe('displayDate', () => {
  it('今日の回が終わっていたら次の回に送る', () => {
    expect(displayDate(story, at('2026-11-21', '09:00'))).toBe('2026-11-21');
    expect(displayDate(story, at('2026-11-21', '12:00'))).toBe('2026-11-28');
  });
  it('次の回がなければ今日のまま、今後がなければ null', () => {
    expect(displayDate(talk, at('2026-11-28', '20:00'))).toBe('2026-11-28');
    expect(displayDate(talk, at('2026-11-29', '08:00'))).toBe(null);
  });
});

describe('compareItems', () => {
  const item = (event, date, status) => ({ event, date, status });
  it('同じ日では終了を後ろ、受付終了も後ろに回す', () => {
    const morning = { hours: { default: ['09:00', '10:00'] }, reservation: 'none' };
    const closed = { hours: { default: ['11:00', '12:00'] }, reservation: 'closed' };
    const noon = { hours: { default: ['13:00', '14:00'] }, reservation: 'none' };
    const d = '2026-11-28';
    const sorted = [item(morning, d, 'ended'), item(closed, d, 'upcoming'), item(noon, d, 'upcoming')].sort(compareItems);
    expect(sorted.map((x) => x.event)).toEqual([noon, closed, morning]);
  });
  it('日付が先のものが先', () => {
    const sorted = [item(talk, '2026-11-29', 'upcoming'), item(story, '2026-11-28', 'ended')].sort(compareItems);
    expect(sorted[0].date).toBe('2026-11-28');
  });
});

describe('eventChips', () => {
  const labels = (e) => eventChips(e).map((c) => c.label);
  it('記載のない項目は出さない', () => {
    expect(labels({ free: null, indoor: null, reservation: 'unknown', residentsOnly: false })).toEqual([]);
  });
  it('受付終了を先頭に、料金・予約・屋内外・在住者向けを出す', () => {
    expect(labels({ free: true, indoor: true, reservation: 'closed', residentsOnly: false })).toEqual(['受付終了', '無料', '屋内']);
    expect(labels({ free: false, indoor: false, reservation: 'required', residentsOnly: true })).toEqual(['有料', '要予約', '屋外', '在住者向け']);
  });
  it('priceChip があれば料金の文言に使う', () => {
    expect(labels({ free: false, priceChip: '相談無料・入館料あり', reservation: 'none', indoor: null })).toEqual(['相談無料・入館料あり', '予約不要']);
  });
});
