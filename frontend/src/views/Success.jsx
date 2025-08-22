import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Fade,
  Grow,
  Zoom,
  LinearProgress,
  Avatar,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Home as HomeIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showContent, setShowContent] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Show content with animation
    setShowContent(true);
    
    // Start countdown and progress animation
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to avoid calling navigate during render
          setTimeout(() => navigate('/'), 0);
          return 0;
        }
        return prev - 1;
      });
      
      setProgressValue((prev) => {
        const newValue = prev + 10;
        return newValue > 100 ? 100 : newValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleStayOnPage = () => {
    setCountdown(0);
    setProgressValue(100);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #7e7d7dff 0%, #8e8d8fff 50%, #696869ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"%23ffffff\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
          opacity: 0.3,
        }
      }}
    >
      {/* Floating Elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          animation: "float 6s ease-in-out infinite",
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-20px)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "20%",
          right: "10%",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
          animation: "float 10s ease-in-out infinite",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in={showContent} timeout={800}>
          <Box>
            {/* Success Icon Animation */}
            <Zoom in={showContent} timeout={1200}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "rgba(76, 175, 80, 0.2)",
                    border: "4px solid #4caf50",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)" },
                      "70%": { transform: "scale(1.05)", boxShadow: "0 0 0 10px rgba(76, 175, 80, 0)" },
                      "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)" },
                    },
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50" }} />
                </Avatar>
              </Box>
            </Zoom>

            {/* Main Content Card */}
            <Grow in={showContent} timeout={1000}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 4,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  overflow: "visible",
                }}
              >
                <CardContent sx={{ p: 5, textAlign: "center" }}>
                  {/* Success Message */}
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #4caf50, #2e7d32)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 2
                    }}
                  >
                    🎉 Congratulations!
                  </Typography>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: "text.primary",
                      fontWeight: "medium",
                      mb: 1
                    }}
                  >
                    Test Submitted Successfully!
                  </Typography>

                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: "text.secondary",
                      mb: 4,
                      maxWidth: 600,
                      mx: "auto"
                    }}
                  >
                    Your exam has been securely submitted and recorded. Great job on completing the assessment!
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  {/* Stats Section */}
                  <Stack 
                    direction={{ xs: "column", md: "row" }} 
                    spacing={3} 
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 4 }}
                  >
                    <Chip
                      icon={<AssignmentIcon />}
                      label="Exam Completed"
                      color="success"
                      sx={{
                        fontSize: "1rem",
                        py: 2.5,
                        px: 2,
                        fontWeight: "bold",
                        "& .MuiChip-icon": { fontSize: 24 }
                      }}
                    />
                    <Chip
                      icon={<TrophyIcon />}
                      label="Well Done!"
                      color="warning"
                      sx={{
                        fontSize: "1rem",
                        py: 2.5,
                        px: 2,
                        fontWeight: "bold",
                        "& .MuiChip-icon": { fontSize: 24 }
                      }}
                    />
                    <Chip
                      icon={<SchoolIcon />}
                      label="Results Soon"
                      color="info"
                      sx={{
                        fontSize: "1rem",
                        py: 2.5,
                        px: 2,
                        fontWeight: "bold",
                        "& .MuiChip-icon": { fontSize: 24 }
                      }}
                    />
                  </Stack>

                  {/* What's Next Section */}
                  <Card 
                    sx={{ 
                      background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                      border: "1px solid rgba(25, 118, 210, 0.2)",
                      mb: 4
                    }}
                  >
                    <CardContent sx={{ py: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}>
                        📋 What Happens Next?
                      </Typography>
                      <Stack spacing={1.5} sx={{ textAlign: "left" }}>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
                          Your responses have been automatically saved and submitted
                        </Typography>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "info.main" }} />
                          Results will be processed and made available soon
                        </Typography>
                        <Typography variant="body1" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "warning.main" }} />
                          You'll receive notification when results are ready
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Auto-redirect Timer */}
                  {countdown > 0 && (
                    <Card 
                      sx={{ 
                        background: "linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)",
                        border: "1px solid rgba(255, 152, 0, 0.2)",
                        mb: 3
                      }}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 2 }}>
                          <TimerIcon sx={{ color: "warning.main" }} />
                          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                            Redirecting to home in {countdown} seconds
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={progressValue} 
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "rgba(255, 152, 0, 0.2)",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 4,
                              background: "linear-gradient(90deg, #ff9800, #f57c00)",
                            },
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <Stack 
                    direction={{ xs: "column", sm: "row" }} 
                    spacing={2} 
                    justifyContent="center"
                    sx={{ mt: 3 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/"
                      startIcon={<HomeIcon />}
                      onClick={handleStayOnPage}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 3,
                        fontWeight: "bold",
                        background: "linear-gradient(45deg, #2196f3, #1976d2)",
                        "&:hover": {
                          background: "linear-gradient(45deg, #1976d2, #1565c0)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 16px rgba(33, 150, 243, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </Stack>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "text.secondary",
                      mt: 3,
                      fontStyle: "italic"
                    }}
                  >
                    💡 You can safely close this window or navigate away from this page.
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default Success;
