// Hooks
export * from './hooks/use-websocket';
export * from './hooks/use-server-sent-events';
export * from './hooks/use-socket-io';

// Components
export * from './components/connection-status';
export * from './components/chat-room';
export * from './components/notification-stream';

// Types
export interface RealtimeConfig {
  websocketUrl?: string;
  sseUrl?: string;
  socketIOUrl?: string;
  enableReconnection?: boolean;
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

export interface RealtimeMessage {
  type: string;
  data: any;
  timestamp?: number;
  id?: string;
}

export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting?: boolean;
  error: string | null;
  connectionAttempts?: number;
  lastEventId?: string | null;
}