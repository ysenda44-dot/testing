# 資産管理アプリ（個人用）

銀行・証券・カードの残高と明細を毎朝まとめて、スマホで見るためのアプリです。
すべて自分のアカウント（Google と Cloudflare）の中で動き、ほかのサービスには頼りません。

```
毎朝7時台（Google Apps Script）
  Gmail のカード利用通知 → transactions シートに追加（速報）
  balances（手入力の残高）+ その後の取引 → 口座ごとの残高
  資産クラスごとの合計 → history シートに1日1行
  → JSON にして Cloudflare に送る

スマホ（Cloudflare Workers + Access）
  /          画面（web/public）
  /api/data  最新の JSON（自分だけが見られる）
```

| 場所 | 中身 |
|---|---|
| `gas/src/` | Google Apps Script。スプレッドシートに紐づけて使う |
| `web/public/` | スマホの画面（入出金・家計簿・口座・資産の4タブ） |
| `web/src/` | Cloudflare Worker（データの受け取りと配信、Access の確認） |
| `scripts/` | 見本データ作成とテスト用の読み込み処理 |
| `test/` | テスト（`npm test`） |

> このリポジトリは公開されています。口座の一覧・残高・明細・メール本文などの**実データは絶対にコミットしない**でください。
> 実データはすべて自分の Google スプレッドシートに置きます。テスト用のメールは架空の内容にしてあります。

---

## セットアップ

### 1. Cloudflare（画面の置き場所）

パソコンで、このリポジトリを clone してから行います（Node.js 20 以上が必要）。

```sh
cd web
npx wrangler login
npx wrangler kv namespace create DATA      # 表示された id を wrangler.jsonc の REPLACE_WITH_KV_NAMESPACE_ID に貼る
openssl rand -hex 32                        # GAS と共有する合言葉を作る（控えておく）
npx wrangler secret put INGEST_TOKEN        # ↑の合言葉を貼る
npx wrangler deploy                         # https://kakeibo.<あなたのサブドメイン>.workers.dev ができる
```

この時点ではまだ `/api/data` は 403 を返します（Access を設定するまでデータを一切出さない作りです）。

**Cloudflare Access で自分だけに制限する**（画面の名前は Cloudflare 側の変更で変わることがあります）

1. Cloudflare ダッシュボード → Workers & Pages → `kakeibo` → Settings → Domains & Routes で、workers.dev の **Cloudflare Access を有効**にする
   - Zero Trust を初めて使う場合はチーム名を決めて無料プランに登録します（登録時に支払い方法の入力を求められることがあります）
2. Zero Trust → Access → Applications に作られたアプリを開き、ポリシーで**自分のメールアドレスだけを許可**する
3. 同じアプリの **Application Audience (AUD) Tag** を控える。チームのドメイン（`<チーム名>.cloudflareaccess.com`）も控える
4. Zero Trust → Access → Service auth → **Service Tokens** でトークンを作り、Client ID と Client Secret を控える（GAS が送信に使う）
5. アプリのポリシーに、Action を **Service Auth**、Include をそのサービストークンにしたものを追加する
6. Worker に設定する

```sh
npx wrangler secret put ACCESS_TEAM_DOMAIN   # 例: yourteam.cloudflareaccess.com
npx wrangler secret put ACCESS_AUD           # 3 で控えた AUD Tag
```

Worker は Access のトークンを自分でも検証するので、Access の設定が外れてもデータは出ません。

### 2. Google（データと毎朝の処理）

1. Google スプレッドシートを新規作成し、拡張機能 → **Apps Script** を開く
2. `gas/src/` の `build.js`・`parsers.js`・`main.js` を、同じ名前のファイルとして貼り付ける
   - プロジェクトの設定で「appsscript.json をエディタで表示する」をオンにし、`gas/src/appsscript.json` の内容に置き換える（タイムゾーンが東京になる）
   - clasp を使う場合: `npx @google/clasp login` → `npx @google/clasp clone <スクリプトID> --rootDir gas/src` → `npx @google/clasp push`
3. スプレッドシートを再読み込み → メニュー **資産管理 → 初期設定（シートを作る）** → 権限を承認
4. `institutions` と `accounts` に自分の金融機関・口座を書く（下の「シートの書き方」）
5. `balances` に今日の残高を1口座1行で書く
6. **資産管理 → カード通知メールを過去60日分取り込む**
7. Apps Script の「プロジェクトの設定 → スクリプト プロパティ」に次を入れる

| プロパティ | 値 |
|---|---|
| `API_URL` | `https://kakeibo.<あなたのサブドメイン>.workers.dev/api/data` |
| `INGEST_TOKEN` | Cloudflare に入れたものと同じ合言葉 |
| `CF_ACCESS_CLIENT_ID` | サービストークンの Client ID |
| `CF_ACCESS_CLIENT_SECRET` | サービストークンの Client Secret |

8. **資産管理 → 今すぐ更新** を実行し、スマホで `https://kakeibo.<あなたのサブドメイン>.workers.dev/` を開く
9. **資産管理 → 毎朝7時の自動実行を設定** を実行する

処理の記録は `log` シートに残ります。失敗したときは Google から通知メールが届きます。

---

## シートの書き方

**institutions**（金融機関）

| 列 | 例 | 説明 |
|---|---|---|
| id | `bank-a` | 英数字の短い名前。ほかのシートから参照する |
| name | `○○銀行` | 画面に出す名前 |
| type | `bank` | `bank` / `securities` / `card` / `emoney` / `other` |
| color1, color2 | `#0f6fb4` | 画面の色（2色でグラデーション） |
| chip | `○○\nCard` | カード・電子マネーの小さいラベル（任意） |
| sort | `1` | 並び順 |

**accounts**（口座）

| 列 | 例 | 説明 |
|---|---|---|
| id | `bank-a-futsu` | 英数字の短い名前 |
| institution_id | `bank-a` | institutions の id |
| name | `普通預金` | |
| asset_class | `cash` | `cash` 現金・預金 / `fund` 債券・ファンド / `stock` 上場株式 / `private` 非上場株式 / `realestate` 不動産 / `point` ポイント / `liability` 負債（カードなど） |
| currency | `JPY` | |
| mail_match | `カード(NL)` | カード利用通知の「ご利用カード」に含まれる文字。全角・半角は区別しない |
| note | `毎月26日 引き落とし` | 画面に小さく出るメモ |
| sort | `1` | 並び順 |
| active | ✓ | 外すと画面に出さない |

**balances**（残高の入力）: `date`, `account_id`, `amount_jpy`（カードの未払いはマイナス）, `amount_fx` と `fx_currency`（外貨口座のみ）, `source`, `memo`。
口座ごとに一番新しい行を起点にし、その日より後の取引を足して「推定」残高を出します。

**transactions**（明細）: メールから自動で入ります。`category` / `subcategory` は手で直してかまいません（手で直した分類は上書きしません）。
`transfer` にチェックを入れた取引（カードの引き落とし、自分の口座間の移動）は家計簿の収支から外れます。

**rules**（自動分類）: `keyword` が取引名に含まれていれば、その `category` / `subcategory` にします。`priority` が大きいもの、次に keyword が長いものが優先。
rules を足すと、次の更新で「未分類」の取引にも当て直します。

**history**（資産の推移）: 毎朝1行ずつ自動で増えます。過去の推移を入れたいときは、同じ列で過去の日付の行を手で足してください（年末ごとに1行など）。

---

## 開発

```sh
npm test                 # テスト（Node.js 20 以上、追加のインストール不要）
npm run sample           # 見本データ web/public/sample-data.json を作り直す
cd web && cp .dev.vars.example .dev.vars && npx wrangler dev   # http://localhost:8787/?demo で画面を確認
```

画面の URL に `?demo` を付けると、架空の見本データで表示します。

## これから

- [ ] 月1回の明細 CSV 取り込み（速報を確定に置き換え、残高を合わせ直す）
- [ ] 証券: 保有数量 × 毎日の価格で評価額を出す
- [ ] 外貨: 毎日の為替レートで円に換算
- [ ] ほかのカードの利用通知メール
- [ ] MoneyForward ME の CSV との照合（ズレだけ表示）
