'use client';

import { useState } from 'react';
import CaseUpdateModal from './CaseUpdateModal';
import {
  useGetCaseUpdatesQuery,
  useUpdateCaseUpdateMutation,
  useDeleteCaseUpdateMutation,
} from '@/store/api/advocateApi';
import type { CaseUpdate, CreateCaseUpdateDto } from '@/store/api/advocateApi';

interface Props {
  caseId: string;
  caseStatus: string;
}

function EditUpdateForm({
  update,
  onSave,
  onCancel,
}: {
  update: CaseUpdate;
  onSave: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(update.title);
  const [description, setDescription] = useState(update.description);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) return;
    setSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B0000]"
        style={{ fontFamily: 'Georgia, serif' }}
        placeholder="Update title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#8B0000] resize-none"
        style={{ fontFamily: 'Georgia, serif' }}
        placeholder="Update description"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-60 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function CaseUpdates({ caseId, caseStatus }: Props) {
  const { data: updates } = useGetCaseUpdatesQuery(caseId);
  const [updateCaseUpdate] = useUpdateCaseUpdateMutation();
  const [deleteCaseUpdate, { isLoading: isDeleting }] = useDeleteCaseUpdateMutation();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<CaseUpdate | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isOpen = caseStatus === 'OPEN';

  const handleDelete = async (updateId: string) => {
    if (confirmDeleteId !== updateId) {
      setConfirmDeleteId(updateId);
      return;
    }
    await deleteCaseUpdate({ caseId, updateId });
    setConfirmDeleteId(null);
  };

  const sorted = [...(updates ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <>
      {showUpdateModal && (
        <CaseUpdateModal caseId={caseId} onClose={() => setShowUpdateModal(false)} />
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            Case Updates
          </h2>
          {isOpen && (
            <button
              onClick={() => setShowUpdateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Update
            </button>
          )}
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

                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
                    {update.title}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                      {new Date(update.createdAt).toLocaleDateString('en-KE', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>

                    {isOpen && editingUpdate?.id !== update.id && (
                      <>
                        {/* Edit button */}
                        <button
                          onClick={() => { setConfirmDeleteId(null); setEditingUpdate(update); }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#8B0000] hover:bg-red-50 transition-colors"
                          title="Edit update"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Delete / Confirm delete */}
                        <button
                          onClick={() => handleDelete(String(update.id))}
                          disabled={isDeleting && confirmDeleteId === String(update.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all disabled:opacity-60 ${
                            confirmDeleteId === String(update.id)
                              ? 'bg-red-600 text-white'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600'
                          }`}
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          {confirmDeleteId === String(update.id) ? 'Confirm Delete' : 'Delete'}
                        </button>

                        {confirmDeleteId === String(update.id) && (
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 rounded-lg text-xs text-gray-400 hover:text-gray-600 transition-colors"
                            style={{ fontFamily: 'Georgia, serif' }}
                          >
                            Cancel
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Body — edit form or read view */}
                {editingUpdate?.id === update.id ? (
                  <EditUpdateForm
                    update={update}
                    onSave={async (formData) => {
                      await updateCaseUpdate({ caseId, updateId: String(update.id), formData });
                      setEditingUpdate(null);
                    }}
                    onCancel={() => setEditingUpdate(null)}
                  />
                ) : (
                  <>
                    <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                      {update.description}
                    </p>
                    {update.documents.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {update.documents.map((doc) => (
                          <a
                            key={doc.id}
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border hover:opacity-70 transition-opacity"
                            style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {doc.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}