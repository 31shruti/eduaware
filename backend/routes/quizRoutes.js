const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createQuiz, getAvailableQuizzes, getQuizById, submitQuiz } = require('../controllers/quizController');

router.post('/', protect, authorize('trainer'), createQuiz);
router.get('/available', protect, authorize('student'), getAvailableQuizzes);
router.get('/:id', protect, authorize('student'), getQuizById);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);

module.exports = router;