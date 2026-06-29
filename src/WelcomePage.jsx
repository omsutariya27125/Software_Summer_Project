import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>MathGenius JEE</h1>
        <p className="tagline">Your AI-powered path to JEE mastery</p>
        <div className="feature-icons">
          <span>📊 Track Progress</span>
          <span>🤖 AI Recommendations</span>
          <span>📚 Chapter-wise Practice</span>
        </div>
        <button className="get-started-btn" onClick={onGetStarted}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;