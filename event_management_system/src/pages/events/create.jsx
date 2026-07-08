import React, { useState } from 'react';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import {
  Alert,
  Box,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GenericButton from '@/components/GenericButton';
import axios from '../../lib/axios';

// Mirrors the `category` enum on the Event model and createEventValidator.
const CATEGORIES = [
  'Music',
  'Sports',
  'Education',
  'Health',
  'Technology',
  'Other',
];

const DESCRIPTION_MAX = 600;

// Block Party page wash: cream -> peach, matching the CssBaseline body
// background so the page never seams against the viewport edges.
const pageSx = (theme) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: theme.custom.peachGradient,
});

// The form reads as a note pinned to a corkboard: white surface, chunky ink
// border, hard offset shadow — the same sticker language as the auth cards.
const stickerSurfaceSx = (theme) => ({
  position: 'relative',
  overflow: 'visible',
  mt: 6,
  mb: 6,
  p: { xs: 2.5, sm: 4 },
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  border: theme.custom.surfaceBorder,
  boxShadow: theme.custom.stickerShadow,
});

// The honey "tab" tacked to the top edge, matching MissionStatement.
const tabSx = (theme) => ({
  position: 'absolute',
  top: -14,
  left: 24,
  px: 1.5,
  py: 0.25,
  fontWeight: 800,
  fontSize: '0.75rem',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.warning.main,
  border: theme.custom.surfaceBorder,
  borderRadius: `${theme.shape.borderRadius / 2}px`,
});

// Chunky bordered field. Focus is expressed with an accent border plus a hard
// offset ring so the indicator survives Windows high-contrast mode.
const fieldSx = (theme) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: `${theme.shape.borderRadius}px`,
    transition: theme.transitions.create(['box-shadow'], { duration: 150 }),
    '& fieldset': {
      border: theme.custom.surfaceBorder,
    },
    '&:hover fieldset': {
      border: theme.custom.surfaceBorder,
    },
    '&.Mui-focused': {
      boxShadow: theme.custom.stickerShadow,
    },
    '&.Mui-focused fieldset': {
      border: theme.custom.surfaceBorder,
      borderColor: theme.palette.primary.main,
    },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& .MuiOutlinedInput-root': { transition: 'none' },
  },
});

// Kept in lockstep with src/lib/validators/eventValidators.js so the client
// never accepts a payload the API will reject.
const validationSchema = yup.object({
  name: yup.string().trim().required('Event name is required'),
  date: yup.string().required('Event date is required'),
  location: yup
    .string()
    .trim()
    .min(3, 'Location must be at least 3 characters')
    .required('Location is required'),
  category: yup
    .string()
    .oneOf(CATEGORIES, 'Invalid category provided')
    .required('Category is required'),
  description: yup
    .string()
    .max(
      DESCRIPTION_MAX,
      `Description can be up to ${DESCRIPTION_MAX} characters`
    ),
});

const CreateEvent = ({ user }) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      date: '',
      location: '',
      category: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      setSubmitError('');

      // <input type="datetime-local"> yields "YYYY-MM-DDTHH:mm"; the API's
      // createEventValidator requires ISO 8601.
      const parsedDate = new Date(values.date);
      if (Number.isNaN(parsedDate.getTime())) {
        setFieldError('date', 'Event date must be a valid date');
        return;
      }

      const payload = {
        name: values.name.trim(),
        date: parsedDate.toISOString(),
        location: values.location.trim(),
        category: values.category,
      };
      const description = values.description.trim();
      if (description) payload.description = description;

      try {
        await axios.post('/events', payload);
        router.push('/events');
      } catch (error) {
        // express-validator replies 400 { errors: [{ path, msg }] }. Route each
        // field error back to its input rather than dumping one opaque banner.
        const fieldErrors = error.response?.data?.errors;
        if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
          let matched = false;
          fieldErrors.forEach(({ path, msg }) => {
            if (path && path in values) {
              setFieldError(path, msg);
              matched = true;
            }
          });
          if (matched) return;
        }
        setSubmitError(
          error.response?.data?.message ||
            'Could not create the event. Please try again.'
        );
      }
    },
  });

  const descriptionLength = formik.values.description.length;

  return (
    <Box sx={pageSx}>
      <Navbar title="GATHERHUB" user={user} />

      <Container maxWidth="sm" sx={{ flexGrow: 1 }} component="main">
        <Box sx={stickerSurfaceSx}>
          <Typography component="span" sx={tabSx}>
            Host an event
          </Typography>

          <Typography variant="h4" component="h1" sx={{ mt: 1, mb: 0.5 }}>
            Put it on the board
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tell people what you&apos;re gathering for. You can edit the details
            later.
          </Typography>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Event name"
                placeholder="Saturday Farmers' Market"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={fieldSx}
              />

              <TextField
                fullWidth
                id="date"
                name="date"
                label="Date and time"
                type="datetime-local"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.date && Boolean(formik.errors.date)}
                helperText={formik.touched.date && formik.errors.date}
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                placeholder="Corner of 5th & Elm"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
                sx={fieldSx}
              />

              <FormControl
                fullWidth
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                sx={fieldSx}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  label="Category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <FormHelperText>{formik.errors.category}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                multiline
                minRows={4}
                id="description"
                name="description"
                label="Description (optional)"
                placeholder="What should people expect? Anything to bring?"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  (formik.touched.description && formik.errors.description) ||
                  `${descriptionLength}/${DESCRIPTION_MAX}`
                }
                sx={fieldSx}
              />

              <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                <GenericButton
                  text={formik.isSubmitting ? 'Creating…' : 'Create event'}
                  type="submit"
                  size="large"
                  disabled={formik.isSubmitting}
                />
                <GenericButton
                  text="Cancel"
                  variant="secondary"
                  size="large"
                  onClick={() => router.push('/events')}
                  disabled={formik.isSubmitting}
                />
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

CreateEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
  }),
};

// Creating an event requires auth (the API route sits behind authMiddleware),
// so send signed-out visitors to the login page rather than letting them fill
// in a form that can only 401.
export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user: { id: decoded.userId } } };
  } catch {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }
}

export default CreateEvent;
