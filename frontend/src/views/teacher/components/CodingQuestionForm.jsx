import React from 'react';
import { TextField, Box, Typography, Button, IconButton, Card, CardContent, Grid } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Timer as TimerIcon } from '@mui/icons-material';

const CodingQuestionForm = ({ formik }) => {
  // Debug log to see what we're getting
  console.log('CodingQuestionForm - formik.values:', formik.values);
  console.log('CodingQuestionForm - codingQuestions:', formik.values.codingQuestions);

  // Ensure we have at least an empty array with one question
  const codingQuestions = formik.values.codingQuestions && formik.values.codingQuestions.length > 0 
    ? formik.values.codingQuestions 
    : [{ question: '', description: '', duration: 30 }]; // Added default duration of 30 minutes

  // Update formik if we had to create a default question
  React.useEffect(() => {
    if (!formik.values.codingQuestions || formik.values.codingQuestions.length === 0) {
      console.log('Initializing with one empty question');
      formik.setFieldValue('codingQuestions', [{ question: '', description: '', duration: 30 }]);
    }
  }, [formik.values.codingQuestions]);

  const addQuestion = () => {
    const newQuestion = { question: '', description: '', duration: 30 }; // Added default duration
    const currentQuestions = formik.values.codingQuestions || [];
    const updatedQuestions = [...currentQuestions, newQuestion];
    formik.setFieldValue('codingQuestions', updatedQuestions);
  };

  const removeQuestion = (index) => {
    const currentQuestions = formik.values.codingQuestions || [];
    const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
    // Don't allow removing the last question
    if (updatedQuestions.length === 0) {
      updatedQuestions.push({ question: '', description: '', duration: 30 });
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

            {/* Duration Field */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#159fc1', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                Question Duration
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8} sm={6}>
                  <TextField
                    fullWidth
                    id={`codingQuestions.${index}.duration`}
                    name={`codingQuestions.${index}.duration`}
                    label="Duration (minutes)"
                    type="number"
                    value={question.duration || 30}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.codingQuestions?.[index]?.duration &&
                      Boolean(formik.errors.codingQuestions?.[index]?.duration)
                    }
                    helperText={
                      formik.touched.codingQuestions?.[index]?.duration && 
                      formik.errors.codingQuestions?.[index]?.duration
                    }
                    inputProps={{ 
                      min: 1, 
                      max: 180,
                      step: 1 
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#41bcba',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#41bcba',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    {question.duration && question.duration > 60 
                      ? `${Math.floor(question.duration / 60)}h ${question.duration % 60}m`
                      : `${question.duration || 30} minutes`
                    }
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', display: 'block' }}>
                    Recommended: 15-60 minutes
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default CodingQuestionForm;
