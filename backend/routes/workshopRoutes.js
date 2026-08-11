const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  assignTrainer,
  getTrainerWorkshops,
  markConducted,
  markAttendance,
} = require('../controllers/workshopController');

router.post('/', protect, authorize('school'), createRequest);
router.get('/my', protect, authorize('school'), getMyRequests);
router.get('/', protect, authorize('admin'), getAllRequests);
router.put('/:id/assign', protect, authorize('admin'), assignTrainer);
router.get('/trainer', protect, authorize('trainer'), getTrainerWorkshops);
router.put('/:id/conduct', protect, authorize('trainer'), markConducted);
router.put('/:id/attendance', protect, authorize('trainer'), markAttendance);

module.exports = router;