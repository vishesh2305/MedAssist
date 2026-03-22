import { useEffect, useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { emitEvent } from '../lib/socket';

export function useChat(roomId?: string) {
  const {
    rooms,
    messages,
    activeRoomId,
    isLoading,
    isSending,
    typingUsers,
    error,
    fetchRooms,
    fetchMessages,
    sendMessage,
    createRoom,
    setActiveRoom,
    markAsRead,
    initializeSocket,
    cleanupSocket,
    clearError,
  } = useChatStore();

  useEffect(() => {
    initializeSocket();
    return () => {
      cleanupSocket();
    };
  }, [initializeSocket, cleanupSocket]);

  useEffect(() => {
    if (roomId) {
      setActiveRoom(roomId);
      fetchMessages(roomId);
      markAsRead(roomId);
    }
    return () => {
      if (roomId) {
        setActiveRoom(null);
      }
    };
  }, [roomId, setActiveRoom, fetchMessages, markAsRead]);

  const handleSend = useCallback(
    async (content: string) => {
      if (roomId && content.trim()) {
        await sendMessage(roomId, content.trim());
      }
    },
    [roomId, sendMessage]
  );

  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (roomId) {
        emitEvent('chat:typing', { roomId, isTyping });
      }
    },
    [roomId]
  );

  const roomMessages = roomId ? messages[roomId] || [] : [];
  const roomTyping = roomId ? typingUsers[roomId] || [] : [];

  return {
    rooms,
    messages: roomMessages,
    activeRoomId,
    isLoading,
    isSending,
    typingUsers: roomTyping,
    error,
    fetchRooms,
    sendMessage: handleSend,
    setTyping: handleTyping,
    createRoom,
    clearError,
  };
}
