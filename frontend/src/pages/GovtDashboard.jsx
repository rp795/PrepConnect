import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Brain, Users, Award, TrendingUp, Clock, Loader2 } from 'lucide-react';
import '../styling/Dashboard.css';

// --- Helper Components ---
const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon-box" style={{ backgroundColor: `${color}20`, color: color }}>
      {icon}
    </div>
    <div className="stat-info">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  </div>
);

const SuggestionItem = ({ text, type }) => (
  <div className={`suggestion-item ${type === 'warning' ? 'warning' : ''}`}>
    <p>{text}</p>
  </div>
);

const ActivityRow = ({ name, subject, result, date }) => (
  <tr>
    <td className="activity-name">{name}</td>
    <td>{subject}</td>
    <td>{result}</td>
    <td className="activity-date">{date}</td>
  </tr>
);

// --- Main Dashboard Component ---
const GovtDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample Data (Chart ke liye abhi static rakha hai)
  const performanceData = [
    { name: 'Mon', score: 40 },
    { name: 'Tue', score: 60 },
    { name: 'Wed', score: 55 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 75 },
    { name: 'Sat', score: 95 },
  ];

  // Real-time Data Fetching
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token'); 
        
        if (!userId) {
          console.error("User ID not found in LocalStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/auth/user-data?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Backend se ye data aaya:", res.data);
        setUserData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Loader2 className="animate-spin" size={40} color="#6366f1" />
        <h3 style={{ marginLeft: '10px', color: '#6366f1' }}>Fetching PrepConnect Stats...</h3>
      </div>
    );
  }

  if (!userData) {
    return <div className="dashboard-container"><h2>Error loading profile. Please log in again.</h2></div>;
  }

  //  SMART HACK: Generate Dynamic Activities based on real UserData
  const generateRecentActivities = (data) => {
    let activities = [];

    if (data.atsScore > 0) {
      activities.push({ id: 'ats', name: "AI Resume Scan", subject: "Target Role Match", result: `${data.atsScore}%`, date: "Recently Updated" });
    }
    if (data.quizAccuracy > 0) {
      activities.push({ id: 'quiz', name: "AI Quiz Challenge", subject: "Tech Domain", result: `${data.quizAccuracy}%`, date: "Recently Updated" });
    }
    if (data.collabHours > 0) {
      activities.push({ id: 'collab', name: "CollabLab Session", subject: "Peer Coding", result: `${data.collabHours}h Logged`, date: "Recently Updated" });
    }
    if (activities.length === 0) {
      activities.push({ id: 'new', name: "Account Created", subject: "PrepConnect Platform", result: "Success", date: "Just now" });
    }

    return activities;
  };

  const dynamicActivities = generateRecentActivities(userData);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome , <span>{userData.name || 'Bhai'}!</span></h1>
        <p>Your career progress is perfectly on track. Check your latest stats below.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FileText size={24}/>} title="ATS Score" value={`${userData.atsScore || 0}%`} color="#3b82f6" />
        <StatCard icon={<Brain size={24}/>} title="Quiz Accuracy" value={`${userData.quizAccuracy || 0}%`} color="#a855f7" />
        <StatCard icon={<Users size={24}/>} title="Collab Hours" value={`${userData.collabHours || 0}h`} color="#10b981" />
        <StatCard icon={<Award size={24}/>} title="Rank" value={userData.rank || 'Pro'} color="#f59e0b" />
      </div>

      <div className="dashboard-main-grid">
        <div className="chart-section">
          <h3 className="section-title">
            <TrendingUp size={20} color="#6366f1" /> Performance Trend
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} 
                  itemStyle={{ color: '#6366f1' }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ai-section">
          <h3 className="section-title">
            <Brain size={20} color="#6366f1" /> AI Recommendations
          </h3>
          <div className="suggestions-list">
            <SuggestionItem text={`Your ATS score ${userData.atsScore || 0}% is Good, update yours projects.`} type="warning" />
            <SuggestionItem text="Add 'React/WebRTC' to your resume, it'll boost your match.." type="info" />
            <SuggestionItem text="Next Mock Interview: Tomorrow 10 AM." type="info" />
          </div>
        </div>
      </div>

      <div className="activity-section">
        <h3 className="section-title">
          <Clock size={20} color="#6366f1" /> Recent Activity
        </h3>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Subject/Role</th>
              <th>Score/Result</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {/* 🟢 Ab table poori tarah dynamic hai */}
            {dynamicActivities.map((activity) => (
              <ActivityRow 
                key={activity.id} 
                name={activity.name} 
                subject={activity.subject} 
                result={activity.result} 
                date={activity.date} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GovtDashboard;