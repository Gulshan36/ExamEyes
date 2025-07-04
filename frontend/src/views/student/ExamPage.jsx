import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import Exams from './Components/Exams';

const ExamPage = () => {
  return (
    <PageContainer title="Exam Page" description="Active Exams">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #41bcba 0%, #ed93c7 100%)',
          py: 6,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 700,
            color: '#fff',
            mb: 4,
            textShadow: '2px 2px 8px #159fc1',
            letterSpacing: 2,
          }}
        >
          Welcome to Your Exam Dashboard
        </Typography>
        <Box
          sx={{
            maxWidth: 1050,
            mx: 'auto',
            boxShadow: '0 8px 32px 0 rgba(65,188,186,0.18)',
            borderRadius: 4,
            background: '#fff',
            p: { xs: 2, md: 4 },
          }}
        >
          <DashboardCard title="All Active Exams">
            <Exams />
          </DashboardCard>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ExamPage;
