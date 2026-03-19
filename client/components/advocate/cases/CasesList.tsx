'use client';

import { useGetAdvocateCasesQuery } from '@/store/api/advocateApi';
import CaseCard from './CaseCard';

export default function CasesList() {
  const { data: cases, isLoading, isError } = useGetAdvocateCasesQuery();

  if (isLoading) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Loading cases...</div>
  );
  if (isError) return (
    <div className="text-center py-20 text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Failed to load cases.</div>
  );
  if (!cases || cases.length === 0) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>No cases found.</div>
  );

  const sorted = [...(cases ?? [])].sort(
    (a, b) => new Date(b.dateLaunched).getTime() - new Date(a.dateLaunched).getTime()
  );

  const open = sorted.filter((c) => c.status === 'OPEN');
  const closed = sorted.filter((c) => c.status === 'CLOSED');

  return (
    <div className="flex flex-col gap-8">
      {open.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Open ({open.length})
          </h2>
          <div className="flex flex-col gap-4">
            {open.map((c) => <CaseCard key={c.id} legalCase={c} />)}
          </div>
        </div>
      )}
      {closed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Closed ({closed.length})
          </h2>
          <div className="flex flex-col gap-4">
            {closed.map((c) => <CaseCard key={c.id} legalCase={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}