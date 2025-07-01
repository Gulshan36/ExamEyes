import asyncHandler from "express-async-handler";
import Exam from "./../models/examModel.js";
import Submission from "./../models/submissionModel.js";
import Question from "./../models/quesModel.js";
import mongoose from 'mongoose';

// @desc Get all exams
// @route GET /api/exams
// @access Public
const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find();
  res.status(200).json(exams);
});

// @desc Get a single exam by ID
// @route GET /api/exams/exam/:examId
// @access Private (teacher/admin)
const getExamById = asyncHandler(async (req, res) => {
  const paramExamId = req.params.examId;
  let exam = null;

  // First, try to find by MongoDB _id if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(paramExamId)) {
    exam = await Exam.findById(paramExamId);
  }

  // If not found by _id, or if the param was not a valid ObjectId, try to find by the UUID examId field
  if (!exam) {
    exam = await Exam.findOne({ examId: paramExamId });
  }

  if (exam) {
    // Ensure codingQuestion exists, even if empty, for frontend compatibility
    if (!exam.codingQuestion) {
      exam.codingQuestion = {}; // Initialize as an empty object
    }
    console.log("getExamById - exam.codingQuestion sent to frontend:", exam.codingQuestion);
    res.status(200).json(exam);
  } else {
    res.status(404);
    throw new Error("Exam not found");
  }
});

// @desc Create a new exam
// @route POST /api/exams
// @access Private (admin)
const createExam = asyncHandler(async (req, res) => {
  const { examName, totalQuestions, duration, liveDate, deadDate, codingQuestion } = req.body;

  const exam = new Exam({
    examName,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
    codingQuestion,
  });

  const createdExam = await exam.save();

  if (createdExam) {
    res.status(201).json(createdExam);
  } else {
    res.status(400);
    throw new Error("Invalid Exam Data");
  }
});

// @desc Update an exam
// @route PUT /api/exams/exam/:examId
// @access Private (teacher/admin)
const updateExam = asyncHandler(async (req, res) => {
  const { examName, totalQuestions, duration, liveDate, deadDate, codingQuestion } = req.body;
  const paramExamId = req.params.examId;
  let exam = null;

  console.log('Attempting to update exam with ID:', paramExamId);

  // First, try to find by MongoDB _id if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(paramExamId)) {
    console.log('Param is a valid ObjectId, trying findById...');
    exam = await Exam.findById(paramExamId);
    if (exam) console.log('Found exam by _id:', exam._id);
  }

  // If not found by _id, or if the param was not a valid ObjectId, try to find by the UUID examId field
  if (!exam) {
    console.log('Not found by _id, or not a valid ObjectId. Trying findOne by examId (UUID)...');
    exam = await Exam.findOne({ examId: paramExamId });
    if (exam) console.log('Found exam by examId (UUID):', exam.examId);
  }

  if (exam) {
    exam.examName = examName || exam.examName;
    exam.totalQuestions = totalQuestions || exam.totalQuestions;
    exam.duration = duration || exam.duration;
    exam.liveDate = liveDate || exam.liveDate;
    exam.deadDate = deadDate || exam.deadDate;
    // Ensure codingQuestion is updated correctly
    exam.codingQuestion = codingQuestion;

    const updatedExam = await exam.save();
    console.log('Exam updated successfully:', updatedExam._id);
    res.status(200).json(updatedExam);
  } else {
    console.log('Exam not found for update with ID:', paramExamId);
    res.status(404);
    throw new Error("Exam not found");
  }
});

const DeleteExamById = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const exam = await Exam.findOneAndDelete({ examId: examId });
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  console.log("deleted exam", exam);
  res.status(200).json(exam);
});

// @desc Get exam results by examId
// @route GET /api/exams/results/:examId
// @access Private (teacher/student)
const getExamResults = asyncHandler(async (req, res) => {
  console.log("getExamResults controller reached.");
  const { examId: paramExamId } = req.params;

  try {
    let exam = null;
    // First, try to find the exam by MongoDB _id if paramExamId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(paramExamId)) {
      exam = await Exam.findById(paramExamId);
    }

    // If not found by _id, or if param was not a valid ObjectId, try to find by UUID examId field
    if (!exam) {
      exam = await Exam.findOne({ examId: paramExamId });
    }

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found for results");
    }

    // Use the found exam's MongoDB _id to query submissions
    const submissions = await Submission.find({ examId: exam._id })
      .populate('studentId', 'name email') // Populate student details
      .sort({ createdAt: -1 }); // Sort by submission date, newest first

    console.log(`Found ${submissions.length} submissions for exam ID: ${exam._id}`);

    if (!submissions || submissions.length === 0) {
      return res.status(200).json([]); // Return empty array if no results found
    }

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500);
    throw new Error('Failed to fetch exam results');
  }
});

// @desc Submit an exam (save student answers and calculate score)
// @route POST /api/exams/submit
// @access Private (student)
const submitExam = asyncHandler(async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const studentId = req.user._id; // Student ID from protected middleware

    // Find the exam by its examId (UUID) to get its MongoDB _id
    const exam = await Exam.findOne({ examId });

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found for submission");
    }

    // Use the found exam's MongoDB _id for the submission
    const examObjectId = exam._id; // This will be a Mongoose ObjectId type

    console.log('Submitting Exam - received data:');
    console.log('Original Exam ID (UUID):', examId);
    console.log('Resolved Exam ObjectId:', examObjectId);
    console.log('Student ID:', studentId);

    // Fetch all questions for this exam using the UUID examId
    const questions = await Question.find({ examId: examId });
    const questionMap = new Map();
    questions.forEach(q => {
      questionMap.set(q._id.toString(), q);
    });

    let score = 0;
    const processedAnswers = answers.map(answer => {
      const question = questionMap.get(answer.questionId); // Ensure questionId is string for map lookup
      let isCorrect = false;

      if (question) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && correctOption._id.toString() === answer.selectedOption) {
          isCorrect = true;
          score += question.ansmarks > 0 ? question.ansmarks : 10; // Add question marks or default 10
        }
      }

      return {
        ...answer,
        isCorrect,
      };
    });
    console.log('Processed Answers:', processedAnswers);

    const submission = new Submission({
      examId: examObjectId,
      studentId,
      score,
      answers: processedAnswers, // Use processed answers
    });

    const savedSubmission = await submission.save();
    console.log('Submission saved successfully:', savedSubmission);
    res.status(201).json(savedSubmission);
  } catch (error) {
    console.error('Full error in submitExam:', error); // More detailed error logging
    res.status(500); // Change to 500 for unhandled errors
    throw new Error(`Failed to submit exam: ${error.message}`);
  }
});

// @desc Get a single student's exam result for a specific exam
// @route GET /api/exams/results/:examId/:studentId
// @access Private (teacher/student)
const getStudentExamResult = asyncHandler(async (req, res) => {
  console.log("***Entering getStudentExamResult controller***");
  console.log("getStudentExamResult controller reached.");
  const { examId: paramExamId, studentId: paramStudentId } = req.params;
  console.log('Received paramExamId:', paramExamId);
  console.log('Received paramStudentId:', paramStudentId);

  try {
    // Validate if paramStudentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(paramStudentId)) {
      res.status(400);
      throw new Error("Invalid Student ID format");
    }

    // Find the exam by its examId (UUID or _id)
    let exam = null;
    if (mongoose.Types.ObjectId.isValid(paramExamId)) {
      exam = await Exam.findById(paramExamId);
    }
    if (!exam) {
      exam = await Exam.findOne({ examId: paramExamId });
    }

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found for results");
    }
    console.log('Found exam for results (MongoDB _id):', exam._id);

    // Find the specific submission for the student and exam
    const submission = await Submission.findOne({ 
      examId: exam._id, // Use the resolved MongoDB ObjectId for examId
      studentId: paramStudentId 
    }).populate('studentId', 'name email'); // Populate student details

    console.log('Submission query parameters:', { examId: exam._id, studentId: paramStudentId });
    console.log('Found submission:', submission ? submission._id : 'No submission found');

    if (!submission) {
      res.status(404);
      throw new Error("Submission not found for this student and exam");
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching student exam result:', error);
    res.status(500);
    throw new Error(`Failed to fetch student exam result: ${error.message}`);
  }
});

// @desc Get the last submitted exam for a specific student
// @route GET /api/exams/last-submission
// @access Private (student)
const getLastStudentSubmission = asyncHandler(async (req, res) => {
  console.log("getLastStudentSubmission controller reached.");
  const studentId = req.user._id; // Student ID from protected middleware

  if (!studentId) {
    res.status(401);
    throw new Error("Not Authorized, student ID missing");
  }

  try {
    const lastSubmission = await Submission.findOne({ studentId })
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .select('examId') // Only retrieve the examId
      .lean(); // Return plain JavaScript objects

    console.log('getLastStudentSubmission - Found last submission:', lastSubmission);

    if (!lastSubmission) {
      return res.status(200).json({ message: "No submissions found for this student." });
    }

    res.status(200).json({ examId: lastSubmission.examId });
  } catch (error) {
    console.error('Error fetching last student submission:', error);
    res.status(500);
    throw new Error(`Failed to fetch last student submission: ${error.message}`);
  }
});

export { getExams, getExamById, createExam, updateExam, DeleteExamById, getExamResults, submitExam, getStudentExamResult, getLastStudentSubmission };
