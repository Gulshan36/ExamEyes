// import React from 'react';
// import { Box, Typography, Card, CardContent } from '@mui/material';
// import ProfileAvatar from '../components/shared/ProfileAvatar';
// import { useSelector } from 'react-redux';

// // Example: User card component that can be used anywhere
// const UserCard = ({ showUploadButton = false }) => {
//   const { userInfo } = useSelector((state) => state.auth);

//   return (
//     <Card sx={{ maxWidth: 300, mx: 'auto' }}>
//       <CardContent sx={{ textAlign: 'center' }}>
//         <ProfileAvatar 
//           size={80} 
//           showUploadButton={showUploadButton}
//           sx={{ mb: 2 }}
//         />
//         <Typography variant="h6" gutterBottom>
//           {userInfo?.name}
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           {userInfo?.role}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// // Example: Header user info component
// const HeaderUserInfo = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//       <ProfileAvatar size={40} />
//       <Box>
//         <Typography variant="body1" fontWeight="bold">
//           {userInfo?.name}
//         </Typography>
//         <Typography variant="caption" color="text.secondary">
//           {userInfo?.email}
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// // Example: Sidebar user section
// const SidebarUserSection = () => {
//   const { userInfo } = useSelector((state) => state.auth);

//   return (
//     <Box sx={{ p: 2, textAlign: 'center', borderTop: '1px solid #eee' }}>
//       <ProfileAvatar 
//         size={60} 
//         showUploadButton={true}
//         sx={{ mb: 1 }}
//       />
//       <Typography variant="body2" fontWeight="bold">
//         {userInfo?.name}
//       </Typography>
//       <Typography variant="caption" color="text.secondary">
//         {userInfo?.role}
//       </Typography>
//     </Box>
//   );
// };

// export { UserCard, HeaderUserInfo, SidebarUserSection };
