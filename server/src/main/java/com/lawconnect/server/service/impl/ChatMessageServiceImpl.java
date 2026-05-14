package com.lawconnect.server.service.impl;

import com.lawconnect.server.dto.ChatInboxItemDto;
import com.lawconnect.server.dto.ChatInboxProjection;
import com.lawconnect.server.dto.ChatMessageDto;
import com.lawconnect.server.model.ChatMessage;
import com.lawconnect.server.model.User;
import com.lawconnect.server.repository.ChatMessageRepository;
import com.lawconnect.server.repository.UserRepository;
import com.lawconnect.server.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Override
    public ChatMessageDto saveMessage(String senderUsername, ChatMessageDto dto) {
        // Load sender by username (from JWT principal — never trust client-supplied senderId)
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found: " + senderUsername));

        User receiver = userRepository.findById(dto.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found: " + dto.getReceiverId()));

        String conversationId = ChatMessage.buildConversationId(sender.getId(), receiver.getId());

        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(dto.getContent());
        message.setConversationId(conversationId);
        // read defaults to false via field initializer

        ChatMessage saved = chatMessageRepository.save(message);
        return toDto(saved);
    }

    @Override
    public List<ChatMessageDto> getConversation(String userId1, String userId2) {
        String conversationId = ChatMessage.buildConversationId(userId1, userId2);
        return chatMessageRepository
                .findByConversationIdOrderBySentAtAsc(conversationId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public int markConversationAsRead(String conversationId, String receiverId) {

        int updatedCount = chatMessageRepository.markConversationAsRead(conversationId, receiverId);

        return updatedCount;
    }

    @Override
    public long countUnread(String userId) {
        return chatMessageRepository.countUnreadByReceiverId(userId);
    }

    @Override
    public List<ChatInboxItemDto> getInboxItems(String userId) {
        return chatMessageRepository.findInboxItems(userId)
                .stream()
                .map(this::toInboxDto)
                .collect(Collectors.toList());
    }

    @Override
    public String getOtherParticipantUsername(String conversationId, String myUserId) {

        String[] ids = conversationId.split("_");

        if (ids.length != 2) {
            throw new RuntimeException("Invalid conversation id: " + conversationId);
        }

        String otherUserId = ids[0].equals(myUserId) ? ids[1] : ids[0];

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + otherUserId));

        return otherUser.getUsername();
    }

    private ChatMessageDto toDto(ChatMessage m) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setMessageId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName((m.getSender().getFirstName() + " " + m.getSender().getLastName()).trim());
        dto.setSenderUsername(m.getSender().getUsername());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverUsername(m.getReceiver().getUsername());
        dto.setContent(m.getContent());
        dto.setConversationId(m.getConversationId());
        dto.setSentAt(m.getSentAt());
        dto.setRead(m.isRead());
        return dto;
    }

    private ChatInboxItemDto toInboxDto(ChatInboxProjection row) {
        ChatMessageDto lastMessage = new ChatMessageDto();
        lastMessage.setMessageId(row.getLastMessageId());
        lastMessage.setSenderId(row.getLastMessageSenderId());
        lastMessage.setSenderName(row.getLastMessageSenderName());
        lastMessage.setSenderUsername(row.getLastMessageSenderUsername());
        lastMessage.setReceiverId(row.getLastMessageReceiverId());
        lastMessage.setReceiverUsername(row.getLastMessageReceiverUsername());
        lastMessage.setContent(row.getLastMessageContent());
        lastMessage.setConversationId(row.getConversationId());
        lastMessage.setSentAt(row.getLastMessageSentAt());
        lastMessage.setRead(Boolean.TRUE.equals(row.getLastMessageRead()));

        ChatInboxItemDto item = new ChatInboxItemDto();
        item.setConversationId(row.getConversationId());
        item.setOtherUserId(row.getOtherUserId());
        item.setOtherUserName(row.getOtherUserName());
        item.setOtherUserRole(row.getOtherUserRole());
        item.setOtherUserProfilePicture(row.getOtherUserProfilePicture());
        item.setLastMessage(lastMessage);
        item.setLastMessageAt(row.getLastMessageSentAt());
        item.setUnreadCount(row.getUnreadCount() == null ? 0 : row.getUnreadCount());
        return item;
    }
}
