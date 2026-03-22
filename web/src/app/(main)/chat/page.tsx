'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { ChatRoomList } from '@/components/chat/ChatRoomList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { EmptyState } from '@/components/ui/EmptyState';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function ChatPage() {
  const { user, isLoggedIn } = useAuth(true);
  const isMobile = !useMediaQuery('(min-width: 768px)');
  const {
    rooms,
    messages,
    activeRoom,
    isLoading,
    isTyping,
    fetchRooms,
    sendMessage,
    sendTyping,
    joinRoom,
    leaveRoom,
  } = useChat();

  useEffect(() => {
    if (isLoggedIn) {
      fetchRooms();
    }
  }, [isLoggedIn, fetchRooms]);

  const activeRoomData = rooms.find((r) => r.id === activeRoom);
  const roomName = activeRoomData
    ? activeRoomData.name
      || (activeRoomData.hospital
        ? (typeof activeRoomData.hospital === 'object' ? activeRoomData.hospital.name : 'Hospital')
        : 'Chat')
    : undefined;

  const handleSendMessage = (content: string) => {
    if (activeRoom) {
      sendMessage(activeRoom, content);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (activeRoom) {
      sendTyping(activeRoom, typing);
    }
  };

  // Mobile: show either room list or chat window
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 overflow-hidden">
          {activeRoom ? (
            <div className="h-full flex flex-col">
              <button
                onClick={leaveRoom}
                className="px-4 py-2 text-sm text-primary-600 dark:text-primary-400 font-medium border-b border-gray-200 dark:border-gray-700"
              >
                Back to conversations
              </button>
              <div className="flex-1">
                <ChatWindow
                  messages={messages}
                  currentUserId={user?.id || ''}
                  roomName={roomName}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h1>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ChatRoomList
                  rooms={rooms}
                  activeRoomId={activeRoom}
                  onSelectRoom={joinRoom}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}
        </div>
        <MobileNav />
      </div>
    );
  }

  // Desktop: split view
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Room List */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h1>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatRoomList
              rooms={rooms}
              activeRoomId={activeRoom}
              onSelectRoom={joinRoom}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <ChatWindow
              messages={messages}
              currentUserId={user?.id || ''}
              roomName={roomName}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onTyping={handleTyping}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<MessageSquare className="h-16 w-16" />}
                title="Select a conversation"
                description="Choose a chat from the sidebar to start messaging, or visit a hospital page to initiate a new conversation."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
