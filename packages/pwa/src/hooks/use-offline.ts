import { useState, useEffect } from 'react';

export interface OfflineStatus {
  isOnline: boolean;
  isOffline: boolean;
  downlink?: number;
  effectiveType?: string;
  saveData?: boolean;
}

export function useOffline(): OfflineStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [connectionInfo, setConnectionInfo] = useState<{
    downlink?: number;
    effectiveType?: string;
    saveData?: boolean;
  }>({});

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateConnectionInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      if (connection) {
        setConnectionInfo({
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
          saveData: connection.saveData,
        });
      }
    };

    // Add event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Listen for connection changes
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      updateConnectionInfo(); // Initial call
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    ...connectionInfo,
  };
}

export function useNetworkStatus() {
  const offlineStatus = useOffline();
  
  const getNetworkQuality = (): 'fast' | 'slow' | 'offline' => {
    if (!offlineStatus.isOnline) return 'offline';
    
    const { effectiveType, downlink } = offlineStatus;
    
    if (effectiveType === '4g' || (downlink && downlink > 1.5)) {
      return 'fast';
    }
    
    return 'slow';
  };

  return {
    ...offlineStatus,
    quality: getNetworkQuality(),
    isSlow: getNetworkQuality() === 'slow',
    isFast: getNetworkQuality() === 'fast',
  };
}