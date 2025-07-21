import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './../../../slices/authSlice';
import { useLogoutMutation } from './../../../slices/usersApiSlice';
import { useProfileImage } from '../../../hooks/useProfileImage';
import ProfileAvatar from '../../../components/shared/ProfileAvatar';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { profileImage, uploading, handleFileInputChange } = useProfileImage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleClick2 = (event) => setAnchorEl2(event.currentTarget);
  const handleClose2 = () => setAnchorEl2(null);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="profile menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{ color: anchorEl2 ? 'primary.main' : 'inherit' }}
        onClick={handleClick2}
      >
        <ProfileAvatar
          size={48}
          sx={{ cursor: 'pointer' }}
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '220px',
            borderRadius: 3,
            background: 'linear-gradient(120deg, #fff 80%, #ed93c7 50%)',
            boxShadow: '0 4px 16px 0 #41bcba22',
            border: '2px solid #41bcba',
            mt: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 2, textAlign: 'center', borderBottom: '1px solid #f3e8f7' }}>
          <ProfileAvatar
            size={90}
            showUploadButton={true}
            sx={{
              mx: 'auto',
              mb: 1,
              border: '2px solid #159fc1',
              boxShadow: '0 2px 8px #41bcba33',
              '&:hover': { boxShadow: '0 0 0 4px #ed93c755' },
            }}
          />

          {uploading && (
            <Box sx={{ mt: 1, mb: 1 }}>
              <CircularProgress size={22} />
            </Box>
          )}

          <Typography sx={{ fontWeight: 700, color: '#159fc1', fontSize: 16, mt: 1 }}>
            {userInfo?.name}
          </Typography>
          <Typography sx={{ color: '#888', fontSize: 13 }}>
            {userInfo?.email}
          </Typography>
          <Typography
            sx={{
              color: '#c52d84',
              fontSize: 12,
              mt: 1,
              cursor: 'pointer',
              textDecoration: 'underline',
              '&:hover': { color: '#159fc1' },
            }}
            onClick={() => document.getElementById('profile-upload-input').click()}
          >
            Change Profile Image
          </Typography>
        </Box>

        <MenuItem component={Link} to="/user/profile" sx={{ mt: 1, borderRadius: 2, '&:hover': { background: '#d1d1d2' } }}>
          <ListItemIcon>
            <IconUser width={20} color="#159fc1" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, color: '#159fc1' }}>My Profile</ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/user/account" sx={{ borderRadius: 2, '&:hover': { background: '#d1d1d2' } }}>
          <ListItemIcon>
            <IconMail width={20} color="#c52d84" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, color: '#c52d84' }}>My Account</ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/user/tasks" sx={{ borderRadius: 2, '&:hover': { background: '#d1d1d2' } }}>
          <ListItemIcon>
            <IconListCheck width={20} color="#41bcba" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500, color: '#41bcba' }}>My Tasks</ListItemText>
        </MenuItem>

        <Box mt={2} py={1} px={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={logoutHandler}
            fullWidth
            sx={{
              background: '#159fc1',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 2px 8px #41bcba33',
              '&:hover': { background: '#0d7ea8' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
