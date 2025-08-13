import React, { useEffect, useState, useMemo } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  CheckCircle as CheckIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router';

export default function MultipleChoiceQuestion({ questions, saveUserTestScore, submitTest, onAnswerSelected, onQuestionChange, onAnswersUpdate, questionIndex: externalQuestionIndex }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { examId } = useParams();

  // Use all questions sequentially (no random selection)
  const selectedQuestions = useMemo(() => {
    if (!questions || questions.length === 0) return [];
    return [...questions]; // Use all questions in order
  }, [questions]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // Store answers for each question index
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update current question index when external prop changes
  useEffect(() => {
    if (externalQuestionIndex !== undefined && externalQuestionIndex !== null) {
      setCurrentQuestionIndex(externalQuestionIndex);
    }
  }, [externalQuestionIndex]);

  // Get current question
  const currentQuestion = selectedQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === selectedQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  // Get current answer
  const currentAnswer = userAnswers[currentQuestionIndex] || null;

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / selectedQuestions.length) * 100;
  const answeredCount = Object.keys(userAnswers).length;

  // Notify parent about question change
  useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange(currentQuestionIndex);
    }
  }, [currentQuestionIndex, onQuestionChange]);

  // Notify parent about answers update
  useEffect(() => {
    if (onAnswersUpdate) {
      onAnswersUpdate(userAnswers);
    }
  }, [userAnswers, onAnswersUpdate]);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    
    // Update user answers for current question
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedValue
    }));
  };

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitTest = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Process all answers before submitting
      selectedQuestions.forEach((question, index) => {
        const selectedAnswer = userAnswers[index];
        
        if (question && question.options && selectedAnswer) {
          const correctOption = question.options.find((option) => option.isCorrect);
          const isCorrect = correctOption && correctOption.id === selectedAnswer;
          
          if (onAnswerSelected) {
            onAnswerSelected({
              questionId: question._id,
              selectedOption: selectedAnswer,
              isCorrect: isCorrect,
            });
          }

          if (isCorrect) {
            saveUserTestScore();
          }
        }
      });

      // Navigate or submit based on exam type
      if (examId) {
        navigate(`/exam/${examId}/codedetails`);
      } else {
        submitTest();
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!selectedQuestions || selectedQuestions.length === 0 || !currentQuestion) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%',
        flexDirection: 'column'
      }}>
        <QuizIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" color="primary.main">
          Loading questions...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Progress Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            fontSize: isMobile ? '1.1rem' : '1.25rem'
          }}>
            Question {currentQuestionIndex + 1} of {selectedQuestions.length}
          </Typography>
          
          <Chip 
            icon={<CheckIcon />}
            label={`${answeredCount}/${selectedQuestions.length} Answered`}
            color={answeredCount === selectedQuestions.length ? 'success' : 'primary'}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
          />
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)'
            }
          }} 
        />
        
        <Typography variant="caption" sx={{ 
          color: 'text.secondary', 
          mt: 1, 
          display: 'block',
          fontSize: isMobile ? '0.7rem' : '0.75rem'
        }}>
          Progress: {Math.round(progress)}% complete
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Question Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        pr: 1
      }}>
        {/* Question Text */}
        <Paper sx={{ 
          p: isMobile ? 2 : 3, 
          mb: 3, 
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 3
        }}>
          <Typography variant={isMobile ? 'body1' : 'h6'} sx={{ 
            fontWeight: 'bold', 
            lineHeight: 1.5 
          }}>
            {currentQuestion.question}
          </Typography>
        </Paper>

        {/* Answer Options */}
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            aria-label="quiz"
            name="quiz"
            value={currentAnswer || ''}
            onChange={handleOptionChange}
          >
            {currentQuestion.options.map((option, index) => (
              <Paper
                key={option._id}
                sx={{
                  mb: 2,
                  p: isMobile ? 1 : 1.5,
                  border: currentAnswer === option._id ? '2px solid' : '1px solid',
                  borderColor: currentAnswer === option._id ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  backgroundColor: currentAnswer === option._id ? 'primary.light' : 'background.paper',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light'
                  }
                }}
              >
                <FormControlLabel
                  value={option._id}
                  control={<Radio sx={{ 
                    color: currentAnswer === option._id ? 'primary.main' : 'default' 
                  }} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                      <Chip 
                        label={String.fromCharCode(65 + index)} 
                        size="small" 
                        sx={{ 
                          mr: 2, 
                          minWidth: 32,
                          backgroundColor: currentAnswer === option._id ? 'primary.main' : 'grey.300',
                          color: currentAnswer === option._id ? 'white' : 'text.primary'
                        }} 
                      />
                      <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ 
                        color: currentAnswer === option._id ? 'primary.main' : 'text.primary',
                        fontWeight: currentAnswer === option._id ? 'bold' : 'normal'
                      }}>
                        {option.optionText}
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    margin: 0, 
                    width: '100%',
                    '& .MuiFormControlLabel-label': {
                      width: '100%'
                    }
                  }}
                />
              </Paper>
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Navigation Controls */}
      <Box sx={{ 
        mt: 2,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider'
      }}>
        <Stack 
          direction={isMobile ? 'column' : 'row'} 
          spacing={2} 
          justifyContent="space-between" 
          alignItems="center"
        >
          {/* Previous Button */}
          <Button
            startIcon={<PrevIcon />}
            onClick={handlePreviousQuestion}
            disabled={isFirstQuestion}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ minWidth: isMobile ? 'auto' : 120 }}
          >
            Previous
          </Button>

          {/* Question Status Indicator */}
          <Box sx={{ 
            display: 'flex', 
            gap: 0.5, 
            alignItems: 'center',
            order: isMobile ? -1 : 0,
            mb: isMobile ? 1 : 0,
            maxWidth: isMobile ? '100%' : '300px',
            overflowX: 'auto',
            padding: '4px',
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            }
          }}>
            {selectedQuestions.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: isMobile ? 8 : 10,
                  height: isMobile ? 8 : 10,
                  minWidth: isMobile ? 8 : 10,
                  borderRadius: '50%',
                  backgroundColor: index === currentQuestionIndex 
                    ? 'primary.main' 
                    : userAnswers[index] 
                      ? 'success.main' 
                      : 'grey.300',
                  transition: 'all 0.2s ease',
                  border: index === currentQuestionIndex ? '2px solid' : 'none',
                  borderColor: index === currentQuestionIndex ? 'primary.dark' : 'transparent'
                }}
              />
            ))}
          </Box>

          {/* Next/Submit Button */}
          {isLastQuestion ? (
            <Button
              endIcon={<CheckIcon />}
              onClick={handleSubmitTest}
              disabled={isSubmitting}
              variant="contained"
              color="success"
              fullWidth={isMobile}
              sx={{ 
                minWidth: isMobile ? 'auto' : 120,
                fontWeight: 'bold'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          ) : (
            <Button
              endIcon={<NextIcon />}
              onClick={handleNextQuestion}
              variant="contained"
              fullWidth={isMobile}
              sx={{ minWidth: isMobile ? 'auto' : 120 }}
            >
              Next
            </Button>
          )}
        </Stack>

        {/* Mobile Progress Dots */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-start', 
            mt: 2,
            gap: 0.5,
            overflowX: 'auto',
            padding: '4px 0',
            '&::-webkit-scrollbar': {
              height: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 2,
            }
          }}>
            {selectedQuestions.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  minWidth: 6,
                  borderRadius: '50%',
                  backgroundColor: index === currentQuestionIndex 
                    ? 'primary.main' 
                    : userAnswers[index] 
                      ? 'success.main' 
                      : 'grey.300',
                  border: index === currentQuestionIndex ? '1px solid' : 'none',
                  borderColor: index === currentQuestionIndex ? 'primary.dark' : 'transparent'
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
