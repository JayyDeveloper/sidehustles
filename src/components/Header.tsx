import { Moon, Sun, Download, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usePWA } from '../hooks/usePWA';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { settings, toggleTheme } = useApp();
  const { canInstall, promptInstall } = usePWA();

  const handleInstallClick = async () => {
    await promptInstall();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-glass-dark/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and title */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                  Hustleboard
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">Track your side hustles</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Install PWA button */}
            {canInstall && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 border border-accent-500/20 transition-colors"
                title="Install app"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Install</span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-white/10 transition-colors"
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
    </header>
  );
}
