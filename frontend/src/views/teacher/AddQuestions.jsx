import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import AddQuestionForm from './components/AddQuestionForm';

const AddQuestions = () => {
  return (
    <PageContainer title="Add Questions Page" description="this is Add Questions page">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #41bcba 0%, #ed93c7 100%)',
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: 1000,
            mx: 'auto',
            boxShadow: '0 8px 32px 0 rgba(65,188,186,0.18)',
            borderRadius: 9,
            background: '#fff',
            p: { xs: 2, md: 6 },
            mb: 4,
            border: '2px solid #41bcba',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              color: '#159fc1',
              mb: 2,
              textShadow: '2px 2px 8px #ed93c7',
              letterSpacing: 2,
            }}
          >
            Add Questions
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
            Fill out the form below to add a new question to your exam.
          </Typography>
          <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #41bcba 0%, #ed93c7 100%)', height: 3, borderRadius: 2 }} />
          <DashboardCard
            title={
              <Typography
                variant="h4"
                sx={{
                  color: "#e52719",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textShadow: "1px 1px 8px #ed93c7",
                }}
              >
                Question Form
              </Typography>
            }
            sx={{
              background: "linear-gradient(120deg, #fff 80%, #ed93c7 100%)",
              borderRadius: 3,
              boxShadow: "0 4px 16px 0 #41bcba22",
              p: { xs: 1, md: 3 },
            }}
          >
            <AddQuestionForm />
          </DashboardCard>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default AddQuestions;
