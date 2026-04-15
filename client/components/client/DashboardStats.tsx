'use client';

import { useGetClientDashboardStatsQuery } from '@/store/api/clientApi';
import { FileCheck, FileText, Scale } from 'lucide-react';

const statConfig = [
  { key: 'totalCases', label: 'Total Cases Opened', icon: <FileText className="w-7 h-7" strokeWidth={1.8} /> },
  { key: 'activeCases', label: 'Active Cases', icon: <Scale className="w-7 h-7" strokeWidth={1.8} /> },
  { key: 'closedCases', label: 'Closed Cases', icon: <FileCheck className="w-7 h-7" strokeWidth={1.8} /> },
] as const;

export default function DashboardStats() {
  const { data: stats, isLoading } = useGetClientDashboardStatsQuery();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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
              {isLoading ? '...' : (stats?.[key] ?? 0)}
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
