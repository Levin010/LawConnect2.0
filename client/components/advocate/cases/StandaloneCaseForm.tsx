'use client';

import { useState, useEffect, useRef } from 'react';
import { useCreateCaseMutation, useSearchClientsQuery, ClientUser } from '@/store/api/advocateApi';

interface FormState {
  caseName: string;
  caseNumber: string;
  clientRole: 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT' | '';
  caseDescription: string;
  clientUsername: string;
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

export default function StandaloneCaseForm() {
  const [createCase, { isLoading }] = useCreateCaseMutation();

  const [form, setForm] = useState<FormState>({
    caseName: '', caseNumber: '', clientRole: '', caseDescription: '', clientUsername: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Client search
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: clientResults, isFetching } = useSearchClientsQuery(debouncedSearch, {
    skip: debouncedSearch.length < 2,
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSelectClient = (client: ClientUser) => {
    setSelectedClient(client);
    setForm((prev) => ({ ...prev, clientUsername: client.username }));
    setSearchInput(client.name);
    setShowDropdown(false);
  };

  const handleClearClient = () => {
    setSelectedClient(null);
    setForm((prev) => ({ ...prev, clientUsername: '' }));
    setSearchInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await createCase({
        caseName: form.caseName,
        caseNumber: form.caseNumber,
        clientRole: form.clientRole as 'PLAINTIFF_PETITIONER' | 'DEFENDANT_RESPONDENT',
        caseDescription: form.caseDescription,
        clientUsername: form.clientUsername || undefined,
      }).unwrap();
      setSuccessMessage('Case created successfully.');
      setForm({ caseName: '', caseNumber: '', clientRole: '', caseDescription: '', clientUsername: '' });
      setSelectedClient(null);
      setSearchInput('');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrors({ general: error?.data?.message || 'Failed to create case. Please try again.' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto">
      {successMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {successMessage}
        </div>
      )}
      {errors.general && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

        {/* Client search */}
        <div ref={searchRef}>
          <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>
            Client <span className="normal-case text-gray-300 font-normal">(optional)</span>
          </label>

          {selectedClient ? (
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50">
              <div>
                <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{selectedClient.name}</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>@{selectedClient.username}</p>
              </div>
              <button type="button" onClick={handleClearClient} className="text-gray-300 hover:text-gray-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search by name or username..."
                className={inputClass}
                style={{ fontFamily: 'Georgia, serif' }}
              />
              {showDropdown && debouncedSearch.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden">
                  {isFetching && (
                    <div className="px-4 py-3 text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>Searching...</div>
                  )}
                  {!isFetching && (!clientResults || clientResults.length === 0) && (
                    <div className="px-4 py-3 text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>No clients found.</div>
                  )}
                  {!isFetching && clientResults && clientResults.map((client) => (
                    <button
                      key={client.username}
                      type="button"
                      onClick={() => handleSelectClient(client)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: '#8B0000' }}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>{client.name}</p>
                        <p className="text-xs text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>@{client.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Case Name</label>
          <input name="caseName" value={form.caseName} onChange={handleChange} placeholder="e.g. Republic v. John Doe" className={inputClass} style={{ fontFamily: 'Georgia, serif' }} />
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
          <textarea name="caseDescription" value={form.caseDescription} onChange={handleChange} placeholder="Describe the case..." rows={6} className={`${inputClass} resize-none`} style={{ fontFamily: 'Georgia, serif' }} />
          {errors.caseDescription && <p className={errorClass} style={{ fontFamily: 'Georgia, serif' }}>{errors.caseDescription}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Creating Case...' : 'Create Case'}
        </button>
      </form>
    </div>
  );
}