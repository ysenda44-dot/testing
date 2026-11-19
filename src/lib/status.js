// 催しの「開催前・開催中・開始済み・終了」を、日本時間の現在時刻から判定する

/** 日本時間での日付と、0時からの分 */
export function jstClock(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

const toMinutes = (hm) => {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
};

/** その日の開始・終了（分）。終了は公式情報にあるときだけ */
export function dayMinutes(event, iso) {
  const h = event.hours?.[iso] || event.hours?.default;
  if (!h) return null;
  return { start: toMinutes(h[0]), end: h[1] ? toMinutes(h[1]) : null };
}

/**
 * upcoming: これから / ongoing: 開催中 / started: 始まっている（終了時刻は不明） / ended: 終了
 * clock は jstClock() の戻り値
 */
export function eventStatus(event, iso, clock) {
  if (iso > clock.date) return 'upcoming';
  if (iso < clock.date) return 'ended';
  const t = dayMinutes(event, iso);
  if (!t || clock.minutes < t.start) return 'upcoming';
  if (t.end === null) return 'started';
  return clock.minutes < t.end ? 'ongoing' : 'ended';
}

export const STATUS_LABEL = { ongoing: '開催中', started: '開始済み', ended: '終了' };

const isOver = (s) => s === 'ended' || s === 'started';

/**
 * 一覧に出す日付。今日の回がもう始まっている・終わっているなら次の回に送る。
 * 次の回がなければ今日のまま返す（「終了」として表示する）。今後の開催がなければ null
 */
export function displayDate(event, clock) {
  const future = event.dates.filter((d) => d >= clock.date);
  if (!future.length) return null;
  return future.find((d) => !isOver(eventStatus(event, d, clock))) || future[0];
}

const RANK = { ongoing: 0, upcoming: 0, started: 1, ended: 2 };

/** 並び順：日付 → 終わったものは後ろ → 受付終了は後ろ → 開始時刻 */
export function compareItems(a, b) {
  return (
    a.date.localeCompare(b.date) ||
    RANK[a.status] - RANK[b.status] ||
    Number(a.event.reservation === 'closed') - Number(b.event.reservation === 'closed') ||
    (dayMinutes(a.event, a.date)?.start ?? 1440) - (dayMinutes(b.event, b.date)?.start ?? 1440)
  );
}
