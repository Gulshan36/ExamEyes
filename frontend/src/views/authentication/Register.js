import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import Logo from 'src/layouts/full/shared/logo/Logo';
import AuthRegister from './auth/AuthRegister';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from './../../slices/usersApiSlice';
import { setCredentials } from './../../slices/authSlice';
import Loader from './Loader';

const userValidationSchema = yup.object({
  name: yup.string().min(2).max(25).required('Please enter your name'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password must match'),
  role: yup.string().oneOf(['student', 'teacher'], 'Invalid role').required('Role is required'),
});
const initialUserValues = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'student',
};

const Register = () => {
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const handleSubmit = async ({ name, email, password, confirm_password, role }) => {
    if (password !== confirm_password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password, role }).unwrap();
        dispatch(setCredentials({ ...res }));
        formik.resetForm();

        navigate('/auth/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

 return (
  <PageContainer title="Register" description="This is the Register page">
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #0f97b7, #1794bc)', // Blue background like image
      }}
    >
      <Grid
        container
        spacing={0}
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Grid item xs={12} sm={12} lg={6} xl={4}>
          <Card
            elevation={9}
            sx={{
              p: 4,
              zIndex: 1,
              width: '100%',
              maxWidth: '500px',
              mx: 'auto',
              position: 'relative',
              borderRadius: 3,
              textAlign: 'left',
              backgroundColor: '#e1f0f9', // Light form background to match image
            }}
          >
            {/* Logo placeholder + Title */}
            <Box mb={2}>
              {/* Logo box */}
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#ccc',
                  borderRadius: 2,
                  mx: 'auto',
                  mb: 1,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="primary"
                textAlign="center"
                sx={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
              >
                Exam Eye
              </Typography>
            </Box>


<Box display="flex" justifyContent="center" mb={1}>
  <img src="/path-to-logo.png" alt="Exam Eye Logo" width={60} height={60} />
</Box>


            {/* Registration Form */}
            <AuthRegister
              formik={formik}
              onSubmit={handleSubmit}
              subtext={
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={2}
                >
                  CONDUCT SECURE ONLINE EXAMS NOW
                </Typography>
              }
              subtitle={
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                  alignItems="center"
                >
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/auth/login"
                    fontWeight={500}
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Sign In
                  </Typography>
                  {isLoading && <CircularProgress size={20} sx={{ ml: 2 }} />}
                </Stack>
              }
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  </PageContainer>
);
};
export default Register;
