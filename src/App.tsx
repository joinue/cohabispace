import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Home from './components/Home';
import LandingPage from './components/LandingPage';
import Cohabispace from './components/cohabispace/Cohabispace';
import { useAuth } from './contexts/AuthContext';
import './App.css'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/cohabispace"
            element={
              <PrivateRoute>
                <Cohabispace />
              </PrivateRoute>
            }
          />
          {/* Redirect /home to /dashboard for backward compatibility */}
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
