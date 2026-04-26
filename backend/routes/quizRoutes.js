const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Route: Add a new question
router.post('/add', async (req, res) => {
  try {
    const { question, options, correct } = req.body;
    const newQuestion = new Quiz({ question, options, correct });
    await newQuestion.save();
    res.status(201).json({ msg: "Question Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: Get all questions 
router.get('/all', async (req, res) => {
  try {
    const questions = await Quiz.find().sort({ createdAt: -1 });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;