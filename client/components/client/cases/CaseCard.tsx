import Link from 'next/link';
import { LegalCase } from '@/store/api/advocateApi';

export default function CaseCard({ legalCase }: { legalCase: LegalCase }) {
  const statusConfig = {
    OPEN: { label: 'Open', classes: 'bg-green-50 text-green-700 border-green-200' },
    CLOSED: { label: 'Closed', classes: 'bg-gray-100 text-gray-500 border-gray-200' },
  };
  const badge = statusConfig[legalCase.status];

  const formatRole = (role: string) =>
    role.replace('_', ' / ').toLowerCase().replace(/(^\w|(?<=\/ )\w)/g, (c) => c.toUpperCase());

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            {legalCase.caseName}
          </h3>
          <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border ${badge.classes}`} style={{ fontFamily: 'Georgia, serif' }}>
            {badge.label}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Case No.</span>
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>{legalCase.caseNumber}</span>
          </div>

          {/* Advocate name instead of client name */}
          {legalCase.advocate && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Advocate</span>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>{legalCase.advocate.name}</span>
            </div>
          )}

          {/* "Your Role" instead of "Client Role" */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Your Role</span>
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
              {formatRole(legalCase.clientRole)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Launched</span>
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
              {new Date(legalCase.dateLaunched).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <Link
        href={`/client/cases/${legalCase.id}`}
        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
      >
        View
      </Link>
    </div>
  );
}