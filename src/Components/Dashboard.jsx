import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import './Dashboard.css';
import { slugifyTopic } from './Chapter';

import { apiGet } from '../Utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// TODO: Bring LeaderBoard Data and Personal Data from Api.

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
    
  ],
};

const weeklyChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: true } },
  scales: {
    y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
    
  },
};

export default function Dashboard() {

  const [topics, setTopics] = useState([]);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const navigate = useNavigate();

  const getTopicButtonLabel = (status) => {
    if (status === 'not_started') return 'Begin';
    if (status === 'in_progress') return 'Continue';
    return 'Review';
  };

  useEffect(() => {
    const getTopics = async () => {
      try {
        const data = await apiGet('/chapter');
        if (data?.topics) {
          const topics = data.topics.map((topic) => ({
            name: topic.Topic.Name,
            status: "not_started",
            icon: topic.Topic.icon
          }));
          await setTopics(topics);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    getTopics();
  }, []);

  const handleTopicOpen = (topicName) => {
    const slug = slugifyTopic(topicName);
    navigate(`/chapter/${slug}`);
  }

  const visibleTopics = showAllTopics ? topics : topics.slice(0, 4);

  return (
    <>
      <div className="card topics-card">
        <h3 className="card-title">JEE Math Topics</h3>
        <div className="topics-grid">
          {visibleTopics.map((topic, idx) => (
            <div
              key={idx}
              className="topic-card-item"
              onClick={() => handleTopicOpen(topic.name)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleTopicOpen(topic.name);
                }
              }}
            >
              <div className="topic-card-icon">
                <i className={`fas ${topic.icon || 'fa-book'}`}></i>
              </div>
              <span className="topic-card-name">{topic.name}</span>
              <div className={`topic-btn ${topic.status}`}>
                {getTopicButtonLabel(topic.status)}
              </div>
            </div>
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
      <div className="content-grid">
        {/* ---- TOPICS SECTION WITH CARDS ---- */}


        {/* Overall Performance */}
        <div className="card">
          <h3 className="card-title">Overall Performance</h3>
          <Bar data={overallChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        {/* Weekly Practice */}
        <div className="card">
          <h3 className="card-title">Weekly Practice & Streak</h3>
          <div className="chart-container">
            <Line data={weeklyChartData} options={weeklyChartOptions} />
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
            {leaderboardData.map((entry) => (
              <tr key={entry.rank} className={entry.name === 'You' ? 'you-row' : ''}>
                <td>{entry.rank}</td>
                <td>{entry.name}</td>
                <td>{entry.questionsSolved}</td>
                <td>{entry.accuracy}%</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
