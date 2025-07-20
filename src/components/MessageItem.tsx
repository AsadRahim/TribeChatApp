import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { TMessageJSON, TParticipant } from '../types/api';
import { formatTime } from '../utils/messageGrouping';

interface MessageItemProps {
  message: TMessageJSON;
  participant: TParticipant | undefined;
  showHeader: boolean;
  onReactionPress?: (message: TMessageJSON) => void;
  onImagePress?: (url: string) => void;
}

export const MessageItem = memo<MessageItemProps>(({
  message,
  participant,
  showHeader,
  onReactionPress,
  onImagePress
}) => {
  const isOwnMessage = message.authorUuid === 'you';
  
  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      {showHeader && (
        <View style={styles.header}>
          {participant?.avatarUrl ? (
            <Image source={{ uri: participant.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {participant?.name.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          )}
          <Text style={styles.name}>{participant?.name || 'Unknown'}</Text>
          <Text style={styles.time}>{formatTime(message.sentAt)}</Text>
          {message.updatedAt && message.updatedAt !== message.sentAt && <Text style={styles.edited}>(edited)</Text>}
        </View>
      )}
      
      {message.replyToMessage && (
        <View style={styles.replyContainer}>
          <View style={styles.replyBar} />
          <View>
            <Text style={styles.replyName}>
              {message.replyToMessage.authorUuid === 'you' ? 'You' : 'Other'}
            </Text>
            <Text style={styles.replyText} numberOfLines={2}>
              {message.replyToMessage.text}
            </Text>
          </View>
        </View>
      )}
      
      <View style={[
        styles.messageContent, 
        !showHeader && styles.messageContentNoHeader,
        isOwnMessage && styles.ownMessageContent
      ]}>
        <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>{message.text}</Text>
        
        {message.attachments.length > 0 && (
          <View style={styles.attachments}>
            {message.attachments.map((attachment) => (
              attachment.type === 'image' && (
                <TouchableOpacity
                  key={attachment.uuid}
                  onPress={() => onImagePress?.(attachment.url)}
                >
                  <Image
                    source={{ uri: attachment.previewUrl || attachment.url }}
                    style={styles.attachmentImage}
                  />
                </TouchableOpacity>
              )
            ))}
          </View>
        )}
      </View>
      
      {message.reactions.length > 0 && (
        <TouchableOpacity
          style={styles.reactions}
          onPress={() => onReactionPress?.(message)}
        >
          {message.reactions.slice(0, 3).map((reaction, index) => (
            <View key={index} style={styles.reactionBubble}>
              <Text style={styles.reactionEmoji}>{reaction.value}</Text>
            </View>
          ))}
          {message.reactions.length > 3 && (
            <View style={styles.reactionBubble}>
              <Text style={styles.reactionCount}>+{message.reactions.length - 3}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  edited: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 4,
  },
  messageContent: {
    marginLeft: 50,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  messageContentNoHeader: {
    marginLeft: 50,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  attachments: {
    marginTop: 8,
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  reactions: {
    flexDirection: 'row',
    marginLeft: 50,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  reactionBubble: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  replyContainer: {
    flexDirection: 'row',
    marginLeft: 50,
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  replyBar: {
    width: 0,
    backgroundColor: 'transparent',
    marginRight: 0,
  },
  replyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  replyText: {
    fontSize: 12,
    color: '#666',
  },
  ownMessageContent: {
    backgroundColor: '#007AFF',
    marginLeft: 'auto',
    marginRight: 0,
  },
  ownMessageText: {
    color: '#fff',
  },
});