'use client';

import { useGetAdvocateReviewsQuery } from '@/store/api/clientApi';

interface Props {
  advocateUsername: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className="text-lg" style={{ color: s <= rating ? '#8B0000' : '#D1D5DB' }}>★</span>
    ))}
  </div>
);

export default function ReviewsList({ advocateUsername }: Props) {
  const { data: reviews, isLoading } = useGetAdvocateReviewsQuery(advocateUsername);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        Reviews
      </h2>

      {isLoading && (
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Loading reviews...</p>
      )}

      {!isLoading && (!reviews || reviews.length === 0) && (
        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          No reviews yet for this advocate.
        </p>
      )}

      {!isLoading && reviews && reviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-sm" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
                    {review.clientName}
                  </p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                    {new Date(review.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}