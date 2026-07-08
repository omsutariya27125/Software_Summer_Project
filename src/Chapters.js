import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import './Chapters.css';
import { getChaptersData, getTopicsProgression, isDarkTheme, setThemePreference } from './api';

export const topicChapters = {
  Calculus: ['Limits', 'Differentiation', 'Definite Integration'],
  'Linear Algebra': ['Matrices', 'Determinants'],
  Trigonometry: ['Identities', 'Functions', 'Equations'],
  'Coordinate Geometry': ['Straight Lines', 'Circles', 'Conic Sections'],
  Probability: ['Basic Probability', 'Axioms', 'Distributions'],
  'Complex Numbers': ['Algebra', 'Polar Form'],
  Vectors: ['Dot Product', 'Magnitude', 'Cross Product'],
  '3D Geometry': ['Distance Formula', 'Planes', 'Lines'],
};

export const slugifyTopic = (topic) =>
  topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

const chapterQuestionCounts = {
  Limits: 1,
  Differentiation: 1,
  'Definite Integration': 1,
  Matrices: 2,
  Determinants: 1,
  Identities: 1,
  Functions: 1,
  Equations: 1,
  'Straight Lines': 1,
  Circles: 1,
  'Conic Sections': 1,
  'Basic Probability': 1,
  Axioms: 1,
  Distributions: 1,
  Algebra: 2,
  'Polar Form': 1,
  'Dot Product': 1,
  Magnitude: 1,
  'Cross Product': 1,
  'Distance Formula': 1,
  Planes: 1,
  Lines: 1,
};

const Chapters = () => {
  const { topicSlug } = useParams();
  const [minimized, setMinimized] = useState(false);
  const [darkMode, setDarkMode] = useState(isDarkTheme);
  const [chapterRows, setChapterRows] = useState([]);
  const [allTopics, setAllTopics] = useState(Object.keys(topicChapters));

  const topicName = useMemo(() => {
    return Object.keys(topicChapters).find((topic) => slugifyTopic(topic) === topicSlug) || 'Calculus';
  }, [topicSlug]);

  const chapters = chapterRows.length
    ? chapterRows.map((chapter) => chapter.name)
    : topicChapters[topicName];
  const totalQuestions = chapterRows.length
    ? chapterRows.reduce((total, chapter) => total + (chapter.question_count || 0), 0)
    : chapters.reduce((total, chapter) => total + (chapterQuestionCounts[chapter] || 0), 0);

  useEffect(() => {
    setThemePreference(darkMode);
  }, [darkMode]);

  useEffect(() => {
    let active = true;

    const loadChapters = async () => {
      try {
        const [chapterData, topicData] = await Promise.all([
          getChaptersData(topicSlug),
          getTopicsProgression(),
        ]);

        if (!active) return;

        if (chapterData?.chapters?.length) {
          setChapterRows(chapterData.chapters);
        }

        if (topicData?.topics?.length) {
          setAllTopics(topicData.topics.map((topic) => topic.name));
        }
      } catch (error) {
        console.error('Chapters API error:', error);
        setChapterRows([]);
      }
    };

    loadChapters();

    return () => {
      active = false;
    };
  }, [topicSlug]);

  return (
    <div className={`dashboard-root chapters-root ${darkMode ? 'dark' : ''}`}>
      <aside className={`sidebar ${minimized ? 'minimized' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon"><i className="fas fa-graduation-cap"></i></div>
          <span className={`brand-text ${minimized ? 'hidden' : ''}`}>
            JEE<span>Math</span>
          </span>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <i className="fas fa-th-large nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Dashboard</span>
          </Link>
          <div className="nav-item nav-item-disabled" title="Profile will return later">
            <i className="fas fa-user nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Profile</span>
          </div>
          <a className="nav-item active">
            <i className="fas fa-book-open nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Chapters</span>
          </a>
          <a className="nav-item">
            <i className="fas fa-robot nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>AI Analyzer</span>
          </a>
          <a className="nav-item">
            <i className="fas fa-clipboard-question nav-icon"></i>
            <span className={`nav-text ${minimized ? 'hidden' : ''}`}>Test / Quiz</span>
          </a>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={() => setMinimized(!minimized)} aria-label="Toggle sidebar">
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="page-title">Chapters</h2>
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
            <div className="avatar">RK</div>
            <span className={`username ${minimized ? 'hidden' : ''}`}>Rohan K.</span>
          </div>
        </header>

        <main className="chapters-content">
          <section className="chapters-hero">
            <Link to="/" className="back-link">
              <i className="fas fa-arrow-left"></i>
              Back to Dashboard
            </Link>
            <div className="chapters-hero-main">
              <div className="chapters-topic-icon">
                <i className={`fas ${topicIcons[topicName] || 'fa-book'}`}></i>
              </div>
              <div>
                <p className="chapters-eyebrow">Selected Topic</p>
                <h1>{topicName}</h1>
                <p className="chapters-summary">
                  {chapters.length} chapters available with {totalQuestions} mapped practice questions.
                </p>
              </div>
            </div>
          </section>

          <section className="chapters-layout">
            <div className="topic-list-panel">
              <h3>All Topics</h3>
              <div className="topic-list">
                {allTopics.map((topic) => (
                  <Link
                    key={topic}
                    to={`/chapters/${slugifyTopic(topic)}`}
                    className={`topic-list-item ${topic === topicName ? 'active' : ''}`}
                  >
                    <i className={`fas ${topicIcons[topic] || 'fa-book'}`}></i>
                    <span>{topic}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="chapter-grid">
              {chapters.map((chapter, index) => (
                <article className="chapter-card" key={chapter}>
                  <div className="chapter-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="chapter-card-body">
                    <h3>{chapter}</h3>
                    <p>{(chapterRows[index]?.question_count ?? chapterQuestionCounts[chapter]) || 0} practice question{((chapterRows[index]?.question_count ?? chapterQuestionCounts[chapter]) || 0) === 1 ? '' : 's'} ready</p>
                  </div>
                  <button className="chapter-action">
                    Start
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Chapters;
