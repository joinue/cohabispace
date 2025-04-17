import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus, FaArrowRight } from 'react-icons/fa';
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
                <FaSignInAlt />
              </div>
              <h3 className="feature-title">Create Your Account</h3>
              <p className="feature-description">
                Sign up and create your profile to get started with Cohabitask.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserPlus />
              </div>
              <h3 className="feature-title">Add Your Partner</h3>
              <p className="feature-description">
                Invite your partner to join and start balancing household tasks together.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaArrowRight />
              </div>
              <h3 className="feature-title">Track & Balance</h3>
              <p className="feature-description">
                Visualize and fairly distribute household responsibilities between partners.
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