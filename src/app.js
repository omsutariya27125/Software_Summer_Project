import React, { useState, useEffect } from 'react';
import WelcomePage from './WelcomePage';
import AuthPage from './LandingPage';
import HomePage from './Home_Page';

function App() {
  const [page, setPage] = useState('welcome'); // 'welcome', 'auth', 'home'

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      setPage('home');
    }
  }, []);

  const goToAuth = () => setPage('auth');
  const goToHome = () => setPage('home');
  const goToWelcome = () => {
    setPage('welcome');
  };

  if (page === 'welcome') return <WelcomePage onGetStarted={goToAuth} />;
  if (page === 'auth') return <AuthPage onLoginSuccess={goToHome} />;
  return <HomePage onLogout={goToWelcome} />;
}

export default App;