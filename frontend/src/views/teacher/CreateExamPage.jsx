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
  codingQuestions: yup.array().of(
    yup.object().shape({
      question: yup.string().required('Coding Question is required'),
      description: yup.string().required('Question Description is required'),
      duration: yup
        .number()
        .typeError('Duration must be a number')
        .integer('Duration must be an integer')
        .min(1, 'Duration must be at least 1 minute')
        .max(180, 'Duration cannot exceed 180 minutes')
        .required('Question Duration is required'),
    })
  ).min(1, 'At least one coding question is required'),
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
    codingQuestions: [
      {
        question: '',
        description: '',
        duration: 30, // Default 30 minutes
      }
    ],
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
        
        // Reset form with initial values that include one question
        formik.resetForm({
          values: {
            examName: '',
            totalQuestions: '',
            duration: '',
            liveDate: '',
            deadDate: '',
            codingQuestions: [
              {
                question: '',
                description: '',
                duration: 30,
              }
            ],
          }
        });

      } catch (err) {
        console.error('Exam Operation Error:', err);
        toast.error(err?.data?.message || err.error || 'Failed to save exam');
      }
    },
  });

  // Ensure codingQuestions always has at least one question
  useEffect(() => {
    if (!formik.values.codingQuestions || formik.values.codingQuestions.length === 0) {
      formik.setFieldValue('codingQuestions', [{ question: '', description: '', duration: 30 }]);
    }
  }, []);

  useEffect(() => {
    if (examId && examData) {
      console.log('Exam Data for Pre-fill:', examData);
      formik.setValues({
        examName: examData.examName,
        totalQuestions: examData.totalQuestions,
        duration: examData.duration,
        liveDate: examData.liveDate ? new Date(examData.liveDate).toISOString().slice(0, 16) : '',
        deadDate: examData.deadDate ? new Date(examData.deadDate).toISOString().slice(0, 16) : '',
        codingQuestions: examData.codingQuestions && examData.codingQuestions.length > 0 
          ? examData.codingQuestions.map(q => ({
              question: q.question || '',
              description: q.description || '',
              duration: q.duration || 30 // Default to 30 if no duration set
            }))
          : examData.codingQuestion 
            ? [{ 
                question: examData.codingQuestion.question || '', 
                description: examData.codingQuestion.description || '',
                duration: examData.codingQuestion.duration || 30
              }]
            : [{ question: '', description: '', duration: 30 }],
      });
    }
  }, [examId, examData]);

  return (
    <PageContainer title={examId ? "Edit Exam" : "Create Exam"} description={examId ? "Edit an existing exam" : "Create a new exam"}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #41bcba 0%, #ed93c7 100%)',
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: 850,
            mx: 'auto',
            boxShadow: '0 8px 32px 0 rgba(65,188,186,0.18)',
            borderRadius: 4,
            background: '#fff',
            p: { xs: 2, md: 4 },
            mb: 4,
            border: '3px solid #41bcba',
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              color: '#159fc1',
              mb: 2,
              textShadow: '2px 2px 8px #ed93c7',
              letterSpacing: 2,
            }}
          >
            {examId ? 'Edit Exam' : 'Create Exam'}
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: '#c52d84',
              mb: 2,
              fontWeight: 500,
              letterSpacing: 1,
            }}
          >
            {examId
              ? "Update the details of your exam below."
              : "Fill out the form below to create a new exam."}
          </Typography>
          {isExamLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography>Loading Exam Details...</Typography>
            </Box>
          ) : (
            <Card
              elevation={9}
              sx={{
                p: 4,
                zIndex: 1,
                width: '100%',
                maxWidth: '800px',
                mx: 'auto',
                background: "linear-gradient(120deg, #fff 80%, #ed93c7 100%)",
                borderRadius: 3,
                boxShadow: "0 4px 16px 0 #41bcba22",
              }}
            >
              <ExamForm
                formik={formik}
                title={
                  <Typography variant="h4" textAlign="center" color="#41bcba" mb={1} fontWeight={700}>
                    {examId ? 'Edit Exam' : 'Create Exam'}
                  </Typography>
                }
                submitButtonText={examId ? "Update Exam" : "Create Exam"}
              />
            </Card>
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};

export default CreateExamPage;
