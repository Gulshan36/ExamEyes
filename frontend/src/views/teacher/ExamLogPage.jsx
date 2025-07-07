import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import CheatingTable from './components/CheatingTable';

const ExamLogPage = () => {
  return (
    <PageContainer title="ExamLog Page" description="this is ExamLog page">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #41bcba 0%, #ed93c7 100%)',
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: 1050,
            mx: 'auto',
            boxShadow: '0 8px 32px 0 rgba(65,188,186,0.18)',
            borderRadius: 4,
            background: '#fff',
            p: { xs: 2, md: 4 },
            mb: 4,
            border: '3px solid #41bcba'
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
            Exam Log
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
            Review all suspicious activities and logs for your exams below.
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
                Cheating & Activity Logs
              </Typography>
            }
            sx={{
              background: "linear-gradient(120deg, #fff 80%, #ed93c7 100%)",
              borderRadius: 3,
              boxShadow: "0 4px 16px 0 #41bcba22",
              p: { xs: 1, md: 3 },
            }}
          >
            <CheatingTable />
          </DashboardCard>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ExamLogPage;
