import CodingQuestion from "../models/codingQuestionModel.js";
import Exam from "../models/examModel.js";
import asyncHandler from "express-async-handler";

// @desc    Submit a coding answer
// @route   POST /api/coding/submit
// @access  Private (Student)
const submitCodingAnswer = asyncHandler(async (req, res) => {
  const { examId, code, language } = req.body;

  if (!code || !language || !examId) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Find the exam by its examId (UUID)
  const exam = await Exam.findOne({ examId });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }

  // Ensure codingQuestion and submittedAnswer exist
  if (!exam.codingQuestion) {
    exam.codingQuestion = {};
  }
  if (!exam.codingQuestion.submittedAnswer) {
    exam.codingQuestion.submittedAnswer = {};
  }

  // Update the embedded submittedAnswer
  exam.codingQuestion.submittedAnswer = {
    code,
    language,
    status: "submitted", // Set status to submitted
    submissionDate: new Date(), // Add submission date
  };

  // Save the updated exam
  const updatedExam = await exam.save();

  res.status(200).json({
    success: true,
    data: updatedExam.codingQuestion, // Return the updated coding question part of the exam
  });
});

// @desc    Create a new coding question
// @route   POST /api/coding/question
// @access  Private (Teacher)
const createCodingQuestion = asyncHandler(async (req, res) => {
  const { question, description, examId } = req.body;
  console.log("Received coding question data:", {
    question,
    description,
    examId,
  });

  if (!question || !description || !examId) {
    const missingFields = [];
    if (!question) missingFields.push("question");
    if (!description) missingFields.push("description");
    if (!examId) missingFields.push("examId");

    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  try {
    // Check if a question already exists for this exam
    console.log("createCodingQuestion - Checking for existing question with examId:", examId.toString());
    const existingQuestion = await CodingQuestion.findOne({
      examId: examId.toString(),
    });
    console.log("createCodingQuestion - Existing question check result:", existingQuestion);

    if (existingQuestion) {
      res.status(400);
      throw new Error(`A coding question already exists for exam: ${examId}`);
    }

    const newQuestion = await CodingQuestion.create({
      question,
      description,
      examId: examId.toString(), // Ensure examId is stored as a string
      teacher: req.user._id,
    });

    console.log("createCodingQuestion - Created new question with examId:", newQuestion.examId);

    res.status(201).json({
      success: true,
      data: newQuestion,
    });
  } catch (error) {
    console.error("Error creating coding question:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack,
    });
  }
});

// @desc    Get all coding questions
// @route   GET /api/coding/questions
// @access  Private
const getCodingQuestions = asyncHandler(async (req, res) => {
  const questions = await CodingQuestion.find()
    .select("-submittedAnswer") // Don't send other submissions
    .populate("teacher", "name email");

  res.status(200).json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// @desc    Get a single coding question
// @route   GET /api/coding/questions/:id
// @access  Private
const getCodingQuestion = asyncHandler(async (req, res) => {
  const question = await CodingQuestion.findById(req.params.id).populate(
    "teacher",
    "name email"
  );

  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  res.status(200).json({
    success: true,
    data: question,
  });
});

// @desc    Get coding question for a specific exam
// @route   GET /api/coding/questions/exam/:examId
// @access  Private (Student)
const getExamCodingQuestion = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("getExamCodingQuestion - Received examId:", examId);
  console.log("getExamCodingQuestion - Type of examId:", typeof examId);

  if (!examId) {
    res.status(400);
    throw new Error("Exam ID is required");
  }

  try {
    // Find the exam by its examId (UUID) field
    const exam = await Exam.findOne({ examId });
    console.log("getExamCodingQuestion - Exam query result:", exam);

    if (!exam) {
      res.status(404);
      throw new Error(`No exam found with ID: ${examId}`);
    }

    // Check if the exam has a coding question embedded
    if (!exam.codingQuestion || !exam.codingQuestion.question) {
      res.status(404);
      throw new Error(`No coding question found for exam: ${examId}`);
    }

    res.status(200).json({
      success: true,
      data: exam.codingQuestion, // Return the embedded coding question
    });
  } catch (error) {
    console.error("Error fetching coding question:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
      details: error.stack,
    });
  }
});

export {
  submitCodingAnswer,
  createCodingQuestion,
  getCodingQuestions,
  getCodingQuestion,
  getExamCodingQuestion,
};
