import React, { useState } from 'react';
import './LandingPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
 //import 'react-toastify/dist/ReactToastify.css';

const API_BASE = "https://demo-backend-cf9b.onrender.com"; // you can switch back later

const LandingPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    username: '',
    mobileNumber: '',
    password: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const sendJson = async (url, data) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      return result;
    } catch (error) {
      console.error("Fetch error:", error);

      return {
        success: false,
        message: error.message,
      };
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });


    const result = await sendJson(`${API_BASE}/login`, loginData);

    console.log("Login response:", result);

    setLoading(false);

    if (result.Success) {
      localStorage.setItem('authToken', result.access_token || "demo-token");
      setMessage({
        type: "success",
        text: "Login successful!",
      });

      setTimeout(() => {
        navigate("/home");
      }, 1000);

    } else {
      setMessage({
        type: "error",
        text: result.message || "Invalid username or password",
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, username, mobileNumber, password } = registerData;
    if (!name.trim() || !email.trim() || !username.trim() || !password.trim() || !mobileNumber.trim()) {
      setMessage({ type: 'error', text: 'All fields are required.' });
      return;
    }
    if (!email.includes('@')) {
      setMessage({ type: 'error', text: 'Invalid email address.' });
      return;
    }
    if (!mobileNumber.match(/^\d{10}$/)) {
      setMessage({ type: 'error', text: 'Invalid mobile number. It should be 10 digits.' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });



    const result = await sendJson(
      `${API_BASE}/register`,
      registerData
    );

    setLoading(false);

    if (result.success) {

      setMessage({
        type: "success",
        text: "Account created successfully."
      });

      setRegisterData({
        name: "",
        email: "",
        username: "",
        mobileNumber: "",
        password: ""
      });

      setTimeout(() => {
        setActiveTab("login");
      }, 1000);

    }
    else {

      setMessage({
        type: "error",
        text: result.message
      });

    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setMessage({ type: '', text: '' });
  };

  return (

    <div className="auth-container">

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
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  tabIndex={-1}   // prevent focus stealing
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
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
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="1234567890"
                value={registerData.mobileNumber}
                onChange={(e) => setRegisterData({ ...registerData, mobileNumber: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <div className="password-container">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  tabIndex={-1}   // prevent focus stealing
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fas ${showLoginPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
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