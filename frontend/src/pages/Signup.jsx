
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import '../styling/Navbar.css'; 

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Yahan aapko apna Google Client ID daalna hoga (Google Cloud Console se milega)
  const GOOGLE_CLIENT_ID = "20033053573-gah15fakuhdiq2b56b9fd71fvmu575uh.apps.googleusercontent.com";

  // --- Normal Email/Password Signup ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  // --- Google OAuth Signup / Login ---
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // 1. Google token ko decode karke user ka naam, email aur photo nikalna
      const decodedData = jwtDecode(credentialResponse.credential);
      
      // 2. Apne backend par Google user ka data bhejna
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        name: decodedData.name,
        email: decodedData.email,
        image: decodedData.picture // Google profile picture
      });

      // 3. Backend se aaye token aur ID ko LocalStorage mein save karna
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);

      alert("Welcome to PrepConnect! 🚀");
      navigate('/'); // Seedha home/dashboard par bhej dena
    } catch (err) {
      console.error("Google Auth Error:", err);
      alert(err.response?.data?.msg || "Google Authentication Failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create <span>Account</span></h2>
            <p>Join PrepConnect to start your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-container">
              <User className="field-icon" size={20} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="auth-input"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required
              />
            </div>

            <div className="input-container">
              <Mail className="field-icon" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="auth-input"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required
              />
            </div>

            <div className="input-container">
              <Lock className="field-icon" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                className="auth-input"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn">
              Sign Up <ArrowRight size={20} />
            </button>
          </form>

          {/* --- Google Login Section --- */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
            <span style={{ margin: '0 10px', color: '#94a3b8', fontSize: '0.9rem' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                alert('Google Login Failed. Please try again.');
              }}
              theme="filled_black" // Dark mode theme ke liye
              shape="pill"
            />
          </div>

          <p className="auth-footer">
            Already have an account? 
            <Link to="/login" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Signup;