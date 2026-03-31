'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/api/chatApi';
import { setUserId } from '@/store/slices/authSlice';

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const { data: me } = useGetMeQuery();

  useEffect(() => {
    if (me?.id) {
      dispatch(setUserId(me.id));
    }
  }, [me, dispatch]);

  return null;
}