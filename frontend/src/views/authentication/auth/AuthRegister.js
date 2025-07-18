import React from "react";
import { Box, Typography, Button, Select, MenuItem } from "@mui/material";

import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import { Stack } from "@mui/system";
import { MoveLeft } from "lucide-react";

const AuthRegister = ({ formik, title, subtitle, subtext }) => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    formik;
  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack mb={2}>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="name"
            mb="5px"
          >
            Name
          </Typography>
          <CustomTextField
            id="name"
            name="name"
            placeholder="Enter Your Name "
            variant="outlined"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name && errors.name ? true : false}
            helperText={touched.name && errors.name ? errors.name : null}
            fullWidth
            required
            size="medium"
            
          />
        </Box>

        <Box mt="13px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
            mt="10px"
          >
            Email Address
          </Typography>
          <CustomTextField
            id="email"
            name="email"
            variant="outlined"
            placeholder="Enter Your Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && errors.email ? true : false}
            helperText={touched.email && errors.email ? errors.email : null}
            required
            fullWidth
            size="medium"
            
          />
        </Box>

        <Box mt="13px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
            mt="10px"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            placeholder="Enter password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password ? true : false}
            helperText={
              touched.password && errors.password ? errors.password : null
            }
            required
            fullWidth
            size="medium"
            
          />
        </Box>

        <Box mt="13px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="confirm_password"
            mb="5px"
            mt="10px"
          >
            Confirm Password
          </Typography>
          <CustomTextField
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="false"
            variant="outlined"
            placeholder="Confirm your Password"
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.confirm_password && errors.confirm_password ? true : false
            }
            helperText={
              touched.confirm_password && errors.confirm_password
                ? errors.confirm_password
                : null
            }
            fullWidth
            required
            size="medium"
            
          />
        </Box>

        <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="role"
            mb="5px"
            mt="10px"
          >
            Role
          </Typography>
          <Select
            id="role"
            name="role"
            required
            displayEmpty
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!(touched.role && errors.role)}              
            size="medium"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </Select>
      </Stack>

      <Box>
        <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
      </Box>
      {subtitle}
    </>
  );
};
export default AuthRegister;
