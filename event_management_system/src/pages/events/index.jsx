import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';
import { Box, Typography } from '@mui/material';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import GenericCard from '@/components/GenericCard';


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

const Home = ({ user }) => {
  const [events, setEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/events/`);
        setEvent(res.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, []);
  console.log('Events:', events);
  return (
    <>
      <Navbar title="GATHERHUB" />
      {Array.isArray(events) && events.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 2,
            px: 2,
            py: 2,
          }}
        >
          {events.map((event, i) => (
            <Box key={event._id || event.name}>
              <GenericCard
                name={event.name}
                date={event.date}
                description={event.description}
                category={event.category}
                location={event.location}
                attendees={event.attendees || []}
                image={event.image || `https://picsum.photos/600/400?random=${i}`}
                onButtonClick={() => {
                  if (!user) return router.push('/login');
                  router.push(`/events/${event._id}`);
                }}
                buttonText={user ? 'Reserve' : 'Join Up'}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">No events available at the moment.</Typography>
        </Box>
      )}
      <Footer />
    </>
  );
};

export default Home;
