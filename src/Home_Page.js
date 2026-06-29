import React, { useState, useEffect } from 'react';
import './Home_Page.css';

const Home_Page = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate user loading (replace with real /me endpoint later)
    setTimeout(() => {
      setUser({ name: 'Student' });
      setLoading(false);
    }, 500);
  }, [onLogout]);

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  if (loading) return <div className="home-loading">Loading dashboard…</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>MathGenius JEE</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="dashboard-cards">
          <div className="card">
            <h2>📊 Track Progress</h2>
            <p>Review chapter-wise scores and identify weak areas.</p>
            <button className="card-btn">View Progress</button>
          </div>

          <div className="card">
            <h2>🤖 AI Recommendations</h2>
            <p>Get a personalised practice set based on your performance.</p>
            <button className="card-btn">Start Practice</button>
          </div>

          <div className="card">
            <h2>📚 Chapters</h2>
            <p>Explore all JEE Mathematics topics with detailed resources.</p>
            <button className="card-btn">Browse Chapters</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home_Page;