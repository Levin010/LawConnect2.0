'use client';

import { useGetSentRequestsQuery, SentRequest } from '@/store/api/clientApi';

const statusConfig: Record<SentRequest['status'], { label: string; classes: string }> = {
  PENDING: { label: 'Pending', classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  ACCEPTED: { label: 'Accepted', classes: 'bg-green-50 text-green-700 border-green-200' },
  REJECTED: { label: 'Rejected', classes: 'bg-red-50 text-red-700 border-red-200' },
};

function RequestCard({ request }: { request: SentRequest }) {
  const badge = statusConfig[request.status];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
              {request.advocate.name}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
              @{request.advocate.username}
            </p>
          </div>
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${badge.classes}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {badge.label}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32" style={{ fontFamily: 'Georgia, serif' }}>
              Your Name
            </span>
            <span className="text-sm text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
              {request.firstName} {request.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32" style={{ fontFamily: 'Georgia, serif' }}>
              Party Role
            </span>
            <span className="text-sm text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
              {request.partyRole.replace('_', ' / ')}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32 pt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
              Case Description
            </span>
            <span className="text-sm text-gray-600 leading-relaxed flex-1" style={{ fontFamily: 'Georgia, serif' }}>
              {request.caseDescription}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32" style={{ fontFamily: 'Georgia, serif' }}>
              Date Sent
            </span>
            <span className="text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
              {new Date(request.requestedAt).toLocaleDateString('en-KE', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SentRequestsList() {
  const { data: requests, isLoading, isError } = useGetSentRequestsQuery();

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
      You have not sent any representation requests yet.
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