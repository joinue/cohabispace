import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBrain, FaHandshake, FaChartLine } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo-horizontal.png" alt="Cohabitask Logo" className="logo-image" />
          </Link>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/signup" className="signup-button">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <h1 className="hero-title">Balance Your Household Mental Load</h1>
          <p className="hero-subtitle">
            Cohabitask helps couples visualize and fairly distribute household responsibilities, 
            reducing stress and improving relationships.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button primary">
              Get Started <FaArrowRight />
            </Link>
            <Link to="/login" className="cta-button secondary">
              I already have an account
            </Link>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaBrain />
              </div>
              <h3 className="feature-title">Visualize Mental Load</h3>
              <p className="feature-description">
                See the distribution of household tasks and mental load between partners at a glance.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaHandshake />
              </div>
              <h3 className="feature-title">Fair Distribution</h3>
              <p className="feature-description">
                Use our algorithm to suggest a balanced distribution of tasks based on difficulty and frequency.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">
                Monitor changes over time and see how your household balance improves.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Cohabitask. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 