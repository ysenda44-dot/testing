import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { Mark } from './Logo.jsx';
import { site } from '../config.js';

export default function InfoModal({ open, onClose, sources, lastVerified }) {
  const ref = useRef(null);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (open && !dlg.open) dlg.showModal();
    if (!open && dlg.open) dlg.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby="info-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal__inner">
        <header className="modal__head">
          <Mark size={36} />
          <h2 id="info-title">
            {site.name}
            <small>{site.kana}</small>
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="閉じる">
            <Icon name="close" />
          </button>
        </header>

        <section>
          <h3>このサイトについて</h3>
          <p>
            {site.description}
            日付を選ぶと、その日に開かれるイベントと会場が地図に表示されます。
          </p>
        </section>

        <section>
          <h3>使い方</h3>
          <ul className="bullets">
            <li>開くと、これからのイベントが日付順に並びます。日付バーで日にちを選ぶと、その日の催しだけになります。</li>
            <li>「体験」に切り替えると、予約すれば参加できる体験プログラムが見られます。</li>
            <li>絞り込みボタンで「屋内」「無料」「予約不要」などの条件を付けられます。虫めがねでキーワード検索ができます。</li>
            <li>地図のピンは、赤が今日ある催し、紺がこれからの催し、青緑が体験です。数字は件数で、押すと拡大して分かれます。</li>
            <li>経路はカードの「経路」から Google マップで調べられます。ハートでお気に入りに保存できます（この端末のブラウザに保存）。</li>
          </ul>
        </section>

        <section>
          <h3>掲載している情報について</h3>
          <p>
            イベント情報は、宮津市や主催団体が公開している告知ページの内容をもとに手作業でまとめています。
            最終確認日は {lastVerified.replaceAll('-', '/')} です。内容は変更・中止になることがあるため、
            お出かけ前に必ず各イベントの「公式サイトを見る」から最新情報をご確認ください。
          </p>
          <p>公式情報に書かれていない項目（料金、屋内・屋外など）は「記載なし」として扱い、推測では埋めていません。</p>
        </section>

        <section>
          <h3>おもな情報源</h3>
          <ul className="bullets">
            {sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>地図データ</h3>
          <p className="muted">
            地図の下絵：
            <a href="https://maps.gsi.go.jp/development/vt.html" target="_blank" rel="noopener noreferrer">
              国土地理院ベクトルタイル
            </a>
            から海・道路・鉄道・川・地名の位置を取り出し、独自の配色で描画
            ／ 行政区域：
            <a
              href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2026.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              国土数値情報（行政区域データ）国土交通省
            </a>
            を加工して作成。会場の位置は国土地理院の住所検索で求めた番地の代表点です。
          </p>
        </section>
      </div>
    </dialog>
  );
}
