import React, { useEffect, useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from 'react-router';

export default function MultipleChoiceQuestion({ questions, saveUserTestScore, submitTest, onAnswerSelected }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const { examId } = useParams();

  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [isFinishTest, setisFinishTest] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setIsLastQuestion(currentQuestion === questions.length - 1);
    }
  }, [currentQuestion, questions]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextQuestion = () => {
    const currentQuestionData = questions[currentQuestion];
    let isCorrect = false;

    if (currentQuestionData && currentQuestionData.options) {
      const correctOption = currentQuestionData.options.find((option) => option.isCorrect);
      if (correctOption && selectedOption) {
        isCorrect = correctOption.id === selectedOption;
      }
    }

    if (onAnswerSelected) {
      onAnswerSelected({
        questionId: currentQuestionData._id,
        selectedOption: selectedOption,
        isCorrect: isCorrect,
      });
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
      saveUserTestScore();
    }

    if (isLastQuestion) {
      navigate(`/exam/${examId}/codedetails`);
    }

    setSelectedOption(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setisFinishTest(true);
      submitTest();
    }
  };

  // ⛔ Guard: Wait until questions are available and current question exists
  if (!questions || questions.length === 0 || !questions[currentQuestion]) {
    return <Typography variant="h6">Loading question...</Typography>;
  }

  const current = questions[currentQuestion];

  return (
    <Card style={{ width: '50%', boxShadow: '2px' }}>
      <CardContent style={{ padding: '16px' }}>
        <Typography variant="h4" mb={3}>
          Question {currentQuestion + 1}:
        </Typography>

        <Typography variant="body1" mb={3}>
          {current.question}
        </Typography>

        <Box mb={10}>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="quiz"
              name="quiz"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {current.options.map((option) => (
                <FormControlLabel
                  key={option._id}
                  value={option._id}
                  control={<Radio />}
                  label={option.optionText}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            style={{ marginLeft: 'auto' }}
          >
            {isLastQuestion ? 'Proceed to Coding' : 'Next Question'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
