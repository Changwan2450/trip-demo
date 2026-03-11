export default function RatingStars({ value = 0, size = 14, interactive = false, onChange }) {
  return (
    <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }} aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        interactive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              margin: 0,
              cursor: 'pointer',
              color: star <= value ? '#F59E0B' : '#D1D5DB',
              fontSize: `${size}px`,
              lineHeight: 1,
            }}
            aria-label={`${star}점 선택`}
          >
            ★
          </button>
        ) : (
          <span key={star} style={{ color: star <= value ? '#F59E0B' : '#D1D5DB', fontSize: `${size}px`, lineHeight: 1 }}>
            ★
          </span>
        )
      ))}
    </span>
  );
}
