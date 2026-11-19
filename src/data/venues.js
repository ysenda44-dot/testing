// 会場マスター
// coordinates は [緯度, 経度]。国土地理院「住所検索API」で住所から取得した値です。
// 番地単位の代表点のため、建物の入口とは数十m ずれることがあります。

export const venues = {
  mipple: {
    name: '宮津市福祉・教育総合プラザ（ミップル）',
    shortName: 'ミップル',
    address: '京都府宮津市字浜町3012',
    coordinates: [35.539089, 135.193909],
    addressSourceUrl: 'https://www.city.miyazu.kyoto.jp/site/tosyokan/17630.html',
    note: '宮津市立図書館・浜町ギャラリー・コミュニティルームは3階です。',
  },
  rekishi: {
    name: 'みやづ歴史の館',
    shortName: 'みやづ歴史の館',
    address: '京都府宮津市字鶴賀2164',
    coordinates: [35.538624, 135.197601],
    addressSourceUrl: 'https://www.city.miyazu.kyoto.jp/uploaded/life/31726_73453_misc.pdf',
  },
  mikami: {
    name: '重要文化財 旧三上家住宅',
    shortName: '旧三上家住宅',
    address: '京都府宮津市字河原1850',
    coordinates: [35.537952, 135.191269],
    addressSourceUrl: 'https://online.bunka.go.jp/heritages/detail/196490',
  },
  hashidate: {
    name: '天橋立公園',
    shortName: '天橋立公園',
    address: '京都府宮津市字文珠 天橋立公園',
    // 文珠側の受付「小天橋」付近
    coordinates: [35.557851, 135.185481],
    addressSourceUrl: 'https://www.amanohashidate.jp/event/clean-hashidate20/',
    note: '地図の位置は文珠側の受付（小天橋）付近です。府中側の受付は船越です。',
  },
};
