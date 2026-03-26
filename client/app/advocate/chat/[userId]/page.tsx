import ChatPage from '@/components/chat/ChatPage';

export default function Page({ params }: { params: { userId: string } }) {
  return <ChatPage otherUserId={params.userId} />;
}