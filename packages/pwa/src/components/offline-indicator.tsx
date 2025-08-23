import { useOffline, useNetworkStatus } from '../hooks/use-offline';

interface OfflineIndicatorProps {
  className?: string;
  showQuality?: boolean;
}

export function OfflineIndicator({ 
  className = '', 
  showQuality = false 
}: OfflineIndicatorProps) {
  const { isOnline, isOffline } = useOffline();
  const { quality, effectiveType, downlink, saveData } = useNetworkStatus();

  if (isOnline && !showQuality) return null;

  const getStatusColor = () => {
    if (isOffline) return 'bg-red-500';
    if (quality === 'slow') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (isOffline) return 'Offline';
    if (quality === 'slow') return 'Slow connection';
    return 'Online';
  };

  const getNetworkInfo = () => {
    if (isOffline) return '';
    
    const info = [];
    if (effectiveType) info.push(effectiveType.toUpperCase());
    if (downlink) info.push(`${downlink.toFixed(1)}Mbps`);
    if (saveData) info.push('Data Saver');
    
    return info.length > 0 ? ` (${info.join(', ')})` : '';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`w-3 h-3 rounded-full ${getStatusColor()}`}
        title={`${getStatusText()}${getNetworkInfo()}`}
      />
      <span className="text-sm font-medium">
        {getStatusText()}
        {showQuality && getNetworkInfo()}
      </span>
    </div>
  );
}

interface OfflineToastProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export function OfflineToast({ isVisible, onDismiss }: OfflineToastProps) {
  const { isOffline } = useOffline();

  if (!isVisible || !isOffline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
          <div>
            <h4 className="font-semibold">You're offline</h4>
            <p className="text-sm text-gray-300 mt-1">
              Some features may not be available. We'll sync your changes when you're back online.
            </p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white ml-4"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}