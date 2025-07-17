import React from 'react';
import { Avatar, IconButton, Box, CircularProgress, Tooltip } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
// import { useProfileImage } from '../hooks/useProfileImage';
import { useSelector } from 'react-redux';
import { useProfileImage } from '../../hooks/useProfileImage';


const ProfileAvatar = ({ 
  size = 48, 
  showUploadButton = false, 
  sx = {}, 
  onClick = null,
  className = '' 
}) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { profileImage, uploading, handleFileInputChange } = useProfileImage();

  const avatarSx = {
    width: size,
    height: size,
    cursor: showUploadButton || onClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    ...sx,
  };

  const handleAvatarClick = () => {
    if (onClick) {
      onClick();
    } else if (showUploadButton) {
      document.getElementById('profile-upload-input').click();
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={profileImage}
        alt={userInfo?.name || 'User'}
        sx={avatarSx}
        onClick={handleAvatarClick}
        className={className}
      >
        {!profileImage && (userInfo?.name?.charAt(0).toUpperCase() || 'U')}
      </Avatar>
      
      {uploading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
          }}
        >
          <CircularProgress size={size * 0.4} sx={{ color: 'white' }} />
        </Box>
      )}
      
      {showUploadButton && (
        <>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-upload-input"
            type="file"
            onChange={handleFileInputChange}
          />
          <Tooltip title="Change Profile Picture">
            <IconButton
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                bgcolor: 'primary.main',
                color: 'white',
                width: size * 0.3,
                height: size * 0.3,
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
              onClick={() => document.getElementById('profile-upload-input').click()}
            >
              <PhotoCameraIcon sx={{ fontSize: size * 0.15 }} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
};

export default ProfileAvatar;
