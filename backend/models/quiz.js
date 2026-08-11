const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    workshop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkshopRequest',
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: Number, required: true }, // index 0-3
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);