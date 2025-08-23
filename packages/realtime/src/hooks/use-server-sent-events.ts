import { useEffect, useRef, useState, useCallback } from 'react';

export interface SSEMessage {
  type: string;
  data: any;
  id?: string;
  retry?: number;
}

export interface SSEState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastEventId: string | null;
}

export interface UseSSEOptions {
  url: string;
  withCredentials?: boolean;
  headers?: Record<string, string>;
  onMessage?: (message: SSEMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: (event: Event) => void;
  shouldReconnect?: boolean;
}

export function useServerSentEvents(options: UseSSEOptions) {
  const {
    url,
    withCredentials = false,
    headers = {},
    onMessage,
    onError,
    onOpen,
    shouldReconnect = true,
  } = options;

  const [state, setState] = useState<SSEState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastEventId: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) return;

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    try {
      // Build URL with last event ID if available
      const urlWithParams = new URL(url);
      if (state.lastEventId) {
        urlWithParams.searchParams.set('lastEventId', state.lastEventId);
      }

      const eventSource = new EventSource(urlWithParams.toString(), {
        withCredentials,
      });

      eventSourceRef.current = eventSource;

      eventSource.onopen = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));

        onOpen?.(event);
      };

      eventSource.onmessage = (event) => {
        try {
          const message: SSEMessage = {
            type: 'message',
            data: JSON.parse(event.data),
            id: event.lastEventId,
          };

          setState(prev => ({
            ...prev,
            lastEventId: event.lastEventId,
          }));

          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse SSE message:', error);
        }
      };

      eventSource.onerror = (event) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: 'Server-Sent Events connection error',
        }));

        onError?.(event);

        // Auto-reconnect if enabled
        if (shouldReconnect) {
          reconnectTimeoutRef.current = setTimeout(() => {
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              eventSourceRef.current = null;
            }
            connect();
          }, 3000);
        }
      };

      // Add custom event listeners
      eventSource.addEventListener('error', (event) => {
        console.error('SSE Error:', event);
      });

      eventSource.addEventListener('heartbeat', (event) => {
        // Handle heartbeat to keep connection alive
        console.log('SSE Heartbeat:', event.data);
      });

    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [url, withCredentials, state.lastEventId, onMessage, onError, onOpen, shouldReconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastEventId: null,
    });
  }, []);

  const addEventHandler = useCallback((type: string, handler: (event: MessageEvent) => void) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.addEventListener(type, handler);
    }
  }, []);

  const removeEventHandler = useCallback((type: string, handler: (event: MessageEvent) => void) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.removeEventListener(type, handler);
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
    addEventHandler,
    removeEventHandler,
  };
}