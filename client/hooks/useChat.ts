import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { getToken } from '@/lib/auth';
import { ChatMessageDto } from '@/store/api/chatApi';

interface UseChatOptions {
  myUserId: string;
  onMessage: (msg: ChatMessageDto) => void;
  enabled: boolean;
}

export function useChat({ myUserId, onMessage, enabled }: UseChatOptions) {
  const clientRef = useRef<Client | null>(null);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ receiverId, content }),
    });
  }, []);

  useEffect(() => {
    if (!enabled || !myUserId) return;

    const token = getToken();
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8080/ws';

    const client = new Client({
      brokerURL: `${wsUrl}?token=${token}`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/user/${myUserId}/queue/messages`, (msg: IMessage) => {
          try {
            const parsed: ChatMessageDto = JSON.parse(msg.body);
            onMessage(parsed);
          } catch (e) {
            console.error('Failed to parse chat message', e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [enabled, myUserId, onMessage]);

  return { sendMessage };
}