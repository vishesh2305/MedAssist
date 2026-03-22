import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { ChatRoom } from '../../types';
import { Avatar } from '../ui/Avatar';
import { formatMessageTime, truncateText } from '../../lib/utils';

interface ChatRoomItemProps {
  room: ChatRoom;
  onPress: () => void;
}

export function ChatRoomItem({ room, onPress }: ChatRoomItemProps) {
  const theme = useTheme();
  const hasUnread = room.unreadCount > 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, { borderBottomColor: theme.colors.borderLight }]}
    >
      <Avatar
        uri={room.hospitalAvatar}
        firstName={room.hospitalName?.split(' ')[0] || 'S'}
        lastName={room.hospitalName?.split(' ')[1] || ''}
        size={52}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.name,
              { color: theme.colors.text },
              hasUnread && styles.nameBold,
            ]}
            numberOfLines={1}
          >
            {room.hospitalName || 'Support'}
          </Text>
          {room.lastMessage && (
            <Text
              style={[
                styles.time,
                { color: hasUnread ? theme.colors.primary : theme.colors.textTertiary },
              ]}
            >
              {formatMessageTime(room.lastMessage.createdAt)}
            </Text>
          )}
        </View>
        <View style={styles.bottomRow}>
          <Text
            style={[
              styles.lastMessage,
              {
                color: hasUnread ? theme.colors.text : theme.colors.textSecondary,
                fontWeight: hasUnread ? '500' : '400',
              },
            ]}
            numberOfLines={1}
          >
            {room.lastMessage ? truncateText(room.lastMessage.content, 50) : 'Start a conversation'}
          </Text>
          {hasUnread && (
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>
                {room.unreadCount > 99 ? '99+' : room.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  nameBold: {
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
