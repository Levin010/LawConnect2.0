package com.lawconnect.server.controller;

import com.lawconnect.server.dto.ChatInboxItemDto;
import com.lawconnect.server.dto.ChatMessageDto;
import com.lawconnect.server.dto.ReadReceiptDto;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    /**
     * Client sends to /app/chat.send
     * Receiver gets it at /user/{receiverId}/queue/messages
     * Sender also gets the echo at /user/{senderId}/queue/messages (for multi-tab sync)
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto dto, Principal principal) {
        // principal.getName() returns the username from the JWT — set by WebSocketAuthInterceptor
        ChatMessageDto saved = chatMessageService.saveMessage(principal.getName(), dto);

        // Deliver to receiver
        messagingTemplate.convertAndSendToUser(
                saved.getReceiverUsername(),
                "/queue/messages",
                saved
        );

        // Echo back to sender (supports multiple tabs / devices)
        messagingTemplate.convertAndSendToUser(
                saved.getSenderUsername(),
                "/queue/messages",
                saved
        );
    }

    /**
     * REST: Get full conversation history between the authenticated user and another user.
     * GET /chat/conversation/{otherUserId}
     */
    @GetMapping("/chat/conversation/{otherUserId}")
    public List<ChatMessageDto> getConversation(
            @PathVariable String otherUserId,
            @AuthenticationPrincipal UserDetails userDetails) {

        // We need the authenticated user's ID. We look it up via their username.
        // To avoid a second DB call here, we cast to your User model (UserDetails impl).
        // Your UserServiceImpl should return a User that implements UserDetails,
        // OR we resolve via UserRepository. We use the approach below for safety:
        String myUserId = extractUserId(userDetails);
        return chatMessageService.getConversation(myUserId, otherUserId);
    }

    /**
     * REST: Mark a conversation as read.
     * POST /chat/conversation/{conversationId}/read
     */
    @PostMapping("/chat/conversation/{conversationId}/read")
    public void markAsRead(
            @PathVariable String conversationId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String myUserId = extractUserId(userDetails);

        int updatedCount = chatMessageService.markConversationAsRead(conversationId, myUserId);

        if (updatedCount > 0) {
            String otherUsername = chatMessageService.getOtherParticipantUsername(conversationId, myUserId);

            messagingTemplate.convertAndSendToUser(
                    otherUsername,
                    "/queue/read-receipts",
                    new ReadReceiptDto(conversationId, myUserId)
            );
        } else {
            System.out.println("[READ] no unread messages updated, no receipt sent");
        }
    }

    /**
     * REST: Get unread message count for the authenticated user.
     * GET /chat/unread
     */
    @GetMapping("/chat/unread")
    public long getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        return chatMessageService.countUnread(extractUserId(userDetails));
    }

    /**
     * REST: Get inbox (latest message per conversation).
     * GET /chat/inbox
     */
    @GetMapping("/chat/inbox")
    public List<ChatInboxItemDto> getInbox(@AuthenticationPrincipal UserDetails userDetails) {
        return chatMessageService.getInboxItems(extractUserId(userDetails));
    }

    /**
     * Your User entity has an 'id' field. UserDetails only exposes 'username'.
     * Cast to your User model which implements UserDetails to get the id directly.
     */
    private String extractUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
