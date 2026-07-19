import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleDashboardRedirect = () => {
    if (role === 'BAKER') {
      navigate('/baker-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  return (
    <div className="landing-wrapper">
      <div className="hero-section">
        <span className="step-indicator">Welcome to HomeBaker</span>
        <h1 className="hero-title">
          Delightful, Custom Baked Goods <span>Direct From Home Kitchens</span>
        </h1>
        <p className="hero-subtitle">
          Connect with talented local home bakers, customize your dream cake with our interactive builder, and track your fresh bakes from our ovens to your door.
        </p>
        <div className="hero-buttons">
          {token ? (
            <button onClick={handleDashboardRedirect} className="btn btn-primary">
              Go to Dashboard
            </button>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <span className="feature-icon">🎂</span>
          <h3>Interactive Cake Builder</h3>
          <p>Design your customized cakes step-by-step. Choose shapes, sizes, flavors, and toppings, and watch pricing updates instantly in real-time.</p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">📅</span>
          <h3>Capacity Slots</h3>
          <p>Never worry about late orders. Bakers manage daily production limits, ensuring every cake gets the premium attention it deserves.</p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">📍</span>
          <h3>Local & Fresh</h3>
          <p>Find bakers in your city. Coordinate convenient home pickup or secure hand-delivery straight to your celebrations.</p>
        </div>

        <div className="feature-item">
          <span className="feature-icon">💬</span>
          <h3>In-App Chat</h3>
          <p>Coordinate details, write customized text, or request color tweaks directly with your baker through our built-in messenger.</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;
