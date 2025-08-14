import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import WebCam from "../student/Components/WebCam";
import {
  Button,
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Slide,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Fab,
  Avatar,
  Badge,
  Stepper,
  Step,
  StepLabel,
  Container,
  Stack,
  Skeleton,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  Send as SendIcon,
  Code as CodeIcon,
  VideoCall as VideoCallIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Assignment as AssignmentIcon,
  Terminal as TerminalIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Timer as TimerIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Psychology as PsychologyIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  Lightbulb as LightbulbIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
} from "@mui/icons-material";
import { useSaveCheatingLogMutation } from "src/slices/cheatingLogApiSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router";
import { useCheatingLog } from "src/context/CheatingLogContext";

export default function Coder() {
  const [code, setCode] = useState("// Write your code here...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState([]); // Array to store all questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [questionId, setQuestionId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedCodes, setSavedCodes] = useState({}); // Store code for each question
  const [codeStats, setCodeStats] = useState({
    lines: 0,
    characters: 0,
    runs: 0,
    lastRunTime: null,
  });
  const [sessionStats, setSessionStats] = useState({
    startTime: new Date(),
    keystrokes: 0,
    focusTime: 0,
  });
  const [progressValue, setProgressValue] = useState(0);

  const { examId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { cheatingLog, updateCheatingLog } = useCheatingLog();
  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setShowContent(true);
    // Simulate progress for visual effect
    const timer = setInterval(() => {
      setProgressValue((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 20;
      });
    }, 200);

    // Update code statistics
    const updateCodeStats = () => {
      setCodeStats((prev) => ({
        ...prev,
        lines: code.split("\n").length,
        characters: code.length,
      }));
    };

    updateCodeStats();

    return () => clearInterval(timer);
  }, [code]);

  // Enhanced code change handler
  const handleCodeChange = (value) => {
    setCode(value);
    setSessionStats((prev) => ({
      ...prev,
      keystrokes: prev.keystrokes + 1,
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getLanguageIcon = (lang) => {
    switch (lang) {
      case "javascript":
        return "🚀";
      case "python":
        return "🐍";
      case "java":
        return "☕";
      default:
        return "💻";
    }
  };

  const getDifficultyColor = () => {
    if (!question) return "primary";
    return "warning"; // You can add difficulty logic here
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString();
  };

  useEffect(() => {
    if (userInfo) {
      updateCheatingLog((prevLog) => ({
        ...prevLog,
        username: userInfo.name,
        email: userInfo.email,
      }));
    }
  }, [userInfo]);

  // Fetch coding question when component mounts
  useEffect(() => {
    const fetchCodingQuestion = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/coding/question/exam/${examId}`);
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          // Store all questions
          setQuestions(response.data.data);
          
          // Set the first question as current
          const firstQuestion = response.data.data[0];
          setQuestionId(firstQuestion._id || examId);
          setQuestion(firstQuestion);
          
          // Initialize saved codes for all questions
          const initialCodes = {};
          response.data.data.forEach((q, index) => {
            initialCodes[index] = q.description 
              ? `// ${q.description}\n\n// Write your code here...`
              : "// Write your code here...";
          });
          setSavedCodes(initialCodes);
          
          // Set initial code for first question
          setCode(initialCodes[0]);
        } else {
          toast.error(
            "No coding question found for this exam. Please contact your teacher."
          );
        }
      } catch (error) {
        console.error("Error fetching coding question:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load coding question"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchCodingQuestion();
    }
  }, [examId]);

  // Navigation functions for multiple questions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current code before switching
      setSavedCodes(prev => ({
        ...prev,
        [currentQuestionIndex]: code
      }));
      
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestion(questions[nextIndex]);
      setCode(savedCodes[nextIndex] || "// Write your code here...");
      setOutput(""); // Clear output when switching questions
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current code before switching
      setSavedCodes(prev => ({
        ...prev,
        [currentQuestionIndex]: code
      }));
      
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setQuestion(questions[prevIndex]);
      setCode(savedCodes[prevIndex] || "// Write your code here...");
      setOutput(""); // Clear output when switching questions
    }
  };

  // Update saved code when user types
  useEffect(() => {
    setSavedCodes(prev => ({
      ...prev,
      [currentQuestionIndex]: code
    }));
  }, [code, currentQuestionIndex]);

  const runCode = async () => {
    setIsRunning(true);
    setCurrentStep(2); // Test Solution step
    setCodeStats((prev) => ({
      ...prev,
      runs: prev.runs + 1,
      lastRunTime: new Date(),
    }));
    setOutput("⚡ Running code...");

    let apiUrl;
    switch (language) {
      case "python":
        apiUrl = "http://localhost:5001/run-python";
        break;
      case "java":
        apiUrl = "http://localhost:5001/run-java";
        break;
      case "javascript":
        apiUrl = "http://localhost:5001/run-javascript";
        break;
      default:
        setIsRunning(false);
        return;
    }

    try {
      const response = await axios.post(apiUrl, { code });
      console.log("API Response:", response.data);
      setOutput(`✅ Execution completed:\n\n${response.data.output}`);
      toast.success("Code executed successfully!");
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(
        `❌ Error running code:\n\n${
          error.response?.data?.error || error.message
        }`
      );
      toast.error("Failed to run code");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Starting coding submission for examId:", examId);

    if (!examId) {
      toast.error("Exam ID not loaded properly. Please try again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const codeSubmissionData = {
        code,
        language,
        examId,
      };

      console.log("Submitting coding code with data:", codeSubmissionData);

      const response = await axios.post(
        "/api/coding/submit",
        codeSubmissionData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        try {
          const updatedLog = {
            ...cheatingLog,
            username: userInfo.name,
            email: userInfo.email,
            examId: examId,
            noFaceCount: parseInt(cheatingLog.noFaceCount) || 0,
            multipleFaceCount: parseInt(cheatingLog.multipleFaceCount) || 0,
            cellPhoneCount: parseInt(cheatingLog.cellPhoneCount) || 0,
            prohibitedObjectCount:
              parseInt(cheatingLog.prohibitedObjectCount) || 0,
            screenshots: cheatingLog.screenshots || [],
          };

          const logResult = await saveCheatingLogMutation(updatedLog).unwrap();
          toast.success("Test submitted successfully!");
          navigate("/success");
        } catch (cheatingLogError) {
          console.error("Error saving cheating log:", cheatingLogError);
          toast.error("Test submitted but failed to save monitoring logs");
          navigate("/success");
        }
      } else {
        console.error("Submission failed:", response.data);
        toast.error("Failed to submit code");
      }
    } catch (error) {
      console.error("Error during submission:", error.response?.data || error);
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          "Failed to submit test"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Loading Progress */}
      <Fade in={progressValue < 100} timeout={500}>
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Fade>

      {/* Question Navigation Stepper */}
      {questions.length > 1 && (
        <Fade in={showContent} timeout={600}>
          <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
                Coding Questions Progress
              </Typography>
              <Stepper activeStep={currentQuestionIndex} alternativeLabel>
                {questions.map((q, index) => (
                  <Step key={index}>
                    <StepLabel 
                      sx={{
                        cursor: 'pointer',
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: currentQuestionIndex === index ? 'bold' : 'normal'
                        }
                      }}
                      onClick={() => {
                        // Save current code before switching
                        setSavedCodes(prev => ({
                          ...prev,
                          [currentQuestionIndex]: code
                        }));
                        
                        setCurrentQuestionIndex(index);
                        setQuestion(questions[index]);
                        setCode(savedCodes[index] || "// Write your code here...");
                        setOutput("");
                      }}
                    >
                      Question {index + 1}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Fade>
      )}

      {/* Enhanced Header Section */}
      <Slide direction="down" in={showContent} timeout={800}>
        <Box sx={{ mb: 2 }}>
          {/* Progress Stepper */}

          <Grid container spacing={3} alignItems="center">
            {/* Main Header */}
            <Grid item xs={12} lg={isMobile ? 12 : 7}>
              <Card
                sx={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  borderRadius: 4,
                  boxShadow: 6,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Animated Background Elements */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                    animation: "shimmer 3s infinite",
                    "@keyframes shimmer": {
                      "0%": { transform: "translateX(-100%)" },
                      "100%": { transform: "translateX(100%)" },
                    },
                  }}
                />

                <CardContent
                  sx={{
                    textAlign: "center",
                    py: 4,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        width: 60,
                        height: 60,
                        mr: 3,
                        boxShadow: 3,
                      }}
                    >
                      <CodeIcon sx={{ fontSize: 35 }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        Coding Assessment
                      </Typography>
                      <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        Write, test, and submit your solution
                      </Typography>
                    </Box>
                  </Box>

                  {question && (
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="center"
                      flexWrap="wrap"
                    >
                      <Chip
                        icon={<SchoolIcon />}
                        label="Live Coding"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontSize: "1rem",
                          py: 2,
                          px: 3,
                          fontWeight: "bold",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Chip
                        icon={<SecurityIcon />}
                        label="Proctored"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontSize: "1rem",
                          py: 2,
                          px: 3,
                          fontWeight: "bold",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                      <Chip
                        label={`${getLanguageIcon(
                          language
                        )} ${language.toUpperCase()}`}
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.25)",
                          color: "white",
                          fontSize: "1rem",
                          py: 2,
                          px: 3,
                          fontWeight: "bold",
                          backdropFilter: "blur(10px)",
                        }}
                      />
                    </Stack>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Stats Card */}
            <Grid item xs={12} lg={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  background:
                    "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                  color: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <TrendingUpIcon sx={{ mr: 1, fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      Session Stats
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Lines:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {codeStats.lines}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Characters:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {codeStats.characters}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Runs:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {codeStats.runs}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2">Keystrokes:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {sessionStats.keystrokes}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Small Webcam Monitor - Top Middle */}
            {!isMobile && (
              <Grid item xs={12} lg={2}>
                <Box
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    width: "100%",
                    maxWidth: 200,
                    height: 150,
                    overflow: "hidden",
                    margin: "0 auto",
                  }}
                >
                  <WebCam
                    cheatingLog={cheatingLog}
                    updateCheatingLog={updateCheatingLog}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 1,
                    fontSize: "0.65rem",
                    opacity: 0.8,
                  }}
                >
                  🔒 Secured
                </Typography>
              </Grid>
            )}

             {/* <Grid item xs={12} md={2} lg={2}>
                          <Card
                            sx={{
                              borderRadius: 4,
                              boxShadow: 4,
                              background:
                                "linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)",
                              color: "white",
                              height: "fit-content",
                              position: "sticky",
                              top: 20,
                            }}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Box
                                sx={{
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 3,
                                  p: 1,
                                  backdropFilter: "blur(10px)",
                                  minHeight: "100px", // Fixed height
                                }}
                              >
                                <NumberOfQuestions
                                  questionLength={questions.length}
                                  submitTest={
                                    isMcqCompleted
                                      ? handleTestSubmission
                                      : handleMcqCompletion
                                  }
                                  examDurationInSeconds={examDurationInSeconds}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid> */}
          </Grid>
        </Box>
      </Slide>

      {isLoading ? (
        <Zoom in={true} timeout={1000}>
          <Card sx={{ textAlign: "center", p: 4, borderRadius: 3 }}>
            <CodeIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Loading Question...
            </Typography>
            <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
          </Card>
        </Zoom>
      ) : !question ? (
        <Fade in={true} timeout={1000}>
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            <Typography variant="h6">
              No coding question found for this exam.
            </Typography>
            <Typography>Please contact your teacher for assistance.</Typography>
          </Alert>
        </Fade>
      ) : (
        <Fade in={showContent} timeout={1200}>
          <Box>
            {/* Main Content Area */}
            <Grid container spacing={3}>
              {/* Left Side - Enhanced Problem Statement */}
              <Grid item xs={12} lg={isMobile ? 12 : 3}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: 6,
                    height: "fit-content",
                    position: "sticky",
                    top: 20,
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255,255,255,0.2)",
                          mr: 2,
                          width: 50,
                          height: 50,
                          boxShadow: 3,
                        }}
                      >
                        <AssignmentIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                          Problem
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Challenge
                        </Typography>
                      </Box>
                    </Box>

                    <Card
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.95)",
                        color: "text.primary",
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: "primary.main",
                          }}
                        >
                          {question.question}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: "bold",
                              mb: 1,
                              color: "text.primary",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <LightbulbIcon
                              sx={{ mr: 1, color: "warning.main" }}
                            />
                            Description:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              lineHeight: 1.7,
                              color: "text.secondary",
                              backgroundColor: "grey.50",
                              p: 2,
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "grey.200",
                            }}
                          >
                            {question.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Question Navigation */}
                    {questions.length > 1 && (
                      <Card
                        sx={{
                          mb: 3,
                          borderRadius: 3,
                          bgcolor: "rgba(255,255,255,0.1)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                              Question {currentQuestionIndex + 1} of {questions.length}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<NavigateBeforeIcon />}
                                onClick={goToPreviousQuestion}
                                disabled={currentQuestionIndex === 0}
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                  },
                                  '&:disabled': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.5)',
                                  },
                                }}
                              >
                                Previous
                              </Button>
                              
                              <Button
                                variant="contained"
                                size="small"
                                endIcon={<NavigateNextIcon />}
                                onClick={goToNextQuestion}
                                disabled={currentQuestionIndex === questions.length - 1}
                                sx={{
                                  bgcolor: 'rgba(255,255,255,0.2)',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                  },
                                  '&:disabled': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.5)',
                                  },
                                }}
                              >
                                Next
                              </Button>
                            </Box>
                          </Box>
                          
                          {/* Question Progress Indicator */}
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(currentQuestionIndex + 1) / questions.length * 100}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: 'white',
                                  borderRadius: 3,
                                },
                              }}
                            />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5, display: 'block' }}>
                              Progress: {Math.round((currentQuestionIndex + 1) / questions.length * 100)}%
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    )}

                    {/* Enhanced Problem Info */}
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "rgba(255,255,255,0.2)",
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <StarIcon sx={{ color: "yellow", mr: 1 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ display: "block", fontWeight: "bold" }}
                          >
                            Difficulty
                          </Typography>
                          <Chip
                            label="Medium"
                            size="small"
                            sx={{
                              backgroundColor: "rgba(255,255,255,0.9)",
                              color: "warning.main",
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                      </Box>

                      <Alert
                        severity="info"
                        sx={{
                          backgroundColor: "rgba(255,255,255,0.2)",
                          color: "white",
                          "& .MuiAlert-icon": { color: "white" },
                          border: "none",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: "bold" }}
                        >
                          💡 Pro Tip: Test your code frequently and consider
                          edge cases
                        </Typography>
                      </Alert>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right Side - Code Editor and Output */}
              <Grid item xs={12} lg={isMobile ? 12 : 9}>
                <Grid container spacing={2}>
                  {/* Code Editor Section */}
                  <Grid item xs={12} md={isMobile ? 12 : 8}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 3,
                        height: isMobile ? "auto" : "650px",
                      }}
                    >
                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          p: 3,
                        }}
                      >
                        {/* Editor Header */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                            flexWrap: "wrap",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <CodeIcon sx={{ color: "primary.main" }} />
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
                              Code Editor
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <FormControl sx={{ minWidth: 140 }}>
                              <InputLabel>Language</InputLabel>
                              <Select
                                value={language}
                                label="Language"
                                onChange={(e) => setLanguage(e.target.value)}
                                sx={{ borderRadius: 2 }}
                              >
                                <MenuItem value="javascript">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    🚀 JavaScript
                                  </Box>
                                </MenuItem>
                                <MenuItem value="python">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    🐍 Python
                                  </Box>
                                </MenuItem>
                                <MenuItem value="java">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1,
                                    }}
                                  >
                                    ☕ Java
                                  </Box>
                                </MenuItem>
                              </Select>
                            </FormControl>

                            <Tooltip
                              title={
                                isFullscreen ? "Exit Fullscreen" : "Fullscreen"
                              }
                            >
                              <IconButton
                                onClick={toggleFullscreen}
                                sx={{
                                  backgroundColor: "primary.main",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "primary.dark",
                                  },
                                }}
                              >
                                {isFullscreen ? (
                                  <FullscreenExitIcon />
                                ) : (
                                  <FullscreenIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Code Editor */}
                        <Box
                          sx={{
                            flex: 1,
                            minHeight: isMobile ? "400px" : "500px",
                            border: "2px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            overflow: "hidden",
                            ...(isFullscreen && {
                              position: "fixed",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              zIndex: 9999,
                              minHeight: "100vh",
                            }),
                          }}
                        >
                          <Editor
                            height="100%"
                            language={language}
                            value={code}
                            onChange={handleCodeChange}
                            theme="vs-dark"
                            options={{
                              minimap: { enabled: !isMobile },
                              fontSize: isMobile ? 12 : 14,
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                              wordWrap: "on",
                              lineNumbers: "on",
                              folding: true,
                              bracketMatching: "always",
                              suggestOnTriggerCharacters: true,
                              parameterHints: { enabled: true },
                              autoIndent: "full",
                              formatOnPaste: true,
                              formatOnType: true,
                            }}
                          />
                        </Box>

                        {/* Action Buttons */}
                        <Box
                          sx={{
                            mt: 3,
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={runCode}
                            disabled={isRunning}
                            startIcon={
                              isRunning ? (
                                <LinearProgress size={20} />
                              ) : (
                                <PlayArrowIcon />
                              )
                            }
                            sx={{
                              minWidth: 140,
                              py: 1.5,
                              borderRadius: 3,
                              background:
                                "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            {isRunning ? "Running..." : "Run Code"}
                          </Button>

                          <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            startIcon={
                              isSubmitting ? (
                                <LinearProgress size={20} />
                              ) : (
                                <SendIcon />
                              )
                            }
                            sx={{
                              minWidth: 140,
                              py: 1.5,
                              borderRadius: 3,
                              background:
                                "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            {isSubmitting ? "Submitting..." : "Submit Test"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Enhanced Output Console */}
                  <Grid item xs={12} md={isMobile ? 12 : 4}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: 6,
                        height: "650px",
                        background:
                          "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
                        color: "white",
                      }}
                    >
                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          p: 3,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "success.main",
                              mr: 2,
                              width: 35,
                              height: 35,
                            }}
                          >
                            <TerminalIcon sx={{ fontSize: 20 }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                color: "success.light",
                              }}
                            >
                              Output Console
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "grey.300" }}
                            >
                              {codeStats.lastRunTime
                                ? `Last run: ${formatTime(
                                    codeStats.lastRunTime
                                  )}`
                                : "Ready to execute"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            backgroundColor: "#1a1a1a",
                            color: "#00ff00",
                            p: 3,
                            borderRadius: 3,
                            flex: 1,
                            overflow: "auto",
                            fontFamily: '"Fira Code", "Consolas", monospace',
                            fontSize: "13px",
                            lineHeight: 1.5,
                            border: "2px solid #333",
                            position: "relative",
                            "&::-webkit-scrollbar": {
                              width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#2a2a2a",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "#555",
                              borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "#777",
                            },
                          }}
                        >
                          {/* Terminal Header */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                              pb: 1,
                              borderBottom: "1px solid #333",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mr: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: "#ff5f56",
                                }}
                              />
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: "#ffbd2e",
                                }}
                              />
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  bgcolor: "#27ca3f",
                                }}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#888",
                                fontFamily: "monospace",
                              }}
                            >
                              {language}@examapp:~$
                            </Typography>
                          </Box>

                          <pre
                            style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                            }}
                          >
                            {output ||
                              `Welcome to ${language.toUpperCase()} Console!\n\n> Ready to execute your code...\n> Use the "Run Code" button to test your solution.\n> Output will appear here in real-time.`}
                          </pre>

                          {isRunning && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 20,
                                right: 20,
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "rgba(0,0,0,0.8)",
                                borderRadius: 2,
                                p: 1,
                              }}
                            >
                              <LinearProgress
                                sx={{
                                  width: 80,
                                  mr: 1,
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: "#00ff00",
                                  },
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: "#00ff00" }}
                              >
                                Running...
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}

      {/* Floating Action Button for Scroll to Top */}
      <Fade in={true}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1000,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Fade>
    </Box>
  );
}
