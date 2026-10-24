# 自走するバックログ

人間が律速にならないように、やりたいことリストを AI が自分で作り、並べ替え、
消化する仕組み。

## ループ

```
   signals                                                        outputs
   ───────                                                        ───────
   Gmail ─┐
 Calendar ─┤
   Notion ─┼──▶ harvester ──▶ backlog/wishlist.jsonl ──▶ executor ──▶ draft PR
    Drive ─┤        (capture)          │  ▲                (do)
   GitHub ─┤                           │  │                   │
     logs ─┘                           ▼  │                   ▼
                                  prioritizer          backlog/journal.jsonl
                                   (re-order) ◀────────────  (outcomes)
                                        │
                                        ▼
                                    distiller ──▶ AGENTS.md / .claude/skills/
                                    (learn)            (draft PR)
```

四つのエージェントが別々の時間に走る。それぞれ責務は一つだけ。

| agent | 役割 | やらないこと |
|---|---|---|
| `harvester` | 信号を集めて wish として登録 | 実行しない |
| `prioritizer` | 消化状況を見て優先順位を更新 | コードを触らない |
| `executor` | 上位の一件を実際にやる | マージしない |
| `distiller` | ログから skill と AGENTS.md を磨く | 自分の PR を merge しない |

閉じているのが要点で、`executor` の結果が `journal.jsonl` に残り、それを
`prioritizer` が読んで次の順番を決め、`distiller` が失敗の傾向をルールに
変える。人間が触るのは PR をマージするときだけ。

## 優先順位の決め方

順番はエージェントの気分ではなく `engine/score.py` の関数で決まる。同じ
バックログなら誰がいつ走らせても同じ順序になる ── そうでないと「一番上」が
毎回入れ替わって何も終わらない。

```
score = (value × confidence / effort)
      × age_boost      (古いものが少しずつ浮く / 塩漬け防止)
      × attempt_decay  (失敗を繰り返すものは沈む / 無限ループ防止)
      × due_pressure   (締切が近いと前に出る)
      × status_mult    (着手済みは優先、blocked は沈める)
      + pin            (手動の上書き)
```

`attempt_decay` が肝で、二回同じ理由で失敗した項目は勝手に沈み、
`prioritizer` がそれを検知して「重要でない」ではなく「粒度が悪い」と判断して
分割する。

順番を変えたいときは順番ではなく入力を変える。`wl why <id>` がどの項が効いて
いるかを出す。

## お願いのしかた（人間の入口）

三つある。どれでも同じリストに入る。

1. **`backlog/INBOX.md` に一行書く** — GitHub の web 上で編集して commit
   すれば、スマホからでも入る。毎朝 harvester が取り込んで空にする。
   記号（`!` 重要 / `?` 調べるだけ / `#タグ` / `(effort:N)` / `(due:...)`）は
   全部おまけで、無くても動く。
2. **チャットで言う** — セッション中に「〜やりたい」と言えば `wishlist-ops`
   skill がその場で登録する。
3. **端末から** — `python3 engine/wl.py add "やりたいこと"`

重要度を書かなくてよい。消化実績を見て prioritizer が毎朝直す。

## 使い方

```bash
python3 engine/wl.py add "やりたいこと" --value 4 --effort 2 --autonomy propose
python3 engine/wl.py next -n 3          # 次にやるべきもの
python3 engine/wl.py why <id>           # なぜその順位なのか
python3 engine/wl.py stats --days 7     # 増えてるのか減ってるのか
python3 engine/wl.py outcome <id> --result partial --note "..."
python3 engine/wl.py dedupe --fix
```

`backlog/*.jsonl` を直接編集しないこと。実績履歴が消えて優先順位が壊れる。

## autonomy — どこまで勝手にやらせるか

項目ごとに三段階。既定は `propose`。

- `auto` … 元に戻せて repo の中で完結する作業。draft PR まで出す。
- `propose` … 作業はするが draft のまま止める。
- `ask` … 調べて選択肢を書くだけ。何も変更しない。

repo の外に出るもの（メール送信、他人の PR へのコメント、共有ドキュメントの
編集）は項目に何と書いてあっても `ask` 扱い。

## スケジュール

`ops/routines.md` を参照。

## 中身

```
engine/     wl.py (CLI) / score.py (順位付け) / schema.py (検証)
backlog/    wishlist.jsonl / journal.jsonl / archive.jsonl
.claude/    agents/ (四体) / skills/
ops/        routines.md
AGENTS.md   全エージェント共通の運用ルール
```
