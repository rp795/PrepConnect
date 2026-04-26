import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Timer, Award, RotateCcw, Loader2 } from 'lucide-react';
import "../styling/Navbar.css";
const GovtQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(30);
    const [loading, setLoading] = useState(true);

    // Fetch Questions from Backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/quiz/all');
                setQuestions(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (timer > 0 && !showResult && questions.length > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleNextQuestion();
        }
    }, [timer, showResult, questions]);

    const handleAnswer = (index) => {
        // Correct answer check from backend data
        if (index === questions[currentQ].correct) {
            setScore(prev => prev + 1);
        }
        handleNextQuestion();
    };

    const handleNextQuestion = () => {
        if (currentQ + 1 < questions.length) {
            setCurrentQ(prev => prev + 1);
            setTimer(30);
        } else {
            setShowResult(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
        setTimer(30);
    };

    if (loading) {
        return (
            <div className="quiz-container" style={{justifyContent: 'center'}}>
                <Loader2 className="animate-spin" size={40} color="#14b8a6" />
                <p style={{marginTop: '10px', color: '#94a3b8'}}>Loading Live Quiz...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="quiz-container">
                <div className="quiz-card" style={{textAlign: 'center'}}>
                    <h2>No Quiz Available</h2>
                    <p style={{color: '#94a3b8'}}>Admin has not added any questions yet.</p>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="quiz-container">
                <div className="quiz-card result-box">
                    <Award size={60} color="#14b8a6" style={{marginBottom: '20px'}} />
                    <h2>Quiz Completed!</h2>
                    <div className="score-circle">
                        <span className="score-num">{score}</span>
                        <span style={{fontSize: '0.8rem', color: '#94a3b8'}}>OUT OF {questions.length}</span>
                    </div>
                    <button className="option-btn" onClick={restartQuiz} style={{margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <RotateCcw size={18} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <div className="timer-wrapper">
                    <div className="timer-bar" style={{ width: `${(timer / 30) * 100}%` }}></div>
                </div>

                <div className="question-status">
                    <span>Question {currentQ + 1}/{questions.length}</span>
                    <span style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                        <Timer size={16} /> {timer}s
                    </span>
                </div>

                <h2 className="question-text">{questions[currentQ].question}</h2>

                <div className="options-grid">
                    {questions[currentQ].options.map((option, index) => (
                        <button 
                            key={index} 
                            className="option-btn"
                            onClick={() => handleAnswer(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GovtQuiz;