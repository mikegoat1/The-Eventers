import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import InputBase from '@mui/material/InputBase';


const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});



const Login = () => {
    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        try {
          const response = await axios.post('/login', values);
          console.log('Login successful:', response.data);
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    });
  return (
    <>
      <Box>
        <AppBar
          position="static"
          sx={{ backgroundColor: '#F5F3F3', color: '#080808' }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: 'center', padding: 2 }}
          >
            GATHERHUB
          </Typography>
        </AppBar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h4">Login Page</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InputBase
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && (
                <Typography color="error">{formik.errors.email}</Typography>
              )}
              <InputBase
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.errors.password && (
                <Typography color="error">{formik.errors.password}</Typography>
              )}
              <GenericButton variant="primary" text="Login"/>
            </Box>
            </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
