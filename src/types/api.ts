export interface TReaction {
  authorUuid: string;
  value: string;
}

export interface TAttachment {
  uuid: string;
  type: string;
  url: string;
  previewUrl?: string;
  name?: string;
  size?: number;
}

export interface TMessageJSON {
  uuid: string;
  text: string;
  authorUuid: string;
  sentAt: number;
  updatedAt?: number;
  reactions: TReaction[];
  attachments: TAttachment[];
  replyToMessage?: {
    uuid: string;
    text: string;
    authorUuid: string;
  };
}

export interface TParticipant {
  uuid: string;
  name: string;
  avatarUrl?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface TServerInfo {
  sessionUuid: string;
  apiVersion: number;
}