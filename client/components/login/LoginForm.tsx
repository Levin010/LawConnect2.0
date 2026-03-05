'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { decodeToken } from '@/lib/auth';

export default function LoginForm() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: typeof errors = {};
    if (!formData.username.trim()) validationErrors.username = 'Username is required.';
    if (!formData.password) validationErrors.password = 'Password is required.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const data = await login(formData).unwrap();
      const decoded = decodeToken(data.token);

      dispatch(setCredentials({ token: data.token, username: decoded?.sub ?? formData.username }));

      if (decoded?.roles === 'ROLE_ADVOCATE') {
        window.location.href = '/advocate/dashboard';
      } else if (decoded?.roles === 'ROLE_CLIENT') {
        window.location.href = '/client/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setErrors({ general: error?.data?.message || 'Invalid username or password.' });
    }
  };

  const fields = [
    { name: 'username' as const, label: 'Username', type: 'text' },
    { name: 'password' as const, label: 'Password', type: 'password' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20">
      <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Georgia, serif' }}>
        Login
      </h1>

      {errors.general && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/20 border border-red-400 text-red-200 text-sm text-center">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-white/80 text-sm mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
              className={`w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-400 text-sm outline-none transition-all border-2 ${
                errors[name] ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-red-700'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
            />
            {errors[name] && (
              <p className="mt-1 text-red-300 text-xs" style={{ fontFamily: 'Georgia, serif' }}>{errors[name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 mt-2 rounded-lg text-white font-bold text-base transition-colors disabled:opacity-60"
          style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 flex justify-center gap-6 text-sm text-white/70" style={{ fontFamily: 'Georgia, serif' }}>
        <a href="/signup" className="hover:text-white transition-colors underline">Don't have an account?</a>
        <a href="/forgot-password" className="hover:text-white transition-colors underline">Forgot password?</a>
      </div>
    </div>
  );
}