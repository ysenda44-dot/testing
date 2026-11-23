const CHILD_AGES = new Set(['baby', 'preschool', 'elementary', 'junior']);

// どの条件も「ONにすると絞る」。初期値はすべてOFF
export const DEFAULT_FILTERS = Object.freeze({
  indoor: false, // 屋内の催しだけ
  free: false, // 無料の催しだけ
  noReservation: false, // 予約不要の催しだけ
  hideResidents: false, // 在住者向けの催しを除く
  hideKids: false, // 子どもだけが対象の催しを除く
});

export const FILTER_DEFS = [
  { key: 'indoor', label: '屋内', help: '屋内の催しだけを表示します。屋内か屋外かが公式情報に書かれていない催しも外れます。' },
  { key: 'free', label: '無料', help: '無料の催しだけを表示します。料金の記載がない催しも外れます。' },
  { key: 'noReservation', label: '予約不要', help: '事前の申込が要らない催しだけを表示します。' },
  { key: 'hideResidents', label: '在住者向けを除く', help: '市内在住の方だけが対象の催しを表示しません。' },
  { key: 'hideKids', label: '子ども向けを除く', help: '子どもだけが対象の催しを表示しません。子どもから大人まで楽しめる催しは残ります。' },
];

/** 子どもだけが対象の催しか（大人も対象なら false） */
export function isKidsOnly(event) {
  return event.ages.length > 0 && event.ages.every((a) => CHILD_AGES.has(a));
}

export function isOnDate(event, iso) {
  return event.dates.includes(iso);
}

export function passesFilters(event, filters) {
  if (filters.indoor && event.indoor !== true) return false;
  if (filters.free && event.free !== true) return false;
  if (filters.noReservation && event.reservation !== 'none') return false;
  if (filters.hideResidents && event.residentsOnly) return false;
  if (filters.hideKids && isKidsOnly(event)) return false;
  return true;
}

/** 指定日以降で、次に開催される日 */
export function nextDate(event, fromISO) {
  return event.dates.find((d) => d >= fromISO) || null;
}

export function activeFilterCount(filters) {
  return FILTER_DEFS.filter((f) => filters[f.key] !== DEFAULT_FILTERS[f.key]).length;
}
