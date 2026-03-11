'use client';

import { useState } from 'react';
import { useUpdateRequestStatusMutation, useCreateCaseMutation, ReceivedRequest } from '@/store/api/advocateApi';

interface Props {
  request: ReceivedRequest;
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

export default function LaunchCaseModal({ request, onClose }: Props) {
  const [updateStatus] = useUpdateRequestStatusMutation();
  const [createCase, { isLoading }] = useCreateCaseMutation();

  const [form, setForm] = useState<FormState>({
    caseName: '',
    caseNumber: '',
    clientRole: request.clientRole,
    caseDescription: request.caseDescription,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      // First accept the request
      await updateStatus({ requestId: request.id, status: 'ACCEPTED' }).unwrap();
      // Then create the case
      await createCase({
        caseName: form.caseName,
        caseNumber: form.caseNumber,
        clientRole: form.clientRole as 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT',
        caseDescription: form.caseDescription,
        clientUsername: request.client.username,
      }).unwrap();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrors({ general: error?.data?.message || 'Failed to launch case. Please try again.' });
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
              Launch Case
            </h2>
            <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
              Review the request and fill in case details to proceed.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

          {/* Left — request details */}
          <div className="p-8 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
              Request Details
            </h3>
            {[
              { label: 'Client', value: request.client.name },
              { label: 'Client Name Filled', value: request.firstName + ' ' + request.lastName },
              { label: 'Party Role', value: request.clientRole.replace('_', ' / ') },
              { label: 'Case Description', value: request.caseDescription },
              { label: 'Date Received', value: new Date(request.requestedAt).toLocaleDateString('en-KE', {
                day: 'numeric', month: 'short', year: 'numeric',
              })},
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>{label}</span>
                <span className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Right — case form */}
          <div className="p-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Case Details
            </h3>

            {errors.general && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleLaunch} noValidate className="flex flex-col gap-5">
              <div>
                <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Name</label>
                <input name="caseName" value={form.caseName} onChange={handleChange} placeholder="e.g. Mwingi v. Business Partner" className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
                {errors.caseName && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.caseName}</p>}
              </div>

              <div>
                <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Number</label>
                <input name="caseNumber" value={form.caseNumber} onChange={handleChange} placeholder="e.g. CV/001/2026" className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
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
                  {isLoading ? 'Launching...' : 'Launch Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}