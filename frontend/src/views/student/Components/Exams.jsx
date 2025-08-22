import React from 'react';
import { Grid, Typography, Box } from '@mui/material'; // Add Box import
import PageContainer from 'src/components/container/PageContainer';
import BlankCard from '../../../components/shared/BlankCard';
import ExamCard from './ExamCard';
import { useGetExamsQuery } from 'src/slices/examApiSlice';

const Exams = () => {
  // Fetch exam data from the backend using useGetExamsQuery
  const { data: userExams, isLoading, isError } = useGetExamsQuery();
  console.log('Exam USer ', userExams);

  if (isLoading) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="#159fc1">
          Loading exams...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography
        variant="h6"
        align="center"
        color="#f21212"
        sx={{ mt: 4, fontWeight: 600 }}
      >
        Error fetching exams.
      </Typography>
    );
  }

  // Fix: userExams may be {exams: [...]}, not just an array
  const examsArray = Array.isArray(userExams)
    ? userExams
    : (userExams && Array.isArray(userExams.exams))
      ? userExams.exams
      : [];

  return (
    <PageContainer title="Exams" description="List of exams">
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          mb: 4,
          background: "linear-gradient(90deg, #41bcba 0%, #ed93c7 100%)",
          borderRadius: 4,
          boxShadow: "0 4px 24px 0 #41bcba33",
          p: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#fff",
            letterSpacing: 1,
            textShadow: "1px 1px 8px #159fc1",
            flex: 1,
            minWidth: 200,
          }}
        >
          <span style={{ color: "#fff" }}>All available Exams</span>
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#fff",
            fontWeight: 400,
            ml: 2,
            minWidth: 180,
            textAlign: { xs: "left", md: "right" },
            opacity: 0.85,
          }}
        >
          {examsArray.length > 0
            ? `Showing ${examsArray.length} exam${examsArray.length > 1 ? "s" : ""}`
            : "No active exams"}
        </Typography>
      </Box>
      <Grid
        container
        spacing={4}
        sx={{
          px: { xs: 1, md: 4 },
          pb: 4,
        }}
      >
        {examsArray.length > 0 ? (
          examsArray.map((exam) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={exam._id}>
              <BlankCard
                sx={{
                  borderRadius: 6,
                  boxShadow: "0 8px 32px 0 #41bcba33",
                  background: "linear-gradient(135deg, #fff 70%, #41bcba 100%)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  border: "2px solidrgb(101, 21, 193)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.04)",
                    boxShadow: "0 16px 40px 0 #159fc144",
                    borderColor: "#c52d84",
                  },
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "8px",
                    background: "linear-gradient(90deg, #ed93c7 0%, #41bcba 100%)",
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  },
                }}
              >
                <Box sx={{ p: 2, minHeight: 180, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <ExamCard exam={exam} />
                </Box>
              </BlankCard>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="h6"
              align="center"
              color="#c52d84"
              sx={{ mt: 6, fontWeight: 500 }}
            >
              No exams available at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>
    </PageContainer>
  );
};

export default Exams;
