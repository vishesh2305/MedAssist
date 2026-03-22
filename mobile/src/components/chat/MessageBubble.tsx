import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { ChatMessage } from '../../types';
import { formatTime } from '../../lib/utils';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const theme = useTheme();

  if (message.type === 'system') {
    return (
      <View style={styles.systemContainer}>
        <Text style={[styles.systemText, { color: theme.colors.textTertiary }]}>
          {message.content}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMine ? styles.containerRight : styles.containerLeft]}>
      <View
        style={[
          styles.bubble,
          isMine
            ? [
                styles.bubbleRight,
                { backgroundColor: theme.colors.messageSent },
              ]
            : [
                styles.bubbleLeft,
                { backgroundColor: theme.colors.messageReceived },
              ],
        ]}
      >
        <Text
          style={[
            styles.content,
            {
              color: isMine
                ? theme.colors.messageSentText
                : theme.colors.messageReceivedText,
            },
          ]}
        >
          {message.content}
        </Text>
        <View style={styles.meta}>
          <Text
            style={[
              styles.time,
              {
                color: isMine
                  ? 'rgba(255,255,255,0.7)'
                  : theme.colors.textTertiary,
              },
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
          {isMine && (
            <Ionicons
              name={message.isRead ? 'checkmark-done' : 'checkmark'}
              size={14}
              color={message.isRead ? '#60A5FA' : 'rgba(255,255,255,0.6)'}
              style={styles.checkmark}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 12,
  },
  containerLeft: {
    alignItems: 'flex-start',
  },
  containerRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleLeft: {
    borderRadius: 18,
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    borderRadius: 18,
    borderTopRightRadius: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
  },
  checkmark: {
    marginLeft: 4,
  },
  systemContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  systemText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
