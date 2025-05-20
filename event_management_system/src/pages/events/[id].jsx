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
            <Card sx={{ width: 320 }}>
              <div>
                <Typography level="title-lg">{event.name}</Typography>
                <Typography level="body-sm">
                  {new Date(event.date).toLocaleString()}
                </Typography>
                <Typography level="body-md" sx={{ marginTop: 1 }}>
                  {event.description || 'No description available.'}
                </Typography>
                <IconButton
                  aria-label="bookmark event"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  sx={{
                    position: 'absolute',
                    top: '0.875rem',
                    right: '0.5rem',
                  }}
                >
                  <BookmarkAdd />
                </IconButton>
              </div>
              <AspectRatio minHeight="120px" maxHeight="200px">
                <img
                  src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
                  srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </AspectRatio>
              <CardContent orientation="horizontal">
                <div>
                  <Typography level="body-xs">Category:</Typography>
                  <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
                    {event.category || 'N/A'}
                  </Typography>
                  <div>
                    <Typography level="body-xs">Location:</Typography>
                    <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
                      {event.location || 'N/A'}
                    </Typography>
                  </div>
                </div>
                <Box>
                    <Typography level="body-xs">Attendees:</Typography>
                    <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
                        {event.attendees.length > 0 ? `Attending: ${event.attendees.length}` :  'N/A'}
                    </Typography>
                </Box>
                <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 1 }}>
                  <GenericButton
                    variant="solid"
                    color="primary"
                    size="sm"
                    text="RVSP"
                    sx={{ marginLeft: 'auto'}}
                    onClick={() => router.push(`/events/${event._id}/register`)}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default SingleEvent;
