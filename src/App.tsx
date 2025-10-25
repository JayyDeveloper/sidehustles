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
    initDB().catch((err) => {
      console.error('Failed to initialize database:', err);
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
