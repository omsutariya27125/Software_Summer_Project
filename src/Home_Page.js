import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 👈 added
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Home_Page.css';
import { getHomepageData, getTopicsProgression, isDarkTheme, setThemePreference } from './api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// Icon mapping for each topic
const topicIcons = {
  Calculus: 'fa-integral',
  'Linear Algebra': 'fa-border-all',
  Trigonometry: 'fa-draw-polygon',
  'Coordinate Geometry': 'fa-chart-line',
  Probability: 'fa-dice',
  'Complex Numbers': 'fa-calculator',
  Vectors: 'fa-arrow-right',
  '3D Geometry': 'fa-cube',
};

const topicsInitial = [
  { name: 'Calculus', status: 'in_progress' },
  { name: 'Linear Algebra', status: 'not_started' },
  { name: 'Trigonometry', status: 'completed' },
  { name: 'Coordinate Geometry', status: 'in_progress' },
  { name: 'Probability', status: 'not_started' },
  { name: 'Complex Numbers', status: 'completed' },
  { name: 'Vectors', status: 'in_progress' },
  { name: '3D Geometry', status: 'not_started' },
];

const slugifyTopic = (topic) =>
  topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const leaderboardData = [
  { rank: 1, name: 'Ananya S.', questionsSolved: 2890, accuracy: 92.3, score: 98.5 },
  { rank: 2, name: 'Rohan K.', questionsSolved: 2345, accuracy: 88.7, score: 94.2 },
  { rank: 3, name: 'Priya M.', questionsSolved: 2100, accuracy: 85.4, score: 90.1 },
  { rank: 4, name: 'Arjun D.', questionsSolved: 1890, accuracy: 82.1, score: 87.6 },
  { rank: 5, name: 'Sneha L.', questionsSolved: 1650, accuracy: 79.8, score: 84.3 },
  { rank: 6, name: 'You', questionsSolved: 1284, accuracy: 78.4, score: 81.2 },
];

const overallChartData = {
  labels: ['Completed Ch.', 'Questions Solved', 'Accuracy %', 'Activity %'],
  datasets: [{
    label: 'Current',
    data: [24, 1284, 78.4, 85],
    backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
    borderRadius: 8,
  }],
};

const weeklyChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Hours Practiced',
      data: [1.5, 2.2, 1.8, 2.5, 3.0, 2.0, 2.7],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.1)',
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Streak (days)',
      data: [7, 14, 21, 23, 23, 23, 23],
      borderColor: '#f59e0b',
      borderDash: [5, 5],
      tension: 0.3,
      yAxisID: 'y1',
    },
  ],
};

const weeklyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
    y1: {
      beginAtZero: true,
      position: 'right',
      grid: { drawOnChartArea: false },
      title: { display: true, text: 'Days' },
    },
  },
};

const HomePage = () => {
  const [minimized, setMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(isDarkTheme);
  const [topics, setTopics] = useState(topicsInitial);
  const [dashboard, setDashboard] = useState({
    user: { name: 'Rohan K.', username: 'Rohan K.' },
    overall: {
      chapters_attempted: 24,
      questions_solved: 1284,
      accuracy: 78.4,
      activity: 85,
    },
    weekly: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      hours: [1.5, 2.2, 1.8, 2.5, 3.0, 2.0, 2.7],
      streak: [7, 14, 21, 23, 23, 23, 23],
    },
    leaderboard: leaderboardData,
  });
  const [showAllTopics, setShowAllTopics] = useState(false);

  const location = useLocation(); // 👈 current route

  useEffect(() => {
    setThemePreference(darkMode);
  }, [darkMode]);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        const [homeData, topicData] = await Promise.all([
          getHomepageData(),
          getTopicsProgression(),
        ]);

        if (!active) return;

        if (homeData?.success) {
          setDashboard((current) => ({
            ...current,
            ...homeData,
            leaderboard: homeData.leaderboard?.length ? homeData.leaderboard : current.leaderboard,
          }));
        }

        if (topicData?.topics?.length) {
          setTopics(topicData.topics);
        }
      } catch (error) {
        console.error('Dashboard API error:', error);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const getTopicButtonLabel = (status) => {
    if (status === 'not_started') return 'Begin';
    if (status === 'in_progress') return 'Continue';
    return 'Review';
  };

  const visibleTopics = showAllTopics ? topics : topics.slice(0, 4);
  const overall = dashboard.overall;
  const weekly = dashboard.weekly;
  const userName = dashboard.user?.name || dashboard.user?.username || 'Student';
  const initials = userName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const overallData = {
    labels: ['Completed Ch.', 'Questions Solved', 'Accuracy %', 'Activity %'],
    datasets: [{
      label: 'Current',
      data: [
        overall.chapters_attempted || 0,
        overall.questions_solved || 0,
        overall.accuracy || 0,
        overall.activity || 0,
      ],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b'],
      borderRadius: 8,
    }],
  };
  const weeklyData = {
    labels: weekly.days,
    datasets: [
      {
        label: 'Hours Practiced',
        data: weekly.hours,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Streak (days)',
        data: weekly.streak,
        borderColor: '#f59e0b',
        borderDash: [5, 5],
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <div className={`dashboard-root ${darkMode ? 'dark' : ''}`}>
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
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="fas fa-th-large nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Dashboard</span>
          </Link>
          <div className="nav-item nav-item-disabled" title="Profile will return later">
            <i className="fas fa-user nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Profile</span>
          </div>
          {/* Placeholder links (no routing yet) */}
          <a className="nav-item">
            <i className="fas fa-robot nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>AI Analyzer</span>
          </a>
          <a className="nav-item">
            <i className="fas fa-clipboard-question nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Test / Quiz</span>
          </a>
          <a className="nav-item">
            <i className="fas fa-sliders-h nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Personalize</span>
          </a>
        </nav>
      </aside>

      {/* Main */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setMinimized(!minimized)}>
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="page-title">Dashboard</h2>
          </div>
          <div className="topbar-right">
            <button
              className="icon-btn theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button className="icon-btn notification">
              <i className="fas fa-bell"></i>
              <span className="dot"></span>
            </button>
            <div className="avatar">{initials}</div>
            <span className={`username ${minimized ? 'hidden' : ''}`}>{userName}</span>
          </div>
        </header>

        <div className="content-grid">
          {/* ---- TOPICS SECTION WITH CARDS ---- */}
          <div className="card topics-card">
            <h3 className="card-title">JEE Math Topics</h3>
            <div className="topics-grid">
              {visibleTopics.map((topic, idx) => (
                <Link
                  key={idx}
                  to={`/chapters/${slugifyTopic(topic.name)}`}
                  className="topic-card-item"
                >
                  <div className="topic-card-icon">
                    <i className={`fas ${topicIcons[topic.name] || 'fa-book'}`}></i>
                  </div>
                  <span className="topic-card-name">{topic.name}</span>
                  <span className={`topic-btn ${topic.status}`}>
                    {getTopicButtonLabel(topic.status)}
                  </span>
                </Link>
              ))}
            </div>
            {topics.length > 4 && (
              <button
                className="view-all-btn"
                onClick={() => setShowAllTopics(!showAllTopics)}
              >
                {showAllTopics ? 'Show Less' : 'View All Topics'}
              </button>
            )}
          </div>

          {/* Overall Performance */}
          <div className="card">
            <h3 className="card-title">Overall Performance</h3>
            <Bar data={overallData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>

          {/* Weekly Practice */}
          <div className="card">
            <h3 className="card-title">Weekly Practice & Streak</h3>
            <div className="chart-container">
              <Line data={weeklyData} options={weeklyChartOptions} />
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard-section">
          <h2 className="leaderboard-title">🏆 Leaderboard</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Questions Solved</th>
                <th>Accuracy</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.leaderboard.map((entry) => (
                <tr key={entry.rank} className={(entry.name || entry.username) === 'You' ? 'you-row' : ''}>
                  <td>{entry.rank}</td>
                  <td>{entry.name || entry.username}</td>
                  <td>{entry.questionsSolved}</td>
                  <td>{entry.accuracy}%</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
