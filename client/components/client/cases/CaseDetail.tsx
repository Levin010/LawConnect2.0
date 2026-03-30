'use client';

import { useGetCaseByIdQuery } from '@/store/api/clientApi';
import DocumentRepository from '@/components/advocate/cases/DocumentRepository';
import CaseUpdates from './CaseUpdates';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function CaseDetail({ caseId }: { caseId: string }) {
    console.log('CaseDetail caseId:', caseId);
  const { data: legalCase, isLoading, isError } = useGetCaseByIdQuery(caseId);
  const router = useRouter();

  if (isLoading) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Loading case...</div>
  );
  if (isError || !legalCase) return (
    <div className="text-center py-20 text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Failed to load case.</div>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — case details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
                {legalCase.caseName}
              </h2>
              <span
                className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                  legalCase.status === 'OPEN'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {legalCase.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Case Number', value: legalCase.caseNumber },
              { label: 'Advocate', value: legalCase.advocate?.name ?? 'Not assigned' },
              { label: 'Your Role', value: legalCase.clientRole.replace('_', ' / ') },
              {
                label: 'Date Launched',
                value: new Date(legalCase.dateLaunched).toLocaleDateString('en-KE', {
                  day: 'numeric', month: 'short', year: 'numeric',
                }),
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>{label}</span>
                <p className="text-sm text-gray-700 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>{value}</p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Case Description</span>
              <p className="text-sm text-gray-600 mt-0.5 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{legalCase.caseDescription}</p>
            </div>
          </div>

          {/* Actions — chat only */}
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            {legalCase.advocate && (
              <button
                onClick={() => router.push(`/client/chat/${legalCase.advocate!.id}?name=${encodeURIComponent(legalCase.advocate!.name)}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Advocate
              </button>
            )}
          </div>
        </div>

        {/* Right — document repository */}
        <DocumentRepository caseId={caseId} />
      </div>

      {/* Bottom — case updates (read-only) */}
      <CaseUpdates caseId={caseId} />
    </div>
  );
}