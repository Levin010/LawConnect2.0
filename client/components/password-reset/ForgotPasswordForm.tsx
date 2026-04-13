'use client';

import { useState } from 'react';
import { useRequestPasswordResetMutation } from '@/store/api/authApi';

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordForm() {
  const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrors({ email: 'Email is required.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrors({ email: 'Invalid email format.' });
      return;
    }

    setErrors({});

    try {
      const response = await requestPasswordReset({ email: trimmedEmail }).unwrap();
      setSuccessMessage(response.message);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string; email?: string } };
      setErrors({
        email: error?.data?.email,
        general: error?.data?.message || (!error?.data?.email ? 'Unable to send reset link right now.' : undefined),
      });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        Forgot Password
      </h1>

      <p className="text-white/80 text-sm text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Enter the email address tied to your account and we&apos;ll send a password reset link.
      </p>

      {successMessage && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/20 border border-green-400 text-green-200 text-sm text-center">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/20 border border-red-400 text-red-200 text-sm text-center">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-white/80 text-sm mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined, general: undefined }));
            }}
            placeholder="Email Address"
            autoComplete="email"
            className={`w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-400 text-sm outline-none transition-all border-2 ${
              errors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-700'
            }`}
            style={{ fontFamily: 'Georgia, serif' }}
          />
          {errors.email && (
            <p className="mt-1 text-red-300 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 rounded-lg text-white font-bold text-base transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-white/70 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
        Remembered your password?{' '}
        <a href="/login" className="text-white underline hover:text-gray-200 transition-colors">
          Back to login
        </a>
      </p>
    </div>
  );
}
