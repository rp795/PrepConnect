import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'

createRoot(document.getElementById('root')).render(

    // <App />

    <GoogleOAuthProvider clientId="20033053573-gah15fakuhdiq2b56b9fd71fvmu575uh.apps.googleusercontent.com"> 
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
   
)
