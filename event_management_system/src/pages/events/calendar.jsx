import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import axios from '../../lib/axios';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import GenericButton from '@/components/GenericButton';
import { useRouter } from 'next/router';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
});

// Block Party sticker surface: white fill, chunky ink border, hard offset shadow.
const stickerSurface = (theme) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  border: theme.custom.surfaceBorder,
  boxShadow: theme.custom.stickerShadow,
});

// Pill-shaped outlined action that matches GenericButton's sticker language.
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

// FullCalendar v6 is themed through its own CSS custom properties, so every
// color below still resolves from a theme token (zero hardcoded hex).
const fullCalendarSx = (theme) => ({
  '& .fc': {
    '--fc-border-color': alpha(theme.custom.surfaceBorderColor, 0.22),
    '--fc-page-bg-color': theme.palette.background.paper,
    '--fc-neutral-bg-color': theme.custom.cream,
    '--fc-today-bg-color': alpha(theme.palette.warning.main, 0.18),
    '--fc-event-bg-color': theme.palette.primary.main,
    '--fc-event-border-color': theme.custom.surfaceBorderColor,
    '--fc-event-text-color': theme.palette.primary.contrastText,
    fontFamily: theme.typography.fontFamily,
  },
  '& .fc .fc-toolbar-title': {
    fontFamily: theme.typography.h5.fontFamily,
    fontWeight: 800,
    fontSize: '1.35rem',
    color: theme.palette.text.primary,
  },
  '& .fc .fc-button': {
    backgroundColor: theme.custom.cream,
    color: theme.palette.text.primary,
    border: theme.custom.surfaceBorder,
    borderRadius: '999px',
    boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
    fontWeight: 700,
    textTransform: 'none',
    padding: '5px 14px',
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: 160,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    }),
  },
  // FullCalendar's own group rules (0,4,0) collapse the pills together and
  // pull them into an overlap; these selectors out-specify them.
  '& .fc .fc-button-group': { gap: '6px' },
  '& .fc .fc-button-group > .fc-button:not(:first-child)': { marginLeft: 0 },
  '& .fc .fc-button:hover': {
    backgroundColor: alpha(theme.palette.warning.main, 0.3),
    color: theme.palette.text.primary,
    transform: 'translate(-1px, -1px)',
    boxShadow: `3px 3px 0 ${theme.custom.surfaceBorderColor}`,
  },
  '& .fc .fc-button:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: '2px',
  },
  // Active / pressed view toggle: brand orange behind dark ink (4.70:1).
  '& .fc .fc-button-primary:not(:disabled).fc-button-active, & .fc .fc-button-primary:not(:disabled):active':
    {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.custom.surfaceBorderColor,
      transform: 'translate(1px, 1px)',
      boxShadow: `1px 1px 0 ${theme.custom.surfaceBorderColor}`,
    },
  '& .fc .fc-button-primary:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.text.secondary,
    borderColor: theme.palette.text.secondary,
    boxShadow: 'none',
    opacity: 1,
  },
  '& .fc .fc-event': {
    borderRadius: '8px',
    border: `2px solid ${theme.custom.surfaceBorderColor}`,
    fontWeight: 600,
    padding: '1px 4px',
    cursor: 'pointer',
  },
  '& .fc .fc-col-header-cell-cushion': {
    color: theme.palette.text.primary,
    fontWeight: 700,
    textDecoration: 'none',
  },
  '& .fc .fc-daygrid-day-number': {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& .fc .fc-button': { transition: 'none' },
    '& .fc .fc-button:hover': { transform: 'none' },
    '& .fc .fc-button-primary:not(:disabled).fc-button-active': {
      transform: 'none',
    },
  },
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

const CalendarPage = ({ user }) => {
  const router = useRouter();
  const handleBack = () => {
    // Prefer navigating back in history; if no history, fall back to the events index
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/events');
    }
  };
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [reminderTime, setReminderTime] = useState('');
  const [reminderStatus, setReminderStatus] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/events');
      setEvents(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to load calendar events:', err);
      setError(
        err.response?.data?.message ||
          'Unable to load calendar events. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const calendarEvents = useMemo(() => {
    return events.map((event) => ({
      id: event._id,
      title: event.name,
      start: event.date,
      meta: event,
    }));
  }, [events]);

  const handleEventClick = (info) => {
    const meta = info.event.extendedProps.meta;
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.startStr,
      location: meta?.location,
      description: meta?.description,
      category: meta?.category,
    });
    setReminderTime('');
    setReminderStatus(null);
  };

  const handleReminderSubmit = async (event) => {
    event.preventDefault();
    if (!selectedEvent) return;
    try {
      await axios.post(`/events/${selectedEvent.id}/reminder`, {
        remindAt: new Date(reminderTime).toISOString(),
        method: 'notification',
      });
      setReminderStatus({ type: 'success', message: 'Reminder scheduled!' });
    } catch (err) {
      console.error('Failed to set reminder:', err);
      setReminderStatus({
        type: 'error',
        message:
          err.response?.data?.message ||
          'Unable to set reminder. Please try again.',
      });
    }
  };

  return (
    <>
      <Navbar title="GATHERHUB" user={user} />
      <Box
        sx={(theme) => ({
          minHeight: '100vh',
          background: theme.custom.peachGradient,
          py: 4,
          px: { xs: 2, md: 6 },
        })}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={2}
            mb={3}
          >
            <Box>
              <Box sx={{ mb: 1 }}>
                <GenericButton
                  variant="secondary"
                  text="Back"
                  type="button"
                  onClick={handleBack}
                />
              </Box>
              <Typography variant="h3">Event Calendar</Typography>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', maxWidth: 560 }}
              >
                Drag through the month/week views to see where your events land
                and schedule reminders in one click.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={fetchEvents}
              sx={stickerPillButton}
            >
              Refresh events
            </Button>
          </Stack>

          <Card
            sx={(theme) => ({
              p: 2,
              ...stickerSurface(theme),
              ...fullCalendarSx(theme),
            })}
          >
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 6,
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="75vh"
                events={calendarEvents}
                eventDisplay="block"
                eventClick={handleEventClick}
              />
            )}
          </Card>
        </Box>
      </Box>
      <Footer />

      <Dialog
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: (theme) => ({
              ...stickerSurface(theme),
              backgroundImage: 'none',
            }),
          },
        }}
      >
        {selectedEvent && (
          <>
            <DialogTitle
              sx={(theme) => ({
                fontFamily: theme.typography.h5.fontFamily,
                fontWeight: 800,
              })}
            >
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent
              dividers
              sx={(theme) => ({
                borderColor: alpha(theme.custom.surfaceBorderColor, 0.25),
              })}
            >
              <Typography variant="subtitle2">
                When: {new Date(selectedEvent.start).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Where: {selectedEvent.location || 'TBD'}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 2, color: 'text.secondary' }}
              >
                {selectedEvent.description || 'No description provided.'}
              </Typography>
              {selectedEvent.category && (
                <Box
                  aria-label={`Category: ${selectedEvent.category}`}
                  sx={(theme) => ({
                    display: 'inline-block',
                    mt: 1.5,
                    px: 1.25,
                    py: 0.25,
                    borderRadius: '999px',
                    backgroundColor: theme.palette.warning.main,
                    border: theme.custom.surfaceBorder,
                    boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
                    color: theme.palette.warning.contrastText,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  })}
                >
                  {selectedEvent.category}
                </Box>
              )}

              {reminderStatus && (
                <Alert severity={reminderStatus.type} sx={{ mt: 2 }}>
                  {reminderStatus.message}
                </Alert>
              )}

              {user ? (
                <Box
                  component="form"
                  onSubmit={handleReminderSubmit}
                  sx={{ mt: 3 }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontWeight: 700 }}
                  >
                    Schedule a Reminder
                  </Typography>
                  <TextField
                    type="datetime-local"
                    label="Reminder time"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    value={reminderTime}
                    onChange={(event) => setReminderTime(event.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!reminderTime}
                    sx={(theme) => ({
                      ...stickerPillButton(theme),
                      mt: 2,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      '&:hover': {
                        ...stickerPillButton(theme)['&:hover'],
                        backgroundColor: theme.palette.primary.main,
                      },
                    })}
                  >
                    Save reminder
                  </Button>
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Log in to schedule reminders for this event.
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                onClick={() => setSelectedEvent(null)}
                sx={stickerPillButton}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

CalendarPage.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default CalendarPage;
