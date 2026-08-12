const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getTrainers } = require('../controllers/authController');

router.get('/trainers', protect, authorize('admin'), getTrainers);

module.exports = router;