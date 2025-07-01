import mongoose from 'mongoose';

const submissionSchema = mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
          required: true,
        },
        selectedOption: { // For MCQs
          type: String,
        },
        codeAnswer: { // For coding questions
          type: String,
        },
        isCorrect: { // To easily see correctness
          type: Boolean,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission; 