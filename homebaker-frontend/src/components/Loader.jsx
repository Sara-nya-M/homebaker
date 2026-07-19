import React from 'react';
import './Loader.css';

function Loader({ text = 'Baking freshness...', fullScreen = false, icon = '🍰' }) {
  return (
    <div className={`loader-overlay ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="loader-container">
        <div className="loader-spinner-wrapper">
          <div className="loader-ring"></div>
          <div className="loader-ring-inner"></div>
          <span className="loader-icon">{icon}</span>
        </div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
}

export default Loader;
