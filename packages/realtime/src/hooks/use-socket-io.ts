import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface SocketIOState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  socket: Socket | null;
}

export interface UseSocketIOOptions {
  url: string;
  options?: {
    transports?: string[];
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
    timeout?: number;
    auth?: Record<string, any>;
    query?: Record<string, any>;
  };
  onConnect?: (socket: Socket) => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attempt: number) => void;
}

export function useSocketIO(options: UseSocketIOOptions) {
  const {
    url,
    options: socketOptions = {},
    onConnect,
    onDisconnect,
    onError,
    onReconnect,
  } = options;

  const [state, setState] = useState<SocketIOState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    socket: null,
  });

  const socketRef = useRef<Socket | null>(null);
  const listenersRef = useRef<Map<string, Function[]>>(new Map());

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const socket = io(url, {
        autoConnect: false,
        ...socketOptions,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
          socket,
        }));

        onConnect?.(socket);
      });

      socket.on('disconnect', (reason) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        onDisconnect?.(reason);
      });

      socket.on('connect_error', (error) => {
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: error.message,
        }));

        onError?.(error);
      });

      socket.on('reconnect', (attempt) => {
        onReconnect?.(attempt);
      });

      // Re-register all event listeners
      listenersRef.current.forEach((handlers, event) => {
        handlers.forEach(handler => socket.on(event, handler));
      });

      socket.connect();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, [url, socketOptions, onConnect, onDisconnect, onError, onReconnect]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      socket: null,
    });
  }, []);

  const emit = useCallback((event: string, ...args: any[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    }
  }, []);

  const on = useCallback((event: string, handler: Function) => {
    // Store listener for re-registration on reconnect
    if (!listenersRef.current.has(event)) {
      listenersRef.current.set(event, []);
    }
    listenersRef.current.get(event)!.push(handler);

    // Register with current socket if connected
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }

    // Return cleanup function
    return () => {
      const handlers = listenersRef.current.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }

      if (socketRef.current) {
        socketRef.current.off(event, handler);
      }
    };
  }, []);

  const off = useCallback((event: string, handler?: Function) => {
    if (handler) {
      const handlers = listenersRef.current.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    } else {
      listenersRef.current.delete(event);
    }

    if (socketRef.current) {
      socketRef.current.off(event, handler);
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
    emit,
    on,
    off,
  };
}