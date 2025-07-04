import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
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
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            boxShadow: '0 8px 32px 0 rgba(65,188,186,0.18)',
            borderRadius: 4,
            background: '#fff',
            p: { xs: 2, md: 4 },
            mb: 4,
            border: '2px solid #ffffff',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            '&:hover': {
              borderColor: '#8e09b0',
            },
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
            Welcome to Your Exam Dashboard
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
            Here you can find all your active and upcoming exams. Good luck!
          </Typography>
          <Divider sx={{ mb: 3, background: 'linear-gradient(90deg, #41bcba 0%, #ed93c7 100%)', height: 3, borderRadius: 2 }} />
          <DashboardCard
            title={
              <Typography
                variant="h5"
                sx={{
                  color: "#41bcba",
                  fontWeight: 700,
                  letterSpacing: 1,
                  textShadow: "1px 1px 8px #ed93c7",
                }}
              >
                All Active Exams
              </Typography>
            }
            sx={{
              background: "linear-gradient(120deg, #fff 80%, #ed93c7 100%)",
              borderRadius: 3,
              boxShadow: "0 4px 16px 0 #41bcba22",
              p: { xs: 1, md: 3 },
            }}
          >
            <Exams />
          </DashboardCard>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ExamPage;
