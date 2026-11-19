import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { categories, dataSources, site } from './config.js';
import { addDays, dayInfo, formatHeading, formatLong } from './lib/date.js';
import { DEFAULT_FILTERS, activeFilterCount, isOnDate, nextDate, passesFilters } from './lib/filter.js';
import { matchesKeyword } from './lib/search.js';
import { compareItems, displayDate, eventStatus, jstClock } from './lib/status.js';
import { eventPageUrl } from './lib/links.js';
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

export default function App() {
  // 現在時刻（日本時間）。1分ごとと、画面に戻ってきたときに更新する
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = () => setNow(new Date());
    const timer = window.setInterval(tick, 60_000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);
  const { date: today, minutes: nowMinutes } = jstClock(now);

  const days = useMemo(
    () => Array.from({ length: site.dateStripDays }, (_, i) => addDays(today, i)),
    [today],
  );
  const lastDay = days[days.length - 1];
  const [initial] = useState(() => readUrlState(today, lastDay));

  const [selectedDate, setSelectedDate] = useState(() => {
    if (initial.date) return initial.date;
    if (initial.event) {
      const ev = events.find((x) => x.id === initial.event);
      const next = nextDate(ev, today);
      if (next && next <= lastDay) return next;
    }
    return today;
  });
  // upcoming: これからの一覧（初期表示） / date: 日付ごと / search / favorites
  const [mode, setMode] = useState(initial.date || initial.event ? 'date' : 'upcoming');
  const backMode = useRef('upcoming'); // 検索・お気に入りを閉じたときに戻る先
  const [keyword, setKeyword] = useState('');
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [activeEventId, setActiveEventId] = useState(initial.event);
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

  const kw = keyword.trim();

  // これから開催される催し（1件につき次の回を1つ）。絞り込み前
  const upcomingAll = useMemo(() => {
    const clock = { date: today, minutes: nowMinutes };
    return events
      .map((e) => [e, displayDate(e, clock)])
      .filter(([, d]) => d && d <= lastDay)
      .map(([e, d]) => ({ event: e, venue: venues[e.venueId], date: d, status: eventStatus(e, d, clock) }))
      .sort(compareItems);
  }, [today, nowMinutes, lastDay]);

  // 表示するイベントの一覧
  const items = useMemo(() => {
    if (mode === 'favorites') return upcomingAll.filter((x) => favorites.has(x.event.id));
    if (mode === 'date') {
      const clock = { date: today, minutes: nowMinutes };
      return events
        .filter((e) => isOnDate(e, selectedDate) && passesFilters(e, filters))
        .map((e) => ({
          event: e,
          venue: venues[e.venueId],
          date: selectedDate,
          status: eventStatus(e, selectedDate, clock),
        }))
        .sort(compareItems);
    }
    return upcomingAll.filter(
      (x) => passesFilters(x.event, filters) && (mode !== 'search' || matchesKeyword(x.event, x.venue, kw, today)),
    );
  }, [mode, kw, filters, favorites, selectedDate, today, nowMinutes, upcomingAll]);

  // 検索で、絞り込み条件のために隠れている件数
  const hiddenByFilters = useMemo(() => {
    if (mode !== 'search' || !kw) return 0;
    return upcomingAll.filter((x) => matchesKeyword(x.event, x.venue, kw, today)).length - items.length;
  }, [mode, kw, upcomingAll, items, today]);

  // 検索の入口に出すカテゴリ（これからの催しがあるものだけ）
  const searchCategories = useMemo(
    () => Object.entries(categories).filter(([key]) => upcomingAll.some((x) => x.event.category === key)),
    [upcomingAll],
  );

  const listKey = items.map((x) => x.event.id).join(',');

  // 一覧が変わったとき：開いていた催しがなくなったら閉じる。1件だけなら開いておく
  useEffect(() => {
    if (!items.some((x) => x.event.id === activeEventId)) {
      setActiveEventId(items.length === 1 ? items[0].event.id : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);

  const activeVenueId = items.find((x) => x.event.id === activeEventId)?.event.venueId ?? null;

  // カードを開いたら、その先頭が見える位置までスクロールする
  useEffect(() => {
    if (!activeEventId) return undefined;
    const frame = requestAnimationFrame(() => {
      const list = listRef.current;
      const node = cardRefs.current.get(activeEventId);
      if (!list || !node) return;
      const top = list.scrollTop + node.getBoundingClientRect().top - list.getBoundingClientRect().top - 8;
      list.scrollTo({ top, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [activeEventId, listKey]);

  // 地図のピン（会場ごとにまとめる）
  const markers = useMemo(() => {
    const map = new Map();
    for (const { event, venue } of items) {
      const m = map.get(event.venueId);
      if (m) m.count += 1;
      else map.set(event.venueId, { venueId: event.venueId, venue, count: 1, category: event.category });
    }
    return [...map.values()];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listKey]);

  // URLに状態を残す（共有・再読み込み用）。日付は「日付ごと」の表示のときだけ
  useEffect(() => {
    const url = new URL(window.location.href);
    if (mode === 'date') url.searchParams.set('d', selectedDate);
    else url.searchParams.delete('d');
    if (activeEventId) url.searchParams.set('e', activeEventId);
    else url.searchParams.delete('e');
    window.history.replaceState(null, '', url);
  }, [mode, selectedDate, activeEventId]);

  const toastTimer = useRef(0);
  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2400);
  }, []);

  const onSelectVenue = useCallback(
    (venueId) => {
      const first = items.find((x) => x.event.venueId === venueId);
      if (first) setActiveEventId(first.event.id);
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

  const selectUpcoming = () => {
    setMode('upcoming');
    setKeyword('');
    listRef.current?.scrollTo({ top: 0 });
  };

  const leaveTo = () => (backMode.current === 'date' ? 'date' : 'upcoming');

  const toggleSearch = () => {
    if (mode === 'search') {
      setMode(leaveTo());
      setKeyword('');
    } else {
      if (mode !== 'favorites') backMode.current = mode;
      setMode('search');
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  };

  const toggleFavorites = () => {
    if (mode === 'favorites') {
      setMode(leaveTo());
    } else {
      if (mode !== 'search') backMode.current = mode;
      setKeyword('');
      setMode('favorites');
    }
  };

  const resetFilters = () => setFilters({ ...DEFAULT_FILTERS });

  const nextEventDay = useMemo(
    () => days.find((d) => d > selectedDate && events.some((e) => isOnDate(e, d) && passesFilters(e, filters))),
    [days, selectedDate, filters],
  );

  const lastVerified = useMemo(() => events.map((e) => e.verifiedAt).sort().at(-1), []);

  const sel = dayInfo(selectedDate);
  let heading;
  if (mode === 'favorites') heading = 'お気に入り';
  else if (mode === 'search') heading = kw ? `「${kw}」の検索結果` : 'キーワードで探す';
  else if (mode === 'date') heading = `${sel.month}月${sel.day}日のイベント`;
  else heading = 'これからのイベント';

  const acrossDates = mode !== 'date';
  const filtersChanged = activeFilterCount(filters) > 0;

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
            onClick={toggleFavorites}
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
            <button type="button" className="link-button" onClick={toggleFavorites}>
              一覧に戻る
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
              placeholder="例：こども、無料、12月、展示"
              aria-label="キーワード検索"
              enterKeyHint="search"
            />
          </div>
        )}

        {mode === 'search' && (
          <div className="search-cats" role="group" aria-label="カテゴリから探す">
            {searchCategories.map(([key, cat]) => (
              <button
                key={key}
                type="button"
                className={`chip${kw === cat.label ? ' chip--on' : ''}`}
                aria-pressed={kw === cat.label}
                onClick={() => setKeyword(kw === cat.label ? '' : cat.label)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {(mode === 'upcoming' || mode === 'date') && (
          <DateStrip
            days={days}
            selected={mode === 'date' ? selectedDate : null}
            onSelect={selectDate}
            hasEvents={dateHasEvents}
            upcomingSelected={mode === 'upcoming'}
            onSelectUpcoming={selectUpcoming}
          />
        )}

        {mode !== 'favorites' && <FilterBar filters={filters} onChange={setFilters} />}

        <div className="panel__list" ref={listRef}>
          {items.map(({ event, venue, date, status }, i) => (
            <Fragment key={event.id}>
              {acrossDates && (i === 0 || items[i - 1].date !== date) && (
                <h3 className="day-head">{formatHeading(date, today)}</h3>
              )}
            <EventCard
              ref={(node) => {
                if (node) cardRefs.current.set(event.id, node);
                else cardRefs.current.delete(event.id);
              }}
              event={event}
              venue={venue}
              date={date}
              status={status}
              expanded={event.id === activeEventId}
              favorite={favorites.has(event.id)}
              onToggleFavorite={() => toggleFavorite(event.id)}
              onActivate={() => setActiveEventId(event.id === activeEventId ? null : event.id)}
              onShare={onShare}
            />
            </Fragment>
          ))}

          {mode === 'search' && hiddenByFilters > 0 && (
            <p className="hint">
              絞り込み条件のため、ほかに{hiddenByFilters}件が隠れています。
              <button type="button" className="link-button" onClick={resetFilters}>
                条件をリセット
              </button>
            </p>
          )}

          {items.length === 0 && (
            <div className="empty">
              {mode === 'favorites' ? (
                <p>お気に入りはまだありません。イベントのハートを押すと、ここに集まります。</p>
              ) : mode === 'search' ? (
                <p>
                  {kw ? `「${kw}」に合うイベントは見つかりませんでした。` : '条件に合うイベントはありません。'}
                  {hiddenByFilters === 0 && kw && '上のカテゴリからも探せます。'}
                </p>
              ) : mode === 'date' ? (
                <>
                  <p>この日のイベントは見つかりませんでした。</p>
                  {nextEventDay && (
                    <button type="button" className="btn btn--primary" onClick={() => selectDate(nextEventDay)}>
                      次にイベントがある日（{formatLong(nextEventDay)}）へ
                    </button>
                  )}
                  <button type="button" className="btn" onClick={selectUpcoming}>
                    これからのイベントを見る
                  </button>
                </>
              ) : (
                <>
                  <p>条件に合うイベントはありません。</p>
                  {filtersChanged && (
                    <button type="button" className="btn btn--primary" onClick={resetFilters}>
                      条件をリセット
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
