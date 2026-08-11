const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkshopRequest', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);