import { create } from 'zustand';
import type { ChatRoom, ChatMessage } from '@/types';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  activeRoom: string | null;
  isLoading: boolean;
  isTyping: Record<string, boolean>;
  fetchRooms: () => Promise<void>;
  createRoom: (data: { hospitalId?: string; type: ChatRoom['type']; name?: string }) => Promise<ChatRoom>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, messageType?: ChatMessage['messageType']) => Promise<void>;
  setRooms: (rooms: ChatRoom[]) => void;
  addRoom: (room: ChatRoom) => void;
  setActiveRoom: (roomId: string | null) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setTyping: (roomId: string, isTyping: boolean) => void;
  markAsRead: (roomId: string) => void;
  setLoading: (loading: boolean) => void;
  initSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  rooms: [],
  messages: {},
  activeRoom: null,
  isLoading: false,
  isTyping: {},

  fetchRooms: async () => {
    set({ isLoading: true });
    try {
      const { data: response } = await api.get('/chat/rooms');
      set({ rooms: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createRoom: async (data) => {
    const { data: response } = await api.post('/chat/rooms', data);
    const room = response.data;
    set((state) => ({
      rooms: [room, ...state.rooms],
    }));
    return room;
  },

  fetchMessages: async (roomId: string) => {
    set({ isLoading: true });
    try {
      const { data: response } = await api.get(`/chat/rooms/${roomId}/messages`);
      set((state) => ({
        messages: { ...state.messages, [roomId]: response.data },
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  sendMessage: async (roomId: string, content: string, messageType: ChatMessage['messageType'] = 'TEXT') => {
    const { data: response } = await api.post(`/chat/rooms/${roomId}/messages`, {
      content,
      messageType,
    });
    const message = response.data;
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    }));

    // Also emit via socket for real-time delivery
    const socket = getSocket();
    if (socket.connected) {
      socket.emit('message:send', { chatRoomId: roomId, content, messageType });
    }
  },

  setRooms: (rooms) => set({ rooms }),

  addRoom: (room) =>
    set((state) => ({
      rooms: [room, ...state.rooms.filter((r) => r.id !== room.id)],
    })),

  setActiveRoom: (roomId) => {
    set({ activeRoom: roomId });
    if (roomId) {
      const socket = getSocket();
      if (socket.connected) {
        socket.emit('room:join', { chatRoomId: roomId });
      }
    }
  },

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  setTyping: (roomId, isTyping) =>
    set((state) => ({
      isTyping: { ...state.isTyping, [roomId]: isTyping },
    })),

  markAsRead: (roomId) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit('message:read', { chatRoomId: roomId });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  initSocketListeners: () => {
    const socket = getSocket();

    socket.on('message:new', (message: ChatMessage) => {
      const { activeRoom, addMessage } = get();
      addMessage(message.chatRoomId, message);

      // Update room list order
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === message.chatRoomId ? { ...room } : room
        ),
      }));
    });

    socket.on('user:typing', ({ chatRoomId, isTyping }: { chatRoomId: string; isTyping: boolean }) => {
      set((state) => ({
        isTyping: { ...state.isTyping, [chatRoomId]: isTyping },
      }));
    });

    socket.on('room:created', (room: ChatRoom) => {
      get().addRoom(room);
    });
  },

  cleanupSocketListeners: () => {
    const socket = getSocket();
    socket.off('message:new');
    socket.off('user:typing');
    socket.off('room:created');
  },
}));
