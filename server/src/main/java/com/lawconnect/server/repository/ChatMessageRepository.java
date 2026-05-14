package com.lawconnect.server.repository;

import com.lawconnect.server.dto.ChatInboxProjection;
import com.lawconnect.server.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    List<ChatMessage> findByConversationIdOrderBySentAtAsc(String conversationId);

    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.receiver.id = :userId AND m.read = false")
    long countUnreadByReceiverId(@Param("userId") String userId);

    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.read = true " +
            "WHERE m.conversationId = :conversationId " +
            "AND m.receiver.id = :userId AND m.read = false")
    int markConversationAsRead(@Param("conversationId") String conversationId,
                               @Param("userId") String userId);

    @Query(value = """
            WITH latest_messages AS (
                SELECT DISTINCT ON (cm.conversation_id)
                    cm.id,
                    cm.conversation_id,
                    cm.sender_id,
                    cm.receiver_id,
                    cm.content,
                    cm.sent_at,
                    cm.is_read
                FROM chat_messages cm
                WHERE cm.sender_id = :userId OR cm.receiver_id = :userId
                ORDER BY cm.conversation_id, cm.sent_at DESC, cm.id DESC
            ),
            unread_counts AS (
                SELECT
                    cm.conversation_id,
                    COUNT(*) AS unread_count
                FROM chat_messages cm
                WHERE cm.receiver_id = :userId
                  AND cm.is_read = false
                GROUP BY cm.conversation_id
            )
            SELECT
                lm.conversation_id AS "conversationId",
                other_user.id AS "otherUserId",
                TRIM(CONCAT(other_user.first_name, ' ', other_user.last_name)) AS "otherUserName",
                other_user.role AS "otherUserRole",
                COALESCE(ap.profile_picture, cp.profile_picture) AS "otherUserProfilePicture",
                lm.id AS "lastMessageId",
                sender_user.id AS "lastMessageSenderId",
                TRIM(CONCAT(sender_user.first_name, ' ', sender_user.last_name)) AS "lastMessageSenderName",
                sender_user.username AS "lastMessageSenderUsername",
                receiver_user.id AS "lastMessageReceiverId",
                receiver_user.username AS "lastMessageReceiverUsername",
                lm.content AS "lastMessageContent",
                lm.sent_at AS "lastMessageSentAt",
                lm.is_read AS "lastMessageRead",
                COALESCE(uc.unread_count, 0) AS "unreadCount"
            FROM latest_messages lm
            JOIN users sender_user
                ON sender_user.id = lm.sender_id
            JOIN users receiver_user
                ON receiver_user.id = lm.receiver_id
            JOIN users other_user
                ON other_user.id = CASE
                    WHEN lm.sender_id = :userId THEN lm.receiver_id
                    ELSE lm.sender_id
                END
            LEFT JOIN advocate_profiles ap
                ON ap.user_id = other_user.id
               AND other_user.role = 'ADVOCATE'
            LEFT JOIN client_profiles cp
                ON cp.user_id = other_user.id
               AND other_user.role = 'CLIENT'
            LEFT JOIN unread_counts uc
                ON uc.conversation_id = lm.conversation_id
            ORDER BY lm.sent_at DESC, lm.id DESC
            """, nativeQuery = true)
    List<ChatInboxProjection> findInboxItems(@Param("userId") String userId);
}
