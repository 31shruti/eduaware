const Quiz = require('../models/Quiz');
const Certificate = require('../models/Certificate');
const WorkshopRequest = require('../models/WorkshopRequest');

// @route  POST /api/quiz
// @access Trainer only
const createQuiz = async (req, res) => {
  try {
    const { workshopId, questions } = req.body;

    const quiz = await Quiz.create({ workshop: workshopId, questions });
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/quiz/available
// @access Student only — quizzes for conducted workshops
const getAvailableQuizzes = async (req, res) => {
  try {
    const conductedWorkshops = await WorkshopRequest.find({ status: 'conducted' }).select('_id topic');
    const workshopIds = conductedWorkshops.map((w) => w._id);

    const quizzes = await Quiz.find({ workshop: { $in: workshopIds } }).populate('workshop', 'topic preferredDate');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/quiz/:id
// @access Student only — get quiz WITHOUT correct answers exposed
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate('workshop', 'topic');
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // strip correctOption before sending to student
    const safeQuiz = {
      _id: quiz._id,
      workshop: quiz.workshop,
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
      })),
    };

    res.json(safeQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/quiz/:id/submit
// @access Student only
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of selected option indices, same order as questions

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctOption === answers[i]) score++;
    });

    const passed = score / quiz.questions.length >= 0.6;
    let certificate = null;

    if (passed) {
      certificate = await Certificate.create({
        student: req.user._id,
        workshop: quiz.workshop,
        score,
        totalQuestions: quiz.questions.length,
      });
    }

    res.json({ score, total: quiz.questions.length, passed, certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuiz, getAvailableQuizzes, getQuizById, submitQuiz };