import { useState } from 'react';
import { Moon, Sun, Download, Menu, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePWA } from '../hooks/usePWA';
import { clearDatabase } from '../lib/seed';
import { Modal } from './Modal';
import { Button } from './Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { settings, toggleTheme, reloadHustles, toast } = useApp();
  const { canInstall, promptInstall } = usePWA();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleInstallClick = async () => {
    await promptInstall();
  };

  const handleClearData = async () => {
    try {
      await clearDatabase();
      await reloadHustles();
      toast.success('All data cleared successfully');
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Failed to clear data:', error);
      toast.error('Failed to clear data');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-3xl border-gray-200/50 bg-white/70 dark:border-white/10 dark:bg-gray-900/70 shadow-glass">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-400 via-accent-500 to-accent-600 flex items-center justify-center shadow-glow">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative text-xl font-bold text-white">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text-animated">
                  Hustleboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Track your side hustles</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Clear data button */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200"
              title="Clear all data"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Install PWA button */}
            {canInstall && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300"
                title="Install app"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Install</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
              aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clear data confirmation modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear All Data"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to clear all data? This will permanently delete all your hustles,
            transactions, notes, and other data.
          </p>
          <p className="text-sm text-red-400 font-medium">
            This action cannot be undone!
          </p>
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleClearData} className="flex-1">
              Clear All Data
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowClearConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
