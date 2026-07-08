import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import InputBase from '@mui/material/InputBase';
import Footer from '@/components/Footer';
import Card from '@mui/material/Card';
import Image from 'next/image';
import Alert from '@mui/material/Alert';

import { useRouter } from 'next/router';

// --- Block Party auth surfaces (all values resolved from theme tokens) ---

// Top bar: cream slab with a chunky ink rule underneath, matching Navbar.
const appBarSx = (theme) => ({
  backgroundColor: theme.custom.cream,
  color: theme.palette.text.primary,
  borderBottom: theme.custom.surfaceBorder,
});

// The auth card reads as a sticker pinned to a corkboard: white surface,
// chunky ink border, hard offset shadow, and a hair of rotation.
const stickerCardSx = (theme) => ({
  position: 'relative',
  overflow: 'visible',
  width: 400,
  maxWidth: '92vw',
  padding: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  border: theme.custom.surfaceBorder,
  boxShadow: theme.custom.stickerShadow,
  transform: 'rotate(-0.75deg)',
  // The honey "pin" that tacks the sticker down. Decorative only.
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: theme.palette.warning.main,
    border: theme.custom.surfaceBorder,
  },
});

// Chunky bordered field. Focus is expressed with an accent border plus a
// hard offset ring so the indicator survives Windows high-contrast mode.
const fieldSx = (theme) => ({
  border: theme.custom.surfaceBorder,
  padding: 1,
  borderRadius: `${theme.shape.borderRadius}px`,
  width: '300px',
  maxWidth: '100%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  transition: theme.transitions.create(['box-shadow', 'border-color'], {
    duration: 150,
  }),
  '& input::placeholder': {
    color: theme.palette.text.secondary,
    opacity: 1,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.custom.stickerShadow,
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

// Validation copy: bold body text in the theme's error role (never a raw hex).
const errorTextSx = { fontWeight: 700, alignSelf: 'flex-start' };

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

const Login = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setSubmitError('');
      try {
        const response = await axios.post('/auth/login', values);
        if (response.status === 200) {
          router.push('/');
        }
      } catch (error) {
        setSubmitError(
          error.response?.data?.message ||
            'Login failed. Please check your username and password.'
        );
      }
    },
  });
  const handleBack = () => {
    router.push('/');
  };
  return (
    <>
      <Box>
        <AppBar position="static" elevation={0} sx={appBarSx}>
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
              component="h1"
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
              backgroundImage: 'url("/Assets/loginBackground.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5,
              zIndex: 0,
            },
            zIndex: 1,
          }}
        >
          <Card elevation={0} sx={stickerCardSx}>
            <Image
              src="/Assets/Logo1.png"
              style={{ alignSelf: 'start' }}
              width={80}
              height={80}
              alt="GatherHub logo"
            />

            <Typography
              sx={{ alignSelf: 'start', marginBottom: 2 }}
              variant="h4"
              component="h2"
            >
              Login Page
            </Typography>
            {submitError && (
              <Alert
                severity="error"
                sx={(theme) => ({
                  width: '100%',
                  borderRadius: `${theme.shape.borderRadius}px`,
                  border: theme.custom.surfaceBorder,
                })}
              >
                {submitError}
              </Alert>
            )}
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <InputBase
                  type="username"
                  name="username"
                  placeholder="Email or Username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  sx={fieldSx}
                />
                {formik.errors.username && (
                  <Typography color="error" role="alert" sx={errorTextSx}>
                    {formik.errors.username}
                  </Typography>
                )}
                <InputBase
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  sx={fieldSx}
                />
                {formik.errors.password && (
                  <Typography color="error" role="alert" sx={errorTextSx}>
                    {formik.errors.password}
                  </Typography>
                )}
                <GenericButton variant="primary" text="Login" type="submit" />
              </Box>
            </form>
          </Card>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default Login;
