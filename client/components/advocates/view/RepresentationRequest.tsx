'use client';

import { useState } from 'react';
import { useSendRepresentationRequestMutation } from '@/store/api/clientApi';

interface Props {
  advocateUsername: string;
}

export default function RepresentationRequest({ advocateUsername }: Props) {
  const [sendRequest, { isLoading }] = useSendRepresentationRequestMutation();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    role: '' as 'PLAINTIFF/PETITIONER' | 'DEFENDANT/RESPONDENT' | '',
    caseDescription: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!form.firstName || !form.lastName || !form.role || !form.caseDescription) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      await sendRequest({
        advocateUsername,
        firstName: form.firstName,
        lastName: form.lastName,
        role: form.role as 'PLAINTIFF/PETITIONER' | 'DEFENDANT/RESPONDENT',
        caseDescription: form.caseDescription,
      }).unwrap();
      setSuccessMessage('Request sent successfully.');
      setForm({ firstName: '', lastName: '', role: '', caseDescription: '' });
    } catch {
      setErrorMessage('Failed to send request. Please try again.');
    }
  };

  const inputClass = `
    w-full px-4 py-2.5 rounded-xl border border-white/20 text-sm bg-white/10 text-white
    placeholder-white/50 focus:outline-none focus:border-white/50 transition-all
  `;

  return (
    <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: '#8B0000' }}>
      <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        Representation Request
      </h2>

      {successMessage && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/20 border border-green-400 text-green-200 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-black/20 border border-white/20 text-white/80 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>First Name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
          </div>
          <div>
            <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
          </div>
        </div>

        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Your Role</label>
          <select name="role" value={form.role} onChange={handleChange} className={inputClass} style={{ fontFamily: 'Georgia, serif' }}>
            <option value="" disabled>Select role</option>
            <option value="PLAINTIFF">Plaintiff</option>
            <option value="DEFENDANT">Defendant</option>
          </select>
        </div>

        <div>
          <label className="block text-white/70 text-xs mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Case Description</label>
          <textarea
            name="caseDescription"
            value={form.caseDescription}
            onChange={handleChange}
            placeholder="Briefly describe your case..."
            rows={5}
            className={`${inputClass} resize-none`}
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold text-sm bg-white transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ color: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Sending...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}