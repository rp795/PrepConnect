import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Code2, Play, TerminalSquare, Mic, MicOff, Video, VideoOff, PhoneOff, Terminal, PenTool, Code } from 'lucide-react';
import '../styling/PrivateSector.css';
import { useParams } from 'react-router-dom';

// Socket Connection
const socket = io('http://localhost:5000');
const rtcConfig = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const CollabLab = () => {
  const { roomId } = useParams();
  
  // --- Core States ---
  const [code, setCode] = useState('// Welcome to PrepConnect Pro Lab\n// Start typing your brilliant code here...\n\nconst greet = "Hello from PrepConnect!";\nconsole.log(greet);');
  const [output, setOutput] = useState('> Ready for execution...');
  
  // --- Meeting States ---
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [peers, setPeers] = useState({}); 

  // --- New Features States ---
  const [language, setLanguage] = useState('javascript');
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'whiteboard'
  
  // --- Refs ---
  const myVideoRef = useRef(null);
  const myStreamRef = useRef(null); 
  const peerConnectionsRef = useRef({});
  const pendingCandidatesRef = useRef({});

  // --- Initialization Effect ---
  useEffect(() => {
    socket.emit('join_lab', roomId);
    
    socket.off('code_update'); 
    socket.on('code_update', (newCode) => setCode(newCode));

    socket.off('language_update');
    socket.on('language_update', (newLang) => setLanguage(newLang));

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        myStreamRef.current = stream;
        
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = stream;
        }

        socket.emit('join_video_room', { roomId });

        socket.off('video_room_users');
        socket.on('video_room_users', (peerIds = []) => {
          peerIds.forEach((peerId) => createOfferForPeer(peerId));
        });

        socket.off('webrtc_offer');
        socket.on('webrtc_offer', async ({ fromPeerId, offer }) => {
          try {
            const peerConnection = createPeerConnection(fromPeerId);
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            await flushPendingCandidates(fromPeerId);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit('send_webrtc_answer', { targetPeerId: fromPeerId, answer: peerConnection.localDescription });
          } catch (error) {
            cleanupPeer(fromPeerId);
          }
        });

        socket.off('webrtc_answer');
        socket.on('webrtc_answer', async ({ fromPeerId, answer }) => {
          try {
            const peerConnection = peerConnectionsRef.current[fromPeerId];
            if (!peerConnection) return;
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            await flushPendingCandidates(fromPeerId);
          } catch (error) {
            cleanupPeer(fromPeerId);
          }
        });

        socket.off('webrtc_ice_candidate');
        socket.on('webrtc_ice_candidate', async ({ fromPeerId, candidate }) => {
          try {
            const peerConnection = peerConnectionsRef.current[fromPeerId];
            if (!peerConnection || !peerConnection.remoteDescription) {
              pendingCandidatesRef.current[fromPeerId] = [
                ...(pendingCandidatesRef.current[fromPeerId] || []),
                candidate,
              ];
              return;
            }
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {}
        });

        socket.off('user_left_video');
        socket.on('user_left_video', (peerId) => cleanupPeer(peerId));

      } catch (err) {
        console.error("Camera access denied or error:", err);
      }
    };

    initializeMedia();

    return () => {
      socket.off('code_update');
      socket.off('language_update');
      socket.off('video_room_users');
      socket.off('webrtc_offer');
      socket.off('webrtc_answer');
      socket.off('webrtc_ice_candidate');
      socket.off('user_left_video');
      socket.emit('leave_video_room');
      
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};
      pendingCandidatesRef.current = {};
      setPeers({});
    };
  }, [roomId]); 

  // --- WebRTC Helpers ---
  const flushPendingCandidates = async (peerId) => {
    const peerConnection = peerConnectionsRef.current[peerId];
    const pendingCandidates = pendingCandidatesRef.current[peerId] || [];
    if (!peerConnection || !peerConnection.remoteDescription) return;
    for (const candidate of pendingCandidates) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
    pendingCandidatesRef.current[peerId] = [];
  };

  const cleanupPeer = (peerId) => {
    if (peerConnectionsRef.current[peerId]) {
      peerConnectionsRef.current[peerId].close();
      delete peerConnectionsRef.current[peerId];
    }
    delete pendingCandidatesRef.current[peerId];
    setPeers(prev => {
      const updated = { ...prev };
      delete updated[peerId];
      return updated;
    });
  };

  const createPeerConnection = (peerId) => {
    if (peerConnectionsRef.current[peerId]) return peerConnectionsRef.current[peerId];
    const peerConnection = new RTCPeerConnection(rtcConfig);
    peerConnectionsRef.current[peerId] = peerConnection;

    if (myStreamRef.current) {
      myStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, myStreamRef.current);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('send_webrtc_ice_candidate', { targetPeerId: peerId, candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        setPeers(prev => ({ ...prev, [peerId]: remoteStream }));
      }
    };

    peerConnection.onconnectionstatechange = () => {
      if (['failed', 'disconnected', 'closed'].includes(peerConnection.connectionState)) {
        cleanupPeer(peerId);
      }
    };

    return peerConnection;
  };

  const createOfferForPeer = async (peerId) => {
    try {
      if (!peerId || peerConnectionsRef.current[peerId]) return;
      const peerConnection = createPeerConnection(peerId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('send_webrtc_offer', { targetPeerId: peerId, offer: peerConnection.localDescription });
    } catch (error) {
      cleanupPeer(peerId);
    }
  };

  // --- Actions & Handlers ---
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    socket.emit('code_sync', { roomId, code: newCode });
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit('language_sync', { roomId, language: newLang });
  };

  const runCode = async () => {
    setOutput('> Compiling and Executing...');
    
    if (language === 'javascript') {
      try {
        let logData = [];
        const originalLog = console.log;
        console.log = (...args) => { logData.push(args.join(' ')); };
        
        // eslint-disable-next-line no-new-func
        const executeFunction = new Function(code);
        executeFunction();
        
        console.log = originalLog;
        setOutput(logData.length > 0 ? logData.join('\n') : '> Code executed successfully (No output)');
      } catch (err) {
        setOutput(`> Runtime Error: ${err.message}`);
      }
    } else {
      const languageMap = { python: 'py', cpp: 'cpp', java: 'java' };
      
      try {
        const response = await fetch('https://api.codex.jaagrav.in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: code,
            language: languageMap[language],
            input: "" 
          })
        });
        
        const result = await response.json();
        console.log("Raw API Response:", result); 
        
        if (result.output && result.output.length > 0) {
          setOutput(result.output);
        } else if (result.error && result.error.length > 0) {
          setOutput(`> Compile Error:\n${result.error}`);
        } else {
          setOutput(`> Debugging Raw API Result:\n${JSON.stringify(result, null, 2)}`);
        }
      } catch (err) {
        console.error("Compiler API Error:", err);
        setOutput('> Error: Compiler API is currently unreachable. Please try again later.');
      }
    }
  };

  // --- Meeting Controls Logic ---
  const toggleVideo = () => {
    if (myStreamRef.current) {
      const videoTrack = myStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleMic = () => {
    if (myStreamRef.current) {
      const audioTrack = myStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  // const endCall = () => {

  // const userId = localStorage.getItem('userId');
  //   // Calculate hours (manlo aapne join time save kiya tha)
  //   const timeSpent = 2; // example 2 hours
    
  //   await axios.patch('http://localhost:5000/api/auth/update-stats', {
  //       userId,
  //       field: 'collabHours',
  //       value: userData.collabHours + timeSpent // Purane hours mein naya add karo
  //   });

  //   socket.emit('leave_video_room');
  //   if (myStreamRef.current) {
  //     myStreamRef.current.getTracks().forEach(track => track.stop());
  //   }
  //   Object.values(peerConnectionsRef.current).forEach((peerConnection) => peerConnection.close());
  //   peerConnectionsRef.current = {};
  //   pendingCandidatesRef.current = {};
  //   setPeers({});
  //   alert("Call Ended 🔴. Returning to Dashboard...");
  //   window.location.href = '/private/profile'; 
  // };

// 🔴 FIX: Yahan 'async' add kiya hai
// const endCall = async () => {
//   try {
//     const userId = localStorage.getItem('userId');
//     const token = localStorage.getItem('token');
    
//     // Example: Maan lo session 1 ghante ka tha
//     const timeSpent = 1; 

//     // 🔴 Backend update call
//     // Hum checks lagate hain taaki agar userData abhi load na hua ho toh crash na kare
//     if (userId && userData) {
//       await axios.patch('http://localhost:5000/api/auth/update-stats', {
//           userId,
//           field: 'collabHours',
//           value: (userData.collabHours || 0) + timeSpent 
//       }, {
//           headers: { Authorization: `Bearer ${token}` } // Security ke liye token zaroori hai
//       });
//     }

//     // --- Baaki ka existing logic ---
//     socket.emit('leave_video_room');
    
//     if (myStreamRef.current) {
//       myStreamRef.current.getTracks().forEach(track => track.stop());
//     }
    
//     Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
//     peerConnectionsRef.current = {};
//     pendingCandidatesRef.current = {};
//     setPeers({});

//     alert("Call Ended 🔴. Returning to Dashboard...");
//     window.location.href = '/private/profile'; 

//   } catch (error) {
//     console.error("Error updating collab hours:", error);
//     // Agar API fail bhi ho jaye, tab bhi call end honi chahiye
//     window.location.href = '/private/profile';
//   }
// };

const endCall = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      const timeSpent = 2; // Maan lo 2 ghante collab kiya

      if (userId) {
        // 🔴 FIX: Ab hum 'operation: add' bhej rahe hain
        await axios.patch('http://localhost:5000/api/auth/update-stats', {
            userId,
            field: 'collabHours',
            value: timeSpent,
            operation: 'add' // Backend ko bata rahe hain ki purane mein jodo
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
      }

      socket.emit('leave_video_room');
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach(track => track.stop());
      }
      Object.values(peerConnectionsRef.current).forEach((peerConnection) => peerConnection.close());
      peerConnectionsRef.current = {};
      pendingCandidatesRef.current = {};
      setPeers({});
      
      alert("Call Ended 🔴. Time logged! Returning to Dashboard...");
      window.location.href = '/private/profile'; 

    } catch (error) {
      console.error("Error saving time:", error);
      window.location.href = '/private/profile';
    }
  };

  return (
    <div className="lab-container">
      {/* --- HEADER --- */}
      <div className="lab-header">
        <div className="lab-logo">
          <TerminalSquare color="#6366f1" size={28} />
          <h2>Collab<span>Lab</span> <span className="pro-tag">PRO</span></h2>
          <span style={{ background: '#334155', padding: '5px 10px', borderRadius: '5px', fontSize: '0.9rem', marginLeft: '10px' }}>
           Room: {roomId}
          </span>
        </div>
        
        {/* TAB SWITCHER (Added smooth transitions) */}
        <div style={{ display: 'flex', gap: '10px', background: '#1e293b', padding: '5px', borderRadius: '8px' }}>
           <button 
             onClick={() => setActiveTab('code')} 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', 
               background: activeTab === 'code' ? '#3b82f6' : 'transparent', 
               color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
               transition: 'all 0.3s ease' 
             }}
           >
             <Code size={16}/> Editor
           </button>
           <button 
             onClick={() => setActiveTab('whiteboard')} 
             style={{ 
               display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', 
               background: activeTab === 'whiteboard' ? '#10b981' : 'transparent', 
               color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',
               transition: 'all 0.3s ease' 
             }}
           >
             <PenTool size={16}/> Whiteboard
           </button>
        </div>

        <div className="lab-actions">
          {activeTab === 'code' && (
            <>
              <select value={language} onChange={handleLanguageChange} style={{ background: '#334155', color: 'white', padding: '8px', borderRadius: '5px', border: 'none', marginRight: '10px', outline: 'none' }}>
                <option value="javascript">JavaScript (Node)</option>
                <option value="python">Python 3</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <button className="run-btn" onClick={runCode}>
                <Play size={18} fill="currentColor" /> Compile & Run
              </button>
            </>
          )}
        </div>
      </div>

      {/* --- WORKSPACE --- */}
      <div className="lab-workspace">
        
        {/* LEFT: Video Sidebar */}
        <div className="video-sidebar">
          <div className="video-card me">
            <video ref={myVideoRef} autoPlay muted playsInline className="cam-view"></video>
            <div className="video-overlay">You (Host)</div>
          </div>
          {Object.keys(peers).map(peerId => (
             <RemoteVideo key={peerId} stream={peers[peerId]} />
          ))}
          
          {/* Meeting Controls UI */}
          <div className="meeting-controls">
            <button className={`ctrl-btn ${isMicOn ? '' : 'danger'}`} onClick={toggleMic} title="Toggle Microphone">
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
            </button>
            <button className={`ctrl-btn ${isVideoOn ? '' : 'danger'}`} onClick={toggleVideo} title="Toggle Camera">
              {isVideoOn ? <Video size={22} /> : <VideoOff size={22} />}
            </button>
            <button className="ctrl-btn end-call" onClick={endCall} title="Leave Lab">
              <PhoneOff size={22} />
            </button>
          </div>
        </div>

        {/* RIGHT: Dynamic Area (Code OR Whiteboard) */}
        <div className="lab-main-area">
          {activeTab === 'code' ? (
            <>
              <div className="editor-tab">
                <Code2 size={18} color="#6366f1" /> main.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : language === 'java' ? 'java' : 'js'}
              </div>
              <textarea 
                className="code-editor" 
                value={code} 
                onChange={handleCodeChange} 
                spellCheck="false"
                placeholder="// Start typing your brilliant code here..."
              ></textarea>
              
              <div className="output-terminal">
                <div className="terminal-header"><Terminal size={14} /> Output Console ({language})</div>
                <div className="terminal-output" style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
              </div>
            </>
          ) : (
            <CollaborativeWhiteboard socket={socket} roomId={roomId} />
          )}
        </div>

      </div>
    </div>
  );
};

// --- Remote Video Component ---
const RemoteVideo = ({ stream }) => {
  const videoRef = useRef(null);
  useEffect(() => { 
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream; 
    }
  }, [stream]);
  return (
    <div className="video-card remote">
      <video ref={videoRef} autoPlay playsInline className="cam-view"></video>
      <div className="video-overlay">Collaborator</div>
    </div>
  );
};

// --- Collaborative Whiteboard Component (Moved OUTSIDE for performance) ---
const CollaborativeWhiteboard = ({ socket, roomId }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#3b82f6'); 
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    
    // Canvas Size Setup
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // Default Style
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const handleDrawLine = ({ x0, y0, x1, y1, color, size }) => {
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = size;
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.stroke();
      context.closePath();
    };

    const handleClear = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on('draw_line', handleDrawLine);
    socket.on('clear_canvas', handleClear);

    return () => {
      socket.off('draw_line', handleDrawLine);
      socket.off('clear_canvas', handleClear);
    };
  }, [socket]);

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    
    const x0 = parseFloat(canvas.getAttribute('data-last-x')) || x1;
    const y0 = parseFloat(canvas.getAttribute('data-last-y')) || y1;

    // Local Draw
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    // Sync Draw
    socket.emit('draw_sync', { roomId, x0, y0, x1, y1, color, size: lineWidth });

    canvas.setAttribute('data-last-x', x1);
    canvas.setAttribute('data-last-y', y1);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear_sync', { roomId }); 
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#0f172a', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
      
      {/* Whiteboard Pro Tools */}
      <div style={{ 
        position: 'absolute', top: 15, left: '50%', transform: 'translateX(-50%)', 
        display: 'flex', gap: '15px', background: 'rgba(30, 41, 59, 0.8)', 
        padding: '8px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)', zIndex: 10, alignItems: 'center'
      }}>
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ cursor: 'pointer', border: 'none', background: 'none', width: '25px', height: '25px' }} title="Pen Color" />
        
        <button onClick={() => {setColor('#1e293b'); setLineWidth(20);}} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }} title="Eraser">🧽</button>
        
        <button onClick={() => {setColor('#3b82f6'); setLineWidth(3);}} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }} title="Pen">✏️</button>
        
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>
        
        <button onClick={clearBoard} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '15px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>Clear All</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={(e) => {
          setIsDrawing(true);
          const rect = canvasRef.current.getBoundingClientRect();
          canvasRef.current.setAttribute('data-last-x', e.clientX - rect.left);
          canvasRef.current.setAttribute('data-last-y', e.clientY - rect.top);
        }}
        onMouseUp={() => setIsDrawing(false)}
        onMouseOut={() => setIsDrawing(false)}
        onMouseMove={draw}
        style={{ width: '100%', height: '100%', cursor: 'crosshair', background: '#1e293b' }}
      />
    </div>
  );
};

export default CollabLab;