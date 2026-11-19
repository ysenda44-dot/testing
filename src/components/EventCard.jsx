import { forwardRef } from 'react';
import Icon from './Icon.jsx';
import { categories } from '../config.js';
import { formatDateList, scheduleHint } from '../lib/date.js';
import { RESERVATION, eventChips } from '../lib/chips.js';
import { STATUS_LABEL } from '../lib/status.js';
import { googleCalendarUrl, mapUrl, directionsUrl, eventPageUrl } from '../lib/links.js';

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
  { event, venue, date, status, expanded, favorite, onToggleFavorite, onActivate, onShare },
  ref,
) {
  const res = RESERVATION[event.reservation] || RESERVATION.unknown;
  const cat = categories[event.category];
  const time = event.timeByDate?.[date] || event.time;
  const dateNote = event.dateNotes?.[date];
  const venueLabel = [venue.name, event.room].filter(Boolean).join(' ');
  const venueShort = [venue.shortName || venue.name, event.room].filter(Boolean).join(' ');
  const hint = scheduleHint(event.dates, date);
  // 一覧では、その日の開始〜終了だけを短く出す
  const h = event.hours?.[date] || event.hours?.default;
  const timeShort = h ? `${h[0]}〜${h[1] || ''}` : time;
  const statusLabel = STATUS_LABEL[status];
  const dim = status === 'ended' || event.reservation === 'closed';

  const tag = cat && (
    <span className="tag" style={{ '--tag': cat.color }}>
      {cat.label}
    </span>
  );
  const state = statusLabel && <span className={`state state--${status}`}>{statusLabel}</span>;

  return (
    <article
      ref={ref}
      className={`card${expanded ? ' card--expanded' : ''}${dim ? ' card--dim' : ''}`}
      aria-labelledby={`t-${event.id}`}
      onClick={(e) => {
        if (e.target.closest('a,button')) return;
        onActivate();
      }}
    >
      <header className="card__head">
        <div className="card__titles">
          {expanded && (
            <div className="card__meta">
              {tag}
              {state}
            </div>
          )}
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

      {!expanded && (
        <>
          <p className="card__summary">
            <span className="card__summary-time">{timeShort}</span>
            {hint && <span className="card__summary-hint">{hint}</span>}
            <span className="card__summary-venue">{venueShort}</span>
          </p>
          {dateNote && (
            <p className="card__caution">
              <Icon name="alert" size={14} />
              この日は注意事項があります
            </p>
          )}
          <ul className="chips" aria-label="カテゴリと条件">
            {state && <li>{state}</li>}
            {tag && <li>{tag}</li>}
            {eventChips(event).map((c) => (
              <li key={c.key} className={`chip-s chip-s--${c.tone}`}>
                {c.label}
              </li>
            ))}
          </ul>
        </>
      )}

      {expanded && <p className="card__desc">{event.description}</p>}

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

      {expanded && dateNote && (
        <p className="badge badge--warn">
          <Icon name="alert" size={16} />
          <span>{dateNote}</span>
        </p>
      )}

      {expanded && (
        <div className="card__rows">
          <Row icon="clock" label="時間">
            {time}
          </Row>
          <Row icon="people" label="対象">
            {event.ageLabel}
            {event.residentsOnly && <span className="mini-tag">在住者向け</span>}
          </Row>
          <Row icon="pin" label="会場">
            <a href={mapUrl(venue)} target="_blank" rel="noopener noreferrer" className="ext">
              {venueLabel}
              <Icon name="external" size={14} />
            </a>
          </Row>
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
        </div>
      )}

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
