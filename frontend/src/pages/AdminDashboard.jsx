import React, { useState } from 'react';
import axios from 'axios';
import { Briefcase, BookOpen, CheckCircle, Send } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('job');

  // Job Form State (Added sector here)
  const [jobData, setJobData] = useState({
    title: '',
    category: '',
    lastDate: '',
    applyLink: '',
    sector: '' 
  });

  // Quiz Form State
  const [quizData, setQuizData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0
  });

  // Job Submit Logic
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/jobs/add', jobData);
      if (response.status === 201) {
        alert("✅ Job Notification Posted Successfully!");
        setJobData({ title: '', category: '', lastDate: '', applyLink: '', sector: '' });
      }
    } catch (err) {
      console.error("Error posting job:", err);
      alert(err.response?.data?.msg || "❌ Failed to post job.");
    }
  };

  // Quiz Submit Logic
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quiz/add', quizData);
      alert("✅ Question Added Successfully!");
      setQuizData({ question: '', options: ['', '', '', ''], correct: 0 });
    } catch (err) {
      alert("❌ Error adding question. Check Backend.");
    }
  };

  const handleOptionChange = (index, val) => {
    const updatedOptions = [...quizData.options];
    updatedOptions[index] = val;
    setQuizData({ ...quizData, options: updatedOptions });
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card">
        
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'job' ? 'active' : ''}`} 
            onClick={() => setActiveTab('job')}
          >
            <Briefcase size={18} /> Add New Job
          </button>
          <button 
            className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`} 
            onClick={() => setActiveTab('quiz')}
          >
            <BookOpen size={18} /> Add Quiz Question
          </button>
        </div>

        {/* Form Content */}
        <div className="admin-content">
          {activeTab === 'job' ? (
            <form className="admin-form" onSubmit={handleJobSubmit}>
              <h3 className="form-title">Post Job Notification</h3>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Job Title" 
                  className="auth-input" 
                  value={jobData.title}
                  onChange={(e) => setJobData({...jobData, title: e.target.value})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Category (SSC, Railway, etc.)" 
                  className="auth-input" 
                  value={jobData.category}
                  onChange={(e) => setJobData({...jobData, category: e.target.value})}
                  required 
                />
                <input 
                  type="date" 
                  className="auth-input" 
                  value={jobData.lastDate}
                  onChange={(e) => setJobData({...jobData, lastDate: e.target.value})}
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Apply Link" 
                  className="auth-input" 
                  value={jobData.applyLink}
                  onChange={(e) => setJobData({...jobData, applyLink: e.target.value})}
                  required 
                />
                <select 
                  className="auth-input"
                  value={jobData.sector}
                  onChange={(e) => setJobData({...jobData, sector: e.target.value})}
                  required
                >
                  <option value="">Select Sector</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <button type="submit" className="auth-submit-btn">Post Opportunity <Send size={16}/></button>
            </form>
          ) : (
            <form className="admin-form" onSubmit={handleQuizSubmit}>
              <h3 className="form-title">Create New Quiz Question</h3>
              <textarea 
                placeholder="Enter your question here..." 
                className="auth-input"
                style={{ height: '80px' }}
                value={quizData.question}
                onChange={(e) => setQuizData({...quizData, question: e.target.value})}
                required
              />
              <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                {quizData.options.map((opt, i) => (
                  <input 
                    key={i}
                    type="text" 
                    placeholder={`Option ${i + 1}`} 
                    className="auth-input"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    required
                  />
                ))}
              </div>
              <div style={{ marginTop: '15px' }}>
                <label style={{ fontSize: '0.9rem', color: '#666' }}>Correct Option Index (0-3):</label>
                <select 
                  className="auth-input"
                  value={quizData.correct}
                  onChange={(e) => setQuizData({...quizData, correct: parseInt(e.target.value)})}
                >
                  {quizData.options.map((_, i) => (
                    <option key={i} value={i}>Option {i + 1}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="auth-submit-btn" style={{ marginTop: '20px' }}>
                Add Question <CheckCircle size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;