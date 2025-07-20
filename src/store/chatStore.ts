import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { TMessageJSON, TParticipant, TServerInfo } from '../types/api';

interface ChatState {
  messages: TMessageJSON[];
  participants: TParticipant[];
  serverInfo: TServerInfo | null;
  lastUpdateTime: number;
  
  setMessages: (messages: TMessageJSON[]) => void;
  addMessages: (messages: TMessageJSON[]) => void;
  updateMessage: (message: TMessageJSON) => void;
  setParticipants: (participants: TParticipant[]) => void;
  updateParticipants: (participants: TParticipant[]) => void;
  setServerInfo: (info: TServerInfo) => void;
  setLastUpdateTime: (time: number) => void;
  clearData: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      participants: [],
      serverInfo: null,
      lastUpdateTime: 0,
      
      setMessages: (messages) => set({ messages }),
      
      addMessages: (newMessages) => set((state) => {
        const messageMap = new Map(state.messages.map(m => [m.uuid, m]));
        newMessages.forEach(msg => messageMap.set(msg.uuid, msg));
        return { messages: Array.from(messageMap.values()).sort((a, b) => 
          a.sentAt - b.sentAt
        )};
      }),
      
      updateMessage: (message) => set((state) => ({
        messages: state.messages.map(m => m.uuid === message.uuid ? message : m)
      })),
      
      setParticipants: (participants) => set({ participants }),
      
      updateParticipants: (updatedParticipants) => set((state) => {
        const participantMap = new Map(state.participants.map(p => [p.uuid, p]));
        updatedParticipants.forEach(p => participantMap.set(p.uuid, p));
        return { participants: Array.from(participantMap.values()) };
      }),
      
      setServerInfo: (info) => set({ serverInfo: info }),
      
      setLastUpdateTime: (time) => set({ lastUpdateTime: time }),
      
      clearData: () => set({
        messages: [],
        participants: [],
        lastUpdateTime: 0
      })
    }),
    {
      name: 'tribe-chat-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);