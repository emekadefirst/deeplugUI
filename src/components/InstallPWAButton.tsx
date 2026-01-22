import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { showInstallPrompt, isInstallable } from '../utils/pwa';

export const InstallPWAButton = () => {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setCanInstall(isInstallable());
    
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setCanInstall(false);
    }
  };

  if (!canInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-[#2c3e5e] text-white px-4 py-2 rounded-lg hover:bg-[#1f2d42] transition-colors text-sm font-medium"
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
};