import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope;

// Clean up outdated caches
cleanupOutdatedCaches();

// Precache and route static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache API responses with Network First strategy
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache images with Cache First strategy
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache CSS and JS files
registerRoute(
  ({ request }) => 
    request.destination === 'style' || 
    request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Handle background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        actions: data.actions || [],
        data: data.data,
      })
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      self.clients.openWindow(event.notification.data?.url || '/')
    );
  }
});

async function handleBackgroundSync() {
  try {
    // Sync offline data when back online
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData);
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function getOfflineData(): Promise<any[]> {
  try {
    // Use IndexedDB directly in service worker
    const { openDB } = await import('idb');
    const db = await openDB('offline-storage', 1);
    const allData = await db.getAll('offline-data');
    return allData.filter(item => !item.synced);
  } catch (error) {
    console.error('Error retrieving offline data:', error);
    return [];
  }
}

async function syncOfflineData(data: any[]): Promise<void> {
  for (const item of data) {
    try {
      // Attempt to sync each item to the server
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: item.type,
          data: item.data,
          timestamp: item.timestamp,
        }),
      });

      if (response.ok) {
        // Mark as synced in IndexedDB
        const { openDB } = await import('idb');
        const db = await openDB('offline-storage', 1);
        item.synced = true;
        await db.put('offline-data', item);
        
        console.log(`Synced offline data: ${item.id}`);
      } else {
        console.error(`Failed to sync item ${item.id}: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error);
    }
  }
}

async function clearOfflineData(): Promise<void> {
  try {
    const { openDB } = await import('idb');
    const db = await openDB('offline-storage', 1);
    const allData = await db.getAll('offline-data');
    const syncedData = allData.filter(item => item.synced);
    
    for (const item of syncedData) {
      await db.delete('offline-data', item.id);
    }
    
    console.log(`Cleared ${syncedData.length} synced items`);
  } catch (error) {
    console.error('Error clearing offline data:', error);
  }
}