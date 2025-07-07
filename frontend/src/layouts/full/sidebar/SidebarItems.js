import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List, Typography, Divider } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useSelector } from 'react-redux';
import { useGetLastStudentSubmissionQuery } from 'src/slices/examApiSlice';

const SidebarItems = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const pathDirect = pathname;

  // Fetch the last submitted exam ID for students
  const { data: lastSubmissionData } = useGetLastStudentSubmissionQuery(undefined, {
    skip: userInfo?.role !== 'student',
  });

  const studentResultExamId = lastSubmissionData?.examId;

  // Dynamically adjust menu items for students
  const adjustedMenuItems = Menuitems.map((item) => {
    if (item.title === 'Result' && userInfo?.role === 'student') {
      const newHref = studentResultExamId ? `/result/${studentResultExamId}` : '/result';
      return {
        ...item,
        href: newHref,
      };
    }
    return item;
  });

  return (
    <Box
      sx={{
        px: 2,
        py: 3,
        background: '#fff',
        minHeight: '100vh',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '2px 0 16px 0 #41bcba22',
        borderRight: '3px solid #159fc1',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#159fc1",
          letterSpacing: 1,
          mb: 2,
          textAlign: "center",
          textShadow: "1px 1px 8px #ed93c7",
        }}
      >
        Exam Eye
      </Typography>
      <Divider sx={{ mb: 2, background: "#159fc1", opacity: 0.7 }} />
      <List sx={{ pt: 0 }} className="sidebarNav">
        {adjustedMenuItems.map((item) => {
          // Hide certain items for students
          if (
            userInfo.role === 'student' &&
            ['Create Exam', 'Add Questions', 'Exam Logs'].includes(item.title)
          ) {
            return null;
          }
          // SubHeader
          if (item.subheader) {
            if (userInfo.role === 'student' && item.subheader === 'Teacher') {
              return null;
            }
            return (
              <Box key={item.subheader} sx={{ mb: 1 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#159fc1",
                    fontWeight: 600,
                    letterSpacing: 1,
                    pl: 1,
                    mb: 0.5,
                  }}
                >
                  {item.subheader}
                </Typography>
                <NavGroup item={item} />
              </Box>
            );
          } else {
            return (
              <Box key={item.id} sx={{
                mb: 1,
                borderRadius: 2,
                background: "#f8fafd",
                transition: "background 0.2s, box-shadow 0.9s",
                '&:hover': {
                  background: '#e3f7f6',
                  boxShadow: '0 2px 8px #159fc133',
                },
              }}>
                <NavItem item={item} pathDirect={pathDirect} />
              </Box>
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
