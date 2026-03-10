'use client';

import { useState } from 'react';
import { useGetReceivedRequestsQuery, useUpdateRequestStatusMutation, ReceivedRequest } from '@/store/api/advocateApi';

const statusBadge: Record<ReceivedRequest['status'], { label: string; classes: string }> = {
  PENDING: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ACCEPTED: { label: 'Accepted', classes: 'bg-green-50 text-green-700 border-green-200' },
  REJECTED: { label: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-200' },
};

function RequestCard({ request }: { request: ReceivedRequest }) {
  const [updateStatus, { isLoading }] = useUpdateRequestStatusMutation();
  const [confirmAction, setConfirmAction] = useState<'ACCEPTED' | 'REJECTED' | null>(null);

  const handleAction = async (status: 'ACCEPTED' | 'REJECTED') => {
    if (confirmAction !== status) {
      setConfirmAction(status);
      return;
    }
    await updateStatus({ requestId: request.id, status });
    setConfirmAction(null);
  };

  const badge = statusBadge[request.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
      {/* Left — request info */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
              {request.client.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
              {new Date(request.requestedAt).toLocaleDateString('en-KE', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${badge.classes}`} style={{ fontFamily: 'Georgia, serif' }}>
            {badge.label}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-28" style={{ fontFamily: 'Georgia, serif' }}>Role</span>
            <span className="text-sm text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{request.partyRole}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-28 pt-0.5" style={{ fontFamily: 'Georgia, serif' }}>Case Description</span>
            <span className="text-sm text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'Georgia, serif' }}>{request.caseDescription}</span>
          </div>
        </div>
      </div>

      {/* Right — action buttons, only show if pending */}
      {request.status === 'PENDING' && (
        <div className="flex sm:flex-col gap-3 sm:justify-center shrink-0">
          <button
            onClick={() => handleAction('ACCEPTED')}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
              confirmAction === 'ACCEPTED'
                ? 'bg-green-600 text-white scale-105'
                : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-600 hover:text-white hover:border-green-600'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {confirmAction === 'ACCEPTED' ? 'Confirm Accept' : 'Accept'}
          </button>
          <button
            onClick={() => handleAction('REJECTED')}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
              confirmAction === 'REJECTED'
                ? 'bg-red-600 text-white scale-105'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {confirmAction === 'REJECTED' ? 'Confirm Reject' : 'Reject'}
          </button>
          {confirmAction && (
            <button
              onClick={() => setConfirmAction(null)}
              className="px-5 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 transition-colors"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReceivedRequestsList() {
  const { data: requests, isLoading, isError } = useGetReceivedRequestsQuery();

  if (isLoading) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      Loading requests...
    </div>
  );

  if (isError) return (
    <div className="text-center py-20 text-red-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      Failed to load requests.
    </div>
  );

  if (!requests || requests.length === 0) return (
    <div className="text-center py-20 text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      No representation requests received yet.
    </div>
  );

  const pending = requests.filter((r) => r.status === 'PENDING');
  const resolved = requests.filter((r) => r.status !== 'PENDING');

  return (
    <div className="flex flex-col gap-8">
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Pending ({pending.length})
          </h2>
          <div className="flex flex-col gap-4">
            {pending.map((r) => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Resolved ({resolved.length})
          </h2>
          <div className="flex flex-col gap-4">
            {resolved.map((r) => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>
      )}
    </div>
  );
}