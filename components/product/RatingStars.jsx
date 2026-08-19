'use client';

export default function RatingStars({ rating = 0, count }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1 text-sm">
      {stars.map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}>
          ★
        </span>
      ))}
      {typeof count === 'number' && <span className="ml-1 text-gray-500">({count})</span>}
    </div>
  );
}
