import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';
import { Dashboard } from './routes/Dashboard';
import { HustleDetail } from './routes/HustleDetail';
import { initDB } from './lib/db';

function AppContent() {
  const { toasts, removeToast } = useApp();

  // Initialize database on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initDB();
      } catch (err) {
        console.error('Failed to initialize database:', err);
      }
    };
    init();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"></div>

          {/* Gradient orbs */}
          <div className="absolute top-0 -left-4 w-96 h-96 bg-accent-400/20 dark:bg-accent-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-4 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hustle/:id" element={<HustleDetail />} />
          </Routes>
        </main>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
