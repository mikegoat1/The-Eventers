import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import GenericCard from '@/components/GenericCard';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

const Profile = ({ events }) => {
  const router = useRouter();

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
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
            <GenericButton
              variant="secondary"
              text="Back"
              onClick={handleBack}
            />
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, textAlign: 'center', padding: 2 }}
            >
              GATHERHUB - My Events
            </Typography>
          </Box>
        </AppBar>

        <Box sx={{ padding: 3 }}>
          <Typography variant="h4">Events I've RSVP'd</Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              marginTop: 2,
            }}
          >
            {events.length > 0 ? (
              events.map((event) => (
                <GenericCard
                  key={event._id}
                  name={event.name}
                  date={event.date}
                  description={event.description}
                  category={event.category}
                  location={event.location}
                  attendees={event.attendees}
                />
              ))
            ) : (
              <Typography>No RSVP'd events found.</Typography>
            )}
          </Box>
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  const cookies = cookie.parse(context.req.headers.cookie || '');
  const token = cookies.token || null;

  if (!token) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    const response = await axios.get(`${baseUrl}/api/rsvp`, {
      params: { userId: decoded.userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { props: { events: response.data.events } };
  } catch (error) {
    console.error('Failed to load RSVPs:', error.response?.data || error.message);
    return { redirect: { destination: '/', permanent: false } };
  }
}

export default Profile;
