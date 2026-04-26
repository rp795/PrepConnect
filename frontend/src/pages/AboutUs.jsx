import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Target, Users, Code, Cpu, Database, Server, Sparkles, TerminalSquare, FileText, Brain } from 'lucide-react';
import '../styling/Dashboard.css'; // Existing CSS classes use kar lenge

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="dashboard-container" style={{ overflowY: 'auto', paddingBottom: '50px' }}>
      
      {/* Hero Section */}
      <motion.div 
        className="dashboard-header" 
        style={{ textAlign: 'center', marginTop: '20px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '15px', borderRadius: '50%' }}>
            <TerminalSquare size={40} color="#6366f1" />
          </div>
        </div>
        <h1>About <span>PrepConnect</span></h1>
        <p style={{ maxWidth: '600px', margin: '10px auto', fontSize: '1.1rem', color: '#94a3b8' }}>
          Bridging the gap between learning and getting hired. We empower students with AI-driven tools to build, collaborate, and ace their dream tech roles.
        </p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-main-grid" style={{ marginTop: '40px' }}>
        
        {/* Mission & Vision Section */}
        <motion.div variants={itemVariants} className="chart-section" style={{ gridColumn: '1 / -1', background: 'linear-gradient(145deg, #1e293b, #0f172a)' }}>
          <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', marginBottom: '15px' }}>
                <Target size={24} /> Our Mission
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                To provide a unified platform where students can test their skills against industry standards. 
                Whether it's writing code collaboratively, getting real-time AI feedback on resumes, or practicing 
                technical concepts, PrepConnect is the ultimate career launchpad.
              </p>
            </div>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '15px' }}>
                <Rocket size={24} /> The Vision
              </h3>
              <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                We envision a world where every student has access to enterprise-grade preparation tools. 
                By leveraging Artificial Intelligence and Real-time Communication, we aim to make tech interview 
                preparation engaging, accurate, and accessible to everyone.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Highlights */}
        <motion.div variants={itemVariants} className="ai-section" style={{ gridColumn: '1 / -1' }}>
          <h3 className="section-title"><Sparkles size={20} color="#6366f1" /> Core Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
            
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Code size={30} color="#3b82f6" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', marginBottom: '8px' }}>CollabLab Pro</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Real-time code execution, WebRTC video calling, and a shared whiteboard powered by Socket.io.</p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <FileText size={30} color="#a855f7" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', marginBottom: '8px' }}>AI Resume Scanner</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Gemini AI-powered ATS checker that analyzes skills and provides actionable improvement tips.</p>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Brain size={30} color="#f59e0b" style={{ marginBottom: '10px' }} />
              <h4 style={{ color: 'white', marginBottom: '8px' }}>Smart Quiz Arena</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Dynamic CS subject quizzes with real-time accuracy tracking and timed challenges.</p>
            </div>

          </div>
        </motion.div>

        {/* Tech Stack Display */}
        <motion.div variants={itemVariants} className="activity-section" style={{ gridColumn: '1 / -1', marginTop: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'white', marginBottom: '20px' }}>Built With Cutting-Edge Technology</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span className="skill-tag" style={{ background: '#22d3ee20', color: '#22d3ee', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={16}/> MongoDB</span>
            <span className="skill-tag" style={{ background: '#10b98120', color: '#10b981', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Server size={16}/> Express.js</span>
            <span className="skill-tag" style={{ background: '#3b82f620', color: '#3b82f6', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={16}/> React.js</span>
            <span className="skill-tag" style={{ background: '#22c55e20', color: '#22c55e', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={16}/> Node.js</span>
            <span className="skill-tag" style={{ background: '#a855f720', color: '#a855f7', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={16}/> WebRTC & Socket.io</span>
            <span className="skill-tag" style={{ background: '#f59e0b20', color: '#f59e0b', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16}/> Gemini AI API</span>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AboutUs;