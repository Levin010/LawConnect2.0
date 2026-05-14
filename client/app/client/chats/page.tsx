import Navbar from '@/components/Navbar';
import ChatsListPage from '@/components/chat/ChatsListPage';

export default function ClientChatsPage() {
  return (
    <>
      <Navbar />
      <ChatsListPage
        basePath="/client"
        title="Chats"
        subtitle="All conversations opened with your advocates."
      />
    </>
  );
}
