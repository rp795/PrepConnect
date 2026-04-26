import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BookOpen, Code, Database, Globe, Cpu, Server, ChevronRight, LayoutGrid, Loader2, Timer, Trophy } from 'lucide-react';
import '../styling/Quiz.css';

const Quiz = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  
  // Naye Timer States
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const subjects = [
    { id: 'os', name: 'Operating System', icon: <Cpu size={25} />, color: '#3b82f6', desc: 'Process, Threads, & Memory' },
    { id: 'dbms', name: 'DBMS', icon: <Database size={25} />, color: '#10b981', desc: 'SQL, NoSQL & Normalization' },
    { id: 'cn', name: 'Computer Networks', icon: <Globe size={25} />, color: '#f59e0b', desc: 'OSI Model, TCP/IP & Security' },
    { id: 'dsa', name: 'DSA', icon: <Code size={25} />, color: '#ef4444', desc: 'Arrays, Trees & Algorithms' },
    { id: 'oop', name: 'OOPs', icon: <LayoutGrid size={25} />, color: '#a855f7', desc: 'Classes, Objects & Polymorphism' },
    { id: 'se', name: 'Software Engineering', icon: <Server size={25} />, color: '#6366f1', desc: 'Agile, SDLC & Testing' },
  ];

  //  FIX 1: Percentage Calculation aur API Request
  const handleQuizFinish = async (finalScore) => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId) return;

      // Calculate percentage
      const percentage = Math.round((finalScore / questions.length) * 100);

      await axios.patch('http://localhost:5000/api/auth/update-stats', {
        userId,
        field: 'quizAccuracy',
        value: percentage // Backend ko percentage bheja
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(`Quiz Accuracy ${percentage}% successfully saved to DB!`);
    } catch (err) {
      console.error("Quiz Fetch Error:", err);
    }
  };

  //  Timer Logic
  useEffect(() => {
    if (!isTimerActive || timeLeft <= 0 || showResult) {
      if (timeLeft === 0 && !selectedAnswer) {
        handleTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, showResult, selectedAnswer]);

  const handleTimeUp = () => {
    setIsTimerActive(false);
    setSelectedAnswer("TIME_OUT"); 
    
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep((prev) => prev + 1);
        setSelectedAnswer(null);
        setTimeLeft(15);
        setIsTimerActive(true);
      } else {
        setShowResult(true);
       
        handleQuizFinish(score);
      }
    }, 1500); 
  };

  const fetchQuiz = async (sub) => {
    setLoading(true);
    setQuestions([]);
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsTimerActive(false);

    try {
        const response = await fetch('http://localhost:5000/api/quiz/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject: sub.name }),
        });
        const data = await response.json();
        setQuestions(data);
        
        setTimeLeft(15);
        setIsTimerActive(true);
    } catch (err) {
        console.error("Quiz Fetch Error");
    } finally {
        setLoading(false);
    }
  };

  const handleSubjectClick = (sub) => {
    setSelectedSubject(sub);
    fetchQuiz(sub);
  };

  const handleAnswerClick = (option) => {
    setIsTimerActive(false); 
    setSelectedAnswer(option);
    
    let newScore = score;
    if (option === questions[currentStep].answer) {
        newScore = score + 1;
        setScore(newScore); // UI ke liye update kiya
    }

    setTimeout(() => {
        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1);
            setSelectedAnswer(null);
            setTimeLeft(15); 
            setIsTimerActive(true); 
        } else {
            setShowResult(true);
           
            handleQuizFinish(newScore);
        }
    }, 1200); 
  };

  // Timer Color logic
  const timerColor = timeLeft > 5 ? selectedSubject?.color : '#ef4444';

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <h1>PrepConnect <span>Quiz Arena</span></h1>
        <p>Select your domain and face the AI Challenge!</p>
      </header>

      <AnimatePresence mode="wait">
        {!selectedSubject ? (
          <motion.div key="subject-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="subject-grid">
            {subjects.map((sub) => (
              <motion.div 
                key={sub.id} className="subject-card glass-morphism" 
                whileHover={{ scale: 1.03, borderColor: sub.color }} 
                onClick={() => handleSubjectClick(sub)}
              >
                <div>
                  <div className="sub-icon" style={{ color: sub.color, background: `${sub.color}15` }}>
                    {sub.icon}
                  </div>
                  <h3>{sub.name}</h3>
                  <p>{sub.desc}</p>
                </div>
                <div className="sub-footer" style={{ color: sub.color }}>
                  <span>Start AI Quiz</span>
                  <ChevronRight size={14} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="active-quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="active-quiz-area">
            <button className="back-btn" onClick={() => setSelectedSubject(null)}>← Back to Domains</button>
            
            <div className="quiz-meta">
              <h2>{selectedSubject.name} Challenge</h2>
              <span style={{ backgroundColor: selectedSubject.color }}>{selectedSubject.id.toUpperCase()}</span>
            </div>

            <div className="quiz-box glass-morphism">
              {loading ? (
                <div className="quiz-loader">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader2 size={50} color={selectedSubject.color} />
                  </motion.div>
                  <p>Gemini 2.5 is generating fresh questions...</p>
                </div>
              ) : showResult ? (
                // 🟢 Animated Result Section
                <motion.div 
                  className="result-section"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <Trophy size={60} color="#eab308" style={{ marginBottom: "15px" }} />
                  <h2>Challenge Complete!</h2>
                  <motion.h1 
                    style={{ color: selectedSubject.color, fontSize: "4rem", margin: "10px 0" }}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                  >
                    {score} / {questions.length}
                  </motion.h1>
                  <p>PrepConnect Evaluation Finished.</p>
                  <button className="cta-button" style={{ marginTop: "20px" }} onClick={() => handleSubjectClick(selectedSubject)}>
                    Retake AI Quiz
                  </button>
                </motion.div>
              ) : questions.length > 0 ? (
                <div className="question-wrapper">
                  {/* 🟢 Timer Bar UI */}
                  <div className="timer-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <div className="progress-indicator">Question {currentStep + 1} of {questions.length}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", color: timerColor, fontWeight: "bold" }}>
                      <Timer size={18} /> {timeLeft}s
                    </div>
                  </div>
                  
                  <div className="timer-bar-bg" style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", marginBottom: "20px", overflow: "hidden" }}>
                    <motion.div 
                      className="timer-bar-fill" 
                      initial={{ width: "100%" }}
                      animate={{ width: `${(timeLeft / 15) * 100}%` }}
                      transition={{ ease: "linear", duration: 1 }}
                      style={{ height: "100%", background: timerColor, borderRadius: "10px" }}
                    />
                  </div>

                  {/*  Smooth Question Transition */}
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentStep}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="question-text">
                        {selectedAnswer === "TIME_OUT" && <span style={{ color: "#ef4444", marginRight: "10px" }}>[Time's Up!]</span>}
                        {questions[currentStep].question}
                      </h3>
                      
                      <div className="options-grid">
                        {questions[currentStep].options.map((opt, i) => {
                          let btnClass = "";
                          if (selectedAnswer === "TIME_OUT" && opt === questions[currentStep].answer) {
                            btnClass = "correct"; 
                          } else if (selectedAnswer === opt) {
                            btnClass = opt === questions[currentStep].answer ? 'correct' : 'wrong';
                          } else if (selectedAnswer && opt === questions[currentStep].answer) {
                            btnClass = "correct"; 
                          }

                          return (
                            <button 
                              key={i} 
                              className={`option-btn ${btnClass}`}
                              onClick={() => !selectedAnswer && handleAnswerClick(opt)}
                              disabled={!!selectedAnswer}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;