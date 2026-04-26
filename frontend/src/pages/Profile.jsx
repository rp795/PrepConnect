import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, Save, Camera, Github, Linkedin, 
  Globe, Code, X, Plus, Sparkles, Upload, 
  CheckCircle2, AlertTriangle 
} from 'lucide-react';

import '../styling/Profile.css'; // Make sure aapka CSS file ka path yahi ho

const Profile = () => {
  // 1. AUTHENTICATION DATA (LocalStorage se ID aur Name nikalna)
  const loggedInUserId = localStorage.getItem('userId') || null; 
  const loggedInUserName = localStorage.getItem('userName') || "Student"; 

  // 2. ALL STATE VARIABLES
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // 3. PROFILE DATA STATE (Initial state mein user ka naam hoga, baaki sab khali)
  const [profile, setProfile] = useState({
    name: loggedInUserName,
    headline: "",
    intro: "",
    skills: [],
    links: { github: "", linkedin: "", portfolio: "" },
    image: null,
  });

  const profilePicRef = useRef(null);

  // 4. FETCH REAL DATA FROM DATABASE ON PAGE LOAD
  useEffect(() => {
    if (!loggedInUserId) return; // Agar ID nahi hai toh fetch mat karo

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/get/${loggedInUserId}`);
        if (response.ok) {
          const data = await response.json();
          // Backend se aaye hue data ko state mein set karna
          setProfile({
            name: data.name || loggedInUserName,
            headline: data.headline || "",
            intro: data.intro || "",
            skills: data.skills || [],
            links: data.links || { github: "", linkedin: "", portfolio: "" },
            image: data.image || null
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile.", error);
      }
    };
    fetchProfile();
  }, [loggedInUserId]);

  // 5. HELPER FUNCTIONS
  // Smart Avatar Logic (E.g., Aditya Raj -> AR)
  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  // Profile Completion Percentage Calculator
  const calculateCompletion = () => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.headline) score += 10;
    if (profile.intro && profile.intro.length > 10) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.links?.github) score += 10;
    if (profile.links?.linkedin) score += 10;
    if (profile.image) score += 20;
    return score;
  };
  const completionPercentage = calculateCompletion();

  // 6. INPUT HANDLERS
  const handleInput = (e, section) => {
    if (section === 'links') {
      setProfile({ ...profile, links: { ...profile.links, [e.target.name]: e.target.value } });
    } else {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skillToRemove) });
  };

  // 7. BACKEND API CALLS (SAVE & AI ANALYZE)
 const handleSave = async () => {
  // Ye line add kijiye:
  console.log("LocalStorage mein id hai:", localStorage.getItem('userId'));

  if (!loggedInUserId) {
    alert("Please Login First!");
    return;
  }
    setIsSaving(true);
    try {
      await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: loggedInUserId, ...profile })
      });
      setIsSaving(false);
      setIsEditing(false);
      alert("Profile Saved Successfully! ✅");
    } catch (error) {
      console.error("Save Error:", error);
      setIsSaving(false);
      alert("Failed to save profile.");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert("Sirf PDF file upload karo.");
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resumePdf', file); 

    try {
      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        setResumeData(data); 
      } else {
        alert(data.error || "Server failed to analyze resume.");
      }
    } catch (error) {
      console.error("Resume Upload Error:", error);
      alert("Network Error! Is backend running?");
    } finally {
      setAnalyzing(false);
    }
  };

  // 8. RENDER UI
return (
  <div className="ultimate-profile-page">
    {/* TOP ACTION BAR */}
    <div className="top-action-bar">
      <div className="header-title">
        <h1>User <span>Profile</span></h1>
        <p>Manage your professional identity and track progress.</p>
      </div>
      <div className="action-buttons">
        {isEditing ? (
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setIsEditing(true)}>
            <Edit3 size={18} /> Edit Profile
          </button>
        )}
      </div>
    </div>

    <div className="profile-grid">
      
      {/* --- SECTION 1: IDENTITY & COMPLETION --- */}
      <div className="glass-panel main-info-panel">
        <div className="identity-section">
          <div className="avatar-wrapper">
            <div className="avatar-main">
              {profile.image ? (
                <img src={profile.image} alt="Avatar" /> 
              ) : (
                <div className="placeholder-avatar">{getInitials(profile.name)}</div>
              )}
              {isEditing && (
                <div className="avatar-overlay" onClick={() => profilePicRef.current.click()}>
                  <Camera size={24} />
                  <input type="file" ref={profilePicRef} hidden onChange={handleImage} accept="image/*" />
                </div>
              )}
            </div>
          </div>
          
          <div className="name-details">
            {isEditing ? (
              <>
                <input name="name" value={profile.name} onChange={handleInput} className="edit-inp-name" placeholder="Full Name" />
                <input name="headline" value={profile.headline} onChange={handleInput} className="edit-inp-headline" placeholder="e.g. Full Stack Developer" />
              </>
            ) : (
              <>
                <h2>{profile.name}</h2>
                <p className={profile.headline ? "headline-text" : "warning-text"}>
                  {profile.headline || "⚠️ Add a headline to stand out"}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="profile-completion-box">
          <div className="completion-visual">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="ring-bg" />
              <circle cx="50" cy="50" r="45" className="ring-fill" 
                style={{ strokeDashoffset: 282.6 - (282.6 * completionPercentage) / 100 }} 
              />
            </svg>
            <div className="completion-num">
              <span>{completionPercentage}%</span>
            </div>
          </div>
          <p>Profile Strength</p>
        </div>
      </div>

      {/* --- SECTION 2: LINKS & SKILLS --- */}
      <div className="glass-panel sidebar-panel">
        <div className="content-block">
          <h3><Globe size={18} /> Connectivity</h3>
          <div className="links-stack">
            <div className="link-row">
              <Github size={18} />
              {isEditing ? (
                <input name="github" value={profile.links?.github || ""} onChange={(e) => handleInput(e, 'links')} className="link-edit-inp" placeholder="Github Link" /> 
              ) : <a href={profile.links?.github} target="_blank" rel="noreferrer">{profile.links?.github ? "GitHub Profile" : "Not Linked"}</a>}
            </div>
            <div className="link-row">
              <Linkedin size={18} />
              {isEditing ? (
                <input name="linkedin" value={profile.links?.linkedin || ""} onChange={(e) => handleInput(e, 'links')} className="link-edit-inp" placeholder="LinkedIn Link" /> 
              ) : <a href={profile.links?.linkedin} target="_blank" rel="noreferrer">{profile.links?.linkedin ? "LinkedIn Profile" : "Not Linked"}</a>}
            </div>
          </div>
        </div>

        <div className="content-block">
          <h3><Code size={18} /> Tech Arsenal</h3>
          <div className="skills-cloud">
            {profile.skills?.map((skill, index) => (
              <span key={index} className="skill-chip">
                {skill}
                {isEditing && <X size={14} onClick={() => removeSkill(skill)} />}
              </span>
            ))}
            {isEditing && (
              <div className="add-skill-box">
                <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} placeholder="Add skill..." />
                <Plus size={18} onClick={addSkill} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SECTION 3: BIO & INTRO --- */}
      <div className="glass-panel bio-panel">
        <h3>About Me</h3>
        {isEditing ? (
          <textarea name="intro" value={profile.intro} onChange={handleInput} className="bio-area" rows="6" placeholder="Tell us about your journey and goals..." />
        ) : (
          <p className={profile.intro ? "bio-text" : "warning-text"}>
            {profile.intro || "⚠️ Write a short bio to complete your profile."}
          </p>
        )}
      </div>

    </div>
  </div>
);
}
export default Profile;
