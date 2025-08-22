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
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
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
    // Optional coding submission captured at the submission root
    codingAnswer: {
      code: { type: String },
      language: { type: String },
    },
    // Status and reason for submission (e.g., auto-failed due to cheating)
    status: {
      type: String,
      enum: ['submitted', 'passed', 'failed', 'auto_failed'],
      default: 'submitted',
    },
    reason: { type: String },
    // Teacher approval for releasing cheating logs to students
    cheatingLogsApproved: {
      type: Boolean,
      default: false,
    },
    cheatingLogsApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cheatingLogsApprovedAt: {
      type: Date,
    },
    // Teacher approval for showing failure reason to students
    failureReasonApproved: {
      type: Boolean,
      default: false,
    },
    failureReasonApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    failureReasonApprovedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission; 