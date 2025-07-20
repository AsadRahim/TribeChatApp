# Tribe Chat App

A cross-platform React Native single room chat application built with Expo, TypeScript, and Zustand.

## Features

### Required Features (Implemented)
- Message list with all chat messages
- Message headers with avatar, name, and timestamp
- Edited message indicators
- Reaction display below messages
- Grouped consecutive messages from same participant
- Input bar for sending new messages
- Image attachment display

### Additional Features
- Date separators between messages from different days
- Persistent data storage using AsyncStorage
- Real-time updates via polling (3-second intervals)
- Pull-to-refresh functionality
- Lazy loading of older messages on scroll

## Tech Stack

- **React Native** with **Expo** for cross-platform development
- **TypeScript** for type safety
- **Zustand** for state management
- **AsyncStorage** for persistent storage
- **React Hooks** for component logic

## Project Structure

```
TribeChatApp/
├── src/
│   ├── components/
│   │   ├── MessageItem.tsx      # Individual message component
│   │   ├── MessageInput.tsx     # Message input component
│   │   └── DateSeparator.tsx    # Date separator component
│   ├── hooks/
│   │   └── useChat.ts           # Custom hook for chat functionality
│   ├── screens/
│   │   └── ChatScreen.tsx       # Main chat screen
│   ├── services/
│   │   └── api.ts               # API service layer
│   ├── store/
│   │   └── chatStore.ts         # Zustand store configuration
│   ├── types/
│   │   └── api.ts               # TypeScript type definitions
│   └── utils/
│       └── messageGrouping.ts   # Message grouping utilities
├── App.tsx                      # Main app component
├── package.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd TribeChatApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device/emulator**
   - For iOS: Press `i` or run `npm run ios`
   - For Android: Press `a` or run `npm run android`
   - For Web: Press `w` or run `npm run web`

## Architecture Decisions

### State Management
- **Zustand** was chosen for its simplicity and built-in persistence support
- Store is persisted using AsyncStorage for offline access
- Session UUID tracking ensures data is cleared when server resets

### Data Synchronization
- Initial load fetches latest 25 messages and all participants
- Polling every 3 seconds for updates using `/messages/updates` and `/participants/updates`
- Efficient update mechanism only fetches changes since last update time

### Message Grouping
- Messages from the same participant are grouped together
- Only the first message in a group shows the header (avatar, name, time)
- Improves visual clarity and reduces UI clutter

### Performance Optimizations
- Lazy loading of older messages when scrolling to top
- Efficient React rendering with proper key extraction
- Memoized participant lookup to avoid unnecessary re-renders

## API Integration

The app integrates with the Tribe Chat Server API:
- Base URL: `https://dummy-chat-server.tribechat.com/api`
- Implements all required endpoints for messages and participants
- Handles session management and API version checking

## Development Notes

### AI Tools Usage
This project was developed without relying on AI code generation tools. All architecture decisions, component designs, and implementation details were crafted manually to demonstrate understanding of React Native development patterns and best practices.

### Future Enhancements
- Bottom sheets for reaction and participant details
- Image preview overlay
- @mentions functionality
- Reply-to-message UI improvements
- WebSocket integration for real-time updates
- Message search functionality
- Offline message queue

## Testing

To test the app:
1. Send messages using the input bar
2. Pull down to refresh and fetch latest messages
3. Scroll up to load older messages
4. Observe automatic updates every 3 seconds
5. Force quit and reopen to test data persistence

## Known Limitations

- Polling approach may not be ideal for battery life
- No push notifications
- Limited to single chat room
- No file attachments other than images
- No message deletion or editing capabilities