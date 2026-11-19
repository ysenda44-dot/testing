// キーワード検索。言葉の揺れ（こども／子ども、まつり／フェスタ など）を吸収する
import { categories } from '../config.js';
import { dayInfo } from './date.js';
import { eventChips } from './chips.js';

export const normalize = (s) =>
  (s || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60)); // カタカナ→ひらがな

// 同じ意味として扱う言葉。検索語がどれかに一致したら、同じ組の言葉でも探す
const SYNONYMS = [
  ['子ども', 'こども', '子供', 'キッズ', '児童'],
  ['親子', 'ファミリー', '家族'],
  ['赤ちゃん', '乳児', 'ベビー', '0歳'],
  ['まつり', '祭り', '祭', 'フェス', 'フェスタ', 'フェスティバル'],
  ['展示', '展覧会', '作品展', '個展', 'ギャラリー'],
  ['講座', '教室', 'セミナー', '講演', 'シンポジウム', 'フォーラム'],
  ['無料', '0円', '入場無料'],
  ['絵本', '読み聞かせ', 'おはなし'],
  ['掃除', '清掃', 'クリーン', 'ボランティア'],
  ['工作', 'ワークショップ', 'ものづくり', 'クラフト'],
  ['音楽', 'コンサート', '演奏会'],
  ['外国人', '日本語', 'にほんご'],
].map((g) => g.map(normalize));

const AUDIENCE = {
  baby: '赤ちゃん 乳児 0歳',
  preschool: '幼児 未就学児',
  elementary: '小学生',
  junior: '中学生',
  high: '高校生',
  adult: '大人 一般',
};
const CHILD = ['baby', 'preschool', 'elementary', 'junior'];

/** 部分一致で探す文章 */
function haystack(event, venue) {
  const kids = event.ages.some((a) => CHILD.includes(a));
  return normalize(
    [
      event.title,
      event.description,
      event.room,
      event.ageLabel,
      event.priceLabel,
      venue?.name,
      venue?.shortName,
      venue?.address,
      categories[event.category]?.label,
      ...eventChips(event).map((c) => c.label),
      ...event.ages.map((a) => AUDIENCE[a]),
      kids ? '子ども 親子' : '',
      ...(event.keywords || []),
    ].join(' '),
  );
}

/** 完全一致で探す言葉（「1月」が「11月」に当たらないように、日付は別扱い） */
function dateTokens(event, today) {
  const set = new Set();
  for (const iso of event.dates) {
    if (iso < today) continue;
    const d = dayInfo(iso);
    const weekend = d.dow === 0 || d.dow === 6 || d.holiday;
    [
      `${d.month}月`,
      `${d.month}月${d.day}日`,
      `${d.month}/${d.day}`,
      `${d.weekday}曜`,
      `${d.weekday}曜日`,
      weekend ? '週末' : '平日',
      weekend ? '土日' : '',
      d.holiday ? '祝日' : '',
    ].forEach((t) => t && set.add(normalize(t)));
  }
  return set;
}

export function matchesKeyword(event, venue, keyword, today = '0000-00-00') {
  const words = normalize(keyword).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const text = haystack(event, venue);
  const tokens = dateTokens(event, today);
  return words.every((w) => {
    const alts = new Set([w, ...SYNONYMS.filter((g) => g.includes(w)).flat()]);
    return [...alts].some((a) => text.includes(a) || tokens.has(a));
  });
}
