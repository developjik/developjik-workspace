import { useState, useRef, useEffect } from 'react';
import { useWebSocket, WebSocketMessage } from '../hooks/use-websocket';

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  type?: 'message' | 'join' | 'leave' | 'system';
}

export interface ChatRoomProps {
  roomId: string;
  userId: string;
  username: string;
  websocketUrl: string;
  className?: string;
  maxMessages?: number;
}

export function ChatRoom({
  roomId,
  userId,
  username,
  websocketUrl,
  className = '',
  maxMessages = 100,
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const {
    isConnected,
    isConnecting,
    error,
    sendMessage,
  } = useWebSocket({
    url: websocketUrl,
    onMessage: (message: WebSocketMessage) => {
      switch (message.type) {
        case 'chat-message':
          setMessages(prev => {
            const newMessages = [...prev, message.data].slice(-maxMessages);
            return newMessages;
          });
          break;

        case 'user-typing':
          setIsTyping(prev => {
            if (!prev.includes(message.data.username) && message.data.userId !== userId) {
              return [...prev, message.data.username];
            }
            return prev;
          });
          break;

        case 'user-stopped-typing':
          setIsTyping(prev => prev.filter(user => user !== message.data.username));
          break;

        case 'user-joined':
          setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            userId: 'system',
            username: 'System',
            message: `${message.data.username} joined the room`,
            timestamp: Date.now(),
            type: 'join',
          }].slice(-maxMessages));
          break;

        case 'user-left':
          setMessages(prev => [...prev, {
            id: `system-${Date.now()}`,
            userId: 'system',
            username: 'System',
            message: `${message.data.username} left the room`,
            timestamp: Date.now(),
            type: 'leave',
          }].slice(-maxMessages));
          break;
      }
    },
    onOpen: () => {
      // Join room when connected
      sendMessage({
        type: 'join-room',
        data: { roomId, userId, username },
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !isConnected) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      userId,
      username,
      message: inputValue.trim(),
      timestamp: Date.now(),
      type: 'message',
    };

    sendMessage({
      type: 'chat-message',
      data: message,
    });

    setInputValue('');
    
    // Stop typing indicator
    sendMessage({
      type: 'stop-typing',
      data: { roomId, userId, username },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    // Send typing indicator
    sendMessage({
      type: 'typing',
      data: { roomId, userId, username },
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({
        type: 'stop-typing',
        data: { roomId, userId, username },
      });
    }, 2000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStyle = (message: ChatMessage) => {
    switch (message.type) {
      case 'join':
        return 'text-green-600 italic text-sm';
      case 'leave':
        return 'text-red-600 italic text-sm';
      case 'system':
        return 'text-gray-600 italic text-sm';
      default:
        return message.userId === userId ? 'text-right' : 'text-left';
    }
  };

  return (
    <div className={`flex flex-col h-96 border border-gray-300 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="font-semibold text-gray-900">Chat Room: {roomId}</h3>
        <div className="flex items-center space-x-2 mt-1">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
            }`} 
          />
          <span className="text-xs text-gray-600">
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
          {error && (
            <span className="text-xs text-red-600">({error})</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((message) => (
          <div key={message.id} className={getMessageStyle(message)}>
            {message.type === 'message' ? (
              <div className={`max-w-xs mx-2 ${
                message.userId === userId ? 'ml-auto' : 'mr-auto'
              }`}>
                <div className={`p-2 rounded-lg ${
                  message.userId === userId 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.message}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.userId !== userId && `${message.username} • `}
                  {formatTime(message.timestamp)}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className={getMessageStyle(message)}>
                  {message.message}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping.length > 0 && (
          <div className="text-left mx-2">
            <div className="max-w-xs bg-gray-100 p-2 rounded-lg">
              <p className="text-sm text-gray-600 italic">
                {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}