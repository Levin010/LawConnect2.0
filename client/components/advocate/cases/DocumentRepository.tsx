'use client';

import { useGetCaseUpdatesQuery } from '@/store/api/advocateApi';

export default function DocumentRepository({ caseId }: { caseId: string }) {
  const { data: updates, isLoading } = useGetCaseUpdatesQuery(caseId);

  const allDocuments = updates?.flatMap((update) =>
    update.documents.map((doc) => ({ ...doc, updateTitle: update.title, updatedAt: update.createdAt }))
  ) ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col" style={{ height: '420px' }}>
      <div className="px-6 py-4 border-b border-gray-100 shrink-0">
        <h3 className="text-sm font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
          Document Repository
        </h3>
        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
          All documents uploaded for this case.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {isLoading && (
          <p className="text-sm text-gray-400 text-center py-8" style={{ fontFamily: 'Georgia, serif' }}>Loading documents...</p>
        )}
        {!isLoading && allDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>No documents uploaded yet.</p>
          </div>
        )}
        {!isLoading && allDocuments.length > 0 && (
          <ul className="flex flex-col gap-3">
            {allDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#8B000015' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#8B0000' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate" style={{ fontFamily: 'Georgia, serif' }}>{doc.fileName}</p>
                    <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                      {doc.updateTitle} · {new Date(doc.updatedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 ml-3 text-xs font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}