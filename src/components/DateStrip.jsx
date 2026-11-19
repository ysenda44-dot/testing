import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { dayInfo } from '../lib/date.js';

/** 横にスクロールする日付バー。イベントがある日には点を付ける */
export default function DateStrip({ days, selected, onSelect, hasEvents }) {
  const scroller = useRef(null);

  // 選択した日が見えるようにスクロール
  useEffect(() => {
    const node = scroller.current?.querySelector(`[data-date="${selected}"]`);
    node?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [selected]);

  const scrollBy = (dir) => {
    const s = scroller.current;
    if (s) s.scrollBy({ left: dir * s.clientWidth * 0.8, behavior: 'smooth' });
  };

  const selectedInfo = dayInfo(selected);

  return (
    <div className="date-strip">
      <span className="date-strip__month" aria-hidden="true">
        {selectedInfo.month}月
      </span>
      <button type="button" className="date-strip__nav" onClick={() => scrollBy(-1)} aria-label="前の日付を表示">
        <Icon name="chevronLeft" size={18} />
      </button>
      <div className="date-strip__scroller" ref={scroller} role="group" aria-label="日付を選ぶ">
        {days.map((iso) => {
          const d = dayInfo(iso);
          const isSel = iso === selected;
          return (
            <button
              key={iso}
              type="button"
              data-date={iso}
              className={`day day--${d.tone}${isSel ? ' day--selected' : ''}${d.day === 1 ? ' day--first' : ''}`}
              aria-pressed={isSel}
              aria-label={`${d.month}月${d.day}日（${d.weekday}）${d.holiday ? ` ${d.holiday}` : ''}${
                hasEvents(iso) ? '' : ' イベントなし'
              }`}
              onClick={() => onSelect(iso)}
            >
              {d.day === 1 && <span className="day__month">{d.month}月</span>}
              <span className="day__dow">{d.holiday ? '祝' : d.weekday}</span>
              <span className="day__num">{d.day}</span>
              <span className={`day__dot${hasEvents(iso) ? ' day__dot--on' : ''}`} aria-hidden="true" />
            </button>
          );
        })}
      </div>
      <button type="button" className="date-strip__nav" onClick={() => scrollBy(1)} aria-label="次の日付を表示">
        <Icon name="chevronRight" size={18} />
      </button>
    </div>
  );
}
