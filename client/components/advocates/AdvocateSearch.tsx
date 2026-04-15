'use client';

import { useEffect, useState } from 'react';
import { useGetAdvocatesQuery } from '@/store/api/advocateApi';
import AdvocateCard from './AdvocateCard';

const CATEGORIES = [
  'All Categories',
  'General Practice',
  'Corporate Law',
  'Criminal Defense',
  'Immigration Law',
  'Family Law',
  'Finance Law',
  'Environment Law',
  'Entertainment Law',
  'Land Law',
];

const COUNTIES = [
  'All Counties',
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
];

interface AdvocateSearchProps {
  initialCategory?: string;
}

export default function AdvocateSearch({
  initialCategory = '',
}: AdvocateSearchProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [county, setCounty] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data: advocates, isLoading, isError } = useGetAdvocatesQuery({
    search: debouncedSearch || undefined,
    category: category || undefined,
    county: county || undefined,
  });

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white
    focus:outline-none focus:border-red-800 transition-colors
  `;

  return (
    <>
      {/* Search controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-10">
        <input
          type="text"
          placeholder="Search by name, category, or county"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClass} md:flex-1`}
          style={{ fontFamily: 'Georgia, serif' }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value === 'All Categories' ? '' : e.target.value)}
          className={`${inputClass} md:w-56`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>
          ))}
        </select>
        <select
          value={county}
          onChange={(e) => setCounty(e.target.value === 'All Counties' ? '' : e.target.value)}
          className={`${inputClass} md:w-56`}
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {COUNTIES.map((c) => (
            <option key={c} value={c === 'All Counties' ? '' : c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-20 text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
          Loading advocates...
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-red-500" style={{ fontFamily: 'Georgia, serif' }}>
          Failed to load advocates. Please try again.
        </div>
      )}

      {!isLoading && !isError && advocates?.length === 0 && (
        <div className="text-center py-20 text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
          No advocates found matching your search.
        </div>
      )}

      {!isLoading && !isError && advocates && advocates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advocates.map((advocate) => (
            <AdvocateCard key={advocate.username} advocate={advocate} />
          ))}
        </div>
      )}
    </>
  );
}
