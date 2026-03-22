import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTheme } from '../theme';
import { RootStackParamList, ChatMessage } from '../types';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { EmptyState } from '../components/ui/EmptyState';

type ChatNavProp = StackNavigationProp<RootStackParamList, 'ChatRoom'>;
type ChatRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

interface Props {
  navigation: ChatNavProp;
  route: ChatRouteProp;
}

export function ChatScreen({ navigation, route }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { roomId, title } = route.params;
  const user = useAuthStore((s) => s.user);
  const {
    messages,
    isLoading,
    isSending,
    typingUsers,
    sendMessage,
    setTyping,
  } = useChat(roomId);

  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [navigation, title]);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} isMine={item.senderId === user?.id} />
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {messages.length === 0 && !isLoading ? (
        <EmptyState
          icon="chatbubble-outline"
          title="Start the conversation"
          message="Send a message to get started."
        />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messageList}
        />
      )}

      <TypingIndicator visible={typingUsers.length > 0} />

      <View style={{ paddingBottom: insets.bottom }}>
        <ChatInput
          onSend={sendMessage}
          onTyping={setTyping}
          disabled={isSending}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    paddingVertical: 8,
  },
});
