import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView from './components/MapView.jsx';
import DateStrip from './components/DateStrip.jsx';
import FilterBar from './components/FilterBar.jsx';
import EventCard from './components/EventCard.jsx';
import InfoModal from './components/InfoModal.jsx';
import Logo from './components/Logo.jsx';
import Scenery from './components/Scenery.jsx';
import Icon from './components/Icon.jsx';
import { events } from './data/events.js';
import { venues } from './data/venues.js';
import { dataSources, site } from './config.js';
import { addDays, dayInfo, formatLong, todayISO } from './lib/date.js';
import { DEFAULT_FILTERS, isOnDate, matchesKeyword, nextDate, passesFilters } from './lib/filter.js';
import { eventPageUrl, hoursOn } from './lib/links.js';
import { useFavorites } from './lib/useFavorites.js';
import { useMediaQuery } from './lib/useMediaQuery.js';

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function readUrlState(today, lastDay) {
  const p = new URLSearchParams(window.location.search);
  const d = p.get('d');
  const e = p.get('e');
  const date = d && ISO_RE.test(d) && d >= today && d <= lastDay ? d : null;
  const event = e && events.some((x) => x.id === e) ? e : null;
  return { date, event };
}

const startMinutes = (event, date) => {
  const h = hoursOn(event, date);
  if (!h) return 24 * 60;
  const [hh, mm] = h.start.split(':').map(Number);
  return hh * 60 + mm;
};

const byDateThenTime = (a, b) =>
  a.date.localeCompare(b.date) || startMinutes(a.event, a.date) - startMinutes(b.event, b.date);

export default function App() {
  const today = useMemo(() => todayISO(), []);
  const days = useMemo(
    () => Array.from({ length: site.dateStripDays }, (_, i) => addDays(today, i)),
    [today],
  );
  const lastDay = days[days.length - 1];
  const initial = useMemo(() => readUrlState(today, lastDay), [today, lastDay]);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initial.date) return initial.date;
    if (initial.event) {
      const ev = events.find((x) => x.id === initial.event);
      const next = nextDate(ev, today);
      if (next && next <= lastDay) return next;
    }
    return today;
  });
  const [mode, setMode] = useState('date'); // date | search | favorites
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [activeEventId, setActiveEventId] = useState(initial.event);
  const [activeVenueId, setActiveVenueId] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [sheet, setSheet] = useState('peek'); // スマホのパネル：peek | full
  const [favorites, toggleFavorite] = useFavorites(site.favoritesStorageKey);
  const isMobile = useMediaQuery('(max-width: 820px)');

  const panelRef = useRef(null);
  const listRef = useRef(null);
  const cardRefs = useRef(new Map());
  const searchRef = useRef(null);
  const [panelWidth, setPanelWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);

  // パネルの大きさを地図の余白計算に使う
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setPanelWidth(entry.target.getBoundingClientRect().width));
    ro.observe(el);
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);
  // スマホではパネル（58dvh、CSSと同じ値）が地図の下側を覆う
  const mapBottomInset = isMobile ? Math.round(viewportHeight * 0.58) : 0;
  const mapRightInset = isMobile ? 0 : panelWidth + 24;

  const dateHasEvents = useMemo(() => {
    const set = new Set(events.flatMap((e) => e.dates));
    return (iso) => set.has(iso);
  }, []);

  // 表示するイベントの一覧
  const items = useMemo(() => {
    const kw = keyword.trim();
    if (mode === 'favorites') {
      return events
        .filter((e) => favorites.has(e.id))
        .map((e) => ({ event: e, venue: venues[e.venueId], date: nextDate(e, today) }))
        .filter((x) => x.date)
        .sort(byDateThenTime);
    }
    if (mode === 'search' && kw) {
      return events
        .map((e) => ({ event: e, venue: venues[e.venueId], date: nextDate(e, today) }))
        .filter((x) => x.date && passesFilters(x.event, filters) && matchesKeyword(x.event, x.venue, kw))
        .sort(byDateThenTime);
    }
    return events
      .filter((e) => isOnDate(e, selectedDate) && passesFilters(e, filters))
      .map((e) => ({ event: e, venue: venues[e.venueId], date: selectedDate }))
      .sort(byDateThenTime);
  }, [mode, keyword, filters, favorites, selectedDate, today]);

  const listKey = items.map((x) => x.event.id).join(',');

  // 一覧が変わったら、先頭のイベントを開いた状態にする
  useEffect(() => {
    if (!items.some((x) => x.event.id === activeEventId)) {
      setActiveEventId(items[0]?.event.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);

  const activeItem = items.find((x) => x.event.id === activeEventId) || null;

  useEffect(() => {
    setActiveVenueId(activeItem?.event.venueId ?? null);
  }, [activeItem]);

  // 地図のピン（会場ごとにまとめる）
  const markers = useMemo(() => {
    const map = new Map();
    for (const { event, venue } of items) {
      const m = map.get(event.venueId);
      if (m) m.count += 1;
      else map.set(event.venueId, { venueId: event.venueId, venue, count: 1, category: event.category });
    }
    return [...map.values()];
  }, [items]);

  // URLに状態を残す（共有・再読み込み用）
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('d', selectedDate);
    if (activeEventId) url.searchParams.set('e', activeEventId);
    else url.searchParams.delete('e');
    window.history.replaceState(null, '', url);
  }, [selectedDate, activeEventId]);

  const toastTimer = useRef(0);
  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  const scrollToCard = (id) => {
    requestAnimationFrame(() => {
      cardRefs.current.get(id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };

  const onSelectVenue = useCallback(
    (venueId) => {
      const first = items.find((x) => x.event.venueId === venueId);
      setActiveVenueId(venueId);
      if (first) {
        setActiveEventId(first.event.id);
        scrollToCard(first.event.id);
      }
      if (isMobile && sheet !== 'peek') setSheet('peek');
    },
    [items, isMobile, sheet],
  );

  const onShare = async (event, date) => {
    const url = eventPageUrl(event.id, date);
    const text = `${event.title}（${formatLong(date)}）`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      showToast('リンクをコピーしました');
    } catch (err) {
      if (err?.name !== 'AbortError') showToast('共有できませんでした');
    }
  };

  const selectDate = (iso) => {
    setSelectedDate(iso);
    setMode('date');
    setKeyword('');
    listRef.current?.scrollTo({ top: 0 });
  };

  const toggleSearch = () => {
    if (mode === 'search') {
      setMode('date');
      setKeyword('');
    } else {
      setMode('search');
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  };

  const nextEventDay = useMemo(
    () => days.find((d) => d > selectedDate && events.some((e) => isOnDate(e, d) && passesFilters(e, filters))),
    [days, selectedDate, filters],
  );

  const lastVerified = useMemo(() => events.map((e) => e.verifiedAt).sort().at(-1), []);

  const kw = keyword.trim();
  const sel = dayInfo(selectedDate);
  let heading;
  if (mode === 'favorites') heading = 'お気に入り';
  else if (mode === 'search' && kw) heading = `「${kw}」の検索結果`;
  else heading = `${sel.month}月${sel.day}日のイベント`;

  const isListAcrossDates = mode === 'favorites' || (mode === 'search' && kw);

  return (
    <div className={`app${isMobile ? ' app--mobile' : ''}`}>
      <a className="skip-link" href="#panel">
        本文へ移動
      </a>

      <MapView
        markers={markers}
        activeVenueId={activeVenueId}
        onSelectVenue={onSelectVenue}
        bottomInset={mapBottomInset}
        rightInset={mapRightInset}
      />
      <Scenery />

      <header className="topbar">
        <h1 className="topbar__title">
          <Logo />
          <span className="sr-only">{site.kana}</span>
        </h1>
        <div className="topbar__actions">
          <button
            type="button"
            className={`pill-btn${mode === 'favorites' ? ' pill-btn--on' : ''}`}
            aria-pressed={mode === 'favorites'}
            onClick={() => setMode(mode === 'favorites' ? 'date' : 'favorites')}
          >
            <Icon name="heart" size={20} filled={mode === 'favorites'} />
            <span className="pill-btn__label">お気に入り</span>
            {favorites.size > 0 && <span className="pill-btn__count">{favorites.size}</span>}
          </button>
          <button type="button" className="round-btn" onClick={() => setInfoOpen(true)} aria-label="このサイトについて">
            <Icon name="info" size={22} />
          </button>
        </div>
      </header>

      <main id="panel" ref={panelRef} className={`panel panel--${sheet}`} tabIndex={-1}>
        {isMobile && (
          <button
            type="button"
            className="panel__handle"
            aria-label={sheet === 'full' ? '一覧を小さくする' : '一覧を大きくする'}
            aria-expanded={sheet === 'full'}
            onClick={() => setSheet(sheet === 'full' ? 'peek' : 'full')}
          >
            <span />
          </button>
        )}

        <div className="panel__head">
          <h2 className="panel__title" aria-live="polite">
            {heading}
            <span className="count">{items.length}件</span>
          </h2>
          {mode !== 'favorites' && (
            <button
              type="button"
              className={`icon-btn${mode === 'search' ? ' icon-btn--on' : ''}`}
              onClick={toggleSearch}
              aria-label={mode === 'search' ? '検索を閉じる' : 'キーワード検索'}
              aria-expanded={mode === 'search'}
            >
              <Icon name={mode === 'search' ? 'close' : 'search'} size={20} />
            </button>
          )}
          {mode === 'favorites' && (
            <button type="button" className="link-button" onClick={() => setMode('date')}>
              日付で探す
            </button>
          )}
        </div>

        {mode === 'search' && (
          <div className="search">
            <Icon name="search" size={18} />
            <input
              ref={searchRef}
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="イベント名・会場・内容で検索"
              aria-label="キーワード検索"
              enterKeyHint="search"
            />
          </div>
        )}

        {mode !== 'favorites' && !(mode === 'search' && kw) && (
          <DateStrip days={days} selected={selectedDate} onSelect={selectDate} hasEvents={dateHasEvents} />
        )}

        {mode !== 'favorites' && <FilterBar filters={filters} onChange={setFilters} />}

        <div className="panel__list" ref={listRef}>
          {items.map(({ event, venue, date }) => (
            <EventCard
              key={event.id}
              ref={(node) => {
                if (node) cardRefs.current.set(event.id, node);
                else cardRefs.current.delete(event.id);
              }}
              event={event}
              venue={venue}
              date={date}
              expanded={event.id === activeEventId}
              favorite={favorites.has(event.id)}
              onToggleFavorite={() => toggleFavorite(event.id)}
              onActivate={() => {
                setActiveEventId(event.id);
                if (isMobile && sheet === 'full') setSheet('peek');
              }}
              onShare={onShare}
              showDateLabel={Boolean(isListAcrossDates)}
            />
          ))}

          {items.length === 0 && (
            <div className="empty">
              {mode === 'favorites' ? (
                <p>お気に入りはまだありません。イベントのハートを押すと、ここに集まります。</p>
              ) : mode === 'search' && kw ? (
                <p>「{kw}」に合うイベントは見つかりませんでした。</p>
              ) : (
                <>
                  <p>この日のイベントは見つかりませんでした。</p>
                  {nextEventDay && (
                    <button type="button" className="btn btn--primary" onClick={() => selectDate(nextEventDay)}>
                      次にイベントがある日（{formatLong(nextEventDay)}）へ
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          <footer className="panel__foot">
            <p>
              掲載情報は公式の告知をもとにしています（{lastVerified.replaceAll('-', '/')} 確認）。
              お出かけ前に各公式サイトで最新情報をご確認ください。
            </p>
          </footer>
        </div>
      </main>

      <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)} sources={dataSources} lastVerified={lastVerified} />

      <div className={`toast${toast ? ' toast--show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
