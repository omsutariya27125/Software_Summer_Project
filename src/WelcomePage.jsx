import React, { useEffect, useState } from 'react';
import './WelcomePage.css';
import { FaMoon, FaSun } from 'react-icons/fa';
import { isDarkTheme, setThemePreference } from './api';

const WelcomePage = ({ onGetStarted }) => {
  const [darkMode, setDarkMode] = useState(isDarkTheme);

  useEffect(() => {
    setThemePreference(darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    setThemePreference(nextMode);
  };

  return (
    <div className={`welcome-container ${darkMode ? 'dark' : 'light'}`}>
      <button className="welcome-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
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
