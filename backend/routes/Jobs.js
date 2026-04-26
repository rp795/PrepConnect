const express = require('express');
const router = express.Router();
const Job = require('../models/Job');


router.get('/all', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedDate: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;