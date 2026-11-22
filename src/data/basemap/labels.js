// 地図に載せる地名。位置は国土地理院ベクトルタイルの注記（Anno）から取ったものです。
// kind: sea 海・湾 / landmark 名所 / area 地区 / spot 寺社・名所 / station 駅 / neighbor 隣の市町
// min・max: 表示するズームの範囲
export const labels = [
  { name: '宮津湾', kind: 'sea', at: [35.5758, 135.2103], min: 11 },
  { name: '阿蘇海', kind: 'sea', at: [35.5659, 135.1712], min: 12 },
  { name: '栗田湾', kind: 'sea', at: [35.5472, 135.2484], min: 12 },
  { name: '天橋立', kind: 'landmark', at: [35.5691, 135.1913], min: 11 },

  { name: '宮津市街', kind: 'area', at: [35.5356, 135.2003], min: 11, max: 14 }, // 位置は「鶴賀」
  { name: '文珠', kind: 'area', at: [35.5558, 135.1819], min: 12, max: 15 },
  { name: '府中', kind: 'area', at: [35.584, 135.1938], min: 12, max: 15 }, // 位置は「大垣」
  { name: '由良', kind: 'area', at: [35.5176, 135.2784], min: 12 },
  { name: '栗田', kind: 'area', at: [35.5438, 135.2355], min: 12, max: 13 },
  { name: '日置', kind: 'area', at: [35.6082, 135.22], min: 12 },
  { name: '上世屋', kind: 'area', at: [35.6391, 135.1909], min: 12 },
  { name: '田井', kind: 'area', at: [35.5838, 135.2428], min: 13 },
  { name: '獅子崎', kind: 'area', at: [35.5552, 135.2079], min: 14 },
  { name: '波路', kind: 'area', at: [35.5394, 135.2084], min: 14 },
  { name: '国分', kind: 'area', at: [35.5783, 135.1784], min: 14 },
  { name: '江尻', kind: 'area', at: [35.5819, 135.1997], min: 14 },

  { name: '成相寺', kind: 'spot', at: [35.5954, 135.1874], min: 13 },
  { name: '籠神社', kind: 'spot', at: [35.5827, 135.1968], min: 14 },
  { name: '智恩寺', kind: 'spot', at: [35.5603, 135.184], min: 15 },
  { name: '金引の滝', kind: 'spot', at: [35.5282, 135.1826], min: 13 },

  { name: '天橋立駅', kind: 'station', at: [35.5574, 135.1829], min: 13 },
  { name: '宮津駅', kind: 'station', at: [35.5341, 135.2], min: 13 },
  { name: '栗田駅', kind: 'station', at: [35.5438, 135.2355], min: 14 },
  { name: '丹後由良駅', kind: 'station', at: [35.5158, 135.2799], min: 14 },
  { name: '岩滝口駅', kind: 'station', at: [35.5503, 135.1513], min: 14 },
  { name: '宮村駅', kind: 'station', at: [35.5234, 135.1923], min: 14 },
  { name: '喜多駅', kind: 'station', at: [35.5092, 135.1877], min: 14 },

  { name: '伊根町', kind: 'neighbor', at: [35.7089, 135.2331], min: 11, max: 13 },
  { name: '与謝野町', kind: 'neighbor', at: [35.5144, 135.0582], min: 11, max: 13 },
  { name: '京丹後市', kind: 'neighbor', at: [35.7098, 135.1371], min: 11, max: 13 },
  { name: '舞鶴市', kind: 'neighbor', at: [35.4375, 135.2286], min: 11, max: 13 },
];
