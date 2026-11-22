# MIYAZU MIKKE（みやづみっけ）

京都府宮津市のイベントを、**日付・条件・地図**から探せるサイトです。
那須エリア版の「NASU MIKKE」と同じ仕組み（地図＋日付バー＋絞り込み＋イベントカード）を、宮津市向けに作り直したものです。

## できること

- **これからの一覧（初期表示）**：今日以降の催しを、次の開催日順に日付の見出しつきで並べます。期間もの・定期ものは1回だけ出し、「11/29まで」「毎週土曜」と添えます。
- **日付バー**：今日から約5か月先まで。日付を押すとその日の催しに切り替わり、左端の「これから」で一覧に戻ります。イベントがある日には点が付きます（土曜は青、日曜・祝日は赤）。
- **地図**：選んだ日の会場にピンを表示。ピンを押すとその会場のイベントが開きます。宮津市の外側は淡く覆っています。
- **絞り込み**：「屋内」「無料」「予約不要」はONでその条件だけに。「居住者向け」「子ども向け」はOFFで在住者向け・子どもだけの催しを隠します。
- **キーワード検索**：イベント名・会場・内容に加えて、カテゴリ、料金、対象、開催月・曜日でも探せます（例：「こども」「無料」「12月」「週末」）。「こども／子ども」「まつり／フェスタ」などの言い換えは `src/lib/search.js` の表で吸収します。
- **イベントカード**：一覧では閉じた状態で、時間・会場と「無料」「要予約」「受付終了」「屋内」などのチップを表示。押すと開いて、対象・住所・料金・開催日・注意事項・問い合わせ先と「公式サイトを見る」「共有」「カレンダー登録（Googleカレンダー）」「経路」が出ます。
- **開催状況**：日本時間の現在時刻から「開催中」「終了」を表示し、終わった催しは後ろに回します。終了時刻が公式情報にない催しは「開始済み」とします。
- **お気に入り**：ハートで保存（ブラウザの localStorage）。
- **共有リンク**：`?d=2026-12-13&e=イベントID` でその日・そのイベントを開いた状態で表示。`?d=` がなければ「これから」の一覧です。
- スマホでは地図の上に一覧がボトムシートで重なります。

## 元サイトとの違い

| | NASU MIKKE | MIYAZU MIKKE |
|---|---|---|
| 地図 | Google Maps（APIキーをサーバーから取得） | **Leaflet + 国土地理院タイル**（APIキー不要・サーバー不要） |
| 配信 | サーバーあり（`/api/map-config`） | **静的ファイルのみ**（GitHub Pages などにそのまま置ける） |
| デザイン | 那須の山と牛のイラスト | 宮津湾と天橋立をモチーフにしたオリジナル |

Google Maps に切り替えたい場合は `src/components/MapView.jsx` を差し替えてください（APIキーが必要になります）。

## データの方針

- 掲載するのは、**公式の告知ページで確認できた情報だけ**です。各イベントに `sourceUrl`（出典）と `verifiedAt`（確認日）を必ず付けます。
- 公式情報に書かれていない項目は推測で埋めず、`null`（記載なし）にします。たとえば料金の記載がない催しは、「無料」フィルタをONにすると表示されません。
- 2026年11月22日時点で、日付のある催し **20件**（〜2027/3/27）と、予約制の体験 **15件**を収録しています。
- 寺社の年中行事のように毎年決まった日に行われ、今年の詳細が未発表のものは `annual: true` を付け、画面に「例年の行事」と表示します。
- 体験（`src/data/experiences.js`）は日付を持たず、「イベント／体験」の切り替えで別の一覧に出します。実施日は公式の予約カレンダーに任せています。

### 情報源（イベント探しの巡回先）

- [宮津市公式サイト「カレンダーでさがす」](https://www.city.miyazu.kyoto.jp/calendar/)（月切替：`/calendar/index.php?y=2026&m=12&d=1`）
- [天橋立観光協会 イベント情報](https://www.amanohashidate.jp/events/)
- [海の京都DMO イベント情報](https://www.uminokyoto.jp/event/)（エリア「宮津市」）
- [天橋立観光協会 体験プログラム](https://www.amanohashidate.jp/taiken)
- [京都府丹後広域振興局 月ごとのイベント情報](https://www.pref.kyoto.jp/tango/no-shoko/7gatu-ibento.html)（PDF。前年同月分は「例年」の手がかりになります）
- [智恩寺 年中行事](https://www.monjudo-chionji.jp/event/)／[成相寺 年中行事](https://www.nariaiji.jp/schedule/index.php)
- [京都丹後鉄道 イベント情報](https://trains.willer.co.jp/event/)

## イベントの追加方法

1. `src/data/events.js` の配列にオブジェクトを1つ追加します（既存のイベントをコピーすると楽です）。
2. 会場が新しければ `src/data/venues.js` に追加します。座標は [国土地理院の住所検索](https://msearch.gsi.go.jp/address-search/AddressSearch?q=京都府宮津市字浜町3012) などで住所から求めます（`[緯度, 経度]` の順）。
3. `npm run check-data` で形式をチェックします（ビルド時にも自動で実行されます）。

主な項目：

| 項目 | 内容 |
|---|---|
| `id` | 英数字とハイフンの一意なID（共有リンクに使われます） |
| `dates` | 開催日の配列 `['2026-12-06']`。期間開催は `range('2026-12-08', '2026-12-13')` |
| `time` / `timeByDate` | 表示用の時間。日ごとに違う場合は `timeByDate` で上書き |
| `hours` | カレンダー登録用 `{ default: ['10:00', '15:30'], '2026-12-20': ['10:00', '15:00'] }`。終了不明なら開始だけ |
| `ages` | `baby` / `preschool` / `elementary` / `junior` / `high` / `adult`。子ども向けだけなら子どもの年齢だけを入れる |
| `residentsOnly` | 市内在住者向けなら `true` |
| `indoor` / `free` | `true` / `false` / `null`（記載なし） |
| `reservation` | `none`（不要）/ `required`（必要）/ `closed`（受付終了）/ `unknown`（記載なし） |
| `dateNotes` | 特定の日だけの注意書き（例：年始の開館状況が未公表） |
| `priceChip` | 一覧のチップに出す料金の文言を個別に指定（任意。なければ `free` から「無料／有料」） |
| `keywords` | 検索で当てたい言葉の配列（任意） |
| `sourceName` / `sourceUrl` / `verifiedAt` | 出典と確認日（必須） |

## 開発

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # フィルタ・日付・開催状況・検索のテスト
npm run build      # dist/ に出力（データチェック込み）
```

## 公開（GitHub Pages）

`.github/workflows/pages.yml` が、`main` へのプッシュでビルドして GitHub Pages に公開します。
初回だけ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にしてください。
`vite.config.js` は `base: './'` なので、`https://<ユーザー名>.github.io/<リポジトリ名>/` のようなサブパスでもそのまま動きます。

## ほかの市町村版を作るには

`src/config.js`（サイト名・地図の中心・表示範囲・カテゴリ）と `src/data/`（イベント・会場・境界）を差し替えます。
境界データは [geolonia/japanese-admins](https://github.com/geolonia/japanese-admins) の `docs/<都道府県コード>/<市区町村コード>.json` を簡略化して使っています（宮津市は 26205）。

## クレジット

- 背景地図：[国土地理院 地理院タイル（淡色地図）](https://maps.gsi.go.jp/development/ichiran.html)
- 行政区域：「[国土数値情報（行政区域データ）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html)」（国土交通省）を加工して作成（geolonia/japanese-admins 経由、小さな島は省略）
- 会場の座標：国土地理院 住所検索API
- 地図ライブラリ：[Leaflet](https://leafletjs.com/)、祝日判定：[japanese-holidays](https://github.com/osamutake/japanese-holidays-js)
