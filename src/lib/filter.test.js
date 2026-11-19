import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTERS, isKidsOnly, nextDate, passesFilters } from './filter.js';
import { addDays, formatDateList, formatHeading, range, scheduleHint, todayISO } from './date.js';
import { hoursOn } from './links.js';

const base = {
  id: 'x',
  title: 'テスト',
  description: '',
  ages: [],
  dates: ['2026-12-01'],
  indoor: true,
  free: true,
  reservation: 'none',
  residentsOnly: false,
};

describe('passesFilters', () => {
  it('既定の条件ではすべて表示する', () => {
    expect(passesFilters(base, DEFAULT_FILTERS)).toBe(true);
    expect(passesFilters({ ...base, residentsOnly: true, ages: ['baby'] }, DEFAULT_FILTERS)).toBe(true);
  });

  it('屋内・無料は、記載なし（null）も除く', () => {
    const f = { ...DEFAULT_FILTERS, indoor: true, free: true };
    expect(passesFilters(base, f)).toBe(true);
    expect(passesFilters({ ...base, indoor: null }, f)).toBe(false);
    expect(passesFilters({ ...base, free: null }, f)).toBe(false);
    expect(passesFilters({ ...base, indoor: false }, f)).toBe(false);
  });

  it('予約不要は reservation=none だけ', () => {
    const f = { ...DEFAULT_FILTERS, noReservation: true };
    expect(passesFilters(base, f)).toBe(true);
    for (const r of ['required', 'closed', 'unknown']) expect(passesFilters({ ...base, reservation: r }, f)).toBe(false);
  });

  it('居住者向けOFFで在住者向けを隠す', () => {
    const f = { ...DEFAULT_FILTERS, residents: false };
    expect(passesFilters({ ...base, residentsOnly: true }, f)).toBe(false);
    expect(passesFilters(base, f)).toBe(true);
  });

  it('子ども向けOFFで子どもだけの催しを隠し、大人も対象なら残す', () => {
    const f = { ...DEFAULT_FILTERS, kids: false };
    expect(passesFilters({ ...base, ages: ['baby'] }, f)).toBe(false);
    expect(passesFilters({ ...base, ages: ['preschool', 'elementary'] }, f)).toBe(false);
    expect(passesFilters({ ...base, ages: ['elementary', 'adult'] }, f)).toBe(true);
    expect(passesFilters({ ...base, ages: [] }, f)).toBe(true);
  });
});

describe('isKidsOnly', () => {
  it('年齢の記載なしは子ども限定ではない', () => {
    expect(isKidsOnly({ ages: [] })).toBe(false);
  });
});

describe('dates', () => {
  it('range は両端を含む', () => {
    expect(range('2026-12-30', '2027-01-02')).toEqual(['2026-12-30', '2026-12-31', '2027-01-01', '2027-01-02']);
  });
  it('連続する日をまとめて表示する', () => {
    expect(formatDateList(['2026-11-25', '2026-11-26', '2026-11-27', '2026-12-02'])).toBe('11/25〜11/27・12/2');
  });
  it('日本時間の今日を返す', () => {
    // 2026-11-19 23:30 UTC は日本時間で 11/20
    expect(todayISO(new Date('2026-11-19T23:30:00Z'))).toBe('2026-11-20');
  });
  it('nextDate は指定日以降の最初の開催日', () => {
    expect(nextDate({ dates: ['2026-11-01', '2026-12-01'] }, '2026-11-19')).toBe('2026-12-01');
    expect(nextDate({ dates: ['2026-11-01'] }, '2026-11-19')).toBe(null);
  });
  it('scheduleHint は期間・毎週・その他を言い分ける', () => {
    expect(scheduleHint(range('2026-11-25', '2026-11-29'), '2026-11-25')).toBe('11/29まで');
    expect(scheduleHint(['2026-11-21', '2026-11-28', '2026-12-05'], '2026-11-21')).toBe('毎週土曜');
    expect(scheduleHint(['2026-11-25', '2026-11-28', '2026-12-02'], '2026-11-25')).toBe('ほか2日');
    expect(scheduleHint(['2026-11-29'], '2026-11-29')).toBe('');
  });
  it('formatHeading は今日・明日を添える', () => {
    expect(formatHeading('2026-11-20', '2026-11-20')).toBe('今日 11月20日（金）');
    expect(formatHeading('2026-11-21', '2026-11-20')).toBe('明日 11月21日（土）');
    expect(formatHeading('2026-11-23', '2026-11-20')).toBe('11月23日（祝）');
  });
  it('addDays は月またぎに対応', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
  });
});

describe('hoursOn', () => {
  it('日ごとの指定を優先し、終了がなければ1時間後', () => {
    const ev = { hours: { default: ['10:30'], '2026-12-01': ['13:00', '15:00'] } };
    expect(hoursOn(ev, '2026-12-01')).toEqual({ start: '13:00', end: '15:00', endKnown: true });
    expect(hoursOn(ev, '2026-12-08')).toEqual({ start: '10:30', end: '11:30', endKnown: false });
  });
});
