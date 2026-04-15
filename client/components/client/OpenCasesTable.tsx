'use client';

import Link from 'next/link';
import { useGetClientCasesQuery } from '@/store/api/clientApi';
import { buildFullName } from '@/lib/user';

export default function OpenCasesTable() {
  const { data: cases, isLoading, isError } = useGetClientCasesQuery();
  const openCases = cases?.filter((legalCase) => legalCase.status === 'OPEN') ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold" style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}>
          Open Cases
        </h2>
      </div>

      {isLoading && (
        <div className="px-6 py-12 text-center text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          Loading cases...
        </div>
      )}

      {isError && (
        <div className="px-6 py-12 text-center text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          Failed to load cases.
        </div>
      )}

      {!isLoading && !isError && openCases.length === 0 && (
        <div className="px-6 py-12 text-center text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
          There are currently no open cases.
        </div>
      )}

      {!isLoading && !isError && openCases.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Case Name', 'Advocate', 'Date Launched', ''].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {openCases.map((c, i) => (
                <tr
                  key={c.id}
                  className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
                    <Link
                      href={`/client/cases/${c.id}`}
                      className="hover:text-[#8B0000] hover:underline transition-colors"
                    >
                      {c.caseName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                    {c.advocate ? buildFullName(c.advocate) : 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap" style={{ fontFamily: 'Georgia, serif' }}>
                    {new Date(c.dateLaunched).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/client/cases/${c.id}`}
                      className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
