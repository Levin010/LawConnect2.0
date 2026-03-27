'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ChatView from './ChatView';
import { useSearchParams } from 'next/navigation';

interface Props {
  otherUserId: string;
}

export default function ChatPage({ otherUserId }: Props) {
  const myUserId = useSelector((state: RootState) => state.auth.userId);
  const myUsername = useSelector((state: RootState) => state.auth.username);
  const searchParams = useSearchParams();
  const otherUserName = searchParams.get('name') ?? 'Client';

  if (!myUserId || !myUsername) return (
    <div className="flex items-center justify-center h-screen text-gray-400 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      Loading...
    </div>
  );

  return (
    <ChatView
      myUserId={myUserId}
      myUsername={myUsername}
      otherUserId={otherUserId}
      otherUserName={otherUserName}
    />
  );
}