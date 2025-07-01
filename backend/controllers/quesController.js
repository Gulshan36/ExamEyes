import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";

const getQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("Question Exam id ", examId);

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
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
