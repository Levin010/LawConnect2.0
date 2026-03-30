'use client';

import { useState } from 'react';
import { useGetCaseUpdatesQuery } from '@/store/api/advocateApi';
import type { CaseUpdate } from '@/store/api/advocateApi';
import ViewUpdateModal from './ViewUpdateModal';

export default function CaseUpdates({ caseId }: { caseId: string }) {
  const { data: updates } = useGetCaseUpdatesQuery(caseId);
  const [viewingUpdate, setViewingUpdate] = useState<CaseUpdate | null>(null);

  const sorted = [...(updates ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      {viewingUpdate && (
        <ViewUpdateModal update={viewingUpdate} onClose={() => setViewingUpdate(null)} />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            Case Updates
          </h2>
        </div>

        {sorted.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-12 text-center text-gray-400 text-sm"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            No updates yet for this case.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sorted.map((update) => (
              <div key={update.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
                    {update.title}
                  </h3>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                      {new Date(update.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => setViewingUpdate(update)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold border-2 hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Preview — truncated */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2" style={{ fontFamily: 'Georgia, serif' }}>
                  {update.description}
                </p>

                {update.documents.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {update.documents.length} attachment{update.documents.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}