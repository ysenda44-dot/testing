"""Extract the reference report (Markdown) into site/data/references.json.

Usage: python3 site/tools/extract.py "reports/ブランドLP デザインリファレンス 拡充版.md"
"""
import json
import re
import sys
from pathlib import Path

CARD_RE = re.compile(r"^#### ([A-Z]{1,2}\d{2}) (.+)$")
URL_RE = re.compile(r"https?://[^\s)（）<>|]+")
LINK_RE = re.compile(r"\[([^\]]+)\]\((https?://[^)\s]+)\)")
STATUS_RE = re.compile(r"(https?://[^\s（<]+)\s*（([^）]+)）")
FIELDS = {
    "カテゴリ": "category", "年": "year", "URL": "url", "画像URL": "image_url",
    "クライアント": "client", "制作": "credits", "受賞": "awards", "成果": "results",
    "見た目・UX": "visual_ux", "LPへの転用ポイント": "borrow", "確度": "confidence",
}
EMPTY = {"なし", "不明", "非公開", "—", "-", "", "なし（調査範囲）"}


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def main(src):
    lines = Path(src).read_text(encoding="utf-8").splitlines()
    out = {"title": lines[0].lstrip("# ").strip(), "summary": "", "sections": [],
           "cards": [], "studios": [], "principles": [], "checklist": [],
           "top_picks": [], "conclusion": ""}
    h2 = h3 = None
    card = None
    table_header = None
    para = []

    def section(level, text):
        m = re.match(r"^(\d+|[0-9]+[A-Z])\.?\s*(.*)$", text)
        out["sections"].append({"level": level, "heading": text, "intro": ""})

    def flush_para():
        nonlocal para
        if para:
            text = " ".join(para).strip()
            if out["sections"] and not card and text:
                s = out["sections"][-1]
                s["intro"] = (s["intro"] + "\n\n" + text).strip()
            para = []

    for i, line in enumerate(lines[1:], start=2):
        if line.startswith("## ") or line.startswith("### "):
            flush_para()
            card = None
            table_header = None
            level = 2 if line.startswith("## ") else 3
            text = line[level + 1:].strip()
            if level == 2:
                h2, h3 = text, None
            else:
                h3 = text
            section(level, text)
            continue
        m = CARD_RE.match(line)
        if m:
            flush_para()
            table_header = None
            card = {"id": m.group(1), "name": m.group(2).strip(), "group": h2, "subgroup": h3,
                    "region": "japan" if (m.group(1).startswith(("J", "FJ")) or (h3 and "国内" in h3)) else "global",
                    "image": None}
            out["cards"].append(card)
            continue
        if line.startswith("|"):
            flush_para()
            row = cells(line)
            if set("".join(row)) <= set("-: "):
                continue
            if card is not None:
                if row[0] == "項目":
                    continue
                key = FIELDS.get(row[0].replace("**", ""))
                if key:
                    card[key] = " | ".join(row[1:])
                continue
            if table_header is None:
                table_header = row
                continue
            rec = dict(zip(table_header, row))
            if h2 and h2.startswith("5.") and h3:
                rec["_section"] = h3
                out["studios"].append(rec)
            elif h2 and h2.startswith("7."):
                out["checklist"].append(rec)
            elif h2 and "筆頭候補" in h2:
                rec["ids"] = re.findall(r"（([A-Z]{1,2}\d{2})）", line) or re.findall(r"\b([A-Z]{1,2}\d{2})\b", line)
                out["top_picks"].append(rec)
            continue
        table_header = None if not line.strip() else table_header
        if line.strip() == "":
            flush_para()
            continue
        if i == 3 or (not out["sections"] and not out["summary"]):
            out["summary"] = (out["summary"] + " " + line).strip()
            continue
        if h2 and h2.startswith("6.") and line.startswith("**第"):
            out["principles"].append(line.strip())
            continue
        if h2 == "結論":
            out["conclusion"] = (out["conclusion"] + "\n\n" + line).strip()
            continue
        if card is None:
            para.append(line)
    flush_para()

    for c in out["cards"]:
        img = c.get("image_url", "")
        shots = [{"url": u.rstrip(".,"), "status": s} for u, s in STATUS_RE.findall(img)]
        if not shots:
            shots = [{"url": u, "status": ""} for u in URL_RE.findall(img)]
        c["shots"] = shots
        c["shot_url"] = shots[0]["url"] if shots else None
        c["links"] = [{"label": l, "url": u} for l, u in LINK_RE.findall(c.get("url", ""))] or \
                     [{"label": u, "url": u} for u in URL_RE.findall(c.get("url", ""))]
        conf = re.match(r"\**([A-D])", c.get("confidence", ""))
        c["grade"] = conf.group(1) if conf else None
        aw = re.sub(r"[*\s]", "", c.get("awards", ""))
        c["has_award"] = bool(aw) and aw not in EMPTY and not aw.startswith(("なし", "不明"))
        rs = re.sub(r"[*\s]", "", c.get("results", ""))
        c["has_results"] = bool(re.search(r"\d", rs)) and not rs.startswith(("非公開", "不明", "なし"))
        c["self_reported"] = "自己申告" in c.get("results", "")
    picks = {}
    for p in out["top_picks"]:
        for cid in p.get("ids", []):
            picks.setdefault(cid, []).append(p.get("観点", ""))
    for c in out["cards"]:
        c["picks"] = picks.get(c["id"], [])
    return out


if __name__ == "__main__":
    data = main(sys.argv[1])
    dest = Path(__file__).resolve().parents[1] / "data" / "references.json"
    dest.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"cards={len(data['cards'])} studios={len(data['studios'])} principles={len(data['principles'])} "
          f"checklist={len(data['checklist'])} top_picks={len(data['top_picks'])} sections={len(data['sections'])} -> {dest}")
