import Select from 'react-select';

const CHIP_THRESHOLD = 8;

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: 'var(--bg-input)',
    borderColor: state.isFocused ? 'var(--accent-blue)' : 'var(--border-color)',
    borderRadius: 8,
    boxShadow: state.isFocused ? '0 0 0 2px rgba(99,102,241,0.2)' : 'none',
    minHeight: 40,
    '&:hover': { borderColor: 'var(--accent-blue)' },
  }),
  menu: (base) => ({
    ...base,
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? 'var(--accent-blue)'
      : state.isFocused
      ? 'var(--bg-input)'
      : 'transparent',
    color: state.isSelected ? '#fff' : 'var(--text-primary)',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({ ...base, color: 'var(--text-primary)' }),
  input: (base) => ({ ...base, color: 'var(--text-primary)' }),
  placeholder: (base) => ({ ...base, color: 'var(--text-muted)' }),
  indicatorSeparator: () => ({ display: 'none' }),
};

export function CategoryChipSelector({ categories, selectedCategory, onSelect, size }) {
  if (categories.length > CHIP_THRESHOLD) {
    const options = categories.map(c => ({ value: c.id, label: c.name }));
    const value = options.find(o => o.value === selectedCategory) || null;
    return (
      <Select
        options={options}
        value={value}
        onChange={opt => onSelect(opt ? opt.value : null)}
        placeholder="Wybierz kategorię..."
        styles={selectStyles}
        noOptionsMessage={() => 'Brak kategorii'}
      />
    );
  }

  return (
    <div className={`chip-grid ${size === 'large' ? 'chip-grid-large' : ''}`}>
      {categories.map(c => (
        <button
          key={c.id}
          type="button"
          className={`category-chip ${selectedCategory === c.id ? 'category-chip-selected' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
