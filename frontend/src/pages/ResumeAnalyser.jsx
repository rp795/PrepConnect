import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ShieldCheck, Zap, AlertCircle, FileText, Sparkles, BrainCircuit, RefreshCw, ChevronRight, Briefcase, ChevronDown } from 'lucide-react';
import axios from 'axios'; // FIX 1: Axios import kiya API call ke liye
import '../styling/ResumeAnalyser.css';

const ResumeAnalyser = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [file, setFile] = useState(null);
  const [resultData, setResultData] = useState(null);
  
  const [targetRole, setTargetRole] = useState("MERN Stack Developer");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  const jobRoles = [
    "MERN Stack Developer",
    "Frontend Developer (React/Next.js)",
    "Backend Developer (Node/Python)",
    "Full Stack Web Developer",
    "AI / ML Engineer",
    "Data Scientist",
    "DevOps Engineer",
    "Cybersecurity Analyst",
    "Mobile App Developer (Flutter/RN)",
    "Software Testing / QA"
  ];

  const startAnalysis = async () => {
    if (!file) return alert("Pehle file toh select karo bhai! 📄");
    if (file.type !== 'application/pdf') return alert("Sirf PDF file upload karo.");
    
    setIsScanning(true);
    setShowResult(false);

    const formData = new FormData();
    formData.append('resumePdf', file);
    formData.append('targetRole', targetRole);

    try {
      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResultData(data);
        setIsScanning(false);
        setShowResult(true);
       
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            await axios.patch('http://localhost:5000/api/auth/update-stats', {
              userId: userId,
              field: 'atsScore',    // Dashboard ko yahi field chahiye
              value: data.score     // AI ne jo naya score diya hai
            });
            console.log(`ATS Score ${data.score}% successfully saved to DB!`);
          }
        } catch (dbError) {
          console.error("Score save karne mein error aayi:", dbError);
        }

      } else {
        throw new Error(data.error || 'Resume analyze nahi ho paya.');
      }
    } catch (err) {
      alert(err.message || "AI Analysis mein error aaya. Backend check karein.");
      setIsScanning(false);
    }
  };

  return (
    <div className="modern-analyser">
      <div className="blob-1"></div>
      <div className="blob-2"></div>

      <AnimatePresence>
        {isScanning && (
          <motion.div className="analysis-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="scanner-container">
              <motion.div className="ai-brain" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <BrainCircuit size={80} color="#6366f1" />
              </motion.div>
              <div className="scanning-text">
                <motion.h2 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  Analyzing for {targetRole.split(' ')[0]}...
                </motion.h2>
                <div className="progress-bar-wrap">
                  <motion.div className="progress-fill" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5 }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="content-wrapper">
        <header className="hero-section">
          <div className="badge"><Sparkles size={14} /> Gemini AI 2.5</div>
          <h1>Elevate Your <span>Career</span></h1>
          <p>Professional ATS analysis for your dream role.</p>
        </header>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div key="upload-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="main-card glass-morphism">
              
              <div className="custom-select-container">
                <label className="select-label"><Briefcase size={16} /> Target Profession</label>
                
                <div className="select-wrapper">
                  <div 
                    className={`select-header ${isDropdownOpen ? 'active' : ''}`} 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span>{targetRole}</span>
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.ul 
                        className="select-options-list glass-morphism"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {jobRoles.map((role, idx) => (
                          <motion.li 
                            key={idx}
                            whileHover={{ x: 5, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
                            onClick={() => {
                              setTargetRole(role);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {role}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="upload-box">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf" />
                <div className="upload-ui">
                  {file ? (
                    <div className="file-info">
                      <FileText size={45} color="#a855f7" />
                      <h3>{file.name}</h3>
                      <span>PDF Document</span>
                    </div>
                  ) : (
                    <div className="placeholder-info">
                      <Upload size={35} />
                      <p>Click to upload or drag & drop resume</p>
                    </div>
                  )}
                </div>
              </div>

              <button className="cta-button" onClick={startAnalysis}>
                Analyze Now <ChevronRight size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div key="results-dashboard" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="results-container">
              <div className="result-main">
                <div className="score-widget glass-morphism">
                  <div className="progress-container">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="bg" />
                      <motion.circle 
                        cx="50" cy="50" r="45" className="fg"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: resultData.score / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="score-text">
                      <h2>{resultData.score}%</h2>
                      <span>ATS SCORE</span>
                    </div>
                  </div>
                  <div className="score-feedback">
                    <h3>Verdict: {resultData.score > 80 ? "Highly Compatible" : "Good Match"}</h3>
                    <p>Analysis based on <b>{targetRole}</b> requirements.</p>
                  </div>
                </div>

                <div className="advice-widget glass-morphism">
                  <div className="widget-header"><Zap size={20} color="#eab308" /><h3>AI Suggestions</h3></div>
                  <p>{resultData.advice}</p>
                </div>
              </div>

              <div className="result-sidebar">
                <div className="skills-widget glass-morphism">
                  <div className="widget-header"><ShieldCheck size={20} color="#10b981" /><h3>Matched</h3></div>
                  <div className="tag-cloud">
                    {resultData.match.map((s, i) => <span key={i} className="match-tag">{s}</span>)}
                  </div>
                </div>
                <div className="skills-widget glass-morphism">
                  <div className="widget-header"><AlertCircle size={20} color="#f43f5e" /><h3>Missing</h3></div>
                  <div className="tag-cloud">
                    {resultData.missing.map((s, i) => <span key={i} className="missing-tag">{s}</span>)}
                  </div>
                </div>
                <button className="secondary-button" onClick={() => setShowResult(false)}>
                  <RefreshCw size={16} /> New Scan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResumeAnalyser;