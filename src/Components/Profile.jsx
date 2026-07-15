import React, { useState, useEffect } from 'react';
import './Profile.css';
import { apiGet } from '../Utils/api'; // Only apiGet needed now

const mockProfile = {
  personal: {
    fullName: 'Rohan Kumar',
    email: 'rohan.kumar@email.com',
    phone: '+91 98765 43210',
    dob: '2006-05-14',
    board: 'CBSE',
  },
  academicGoals: {
    targetExam: 'JEE Main, JEE Advanced',
    targetScore: '99.5 percentile',
    dailyQuestionGoal: 30,
    preferredStudyTime: 'Evening (6 PM – 10 PM)',
    weakAreasStudent: ['Trigonometry', 'Conic Sections'],
    weakAreasAI: ['Probability', 'Complex Numbers'],
  },
  achievements: {
    streaks: [
      { label: '7-Day Streak', achieved: true },
      { label: '30-Day Streak', achieved: true },
      { label: '45-Day Streak', achieved: false },
      { label: '60-Day Streak', achieved: false },
    ],
    questionsSolved: [
      { milestone: 100, achieved: true },
      { milestone: 200, achieved: true },
      { milestone: 500, achieved: true },
      { milestone: 1000, achieved: true },
      { milestone: 1500, achieved: false },
    ],
    badges: [
      { name: 'Topic Champion', icon: 'fa-trophy', earned: true },
      { name: 'Early Bird', icon: 'fa-sun', earned: false },
      { name: 'Day Grinder', icon: 'fa-sun', earned: true },
      { name: 'Night Owl', icon: 'fa-moon', earned: false },
      { name: 'Speed Demon', icon: 'fa-bolt', earned: false },
    ],
  },
  performance: {
    totalSolved: 1284,
    solvedPerChapter: {
      Algebra: 300,
      Calculus: 250,
      Trigonometry: 180,
      'Coordinate Geometry': 200,
      Vectors: 154,
      Probability: 100,
      'Complex Numbers': 100,
    },
    accuracy: 78.4,
    accuracyPerChapter: {
      Algebra: { correct: 240, incorrect: 60 },
      Calculus: { correct: 190, incorrect: 60 },
      Trigonometry: { correct: 120, incorrect: 60 },
      'Coordinate Geometry': { correct: 160, incorrect: 40 },
      Vectors: { correct: 130, incorrect: 24 },
      Probability: { correct: 70, incorrect: 30 },
      'Complex Numbers': { correct: 80, incorrect: 20 },
    },
    streak: 23,
    weeklyStudyHours: 14.5,
    dailyStudyHours: [
      { day: 'Mon', hours: 1.5, topic: 'Algebra' },
      { day: 'Tue', hours: 2.2, topic: 'Calculus' },
      { day: 'Wed', hours: 1.8, topic: 'Trigonometry' },
      { day: 'Thu', hours: 2.5, topic: 'Coordinate Geometry' },
      { day: 'Fri', hours: 3.0, topic: 'Vectors' },
      { day: 'Sat', hours: 2.0, topic: 'Probability' },
      { day: 'Sun', hours: 2.7, topic: 'Complex Numbers' },
    ],
    topicAccuracy: [
      { topic: 'Algebra', accuracy: 80 },
      { topic: 'Calculus', accuracy: 76 },
      { topic: 'Trigonometry', accuracy: 66 },
      { topic: 'Coordinate Geometry', accuracy: 80 },
      { topic: 'Vectors', accuracy: 84 },
      { topic: 'Probability', accuracy: 70 },
      { topic: 'Complex Numbers', accuracy: 80 },
    ],
    strongest: ['Vectors', 'Algebra'],
    needsWork: ['Trigonometry', 'Probability'],
    testsGiven: 12,
    totalMarks: 856,
  },
  recentActivity: [
    { action: 'Solved 5 questions on Matrices', time: '2h ago' },
    { action: 'Completed chapter quiz – Integration', time: '4h ago' },
    { action: 'Reviewed doubt: Conic Sections', time: '6h ago' },
    { action: 'Joined Mock Test – JEE Main Full 7', time: '1 day ago' },
    { action: 'Achieved 30‑Day Streak badge', time: '2 days ago' },
  ],
  aiInsights: {
    doubtSolverUses: 23,
    focusSuggestion: 'Spend more time on Trigonometry and Probability.',
  },
};

const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE'];

const Profile = () => {
  // Expandable details
  const [showSolvedDetail, setShowSolvedDetail] = useState(false);
  const [showAccuracyDetail, setShowAccuracyDetail] = useState(false);
  const [showStudyHoursDetail, setShowStudyHoursDetail] = useState(false);

  // Full profile (merged with backend personal data)
  const [profile, setProfile] = useState(mockProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Academic goals editing (still local, no backend save)
  const [editingAcademics, setEditingAcademics] = useState(false);
  const [academicDraft, setAcademicDraft] = useState(mockProfile.academicGoals);

  // --- Fetch only personal info from backend ---
  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await apiGet('/profile');
        const personalData = response.data || response.userInfo || response;
        if (personalData) {
          setProfile(prev => ({
            ...prev,
            personal: personalData,
          }));
        }
      } catch (err) {
        console.error('Failed to load personal info:', err);
        setError('Could not load personal information. Using default data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPersonalInfo();
  }, []);

  // --- Academic goals handlers (unchanged, no API calls) ---
  const startEditAcademics = () => {
    setAcademicDraft(profile.academicGoals);
    setEditingAcademics(true);
  };
  const saveAcademics = () => {
    setProfile(prev => ({ ...prev, academicGoals: academicDraft }));
    setEditingAcademics(false);
  };
  const cancelAcademics = () => {
    setAcademicDraft(profile.academicGoals);
    setEditingAcademics(false);
  };
  const handleAcademicFieldChange = (field, value) => {
    setAcademicDraft(prev => ({ ...prev, [field]: value }));
  };
  const handleWeakAreasChange = (field, value) => {
    const values = value.split(',').map(item => item.trim()).filter(Boolean);
    setAcademicDraft(prev => ({ ...prev, [field]: values }));
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-content">
      {error && <div className="error-banner">{error}</div>}

      {/* Personal Information – display only, no edit button */}
      <div className="profile-card">
        <h3 className="card-title">
          <i className="fas fa-id-card"></i> Personal Information
        </h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">{profile.personal.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{profile.personal.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">{profile.personal.phoneNumber}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth</span>
            <span className="info-value">{profile.personal.dob}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Board</span>
            <span className="info-value">{profile.personal.board}</span>
          </div>
        </div>
      </div>

      {/* Academic Goals – still editable locally (no API) */}
      <div className="profile-card">
        <div className="card-title-row">
          <h3 className="card-title">
            <i className="fas fa-bullseye"></i> Academic Goals
          </h3>
          <button
            className="edit-icon"
            onClick={editingAcademics ? saveAcademics : startEditAcademics}
            title={editingAcademics ? 'Save' : 'Edit'}
          >
            <i className={`fas ${editingAcademics ? 'fa-check' : 'fa-pen-to-square'}`}></i>
          </button>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Target Exam</span>
            {editingAcademics ? (
              <input
                type="text"
                className="edit-input"
                value={academicDraft.targetExam}
                onChange={(e) => handleAcademicFieldChange('targetExam', e.target.value)}
              />
            ) : (
              <span className="info-value">{profile.academicGoals.targetExam}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Target Score</span>
            {editingAcademics ? (
              <input
                type="text"
                className="edit-input"
                value={academicDraft.targetScore}
                onChange={(e) => handleAcademicFieldChange('targetScore', e.target.value)}
              />
            ) : (
              <span className="info-value">{profile.academicGoals.targetScore}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Daily Question Goal</span>
            {editingAcademics ? (
              <input
                type="number"
                className="edit-input"
                value={academicDraft.dailyQuestionGoal}
                onChange={(e) => handleAcademicFieldChange('dailyQuestionGoal', e.target.value)}
              />
            ) : (
              <span className="info-value">{profile.academicGoals.dailyQuestionGoal}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Preferred Study Time</span>
            {editingAcademics ? (
              <input
                type="text"
                className="edit-input"
                value={academicDraft.preferredStudyTime}
                onChange={(e) => handleAcademicFieldChange('preferredStudyTime', e.target.value)}
              />
            ) : (
              <span className="info-value">{profile.academicGoals.preferredStudyTime}</span>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Weak Areas (You)</span>
            {editingAcademics ? (
              <input
                type="text"
                className="edit-input"
                value={academicDraft.weakAreasStudent.join(', ')}
                onChange={(e) => handleWeakAreasChange('weakAreasStudent', e.target.value)}
              />
            ) : (
              <div className="weak-tags">
                {profile.academicGoals.weakAreasStudent.map((area, i) => (
                  <span key={i} className="weak-tag">{area}</span>
                ))}
              </div>
            )}
          </div>
          <div className="info-item">
            <span className="info-label">Weak Areas (AI)</span>
            {editingAcademics ? (
              <input
                type="text"
                className="edit-input"
                value={academicDraft.weakAreasAI.join(', ')}
                onChange={(e) => handleWeakAreasChange('weakAreasAI', e.target.value)}
              />
            ) : (
              <div className="weak-tags">
                {profile.academicGoals.weakAreasAI.map((area, i) => (
                  <span key={i} className="weak-tag ai">{area}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {editingAcademics && (
          <div className="edit-actions">
            <button className="cancel-btn" onClick={cancelAcademics}>Cancel</button>
          </div>
        )}
      </div>

      {/* Achievements – static mock data */}
      <div className="profile-card">
        <h3 className="card-title"><i className="fas fa-medal"></i> Achievements</h3>
        <div className="achievements-grid">
          <div className="achievement-category">
            <h4>Streaks</h4>
            <div className="badge-row">
              {profile.achievements.streaks.map((s, idx) => (
                <span key={idx} className={`badge ${s.achieved ? 'earned' : 'locked'}`}>
                  <i className={`fas ${s.achieved ? 'fa-fire' : 'fa-fire-alt'}`}></i> {s.label}
                </span>
              ))}
            </div>
          </div>
          <div className="achievement-category">
            <h4>Questions Solved</h4>
            <div className="badge-row">
              {profile.achievements.questionsSolved.map((q, idx) => (
                <span key={idx} className={`badge ${q.achieved ? 'earned' : 'locked'}`}>
                  <i className={`fas ${q.achieved ? 'fa-check-circle' : 'fa-circle'}`}></i> {q.milestone}+
                </span>
              ))}
            </div>
          </div>
          <div className="achievement-category">
            <h4>Special Badges</h4>
            <div className="badge-row">
              {profile.achievements.badges.map((b, idx) => (
                <span key={idx} className={`badge ${b.earned ? 'earned' : 'locked'}`}>
                  <i className={`fas ${b.icon}`}></i> {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Snapshot */}
      {/* (Keep the rest of the JSX exactly as in the previous version, no changes) */}

      <div className="profile-card">
        <h3 className="card-title"><i className="fas fa-chart-bar"></i> Performance Snapshot</h3>
        <div className="snapshot-grid">
          <div className="snapshot-item" onClick={() => setShowSolvedDetail(!showSolvedDetail)}>
            <span className="snap-value">{profile.performance.totalSolved}</span>
            <span className="snap-label">Total Solved</span>
            {showSolvedDetail && (
              <div className="detail-box">
                {Object.entries(profile.performance.solvedPerChapter).map(([ch, count]) => (
                  <div key={ch} className="detail-row">
                    <span>{ch}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="snapshot-item" onClick={() => setShowAccuracyDetail(!showAccuracyDetail)}>
            <span className="snap-value">{profile.performance.accuracy}%</span>
            <span className="snap-label">Accuracy</span>
            {showAccuracyDetail && (
              <div className="detail-box">
                {Object.entries(profile.performance.accuracyPerChapter).map(([ch, data]) => (
                  <div key={ch} className="detail-row">
                    <span>{ch}</span>
                    <span>{data.correct} ✓ / {data.incorrect} ✗</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="snapshot-item">
            <span className="snap-value">{profile.performance.streak} days</span>
            <span className="snap-label">Streak</span>
          </div>
          <div className="snapshot-item" onClick={() => setShowStudyHoursDetail(!showStudyHoursDetail)}>
            <span className="snap-value">{profile.performance.weeklyStudyHours}h</span>
            <span className="snap-label">Weekly Study</span>
            {showStudyHoursDetail && (
              <div className="detail-box">
                {profile.performance.dailyStudyHours.map((d, idx) => (
                  <div key={idx} className="detail-row">
                    <span>{d.day}</span>
                    <span>{d.hours}h – {d.topic}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="topic-accuracy">
          <h4>Topic‑wise Accuracy</h4>
          {profile.performance.topicAccuracy.map((t, idx) => (
            <div key={idx} className="acc-row">
              <span className="acc-topic">{t.topic}</span>
              <div className="acc-bar-bg">
                <div className="acc-bar-fill" style={{ width: `${t.accuracy}%` }}></div>
              </div>
              <span className="acc-val">{t.accuracy}%</span>
            </div>
          ))}
        </div>

        <div className="strength-weakness">
          <div>
            <strong><i className="fas fa-arrow-up green"></i> Strongest</strong>
            <ul>
              {profile.performance.strongest.map((ch, i) => <li key={i}>{ch}</li>)}
            </ul>
          </div>
          <div>
            <strong><i className="fas fa-arrow-down red"></i> Needs Work</strong>
            <ul>
              {profile.performance.needsWork.map((ch, i) => <li key={i}>{ch}</li>)}
            </ul>
          </div>
        </div>

        <div className="tests-info">
          <h4>Tests Taken</h4>
          <p>{profile.performance.testsGiven} tests • Total marks: {profile.performance.totalMarks}</p>
        </div>
      </div>

      {/* Recent Activity & AI Insights */}
      <div className="profile-card">
        <h3 className="card-title"><i className="fas fa-history"></i> Recent Activity</h3>
        <div className="activity-list">
          {profile.recentActivity.map((act, idx) => (
            <div key={idx} className="activity-item">
              <span>{act.action}</span>
              <span className="activity-time">{act.time}</span>
            </div>
          ))}
        </div>
        <hr />
        <h3 className="card-title" style={{ marginTop: '20px' }}>
          <i className="fas fa-robot"></i> AI Insights
        </h3>
        <p>You have used the AI Doubt Solver <strong>{profile.aiInsights.doubtSolverUses} times</strong> this month.</p>
        <p>{profile.aiInsights.focusSuggestion}</p>
        <button className="ai-plan-btn">
          <i className="fas fa-magic"></i> Generate Personalized Study Plan
        </button>
      </div>

      {/* Account Settings */}
      <div className="profile-card">
        <h3 className="card-title"><i className="fas fa-cog"></i> Account Settings</h3>
        <div className="settings-links">
          <a href="#" className="settings-link"><i className="fas fa-lock"></i> Change Password</a>
          <a href="#" className="settings-link"><i className="fas fa-palette"></i> Theme (Light)</a>
          <a href="#" className="settings-link"><i className="fas fa-bell"></i> Notifications</a>
          <a href="#" className="settings-link"><i className="fas fa-user-slash"></i> Delete Account</a>
          <hr />
          <button className="logout-btn"><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;