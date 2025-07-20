import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { MessageInput } from '../components/MessageInput';

export const ChatScreenSimple: React.FC = () => {
  const [messages, setMessages] = React.useState([
    { id: '1', text: 'Welcome to Tribe Chat!', author: 'System' },
    { id: '2', text: 'This is a test message', author: 'Test User' },
  ]);

  const handleSend = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      author: 'You',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.message}>{item.text}</Text>
          </View>
        )}
        style={styles.list}
      />
      <MessageInput onSend={handleSend} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  author: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
  },
});