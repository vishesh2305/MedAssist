import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { RootStackParamList, ChatRoom } from '../types';
import { useChat } from '../hooks/useChat';
import { ChatRoomItem } from '../components/chat/ChatRoomItem';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { t } from '../i18n';

type ChatListNavProp = StackNavigationProp<RootStackParamList>;

export function ChatListScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<ChatListNavProp>();
  const { rooms, isLoading, fetchRooms } = useChat();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  }, [fetchRooms]);

  const handleRoomPress = (room: ChatRoom) => {
    navigation.navigate('ChatRoom', {
      roomId: room.id,
      title: room.hospitalName || 'Support',
    });
  };

  const renderRoom = useCallback(
    ({ item }: { item: ChatRoom }) => (
      <ChatRoomItem room={item} onPress={() => handleRoomPress(item)} />
    ),
    []
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('chat.title')}
        </Text>
      </View>

      {isLoading && rooms.length === 0 ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }, (_, i) => (
            <View key={i} style={styles.skeletonRow}>
              <Skeleton width={52} height={52} borderRadius={26} />
              <View style={styles.skeletonContent}>
                <Skeleton width="60%" height={16} style={styles.skeletonMb} />
                <Skeleton width="80%" height={14} />
              </View>
            </View>
          ))}
        </View>
      ) : rooms.length === 0 ? (
        <EmptyState
          icon="chatbubbles-outline"
          title={t('chat.noConversations')}
          message={t('chat.startChat')}
        />
      ) : (
        <FlatList
          data={rooms}
          renderItem={renderRoom}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.8}
      >
        <Ionicons name="create-outline" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonMb: {
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
