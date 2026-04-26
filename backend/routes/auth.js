
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // 
const User = require('../models/User');

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ name, email, password });
    
    // Password hashing
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    res.json({ msg: "User registered successfully!" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // JWT Token generate karna
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// --- GOOGLE OAUTH ROUTE (Fixed & Single) ---
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body; // Ye token frontend se aaya hai

       
        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const { email, name, picture } = googleResponse.data;

        
        let user = await User.findOne({ email });

        if (!user) {
         
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                name: name,
                email: email,
                password: hashedPassword,
                // image: picture 
            });
            await user.save();
        }

        // 4. User 
        const jwtToken = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'your_super_secret_key', // .env mein JWT_SECRET 
            { expiresIn: '7d' }
        );

        // 5. Frontend ko response 
        res.status(200).json({
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Backend Google Auth Error:", error.message);
        res.status(500).json({ msg: "Server error during Google Authentication" });
    }
});


// --- GET USER DATA FOR DASHBOARD ---

router.get('/user-data', async (req, res) => {
    try {
      
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ msg: "User ID is required" });
        }

       
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        
        res.json(user);

    } catch (err) {
        console.error("Dashboard Backend Error:", err.message);
       
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ msg: "Invalid User ID format" });
        }
        res.status(500).send("Server Error");
    }
});


// Route: Update User Stats
router.patch('/update-stats', async (req, res) => {
    try {
        const { userId, field, value, operation } = req.body; 

        let updateQuery = {};
        
        
        if (operation === 'add') {
            updateQuery = { $inc: { [field]: value } };
        } else {
           
            updateQuery = { $set: { [field]: value } };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateQuery, 
            { new: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        console.error("Stats Update Failed:", err.message);
        res.status(500).send("Stats Update Failed");
    }
});

module.exports = router;