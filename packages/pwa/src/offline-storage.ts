import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface OfflineDB extends DBSchema {
  'offline-data': {
    key: string;
    value: {
      id: string;
      type: string;
      data: any;
      timestamp: number;
      synced: boolean;
    };
    indexes: { 'by-type': string; 'by-timestamp': number };
  };
  'user-preferences': {
    key: string;
    value: {
      key: string;
      value: any;
      timestamp: number;
    };
  };
  'cached-responses': {
    key: string;
    value: {
      url: string;
      method: string;
      headers: Record<string, string>;
      data: any;
      timestamp: number;
      expires: number;
    };
    indexes: { 'by-url': string; 'by-expires': number };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<OfflineDB> | null = null;
  private readonly dbName = 'offline-storage';
  private readonly version = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<OfflineDB>(this.dbName, this.version, {
      upgrade(db) {
        // Offline data store
        if (!db.objectStoreNames.contains('offline-data')) {
          const offlineStore = db.createObjectStore('offline-data', {
            keyPath: 'id',
          });
          offlineStore.createIndex('by-type', 'type');
          offlineStore.createIndex('by-timestamp', 'timestamp');
        }

        // User preferences store
        if (!db.objectStoreNames.contains('user-preferences')) {
          db.createObjectStore('user-preferences', {
            keyPath: 'key',
          });
        }

        // Cached responses store
        if (!db.objectStoreNames.contains('cached-responses')) {
          const cacheStore = db.createObjectStore('cached-responses', {
            keyPath: 'url',
          });
          cacheStore.createIndex('by-url', 'url');
          cacheStore.createIndex('by-expires', 'expires');
        }
      },
    });
  }

  async storeOfflineData(type: string, data: any): Promise<string> {
    await this.init();
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.add('offline-data', {
      id,
      type,
      data,
      timestamp: Date.now(),
      synced: false,
    });

    return id;
  }

  async getOfflineData(type?: string): Promise<any[]> {
    await this.init();
    
    if (type) {
      return this.db!.getAllFromIndex('offline-data', 'by-type', type);
    }
    
    return this.db!.getAll('offline-data');
  }

  async markAsSynced(id: string): Promise<void> {
    await this.init();
    const item = await this.db!.get('offline-data', id);
    
    if (item) {
      item.synced = true;
      await this.db!.put('offline-data', item);
    }
  }

  async clearSyncedData(): Promise<void> {
    await this.init();
    const allData = await this.db!.getAll('offline-data');
    const syncedData = allData.filter(item => item.synced);
    
    for (const item of syncedData) {
      await this.db!.delete('offline-data', item.id);
    }
  }

  async storeUserPreference(key: string, value: any): Promise<void> {
    await this.init();
    
    await this.db!.put('user-preferences', {
      key,
      value,
      timestamp: Date.now(),
    });
  }

  async getUserPreference(key: string): Promise<any> {
    await this.init();
    const result = await this.db!.get('user-preferences', key);
    return result?.value;
  }

  async cacheResponse(url: string, method: string, headers: Record<string, string>, data: any, ttl: number = 300000): Promise<void> {
    await this.init();
    
    await this.db!.put('cached-responses', {
      url: `${method}:${url}`,
      method,
      headers,
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl,
    });
  }

  async getCachedResponse(url: string, method: string = 'GET'): Promise<any> {
    await this.init();
    const key = `${method}:${url}`;
    const cached = await this.db!.get('cached-responses', key);
    
    if (!cached || cached.expires < Date.now()) {
      if (cached) {
        await this.db!.delete('cached-responses', key);
      }
      return null;
    }
    
    return cached.data;
  }

  async clearExpiredCache(): Promise<void> {
    await this.init();
    const now = Date.now();
    const expired = await this.db!.getAllFromIndex('cached-responses', 'by-expires', IDBKeyRange.upperBound(now));
    
    for (const item of expired) {
      await this.db!.delete('cached-responses', item.url);
    }
  }

  async clear(): Promise<void> {
    await this.init();
    
    const stores: (keyof OfflineDB)[] = ['offline-data', 'user-preferences', 'cached-responses'];
    for (const storeName of stores) {
      await this.db!.clear(storeName);
    }
  }
}

export const offlineStorage = new OfflineStorage();