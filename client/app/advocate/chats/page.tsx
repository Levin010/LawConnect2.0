import AdvocateNavbar from '@/components/advocate/AdvocateNavbar';
import ChatsListPage from '@/components/chat/ChatsListPage';

export default function AdvocateChatsPage() {
  return (
    <>
      <AdvocateNavbar />
      <ChatsListPage
        basePath="/advocate"
        title="Chats"
        subtitle="All conversations opened with your clients."
      />
    </>
  );
}
