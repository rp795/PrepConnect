import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, LogIn } from 'lucide-react';
import axios from 'axios'; 

const CollabLobby = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // Naya random 6-character room code generate karna
  const handleCreateRoom = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/private/lab/${newCode}`);
  };

const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (roomCode.trim().length > 0) {
      try {
        const codeToCheck = roomCode.toUpperCase();
        
      
        await axios.get(`http://localhost:5000/api/collab/check-room/${codeToCheck}`);
        
        // Agar error nahi aaya, matlab room exist karta hai! Entry de do.
        navigate(`/private/lab/${codeToCheck}`);
        
      } catch (error) {
        // Agar 404 Not Found aaya, toh user ko rok do
        alert("❌ Invalid Room Code! Please check the code or ask your host to create a new one.");
        setRoomCode(''); 
      }
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      <div style={{ background: '#1e293b', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '400px', border: '1px solid #334155', textAlign: 'center' }}>
        
        <Users size={50} color="#3b82f6" style={{ marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '10px' }}>Join Collab Lab</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Create a new session or join a peer's room.</p>

        {/* Create Room Button */}
        <button 
          onClick={handleCreateRoom}
          style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}
        >
          <Plus size={20} /> Create New Room
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
          <span style={{ margin: '0 10px', color: '#94a3b8', fontSize: '0.9rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#334155' }}></div>
        </div>

        {/* Join Room Form */}
        <form onSubmit={handleJoinRoom} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Enter Room Code (e.g. X7B9P)" 
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: 'white', textTransform: 'uppercase' }}
            required
          />
          <button type="submit" style={{ padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <LogIn size={20} />
          </button>
        </form>

      </div>
    </div>
  );
};

export default CollabLobby;