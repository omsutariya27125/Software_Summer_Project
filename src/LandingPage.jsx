import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import { FaEye, FaEyeSlash, FaMoon, FaSun } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { isDarkTheme, loginUser, registerUser, setAuthToken, setThemePreference } from './api';

const LandingPage = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [darkMode, setDarkMode] = useState(isDarkTheme);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setThemePreference(darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    setThemePreference(nextMode);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    
    try {
      const result = await loginUser(loginData);

console.log("Login response:", result);

setLoading(false);

if (result.success || result.Success) {  
  setAuthToken(result.access_token);

  setMessage({
    type: "success",
    text: "Login successful!",
  });

  setTimeout(() => {
    console.log("Calling onLoginSuccess");
    if (onLoginSuccess) onLoginSuccess();
  }, 1000);

} else {
  setMessage({
    type: "error",
    text: result.message || "Invalid username or password",
  });
}
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message || 'Unable to login right now.' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, username, password } = registerData;
    if (!name.trim() || !email.trim() || !username.trim() || !password) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (!email.includes('@')) {
      setMessage({ type: 'error', text: 'Invalid email address.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });

    

    try {
      const result = await registerUser(registerData);

setLoading(false);

if(result.success || result.Nicee){

    setMessage({
        type:"success",
        text:"Account created successfully."
    });

    setRegisterData({
        name:"",
        email:"",
        username:"",
        password:""
    });

    setTimeout(()=>{
        setActiveTab("login");
    },1000);

}
else{

    setMessage({
        type:"error",
        text:result.message
    });

}
    } catch (error) {
      setLoading(false);
      setMessage({ type: 'error', text: error.message || 'Unable to register right now.' });
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage({ type: '', text: '' });
  };

  return (
      
    <div className={`auth-container ${darkMode ? 'dark' : 'light'}`}>
      <button className="auth-theme-toggle" onClick={toggleTheme} title="Toggle theme" aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      
      <div className="hero-header">
    <h1>MathGenius</h1>
    <p>AI-Powered Mathematics Practice Portal</p>
  </div>
      <div className="form-card">
        <div className="tab-switcher">
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="password-container">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="forgot-password">
                <a href="/forgot-password">Forgot Password?</a>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="password-container">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegisterPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
             
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LandingPage;
