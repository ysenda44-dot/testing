const CHILD_AGES = new Set(['baby', 'preschool', 'elementary', 'junior']);

export const DEFAULT_FILTERS = Object.freeze({
  indoor: false, // ON: 屋内の催しだけ
  free: false, // ON: 無料の催しだけ
  noReservation: false, // ON: 予約不要の催しだけ
  residents: true, // OFF: 在住者向けの催しを隠す
  kids: true, // OFF: 子どもだけが対象の催しを隠す
});

export const FILTER_DEFS = [
  {
    key: 'indoor',
    label: '屋内',
    help: 'ONで屋内の催しだけを表示します。屋内か屋外かが公式情報に書かれていない催しも除きます。',
  },
  {
    key: 'free',
    label: '無料',
    help: 'ONで無料の催しだけを表示します。料金の記載がない催しも除きます。',
  },
  {
    key: 'noReservation',
    label: '予約不要',
    help: 'ONで事前の申込が要らない催しだけを表示します。',
  },
  {
    key: 'residents',
    label: '居住者向け',
    help: 'ONでは市内在住の方向けの催しも含めます。OFFにすると在住者向けの催しを表示しません。',
  },
  {
    key: 'kids',
    label: '子ども向け',
    help: 'ONでは子ども向けの催しも含めます。OFFにすると子どもだけが対象の催しを表示しません。子どもから大人まで楽しめる催しは残ります。',
  },
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
  if (!filters.residents && event.residentsOnly) return false;
  if (!filters.kids && isKidsOnly(event)) return false;
  return true;
}

const normalize = (s) =>
  (s || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)); // カタカナ→ひらがな

export function matchesKeyword(event, venue, keyword) {
  const words = normalize(keyword).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = normalize(
    [event.title, event.description, event.room, event.ageLabel, venue?.name, venue?.address].join(' '),
  );
  return words.every((w) => haystack.includes(w));
}

/** 指定日以降で、次に開催される日 */
export function nextDate(event, fromISO) {
  return event.dates.find((d) => d >= fromISO) || null;
}

export function activeFilterCount(filters) {
  return FILTER_DEFS.filter((f) => filters[f.key] !== DEFAULT_FILTERS[f.key]).length;
}
