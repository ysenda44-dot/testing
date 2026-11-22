// サイト全体の設定。ほかの市町村版を作るときは、主にここと src/data/ を差し替えます。

export const site = {
  name: 'MIYAZU MIKKE',
  kana: 'みやづみっけ',
  tagline: '宮津市のイベント検索サイト',
  description: '京都府宮津市のイベントを、日付や条件、地図から探せます。',
  areaName: '宮津市',
  // 日付バーに並べる日数（今日から）
  dateStripDays: 150,
  favoritesStorageKey: 'miyazu-mikke:favorites',
};

// 「このサイトについて」に載せる情報源。イベントを探すときの巡回先でもあります
export const dataSources = [
  { name: '宮津市公式サイト「カレンダーでさがす」', url: 'https://www.city.miyazu.kyoto.jp/calendar/' },
  { name: '天橋立観光協会 イベント情報', url: 'https://www.amanohashidate.jp/events/' },
  { name: '海の京都DMO イベント情報（エリア：宮津市）', url: 'https://www.uminokyoto.jp/event/' },
  { name: '天橋立観光協会 体験プログラム', url: 'https://www.amanohashidate.jp/taiken' },
  { name: '京都府丹後広域振興局 月ごとのイベント情報', url: 'https://www.pref.kyoto.jp/tango/no-shoko/7gatu-ibento.html' },
  { name: '智恩寺 年中行事', url: 'https://www.monjudo-chionji.jp/event/' },
  { name: '成相寺 年中行事', url: 'https://www.nariaiji.jp/schedule/index.php' },
  { name: '京都丹後鉄道 イベント情報', url: 'https://trains.willer.co.jp/event/' },
];

export const mapConfig = {
  center: [35.548, 135.19],
  zoom: 13,
  minZoom: 11,
  maxZoom: 16.5,
  // これより外へはスクロールしない（宮津市の範囲。詳細な下絵データがあるのはこの中だけ）
  maxBounds: [
    [35.43, 135.09],
    [35.72, 135.32],
  ],
  // 下絵は scripts/build-basemap.mjs で国土地理院ベクトルタイルから作ったもの
  attribution:
    '<a href="https://maps.gsi.go.jp/development/vt.html" target="_blank" rel="noopener">国土地理院ベクトルタイル</a>・国土数値情報（国土交通省）を加工',
};

export const categories = {
  kids: { label: 'こども', color: '#e07a3f' },
  art: { label: '展示', color: '#8a5cc2' },
  workshop: { label: 'ワークショップ', color: '#d4508a' },
  learning: { label: '講座・講演', color: '#2f7fb8' },
  festival: { label: 'まつり・催し', color: '#d9a21b' },
  volunteer: { label: 'ボランティア', color: '#2f8a5b' },
  consult: { label: '相談会', color: '#5f6f7a' },
  tradition: { label: '寺社の行事', color: '#b0492f' },
  train: { label: '列車・周遊', color: '#3d6a8c' },
  experience: { label: '体験', color: '#1f8a8a' },
};
