import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import BakerDashboard from './pages/BakerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import CakeBuilder from './pages/CakeBuilder';
import OrderTracking from './pages/OrderTracking';
import ReviewPage from './pages/ReviewPage';
import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Protected Route wrappers
  const CustomerRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
    if (role !== 'CUSTOMER') return <Navigate to="/" />;
    return children;
  };

  const BakerRoute = ({ children }) => {
    if (!token) return <Navigate to="/login" />;
    if (role !== 'BAKER') return <Navigate to="/" />;
    return children;
  };

  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            🍰 HomeBaker
          </Link>
          <div className="navbar-links">
            {token ? (
              <>
                <span className="nav-user">Hello, {userName}</span>
                {role === 'BAKER' ? (
                  <Link to="/baker-dashboard" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/customer-dashboard" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Main Routing Outlet */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Baker Protected Dashboard */}
            <Route
              path="/baker-dashboard"
              element={
                <BakerRoute>
                  <BakerDashboard />
                </BakerRoute>
              }
            />

            {/* Customer Protected Dashboard */}
            <Route
              path="/customer-dashboard"
              element={
                <CustomerRoute>
                  <CustomerDashboard />
                </CustomerRoute>
              }
            />

            {/* Cake Customization Builder */}
            <Route
              path="/cake-builder"
              element={
                <CustomerRoute>
                  <CakeBuilder />
                </CustomerRoute>
              }
            />

            {/* Order Visual Tracking Status */}
            <Route
              path="/track-order"
              element={
                <CustomerRoute>
                  <OrderTracking />
                </CustomerRoute>
              }
            />

            {/* Review Submission */}
            <Route
              path="/rate-baker"
              element={
                <CustomerRoute>
                  <ReviewPage />
                </CustomerRoute>
              }
            />

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
