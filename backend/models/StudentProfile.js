// models/StudentProfile.js
const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    atsScore: { type: Number, default: 75 },
    quizAccuracy: { type: Number, default: 0 },
    collabHours: { type: Number, default: 0 },
    rank: { type: String, default: "Pro" },
    performanceTrend: [
        { name: String, score: Number }
    ]
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);