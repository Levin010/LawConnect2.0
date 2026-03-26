package com.lawconnect.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "chat_messages", indexes = {
        @Index(name = "idx_conversation_id", columnList = "conversation_id"),
        @Index(name = "idx_sender_id",       columnList = "sender_id"),
        @Index(name = "idx_receiver_id",     columnList = "receiver_id")
})
public class ChatMessage {

    @Id
    @Column(nullable = false, updatable = false)
    private String id;

    /**
     * Deterministic key: alphabetically sorted userId pair joined by "_"
     * e.g. "uuid-aaa_uuid-bbb" — same regardless of who initiates.
     */
    @Column(name = "conversation_id", nullable = false)
    private String conversationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", referencedColumnName = "id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", referencedColumnName = "id", nullable = false)
    private User receiver;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @PrePersist
    public void prePersist() {
        if (id == null)    id = UUID.randomUUID().toString();
        if (sentAt == null) sentAt = LocalDateTime.now();
    }

    public static String buildConversationId(String userId1, String userId2) {
        return userId1.compareTo(userId2) <= 0
                ? userId1 + "_" + userId2
                : userId2 + "_" + userId1;
    }
}
