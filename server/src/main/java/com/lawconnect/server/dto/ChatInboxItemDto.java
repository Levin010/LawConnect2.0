package com.lawconnect.server.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatInboxItemDto {
    private String conversationId;
    private String otherUserId;
    private String otherUserName;
    private String otherUserRole;
    private String otherUserProfilePicture;
    private ChatMessageDto lastMessage;
    private long unreadCount;
    private LocalDateTime lastMessageAt;
}
