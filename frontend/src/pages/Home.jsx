import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid, Zap, Briefcase, ChevronRight, Code2, Users, FileCheck, Terminal ,Code ,Cpu } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import React, { useState, useEffect } from 'react';
import "../styling/Navbar.css"; 

// Reusable Scroll Animation Component
const FadeInWhenVisible = ({ children, direction = "up", delay = 0 }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const variants = {
        hidden: { 
            opacity: 0, 
            y: direction === "up" ? 50 : 0, 
            x: direction === "left" ? 50 : direction === "right" ? -50 : 0 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            x: 0, 
            transition: { duration: 0.6, ease: "easeOut", delay: delay } 
        }
    };

    return (
        <motion.div ref={ref} initial="hidden" animate={controls} variants={variants}>
            {children}
        </motion.div>
    );
};


const Home = () => {

  return (
    <div className="home-container" style={{ overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION (Immersive) */}
      <section className="hero-section" style={{ position: 'relative', padding: '100px 20px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Floating Background Elements (Decorative) */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 0.2 }} transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }} style={{ position: 'absolute', top: '20%', left: '10%', fontSize: '3rem', color: '#3b82f6' }}>{"{ }"}</motion.div>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 0.2 }} transition={{ repeat: Infinity, duration: 5, repeatType: "reverse" }} style={{ position: 'absolute', bottom: '30%', right: '15%', fontSize: '3rem', color: '#10b981' }}>&lt;/&gt;</motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <div className="hero-tag" style={{ display: 'inline-block', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                🚀 Built for the Class of 2026
            </div>
            <h1 className="hero-title" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', color: '#f8fafc', marginBottom: '20px' }}>
              The Ultimate Operating System <br /> for <span>CS Students.</span>
            </h1>
            <p className="hero-subtitle" style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 40px', lineHeight: '1.6' }}>
              PrepConnect isn't just another job board. It's a unified developer ecosystem combining real-time pair programming, ATS resume intelligence, and core CS fundamentals.
            </p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link to="/signup" className="cta-btn" style={{ background: '#3b82f6', color: 'white', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    Start Building <ArrowRight size={20} style={{ marginLeft: '10px' }}/>
                </Link>
                <Link to="/lab-lobby" className="cta-btn" style={{ background: 'transparent', color: '#f8fafc', border: '1px solid #334155', padding: '15px 30px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    Try Collab Lab <Terminal size={20} style={{ marginLeft: '10px' }}/>
                </Link>
            </div>
        </motion.div>
      </section>

      {/* 2. TECH STACK BANNER */}
      <FadeInWhenVisible>
          <div className="tech-stack-banner" style={{ background: 'linear-gradient(90deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 50%, rgba(15,23,42,1) 100%)', padding: '30px 0', borderTop: '1px solid #334155', borderBottom: '1px solid #334155', textAlign: 'center', color: '#94a3b8', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', fontSize: '1.1rem' }}>
              <span style={{fontWeight: 'bold', color: '#f8fafc'}}>Powered By:</span>
              <span>React 18</span> • <span>Node.js</span> • <span>Socket.io</span> • <span>WebRTC</span> • <span>MongoDB</span>
          </div>
      </FadeInWhenVisible>

      {/* 3. DEEP DIVE FEATURES (Alternating Blocks) */}
      <section style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Feature 1 */}
         <FadeInWhenVisible direction="right">
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '50px', marginBottom: '100px' }}>
                  <div style={{ flex: '1 1 400px' }}>
                      <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', marginBottom: '20px', fontWeight: 'bold' }}>01. Developer Collab Lab</div>
                      <h2 style={{ fontSize: '2.5rem', color: '#f8fafc', marginBottom: '20px' }}>Code Together, <br/> Succeed Together.</h2>
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
                          Stop struggling alone. Connect with peers in a real-time, synchronized IDE powered by Socket.io. Conduct mock technical interviews, share logic, and debug projects as if you were sitting right next to each other.
                      </p>
                      <ul style={{ color: '#94a3b8', listStyle: 'none', padding: 0, lineHeight: '2', marginBottom: '20px' }}>
                          <li>✓ Real-time Code Synchronization</li>
                          <li>✓ Multi-language Support (C++, Java, JS)</li>
                          <li>✓ Integrated WebRTC Video chat</li>
                      </ul>
                      {/* Ye naya link add kiya hai baaki sections ki tarah */}
                      <Link to="/lab-lobby" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>Enter Collab Lab <ChevronRight size={16} /></Link>
                  </div>
                  <div style={{ flex: '1 1 400px', background: '#1e293b', borderRadius: '16px', padding: '40px', border: '1px solid #334155', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                      <Zap size={100} color="#3b82f6" />
                      {/* Ideally, replace this Zap icon with a mockup image of your IDE later */}
                  </div>
              </div>
          </FadeInWhenVisible>

          {/* Feature 2 (Reversed) */}
          <FadeInWhenVisible direction="left">
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '50px', marginBottom: '100px' }}>
                  <div style={{ flex: '1 1 400px', background: '#1e293b', borderRadius: '16px', padding: '40px', border: '1px solid #334155', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                       <Briefcase size={100} color="#a855f7" />
                  </div>
                  <div style={{ flex: '1 1 400px' }}>
                      <div style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', marginBottom: '20px', fontWeight: 'bold' }}>02. AI Resume Intelligence</div>
                      <h2 style={{ fontSize: '2.5rem', color: '#f8fafc', marginBottom: '20px' }}>Beat the ATS, <br/> Land the Interview.</h2>
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
                          General resume builders don't work for tech roles. Upload your PDF and let our specialized AI engine scan it against real-world Software Engineering requirements. Find missing keywords before the recruiter does.
                      </p>
                      <Link to="/resume-analyser" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>Scan Resume Now <ChevronRight size={16} /></Link>
                  </div>
              </div>
          </FadeInWhenVisible>

          {/* Feature 3 */}
          <FadeInWhenVisible direction="right">
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '50px' }}>
                  <div style={{ flex: '1 1 400px' }}>
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px 16px', borderRadius: '8px', display: 'inline-block', marginBottom: '20px', fontWeight: 'bold' }}>03. CS Fundamentals Arena</div>
                      <h2 style={{ fontSize: '2.5rem', color: '#f8fafc', marginBottom: '20px' }}>Master the Core, <br/> Crack the Written.</h2>
                      <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
                          Placement exams test more than just coding. Sharpen your theoretical knowledge with our extensive question bank covering Operating Systems, Database Management, and Computer Networks.
                      </p>
                      <Link to="quiz" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>View Quizzes <ChevronRight size={16} /></Link>
                  </div>
                  <div style={{ flex: '1 1 400px', background: '#1e293b', borderRadius: '16px', padding: '40px', border: '1px solid #334155', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                       <LayoutGrid size={100} color="#10b981" />
                  </div>
              </div>
          </FadeInWhenVisible>

      </section>

      {/* 4. GET STARTED SECTION */}
      <FadeInWhenVisible delay={0.2}>
          <section className="cta-section" style={{ padding: '80px 20px' }}>
            <div className="cta-card" style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(145deg, #1e293b, #0f172a)', padding: '60px 40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <h2 className="cta-title" style={{ fontSize: '3rem', color: '#f8fafc', marginBottom: '20px' }}>Ready to crack your <br /> <span style={{ color: '#3b82f6' }}>Tech Interview?</span></h2>
              <p className="cta-description" style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
                Join the growing community of CS students taking control of their placement preparation.
              </p>

              <Link to="/signup" className="cta-btn" style={{ background: '#3b82f6', color: 'white', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: '40px' }}>
                Join PrepConnect Free <ArrowRight size={20} style={{ marginLeft: '10px' }}/>
              </Link>

              <div className="cta-stats" style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', borderTop: '1px solid #334155', paddingTop: '40px' }}>
                <div className="stat-item">
                  <span className="stat-num" style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc' }}>100%</span>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>Free Forever</span>
                </div>
                <div className="stat-item">
                  <span className="stat-num" style={{ display: 'block', fontSize: '2rem', fontWeight: 'bold', color: '#f8fafc' }}>24/7</span>
                  <span className="stat-label" style={{ color: '#94a3b8' }}>Live Code Sync</span>
                </div>
              </div>
            </div>
          </section>
      </FadeInWhenVisible>

    </div>
  );
};

export default Home;