import React, { useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useThemeStore, getResolvedMode } from './store/themeStore';
import { lightTheme, darkTheme } from './theme';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import PendingApprovals from './pages/PendingApprovals';
import RequestDetails from './pages/RequestDetails';
import History from './pages/History';
import Settings from './pages/Settings';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PageFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-enter">
      {children}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { mode } = useThemeStore();
  const theme = useMemo(() => {
    const resolved = getResolvedMode(mode);
    return resolved === 'dark' ? darkTheme : lightTheme;
  }, [mode]);

  // Listen to system preference changes when in "system" mode
  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => window.dispatchEvent(new Event('theme-change'));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [mode]);

  // Re-render when system theme changes (via store subscription trick)
  const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const handler = () => forceUpdate();
    window.addEventListener('theme-change', handler);
    return () => window.removeEventListener('theme-change', handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            direction: 'rtl',
            fontFamily: 'Vazirmatn, sans-serif',
            borderRadius: '10px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageFade>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requests/new" element={<NewRequest />} />
                    <Route path="/requests/:id" element={<RequestDetails />} />
                    <Route path="/approvals" element={<PendingApprovals />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </PageFade>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;