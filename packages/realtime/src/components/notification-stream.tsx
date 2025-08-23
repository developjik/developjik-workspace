import { useState, useEffect } from 'react';
import { useServerSentEvents, SSEMessage } from '../hooks/use-server-sent-events';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface NotificationStreamProps {
  sseUrl: string;
  className?: string;
  maxNotifications?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export function NotificationStream({
  sseUrl,
  className = '',
  maxNotifications = 5,
  autoHide = true,
  autoHideDelay = 5000,
}: NotificationStreamProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { isConnected, isConnecting, error } = useServerSentEvents({
    url: sseUrl,
    onMessage: (message: SSEMessage) => {
      if (message.type === 'notification') {
        const notification: Notification = {
          id: message.id || `notif-${Date.now()}`,
          ...message.data,
          timestamp: Date.now(),
        };

        setNotifications(prev => {
          const updated = [notification, ...prev].slice(0, maxNotifications);
          return updated;
        });

        // Auto-hide notification
        if (autoHide) {
          setTimeout(() => {
            removeNotification(notification.id);
          }, autoHideDelay);
        }
      }
    },
  });

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 w-96 space-y-2 ${className}`}>
      {/* Connection Status */}
      <div className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center space-x-2">
          <div 
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
            }`} 
          />
          <span className="text-sm font-medium">
            Notifications {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">Connection Error: {error}</p>
        </div>
      )}

      {/* Notifications */}
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border ${getNotificationColor(notification.type)} animate-slide-in`}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {notification.message}
                </p>
                
                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    {notification.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={action.action}
                        className="text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {/* Empty State */}
      {notifications.length === 0 && isConnected && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-500">No new notifications</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}