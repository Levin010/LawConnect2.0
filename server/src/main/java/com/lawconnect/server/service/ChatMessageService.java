package com.lawconnect.server.service;

import com.lawconnect.server.dto.ChatMessageDto;
import java.util.List;

public interface ChatMessageService {
    ChatMessageDto saveMessage(String senderUsername, ChatMessageDto dto);
    List<ChatMessageDto> getConversation(String userId1, String userId2);
    int markConversationAsRead(String conversationId, String receiverId);
    long countUnread(String userId);
    List<ChatMessageDto> getInbox(String userId);
    String getOtherParticipantUsername(String conversationId, String myUserId);
}
