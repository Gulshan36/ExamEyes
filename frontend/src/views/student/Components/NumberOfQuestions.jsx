import React, { useState, useEffect } from 'react';
import {
  Grid,
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Alert,
  Fade,
  Zoom
} from '@mui/material';
import {
  Timer as TimerIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Flag as FlagIcon,
  Speed as SpeedIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import BlankCard from 'src/components/shared/BlankCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const NumberOfQuestions = ({ questionLength, submitTest, examDurationInSeconds }) => {
  const totalQuestions = questionLength;
  const questionNumbers = Array.from({ length: totalQuestions }, (_, index) => index + 1);

  const [timeLeft, setTimeLeft] = useState(examDurationInSeconds * 60); // Convert minutes to seconds
  const [showWarning, setShowWarning] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); // Track answered questions
  const navigate = useNavigate();

  // Create an array of rows, each containing up to 6 question numbers for better layout
  const rows = [];
  for (let i = 0; i < questionNumbers.length; i += 6) {
    rows.push(questionNumbers.slice(i, i + 6));
  }

  const handleQuestionButtonClick = (questionNumber) => {
    // Set the current question to the selected question number
    // setCurrentQuestion(questionNumber);
  };

  useEffect(() => {
    // Reset timer when exam duration changes
    setTimeLeft(examDurationInSeconds * 60);
  }, [examDurationInSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        
        // Show warning when 5 minutes left
        if (prevTime <= 300 && !showWarning) {
          setShowWarning(true);
          toast.warning('⚠️ Only 5 minutes remaining!', {
            position: "top-center",
            autoClose: 5000,
          });
        }
        
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  const handleTimeUp = () => {
    toast.warning('Time is up! Submitting your test...');
    submitTest();
  };

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate time progress percentage
  const totalTimeInSeconds = examDurationInSeconds * 60;
  const timeProgress = ((totalTimeInSeconds - timeLeft) / totalTimeInSeconds) * 100;
  const isTimeRunningOut = timeLeft <= 300; // 5 minutes
  const isCriticalTime = timeLeft <= 60; // 1 minute

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (isCriticalTime) return 'error';
    if (isTimeRunningOut) return 'warning';
    return 'primary';
  };

  return (
    <Box sx={{ 
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Compact Timer Display */}
      <Box sx={{
        textAlign: 'center',
        mb: 0,
        p: 0,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
          <TimerIcon sx={{ 
            fontSize: 24,
            color: isCriticalTime ? '#ff5722' : 'white',
            animation: isCriticalTime ? 'timerBlink 1s infinite' : 'none',
            '@keyframes timerBlink': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 }
            },
            mb: 1
          }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: isCriticalTime ? '#ff5722' : 'white',
            fontSize: '1.1rem'
          }}>
            {formatTime(timeLeft)}
          </Typography>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={timeProgress}
          sx={{ 
            height: 6, 
            borderRadius: 3,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: isCriticalTime ? '#ff5722' : isTimeRunningOut ? '#ff9800' : '#4caf50',
              borderRadius: 3
            }
          }} 
        />
        <Typography variant="caption" sx={{ 
          opacity: 0.8, 
          mt: 0.5, 
          display: 'block',
          fontSize: '0.7rem'
        }}>
          {Math.round(timeProgress)}% used
        </Typography>
      </Box>

      {/* Warning Alert - Compact */}
      {showWarning && (
        <Alert 
          severity={isCriticalTime ? "error" : "warning"} 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            fontSize: '0.7rem',
            p: 1
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
            {isCriticalTime ? "< 1 min!" : "⏰ 5 min left!"}
          </Typography>
        </Alert>
      )}

      {/* Question Progress */}
      <Box sx={{ mb: 0 }}>
        <Typography variant="caption" sx={{ 
          color: 'rgba(255,255,255,0.9)', 
          display: 'block',
          textAlign: 'center',
          fontSize: '0.8rem'
        }}>
          Question 1 of {totalQuestions}
        </Typography>
      </Box>

      {/* Compact Finish Button */}
      <Button 
        variant="contained" 
        onClick={submitTest} 
        color="error"
        size="large"
        startIcon={<FlagIcon />}
        fullWidth
        sx={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          py: 1,
          fontWeight: 'bold',
          fontSize: '0.75rem',
          '&:hover': {
            background: 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)'
          }
        }}
      >
        Finish Test
      </Button>
    </Box>
  );
};

export default NumberOfQuestions;
