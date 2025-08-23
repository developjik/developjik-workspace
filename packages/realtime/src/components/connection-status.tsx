import { ReactNode } from 'react';

export interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
  connectionType?: 'websocket' | 'sse' | 'socket.io';
  className?: string;
  showDetails?: boolean;
  onRetry?: () => void;
}

export function ConnectionStatus({
  isConnected,
  isConnecting,
  error,
  connectionType = 'websocket',
  className = '',
  showDetails = false,
  onRetry,
}: ConnectionStatusProps) {
  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (isConnecting) return 'bg-yellow-500';
    if (isConnected) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isConnecting) return 'Connecting...';
    if (isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getConnectionTypeLabel = () => {
    switch (connectionType) {
      case 'websocket':
        return 'WebSocket';
      case 'sse':
        return 'Server-Sent Events';
      case 'socket.io':
        return 'Socket.IO';
      default:
        return 'Real-time';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`w-3 h-3 rounded-full ${getStatusColor()}`}
        title={`${getConnectionTypeLabel()}: ${getStatusText()}`}
      />
      
      {showDetails && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {getConnectionTypeLabel()}
          </span>
          <span className="text-sm text-gray-600">
            {getStatusText()}
          </span>
          
          {error && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
      
      {error && showDetails && (
        <div className="text-xs text-red-600" title={error}>
          {error.length > 30 ? `${error.substring(0, 30)}...` : error}
        </div>
      )}
    </div>
  );
}

export interface RealtimeProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  isConnected: boolean;
  isConnecting: boolean;
  error?: string | null;
}

export function RealtimeProvider({
  children,
  fallback,
  isConnected,
  isConnecting,
  error,
}: RealtimeProviderProps) {
  if (error && fallback) {
    return <>{fallback}</>;
  }

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Connecting...</span>
      </div>
    );
  }

  return <>{children}</>;
}