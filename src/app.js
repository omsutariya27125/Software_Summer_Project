import React, { useState, useEffect } from 'react';
import WelcomePage from './WelcomePage';
import AuthPage from './LandingPage';
import HomePage from './Home_Page';
import Chapters from './Chapters';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getAuthToken } from './api';

function App() {
  const [page, setPage] = useState('welcome'); // 'welcome', 'auth', 'home'

  useEffect(() => {
    if (getAuthToken()) {
      setPage('home');
    }
  }, []);

  const goToAuth = () => setPage('auth');
  const goToHome = () => setPage('home');
  if (page === 'welcome') return <WelcomePage onGetStarted={goToAuth} />;
  if (page === 'auth') return <AuthPage onLoginSuccess={goToHome} />;

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chapters/:topicSlug" element={<Chapters />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
