import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Question.css';
import { MathRenderer } from '../Components/MathRender';
import { slugifyTopic } from '../Components/Chapter';
import {apiGet} from '../Utils/api';

function QuestionCard({
    question,
    answered,
    submitted,
    onCheck,
    onAnswer,
    onPrev,
    onNext,
    isFirst,
    isLast,
    onReset,
}) {
    const [selectedOption, setSelectedOption] = useState(answered === null ? null : answered);
    const [subjectiveAnswer, setSubjectiveAnswer] = useState('');
    const [showSolution, setShowSolution] = useState(false);

    const handleOptionChange = (optionId) => {
        if (submitted) return;
        setSelectedOption(optionId);
        onAnswer(question?.question_id, optionId);
    };

    const handleReset = () => {
        setSelectedOption(null);
        setSubjectiveAnswer('');
        setShowSolution(false);
        onReset(question?.question_id);
    };

    return (
        <div className="question-card">
            <div className="question-text"><MathRenderer text={question?.question} /></div>

            {question?.type === 'mcq' ? (
                <div className="options-list">
                    {question?.options.map((option) => {
                        const isSelected = selectedOption === option.option_id;
                        const isSelectedCorrect = submitted && isSelected && option.option_id === question?.correctOptionId;
                        const isSelectedWrong = submitted && isSelected && option.option_id !== question?.correctOptionId;
                        const isCorrectHighlight = isSelectedCorrect || (submitted && showSolution && option.option_id === question?.correctOptionId);
                        return (
                            <label
                                key={option.option_id}
                                className={`option-item ${isSelected ? 'selected' : ''} ${isCorrectHighlight ? 'correct' : ''} 
                                    ${isSelectedWrong ? 'wrong' : ''} ${submitted ? 'disabled' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name={question?.question_id}
                                    checked={isSelected}
                                    onChange={() => handleOptionChange(option.option_id)}
                                    disabled={submitted}
                                />
                                <span className="option-text"><MathRenderer text={option.text} /></span>
                                {isCorrectHighlight && <span className="badge correct-badge">Correct</span>}
                                {isSelectedWrong && <span className="badge wrong-badge">Wrong</span>}
                            </label>
                        );
                    })}
                </div>
            ) : (
                <div>
                    <textarea
                        className="answer-textarea"
                        rows="4"
                        placeholder="Type your answer here..."
                        value={subjectiveAnswer}
                        onChange={(e) => {
                            if (submitted) return;
                            setSubjectiveAnswer(e.target.value);
                            onAnswer(question?.id, e.target.value);
                        }}
                        disabled={submitted}
                    />
                    {submitted && (
                        <div className="model-answer">
                            <strong>Model Answer</strong>
                            <p>{question?.modelAnswer}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Navigation row with Check Answer centered */}
            <div className="nav-buttons">
                <button onClick={onPrev} disabled={isFirst}>
                    Previous
                </button>

                {!submitted ? (
                    <button
                        className="check-button"
                        onClick={() => onCheck(question?.question_id)}
                        disabled={
                            question?.type === 'mcq'
                                ? !selectedOption
                                : !subjectiveAnswer.trim()
                        }
                    >
                        Check Answer
                    </button>
                ) : (
                    <div className="button-group">
                        <span className="already-checked">✓ Checked</span>
                        <button 
                            className="show-solution-button"
                            onClick={() => setShowSolution(!showSolution)}
                        >
                            {showSolution ? 'Hide Solution' : 'Show Solution'}
                        </button>
                        <button 
                            className="reset-button"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                )}

                <button onClick={onNext} disabled={isLast}>
                    Next
                </button>
            </div>

            {/* Solution section */}
            {submitted && showSolution && (
                <div className="solution-section">
                    <h3>Solution</h3>
                    <p><MathRenderer text={question?.solution || (question?.type === 'subjective' ? question?.modelAnswer : 'Solution not available')} /></p>
                </div>
            )}
        </div>
    );
}

export default function Question() {
    const [answers, setAnswers] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('mathGeniusTheme') === 'dark');
    const { ChapterName, TopicSlug } = useParams();
    const [questions, setQuestions] = useState([]);



    useEffect(() => {
        const nextTheme = darkMode ? 'dark' : 'light';
        localStorage.setItem('mathGeniusTheme', nextTheme);
        document.body.classList.toggle('dark-mode', darkMode);
        document.body.classList.toggle('light-mode', !darkMode);

        return () => {
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('light-mode');
        };
    }, [darkMode]);

    useEffect(() => {
        const getQuestion = async () => {
            try {
                const data = await apiGet(`/q/${ChapterName}`);
                console.log('Fetched question data:', data.question);
                setQuestions(data.question);
            } catch (error) {
                console.error('Error fetching question data:', error);
            }
        }

        getQuestion();
    }, []);

    const goToPrevious = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
    const goToNext = () => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));

    const handleAnswer = (questionId, answer) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const handleCheck = (questionId) => {
        setSubmittedQuestions((prev) => ({ ...prev, [questionId]: true }));
    };

    const handleReset = (questionId) => {
        setSubmittedQuestions((prev) => {
            const updated = { ...prev };
            delete updated[questionId];
            return updated;
        });
        setAnswers((prev) => {
            const updated = { ...prev };
            delete updated[questionId];
            return updated;
        });
    };

    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    const currentQuestion = questions[currentIndex];
    const isAnswered = answers[currentQuestion?.question_id];
    const isCurrentSubmitted = !!submittedQuestions[currentQuestion?.question_id];

    return (

        <>
            <div className={`question-page ${darkMode ? 'dark' : ''}`}>
                {/* Top bar – outside the question card, at the very top of the page */}
                <div className="top-bar">
                <button
                    className="back-chapters-btn"
                    onClick={() => (window.location.href = `/chapter/${slugifyTopic(TopicSlug)}`)}
                >
                    ← Back to Chapters
                </button>
                <button className="icon-btn" onClick={toggleDarkMode} title="Toggle theme">
                    <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
            </div>
                <QuestionCard
                    key={currentQuestion?.question_id}
                    question={currentQuestion}
                    answered={isAnswered}
                    submitted={isCurrentSubmitted}
                    onCheck={handleCheck}
                    onAnswer={handleAnswer}
                    onReset={handleReset}
                    onPrev={goToPrevious}
                    onNext={goToNext}
                    isFirst={currentIndex === 0}
                    isLast={currentIndex === questions.length - 1}
                />
            </div>
        </>
    );
}