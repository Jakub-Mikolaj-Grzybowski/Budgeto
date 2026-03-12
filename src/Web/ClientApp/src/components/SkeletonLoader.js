
export function SkeletonLoader({ rows = 5 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-shimmer skeleton-text-wide" />
          <div className="skeleton-shimmer skeleton-text-short" />
        </div>
      ))}
    </div>
  );
}
