import React from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
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
    skip: userInfo?.role !== 'student', // Only fetch if user is a student
  });

  const studentResultExamId = lastSubmissionData?.examId;
  console.log('SidebarItems - lastSubmissionData:', lastSubmissionData);
  console.log('SidebarItems - studentResultExamId:', studentResultExamId);

  // Dynamically adjust menu items for students
  const adjustedMenuItems = Menuitems.map((item) => {
    if (item.title === 'Result' && userInfo?.role === 'student') {
      const newHref = studentResultExamId ? `/result/${studentResultExamId}` : '/result';
      console.log('SidebarItems - Result item new href:', newHref);
      return {
        ...item,
        href: newHref, // Update href dynamically
      };
    }
    return item;
  });

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {adjustedMenuItems.map((item) => {
          // Check if the user is a student and if the item should be hidden
          if (
            userInfo.role === 'student' &&
            ['Create Exam', 'Add Questions', 'Exam Logs'].includes(item.title)
          ) {
            return null; // Don't render this menu item for students
          }
          // {/********SubHeader**********/}
          if (item.subheader) {
            // Check if the user is a student and if the subheader should be hidden
            if (userInfo.role === 'student' && item.subheader === 'Teacher') {
              return null; // Don't render the "Teacher" subheader for students
            }

            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return <NavItem item={item} key={item.id} pathDirect={pathDirect} />;
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
