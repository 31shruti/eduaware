const WorkshopRequest = require('../models/WorkshopRequest');

// @route  POST /api/workshops
// @access School only
const createRequest = async (req, res) => {
  try {
    const { topic, preferredDate, className, studentCount } = req.body;

    const request = await WorkshopRequest.create({
      school: req.user._id,
      topic,
      preferredDate,
      className,
      studentCount,
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/workshops/my
// @access School only — see their own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await WorkshopRequest.find({ school: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/workshops
// @access Admin only — see all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await WorkshopRequest.find()
      .populate('school', 'name schoolName email')
      .populate('assignedTrainer', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/workshops/:id/assign
// @access Admin only — assign a trainer
const assignTrainer = async (req, res) => {
  try {
    const { trainerId } = req.body;

    const request = await WorkshopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.assignedTrainer = trainerId;
    request.status = 'assigned';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/workshops/trainer
// @access Trainer only — see their assigned workshops
const getTrainerWorkshops = async (req, res) => {
  try {
    const requests = await WorkshopRequest.find({ assignedTrainer: req.user._id })
      .populate('school', 'name schoolName')
      .sort({ preferredDate: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/workshops/:id/conduct
// @access Trainer only — mark as conducted
const markConducted = async (req, res) => {
  try {
    const request = await WorkshopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'conducted';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  assignTrainer,
  getTrainerWorkshops,
  markConducted,
};

// @route  PUT /api/workshops/:id/attendance
// @access Trainer only
const markAttendance = async (req, res) => {
  try {
    const { studentsPresent } = req.body;

    const request = await WorkshopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.studentsPresent = studentsPresent;
    request.status = 'conducted';
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  assignTrainer,
  getTrainerWorkshops,
  markConducted,
  markAttendance, 
};