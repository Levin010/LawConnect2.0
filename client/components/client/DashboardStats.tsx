'use client';

import { useGetClientDashboardStatsQuery } from '@/store/api/clientApi';

const statConfig = [
  { key: 'totalCases', label: 'Total Cases Opened', icon: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )},
  { key: 'activeCases', label: 'Active Cases', icon: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  )},
  { key: 'closedCases', label: 'Closed Cases', icon: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )},
] as const;

export default function DashboardStats() {
  const { data: stats, isLoading } = useGetClientDashboardStatsQuery();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statConfig.map(({ key, label, icon }) => (
        <div
          key={key}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{icon}</span>
            <span
              className="text-3xl font-bold"
              style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
            >
              {isLoading ? '—' : (stats?.[key] ?? 0)}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Georgia, serif' }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}