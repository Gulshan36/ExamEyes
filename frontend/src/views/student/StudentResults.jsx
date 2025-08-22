// import React from 'react';
// import { 
//   Typography, 
//   Box, 
//   CircularProgress, 
//   Alert, 
//   Paper, 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableContainer, 
//   TableHead, 
//   TableRow, 
//   Button,
//   Chip,
//   Stack,
//   Card,
//   CardContent,
//   Grid
// } from '@mui/material';
// import PageContainer from 'src/components/container/PageContainer';
// import DashboardCard from '../../components/shared/DashboardCard';
// import { useNavigate } from 'react-router-dom';
// import { useGetStudentStatsQuery } from 'src/slices/examApiSlice';
// import { 
//   Assignment as AssignmentIcon,
//   TrendingUp as TrendingUpIcon,
//   EmojiEvents as EmojiEventsIcon,
//   Grade as GradeIcon
// } from '@mui/icons-material';

// const StudentResults = () => {
//   const navigate = useNavigate();
//   const { data: studentStats, isLoading, isError, error } = useGetStudentStatsQuery();

//   if (isLoading) {
//     return (
//       <PageContainer title="Loading Results" description="Fetching your exam results">
//         <DashboardCard title="Loading Your Results">
//           <Box display="flex" justifyContent="center" alignItems="center" height="200px">
//             <CircularProgress />
//             <Typography variant="h6" sx={{ ml: 2 }}>Loading your exam results...</Typography>
//           </Box>
//         </DashboardCard>
//       </PageContainer>
//     );
//   }

//   if (isError) {
//     return (
//       <PageContainer title="Error" description="Error fetching results">
//         <Alert severity="error" sx={{ mb: 2 }}>
//           Error fetching your results: {error?.data?.message || error?.message || 'Unknown error'}
//         </Alert>
//       </PageContainer>
//     );
//   }

//   const { completedExams, avgScore, totalScore, recentSubmissions, allSubmissions } = studentStats || {};
//   const submissions = Array.isArray(allSubmissions) && allSubmissions.length > 0 ? allSubmissions : (recentSubmissions || []);
//   const [query, setQuery] = useState('');
//   const [status, setStatus] = useState('all');
//   const filtered = React.useMemo(() => {
//     return submissions.filter((s) => {
//       const match = s.examName.toLowerCase().includes(query.toLowerCase());
//       const pct = Math.round((s.score / (s.totalQuestions * 10)) * 100);
//       const pass = pct >= 60;
//       const ok = status === 'all' ? true : status === 'passed' ? pass : !pass;
//       return match && ok;
//     });
//   }, [submissions, query, status]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getScoreColor = (score, totalQuestions) => {
//     const percentage = (score / (totalQuestions * 10)) * 100; // Assuming 10 marks per question
//     if (percentage >= 80) return 'success';
//     if (percentage >= 60) return 'warning';
//     return 'error';
//   };

//   return (
//     <PageContainer title="My Results" description="View your exam results and performance">
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" gutterBottom>
//           My Exam Results
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           Track your performance and view detailed results for all completed exams.
//         </Typography>
//       </Box>

//       {/* Statistics Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
//                 <Box>
//                   <Typography variant="h4" color="primary">
//                     {completedExams || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Completed Exams
//                   </Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
//                 <Box>
//                   <Typography variant="h4" color="success.main">
//                     {avgScore || 0}%
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Average Score
//                   </Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <GradeIcon color="warning" sx={{ fontSize: 40 }} />
//                 <Box>
//                   <Typography variant="h4" color="warning.main">
//                     {totalScore || 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Total Points
//                   </Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card>
//             <CardContent>
//               <Stack direction="row" alignItems="center" spacing={2}>
//                 <EmojiEventsIcon color="error" sx={{ fontSize: 40 }} />
//                 <Box>
//                   <Typography variant="h4" color="error.main">
//                     {completedExams > 0 ? Math.round((avgScore || 0) / 10) : 0}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Grade Level
//                   </Typography>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Results Table */}
//       <DashboardCard title="Exam Results History" action={
//         <Stack direction="row" spacing={1}>
//           <TextField size="small" placeholder="Search exam" value={query} onChange={(e) => setQuery(e.target.value)} />
//           <TextField size="small" select value={status} onChange={(e) => setStatus(e.target.value)}>
//             <MenuItem value="all">All</MenuItem>
//             <MenuItem value="passed">Passed</MenuItem>
//             <MenuItem value="failed">Failed</MenuItem>
//           </TextField>
//           <Button variant="contained" onClick={async () => {
//             const { jsPDF } = await import('jspdf');
//             await import('jspdf-autotable');
//             const doc = new jsPDF();
//             doc.text('My Exam Results', 14, 16);
//             const rows = filtered.map((s) => {
//               const pct = Math.round((s.score / (s.totalQuestions * 10)) * 100);
//               return [s.examName, `${s.score}`, `${s.totalQuestions}`, `${pct}%`, s.codingSubmitted ? (s.codingLanguage || 'Yes') : 'No', new Date(s.submittedAt).toLocaleString()];
//             });
//             // @ts-ignore
//             doc.autoTable({ head: [['Exam', 'Score', 'Questions', 'Percentage', 'Coding', 'Date']], body: rows, startY: 22 });
//             doc.save('my-results.pdf');
//           }}>Export PDF</Button>
//         </Stack>
//       }>
//         {filtered.length === 0 ? (
//           <Box textAlign="center" py={6}>
//             <AssignmentIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
//             <Typography variant="h6" color="text.secondary" gutterBottom>
//               No exam results found
//             </Typography>
//             <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
//               You haven't completed any exams yet. Start taking exams to see your results here.
//             </Typography>
//             <Button 
//               variant="contained" 
//               onClick={() => navigate('/exam')}
//               startIcon={<AssignmentIcon />}
//             >
//               Take an Exam
//             </Button>
//           </Box>
//         ) : (
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell><strong>Exam Name</strong></TableCell>
//                   <TableCell align="center"><strong>Score</strong></TableCell>
//                   <TableCell align="center"><strong>Questions</strong></TableCell>
//                   <TableCell align="center"><strong>Percentage</strong></TableCell>
//                   <TableCell align="center"><strong>Coding</strong></TableCell>
//                   <TableCell align="center"><strong>Status</strong></TableCell>
//                   <TableCell align="center"><strong>Date</strong></TableCell>
//                   <TableCell align="center"><strong>Actions</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filtered.map((submission) => {
//                   const percentage = Math.round((submission.score / (submission.totalQuestions * 10)) * 100);
//                   const scoreColor = getScoreColor(submission.score, submission.totalQuestions);
                  
//                   return (
//                     <TableRow key={submission.examId} hover>
//                       <TableCell>
//                         <Typography variant="body2" fontWeight="medium">
//                           {submission.examName}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Typography variant="body2" color={`${scoreColor}.main`} fontWeight="bold">
//                           {submission.score}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Typography variant="body2">
//                           {submission.totalQuestions}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Typography variant="body2" color={`${scoreColor}.main`} fontWeight="bold">
//                           {percentage}%
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         {submission.codingSubmitted ? (
//                           <Chip size="small" color="success" label={submission.codingLanguage ? `Submitted (${submission.codingLanguage})` : 'Submitted'} />
//                         ) : (
//                           <Chip size="small" label="Not submitted" />
//                         )}
//                       </TableCell>
//                       <TableCell align="center">
//                         <Chip 
//                           label={percentage >= 60 ? 'Passed' : 'Failed'} 
//                           color={percentage >= 60 ? 'success' : 'error'}
//                           size="small"
//                         />
//                       </TableCell>
//                       <TableCell align="center">
//                         <Typography variant="body2" color="text.secondary">
//                           {formatDate(submission.submittedAt)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           onClick={() => navigate(`/result/${submission.examId}`)}
//                         >
//                           View Details
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </DashboardCard>
//     </PageContainer>
//   );
// };

// export default StudentResults;
