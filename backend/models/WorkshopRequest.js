const mongoose = require('mongoose');

const workshopRequestSchema = new mongoose.Schema(
  {
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      enum: [
        'Cybersecurity',
        'Mental Health',
        'AI Literacy',
        'Financial Literacy',
        'Anti-Bullying',
        'Digital Safety',
      ],
    },
    preferredDate: { type: Date, required: true },
    className: { type: String, required: true },
    studentCount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'conducted'],
      default: 'pending',
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    studentsPresent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkshopRequest', workshopRequestSchema);