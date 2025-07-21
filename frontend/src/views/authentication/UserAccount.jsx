import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Box, 
  Card, 
  Typography, 
  Stack, 
  Avatar, 
  Button, 
  Divider, 
  Paper,
  Container,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import Loader from './Loader';
import AuthUpdate from './auth/AuthUpdate';
import ProfileAvatar from '../../components/shared/ProfileAvatar';

const userValidationSchema = yup.object({
  name: yup.string().matches(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces').min(2).max(50).required('Please enter your name'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
  role: yup.string().oneOf(['student', 'teacher'], 'Invalid role').required('Role is required'),
});

const UserAccount = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const initialUserValues = {
    name: userInfo.name || '',
    email: userInfo.email || '',
    password: '',
    confirm_password: '',
    role: userInfo.role || 'student',
  };

  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  const handleSubmit = async ({ name, email, password, confirm_password, role }) => {
    if (password && password !== confirm_password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const updateData = {
          _id: userInfo._id,
          name,
          email,
          role,
        };
        
        // Only include password if it's provided
        if (password) {
          updateData.password = password;
        }

        const res = await updateProfile(updateData).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile updated successfully');
        setIsEditing(false);
        // Reset password fields
        formik.setFieldValue('password', '');
        formik.setFieldValue('confirm_password', '');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const getRoleColor = (role) => {
    return role === 'teacher' ? 'primary' : 'secondary';
  };

  const getRoleIcon = (role) => {
    return role === 'teacher' ? <SchoolIcon /> : <PersonIcon />;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <PageContainer title="User Account" description="Manage your account settings and profile">
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Profile Overview Card */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <ProfileAvatar
                    size={120}
                    showUploadButton={true}
                    sx={{
                      mx: 'auto',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                </Box>
                
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {userInfo.name}
                </Typography>
                
                <Chip
                  icon={getRoleIcon(userInfo.role)}
                  label={userInfo.role?.charAt(0).toUpperCase() + userInfo.role?.slice(1)}
                  color={getRoleColor(userInfo.role)}
                  sx={{ mb: 2 }}
                />
                
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    p: 1,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <EmailIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {userInfo.email}
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip 
                      label="Active" 
                      color="success" 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Joined:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {new Date(userInfo.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Stack>
                
                {!isEditing && (
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    sx={{ 
                      mt: 3,
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
                        transform: 'translateY(-2px)',
                      },
                      borderRadius: 2,
                      py: 1.5,
                    }}
                    fullWidth
                  >
                    Edit Profile
                  </Button>
                )}
              </Card>
            </Grid>

            {/* Profile Details/Edit Form */}
            <Grid item xs={12} md={8}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {isEditing ? 'Edit Profile' : 'Profile Information'}
                  </Typography>
                  
                  {isEditing && (
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Cancel Changes">
                        <IconButton 
                          onClick={handleCancel} 
                          color="error"
                          sx={{
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save Changes">
                        <IconButton 
                          onClick={formik.handleSubmit} 
                          color="primary"
                          sx={{
                            '&:hover': {
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  )}
                </Stack>

                {isEditing ? (
                  <AuthUpdate
                    formik={formik}
                    onSubmit={handleSubmit}
                    title={null}
                  />
                ) : (
                  <Stack spacing={3}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6">Personal Information</Typography>
                      </Stack>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {userInfo.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Role
                          </Typography>
                          <Typography variant="body1" fontWeight="500">
                            {userInfo.role?.charAt(0).toUpperCase() + userInfo.role?.slice(1)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <EmailIcon color="primary" />
                        <Typography variant="h6">Contact Information</Typography>
                      </Stack>
                      
                      <Typography variant="body2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {userInfo.email}
                      </Typography>
                    </Paper>

                    <Paper elevation={0} sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <SecurityIcon color="primary" />
                        <Typography variant="h6">Security</Typography>
                      </Stack>
                      
                      <Typography variant="body2" color="text.secondary">
                        Password
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        ••••••••
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last updated: {new Date(userInfo.updatedAt || Date.now()).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  </Stack>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PageContainer>
  );
};
export default UserAccount;
