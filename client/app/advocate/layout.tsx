'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '@/store/api/chatApi';
import { setUserId } from '@/store/slices/authSlice';

export default function AdvocateLayout({ children }: { children: React.ReactNode }) {
  const { data: me } = useGetMeQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (me?.id) dispatch(setUserId(me.id));
  }, [me]);

  return <>{children}</>;
}