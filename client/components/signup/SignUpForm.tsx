'use client';

import { useState } from 'react';
import { useRegisterMutation } from '@/store/api/authApi';

type Role = 'CLIENT' | 'ADVOCATE';

interface FormData {
  name: string;
  phone: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const emptyForm: FormData = {
  name: '',
  phone: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = 'Name is required.';

  if (!data.phone.trim()) errors.phone = 'Phone is required.';

  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format.';
  }

  if (!data.username.trim()) {
    errors.username = 'Username is required.';
  } else if (data.username.length < 3 || data.username.length > 20) {
    errors.username = 'Username must be between 3 and 20 characters.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  } else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(data.password)) {
    errors.password = 'Password must contain at least one uppercase letter and one number.';
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export default function SignupForm() {
  const [register, { isLoading }] = useRegisterMutation();
  const [role, setRole] = useState<Role>('CLIENT');
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (newRole: Role) => {
    setRole(newRole);
    setFormData(emptyForm);
    setErrors({});
    setSuccessMessage('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      await register({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role,
      }).unwrap();

      setSuccessMessage('Account created successfully! You can now log in.');
      setFormData(emptyForm);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string; errors?: Record<string, string> } };
      if (error?.data?.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ general: error?.data?.message || 'Sign up failed. Please try again.' });
      }
    }
  };

  const fields: { name: keyof FormData; label: string; type: string }[] = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'phone', label: 'Phone Number', type: 'tel' },
    { name: 'email', label: 'Email Address', type: 'email' },
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20">
      <h1
        className="text-3xl md:text-4xl font-bold text-white text-center mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Sign Up
      </h1>

      {/* Role tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex rounded-lg overflow-hidden border border-white/30">
          {(['CLIENT', 'ADVOCATE'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleTabChange(r)}
              className="px-8 py-2 text-sm font-semibold transition-colors"
              style={{
                fontFamily: 'Georgia, serif',
                backgroundColor: role === r ? '#8B0000' : 'transparent',
                color: '#fff',
              }}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

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
        {fields.map(({ name, label, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-white/80 text-sm mb-1.5"
              style={{ fontFamily: 'Georgia, serif' }}
            >
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
                errors[name]
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-transparent focus:border-red-700'
              }`}
              style={{ fontFamily: 'Georgia, serif' }}
              autoComplete={name === 'confirmPassword' ? 'new-password' : undefined}
            />
            {errors[name] && (
              <p className="mt-1 text-red-300 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
                {errors[name]}
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
          {isLoading ? 'Creating Account...' : `Sign Up as ${role.charAt(0) + role.slice(1).toLowerCase()}`}
        </button>
      </form>

      <p className="mt-6 text-center text-white/70 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
        Already have an account?{' '}
        <a href="/login" className="text-white underline hover:text-gray-200 transition-colors">
          Log in
        </a>
      </p>
    </div>
  );
}