import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

import '../styling/Navbar.css';

const Footer = () => {
  return (
    <>
      <footer className="footer-main">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              PREP<span>CONNECT</span>
            </Link>
            <p className="footer-desc">
              India's most trusted platform for real-time government job updates
              and competitive exam preparation. Built for the achievers of 2026.
            </p>
          </div>

          {/* Column 1: Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/govt">Govt Dashboard</Link></li>
              <li><Link to="/govt-quiz">Live Quiz</Link></li>
              <li><Link to="/private">Private Sector</Link></li>
              <li><Link to="/roadmap">Career Roadmap</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Syllabus Guide</a></li>
              <li><a href="#">Previous Papers</a></li>
              <li><a href="#">Study Material</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="footer-col">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li><Link to='/about'>About Us</Link></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Use</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 PrepConnect. All rights reserved.</p>

          <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            Made with <Heart size={14} color="#14b8a6" fill="#14b8a6" /> for Students
          </p>

          <div className="footer-socials">
            <a href="#" className="social-icon"><Github size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Linkedin size={20} /></a>
            <a href="#" className="social-icon"><Mail size={20} /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;