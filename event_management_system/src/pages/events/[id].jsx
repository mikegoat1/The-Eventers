import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import axios from '../../lib/axios';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import GenericCard from '@/components/GenericCard';
import Image from 'next/image';

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
  console.log('User:', user);
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

  useEffect(() => {
    if (event && user) {
      setIsAttending(event.attendees.includes(user.id));
    }
  }, [event, user]);

  const handleBack = () => {
    router.push('/');
  };

  const handleRSVP = async () => {
    if (!user || !user.id) {
      router.push('/login');
      alert('Please log in to RSVP for events.');
      return;
    }

    try {
      const newStatus = isAttending ? 'not attending' : 'attending';

      await axios.post('/rsvp', {
        eventId: event._id,
        userId: user.id,
        status: newStatus,
      });
      const res = await axios.get(`/events/${event._id}`);
      setEvent(res.data);
      setIsAttending(res.data.attendees.includes(user.id));
      // setIsAttending(!isAttending);

      alert(`RSVP ${newStatus === 'attending' ? 'successful' : 'removed'}`);
    } catch (error) {
      console.error('Error RSVPing:', error);
      alert('Failed to RSVP. Please try again later.');
    }
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
              <Image src="/Assets/Logo1.png" width={25} height={25} />
            </Box>
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
              onButtonClick={handleRSVP}
              buttonText={isAttending ? 'Cancel RSVP' : 'RSVP'}
            />
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default SingleEvent;
