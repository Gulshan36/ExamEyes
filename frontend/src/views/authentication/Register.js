import React, { useEffect, useState } from "react";
import { Grid, Box, Card, Typography, Stack, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PageContainer from "src/components/container/PageContainer";
import Logo from "src/layouts/full/shared/logo/Logo";
import AuthRegister from "./auth/AuthRegister";
import { useFormik } from "formik";
import * as yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "./../../slices/usersApiSlice";
import { setCredentials } from "./../../slices/authSlice";
import Loader from "./Loader";

const userValidationSchema = yup.object({
  name: yup.string().min(2).max(25).required("Please enter your name"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Password must match"),
  role: yup
    .string()
    .oneOf(["student", "teacher"], "Invalid role")
    .required("Role is required"),
});
const initialUserValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "student",
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
      navigate("/");
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const handleSubmit = async ({
    name,
    email,
    password,
    confirm_password,
    role,
  }) => {
    if (password !== confirm_password) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ name, email, password, role }).unwrap();
        dispatch(setCredentials({ ...res }));
        formik.resetForm();

        navigate("/auth/login");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <PageContainer title="Register" description="This is the Register page">
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          background:
            "linear-gradient(to right, rgb(31, 24, 131), rgb(87, 34, 37))",
        }}
      >
        <Grid container spacing={0} alignItems="center" sx={{ height: "100%" }}>
          <Grid item xs={12}>
            <Card
              elevation={9}
              sx={{
                p: 0,
                zIndex: 7,
                width: "100%",
                maxWidth: "900px",
                mx: "300px",
                borderRadius: 10,
                textAlign: "left",
                background: "linear-gradient(120deg, #fff 70%, #ed93c7 100%)",
                border: "2px solid #c52d84",
                boxShadow: "0 8px 32px 0 rgba(197,45,132,0.18)",
                overflow: "visible",
              }}
            >
              <Grid
                container
                spacing={0}
                alignItems="stretch"
                sx={{ minHeight: 400 }}
              >
                {/* Left Side - Form */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    px: 4,
                    py: 4,
                    background: "linear-gradient(135deg, #fff 60%, #41bcba 100%)",
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    boxShadow: "2px 0 16px 0 #41bcba22",
                  }}
                >
                  {/* Logo + Title */}
                  <Box mb={2} textAlign="center">
                    <Box
                      sx={{
                        width: 70,
                        height: 50,
                        mx: "auto",
                        mb: 0,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #c52d84 0%, #ed93c7 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px #c52d8455",
                      }}
                    >
                      <img
                        src="/logo.png"
                        alt="Exam Eye Logo"
                        style={{
                          width: "80%",
                          height: "80%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="#c52d84"
                      textAlign="center"
                      sx={{ textShadow: "1px 1px 8px #ed93c7" }}
                    >
                      Exam Eye
                    </Typography>
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
                        mb={0}
                      >
                        CONDUCT SECURE ONLINE EXAMS NOW
                      </Typography>
                    }
                    subtitle={
                      <Stack
                        direction="row"
                        justifyContent="center"
                        spacing={1}
                        mt={2}
                        alignItems="center"
                      >
                        <Typography color="textSecondary" variant="body2">
                          Already have an Account?
                        </Typography>
                        <Typography
                          component={Link}
                          to="/auth/login"
                          fontWeight={500}
                          sx={{ textDecoration: "none", color: "primary.main" }}
                        >
                          Sign In
                        </Typography>
                        {isLoading && (
                          <CircularProgress size={20} sx={{ ml: 1 }} />
                        )}
                      </Stack>
                    }
                  />
                </Grid>

                {/* Divider between form and image */}
                <Grid
                  item
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "80%",
                      width: "3px",
                      background: "linear-gradient(180deg, #c52d84 0%, #41bcba 100%)",
                      mx: 2,
                      borderRadius: 2,
                    }}
                  />
                </Grid>

                {/* Right Side - Image + Text inside Card */}
                <Grid
                  item
                  xs={12}
                  md={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: 4,
                    py: 4,
                    background: "linear-gradient(135deg, #159fc1 0%, #ed93c7 50%)",
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    boxShadow: "-2px 0 16px 0 #ed93c722",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: 180, md: 260 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <img
                      src="/register.png"
                      alt="Exam Illustration"
                      style={{
                        width: "100%",
                        height: "110%",
                        objectFit: "contain",
                        borderRadius: 20,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                        background: "#fff",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    color="#fff"
                    sx={{
                      fontWeight: 700,
                      textShadow: "1px 1px 8px #159fc1, 0 0 2px #41bcba",
                      letterSpacing: 1,
                    }}
                  >
                    Secure Online Exams & AI Proctoring
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Register;

