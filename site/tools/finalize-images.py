#!/usr/bin/env python3
"""Build image manifests from reviewed local evidence. Run after visual review."""
import json
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
EVIDENCE = SITE.parents[1] / 'output/playwright/reference-catalog'
EXCLUDED = {
    'FJ07': '公式サイトがメンテナンス案内のみのため、その画面は収録していません。',
}

def main():
    cards = json.loads((SITE / 'data/references.json').read_text())['cards']
    images, captures = {}, {}
    for card in cards:
        cid = card['id']
        raw = json.loads((EVIDENCE / (cid + '.json')).read_text())
        ok = raw['status'] == 'pending_review' and cid not in EXCLUDED
        attempts = raw.get('previous_attempts', []) + raw.get('attempts', [])
        item = {k: raw[k] for k in ('kind', 'source_url', 'asset_url', 'title', 'captured_at', 'viewport', 'note') if k in raw}
        item['status'] = 'verified' if ok else 'unavailable'
        item['reviewed'] = True
        item['attempted_urls'] = list(dict.fromkeys(t['url'] for t in attempts))
        if ok:
            image = 'images/' + cid + '.webp'
            assert (SITE / image).is_file(), cid
            images[cid] = image
            if not item.get('title'):
                item['title'] = next((t.get('title') for t in reversed(attempts) if t.get('title')), card['name'])
            if not item.get('note'):
                item['note'] = ('確認日時点の実サイトの表示。過去の受賞当時の画面とは限りません。' if item['kind'] == 'site' else '当該作品の公開ページに掲載された参考画像。')
        else:
            errors = [t.get('error', '') for t in attempts]
            if cid in EXCLUDED:
                note = EXCLUDED[cid]
            elif any('No suitable' in e for e in errors):
                note = 'ページは確認できましたが、このカードに対応する公開画像を確保できませんでした。'
            elif any('HTTP error' in e for e in errors):
                note = '候補ページがエラー・アクセス制限などで表示できず、対応する画像を確保できませんでした。'
            else:
                note = '候補URLへの接続・読み込みが完了せず、対応する画像を確保できませんでした。'
            item['note'] = note
            item['errors'] = list(dict.fromkeys(errors))
        captures[cid] = item
    for filename, data in [('images.json', images), ('captures.json', captures)]:
        (SITE / 'data' / filename).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(images)} images, {len(cards)-len(images)} unavailable, {len(cards)} checked')

if __name__ == '__main__':
    main()
