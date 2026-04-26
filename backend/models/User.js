
// module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' }, // student ya admin
  date: { type: Date, default: Date.now },

  
  headline: { type: String, default: "" },
  intro: { type: String, default: "" },
  skills: { type: [String], default: [] },
  links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" }
  },
  image: { type: String, default: "" },

 //dashoboard
  atsScore: { type: Number, default: 85 }, 
  quizAccuracy: { type: Number, default: 72 },
  collabHours: { type: Number, default: 12 },
  rank: { type: String, default: "Pro" }
});

module.exports = mongoose.model('User', UserSchema);