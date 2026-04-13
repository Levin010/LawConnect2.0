'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useResetPasswordMutation } from '@/store/api/authApi';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswords, setShowPasswords] = useState({ password: false, confirmPassword: false });

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!token) {
      nextErrors.general = 'This reset link is invalid or has expired.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.';
    } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(password)) {
      nextErrors.password = 'Password must contain at least one uppercase letter and one number.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validate()) {
      return;
    }

    try {
      const response = await resetPassword({ token, password }).unwrap();
      setSuccessMessage(response.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string; password?: string; token?: string } };
      setErrors({
        password: error?.data?.password,
        general:
          error?.data?.message ||
          error?.data?.token ||
          (!error?.data?.password ? 'Unable to reset password right now.' : undefined),
      });
    }
  };

  const passwordFields = [
    { key: 'password' as const, label: 'New Password', value: password, setter: setPassword },
    { key: 'confirmPassword' as const, label: 'Confirm New Password', value: confirmPassword, setter: setConfirmPassword },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        Reset Password
      </h1>

      <p className="text-white/80 text-sm text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Set a new password for your account.
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
        {passwordFields.map(({ key, label, value, setter }) => (
          <div key={key}>
            <label htmlFor={key} className="block text-white/80 text-sm mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              {label}
            </label>
            <div className="relative">
              <input
                id={key}
                name={key}
                type={showPasswords[key] ? 'text' : 'password'}
                value={value}
                onChange={(e) => {
                  setter(e.target.value);
                  setErrors((prev) => ({ ...prev, [key]: undefined, general: undefined }));
                }}
                placeholder={label}
                autoComplete="new-password"
                className={`w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-400 text-sm outline-none transition-all border-2 pr-11 ${
                  errors[key] ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-700'
                }`}
                style={{ fontFamily: 'Georgia, serif' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords[key] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors[key] && (
              <p className="mt-1 text-red-300 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
                {errors[key]}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 rounded-lg text-white font-bold text-base transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-white/70 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
        Back to{' '}
        <a href="/login" className="text-white underline hover:text-gray-200 transition-colors">
          login
        </a>
      </p>
    </div>
  );
}
