import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import { useGetExamsQuery } from 'src/slices/examApiSlice';
import { useGetCheatingLogsQuery } from 'src/slices/cheatingLogApiSlice';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import WarningIcon from '@mui/icons-material/Warning';

export default function CheatingTable() {
  const [filter, setFilter] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [cheatingLogs, setCheatingLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: examsData, isLoading: examsLoading, error: examsError } = useGetExamsQuery();
  const {
    data: cheatingLogsData,
    isLoading: logsLoading,
    error: logsError,
  } = useGetCheatingLogsQuery(selectedExamId, {
    skip: !selectedExamId,
  });

  useEffect(() => {
    if (examsData && examsData.length > 0) {
      const firstExam = examsData[0];
      setSelectedExamId(firstExam.examId);
    }
  }, [examsData]);

  useEffect(() => {
    if (cheatingLogsData) {
      setCheatingLogs(Array.isArray(cheatingLogsData) ? cheatingLogsData : []);
    }
  }, [cheatingLogsData]);

  const filteredUsers = cheatingLogs.filter(
    (log) =>
      log.username?.toLowerCase().includes(filter.toLowerCase()) ||
      log.email?.toLowerCase().includes(filter.toLowerCase()),
  );

  const handleViewScreenshots = (log) => {
    setSelectedLog(log);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedLog(null);
  };

  const getViolationColor = (count) => {
    if (count > 5) return 'error';
    if (count > 2) return 'warning';
    return 'success';
  };

  const getViolationIcon = (count) => {
    if (count > 5) return <WarningIcon color="error" />;
    if (count > 2) return <WarningIcon color="warning" />;
    return null;
  };

  if (examsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (examsError) {
    return (
      <Box p={2}>
        <Typography color="error">
          Error loading exams: {examsError.data?.message || examsError.error || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  if (!examsData || examsData.length === 0) {
    return (
      <Box p={2}>
        <Typography>No exams available. Please create an exam first.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 4px 16px 0 #41bcba22",
        p: { xs: 2, md: 4 },
        mb: 2,
        border: "2px solid #41bcba",
        maxWidth: 1050,
        mx: "auto",
        mt: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 700,
          color: "#159fc1",
          mb: 2,
          textShadow: "2px 2px 8px #ed93c7",
          letterSpacing: 2,
        }}
      >
        Cheating & Activity Logs
      </Typography>
      <Divider sx={{ mb: 3, background: "linear-gradient(90deg, #41bcba 0%, #ed93c7 100%)", height: 3, borderRadius: 2 }} />

      <Paper sx={{ p: 2, mb: 2, background: "#f8fafd", borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Select
              label="Select Exam"
              value={selectedExamId || ''}
              onChange={(e) => setSelectedExamId(e.target.value)}
              fullWidth
              size="small"
              sx={{
                background: "#fff",
                borderRadius: 2,
                minWidth: 220,
                maxWidth: 300,
              }}
            >
              {examsData.map((exam) => (
                <MenuItem key={exam.examId} value={exam.examId}>
                  {exam.examName || 'Unnamed Exam'}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Filter by Name or Email"
              variant="outlined"
              fullWidth
              size="small"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              sx={{ background: "#fff", borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Paper>

      {logsLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : logsError ? (
        <Box p={2}>
          <Typography color="error">
            Error loading logs: {logsError.data?.message || logsError.error || 'Unknown error'}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, background: "#f8fafd" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#41bcba22" }}>
                <TableCell sx={{ fontWeight: 700, color: "#159fc1" }}>Sr.No</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#159fc1" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#159fc1" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#c52d84" }}>No Face Count</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#c52d84" }}>Multiple Face Count</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#c52d84" }}>Cell Phone Count</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#c52d84" }}>Prohibited Object Count</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#159fc1" }}>Screenshots</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No cheating logs found for this exam
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((log, index) => (
                  <TableRow key={index} hover sx={{ transition: "background 0.2s", "&:hover": { background: "#e3f7f6" } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{log.username}</TableCell>
                    <TableCell>{log.email}</TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.noFaceCount)}
                        label={log.noFaceCount}
                        color={getViolationColor(log.noFaceCount)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.multipleFaceCount)}
                        label={log.multipleFaceCount}
                        color={getViolationColor(log.multipleFaceCount)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.cellPhoneCount)}
                        label={log.cellPhoneCount}
                        color={getViolationColor(log.cellPhoneCount)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getViolationIcon(log.prohibitedObjectCount)}
                        label={log.prohibitedObjectCount}
                        color={getViolationColor(log.prohibitedObjectCount)}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Screenshots">
                        <IconButton
                          onClick={() => handleViewScreenshots(log)}
                          disabled={!log.screenshots?.length}
                        >
                          <ImageIcon color={log.screenshots?.length ? 'primary' : 'disabled'} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Screenshots Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Screenshots - {selectedLog?.username}</Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedLog?.screenshots?.map((screenshot, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: 3, boxShadow: "0 2px 8px #41bcba22" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={screenshot.url}
                    alt={`Violation - ${screenshot.type}`}
                    sx={{ objectFit: 'cover', borderRadius: 2 }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Type: {screenshot.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Detected: {new Date(screenshot.detectedAt).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
