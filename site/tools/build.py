#!/usr/bin/env python3
"""site/index.html を組み立てる。

    python3 site/tools/build.py

1. data/references.json を読む（extract.py の出力。手で編集しない）
2. data/images.json（{"B01": "images/B01.webp", ...}）を各カードの image に反映する
   extract.py を再実行しても画像の設定が消えないよう、画像は別ファイルで持つ
3. src/page.html の __DATA__ を JSON に置き換えて index.html に書き出す
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "references.json"
IMAGES = ROOT / "data" / "images.json"
TEMPLATE = ROOT / "src" / "page.html"
OUT = ROOT / "index.html"
PLACEHOLDER = "__DATA__"


def load_overrides(card_ids):
    """images.json を読み、使える項目だけ返す。問題のある項目は警告して飛ばす。"""
    if not IMAGES.exists():
        return {}
    raw = json.loads(IMAGES.read_text(encoding="utf-8") or "{}")
    if not isinstance(raw, dict):
        sys.exit("images.json は {\"B01\": \"images/B01.webp\"} の形にしてください")
    ok = {}
    for cid, path in raw.items():
        if not path:
            continue
        if cid not in card_ids:
            print(f"警告: images.json の {cid} に対応するカードがありません。無視します", file=sys.stderr)
        elif str(path).startswith(("http://", "https://", "//")):
            print(f"警告: {cid} の画像が外部URLです。ページのCSPで読み込めないため無視します: {path}", file=sys.stderr)
        elif not str(path).startswith("data:") and not (ROOT / path).is_file():
            print(f"警告: {cid} の画像ファイルが見つかりません（仮表示のままにします）: {path}", file=sys.stderr)
        else:
            ok[cid] = path
    return ok


def main():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    cards = data["cards"]
    overrides = load_overrides({c["id"] for c in cards})
    for c in cards:
        c["image"] = overrides.get(c["id"], c.get("image"))

    page = TEMPLATE.read_text(encoding="utf-8")
    if page.count(PLACEHOLDER) != 1:
        sys.exit(f"src/page.html に {PLACEHOLDER} が1か所だけ必要です（現在 {page.count(PLACEHOLDER)} か所）")

    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    # <script> を閉じさせない。"</" は "<\/" に、"<!" は "<!" に置き換える（どちらもJSONとして同じ値）
    payload = payload.replace("</", "<\\/").replace("<!", "<\\u0021")

    OUT.write_text(page.replace(PLACEHOLDER, payload, 1), encoding="utf-8")
    size = OUT.stat().st_size
    print(f"cards={len(cards)} images={len(overrides)} -> {OUT} ({size:,} bytes / {size / 1024 / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
