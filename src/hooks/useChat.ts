import { useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { useChatStore } from '../store/chatStoreSimple';

export const useChat = () => {
  const {
    messages,
    participants,
    serverInfo,
    lastUpdateTime,
    setMessages,
    addMessages,
    setParticipants,
    updateParticipants,
    setServerInfo,
    setLastUpdateTime,
    clearData,
  } = useChatStore();
  
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const initializeChat = useCallback(async () => {
    try {
      const info = await api.getInfo();
      
      if (!serverInfo || serverInfo.sessionUuid !== info.sessionUuid) {
        clearData();
      }
      
      setServerInfo(info);
      
      const [allParticipants, latestMessages] = await Promise.all([
        api.getAllParticipants(),
        api.getLatestMessages(),
      ]);
      
      setParticipants(allParticipants);
      setMessages(latestMessages);
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  }, [serverInfo, clearData, setServerInfo, setParticipants, setMessages, setLastUpdateTime]);
  
  const checkForUpdates = useCallback(async () => {
    // Skip updates if we haven't initialized yet
    if (lastUpdateTime === 0) return;
    
    try {
      const [messageUpdates, participantUpdates] = await Promise.all([
        api.getMessageUpdates(lastUpdateTime),
        api.getParticipantUpdates(lastUpdateTime),
      ]);
      
      if (messageUpdates.length > 0) {
        addMessages(messageUpdates);
      }
      
      if (participantUpdates.length > 0) {
        updateParticipants(participantUpdates);
      }
      
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, [lastUpdateTime, addMessages, updateParticipants, setLastUpdateTime]);
  
  const sendMessage = useCallback(async (text: string) => {
    try {
      const newMessage = await api.sendMessage(text);
      addMessages([newMessage]);
      return newMessage;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [addMessages]);
  
  const loadOlderMessages = useCallback(async () => {
    if (messages.length === 0) return;
    
    try {
      const oldestMessage = messages[0];
      const olderMessages = await api.getOlderMessages(oldestMessage.uuid);
      
      if (olderMessages.length > 0) {
        setMessages([...olderMessages, ...messages]);
      }
      
      return olderMessages.length > 0;
    } catch (error) {
      console.error('Failed to load older messages:', error);
      return false;
    }
  }, [messages, setMessages]);
  
  useEffect(() => {
    initializeChat();
    
    const interval = setInterval(checkForUpdates, 3000);
    updateIntervalRef.current = interval;
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return {
    messages,
    participants,
    sendMessage,
    loadOlderMessages,
    refreshChat: initializeChat,
  };
};