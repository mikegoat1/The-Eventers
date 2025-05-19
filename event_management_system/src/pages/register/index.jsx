import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import InputBase from '@mui/material/InputBase';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Register = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/auth/register', values);
        console.log('Register Status:', response.status);
        if (response.status === 201) {
          console.log('Register successful:', response.data);
          router.push('/');
        }
      } catch (error) {
        console.error('Register failed:', error);
      }
    },
  });

  const handleBack = () => {
    router.push('/');
  };
  return (
    <>
      <Box>
        <AppBar
          position="static"
          sx={{ backgroundColor: '#F5F3F3', color: '#080808' }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: 1,
            }}
          >
            <GenericButton
              variant="secondary"
              text="Back"
              type="button"
              onClick={handleBack}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, textAlign: 'center', padding: 2 }}
            >
              GATHERHUB
            </Typography>
          </Box>
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
          <Typography variant="h4">Register Page</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InputBase
                type="username"
                name="username"
                placeholder="Email or Username"
                onChange={formik.handleChange}
                value={formik.values.username}
                sx={{
                  border: '2px solid #A1A0A0',
                  padding: 1,
                  borderRadius: 1,
                  width: '300px',
                  backgroundColor: '#F5F3F3',
                }}
              />
              {formik.errors.username && (
                <Typography color="error">{formik.errors.username}</Typography>
              )}
              <InputBase
                type="password"
                name="password"
                placeholder="Password"
                onChange={formik.handleChange}
                value={formik.values.password}
                sx={{
                  border: '2px solid #A1A0A0',
                  padding: 1,
                  borderRadius: 1,
                  width: '300px',
                  backgroundColor: '#F5F3F3',
                  '&focus': {
                    border: '2px solid #616060',
                    backgroundColor: '#616060',
                  },
                }}
              />
              {formik.errors.password && (
                <Typography color="error">{formik.errors.password}</Typography>
              )}
              <GenericButton variant="primary" text="Register" type="submit" />
            </Box>
          </form>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Register;
