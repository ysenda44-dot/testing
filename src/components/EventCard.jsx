import { forwardRef } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../config.js';
import { formatDateList, formatLong } from '../lib/date.js';
import { googleCalendarUrl, mapUrl, directionsUrl, eventPageUrl } from '../lib/links.js';

const RESERVATION = {
  none: { tone: 'ok', label: '予約不要' },
  required: { tone: 'warn', label: '予約必須' },
  closed: { tone: 'muted', label: '受付終了' },
  unknown: { tone: 'muted', label: '申込の要否は記載なし' },
};

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

const EventCard = forwardRef(function EventCard(
  { event, venue, date, expanded, favorite, onToggleFavorite, onActivate, onShare, showDateLabel },
  ref,
) {
  const res = RESERVATION[event.reservation] || RESERVATION.unknown;
  const cat = categories[event.category];
  const time = event.timeByDate?.[date] || event.time;
  const dateNote = event.dateNotes?.[date];
  const venueLabel = [venue.name, event.room].filter(Boolean).join(' ');

  return (
    <article
      ref={ref}
      className={`card${expanded ? ' card--expanded' : ''}`}
      aria-labelledby={`t-${event.id}`}
      onClick={(e) => {
        if (e.target.closest('a,button')) return;
        onActivate();
      }}
    >
      <header className="card__head">
        <div className="card__titles">
          <div className="card__meta">
            {cat && (
              <span className="tag" style={{ '--tag': cat.color }}>
                {cat.label}
              </span>
            )}
            {showDateLabel && <span className="card__date">{formatLong(date)}</span>}
          </div>
          <h3 id={`t-${event.id}`} className="card__title">
            <button type="button" className="card__title-btn" onClick={onActivate} aria-expanded={expanded}>
              {event.title}
            </button>
          </h3>
        </div>
        <button
          type="button"
          className={`fav${favorite ? ' fav--on' : ''}`}
          aria-pressed={favorite}
          aria-label={favorite ? 'お気に入りから外す' : 'お気に入りに追加'}
          onClick={onToggleFavorite}
        >
          <Icon name="heart" size={24} filled={favorite} />
        </button>
      </header>

      <p className="card__desc">{event.description}</p>

      {expanded && (
        <p className={`badge badge--${res.tone}`}>
          <Icon name="note" size={16} />
          <span>
            <strong>{res.label}</strong>
            {event.reservationNote && event.reservationNote !== res.label && (
              <span className="badge__note">{event.reservationNote}</span>
            )}
          </span>
        </p>
      )}

      {dateNote && (
        <p className="badge badge--warn">
          <Icon name="alert" size={16} />
          <span>{dateNote}</span>
        </p>
      )}

      <div className="card__rows">
        <Row icon="clock" label="時間">
          {time}
        </Row>
        {expanded && (
          <Row icon="people" label="対象">
            {event.ageLabel}
            {event.residentsOnly && <span className="mini-tag">在住者向け</span>}
          </Row>
        )}
        <Row icon="pin" label="会場">
          <a href={mapUrl(venue)} target="_blank" rel="noopener noreferrer" className="ext">
            {venueLabel}
            <Icon name="external" size={14} />
          </a>
        </Row>
        {expanded && (
          <>
            <Row icon="pin" label="住所">
              {venue.address}
            </Row>
            <Row icon="note" label="地図について">
              地図は施設の位置です。
              {venue.note && <span className="muted"> {venue.note}</span>}
            </Row>
            <Row icon="yen" label="料金">
              {event.priceLabel}
            </Row>
            <Row icon="calendar" label="開催日">
              {formatDateList(event.dates)}
            </Row>
            {event.importantNote && (
              <Row icon="alert" label="注意事項">
                {event.importantNote}
              </Row>
            )}
            {event.contact && (
              <Row icon="phone" label="問い合わせ">
                {event.contact}
              </Row>
            )}
            <Row icon="source" label="情報源">
              <span className="muted">
                {event.sourceName}の告知をもとに掲載（{event.verifiedAt.replaceAll('-', '/')} 確認）
              </span>
            </Row>
          </>
        )}
      </div>

      {expanded && (
        <div className="card__actions">
          <a className="btn btn--primary" href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
            公式サイトを見る
          </a>
          <button type="button" className="btn" onClick={() => onShare(event, date)}>
            <Icon name="share" size={17} />
            共有
          </button>
          <a
            className="btn"
            href={googleCalendarUrl(event, venue, date, eventPageUrl(event.id, date))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="calendar" size={17} />
            カレンダー登録
          </a>
          <a className="btn btn--ghost" href={directionsUrl(venue)} target="_blank" rel="noopener noreferrer">
            <Icon name="route" size={17} />
            経路
          </a>
        </div>
      )}
    </article>
  );
});

export default EventCard;
