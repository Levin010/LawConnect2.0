'use client';

import { useState, useEffect } from 'react';
import { useGetAdvocateProfileQuery, useUpdateAdvocateProfileMutation } from '@/store/api/advocateApi';
import ProfilePicture from './ProfilePicture';

const CATEGORIES = [
  'General Practice', 'Corporate Law', 'Criminal Defense',
  'Immigration Law', 'Family Law', 'Finance Law',
  'Environment Law', 'Entertainment Law', 'Land Law',
];

const COUNTIES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret',
  'Thika', 'Malindi', 'Kitale', 'Garissa', 'Kakamega',
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

interface FormState {
  name: string;
  email: string;
  phone: string;
  username: string;
  gender: string;
  category: string;
  lawFirm: string;
  county: string;
  address: string;
  postalAddress: string;
  experience: number | null;
  bio: string;
  profilePicture: string | null;
  practicingCertificate: string | null;
}

export default function ProfileForm() {
  const { data: profile, isLoading } = useGetAdvocateProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateAdvocateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '', email: '', phone: '', username: '',
    gender: '', category: '', lawFirm: '', county: '',
    address: '', postalAddress: '', experience: null,
    bio: '', profilePicture: null, practicingCertificate: null,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile) {
    setForm({
      name: profile.name ?? '',
      email: profile.email ?? '',
      phone: profile.phone ?? '',
      username: profile.username ?? '',
      gender: profile.gender ?? '',
      category: profile.category ?? '',
      lawFirm: profile.lawFirm ?? '',
      county: profile.county ?? '',
      address: profile.address ?? '',
      postalAddress: profile.postalAddress ?? '',
      experience: profile.experience ?? null,
      bio: profile.bio ?? '',
      profilePicture: profile.profilePicture ?? null,
      practicingCertificate: profile.practicingCertificate ?? null,
    });
  }
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'experience' ? (value ? parseInt(value) : null) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await updateProfile(form).unwrap();
      setSuccessMessage('Profile updated successfully.');
      setIsEditing(false);
    } catch (err: unknown) {
        console.error('Profile update error:', err);
        const error = err as { status?: number; data?: unknown };
        console.error('Status:', error?.status);
        console.error('Data:', JSON.stringify(error?.data));
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const inputClass = (editable = true) => `
    w-full px-4 py-2.5 rounded-xl border text-sm transition-all
    ${editable && isEditing
        ? 'border-gray-200 bg-gray-50 focus:outline-none focus:border-red-800 focus:bg-white'
        : 'border-transparent bg-gray-100 cursor-default outline-none'}
    `;
  const labelClass = `block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Success / error banners */}
      {successMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center" style={{ fontFamily: 'Georgia, serif' }}>
          {errorMessage}
        </div>
      )}

      {/* Main layout: portrait on mobile, landscape on lg+ */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* LEFT COLUMN — avatar + read-only account info */}
        <div className="flex flex-col items-center lg:items-start gap-6 lg:w-64 shrink-0">
          <ProfilePicture
            name={form.name}
            profilePicture={form.profilePicture}
            onImageChange={(base64) => setForm((prev) => ({ ...prev, profilePicture: base64 }))}
          />

          {/* Read-only fields */}
          <div className="w-full space-y-4">
            <div>
              <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Username</label>
              <input
                value={form.username}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-60`}
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>
            <div>
              <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Email</label>
              <input
                value={form.email}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-60`}
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — all editable fields in 2-col grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className={inputClass()} disabled={!isEditing} style={{ fontFamily: 'Georgia, serif' }}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Category</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass()} disabled={!isEditing} style={{ fontFamily: 'Georgia, serif' }}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Law Firm</label>
            <input name="lawFirm" value={form.lawFirm} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>County</label>
            <select name="county" value={form.county} onChange={handleChange} className={inputClass()} disabled={!isEditing} style={{ fontFamily: 'Georgia, serif' }}>
              <option value="">Select county</option>
              {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Address</label>
            <input name="address" value={form.address} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Postal Address</label>
            <input name="postalAddress" value={form.postalAddress} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Years of Experience</label>
            <input
              name="experience"
              type="number"
              min={0}
              value={form.experience ?? ''}
              onChange={handleChange}
              className={inputClass()} readOnly={!isEditing}
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>

          <div>
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Practicing Certificate No.</label>
            <input name="practicingCertificate" value={form.practicingCertificate ?? ''} onChange={handleChange} className={inputClass()} readOnly={!isEditing} style={{ fontFamily: 'Georgia, serif' }} />
          </div>

          {/* Bio spans full width */}
          <div className="sm:col-span-2">
            <label className={labelClass} style={{ fontFamily: 'Georgia, serif' }}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className={`${inputClass()} readOnly={!isEditing} resize-none`}
              style={{ fontFamily: 'Georgia, serif' }}
              placeholder="Tell clients about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-8 flex justify-end">
  {!isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="px-10 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
    >
      Edit Profile
    </button>
  ) : (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setErrorMessage('');
          setSuccessMessage('');
          if (profile) setForm({ ...profile, ...Object.fromEntries(
            Object.entries(profile).map(([k, v]) => [k, v ?? ''])
          )});
        }}
        className="px-8 py-3 rounded-xl font-semibold text-sm border-2 hover:bg-gray-50 transition-colors"
        style={{ borderColor: '#8B0000', color: '#8B0000', fontFamily: 'Georgia, serif' }}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSaving}
        className="px-10 py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )}
</div>
    </form>
  );
}