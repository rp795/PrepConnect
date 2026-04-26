require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const pdfjsLib = require('pdfjs-dist');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;


// 1. DATABASE CONNECTION
const connectDB = require('./config/db'); 
connectDB();

const User = require('./models/User'); //  User Model

// 2. APP SETUP & GLOBAL MIDDLEWARES

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Multer Setup 
const upload = multer({ storage: multer.memoryStorage() });


// 3. REST API ROUTES (Existing)

app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

app.get('/', (req, res) => {
    res.send(" PrepConnect Server is Live & Running..."); 
});


// 4. NEW API: PROFILE & AI RESUME 


// A. Fetch Profile Data (Page reload par data wapas laane ke liye)
app.get('/api/profile/get/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error fetching profile" });
    }
});

// B. Save/Update Profile
app.put('/api/profile/update', async (req, res) => {
    try {
        const { userId, name, headline, intro, skills, links, image } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { name, headline, intro, skills, links, image },
            { new: true }
        );
        res.status(200).json({ message: "Profile Updated Successfully!", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});


app.post('/api/resume/analyze', upload.single('resumePdf'), async (req, res) => {
    let resumeText = ""; 

    try {
        const targetRole = req.body.targetRole || "MERN Stack Developer";

        if (!req.file) return res.status(400).json({ error: "PDF upload nahi hui!" });

        // 1. Extract Text from PDF
        const data = new Uint8Array(req.file.buffer);
        const loadingTask = pdfjsLib.getDocument({ data, disableFontFace: true });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            fullText += content.items.map(item => item.str).join(" ") + " ";
        }
        resumeText = fullText;

        if (!resumeText.trim()) {
            return res.status(400).json({ error: "PDF se text read nahi ho paya." });
        }

        console.log(` Extracted Text. Hitting Google API directly for: ${targetRole}...`);

        // 2.  DIRECT FETCH REQUEST (NO SDK REQUIRED) 
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBIKFuLtYaykIy0JQptXN-6nD8ffsOX0CM"; 
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;


        const prompt = `Act as an expert ATS (Applicant Tracking System).
            Analyze this resume strictly for the role of: ${targetRole}.
            Return ONLY a valid JSON object. No extra text, no markdown.
            Structure:
            {
              "score": <number 0-100>,
              "match": ["<skill1>", "<skill2>"],
              "missing": ["<missing-skill1>"],
              "advice": "<2 lines of Hinglish advice to improve this resume for ${targetRole}>"
            }
            Resume Text: ${resumeText.substring(0, 5000)}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const aiData = await response.json();

        // Agar Google ne error bheja toh terminal mein saaf dikhega
        if (!response.ok) {
            console.error("Google API Direct Error:", aiData);
            return res.status(500).json({ error: `API Error: ${aiData.error.message}` });
        }

        // 3. Extract and Parse the Text
        const rawText = aiData.candidates[0].content.parts[0].text;
        const cleanJson = rawText.replace(/```json|```/g, "").trim();
        
        // 4. Send back to React
        res.status(200).json(JSON.parse(cleanJson));

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "AI analysis failed." });
    }
});



//  AI QUIZ GENERATOR ROUTE (WITH FALLBACK)

app.post('/api/quiz/generate', async (req, res) => {
    const subject = req.body.subject || "Computer Science";
    
    try {
        console.log(`Generating AI Quiz for: ${subject}`);
        const apiKey = process.env.GEMINI_API_KEY; 
        
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const prompt = `Generate a highly engaging, medium-difficulty multiple-choice quiz of exactly 5 questions for Computer Science subject: ${subject}.
        Return ONLY a raw JSON array of objects. Do not include markdown blocks like \`\`\`json.
        Structure strictly like this:
        [
          {
            "question": "Clear question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "Exact text of the correct option"
          }
        ]`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        const rawText = data.candidates[0].content.parts[0].text;
        const cleanJson = rawText.replace(/```json|```/g, "").trim();
        const quizData = JSON.parse(cleanJson);

        res.status(200).json(quizData);

    } catch (error) {
        console.error("AI Quiz Failed, Using Presentation Fallback Data!");
        
        // Agar net slow hua ya limit hit hui, toh ye safe data chalega
        const fallbackQuiz = [
            {
                question: `Which of the following is a core concept of ${subject}?`,
                options: ["Encapsulation", "Photosynthesis", "Gravity", "Thermodynamics"],
                answer: "Encapsulation"
            },
            {
                question: `What is a common error developers face in ${subject}?`,
                options: ["Null Pointer Exception", "Typo", "Hardware Crash", "Power Outage"],
                answer: "Null Pointer Exception"
            },
            {
                question: `What is the primary goal of mastering ${subject}?`,
                options: ["Building efficient systems", "Cooking", "Painting", "Singing"],
                answer: "Building efficient systems"
            },
            {
                question: `In ${subject}, what is used to optimize performance?`,
                options: ["Caching", "Sleeping", "Formatting", "Deleting"],
                answer: "Caching"
            },
            {
                question: `Which tool is most relevant to ${subject}?`,
                options: ["VS Code", "Hammer", "Tractor", "Stethoscope"],
                answer: "VS Code"
            }
        ];
        
        res.status(200).json(fallbackQuiz);
    }
});


// 5. HTTP SERVER & SOCKET.IO SETUP

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});


// 6. REAL-TIME LOGIC (SOCKET.IO)


const roomCodes = {};
const videoRooms = {};
const socketVideoSessions = new Map();
const defaultCode = '// Welcome to PrepConnect Pro Lab\n// Start typing your brilliant code here...\n\nconst greet = "Hello from PrepConnect!";\nconsole.log(greet);';

app.get('/api/collab/check-room/:roomId', (req, res) => {
    const { roomId } = req.params;
    // Agar roomCodes object mein ye id pehle se hai, toh true bhejo
    if (roomCodes[roomId]) {
        res.status(200).json({ exists: true });
    } else {
        res.status(404).json({ msg: "Invalid Room Code. This room does not exist!" });
    }
});

io.on('connection', (socket) => {
    console.log(" New Client Connected:", socket.id);

    // --- A. Govt Sector: Live Quiz Logic ---
    socket.on('join_quiz', (data) => {
        socket.join("govt_quiz_room");
        console.log(`👤 ${data.username} joined Quiz Room`);
    });

    socket.on('admin_start_quiz', (questions) => {
        console.log(" Quiz Started by Admin");
        let currentQ = 0;
        
        const sendQuestion = () => {
            if (questions && currentQ < questions.length) {
                io.to("govt_quiz_room").emit('receive_question', questions[currentQ]);
                currentQ++;
                setTimeout(sendQuestion, 15000); // 15 seconds per question
            } else {
                io.to("govt_quiz_room").emit('quiz_over', "Finish!");
            }
        };
        sendQuestion();
    });

    // --- B. Private Sector: Collab Lab ---
    socket.on('join_lab', (roomId) => {
        socket.join(roomId);
        console.log(` User entered Lab Room: ${roomId}`);
        
        // Agar naya room hai toh default code daalo
        if (!roomCodes[roomId]) {
            roomCodes[roomId] = defaultCode;
        }
        // Naye aane wale user ko is room ka latest code bhej do
        socket.emit('code_update', roomCodes[roomId]);
    });

    // Video Calling Signaling
    socket.on('join_video_room', (data) => {
        const { roomId } = data;

        if (!roomId) {
            return;
        }

        if (!videoRooms[roomId]) {
            videoRooms[roomId] = new Set();
        }

        const existingPeerIds = Array.from(videoRooms[roomId]);

        socketVideoSessions.set(socket.id, { roomId });
        videoRooms[roomId].add(socket.id);

        socket.emit('video_room_users', existingPeerIds);
    });

    socket.on('send_webrtc_offer', ({ targetPeerId, offer }) => {
        if (!targetPeerId || !offer) {
            return;
        }

        io.to(targetPeerId).emit('webrtc_offer', {
            fromPeerId: socket.id,
            offer
        });
    });

    socket.on('send_webrtc_answer', ({ targetPeerId, answer }) => {
        if (!targetPeerId || !answer) {
            return;
        }

        io.to(targetPeerId).emit('webrtc_answer', {
            fromPeerId: socket.id,
            answer
        });
    });

    socket.on('send_webrtc_ice_candidate', ({ targetPeerId, candidate }) => {
        if (!targetPeerId || !candidate) {
            return;
        }

        io.to(targetPeerId).emit('webrtc_ice_candidate', {
            fromPeerId: socket.id,
            candidate
        });
    });

    socket.on('leave_video_room', () => {
        const session = socketVideoSessions.get(socket.id);

        if (!session) {
            return;
        }

        const { roomId } = session;
        const room = videoRooms[roomId];

        if (room) {
            room.delete(socket.id);
            socket.to(roomId).emit('user_left_video', socket.id);

            if (room.size === 0) {
                delete videoRooms[roomId];
            }
        }

        socketVideoSessions.delete(socket.id);
    });

    // Sync Language
socket.on('language_sync', ({ roomId, language }) => {
    socket.to(roomId).emit('language_update', language);
});

// Sync Whiteboard Drawing
socket.on('draw_sync', ({ roomId, x0, y0, x1, y1 }) => {
    socket.to(roomId).emit('draw_line', { x0, y0, x1, y1 });
});

    // Code Typing Syncing
    socket.on('code_sync', (data) => {
        // Server memory update karo
        roomCodes[data.roomId] = data.code;
        // Type karne wale ko chhod kar baaki sabko bhejo
        socket.to(data.roomId).emit('code_update', data.code);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        const session = socketVideoSessions.get(socket.id);

        if (session) {
            const { roomId } = session;
            const room = videoRooms[roomId];

            if (room) {
                room.delete(socket.id);
                socket.to(roomId).emit('user_left_video', socket.id);

                if (room.size === 0) {
                    delete videoRooms[roomId];
                }
            }

            socketVideoSessions.delete(socket.id);
        }

        console.log(" Client Disconnected:", socket.id);
    });
});


// 7. START SERVER

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(` Server is sprinting on port ${PORT}`);
});
