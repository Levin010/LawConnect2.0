'use client';

import { useState, useRef } from 'react';
import { useCreateCaseUpdateMutation } from '@/store/api/advocateApi';

interface Props {
  caseId: string;
  onClose: () => void;
}

export default function CaseUpdateModal({ caseId, onClose }: Props) {
  const [createUpdate, { isLoading }] = useCreateCaseUpdateMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string; general?: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    files.forEach((file) => formData.append('documents', file));

    try {
      await createUpdate({ caseId, formData }).unwrap();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrors({ general: error?.data?.message || 'Failed to submit update.' });
    }
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50
    focus:outline-none focus:border-red-800 focus:bg-white transition-all
  `;
  const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>New Update</h2>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>Add a case update and optionally attach documents.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate className="p-8 flex flex-col gap-5">
          {errors.general && (
            <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
              {errors.general}
            </div>
          )}

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Update Title</label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
              placeholder="e.g. Hearing Scheduled"
              className={inputClass}
              style={{ fontFamily: 'Georgia, serif' }}
            />
            {errors.title && <p className="mt-1 text-red-400 text-xs" style={{ fontFamily: 'Georgia, serif' }}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Description</label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: undefined })); }}
              placeholder="Describe the update..."
              rows={4}
              className={`${inputClass} resize-none`}
              style={{ fontFamily: 'Georgia, serif' }}
            />
            {errors.description && <p className="mt-1 text-red-400 text-xs" style={{ fontFamily: 'Georgia, serif' }}>{errors.description}</p>}
          </div>

          {/* File upload */}
          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>
              Documents <span className="normal-case font-normal text-gray-300">(optional)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-red-800 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>Click to upload documents</p>
              <p className="text-xs text-gray-300 mt-1" style={{ fontFamily: 'Georgia, serif' }}>PDF, DOCX, JPG, PNG supported</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png" className="hidden" onChange={handleFiles} />

            {files.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {files.map((file, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-gray-600 truncate max-w-xs" style={{ fontFamily: 'Georgia, serif' }}>{file.name}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveFile(i)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
            >
              {isLoading ? 'Submitting...' : 'Submit Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}