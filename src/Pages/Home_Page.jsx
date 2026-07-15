import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Home_Page.css';
import CategoryChaptersPage from '../Components/Chapter';

import {apiGet} from '../Utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const HomePage = () => {
  const theme = localStorage.getItem('mathGeniusTheme') || 'light';

  const [minimized, setMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(theme);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', username: '' });

  const [navItemSelected, setNavItemSelected] = useState('dashboard', 'profile', 'ai-analyzer', 'test-quiz', 'personalize');

  const location = useLocation();
  const navigate = useNavigate();
  const avatarRef = useRef(null);

  const pageTitle = (() => {
    switch (location.pathname) {
      case '/home/profile':
        return 'Profile';
      case '/home/ai-analyzer':
        return 'AI Analyzer';
      case '/home/test-quiz':
        return 'Test / Quiz';
      case '/home/personalize':
        return 'Personalize';
      case '/home/':
      case '/home':
      default:
        return 'Dashboard';
    }
  })();

  useEffect(() => {
    document.body.className = darkMode === 'dark' ? 'dark-theme' : '';
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await apiGet('/homepage');
        if (data?.user) {
          setCurrentUser({
            name: data.user.name || data.user.username || 'Learner',
            username: data.user.username || '',
          });
        }
      } catch (error) {
        console.error('Unable to load profile data:', error);
      }
    };

    loadUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setMenuOpen(false);
    navigate('/landingpage', { replace: true });

  };

  // TODO: SideBar and TopBar moves with components selected, Fix it in place

  return (
    <div className={`dashboard-root ${darkMode === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar with Router Links */}
      <aside className={`sidebar ${minimized ? 'minimized' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
          <span className={`brand-text ${minimized ? 'hidden' : ''}`}>
            JEE<span>Math</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          {/* Use Link and active class based on location */}
          <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`}>
            <i className="fas fa-th-large nav-icon"></i>
            <span className={`nav-text ${minimized ? "hidden" : ''}`}>Dashboard</span>
          </Link>
          <Link to="/home/profile" className={`nav-item ${location.pathname === '/home/profile' ? 'active' : ''}`}>
            <i className="fas fa-user nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Profile</span>
          </Link>
          {/* Placeholder links (no routing yet) */}
          <a className="nav-item">
            <i className="fas fa-robot nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>AI Analyzer</span>
          </a>
          <Link to="/test" className="nav-item">
            <i className="fas fa-clipboard nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Test / Quiz</span>
          </Link>
          <a className="nav-item">
            <i className="fas fa-sliders-h nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Personalize</span>
          </a>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => {
              console.log("Current minimized:", minimized);
              setMinimized(prev => !prev);
            }}>
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="page-title">{pageTitle}</h2>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => {
              if (darkMode === 'light') {
                setDarkMode('dark');
                localStorage.setItem('mathGeniusTheme', 'dark');
              } else {
                setDarkMode('light');
                localStorage.setItem('mathGeniusTheme', 'light');
              }
            }} title="Toggle theme">
              <i className={`fas ${darkMode === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
            <button className="icon-btn notification">
              <i className="fas fa-bell"></i>
              <span className="dot"></span>
            </button>
            <div className="avatar-wrapper" ref={avatarRef}>
              <button
                type="button"
                className="avatar-btn"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
              >
                <div className="avatar">
                  {(currentUser.name || currentUser.username || 'U')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'U'}
                </div>
              </button>
              {menuOpen && (
                <div className="avatar-menu">
                  <button type="button" className="avatar-menu-item danger" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
            <span className={`username ${minimized ? 'hidden' : ''}`}>
              {currentUser.name || currentUser.username || 'Learner'}
            </span>
          </div>
        </header>

        <Outlet />

      </div>
    </div>
  );
};

export default HomePage;