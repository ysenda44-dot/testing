import { forwardRef } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../config.js';
import { mapUrl, directionsUrl } from '../lib/links.js';

function Row({ icon, label, children }) {
  return (
    <div className="row">
      <span className="row__icon" title={label}>
        <Icon name={icon} size={17} />
        <span className="sr-only">{label}</span>
      </span>
      <div className="row__body">{children}</div>
    </div>
  );
}

/** 予約して参加する体験プログラムのカード */
const ExperienceCard = forwardRef(function ExperienceCard({ item, venue, expanded, onActivate }, ref) {
  const cat = categories.experience;
  return (
    <article
      ref={ref}
      className={`card${expanded ? ' card--expanded' : ''}`}
      aria-labelledby={`t-${item.id}`}
      onClick={(e) => {
        if (e.target.closest('a,button')) return;
        onActivate();
      }}
    >
      <header className="card__head">
        <div className="card__titles">
          <h3 id={`t-${item.id}`} className="card__title">
            <button type="button" className="card__title-btn" onClick={onActivate} aria-expanded={expanded}>
              {item.title}
            </button>
          </h3>
        </div>
      </header>

      {!expanded && (
        <>
          <p className="card__summary">
            <span className="card__summary-time">{item.duration}</span>
            <span className="card__summary-venue">{venue.shortName || venue.name}</span>
          </p>
          <ul className="chips" aria-label="条件">
            <li>
              <span className="tag" style={{ '--tag': cat.color }}>
                {cat.label}
              </span>
            </li>
            <li className="chip-s chip-s--warn">要予約</li>
            {item.indoor === true && <li className="chip-s chip-s--plain">屋内</li>}
            {item.indoor === false && <li className="chip-s chip-s--plain">屋外</li>}
            {item.seasonNote && <li className="chip-s chip-s--muted">実施時期を確認</li>}
          </ul>
        </>
      )}

      {expanded && (
        <>
          <p className="card__desc">{item.description}</p>
          {item.seasonNote && (
            <p className="badge badge--muted">
              <Icon name="alert" size={16} />
              <span>{item.seasonNote}</span>
            </p>
          )}
          <div className="card__rows">
            <Row icon="yen" label="料金">
              {item.priceLabel}
            </Row>
            <Row icon="clock" label="所要時間">
              {item.duration}
            </Row>
            <Row icon="calendar" label="集合時間">
              集合：{item.meet}
              <span className="muted">（実施日は公式の予約カレンダーで確認）</span>
            </Row>
            <Row icon="pin" label="集合場所">
              <a href={mapUrl(venue)} target="_blank" rel="noopener noreferrer" className="ext">
                {venue.name}
                <Icon name="external" size={14} />
              </a>
            </Row>
            <Row icon="pin" label="住所">
              {venue.address}
              {venue.note && <span className="muted"> {venue.note}</span>}
            </Row>
            <Row icon="source" label="情報源">
              <span className="muted">
                {item.sourceName}の案内をもとに掲載（{item.verifiedAt.replaceAll('-', '/')} 確認）
              </span>
            </Row>
          </div>
          <div className="card__actions">
            <a className="btn btn--primary" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
              公式ページで予約
            </a>
            <a className="btn btn--ghost" href={directionsUrl(venue)} target="_blank" rel="noopener noreferrer">
              <Icon name="route" size={17} />
              経路
            </a>
          </div>
        </>
      )}
    </article>
  );
});

export default ExperienceCard;
