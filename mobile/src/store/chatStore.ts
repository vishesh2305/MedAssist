import { create } from 'zustand';
import api from '../lib/api';
import { ChatRoom, ChatMessage } from '../types';
import { connectSocket, emitEvent, onEvent, offEvent } from '../lib/socket';

interface ChatState {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  activeRoomId: string | null;
  isLoading: boolean;
  isSending: boolean;
  typingUsers: Record<string, string[]>;
  error: string | null;

  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  createRoom: (hospitalId: string) => Promise<ChatRoom>;
  setActiveRoom: (roomId: string | null) => void;
  markAsRead: (roomId: string) => Promise<void>;
  initializeSocket: () => Promise<void>;
  cleanupSocket: () => void;
  addMessage: (message: ChatMessage) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  isLoading: false,
  isSending: false,
  typingUsers: {},
  error: null,

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/chat/rooms');
      set({ rooms: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load conversations.',
        isLoading: false,
      });
    }
  },

  fetchMessages: async (roomId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      set((state) => ({
        messages: { ...state.messages, [roomId]: response.data.data },
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load messages.',
        isLoading: false,
      });
    }
  },

  sendMessage: async (roomId: string, content: string) => {
    set({ isSending: true });
    try {
      emitEvent('chat:message', { roomId, content, type: 'text' });
      set({ isSending: false });
    } catch {
      set({ isSending: false });
    }
  },

  createRoom: async (hospitalId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/chat/rooms', { hospitalId });
      const room: ChatRoom = response.data.data;
      set((state) => ({
        rooms: [room, ...state.rooms],
        isLoading: false,
      }));
      return room;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create conversation.',
        isLoading: false,
      });
      throw error;
    }
  },

  setActiveRoom: (roomId: string | null) => {
    set({ activeRoomId: roomId });
    if (roomId) {
      emitEvent('chat:join', { roomId });
    }
  },

  markAsRead: async (roomId: string) => {
    try {
      await api.post(`/chat/rooms/${roomId}/read`);
      set((state) => ({
        rooms: state.rooms.map((r) =>
          r.id === roomId ? { ...r, unreadCount: 0 } : r
        ),
      }));
    } catch {
      // Silently fail
    }
  },

  initializeSocket: async () => {
    try {
      await connectSocket();

      onEvent('chat:message', (data: unknown) => {
        const message = data as ChatMessage;
        get().addMessage(message);
      });

      onEvent('chat:typing', (data: unknown) => {
        const { roomId, userName, isTyping } = data as {
          roomId: string;
          userName: string;
          isTyping: boolean;
        };
        set((state) => {
          const current = state.typingUsers[roomId] || [];
          const updated = isTyping
            ? [...new Set([...current, userName])]
            : current.filter((u) => u !== userName);
          return {
            typingUsers: { ...state.typingUsers, [roomId]: updated },
          };
        });
      });
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  },

  cleanupSocket: () => {
    offEvent('chat:message');
    offEvent('chat:typing');
  },

  addMessage: (message: ChatMessage) => {
    set((state) => {
      const roomMessages = state.messages[message.roomId] || [];
      const updatedRooms = state.rooms.map((r) =>
        r.id === message.roomId
          ? {
              ...r,
              lastMessage: message,
              unreadCount:
                state.activeRoomId === message.roomId
                  ? r.unreadCount
                  : r.unreadCount + 1,
            }
          : r
      );

      return {
        messages: {
          ...state.messages,
          [message.roomId]: [message, ...roomMessages],
        },
        rooms: updatedRooms,
      };
    });
  },

  clearError: () => set({ error: null }),
}));
