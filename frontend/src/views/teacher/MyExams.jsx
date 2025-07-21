import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Stack,
  Container,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Quiz as QuizIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useGetMyExamsQuery, useDeleteExamMutation } from '../../slices/examApiSlice';
import { useNavigate } from 'react-router-dom';

const MyExams = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  // Fetch only teacher's created exams
  const { data: myExams = [], isLoading, error, refetch } = useGetMyExamsQuery();
  const [deleteExam] = useDeleteExamMutation();

  const handleDeleteExam = async () => {
    if (examToDelete) {
      try {
        await deleteExam(examToDelete._id).unwrap();
        setDeleteDialogOpen(false);
        setExamToDelete(null);
        refetch(); // Refresh the exam list
      } catch (err) {
        console.error('Failed to delete exam:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const liveDate = new Date(exam.liveDate);
    const deadDate = new Date(exam.deadDate);

    if (now < liveDate) {
      return { status: 'Upcoming', color: 'info' };
    } else if (now >= liveDate && now <= deadDate) {
      return { status: 'Active', color: 'success' };
    } else {
      return { status: 'Completed', color: 'default' };
    }
  };

  const ExamCard = ({ exam }) => {
    const { status, color } = getExamStatus(exam);

    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Stack spacing={1}>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {exam.examName}
                </Typography>
                <Chip
                  label={status}
                  size="small"
                  color={color}
                  variant="outlined"
                />
              </Stack>
              <IconButton size="small">
                <MoreVertIcon />
              </IconButton>
            </Stack>

            {/* Exam Details */}
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <QuizIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {exam.totalQuestions} Questions
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ScheduleIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {exam.duration} Minutes
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AssignmentIcon color="primary" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Created: {formatDate(exam.createdAt)}
                </Typography>
              </Stack>
            </Stack>

            {/* Date Range */}
            <Paper
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 2,
              }}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  EXAM SCHEDULE
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(exam.liveDate)}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end">
                    <Typography variant="caption" color="text.secondary">
                      End Date
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(exam.deadDate)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </CardContent>

        {/* Actions */}
        <Stack direction="row" spacing={1} sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/exam/${exam._id}`)}
            sx={{ flexGrow: 1 }}
          >
            View
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/exam/edit/${exam._id}`)}
            sx={{ flexGrow: 1 }}
          >
            Edit
          </Button>
          <IconButton
            color="error"
            size="small"
            onClick={() => {
              setExamToDelete(exam);
              setDeleteDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading exams: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          borderRadius: 3,
          p: 4,
          mb: 4,
          color: 'white',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight="bold">
              My Exams
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage your created exams
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <AssignmentIcon />
              </Avatar>
              <Stack>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Total Exams Created
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {myExams.length}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-exam')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': { bgcolor: 'grey.100' },
              fontWeight: 'bold',
            }}
          >
            Create New Exam
          </Button>
        </Stack>
      </Paper>

      {/* Exams Grid */}
      {myExams.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            borderRadius: 3,
          }}
        >
          <AssignmentIcon sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
          <Typography variant="h5" gutterBottom color="primary">
            No Exams Created Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't created any exams yet. Start by creating your first exam!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create-exam')}
          >
            Create Your First Exam
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {myExams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam._id}>
              <ExamCard exam={exam} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <DeleteIcon color="error" />
            <Typography variant="h6">Delete Exam</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the exam "{examToDelete?.examName}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteExam}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyExams;
