import { TMessageJSON, TParticipant, TServerInfo } from '../types/api';

const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export const api = {
  async getInfo(): Promise<TServerInfo> {
    const response = await fetch(`${API_BASE}/info`);
    if (!response.ok) throw new Error('Failed to fetch server info');
    return response.json();
  },

  async getAllMessages(): Promise<TMessageJSON[]> {
    const response = await fetch(`${API_BASE}/messages/all`);
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  async getLatestMessages(): Promise<TMessageJSON[]> {
    const response = await fetch(`${API_BASE}/messages/latest`);
    if (!response.ok) throw new Error('Failed to fetch latest messages');
    return response.json();
  },

  async getOlderMessages(refMessageUuid: string): Promise<TMessageJSON[]> {
    const response = await fetch(`${API_BASE}/messages/older/${refMessageUuid}`);
    if (!response.ok) throw new Error('Failed to fetch older messages');
    return response.json();
  },

  async getMessageUpdates(time: number): Promise<TMessageJSON[]> {
    const response = await fetch(`${API_BASE}/messages/updates/${time}`);
    if (!response.ok) throw new Error('Failed to fetch message updates');
    return response.json();
  },

  async sendMessage(text: string): Promise<TMessageJSON> {
    const response = await fetch(`${API_BASE}/messages/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },

  async getAllParticipants(): Promise<TParticipant[]> {
    const response = await fetch(`${API_BASE}/participants/all`);
    if (!response.ok) throw new Error('Failed to fetch participants');
    return response.json();
  },

  async getParticipantUpdates(time: number): Promise<TParticipant[]> {
    const response = await fetch(`${API_BASE}/participants/updates/${time}`);
    if (!response.ok) throw new Error('Failed to fetch participant updates');
    return response.json();
  },
};