'use client';

import { useState } from 'react';
import EditCaseModal from './EditCaseModal';
import { useGetCaseByIdQuery, useGetCaseUpdatesQuery, useCloseCaseMutation, useReopenCaseMutation } from '@/store/api/advocateApi';
import CaseUpdateModal from './CaseUpdateModal';
import DocumentRepository from './DocumentRepository';
import CaseUpdates from './CaseUpdates';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { buildFullName } from '@/lib/user';

export default function CaseDetail({ caseId }: { caseId: string }) {
  const { data: legalCase, isLoading, isError } = useGetCaseByIdQuery(caseId);
  const { data: updates } = useGetCaseUpdatesQuery(caseId);
  const [closeCase, { isLoading: isClosing }] = useCloseCaseMutation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reopenCase, { isLoading: isReopening }] = useReopenCaseMutation();
  const router = useRouter();
  const myUserId = useSelector((state: RootState) => state.auth.userId);

  if (isLoading) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Loading case...</div>
  );
  if (isError || !legalCase) return (
    <div className="text-center py-20 text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>Failed to load case.</div>
  );

  const handleClose = async () => {
    if (!confirmClose) { setConfirmClose(true); return; }
    await closeCase(caseId);
    setConfirmClose(false);
  };

  return (
    <>
      {showUpdateModal && (
        <CaseUpdateModal caseId={caseId} onClose={() => setShowUpdateModal(false)} />
      )}

      {showEditModal && (
        <EditCaseModal legalCase={legalCase} onClose={() => setShowEditModal(false)} />
        )}

      <div className="flex flex-col gap-8">
        {/* Top section — case info + document repository */}
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
                <button
                    onClick={() => setShowEditModal(true)}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Case
                </button>
                </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Case Number', value: legalCase.caseNumber },
                { label: 'Client', value: legalCase.client ? buildFullName(legalCase.client) : 'No client assigned' },
                { label: 'Client Role', value: legalCase.clientRole.replace('_', ' / ') },
                { label: 'Date Launched', value: new Date(legalCase.dateLaunched).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) },
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

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            {/* Edit — always visible */}

            {legalCase.client && (
              <button
                onClick={() => router.push(`/advocate/chat/${legalCase.client!.id}?name=${encodeURIComponent(buildFullName(legalCase.client!))}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            )}

            {legalCase.status === 'OPEN' ? (
                <>
                <button
                    onClick={handleClose}
                    disabled={isClosing}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
                    confirmClose
                        ? 'bg-red-600 text-white'
                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                    }`}
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    {confirmClose ? 'Confirm Close' : 'Close Case'}
                </button>
                {confirmClose && (
                    <button
                    onClick={() => setConfirmClose(false)}
                    className="px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    style={{ fontFamily: 'Georgia, serif' }}
                    >
                    Cancel
                    </button>
                )}
                </>
            ) : (
                <button
                onClick={() => reopenCase(String(legalCase.id))}
                disabled={isReopening}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all disabled:opacity-60"
                style={{ fontFamily: 'Georgia, serif' }}
                >
                {isReopening ? 'Reopening...' : 'Reopen Case'}
                </button>
            )}
            </div>
          </div>

          {/* Right — document repository */}
          <DocumentRepository caseId={caseId} />
        </div>

        {/* Bottom — case updates */}

        <CaseUpdates caseId={caseId} caseStatus={legalCase.status} />
        
      </div>
    </>
  );
}
