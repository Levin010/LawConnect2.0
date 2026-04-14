'use client';

import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@/store/api/authApi';
import { logout } from '@/store/slices/authSlice';
import { getRefreshToken } from '@/lib/auth';

export default function LogoutButton() {
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
      className="px-6 py-2 rounded-lg text-white font-semibold transition-colors disabled:opacity-60"
      style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
