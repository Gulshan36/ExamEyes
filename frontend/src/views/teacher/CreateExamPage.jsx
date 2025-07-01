import React, { useEffect } from 'react';
import { Grid, Box, Card, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import ExamForm from './components/ExamForm';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCreateExamMutation, useGetExamByIdQuery, useUpdateExamMutation } from '../../slices/examApiSlice.js';
import { useParams } from 'react-router-dom';

const examValidationSchema = yup.object({
  examName: yup.string().required('Exam Name is required'),
  totalQuestions: yup
    .number()
    .typeError('Total Number of Questions must be a number')
    .integer('Total Number of Questions must be an integer')
    .positive('Total Number of Questions must be positive')
    .required('Total Number of Questions is required'),
  duration: yup
    .number()
    .typeError('Exam Duration must be a number')
    .integer('Exam Duration must be an integer')
    .min(1, 'Exam Duration must be at least 1 minute')
    .required('Exam Duration is required'),
  liveDate: yup.date().required('Live Date and Time is required'),
  deadDate: yup.date().required('Dead Date and Time is required'),
  codingQuestion: yup.object().shape({
    question: yup.string().required('Coding Question is required'),
    description: yup.string().required('Question Description is required'),
  }),
});

const CreateExamPage = () => {
  const { examId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const [createExam, { isLoading: isCreating }] = useCreateExamMutation();
  const [updateExam, { isLoading: isUpdating }] = useUpdateExamMutation();
  const { data: examData, isLoading: isExamLoading } = useGetExamByIdQuery(examId, { skip: !examId });

  const initialExamValues = {
    examName: '',
    totalQuestions: '',
    duration: '',
    liveDate: '',
    deadDate: '',
    codingQuestion: {
      question: '',
      description: '',
    },
  };

  const formik = useFormik({
    initialValues: initialExamValues,
    validationSchema: examValidationSchema,
    onSubmit: async (values) => {
      try {
        let examResponse;
        if (examId) {
          examResponse = await updateExam({ examId, ...values }).unwrap();
          toast.success('Exam updated successfully!');
        } else {
          examResponse = await createExam(values).unwrap();
          toast.success('Exam created successfully!');
        }

        console.log('Exam Response:', examResponse);
        formik.resetForm();

      } catch (err) {
        console.error('Exam Operation Error:', err);
        toast.error(err?.data?.message || err.error || 'Failed to save exam');
      }
    },
  });

  useEffect(() => {
    if (examId && examData) {
      console.log('Exam Data for Pre-fill:', examData);
      formik.setValues({
        examName: examData.examName,
        totalQuestions: examData.totalQuestions,
        duration: examData.duration,
        liveDate: examData.liveDate ? new Date(examData.liveDate).toISOString().slice(0, 16) : '',
        deadDate: examData.deadDate ? new Date(examData.deadDate).toISOString().slice(0, 16) : '',
        codingQuestion: {
          question: examData.codingQuestion?.question || '',
          description: examData.codingQuestion?.description || '',
        },
      });
    }
  }, [examId, examData]);

  return (
    <PageContainer title={examId ? "Edit Exam" : "Create Exam"} description={examId ? "Edit an existing exam" : "Create a new exam"}>
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            xl={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {isExamLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading Exam Details...</Typography>
              </Box>
            ) : (
              <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '800px' }}>
                <ExamForm
                  formik={formik}
                  title={
                    <Typography variant="h3" textAlign="center" color="textPrimary" mb={1}>
                      {examId ? 'Edit Exam' : 'Create Exam'}
                    </Typography>
                  }
                  submitButtonText={examId ? "Update Exam" : "Create Exam"}
                />
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default CreateExamPage;
