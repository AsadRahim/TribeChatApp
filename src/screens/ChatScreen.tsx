import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { MessageItem } from '../components/MessageItem';
import { MessageInput } from '../components/MessageInput';
import { DateSeparator } from '../components/DateSeparator';
import { useChat } from '../hooks/useChat';
import { groupMessages, shouldShowDateSeparator, formatDate } from '../utils/messageGrouping';
import { TMessageJSON } from '../types/api';

type ListItem = 
  | { type: 'date'; date: string }
  | { type: 'message'; message: TMessageJSON; showHeader: boolean };

export const ChatScreen: React.FC = () => {
  const { messages, participants, sendMessage, loadOlderMessages, refreshChat } = useChat();
  const [refreshing, setRefreshing] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const getParticipant = useCallback((uuid: string) => {
    return participants.find(p => p.uuid === uuid);
  }, [participants]);
  
  const handleSendMessage = useCallback(async (text: string) => {
    try {
      setSendingMessage(true);
      await sendMessage(text);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  }, [sendMessage]);
  
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshChat();
    setRefreshing(false);
  }, [refreshChat]);
  
  const handleLoadMore = useCallback(async () => {
    if (loadingOlder) return;
    
    setLoadingOlder(true);
    await loadOlderMessages();
    setLoadingOlder(false);
  }, [loadingOlder, loadOlderMessages]);
  
  const prepareListData = useCallback((): ListItem[] => {
    const items: ListItem[] = [];
    const messageGroups = groupMessages(messages);
    
    let lastTimestamp: number | null = null;
    
    messageGroups.forEach((group) => {
      group.messages.forEach((message, index) => {
        if (shouldShowDateSeparator(lastTimestamp, message.sentAt)) {
          items.push({
            type: 'date',
            date: formatDate(message.sentAt),
          });
        }
        
        items.push({
          type: 'message',
          message,
          showHeader: index === 0,
        });
        
        lastTimestamp = message.sentAt;
      });
    });
    
    return items;
  }, [messages]);
  
  const renderItem: ListRenderItem<ListItem> = useCallback(({ item }) => {
    if (item.type === 'date') {
      return <DateSeparator date={item.date} />;
    }
    
    return (
      <MessageItem
        message={item.message}
        participant={getParticipant(item.message.authorUuid)}
        showHeader={item.showHeader}
      />
    );
  }, [getParticipant]);
  
  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.type === 'date') {
      return `date-${item.date}`;
    }
    return `msg-${item.message.uuid}`;
  }, []);
  
  const listData = useMemo(() => prepareListData(), [prepareListData]);
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingOlder ? (
            <ActivityIndicator style={styles.loader} />
          ) : null
        }
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        removeClippedSubviews={false}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
      <MessageInput onSend={handleSendMessage} disabled={sendingMessage} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
  },
  loader: {
    paddingVertical: 20,
  },
});