# 多ブランドLP リファレンス帖

空港を除いた229カード、112行のスタジオ・年間賞、10の設計原則をまとめた資料です。

## 画像追加版（2026-10-28）

- 全229カードの候補ページを確認し、**211カードに画像を収録**。18カードはアクセス制限、接続エラー、適切な画像が見つからないなどの理由で未収録です。
- 実サイト画面は60件、制作事例ページの画面は1件、受賞・制作事例・公式発表・記事などの掲載画像は150件です。
- 画像は1600×1000 WebP。約20MBで、外部画像へのホットリンクは使いません。
- カード詳細に出典・確認日・画像の位置づけを追加しました。「画像あり」で絞り込めます。
- 原調査の本文を全面検証したものではありません。現在の画面と過去の受賞時点の画面、施設写真とWeb画面、雑誌の表紙と誌面用写真を区別して記録しています。
- Cartier 2026の制作クレジット、Aesopの制作会社、GINZA NOVOへの名称変更、玉川高島屋P.の画像候補の取り違えを確認・補記しました。
- 単体HTMLでの閲覧に必要なUTF-8指定、viewport指定、文書構造も補完しました。

## 開く・ビルドする

`index.html` と `images/` を同じフォルダ構成で置いて開いてください。ローカルサーバーでも閲覧できます。

```sh
python3 site/tools/build.py
python3 -m http.server 8767 --bind 127.0.0.1 --directory site
```

## ファイル

| パス | 役割 |
|---|---|
| `data/references.json` | 元の調査データ。今回変更していません |
| `data/images.json` | 確認済みの211件の画像パス |
| `data/captures.json` | 全229件の取得状況、出典、確認日、備考、未取得理由 |
| `data/verified.json` | 実ページで確認した本文の補記・訂正。元データと分離 |
| `data/capture-plan.json` | 各カードの取得対象URL・方法 |
| `data/asset-repairs.json` | 自動選択から差し替えた、ページ内の具体的な画像URL |
| `images/` | 採用画像のみ。未採用画像は含めません |
| `src/page.html` | ページの雛形 |
| `tools/build.py` | データと画像設定を埋め込んでHTMLを生成 |
| `tools/capture.cjs` | 公開ページの取得補助。Node.js、Playwright、Sharp、Chromeが必要 |
| `tools/repair-assets.cjs` | 確認済みの特定画像に差し替え |
| `tools/finalize-images.py` | 目視確認後に画像・出典マニフェストを生成 |
| `tools/contact-sheets.cjs` | 画像確認用の一覧を生成 |
| `tools/qa.cjs` | ローカルで画像・検索・詳細・モバイル表示を確認 |

## 画像を更新する

1. `capture-plan.json` のURLを確認します。現在の画面か、過去作品の掲載画像かを区別します。
2. `node site/tools/capture.cjs B01 --force` のように対象IDを指定して取得します。取得ログはリポジトリの隣の `output/playwright/reference-catalog/` に作成されます。
3. **自動取得の成功は画像の採用を意味しません。** 実画像を開き、作品との対応、読み込み、ポップアップ、別媒体の汎用OG画像でないことを目視確認してください。
4. 必要に応じて `asset-repairs.json` を直し、`node site/tools/repair-assets.cjs B01` で差し替えます。誤った画像やメンテナンス画面は採用しません。
5. `finalize-images.py` の除外条件と取得ログを確認したうえで `python3 site/tools/finalize-images.py`、続けて `python3 site/tools/build.py` を実行します。
6. PC・390px幅・ダークモード・検索・詳細の出典表示を確認します。

`extract.py` を再実行しても、画像設定と訂正は別ファイルにあるため消えません。

## Claude Artifactへの再公開

既存URLへの再公開はClaude側の公開操作が必要です。この作業ではArtifactの公開状態を変更していません。

公開対象は **`index.html` と `images/*.webp` の212ファイル** です。相対パスを保って同時に登録してください。生成済みHTML内にデータを埋め込んであるため、公開時には `data/`、`src/`、`tools/` は不要です。

元の案内にある255ファイル・64MBの上限内に収まります。公開後に実際のURLで画像と詳細をもう一度確認してください。

画像の権利は各権利者に帰属します。各カードの出典を参照してください。
