import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetExamResultsQuery, useGetStudentExamResultQuery } from 'src/slices/examApiSlice';
import { useSelector } from 'react-redux';

const ResultPage = () => {
  const { examId, studentId: studentIdFromUrl } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const isTeacher = userInfo?.role === 'teacher';
  const currentUserId = userInfo?._id;

  // Determine the student ID to use for fetching results
  // If studentIdFromUrl is present, it means a teacher is viewing a specific student's result.
  // Otherwise, it's a student viewing their own result, so use currentUserId.
  const studentIdToQuery = studentIdFromUrl || currentUserId;

  // Fetch all exam results for teacher, or skip for student
  const { data: allExamResults, isLoading: isAllResultsLoading, isError: isAllResultsError, error: allResultsError } = useGetExamResultsQuery(examId, {
    skip: !isTeacher, // Only fetch if user is a teacher
  });

  // Fetch specific student's exam result for student or teacher viewing, or skip if no studentIdToQuery
  const { data: studentResult, isLoading: isStudentResultLoading, isError: isStudentResultError, error: studentResultError } = useGetStudentExamResultQuery({ examId, studentId: studentIdToQuery }, {
    skip: !studentIdToQuery, // Skip if no student ID is determined
  });

  if (isTeacher && isAllResultsLoading) {
    return (
      <PageContainer title="Loading Results" description="Fetching exam results">
        <DashboardCard title="Loading All Results">
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading all exam results...</Typography>
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (!isTeacher && isStudentResultLoading) {
    return (
      <PageContainer title="Loading Results" description="Fetching exam results">
        <DashboardCard title="Loading Your Result">
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Loading your exam result...</Typography>
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (isTeacher && isAllResultsError) {
    return (
      <PageContainer title="Error" description="Failed to load exam results">
        <DashboardCard title="Error Loading All Results">
          <Alert severity="error">Error fetching all exam results: {allResultsError?.data?.message || allResultsError?.error}</Alert>
        </DashboardCard>
      </PageContainer>
    );
  }

  if (!isTeacher && isStudentResultError) {
    return (
      <PageContainer title="Error" description="Failed to load exam results">
        <DashboardCard title="Error Loading Your Result">
          <Alert severity="error">Error fetching your exam result: {studentResultError?.data?.message || studentResultError?.error}</Alert>
        </DashboardCard>
      </PageContainer>
    );
  }

  const handleStudentClick = (sId) => {
    navigate(`/teacher/result/${examId}/${sId}`);
  };

  // Render for Teacher
  if (isTeacher) {
    const sortedResults = allExamResults ? [...allExamResults].sort((a, b) => b.score - a.score) : [];
    return (
      <PageContainer title="Exam Results" description="Teacher's view of exam results">
        <DashboardCard title="All Student Results">
          {sortedResults.length === 0 ? (
            <Typography>No submissions found for this exam yet.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Score</TableCell>
                    <TableCell align="right">Submitted At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedResults.map((result) => (
                    <TableRow
                      key={result._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Button onClick={() => handleStudentClick(result.studentId._id)}>{result.studentId.name}</Button>
                      </TableCell>
                      <TableCell>{result.studentId.email}</TableCell>
                      <TableCell align="right">{result.score}</TableCell>
                      <TableCell align="right">{new Date(result.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DashboardCard>
      </PageContainer>
    );
  }

  // Render for Student
  if (!isTeacher && studentResult) {
    return (
      <PageContainer title="Your Result" description="Your exam result">
        <DashboardCard title="Your Exam Result">
          <Box>
            <Typography variant="h5" gutterBottom>Score: {studentResult.score}</Typography>
            <Typography variant="body1" color="text.secondary">Submitted on: {new Date(studentResult.createdAt).toLocaleString()}</Typography>
            {/* You can add more detailed result display here, e.g., answers given vs correct answers */}
            <Typography variant="h6" mt={3}>Your Answers:</Typography>
            {studentResult.answers.length > 0 ? ( 
              studentResult.answers.map((ans, index) => (
                <Box key={index} mt={2} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                  <Typography variant="subtitle1">Question ID: {ans.questionId}</Typography>
                  <Typography variant="body2">Your Selected Option: {ans.selectedOption}</Typography>
                  <Typography variant="body2" color={ans.isCorrect ? "success.main" : "error.main"}>
                    {ans.isCorrect ? "Correct" : "Incorrect"}
                  </Typography>
                  {ans.codeAnswer && (
                    <Box mt={1}>
                      <Typography variant="body2">Your Code Submission:</Typography>
                      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', backgroundColor: '#eee', padding: '10px', borderRadius: '5px' }}>
                        {ans.codeAnswer}
                      </pre>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography>No answers recorded for this submission.</Typography>
            )}
          </Box>
        </DashboardCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="No Result" description="No exam result to display">
      <DashboardCard title="No Result">
        <Typography>No result found or you are not authorized to view this result.</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default ResultPage;
