import { useEffect, useRef, useState, useCallback } from 'react';

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp?: number;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  isReconnecting: boolean;
  error: string | null;
  connectionAttempts: number;
}

export interface UseWebSocketOptions {
  url: string;
  protocols?: string | string[];
  maxReconnectAttempts?: number;
  reconnectInterval?: number;
  shouldReconnect?: (error?: Event, response?: CloseEvent) => boolean;
  onOpen?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onReconnect?: (attempts: number) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const {
    url,
    protocols,
    maxReconnectAttempts = 3,
    reconnectInterval = 3000,
    shouldReconnect = () => true,
    onOpen,
    onMessage,
    onClose,
    onError,
    onReconnect,
  } = options;

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    isReconnecting: false,
    error: null,
    connectionAttempts: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageQueueRef = useRef<WebSocketMessage[]>([]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      const ws = new WebSocket(url, protocols);
      wsRef.current = ws;

      ws.onopen = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          isReconnecting: false,
          connectionAttempts: 0,
          error: null,
        }));

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const message = messageQueueRef.current.shift()!;
          ws.send(JSON.stringify(message));
        }

        onOpen?.(event);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        onClose?.(event);

        // Attempt to reconnect
        if (shouldReconnect(undefined, event) && state.connectionAttempts < maxReconnectAttempts) {
          setState(prev => ({
            ...prev,
            isReconnecting: true,
            connectionAttempts: prev.connectionAttempts + 1,
          }));

          onReconnect?.(state.connectionAttempts + 1);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'WebSocket connection error',
        }));

        onError?.(event);
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [url, protocols, maxReconnectAttempts, reconnectInterval, shouldReconnect, onOpen, onMessage, onClose, onError, onReconnect, state.connectionAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      isReconnecting: false,
      error: null,
      connectionAttempts: 0,
    });
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }));
    } else {
      // Queue message if not connected
      messageQueueRef.current.push({
        ...message,
        timestamp: Date.now(),
      });
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
  };
}