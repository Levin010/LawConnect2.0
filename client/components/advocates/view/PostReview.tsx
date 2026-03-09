'use client';

import { useState } from 'react';
import { usePostReviewMutation } from '@/store/api/clientApi';

interface Props {
  advocateUsername: string;
}

export default function PostReview({ advocateUsername }: Props) {
  const [postReview, { isLoading }] = usePostReviewMutation();
  const [form, setForm] = useState({ rating: '', comment: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!form.rating || !form.comment) {
      setErrorMessage('Both rating and comment are required.');
      return;
    }

    try {
      await postReview({
        advocateUsername,
        rating: parseInt(form.rating),
        comment: form.comment,
      }).unwrap();
      setSuccessMessage('Review posted successfully.');
      setForm({ rating: '', comment: '' });
    } catch {
      setErrorMessage('Failed to post review. Please try again.');
    }
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl border border-white/20 text-sm bg-white/10 text-white
    placeholder-white/50 focus:outline-none focus:border-white/50 transition-all
  `;

  return (
    <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: '#8B0000' }}>
      <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        Post a Review
      </h2>

      {successMessage && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/20 border border-green-400 text-green-200 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-black/20 border border-white/20 text-white/80 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Rating</label>
          <select name="rating" value={form.rating} onChange={handleChange} className={inputClass} style={{ fontFamily: 'Georgia, serif' }}>
            <option value="" disabled>Select rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5 - r)} ({r}/5)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Comment</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleChange}
            placeholder="Share your experience..."
            rows={4}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Posting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}