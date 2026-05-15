'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, CheckCheck, MessageCircle } from 'lucide-react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ChatInboxItemDto, useGetInboxQuery } from '@/store/api/chatApi';
import { useChat } from '@/hooks/useChat';

interface Props {
  basePath: '/client' | '/advocate';
  title: string;
  subtitle: string;
}

function formatConversationDate(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) {
    return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  }

  if (sameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-KE', {
    day: '2-digit',
    month: 'short',
    year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
}

function ChatAvatar({ chat }: { chat: ChatInboxItemDto }) {
  const initial = chat.otherUserName ? chat.otherUserName.charAt(0).toUpperCase() : '?';

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-red-900">
      {chat.otherUserProfilePicture ? (
        <Image
          src={chat.otherUserProfilePicture}
          alt={chat.otherUserName}
          fill
          className="object-cover"
          sizes="48px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
          {initial}
        </div>
      )}
    </div>
  );
}

function ChatRow({ chat, myUserId, basePath }: { chat: ChatInboxItemDto; myUserId: string; basePath: Props['basePath'] }) {
  const lastMessage = chat.lastMessage;
  const lastMessageIsMine = lastMessage.senderId === myUserId;
  const hasUnreadIncoming = !lastMessageIsMine && chat.unreadCount > 0;
  const href = `${basePath}/chat/${chat.otherUserId}?name=${encodeURIComponent(chat.otherUserName)}`;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-4 transition-colors last:border-b-0 hover:bg-gray-50 sm:px-5"
    >
      <ChatAvatar chat={chat} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              className={`truncate text-sm lg:text-base ${hasUnreadIncoming ? 'font-bold text-gray-950' : 'font-semibold text-gray-800'}`}
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {chat.otherUserName}
            </h2>
          </div>
          <div className="shrink-0">
            <span
              className={`text-xs lg:text-sm ${hasUnreadIncoming ? 'font-bold' : 'text-gray-400'}`}
              style={{ color: hasUnreadIncoming ? '#8B0000' : undefined, fontFamily: 'Georgia, serif' }}
            >
              {formatConversationDate(chat.lastMessageAt)}
            </span>
          </div>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-1.5">
          {lastMessageIsMine && (
            <span className="shrink-0 text-gray-400">
              {lastMessage.read ? <CheckCheck className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-400" /> : <Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
            </span>
          )}
          <p
            className={`min-w-0 flex-1 truncate text-xs lg:text-sm ${hasUnreadIncoming ? 'font-bold text-gray-900' : 'text-gray-500'}`}
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {lastMessage.content}
          </p>
          {hasUnreadIncoming && (
            <span
              className="ml-auto flex h-5 min-w-5 lg:h-5.5 lg:min-w-5.5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: '#8B0000', fontFamily: 'Georgia, serif' }}
            >
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ChatsListPage({ basePath, title, subtitle }: Props) {
  const myUserId = useSelector((state: RootState) => state.auth.userId);
  const myUsername = useSelector((state: RootState) => state.auth.username);
  const { data: chats = [], isLoading, isError, refetch } = useGetInboxQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleMessage = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleReadReceipt = useCallback(() => {
    refetch();
  }, [refetch]);

  useChat({
    myUserId: myUserId ?? '',
    myUsername: myUsername ?? '',
    onMessage: handleMessage,
    onReadReceipt: handleReadReceipt,
    enabled: Boolean(myUserId && myUsername),
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#8B0000' }}>
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
            {subtitle}
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          {isLoading && (
            <p className="px-5 py-10 text-center text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
              Loading chats...
            </p>
          )}

          {!isLoading && isError && (
            <p className="px-5 py-10 text-center text-sm text-red-600" style={{ fontFamily: 'Georgia, serif' }}>
              Failed to load chats. Please try again.
            </p>
          )}

          {!isLoading && !isError && chats.length === 0 && (
            <div className="flex flex-col items-center px-5 py-12 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <MessageCircle className="h-5 w-5" style={{ color: '#8B0000' }} />
              </div>
              <h2 className="text-sm font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
                No chats yet
              </h2>
              <p className="mt-1 max-w-sm text-sm text-gray-400" style={{ fontFamily: 'Georgia, serif' }}>
                Conversations will appear here after a message is sent or received.
              </p>
            </div>
          )}

          {!isLoading && !isError && chats.map((chat) => (
            <ChatRow key={chat.conversationId} chat={chat} myUserId={myUserId ?? ''} basePath={basePath} />
          ))}
        </section>
      </div>
    </main>
  );
}
