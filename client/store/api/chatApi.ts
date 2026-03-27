import { baseApi } from './baseApi';

export interface CurrentUser {
  id: string;
  username: string;
}

export interface ChatMessageDto {
  messageId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  receiverId: string;
  receiverUsername: string;
  content: string;
  sentAt: string;
  read: boolean;
  conversationId: string;
}

export const chatApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getConversation: builder.query<ChatMessageDto[], string>({
      query: (otherUserId) => `/chat/conversation/${otherUserId}`,
      providesTags: ['Chat'],
    }),
    getInbox: builder.query<ChatMessageDto[], void>({
      query: () => '/chat/inbox',
      providesTags: ['Chat'],
    }),
    getUnreadCount: builder.query<number, void>({
      query: () => '/chat/unread',
      providesTags: ['Chat'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/chat/conversation/${conversationId}/read`,
        method: 'POST',
        responseHandler: 'text',
      }),
      invalidatesTags: ['Chat'],
    }),
    getMe: builder.query<CurrentUser, void>({
    query: () => '/users/me',
    }),
  }),
});

export const {
  useGetConversationQuery,
  useGetInboxQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
    useGetMeQuery,
} = chatApi;