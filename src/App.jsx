import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import WelcomePage from './routes/WelcomePage';
import DemoPage from './routes/DemoPage';
import LoginPage from './routes/LoginPage';
import Dashboard from './routes/Dashboard';
import CalendarView from './routes/CalendarView';
import SharedDashboard from './routes/SharedDashboard';
import { auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { cleanupUserCache } from './utils/cacheManager';
import ThemeModeProvider, { useThemeMode } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import NavBar from './components/NavBar';

function DashboardWithParams() {
  const { year, month } = useParams();
  return <Dashboard year={parseInt(year)} month={parseInt(month)} />;
}

function AppContent() {
  const [user, loading, error] = useAuthState(auth);
  const { mode, toggleMode } = useThemeMode();

  // Clear cache when user changes
  useEffect(() => {
    if (user) {
      // Clean up cache for user privacy while preserving offline functionality
      cleanupUserCache(user.uid);
      console.log('User changed, cleaned cache for privacy. Current user:', user.uid);
    }
  }, [user]); // Run when user object changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Router>
      <div className="App">
        {user && <NavBar mode={mode} toggleMode={toggleMode} />}
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/:year/:month" element={user ? <DashboardWithParams /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <CalendarView /> : <Navigate to="/login" />} />
          <Route path="/shared/:shareId" element={<SharedDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeModeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeModeProvider>
  );
}
