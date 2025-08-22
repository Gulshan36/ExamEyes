import asyncHandler from "express-async-handler";
import CheatingLog from "../models/cheatingLogModel.js";
import Exam from "../models/examModel.js";
import mongoose from 'mongoose';

// @desc Save cheating log data
// @route POST /api/cheatingLogs
// @access Private
const saveCheatingLog = asyncHandler(async (req, res) => {
  console.log("saveCheatingLog controller reached.");
  const {
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    examId,
    username,
    email,
    screenshots,
    reason,
  } = req.body;

  console.log("Received cheating log data:", {
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    examId,
    username,
    email,
    screenshots,
    reason,
  });

  const cheatingLog = new CheatingLog({
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    examId,
    username,
    email,
    screenshots: screenshots || [],
    reason,
  });

  const savedLog = await cheatingLog.save();
  console.log("Saved cheating log:", savedLog);

  if (savedLog) {
    res.status(201).json(savedLog);
  } else {
    res.status(400);
    throw new Error("Invalid Cheating Log Data");
  }
});

// @desc Get all cheating log data for a specific exam
// @route GET /api/cheatingLogs/:examId
// @access Private
const getCheatingLogsByExamId = asyncHandler(async (req, res) => {
  const paramExamId = req.params.examId;

  // Allow both Mongo _id and UUID as exam identifier
  let resolvedExamId = paramExamId;
  if (mongoose.Types.ObjectId.isValid(paramExamId)) {
    const exam = await Exam.findById(paramExamId);
    if (exam && exam.examId) {
      resolvedExamId = exam.examId; // UUID stored in cheating logs
    }
  }

  const cheatingLogs = await CheatingLog.find({ examId: resolvedExamId });
  res.status(200).json(cheatingLogs);
});

export { saveCheatingLog, getCheatingLogsByExamId };
