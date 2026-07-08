import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import GenericCard from '@/components/GenericCard';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

// Block Party sticker surface: white fill, chunky ink border, hard offset shadow.
const stickerSurface = (theme) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  border: theme.custom.surfaceBorder,
  boxShadow: theme.custom.stickerShadow,
});

// Pill-shaped action that matches GenericButton's sticker language.
const stickerPillButton = (theme) => ({
  borderRadius: '999px',
  border: theme.custom.surfaceBorder,
  boxShadow: `3px 3px 0 ${theme.custom.surfaceBorderColor}`,
  backgroundColor: theme.custom.cream,
  color: theme.palette.text.primary,
  fontWeight: 700,
  px: 2.5,
  transition: theme.transitions.create(['transform', 'box-shadow'], {
    duration: 180,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),
  '&:hover': {
    backgroundColor: alpha(theme.palette.warning.main, 0.25),
    border: theme.custom.surfaceBorder,
    transform: 'translate(-1px, -2px)',
    boxShadow: `5px 6px 0 ${theme.custom.surfaceBorderColor}`,
  },
  '&:active': {
    transform: 'translate(2px, 2px)',
    boxShadow: `1px 1px 0 ${theme.custom.surfaceBorderColor}`,
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
    '&:hover': { transform: 'none' },
    '&:active': { transform: 'none' },
  },
});

const EVENT_CATEGORIES = [
  'Music',
  'Sports',
  'Education',
  'Health',
  'Technology',
  'Other',
];

const getDocumentId = (value) => {
  if (!value) return null;
  if (typeof value === 'object') {
    return value._id || value.id || null;
  }
  return value;
};

const hasUserAttendee = (attendees = [], userId) => {
  return attendees.some(
    (attendee) => getDocumentId(attendee)?.toString() === userId
  );
};

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const getEditFormValues = (event) => {
  return {
    name: event?.name || '',
    date: toDateTimeLocal(event?.date),
    location: event?.location || '',
    category: event?.category || 'Other',
    description: event?.description || '',
  };
};

const formatMessageDate = (value) =>
  new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;

  try {
    if (!token) {
      return { props: { user: null } };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { props: { user: { id: decoded.userId } } };
  } catch (error) {
    console.error('Failed to verify token:', error);
    return { props: { user: null } };
  }
}

const SingleEvent = ({ user }) => {
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [isAttending, setIsAttending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(getEditFormValues(null));
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageDraft, setMessageDraft] = useState('');
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [messageError, setMessageError] = useState('');
  const isOrganizer =
    event && user && getDocumentId(event.organizer)?.toString() === user.id;

  const fetchMessages = useCallback(async () => {
    if (!router.isReady || !router.query.id) return;

    try {
      const response = await axios.get(`/events/${router.query.id}/messages`);
      setMessages(response.data.messages || []);
      setMessageError('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessageError('Unable to load event chat.');
    }
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!router.isReady) return;
      try {
        const res = await axios.get(`/events/${router.query.id}`);
        setEvent(res.data);
        setEditForm(getEditFormValues(res.data));
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (event && user) {
      setIsAttending(hasUserAttendee(event.attendees, user.id));
    }
  }, [event, user]);

  useEffect(() => {
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 15000);
    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  const handleBack = () => {
    router.push('/');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleRSVP = async () => {
    if (!user || !user.id) {
      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          Please log in to RSVP for events.
        </Alert>
      );
      setSnackbarOpen(true);

      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    try {
      const newStatus = isAttending ? 'not attending' : 'attending';

      await axios.post('/rsvp', {
        eventId: event._id,
        status: newStatus,
      });

      const res = await axios.get(`/events/${event._id}`);
      setEvent(res.data);
      setIsAttending(hasUserAttendee(res.data.attendees, user.id));

      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity={newStatus === 'attending' ? 'success' : 'warning'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {newStatus === 'attending' ? 'RSVP Successful' : 'RSVP removed'}
        </Alert>
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error RSVPing:', error);
      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Failed to RSVP. Please try again later.
        </Alert>
      );
      setSnackbarOpen(true);
    }
  };

  const handleEditChange = (field) => (changeEvent) => {
    setEditForm((current) => ({
      ...current,
      [field]: changeEvent.target.value,
    }));
  };

  const handleEditSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    if (!event) return;

    try {
      setActionLoading(true);
      await axios.put(`/events/${event._id}`, {
        ...editForm,
        date: new Date(editForm.date).toISOString(),
      });
      const res = await axios.get(`/events/${event._id}`);
      setEvent(res.data);
      setEditForm(getEditFormValues(res.data));
      setIsEditing(false);
      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Event updated.
        </Alert>
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating event:', error);
      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Failed to update event.
        </Alert>
      );
      setSnackbarOpen(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event || !window.confirm('Delete this event?')) return;

    try {
      setActionLoading(true);
      await axios.delete(`/events/${event._id}`);
      router.push('/events');
    } catch (error) {
      console.error('Error deleting event:', error);
      setSnackbarContent(
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Failed to delete event.
        </Alert>
      );
      setSnackbarOpen(true);
      setActionLoading(false);
    }
  };

  const handleMessageSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    const trimmedMessage = messageDraft.trim();

    if (!event || !trimmedMessage) return;

    if (!user) {
      setSnackbarContent(
        // Standard (not filled) variant: `info` is the one severity the theme
        // does not override, so a filled info Alert renders white on MUI's
        // default blue at 3.86:1 and fails WCAG AA. Standard is tinted + dark.
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: '100%' }}
        >
          Please log in to join the event chat.
        </Alert>
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      setMessageSubmitting(true);
      const response = await axios.post(`/events/${event._id}/messages`, {
        body: trimmedMessage,
      });
      setMessages((currentMessages) => [
        ...currentMessages,
        response.data.message,
      ]);
      setMessageDraft('');
      setMessageError('');
    } catch (error) {
      console.error('Error posting message:', error);
      setMessageError(
        error.response?.data?.message || 'Unable to post your message.'
      );
    } finally {
      setMessageSubmitting(false);
    }
  };

  return (
    <>
      <Box>
        <AppBar
          position="static"
          elevation={0}
          sx={(theme) => ({
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            backgroundImage: 'none',
            borderBottom: theme.custom.surfaceBorder,
            boxShadow: 'none',
          })}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                margin: '0 auto',
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{ flexGrow: 1, textAlign: 'center', padding: 1 }}
              >
                GATHERHUB
              </Typography>
              <Image
                src="/Assets/Logo1.png"
                width={25}
                height={25}
                alt="GatherHub logo"
              />
            </Box>
          </Box>
        </AppBar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            flexDirection: 'column',
            gap: 2,
            py: 4,
            px: 2,
          }}
        >
          <Typography variant="h4">
            {event?.name ? 'Event Details' : 'Loading event...'}
          </Typography>
          {event && (
            <GenericCard
              name={event.name}
              date={event.date}
              description={event.description}
              category={event.category}
              location={event.location}
              attendees={event.attendees}
              onButtonClick={handleRSVP}
              buttonText={isAttending ? 'Cancel RSVP' : 'RSVP'}
            />
          )}
          {event && isOrganizer && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setIsEditing((current) => !current)}
                disabled={actionLoading}
                sx={stickerPillButton}
              >
                {isEditing ? 'Cancel edit' : 'Edit event'}
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={handleDeleteEvent}
                disabled={actionLoading}
                sx={(theme) => ({
                  ...stickerPillButton(theme),
                  color: theme.palette.error.dark,
                  backgroundColor: theme.palette.background.paper,
                  '&:hover': {
                    ...stickerPillButton(theme)['&:hover'],
                    backgroundColor: alpha(theme.palette.error.main, 0.12),
                  },
                })}
              >
                Delete event
              </Button>
            </Stack>
          )}
          {event && isOrganizer && isEditing && (
            <Box
              component="form"
              onSubmit={handleEditSubmit}
              sx={(theme) => ({
                width: '100%',
                maxWidth: 640,
                display: 'grid',
                gap: 2,
                p: 3,
                ...stickerSurface(theme),
              })}
            >
              <TextField
                label="Event name"
                value={editForm.name}
                onChange={handleEditChange('name')}
                required
                fullWidth
              />
              <TextField
                label="Date & time"
                type="datetime-local"
                value={editForm.date}
                onChange={handleEditChange('date')}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                label="Location"
                value={editForm.location}
                onChange={handleEditChange('location')}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel id="event-edit-category-label">Category</InputLabel>
                <Select
                  labelId="event-edit-category-label"
                  label="Category"
                  value={editForm.category}
                  onChange={handleEditChange('category')}
                >
                  {EVENT_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Description"
                value={editForm.description}
                onChange={handleEditChange('description')}
                multiline
                minRows={4}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                disabled={actionLoading}
                sx={(theme) => ({
                  ...stickerPillButton(theme),
                  justifySelf: 'start',
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    ...stickerPillButton(theme)['&:hover'],
                    backgroundColor: theme.palette.primary.main,
                  },
                })}
              >
                {actionLoading ? 'Saving...' : 'Save changes'}
              </Button>
            </Box>
          )}
          {event && (
            <Box
              sx={(theme) => ({
                width: '100%',
                maxWidth: 640,
                p: 3,
                ...stickerSurface(theme),
              })}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h5" component="h2">
                  Event Chat
                </Typography>
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    flexShrink: 0,
                    px: 1.25,
                    py: 0.25,
                    borderRadius: '999px',
                    backgroundColor: theme.palette.warning.main,
                    border: theme.custom.surfaceBorder,
                    boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
                    color: theme.palette.warning.contrastText,
                    fontWeight: 800,
                  })}
                >
                  {messages.length}{' '}
                  {messages.length === 1 ? 'message' : 'messages'}
                </Typography>
              </Stack>

              {messageError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {messageError}
                </Alert>
              )}

              <Stack
                spacing={1.5}
                sx={{
                  mt: 2,
                  maxHeight: 320,
                  overflowY: 'auto',
                }}
              >
                {messages.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    No messages yet.
                  </Typography>
                ) : (
                  messages.map((message) => (
                    <Box
                      key={message._id}
                      sx={(theme) => ({
                        border: theme.custom.surfaceBorder,
                        borderRadius: '10px',
                        p: 1.5,
                        backgroundColor: theme.custom.cream,
                      })}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {message.userId?.username || 'GatherHub user'}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'text.secondary', flexShrink: 0 }}
                        >
                          {formatMessageDate(message.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mt: 0.75 }}>
                        {message.body}
                      </Typography>
                    </Box>
                  ))
                )}
              </Stack>

              {user ? (
                <Box
                  component="form"
                  onSubmit={handleMessageSubmit}
                  sx={{ mt: 2 }}
                >
                  <TextField
                    label="Message"
                    value={messageDraft}
                    onChange={(changeEvent) =>
                      setMessageDraft(changeEvent.target.value)
                    }
                    multiline
                    minRows={2}
                    fullWidth
                    inputProps={{ maxLength: 500 }}
                    helperText={`${messageDraft.length}/500`}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={messageSubmitting || !messageDraft.trim()}
                    sx={(theme) => ({
                      ...stickerPillButton(theme),
                      mt: 1.5,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        ...stickerPillButton(theme)['&:hover'],
                        backgroundColor: theme.palette.primary.main,
                      },
                    })}
                  >
                    {messageSubmitting ? 'Posting...' : 'Post message'}
                  </Button>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Log in to join the event chat.
                </Alert>
              )}
            </Box>
          )}
        </Box>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          {snackbarContent}
        </Snackbar>
        <Footer />
      </Box>
    </>
  );
};

SingleEvent.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default SingleEvent;
