import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import "./Chapter.css";
import { apiGet } from "../Utils/api";

const isDarkTheme = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("mathGeniusTheme") === "dark";
};

export const slugifyTopic = (topic) => topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const setThemePreference = (darkMode) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("mathGeniusTheme", darkMode ? "dark" : "light");
  document.body.className = darkMode ? "dark-theme" : "";
};

const chapterQuestionCounts = {
  Limits: 1,
  Differentiation: 1,
  "Definite Integration": 1,
  Matrices: 2,
  Determinants: 1,
  Identities: 1,
  Functions: 1,
  Equations: 1,
  "Straight Lines": 1,
  Circles: 1,
  "Conic Sections": 1,
  "Basic Probability": 1,
  Axioms: 1,
  Distributions: 1,
  Algebra: 2,
  "Polar Form": 1,
  "Dot Product": 1,
  Magnitude: 1,
  "Cross Product": 1,
  "Distance Formula": 1,
  Planes: 1,
  Lines: 1,
};

const fetchTopicChapters = async () => {
    try {
        const response = await apiGet('/chapter?chapter=true');
        if (response.success) {
            const topicChapters = response.data.map((data) => ({
                name: data.Topic.Name,
                icon: data.Topic.icon,
                chapters: data.Chapters,
            }));
            console.log('Fetched topicChapters:', topicChapters);
            return topicChapters;
        } else { return []; }
    } catch (error) {
        console.error('Error fetching topic chapters:', error);
    }
}

const Chapter = ({ asTest = false }) => {
  const { topicSlug } = useParams();
  const [darkMode, setDarkMode] = useState(() => isDarkTheme());
  const [allTopics, setAllTopics] = useState([]);
  // For when this page is used in a test context, we can manage selected chapters if needed 
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    setThemePreference(darkMode);
  }, [darkMode]);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        setAllTopics(await fetchTopicChapters());
      } catch (error) {
        console.error("Chapters API error:", error);
      }
    };
    loadChapters();
  }, []);

  useEffect(() => {
    if (allTopics.length > 0 && !selectedTopic) {
        setSelectedTopic(allTopics[0]);
    }
  }, [allTopics]);

  // TODO: Write Function for handling the checkbox functionality.

  const currentTopic = useMemo(() => {
    return asTest ? selectedTopic : allTopics.find(topic => slugifyTopic(topic.name) === topicSlug) || allTopics[0];
  }, [allTopics, topicSlug, selectedTopic, asTest]);

  return (
    <>
      <div className={`chapters-root ${darkMode ? "dark" : ""}`}>
        <main className="chapters-content">
          <section className="chapters-hero">
            <div className="chapters-hero-top">
              <Link to="/home" className="back-link">
                <i className="fas fa-arrow-left"></i>
                Back to Dashboard
              </Link>
              <button
                className="chapter-theme-toggle"
                onClick={() => setDarkMode((prev) => !prev)}
                title="Toggle theme"
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </button>
            </div>

            <div className="chapters-hero-main">
              <div className="chapters-topic-icon">
                <i className={`fas ${currentTopic?.icon || "fa-book"}`}></i>
              </div>
              <div className="chapters-hero-text">
                <h1>{currentTopic?.name}</h1>
                <p className="chapters-summary">
                  {currentTopic?.chapters.length} chapters available with some practice questions.
                </p>
              </div>
              {asTest && (
                <label className="checkbox-content">
                  <input
                      className="checkbox"
                      type="checkbox"
                      checked={
                        true
                        // allTopics.length > 0 &&
                        // selectedChapters.size ===
                        // allTopics.reduce((sum, topic) => sum + topic.chapters.length, 0)
                      }
                      onChange={(e) => (e.target.checked)}
                  />
                Select Entire Mathematics
                </label>
              )}
            </div>
          </section>

          <section className="chapters-layout">
            <div className="topic-list-panel">
              <h3>All Topics</h3>
              <div className="topic-list">
                {allTopics.map((topic, idx) => (
                  asTest ? (
                    <div
                      key={idx}
                      className={`topic-list-item ${topic.name === currentTopic?.name ? "active" : ""}`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <i className={`fas ${topic.icon || "fa-book"}`}></i>
                      <span>{topic.name}</span>
                    </div>
                  ) : (
                    <Link
                      key={idx}
                      to={`/chapter/${slugifyTopic(topic.name)}`}
                      className={`topic-list-item ${topic.name === currentTopic?.name ? "active" : ""}`}
                    >
                      <i className={`fas ${topic.icon || "fa-book"}`}></i>
                      <span>{topic.name}</span>
                    </Link>
                  )
                ))}
              </div>
            </div>

            <div>
              {asTest && (
                <div className="topic-select">
                    <label className="checkbox-content">
                        <input
                            className="checkbox"
                            type="checkbox"
                            checked={
                              true
                              // currentTopic?.chapters.every(chapter => selectedChapters.has(chapterKey(currentTopic.name, chapter)))
                            }
                            onChange={(e) => (e.target.checked)}
                        />
                        Select Entire Topic
                    </label>
                </div>
              )}

              <div className="chapter-grid">
                {currentTopic?.chapters.map((chapter, index) => (
                  <article className="chapter-card" key={chapter}>
                    <div className="chapter-card-header">
                      <div className="chapter-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      {asTest && (
                        <input
                            className="checkbox"
                            type="checkbox"
                            checked={
                              true
                              // selectedChapters.has(chapterKey(currentTopic.name, chapter))
                            }
                            onChange={() => (currentTopic?.name, chapter)}
                        />
                      )}
                    </div>
                    {/* TODO: Add data for below and add progress and acurracy bars when attempts are stored*/}
                    <div className="chapter-card-body">
                      <h3>{chapter}</h3>
                      {/* <p>
                        {(chapterRows[index]?.question_count ??
                          chapterQuestionCounts[chapter]) ||
                          0}{" "}
                        practice question
                        {((chapterRows[index]?.question_count ??
                          chapterQuestionCounts[chapter]) ||
                          0) === 1
                          ? ""
                          : "s"}{" "}
                        ready
                      </p> */}
                    </div>
                    {!asTest && (
                      <Link to={`/question/${slugifyTopic(currentTopic?.name)}/${chapter}`} className="chapter-link">
                        <button className="chapter-action">
                          Start
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      {asTest && (
        <button
            className="floating-test-btn"
            onClick={() => {
              // TODO: Handle this onCLick function correctly.
              console.log([...selectedChapters]);
            }}
        >
          Start Test ({selectedChapters?.size})
        </button>
      )}
    </>
  );
};

export default Chapter;
