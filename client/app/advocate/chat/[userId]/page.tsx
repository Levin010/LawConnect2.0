import ChatPage from '@/components/chat/ChatPage';
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = use(params);
  return <ChatPage otherUserId={userId} />;
}