import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-content">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              <img src="/images/logo-horizontal.png" alt="Cohabitask Logo" className="logo-image" />
            </Link>
          </div>
          <div className="nav-right">
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/cohabispace" className="nav-link">Cohabispace</Link>
            </div>
            <div className="user-info">
              <span className="user-email">{currentUser?.email}</span>
            </div>
            <button className="nav-button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        </div>
      </nav>

      <main className="home-main">
        <div className="welcome-section">
          <h2>Welcome Back!</h2>
          <p className="welcome-text">Let's make your shared space even better today.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Today's Tasks</h3>
            <p className="card-value">0</p>
            <button className="card-action">View Tasks</button>
          </div>

          <div className="dashboard-card">
            <h3>Completed This Week</h3>
            <p className="card-value">0</p>
            <button className="card-action">View History</button>
          </div>

          <div className="dashboard-card">
            <h3>Your Streak</h3>
            <p className="card-value">0 days</p>
            <button className="card-action">Keep it up!</button>
          </div>

          <div className="dashboard-card">
            <h3>Partner's Progress</h3>
            <p className="card-value">0 tasks</p>
            <button className="card-action">View Together</button>
          </div>
        </div>
        
        <div className="feature-highlight">
          <h3>Try Cohabispace</h3>
          <p>Balance your household responsibilities with our mental load calculator.</p>
          <Link to="/cohabispace" className="feature-button">Go to Cohabispace</Link>
        </div>
      </main>
    </div>
  );
} 