import { useState } from 'react';
import Icon from './Icon.jsx';
import { FILTER_DEFS, DEFAULT_FILTERS, activeFilterCount } from '../lib/filter.js';

export default function FilterBar({ filters, onChange }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const changed = activeFilterCount(filters);

  return (
    <div className="filters">
      <div className="filters__row">
        <button
          type="button"
          className="filters__help-toggle"
          aria-expanded={helpOpen}
          aria-controls="filter-help"
          onClick={() => setHelpOpen((v) => !v)}
        >
          <Icon name="sliders" size={18} />
          <span>絞り込み条件</span>
          {changed > 0 && <span className="filters__badge">{changed}</span>}
        </button>
        <div className="filters__chips">
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
      </div>
      {helpOpen && (
        <div className="filters__help" id="filter-help">
          <ul>
            {FILTER_DEFS.map((f) => (
              <li key={f.key}>
                <strong>{f.label}</strong>
                <span>{f.help}</span>
              </li>
            ))}
          </ul>
          {changed > 0 && (
            <button type="button" className="link-button" onClick={() => onChange({ ...DEFAULT_FILTERS })}>
              条件をリセット
            </button>
          )}
        </div>
      )}
    </div>
  );
}
