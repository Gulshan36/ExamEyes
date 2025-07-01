import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Card, Avatar, Grid } from '@mui/material';

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Box p={4}>
      <Card sx={{ maxWidth: 600, mx: 'auto', p: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Avatar
              src={userInfo?.profilePic || '/avatar.png'}
              alt={userInfo?.name}
              sx={{ width: 100, height: 100, mx: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5">{userInfo?.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {userInfo?.email}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Role: {userInfo?.role}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default UserProfile;
