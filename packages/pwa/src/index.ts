// Service Worker
export * from './service-worker';

// Offline Storage
export { offlineStorage } from './offline-storage';

// Hooks
export * from './hooks/use-offline';
export * from './hooks/use-pwa';

// Components
export * from './components/offline-indicator';
export * from './components/pwa-install-prompt';

// Types
export interface PWAConfig {
  enableOfflineSync?: boolean;
  syncEndpoint?: string;
  offlineStorageQuota?: number;
  notificationConfig?: {
    icon?: string;
    badge?: string;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  };
}

export interface OfflineDataItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export interface CachedResponse {
  url: string;
  method: string;
  headers: Record<string, string>;
  data: any;
  timestamp: number;
  expires: number;
}

export interface UserPreference {
  key: string;
  value: any;
  timestamp: number;
}