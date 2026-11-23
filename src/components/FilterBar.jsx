import { FILTER_DEFS, DEFAULT_FILTERS, activeFilterCount } from '../lib/filter.js';

/** 絞り込み条件。どれも「ONにすると、その条件で絞る」 */
export default function FilterBar({ filters, onChange }) {
  const changed = activeFilterCount(filters);
  return (
    <div className="filters" id="filters">
      <div className="filters__chips" role="group" aria-label="絞り込み条件">
        {FILTER_DEFS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`chip${filters[f.key] ? ' chip--on' : ''}`}
            aria-pressed={filters[f.key]}
            title={f.help}
            onClick={() => onChange({ ...filters, [f.key]: !filters[f.key] })}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="filters__note">
        料金や屋内・屋外が公式情報に書かれていない催しは、「無料」「屋内」で絞ると外れます。
        {changed > 0 && (
          <button type="button" className="link-button" onClick={() => onChange({ ...DEFAULT_FILTERS })}>
            条件をリセット
          </button>
        )}
      </p>
    </div>
  );
}
