'use client';

import { useState } from 'react';
import { useUpdateCaseMutation, LegalCase } from '@/store/api/advocateApi';
import { buildFullName, getNameInitial } from '@/lib/user';

interface Props {
  legalCase: LegalCase;
  onClose: () => void;
}

interface FormState {
  caseName: string;
  caseNumber: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT' | '';
  caseDescription: string;
}

interface FormErrors {
  caseName?: string;
  caseNumber?: string;
  clientRole?: string;
  caseDescription?: string;
  general?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.caseName.trim()) errors.caseName = 'Case name is required.';
  if (!form.caseNumber.trim()) errors.caseNumber = 'Case number is required.';
  if (!form.clientRole) errors.clientRole = 'Client role is required.';
  if (!form.caseDescription.trim()) errors.caseDescription = 'Case description is required.';
  return errors;
}

const inputClass = `
  w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50
  focus:outline-none focus:border-red-800 focus:bg-white transition-all
`;
const labelClass = 'block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5';
const errorClass = 'mt-1 text-red-400 text-xs';

export default function EditCaseModal({ legalCase, onClose }: Props) {
  const [updateCase, { isLoading }] = useUpdateCaseMutation();
  const clientName = legalCase.client ? buildFullName(legalCase.client) : '';

  const [form, setForm] = useState<FormState>({
    caseName: legalCase.caseName,
    caseNumber: legalCase.caseNumber,
    clientRole: legalCase.clientRole,
    caseDescription: legalCase.caseDescription,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setErrors({});

    try {
      await updateCase({
        id: String(legalCase.id),
        body: {
          caseName: form.caseName,
          caseNumber: form.caseNumber,
          clientRole: form.clientRole as 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT',
          caseDescription: form.caseDescription,
          clientUsername: legalCase.client?.username,
        },
      }).unwrap();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrors({ general: error?.data?.message || 'Failed to update case. Please try again.' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>Edit Case</h2>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>Update the case details below.</p>
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
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Name</label>
            <input name="caseName" value={form.caseName} onChange={handleChange} className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
            {errors.caseName && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.caseName}</p>}
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Number</label>
            <input name="caseNumber" value={form.caseNumber} onChange={handleChange} className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
            {errors.caseNumber && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.caseNumber}</p>}
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Client Role</label>
            <select name="clientRole" value={form.clientRole} onChange={handleChange} className={inputClass} style={{ fontFamily: 'Georgia, serif' }}>
              <option value="">Select client role</option>
              <option value="PLAINTIFF_PETITIONER">Plaintiff / Petitioner</option>
              <option value="DEFENDANT_RESPONDENT">Defendant / Respondent</option>
            </select>
            {errors.clientRole && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.clientRole}</p>}
          </div>

          {/* Client display only — not editable */}
          {legalCase.client && (
            <div>
              <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>
                Client <span className="normal-case font-normal text-gray-300">(not editable)</span>
              </label>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: '#8B0000' }}>
                  {getNameInitial(legalCase.client)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{clientName}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>@{legalCase.client.username}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Description</label>
            <textarea name="caseDescription" value={form.caseDescription} onChange={handleChange} rows={5} className={`${inputClass} resize-none`} style={{ fontFamily: 'Georgia, serif' }} />
            {errors.caseDescription && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.caseDescription}</p>}
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
