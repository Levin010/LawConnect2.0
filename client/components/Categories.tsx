'use client';

import { useState } from 'react';

const categories = [
  'General Practice',
  'Corporate Law',
  'Criminal Defense',
  'Immigration Law',
  'Family Law',
  'Finance Law',
  'Environment Law',
  'Entertainment Law',
];

const VISIBLE_COUNT = 3;

export default function Categories() {
  const [startIndex, setStartIndex] = useState(0);

  const maxIndex = categories.length - VISIBLE_COUNT;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const visible = categories.slice(startIndex, startIndex + VISIBLE_COUNT);

  return (
    <section className="py-16 px-6 bg-white">
      <h2
        className="text-3xl font-bold text-center mb-10"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Categories
      </h2>

      <div className="max-w-6xl mx-auto">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((category) => (
            <div
              key={category}
              className="border border-black rounded-xl p-8 text-center"
            >
              <h3
                className="text-xl font-bold mb-6"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {category}
              </h3>
              <button
                className="px-5 py-2 bg-black text-white rounded font-semibold hover:bg-gray-800 transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                View
              </button>
            </div>
          ))}
        </div>

        {/* Pagination buttons */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={handlePrev}
            disabled={startIndex === 0}
            className="w-10 h-10 bg-black text-white font-bold rounded disabled:opacity-40 hover:bg-gray-800 transition-colors"
            aria-label="Previous categories"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            disabled={startIndex === maxIndex}
            className="w-10 h-10 bg-black text-white font-bold rounded disabled:opacity-40 hover:bg-gray-800 transition-colors"
            aria-label="Next categories"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
