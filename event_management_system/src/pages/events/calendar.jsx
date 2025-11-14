import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import GenericButton from '@/components/GenericButton';
import { useRouter } from 'next/router';

const FullCalendar = dynamic(() => import('@fullcalendar/react'), {
  ssr: false,
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
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, #FDF6ED, #ECE7E1, #B1A79E)',
          py: 4,
          px: { xs: 2, md: 6 },
        }}
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
              <GenericButton
                variant="secondary"
                text="Back"
                type="button"
                onClick={handleBack}
                sx={{ mb: 1 }}
              />
              <Typography variant="h3" fontWeight="600">
                Event Calendar
              </Typography>
              <Typography variant="body1" sx={{ color: '#4E4E4E' }}>
                Drag through the month/week views to see where your events
                land and schedule reminders in one click.
              </Typography>
            </Box>
            <Button variant="outlined" onClick={fetchEvents}>
              Refresh events
            </Button>
          </Stack>

          <Card sx={{ p: 2, backgroundColor: '#FFFBF5' }}>
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
      >
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2">
                When: {new Date(selectedEvent.start).toLocaleString()}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Where: {selectedEvent.location || 'TBD'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 2, color: '#4E4E4E' }}>
                {selectedEvent.description || 'No description provided.'}
              </Typography>
              {selectedEvent.category && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Category: {selectedEvent.category}
                </Typography>
              )}

              {reminderStatus && (
                <Alert severity={reminderStatus.type} sx={{ mt: 2 }}>
                  {reminderStatus.message}
                </Alert>
              )}

              {user ? (
                <Box component="form" onSubmit={handleReminderSubmit} sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
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
                    sx={{ mt: 2 }}
                    disabled={!reminderTime}
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
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default CalendarPage;
