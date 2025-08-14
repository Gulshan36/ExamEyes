import React from 'react';
import { TextField, Box, Typography, Button, IconButton, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CodingQuestionForm = ({ formik }) => {
  // Debug log to see what we're getting
  console.log('CodingQuestionForm - formik.values:', formik.values);
  console.log('CodingQuestionForm - codingQuestions:', formik.values.codingQuestions);

  // Ensure we have at least an empty array with one question
  const codingQuestions = formik.values.codingQuestions && formik.values.codingQuestions.length > 0 
    ? formik.values.codingQuestions 
    : [{ question: '', description: '' }];

  // Update formik if we had to create a default question
  React.useEffect(() => {
    if (!formik.values.codingQuestions || formik.values.codingQuestions.length === 0) {
      console.log('Initializing with one empty question');
      formik.setFieldValue('codingQuestions', [{ question: '', description: '' }]);
    }
  }, [formik.values.codingQuestions]);

  const addQuestion = () => {
    const newQuestion = { question: '', description: '' };
    const currentQuestions = formik.values.codingQuestions || [];
    const updatedQuestions = [...currentQuestions, newQuestion];
    formik.setFieldValue('codingQuestions', updatedQuestions);
  };

  const removeQuestion = (index) => {
    const currentQuestions = formik.values.codingQuestions || [];
    const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
    // Don't allow removing the last question
    if (updatedQuestions.length === 0) {
      updatedQuestions.push({ question: '', description: '' });
    }
    formik.setFieldValue('codingQuestions', updatedQuestions);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Coding Questions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addQuestion}
          sx={{
            background: 'linear-gradient(45deg, #41bcba 30%, #ed93c7 90%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(45deg, #359a99 30%, #d182b5 90%)',
            },
          }}
        >
          Add Question
        </Button>
      </Box>

      {codingQuestions.map((question, index) => (
        <Card key={index} sx={{ mb: 3, border: '2px solid #41bcba', borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#159fc1' }}>
                Question {index + 1}
              </Typography>
              {codingQuestions.length > 1 && (
                <IconButton
                  onClick={() => removeQuestion(index)}
                  sx={{ color: '#e74c3c' }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <TextField
              fullWidth
              id={`codingQuestions.${index}.question`}
              name={`codingQuestions.${index}.question`}
              label="Question"
              multiline
              rows={3}
              value={question.question}
              onChange={formik.handleChange}
              error={
                formik.touched.codingQuestions?.[index]?.question && 
                Boolean(formik.errors.codingQuestions?.[index]?.question)
              }
              helperText={
                formik.touched.codingQuestions?.[index]?.question && 
                formik.errors.codingQuestions?.[index]?.question
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              id={`codingQuestions.${index}.description`}
              name={`codingQuestions.${index}.description`}
              label="Description/Instructions"
              multiline
              rows={4}
              value={question.description}
              onChange={formik.handleChange}
              error={
                formik.touched.codingQuestions?.[index]?.description &&
                Boolean(formik.errors.codingQuestions?.[index]?.description)
              }
              helperText={
                formik.touched.codingQuestions?.[index]?.description && 
                formik.errors.codingQuestions?.[index]?.description
              }
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CodingQuestionForm;
