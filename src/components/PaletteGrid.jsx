const PALETTE_OPTIONS = [
  { key: 'forest',   label: '초록 숲',   bg: '#1b4332', color: '#d8f3dc' },
  { key: 'ocean',    label: '오션 블루', bg: '#023e8a', color: '#caf0f8' },
  { key: 'sunset',   label: '노을 석양', bg: '#7f2704', color: '#ffd7ba' },
  { key: 'blossom',  label: '벚꽃 핑크', bg: '#6d2b3d', color: '#fce4ec' },
  { key: 'lavender', label: '라벤더',   bg: '#2c1569', color: '#e8d5f5' },
  { key: 'sand',     label: '모래 여행', bg: '#5c4033', color: '#fff8e1' },
];

function PaletteGrid({ palette, onPaletteChange }) {
  return (
    <div className="card">
      <div className="card-title">배경 테마</div>
      <div className="pal-grid" role="group" aria-label="배경 테마 선택">
        {PALETTE_OPTIONS.map(({ key, label, bg, color }) => (
          <button
            key={key}
            className={`pb ${palette === key ? 'active' : ''}`}
            style={{ background: bg, color }}
            onClick={() => onPaletteChange(key)}
            aria-label={`${label} 테마`}
            aria-pressed={palette === key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PaletteGrid;
