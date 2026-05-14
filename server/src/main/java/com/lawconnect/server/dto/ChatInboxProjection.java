package com.lawconnect.server.dto;

import java.time.LocalDateTime;

public interface ChatInboxProjection {
    String getConversationId();
    String getOtherUserId();
    String getOtherUserName();
    String getOtherUserRole();
    String getOtherUserProfilePicture();
    String getLastMessageId();
    String getLastMessageSenderId();
    String getLastMessageSenderName();
    String getLastMessageSenderUsername();
    String getLastMessageReceiverId();
    String getLastMessageReceiverUsername();
    String getLastMessageContent();
    LocalDateTime getLastMessageSentAt();
    Boolean getLastMessageRead();
    Long getUnreadCount();
}
