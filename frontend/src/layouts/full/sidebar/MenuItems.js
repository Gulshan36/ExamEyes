import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = (role) => {
  const commonItems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/dashboard',
    },
  ];

  const studentItems = [
    {
      navlabel: true,
      subheader: 'Student',
    },
    {
      id: uniqueId(),
      title: 'Exams',
      icon: IconTypography,
      href: '/exam',
    },
    {
      id: uniqueId(),
      title: 'Result',
      icon: IconCopy,
      href: '/result', // Will be adjusted in SidebarItems if examId exists
    },
  ];

  const teacherItems = [
    {
      navlabel: true,
      subheader: 'Teacher',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/teacher-dashboard', // merged from 2nd code
    },
    {
      id: uniqueId(),
      title: 'Create Exam',
      icon: IconMoodHappy,
      href: '/create-exam',
    },
    {
      id: uniqueId(),
      title: 'My Exams', // merged from 2nd code
      icon: IconTypography,
      href: '/my-exams',
    },
    {
      id: uniqueId(),
      title: 'Add Questions',
      icon: IconLogin,
      href: '/add-questions',
    },
    {
      id: uniqueId(),
      title: 'Exam Logs',
      icon: IconUserPlus,
      href: '/exam-log',
    },
    {
      id: uniqueId(),
      title: 'Results',
      icon: IconCopy,
      href: '/teacher/results',
    },
    // Extra optional items from 2nd code
    // {
    //   id: uniqueId(),
    //   title: 'Exam Sale comp',
    //   icon: IconPlayerPlayFilled,
    //   href: '/generate-report',
    // },
    // {
    //   id: uniqueId(),
    //   title: 'Sample Page',
    //   icon: IconAperture,
    //   href: '/sample-page',
    // },
  ];

  const adminItems = [
    {
      navlabel: true,
      subheader: 'Admin',
    },
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: IconLayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      id: uniqueId(),
      title: 'Manage Teachers',
      icon: IconUserPlus,
      href: '/admin/teachers',
    },
    {
      id: uniqueId(),
      title: 'Manage Students',
      icon: IconUserPlus,
      href: '/admin/students',
    },
    {
      id: uniqueId(),
      title: 'Manage Exams',
      icon: IconCopy,
      href: '/admin/exams',
    },
    {
      id: uniqueId(),
      title: 'Cheating Logs',
      icon: IconAperture,
      href: '/admin/logs',
    },
    {
      id: uniqueId(),
      title: 'Results',
      icon: IconCopy,
      href: '/admin/results',
    },
  ];

  if (role === 'student') {
    return [...commonItems, ...studentItems];
  } else if (role === 'teacher') {
    return [...commonItems, ...teacherItems];
  } else if (role === 'admin') {
    return [...commonItems, ...adminItems];
  } else {
    return [...commonItems]; // Default minimal view if role not matched
  }
};

export default Menuitems;
