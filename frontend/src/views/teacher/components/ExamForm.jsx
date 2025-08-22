import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CodingQuestionForm from './CodingQuestionForm';

const CreateExam = ({ formik, title, subtitle, subtext, submitButtonText }) => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: 4,
        boxShadow: "0 8px 32px 0 #41bcba22",
        p: { xs: 3, md: 5 },
        mb: 3,
        border: "2px solid #41bcba",
        maxWidth: 700,
        mx: "auto",
        mt: 2,
      }}
    >
      {title ? (
        <Typography
          fontWeight="700"
          variant="h3"
          align="center"
          mb={2}
          sx={{
            color: "#159fc1",
            textShadow: "1px 1px 8px #ed93c7",
            letterSpacing: 1,
          }}
        >
          {title}
        </Typography>
      ) : null}

      {subtext && (
        <Typography
          align="center"
          sx={{
            color: "#c52d84",
            mb: 2,
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          {subtext}
        </Typography>
      )}

      <Divider sx={{ mb: 3, background: "linear-gradient(90deg, #41bcba 0%, #ed93c7 100%)", height: 3, borderRadius: 2 }} />

      <Box component="form">
        <Stack mb={3}>
          <CustomTextField
            id="examName"
            name="examName"
            label="Exam Name"
            variant="outlined"
            fullWidth
            value={values.examName}
            onChange={handleChange}
            error={touched.examName && Boolean(errors.examName)}
            helperText={touched.examName && errors.examName}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
        </Stack>

        <Stack mb={3} direction={{ xs: "column", sm: "row" }} spacing={2}>
          <CustomTextField
            id="totalQuestions"
            name="totalQuestions"
            label="Total Questions"
            variant="outlined"
            fullWidth
            value={values.totalQuestions}
            onChange={handleChange}
            error={touched.totalQuestions && Boolean(errors.totalQuestions)}
            helperText={touched.totalQuestions && errors.totalQuestions}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
          <CustomTextField
            id="duration"
            name="duration"
            label="Duration (min)"
            variant="outlined"
            fullWidth
            value={values.duration}
            onChange={handleChange}
            error={touched.duration && Boolean(errors.duration)}
            helperText={touched.duration && errors.duration}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="maxAttempts"
            name="maxAttempts"
            label="Maximum Attempts per Student"
            type="number"
            variant="outlined"
            fullWidth
            value={values.maxAttempts}
            onChange={handleChange}
            error={touched.maxAttempts && Boolean(errors.maxAttempts)}
            helperText={touched.maxAttempts && errors.maxAttempts || "Students can attempt this exam up to this many times (1-10)"}
            inputProps={{ min: 1, max: 10 }}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
        </Stack>

        <Stack mb={3} direction={{ xs: "column", sm: "row" }} spacing={2}>
          <CustomTextField
            id="liveDate"
            name="liveDate"
            label="Live Date & Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={values.liveDate}
            onChange={handleChange}
            error={touched.liveDate && Boolean(errors.liveDate)}
            helperText={touched.liveDate && errors.liveDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
          <CustomTextField
            id="deadDate"
            name="deadDate"
            label="Dead Date & Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={values.deadDate}
            onChange={handleChange}
            error={touched.deadDate && Boolean(errors.deadDate)}
            helperText={touched.deadDate && errors.deadDate}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ background: "#f8fafd", borderRadius: 2 }}
          />
        </Stack>

        <Divider sx={{ my: 3, background: "#f3e8f7" }} />

        <CodingQuestionForm formik={formik} />

        <Button
          color="primary"
          variant="contained"
          size="medium"
          fullWidth
          type="submit"
          disabled={formik.isSubmitting}
          onClick={handleSubmit}
          sx={{
            mt: 3,
            fontWeight: 600,
            background: "#159fc1",
            letterSpacing: 1,
            borderRadius: 2,
            boxShadow: "0 2px 8px #41bcba33",
            '&:hover': { background: "#0d7ea8" },
          }}
        >
          {submitButtonText || 'Create Exam'}
        </Button>
      </Box>

      {subtitle && (
        <Typography align="center" sx={{ mt: 3, color: "#888" }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default CreateExam;
