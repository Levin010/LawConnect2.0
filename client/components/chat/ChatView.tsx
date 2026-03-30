'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useGetConversationQuery, useMarkAsReadMutation, ChatMessageDto } from '@/store/api/chatApi';
import { useChat } from '@/hooks/useChat';
import { v4 as uuidv4 } from 'uuid';
import { Hourglass, Check, CheckCheck } from 'lucide-react';

interface Props {
  myUserId: string;
  myUsername: string;
  otherUserId: string;
  otherUserName: string;
}

type UIMessage = ChatMessageDto & {
  status?: 'sending' | 'sent';
};

export default function ChatView({ myUserId, myUsername, otherUserId, otherUserName }: Props) {
  const router = useRouter();
  const { data: history, isLoading } = useGetConversationQuery(otherUserId);
  const [markAsRead] = useMarkAsReadMutation();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const markedRef = useRef<string | null>(null);

  useEffect(() => {
    if (history) setMessages(history);
  }, [history]);

  useEffect(() => {
    if (messages.length > 0) {
      const conversationId = messages[0].conversationId;
      if (markedRef.current !== conversationId) {
        markedRef.current = conversationId;
        markAsRead(conversationId);
      }
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onMessageRef = useRef<(msg: ChatMessageDto) => void>(() => {});

  onMessageRef.current = (msg: ChatMessageDto) => {
    if (
      (msg.senderId === otherUserId && msg.receiverId === myUserId) ||
      (msg.senderId === myUserId && msg.receiverId === otherUserId)
    ) {
      setMessages((prev) => {
        // If real message already exists → skip
        if (prev.find((m) => m.messageId === msg.messageId)) return prev;

        // Replace matching temp message
        const index = prev.findIndex(
            (m) =>
            m.messageId.startsWith('temp-') &&
            m.content === msg.content &&
            m.senderId === msg.senderId &&
            m.receiverId === msg.receiverId
        );

        if (index !== -1) {
            const updated = [...prev];
            updated[index] = {
            ...msg,
            status: 'sent',
            }; // replace temp with real
            return updated;
        }

        // Otherwise just append
        return [...prev, { ...msg, status: 'sent' }];
        });
    }
  };

  const handleMessage = useCallback((msg: ChatMessageDto) => {
    onMessageRef.current(msg);
  }, []);

  const { sendMessage } = useChat({
    myUserId,
    myUsername,
    onMessage: handleMessage,
    enabled: true, // always true — component only mounts when IDs are ready
  });

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const tempId = `temp-${uuidv4()}`;

    const tempMessage: UIMessage = {
        messageId: tempId,
        senderId: myUserId,
        senderName: '', // optional
        senderUsername: myUsername,
        receiverId: otherUserId,
        receiverUsername: '', // optional
        content: trimmed,
        conversationId: '', // will be replaced
        sentAt: new Date().toISOString(),
        read: false,
        status: 'sending',
    };

    // Optimistic UI update
    setMessages((prev) => [...prev, tempMessage]);

    // Send to backend
    sendMessage(otherUserId, trimmed);

    setInput('');
    };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 shrink-0" style={{ backgroundColor: '#8B0000' }}>
        <button onClick={() => router.back()} className="text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-bold" style={{ fontFamily: 'Georgia, serif' }}>
            {otherUserName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-white font-semibold text-sm" style={{ fontFamily: 'Georgia, serif' }}>{otherUserName}</p>
          <p className="text-white/60 text-xs" style={{ fontFamily: 'Georgia, serif' }}>Client</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-3 max-w-3xl w-full mx-auto">
        {isLoading && (
          <p className="text-center text-gray-400 text-sm py-8" style={{ fontFamily: 'Georgia, serif' }}>
            Loading conversation...
          </p>
        )}
        {!isLoading && messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8" style={{ fontFamily: 'Georgia, serif' }}>
            No messages yet. Start the conversation.
          </p>
        )}
        {messages.map((msg) => {
          const isMine = msg.senderId === myUserId;
          const isSending = msg.messageId.startsWith('temp-') || msg.status === 'sending';
          const isRead = msg.read;
          const isSent = isMine && !isSending;
          return (
            <div key={msg.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMine ? 'text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                }`}
                style={{ backgroundColor: isMine ? '#8B0000' : undefined, fontFamily: 'Georgia, serif' }}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 flex items-center justify-end gap-1 ${isMine ? 'text-white/60' : 'text-gray-400'}`}>
                {formatTime(msg.sentAt)}

                {isMine && (
                    <span className="flex items-center">
                    {isSending && <Hourglass className="w-3 h-3 opacity-70 animate-spin" />}
                    {isSent && !isRead && <Check className="w-3 h-3" />}
                    {isSent && isRead && <CheckCheck className="w-3 h-3 text-blue-400" />}
                    </span>
                )}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white shrink-0">
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:border-red-800 focus:bg-white transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#8B0000' }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}