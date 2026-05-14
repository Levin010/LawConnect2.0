-- Indexes for /chat/inbox latest-message and unread-count lookups.
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_sent_at_id
    ON chat_messages (conversation_id, sent_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_sent_at
    ON chat_messages (sender_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_receiver_sent_at
    ON chat_messages (receiver_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_unread_receiver_conversation
    ON chat_messages (receiver_id, conversation_id)
    WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_advocate_profiles_user_id
    ON advocate_profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id
    ON client_profiles (user_id);
