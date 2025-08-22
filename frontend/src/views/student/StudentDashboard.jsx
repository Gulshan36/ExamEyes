import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // if you store student info in redux
import { useGetExamsQuery } from "src/slices/examApiSlice";
// import { useGetResultsQuery } from "src/slices/resultApiSlice";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth); // assuming you have auth slice

  // Fetch exams + results (optional, depending on your APIs)
  const { data: exams = [] } = useGetExamsQuery();
  const { data: results = [] } = useGetResultsQuery();

  const upcomingExams = exams.slice(0, 3);
  const recentResults = results.slice(0, 3);

  return (
    <Box p={3}>
      {/* Welcome Section */}
      <Typography variant="h4" gutterBottom>
        Welcome, {userInfo?.name || "Student"} 🎓
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Here’s your dashboard overview
      </Typography>

      <Grid container spacing={3} mt={2}>
        {/* Upcoming Exams */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Exams
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {upcomingExams.length > 0 ? (
                upcomingExams.map((exam) => (
                  <Box
                    key={exam._id}
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography>{exam.title}</Typography>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => navigate(`/student/exam/${exam._id}`)}
                    >
                      Start
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary">No upcoming exams</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Results */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Results
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {recentResults.length > 0 ? (
                recentResults.map((res) => (
                  <Box
                    key={res._id}
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography>{res.examTitle}</Typography>
                    <Typography>{res.score}%</Typography>
                  </Box>
                ))
              ) : (
                <Typography color="textSecondary">No results yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  onClick={() => navigate("/student/exams")}
                >
                  View All Exams
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/student/results")}
                >
                  View Results
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/student/profile")}
                >
                  Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
