'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ChatView from './ChatView';
import { useSearchParams } from 'next/navigation';

interface Props {
  otherUserId: string;
  otherUserRole?: string;
}

export default function ChatPage({ otherUserId, otherUserRole = 'User' }: Props) {
  const myUserId = useSelector((state: RootState) => state.auth.userId);
  const myUsername = useSelector((state: RootState) => state.auth.username);
  const searchParams = useSearchParams();
  const otherUserName = searchParams.get('name') ?? 'User';

  console.log('myUserId:', myUserId);
  console.log('myUsername:', myUsername);

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
      otherUserRole={otherUserRole}
    />
  );
}