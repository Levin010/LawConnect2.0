import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '@/lib/auth';
import { ChatMessageDto } from '@/store/api/chatApi';

interface UseChatOptions {
  myUserId: string;
  myUsername: string;
  onMessage: (msg: ChatMessageDto) => void;
  enabled: boolean;
}

export function useChat({ myUserId, myUsername, onMessage, enabled }: UseChatOptions) {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);

    useEffect(() => {
    onMessageRef.current = onMessage;
    });

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!clientRef.current?.connected) return;
    console.log('[STOMP] Publishing message to receiverId:', receiverId);
    clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ receiverId, content }),
    });
    }, []);

  useEffect(() => {
    if (!enabled || !myUserId || !myUsername) return;

    const token = getToken();
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('[STOMP] Connected. Subscribing as username:', myUsername);
        client.subscribe(`/user/queue/messages`, (msg: IMessage) => {
            console.log('[STOMP] Raw message received:', msg.body);
            try {
            const parsed: ChatMessageDto = JSON.parse(msg.body);
            onMessageRef.current(parsed);
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
      setTimeout(() => {
        client.deactivate();
        }, 300);
        clientRef.current = null;
    };
  }, [enabled, myUserId, myUsername]);

  return { sendMessage };
}