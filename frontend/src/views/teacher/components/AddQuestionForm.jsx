import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import swal from 'sweetalert';
import { useCreateQuestionMutation, useGetExamsQuery, useGetQuestionsQuery, useUpdateQuestionMutation } from 'src/slices/examApiSlice';
import { toast } from 'react-toastify';

const AddQuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [correctOptions, setCorrectOptions] = useState([false, false, false, false]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const handleOptionChange = (index) => {
    const updatedCorrectOptions = [...correctOptions];
    updatedCorrectOptions[index] = !correctOptions[index];
    setCorrectOptions(updatedCorrectOptions);
  };

  const [createQuestion, { isLoading: isCreating }] = useCreateQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();
  const { data: examsData } = useGetExamsQuery();
  const { data: examQuestionsData, refetch: refetchExamQuestions } = useGetQuestionsQuery(selectedExamId, { skip: !selectedExamId });

  useEffect(() => {
    if (examsData && examsData.length > 0) {
      setSelectedExamId(examsData[0].examId);
      console.log(examsData[0].examId, 'examsData[0].examId');
    }
  }, [examsData]);

  useEffect(() => {
    if (selectedExamId) {
      refetchExamQuestions();
    }
  }, [selectedExamId, refetchExamQuestions]);

  useEffect(() => {
    if (examQuestionsData) {
      setQuestions(examQuestionsData);
    }
  }, [examQuestionsData]);

  const handleAddOrUpdateQuestion = async () => {
    if (newQuestion.trim() === '' || newOptions.some((option) => option.trim() === '')) {
      swal('', 'Please fill out the question and all options.', 'error');
      return;
    }

    const questionData = {
      question: newQuestion,
      options: newOptions.map((option, index) => ({
        optionText: option,
        isCorrect: correctOptions[index],
      })),
      examId: selectedExamId,
    };

    try {
      if (editingQuestionId) {
        const res = await updateQuestion({ questionId: editingQuestionId, ...questionData }).unwrap();
        if (res) {
          toast.success('Question updated successfully!!!');
        }
      } else {
        const res = await createQuestion(questionData).unwrap();
        if (res) {
          toast.success('Question added successfully!!!');
        }
      }
      refetchExamQuestions();
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setCorrectOptions([false, false, false, false]);
      setEditingQuestionId(null);
    } catch (err) {
      swal('', 'Failed to save question. Please try again.', 'error');
    }
  };

  const handleEditQuestion = (questionObj) => {
    setEditingQuestionId(questionObj._id);
    setNewQuestion(questionObj.question);
    setNewOptions(questionObj.options.map((opt) => opt.optionText));
    setCorrectOptions(questionObj.options.map((opt) => opt.isCorrect));
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectOptions([false, false, false, false]);
  };

  const handleSubmitQuestions = () => {
    setQuestions([]);
    setNewQuestion('');
    setNewOptions(['', '', '', '']);
    setCorrectOptions([false, false, false, false]);
    setEditingQuestionId(null);
    toast.success('Questions submitted (form reset) successfully!');
  };

  return (
    <div>
      <Select
        label="Select Exam"
        value={selectedExamId}
        onChange={(e) => {
          console.log(e.target.value, 'option ID');
          setSelectedExamId(e.target.value);
          setEditingQuestionId(null);
          setNewQuestion('');
          setNewOptions(['', '', '', '']);
          setCorrectOptions([false, false, false, false]);
        }}
        fullWidth
        sx={{ mb: 2 }}
      >
        {examsData &&
          examsData.map((exam) => (
            <MenuItem key={exam.examId} value={exam.examId}>
              {exam.examName}
            </MenuItem>
          ))}
      </Select>

      <Typography variant="h6" mb={2}>Existing Questions:</Typography>
      {questions.length === 0 ? (
        <Typography mb={2}>No questions for this exam yet.</Typography>
      ) : (
        questions.map((questionObj) => (
          <Box key={questionObj._id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1">{questionObj.question}</Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleEditQuestion(questionObj)}
                disabled={editingQuestionId !== null}
              >
                Edit
              </Button>
            </Stack>
            {questionObj.options.map((option, optionIndex) => (
              <FormControlLabel
                key={option._id}
                control={<Checkbox checked={option.isCorrect} disabled />}
                label={option.optionText}
              />
            ))}
          </Box>
        ))
      )}

      <Typography variant="h6" mt={4} mb={2}>
        {editingQuestionId ? 'Edit Question' : 'Add New Question'}
      </Typography>
      <TextField
        label="Question"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 1 }}
      />

      {newOptions.map((option, index) => (
        <Stack
          key={index}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          mb={1}
        >
          <TextField
            label={`Option ${index + 1}`}
            value={newOptions[index]}
            onChange={(e) => {
              const updatedOptions = [...newOptions];
              updatedOptions[index] = e.target.value;
              setNewOptions(updatedOptions);
            }}
            fullWidth
            sx={{ flex: '80%' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={correctOptions[index]}
                onChange={() => handleOptionChange(index)}
              />
            }
            label={`Correct Option ${index + 1}`}
          />
        </Stack>
      ))}

      <Stack mt={2} direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleAddOrUpdateQuestion}
          disabled={isCreating || isUpdating}
        >
          {editingQuestionId ? 'Update Question' : 'Add Question'}
        </Button>
        {editingQuestionId && (
          <Button variant="outlined" onClick={handleCancelEdit}>
            Cancel Edit
          </Button>
        )}
        <Button variant="contained" onClick={handleSubmitQuestions}>
          Submit Questions
        </Button>
      </Stack>
    </div>
  );
};

export default AddQuestionForm;
