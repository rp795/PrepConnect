import React, {useEffect, useState } from 'react';
import { Rocket, Code, Zap, Users, Terminal, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styling/PrivateSector.css';

const PrivateHome = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
  
    setActive(true);
  }, []);

  return (
    <div className={`p-container ${active ? 'p-active' : ''}`}>
      {/* Background Animated Elements */}
      <div className="p-bg-blob"></div>
      
      <main className="p-hero">
        <div className="p-content">
          <div className="p-badge">
            <span className="p-pulse"></span> SYSTEM_INITIALIZED_2026
          </div>
          <h1 className="p-title">
            Unlock the <span>MERN</span> <br /> 
            Command Center
          </h1>
          <p className="p-subtitle">
            A high-tech collaborative ecosystem for modern developers. 
            Master Private Sector skills with real-time mentorship.
          </p>

          <div className="p-btn-group">
            <button className="p-btn-main">
              Start Learning Sprint <Rocket size={20} />
            </button>
            <Link to="/private/lab">
            <button className="p-btn-sub">
              Open Collab Lab <Code size={20} />
            </button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Cards */}
        <div className="p-hero-visual">
          <div className="p-stat-box b1">
            <Users color="#38bdf8" />
            <div>
              <h4>12+</h4>
              <p>Live Devs</p>
            </div>
          </div>
          <div className="p-stat-box b2">
            <Terminal color="#f472b6" />
            <div>
              <h4>Active</h4>
              <p>Mentors</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Features Grid */}
      <section className="p-features">
        <div className="p-card">
          <div className="p-card-top"><Zap color="#38bdf8" /></div>
          <h3>AI Resume Analyser</h3>
          <p>Optimize your resume for ATS tracking with our 2026 AI engine.</p>
          <div className="p-card-link">Try Now <ArrowRight size={16} /></div>
        </div>
        
        <div className="p-card p-highlight">
          <div className="p-card-top"><Code color="#38bdf8" /></div>
          <h3>Collaborative Editor</h3>
          <p>Real-time group coding sessions with your friends and teachers.</p>
          <div className="p-card-link">Enter Lab <ArrowRight size={16} /></div>
        </div>
      </section>
    </div>
  );
};

export default PrivateHome;