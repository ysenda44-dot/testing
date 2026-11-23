import JapaneseHolidays from 'japanese-holidays';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const pad = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' → ローカル時刻 0:00 の Date */
export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/** start〜end（両端を含む）の日付を配列で返す */
export function range(start, end) {
  const out = [];
  for (let d = start; d <= end; d = addDays(d, 1)) out.push(d);
  return out;
}

/** 日本時間での今日 */
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function dayInfo(iso) {
  const d = parseISO(iso);
  const holiday = JapaneseHolidays.isHoliday(d) || null;
  const dow = d.getDay();
  return {
    iso,
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    dow,
    weekday: WEEKDAYS[dow],
    holiday,
    tone: holiday || dow === 0 ? 'sun' : dow === 6 ? 'sat' : 'weekday',
  };
}

/** 11月22日（日） */
export function formatLong(iso) {
  const i = dayInfo(iso);
  return `${i.month}月${i.day}日（${i.holiday ? '祝' : i.weekday}）`;
}

/** 11/22 */
export function formatShort(iso) {
  const i = dayInfo(iso);
  return `${i.month}/${i.day}`;
}

/** 連続した日付をまとめて「11/25〜11/29・12/2」のように表示する */
export function formatDateList(dates) {
  if (!dates.length) return '';
  const groups = [];
  let start = dates[0];
  let prev = dates[0];
  for (const d of dates.slice(1)) {
    if (d === addDays(prev, 1)) {
      prev = d;
      continue;
    }
    groups.push([start, prev]);
    start = prev = d;
  }
  groups.push([start, prev]);
  return groups
    .map(([a, b]) => (a === b ? formatShort(a) : `${formatShort(a)}〜${formatShort(b)}`))
    .join('・');
}

/**
 * 一覧用のひとこと。「11/29まで」「毎週土曜」「ほか4日」など。
 * iso はいま表示している回の日付
 */
export function scheduleHint(dates, iso) {
  const rest = dates.filter((d) => d > iso);
  if (!rest.length) return '';
  const last = rest.at(-1);
  if (rest.every((d, i) => d === addDays(iso, i + 1))) return `${formatShort(last)}まで`;
  if (rest.every((d, i) => d === addDays(iso, (i + 1) * 7))) return `毎週${dayInfo(iso).weekday}曜`;
  return `ほか${rest.length}日`;
}

/** 見出し用。「今日 11月20日（金）」「明日 …」 */
export function formatHeading(iso, today) {
  const prefix = iso === today ? '今日 ' : iso === addDays(today, 1) ? '明日 ' : '';
  return prefix + formatLong(iso);
}
