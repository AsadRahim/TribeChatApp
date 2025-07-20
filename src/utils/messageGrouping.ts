import { TMessageJSON } from '../types/api';

export interface MessageGroup {
  participantUuid: string;
  messages: TMessageJSON[];
  startTime: Date;
}

export function groupMessages(messages: TMessageJSON[]): MessageGroup[] {
  if (messages.length === 0) return [];
  
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup | null = null;
  
  messages.forEach((message) => {
    const messageTime = new Date(message.sentAt);
    
    if (!currentGroup || currentGroup.participantUuid !== message.authorUuid) {
      currentGroup = {
        participantUuid: message.authorUuid,
        messages: [message],
        startTime: messageTime
      };
      groups.push(currentGroup);
    } else {
      currentGroup.messages.push(message);
    }
  });
  
  return groups;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined 
    });
  }
}

export function shouldShowDateSeparator(prevTimestamp: number | null, currentTimestamp: number): boolean {
  if (!prevTimestamp) return true;
  
  const prevDate = new Date(prevTimestamp);
  const currentDate = new Date(currentTimestamp);
  
  return prevDate.toDateString() !== currentDate.toDateString();
}