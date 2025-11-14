import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '../../lib/axios';
import Link from 'next/link';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Education',
  'Health',
  'Technology',
  'Other',
];

const validationSchema = yup.object({
  name: yup.string().required('Event name is required'),
  date: yup
    .date()
    .typeError('Please provide a valid date')
    .required('Date is required'),
  location: yup
    .string()
    .min(3, 'Location must be at least 3 characters')
    .required('Location is required'),
  description: yup
    .string()
    .max(600, 'Description can be up to 600 characters')
    .nullable(),
  category: yup
    .string()
    .oneOf(EVENT_CATEGORIES, 'Select a valid category')
    .required('Category is required'),
});

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return { props: { user: null } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user: { id: decoded.userId } } };
  } catch {
    return { props: { user: null } };
  }
}

const formatEventDate = (value) => {
  if (!value) return 'Date not available';
  try {
    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch (error) {
    return 'Date not available';
  }
};

const EventsManager = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [formStatus, setFormStatus] = useState(null);

  const refreshEvents = useCallback(async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get('/events');
      setEvents(response.data);
      setFetchError('');
    } catch (error) {
      console.error('Failed to load events:', error);
      setFetchError(
        error.response?.data?.message ||
          'Unable to load events. Please try again later.'
      );
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const displayedEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        event.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  const formik = useFormik({
    initialValues: {
      name: '',
      date: '',
      location: '',
      description: '',
      category: '',
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      setFormStatus(null);
      try {
        await axios.post('/events', {
          ...values,
          attendees: [],
        });
        setFormStatus({
          type: 'success',
          message: `"${values.name}" has been added to the schedule.`,
        });
        helpers.resetForm();
        await refreshEvents();
      } catch (error) {
        console.error('Failed to create event:', error);
        setFormStatus({
          type: 'error',
          message:
            error.response?.data?.message ||
            'Unable to create event. Please try again.',
        });
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <>
      <Navbar title="GATHERHUB" user={user} />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #FDF6ED, #ECE7E1, #B1A79E)',
          py: 6,
          px: { xs: 2, md: 6 },
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Typography variant="h3" fontWeight="600" textAlign="center">
            Event Management Hub
          </Typography>
          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ color: '#4E4E4E', mt: 1 }}
          >
            Browse your events, review attendance, and publish new
            experiences in one place.
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <Button component={Link} href="/events/calendar" variant="outlined">
              Open calendar view
            </Button>
          </Stack>

          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 2, backgroundColor: '#FFFBF5' }}>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <TextField
                    label="Search by name or description"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    fullWidth
                  />
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="category-filter-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="category-filter-label"
                      label="Category"
                      value={selectedCategory}
                      onChange={(event) =>
                        setSelectedCategory(event.target.value)
                      }
                    >
                      <MenuItem value="All">All Categories</MenuItem>
                      {EVENT_CATEGORIES.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
                {loadingEvents ? (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      py: 6,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : fetchError ? (
                  <Alert severity="error">{fetchError}</Alert>
                ) : displayedEvents.length === 0 ? (
                  <Alert severity="info">
                    No events match your filters yet. Try adjusting the filters
                    or add a new event.
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {displayedEvents.map((event) => {
                      const attendeeCount = Array.isArray(
                        event.attendees
                      )
                        ? event.attendees.length
                        : 0;
                      const attendeePreview =
                        Array.isArray(event.attendees) &&
                        event.attendees.length > 0
                          ? event.attendees
                              .slice(0, 3)
                              .map((attendee) =>
                                typeof attendee === 'object' &&
                                attendee.username
                                  ? attendee.username
                                  : String(attendee).slice(0, 6)
                              )
                              .join(', ')
                          : 'No attendees yet';
                      return (
                        <Card
                          key={event._id || event.name}
                          sx={{ backgroundColor: '#FFF' }}
                        >
                          <CardContent>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              flexWrap="wrap"
                              gap={1}
                              mb={1}
                            >
                              <Typography variant="h6">
                                {event.name}
                              </Typography>
                              <Chip
                                label={event.category || 'Uncategorized'}
                                color="warning"
                                size="small"
                              />
                            </Stack>

                            <Typography variant="body2">
                              {formatEventDate(event.date)}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                              Location: {event.location || 'Unknown'}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, color: '#4E4E4E' }}
                            >
                              {event.description ||
                                'No description was provided for this event.'}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={1}
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              justifyContent="space-between"
                            >
                              <Typography variant="body2" fontWeight={600}>
                                Attendees ({attendeeCount})
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#6A6A6A' }}
                              >
                                {attendeePreview}
                                {Array.isArray(event.attendees) &&
                                  event.attendees.length > 3 &&
                                  ` +${event.attendees.length - 3} more`}
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, backgroundColor: '#FFF8E6' }}>
                <Typography variant="h6" mb={1}>
                  Create a New Event
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#6A6A6A' }}>
                  Use the form below to publish an event complete with
                  category tags and attendee tracking.
                </Typography>

                {formStatus && (
                  <Alert
                    severity={formStatus.type}
                    sx={{ mb: 2 }}
                    onClose={() => setFormStatus(null)}
                  >
                    {formStatus.message}
                  </Alert>
                )}

                <form onSubmit={formik.handleSubmit} noValidate>
                  <Stack spacing={2}>
                    <TextField
                      name="name"
                      label="Event name"
                      placeholder="Community Meetup"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.name && Boolean(formik.errors.name)
                      }
                      helperText={
                        formik.touched.name && formik.errors.name
                      }
                      fullWidth
                    />
                    <TextField
                      name="date"
                      label="Date & time"
                      type="datetime-local"
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.date && Boolean(formik.errors.date)
                      }
                      helperText={
                        formik.touched.date && formik.errors.date
                      }
                      fullWidth
                    />
                    <TextField
                      name="location"
                      label="Location"
                      placeholder="123 Main St, City"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.location &&
                        Boolean(formik.errors.location)
                      }
                      helperText={
                        formik.touched.location &&
                        formik.errors.location
                      }
                      fullWidth
                    />
                    <FormControl
                      fullWidth
                      error={
                        formik.touched.category &&
                        Boolean(formik.errors.category)
                      }
                    >
                      <InputLabel id="event-category-label">
                        Category
                      </InputLabel>
                      <Select
                        labelId="event-category-label"
                        name="category"
                        label="Category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        {EVENT_CATEGORIES.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.category &&
                        formik.errors.category && (
                          <FormHelperText>
                            {formik.errors.category}
                          </FormHelperText>
                        )}
                    </FormControl>
                    <TextField
                      name="description"
                      label="Description"
                      placeholder="Share details about the event..."
                      multiline
                      minRows={4}
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.description &&
                        Boolean(formik.errors.description)
                      }
                      helperText={
                        formik.touched.description &&
                        formik.errors.description
                      }
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Saving...' : 'Publish event'}
                    </Button>
                  </Stack>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default EventsManager;
