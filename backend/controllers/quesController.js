import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";
import mongoose from "mongoose";

const getQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("Question Exam id ", examId);

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
  }

  // First check if the user has access to this exam
  const Exam = mongoose.model('Exam');
  const exam = await Exam.findOne({ examId: examId });
  
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  // Check if the user is authorized to view questions for this exam
  if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Not authorized to view questions for this exam");
  }

  // For students, enforce exam availability window (liveDate <= now <= deadDate)
  if (req.user.role !== 'teacher') {
    const now = new Date();
    const startsAt = new Date(exam.liveDate);
    const endsAt = new Date(exam.deadDate);
    if (Number.isFinite(startsAt.getTime()) && now < startsAt) {
      res.status(403);
      throw new Error("Exam has not started yet");
    }
    if (Number.isFinite(endsAt.getTime()) && now > endsAt) {
      res.status(403);
      throw new Error("Exam has expired");
    }
  }

  const questions = await Question.find({ examId });
  console.log("Question Exam  ", questions);

  res.status(200).json(questions);
});

const createQuestion = asyncHandler(async (req, res) => {
  console.log("***Entering createQuestion controller***");
  const { question, options, examId } = req.body;

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
  }

  // First check if the user has access to this exam
  const Exam = mongoose.model('Exam');
  const exam = await Exam.findOne({ examId: examId });
  
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  // Check if the user is authorized to create questions for this exam
  if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to create questions for this exam");
  }

  const newQuestion = new Question({
    question,
    options,
    examId,
  });

  const createdQuestion = await newQuestion.save();

  if (createdQuestion) {
    res.status(201).json(createdQuestion);
  } else {
    res.status(400);
    throw new Error("Invalid Question Data");
  }
});

// @desc Update an existing question
// @route PUT /api/exams/questions/:questionId
// @access Private (teacher)
const updateQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { question, options, examId } = req.body;

  const questionToUpdate = await Question.findById(questionId);

  if (questionToUpdate) {
    // Check if the user is authorized to update this question
    const Exam = mongoose.model('Exam');
    const exam = await Exam.findOne({ examId: questionToUpdate.examId });
    
    if (!exam) {
      res.status(404);
      throw new Error("Exam not found");
    }

    // Check if the user is authorized to update questions for this exam
    if (req.user.role === 'teacher' && exam.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update questions for this exam");
    }

    questionToUpdate.question = question || questionToUpdate.question;
    questionToUpdate.options = options || questionToUpdate.options;
    questionToUpdate.examId = examId || questionToUpdate.examId; // Although examId shouldn't change here typically

    const updatedQuestion = await questionToUpdate.save();
    res.status(200).json(updatedQuestion);
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

export { getQuestionsByExamId, createQuestion, updateQuestion };
