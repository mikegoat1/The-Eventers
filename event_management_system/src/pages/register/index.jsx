import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import InputBase from '@mui/material/InputBase';
import Footer from '@/components/Footer';
import Card from '@mui/joy/Card';

import { useRouter } from 'next/router';
import Image from 'next/image';
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

  const [isUsernameValid, setIsUsernameValid] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      const username = formik.values.username;
      if (username && !formik.errors.username) {
        setIsUsernameValid(true);
      } else {
        setIsUsernameValid(false);
      }
    };
    checkUsername();
  }, [formik.values.username, formik.errors.username]);

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
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: 2,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/Assets/RegisterBackground.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              zIndex: 0,
            },
            zIndex: 1,
          }}
        >
          <Card
            sx={{
              width: 400,
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              backgroundColor: '#F5F3F3',
              borderRadius: 2,
            }}
          >
            <Image src="/Assets/Logo1.png" style={{alignSelf:"start"}} width={80} height={80} />
            <Typography sx={{ alignSelf: 'start' }} variant="h4">
              Welcome!
            </Typography>
            <Typography
              sx={{ alignSelf: 'start', marginBottom: '30%' }}
              variant="h4"
            >
              Whats your Email?
            </Typography>
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
                  <Typography color="error">
                    {formik.errors.username}
                  </Typography>
                )}
                {isUsernameValid && (
                  <>
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
                        '&:focus': {
                          border: '2px solid #616060',
                          backgroundColor: '#616060',
                        },
                      }}
                    />
                    {formik.errors.password && (
                      <Typography color="error">
                        {formik.errors.password}
                      </Typography>
                    )}
                  </>
                )}
                <Box sx={{ alignSelf: 'center' }}>
                  <GenericButton
                    variant="primary"
                    text="Register"
                    type="submit"
                  />
                </Box>
              </Box>
            </form>
          </Card>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Register;
