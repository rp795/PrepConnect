import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google'; // Naya import Google Login ke liye
import "../styling/Navbar.css"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // 1. Standard Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
     
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userName', res.data.user.name);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  // 2. Real Google Login Logic
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Google se token milne ke baad
        const res = await axios.post('http://localhost:5000/api/auth/google', {
          token: tokenResponse.access_token 
        });

        // Backend se response aane ke baad 
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('userName', res.data.user.name);
        navigate('/');
      } catch (err) {
        console.error("Backend Google Auth Error:", err);
        alert(err.response?.data?.msg || "Google Login Failed on Server");
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      alert("Google Login was closed or failed.");
    }
  });

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome <span>Back</span></h2>
          <p>Login to access your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
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
            Sign In <LogIn size={20} />
          </button>
        </form>

        {/* Divider Section */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* Google Login Button (Now connected to hook) */}
        <button type="button" onClick={() => handleGoogleLogin()} className="google-auth-btn">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 48 48" 
            width="20px" 
            height="20px"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account? 
          <Link to="/signup" className="auth-link">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;