import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const token = localStorage.getItem("authToken");

const WelcomePage = () => {
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
        <Link to={token ? "/home" : "/landingpage"}>
          <button className="get-started-btn">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;