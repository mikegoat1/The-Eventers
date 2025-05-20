import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import { useRouter } from 'next/router';
import GenericCard from '@/components/GenericCard';

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
            />
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default SingleEvent;
