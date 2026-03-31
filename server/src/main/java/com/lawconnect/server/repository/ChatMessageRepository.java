package com.lawconnect.server.repository;

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

    @Query("SELECT DISTINCT m.conversationId FROM ChatMessage m " +
            "WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<String> findConversationIdsByUserId(@Param("userId") String userId);

    @Query("SELECT m FROM ChatMessage m WHERE m.conversationId = :conversationId " +
            "ORDER BY m.sentAt DESC LIMIT 1")
    ChatMessage findLatestMessageInConversation(@Param("conversationId") String conversationId);
}
