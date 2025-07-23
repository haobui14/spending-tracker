import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import Dashboard from './routes/Dashboard';
import CalendarView from './routes/CalendarView';
import SharedDashboard from './routes/SharedDashboard';
import { auth } from './utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import NavBar from './components/NavBar';

function DashboardWithParams() {
  const { year, month } = useParams();
  return <Dashboard year={parseInt(year)} month={parseInt(month)} />;
}

export default function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Router>
      <div className="App">
        {user && <NavBar />}
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/:year/:month" element={user ? <DashboardWithParams /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <CalendarView /> : <Navigate to="/login" />} />
          <Route path="/shared/:userId/:year/:month" element={<SharedDashboard />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}
