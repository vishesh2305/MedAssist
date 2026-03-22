'use client';

import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/store/chatStore';
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket';
import type { ChatMessage, ChatRoom } from '@/types';
import api from '@/lib/api';

export function useChat() {
  const {
    rooms,
    messages,
    activeRoom,
    isLoading,
    isTyping,
    setRooms,
    addRoom,
    setActiveRoom,
    setMessages,
    addMessage,
    setTyping,
    markAsRead,
    setLoading,
  } = useChatStore();

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    socket.on('new_message', (message: ChatMessage) => {
      const roomId = message.chatRoomId;
      addMessage(roomId, message);
    });

    socket.on('typing', ({ roomId, isTyping: typing }: { roomId: string; isTyping: boolean }) => {
      setTyping(roomId, typing);
    });

    socket.on('room_created', (room: ChatRoom) => {
      addRoom(room);
    });

    return () => {
      socket.off('new_message');
      socket.off('typing');
      socket.off('room_created');
    };
  }, []);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/chat/rooms');
      setRooms(data.rooms || data.data || data);
    } catch {
      console.error('Failed to fetch chat rooms');
    } finally {
      setLoading(false);
    }
  }, [setRooms, setLoading]);

  const fetchMessages = useCallback(async (roomId: string) => {
    try {
      const { data } = await api.get(`/chat/rooms/${roomId}/messages`);
      setMessages(roomId, data.messages || data.data || data);
    } catch {
      console.error('Failed to fetch messages');
    }
  }, [setMessages]);

  const sendMessage = useCallback((roomId: string, content: string) => {
    const socket = getSocket();
    socket.emit('send_message', { roomId, content });
  }, []);

  const sendTyping = useCallback((roomId: string, typing: boolean) => {
    const socket = getSocket();
    socket.emit('typing', { roomId, isTyping: typing });
  }, []);

  const createRoom = useCallback(async (hospitalId: string, type: string = 'DIRECT') => {
    try {
      const { data } = await api.post('/chat/rooms', { type, hospitalId });
      addRoom(data.room || data);
      return data.room || data;
    } catch {
      console.error('Failed to create chat room');
      return null;
    }
  }, [addRoom]);

  const joinRoom = useCallback((roomId: string) => {
    setActiveRoom(roomId);
    const socket = getSocket();
    socket.emit('join_room', roomId);
    fetchMessages(roomId);
    markAsRead(roomId);
  }, [setActiveRoom, fetchMessages, markAsRead]);

  const leaveRoom = useCallback(() => {
    if (activeRoom) {
      const socket = getSocket();
      socket.emit('leave_room', activeRoom);
    }
    setActiveRoom(null);
  }, [activeRoom, setActiveRoom]);

  return {
    rooms,
    messages: activeRoom ? messages[activeRoom] || [] : [],
    activeRoom,
    isLoading,
    isTyping: activeRoom ? isTyping[activeRoom] || false : false,
    fetchRooms,
    sendMessage,
    sendTyping,
    createRoom,
    joinRoom,
    leaveRoom,
  };
}
