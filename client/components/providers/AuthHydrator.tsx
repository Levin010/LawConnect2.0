'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/api/chatApi';
import { logout, setUserId } from '@/store/slices/authSlice';
import { getRefreshToken, getToken } from '@/lib/auth';

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const hasStoredAuth = Boolean(getToken() || getRefreshToken());
  const { data: me } = useGetMeQuery(undefined, { skip: !hasStoredAuth });

  useEffect(() => {
    if (me?.id) {
      dispatch(setUserId(me.id));
    }
  }, [me, dispatch]);

  useEffect(() => {
    if (!getToken() && !getRefreshToken()) {
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
}
