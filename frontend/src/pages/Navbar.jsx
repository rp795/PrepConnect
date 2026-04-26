import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Rocket, LayoutGrid, Zap, Briefcase } from 'lucide-react';
import '../styling/Navbar.css';
// import Profile from './Profile';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Getting data safely
  const userName = localStorage.getItem('userName') || "User";
  const token = localStorage.getItem('token');

  // Handle scroll for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        
        {/* 1. Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <Rocket color="#0f172a" size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-text">PREP<span>CONNECT</span></span>
        </Link>

        {/* 2. Center Menu Pill */}
        <div className="nav-links">
          <Link to="/govt" className={`nav-item ${isActive('/govt') ? 'active' : ''}`}>
            <LayoutGrid size={18} /> Dashboard
          </Link>
          <Link to="/quiz" className={`nav-item ${isActive('/govt-quiz') ? 'active' : ''}`}>
            <Zap size={18} /> Live Quiz
          </Link>
          <div className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Coming Soon">
            <Briefcase size={18} /> Private
          </div>
        </div>

        {/* 3. User Actions / Auth */}
  <Link to="/private/Profile">
        <div className="nav-actions">
          {token ? (
            <div className="user-pill">
            
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
             
              <span className="user-name">{userName}</span>
              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
         
          ) : (
            <>
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Join Now</Link>
            </>
          )}
        </div>
   </Link>
      </div>
     
    </nav>
  );
};

export default Navbar;