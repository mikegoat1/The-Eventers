import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useRouter } from 'next/router';

const SingleEvent = () => {
  const router = useRouter();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!router.isReady) return;
      try {
        const res = await axios.get(`/events/${router.query.id}`);
        setEvent(res.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [router.isReady, router.query.id]);

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
          <Typography variant="h4">
            {event?.name || 'Loading event...'}
          </Typography>
          {event && (
            <Box sx={{ width: '80%', maxWidth: 600 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {new Date(event.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Location:</strong> {event.location}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Description:</strong> {event.description}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    <strong>Category:</strong> {event.category || 'N/A'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Attendees:</strong>{' '}
                    {event.attendees.length > 0
                      ? event.attendees.length
                      : 'No attendees yet'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default SingleEvent;
