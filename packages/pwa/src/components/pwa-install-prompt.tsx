import { useState } from 'react';
import { usePWA } from '../hooks/use-pwa';

interface PWAInstallPromptProps {
  className?: string;
  onInstallSuccess?: () => void;
  onInstallDecline?: () => void;
}

export function PWAInstallPrompt({
  className = '',
  onInstallSuccess,
  onInstallDecline,
}: PWAInstallPromptProps) {
  const { canInstall, install, dismiss } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!canInstall || isDismissed) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await install();
      
      if (success) {
        onInstallSuccess?.();
      } else {
        onInstallDecline?.();
      }
    } catch (error) {
      console.error('Install failed:', error);
      onInstallDecline?.();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    dismiss();
    onInstallDecline?.();
  };

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Install App
          </h3>
          <p className="text-blue-700 text-sm mb-4">
            Install this app on your device for a better experience. It will work offline and feel more like a native app.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isInstalling ? 'Installing...' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-400 hover:text-blue-600 ml-4"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface PWAUpdatePromptProps {
  className?: string;
  onUpdateSuccess?: () => void;
  onUpdateDecline?: () => void;
}

export function PWAUpdatePrompt({
  className = '',
  onUpdateSuccess,
  onUpdateDecline,
}: PWAUpdatePromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  // This would be connected to service worker update detection
  const [hasUpdate] = useState(false); // Replace with actual update detection
  
  if (!hasUpdate || isDismissed) return null;

  const handleUpdate = () => {
    // Trigger service worker update
    onUpdateSuccess?.();
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onUpdateDecline?.();
  };

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Update Available
          </h3>
          <p className="text-green-700 text-sm mb-4">
            A new version of the app is available. Update now to get the latest features and improvements.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
            >
              Update Now
            </button>
            <button
              onClick={handleDismiss}
              className="text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-100"
            >
              Later
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-green-400 hover:text-green-600 ml-4"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}