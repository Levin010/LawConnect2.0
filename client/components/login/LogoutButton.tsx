'use client';

import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { getRefreshToken } from '@/lib/auth';
import { LogOut } from 'lucide-react';

type LogoutButtonProps = {
  className?: string;
  showIcon?: boolean;
};

export default function LogoutButton({ className = '', showIcon = false }: LogoutButtonProps) {
  const dispatch = useDispatch();
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const refreshToken = getRefreshToken();
      await logoutMutation(refreshToken ? { refreshToken } : undefined).unwrap();
    } catch {
      // even if backend call fails, clear client state
    } finally {
      dispatch(logout());
      window.location.href = '/login';
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-0 pb-2 pt-1 rounded-lg text-white font-semibold transition-colors disabled:opacity-60 ${className}`.trim()}
      style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
    >
      <span className="flex items-center gap-2">
        {showIcon && <LogOut className="h-4 w-4 shrink-0" />}
        <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
      </span>
    </button>
  );
}
