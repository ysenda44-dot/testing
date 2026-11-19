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
];

export const mapConfig = {
  center: [35.548, 135.19],
  zoom: 13,
  minZoom: 10,
  maxZoom: 18,
  // これより外へはスクロールしない（宮津市全体＋少し余白）
  maxBounds: [
    [35.36, 134.98],
    [35.79, 135.43],
  ],
  // 国土地理院「淡色地図」タイル
  tileUrl: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
  tileAttribution:
    '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">地理院タイル</a>',
  boundaryAttribution: '行政区域：国土数値情報（国土交通省）を加工',
};

export const categories = {
  kids: { label: 'こども', color: '#e07a3f' },
  art: { label: '展示', color: '#8a5cc2' },
  workshop: { label: 'ワークショップ', color: '#d4508a' },
  learning: { label: '講座・講演', color: '#2f7fb8' },
  festival: { label: 'まつり・催し', color: '#d9a21b' },
  volunteer: { label: 'ボランティア', color: '#2f8a5b' },
  consult: { label: '相談会', color: '#5f6f7a' },
};
