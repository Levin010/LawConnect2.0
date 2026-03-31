import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '@/lib/auth';
import { ChatMessageDto } from '@/store/api/chatApi';

interface UseChatOptions {
  myUserId: string;
  myUsername: string;
  onMessage: (msg: ChatMessageDto) => void;
  onReadReceipt: (receipt: ReadReceiptDto) => void;
  enabled: boolean;
}

export interface ReadReceiptDto {
  conversationId: string;
  readerId: string;
}

export function useChat({ myUserId, myUsername, onMessage, onReadReceipt, enabled }: UseChatOptions) {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);
  const onReadReceiptRef = useRef(onReadReceipt);

    useEffect(() => {
      onMessageRef.current = onMessage;
      onReadReceiptRef.current = onReadReceipt;
      console.log('[STOMP] Updated callback refs');
    }, [onMessage, onReadReceipt]);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    if (!clientRef.current?.connected) return;
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

        client.subscribe('/user/queue/messages', (msg: IMessage) => {
          console.log('[STOMP] Raw message received:', msg.body);
          try {
            const parsed: ChatMessageDto = JSON.parse(msg.body);
            console.log('[STOMP] Parsed message:', parsed);
            onMessageRef.current(parsed);
          } catch (e) {
            console.error('[STOMP] Failed to parse chat message', e);
          }
        });

        console.log('[STOMP] Subscribed to /user/queue/messages');

        client.subscribe('/user/queue/read-receipts', (msg: IMessage) => {
          console.log('[STOMP] Raw read receipt received:', msg.body);
          try {
            const parsed: ReadReceiptDto = JSON.parse(msg.body);
            console.log('[STOMP] Parsed read receipt:', parsed);
            onReadReceiptRef.current(parsed);
          } catch (e) {
            console.error('[STOMP] Failed to parse read receipt', e);
          }
        });

        console.log('[STOMP] Subscribed to /user/queue/read-receipts');
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