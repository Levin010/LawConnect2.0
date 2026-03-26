package com.lawconnect.server.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageDto {
    private String messageId;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String content;
    private String conversationId;
    private LocalDateTime sentAt;
    private boolean read;
}
