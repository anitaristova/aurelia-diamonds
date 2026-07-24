export default function FilterPanel({ facets, selected, onToggle, onClear, hasActive }) {
  if (facets.length === 0) {
    return <p className="filters__empty">No filters available.</p>;
  }

  return (
    <div className="filters">
      <div className="filters__head">
        <span>Filters</span>
        {hasActive && (
          <button type="button" className="filters__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>
      {facets.map((facet) => (
        <div key={facet.key} className="filters__group">
          <p className="filters__group-title">{facet.label}</p>
          {facet.options.map((option) => (
            <label key={option} className="filters__option">
              <input
                type="checkbox"
                checked={selected[facet.key]?.includes(option) || false}
                onChange={() => onToggle(facet.key, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
