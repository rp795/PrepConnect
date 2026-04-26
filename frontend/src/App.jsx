
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Pages import
import GovtDashboard from './pages/GovtDashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './pages/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './pages/Footer';
import PrivateHome from './pages/PrivateHome';
import CollabLab from "./pages/CollabLab";
import Profile from './pages/Profile';
import ResumeAnalyser from "./pages/ResumeAnalyser"
import CollabLobby from './pages/CollabLobby';
import Quiz  from './pages/Quiz';
import AboutUs from './pages/AboutUs';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
   
      <Navbar />

      <div className="flex flex-col min-h-screen bg-[#0f172a]">
        {/* Routes Configuration */}
        <main className="flex-grow">
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/about" element={<AboutUs />} />
            {/* <Route path="/private/lab" element={<CollabLab />} /> */}
            <Route path="/private/profile" element={<Profile/>}/>

           
            <Route path="/resume-analyser" element={<ResumeAnalyser/>}/>
            <Route path="/lab-lobby" element={
  <ProtectedRoute>
    <CollabLobby />
  </ProtectedRoute>
} />

 <Route path="/quiz" element={
    <ProtectedRoute>
  <Quiz/>
  </ProtectedRoute>}/>


<Route path="/private/lab/:roomId" element={
  <ProtectedRoute>
    <CollabLab />
  </ProtectedRoute>
} />
             <Route path="/private" element={
              <ProtectedRoute>
                <PrivateHome />
              </ProtectedRoute>
            } />
            <Route
              path="/govt"
              element={
                <ProtectedRoute>
                  <GovtDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/private"
              element={
                <div className="text-white p-20 text-center">
                  Private Sector Module is under development...
                </div>
              }
            />


          </Routes>
          
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;