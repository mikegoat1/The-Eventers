import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/joy/Typography';
import GenericCard from '@/components/GenericCard';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import { parse as parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';

const Profile = ({ events, user }) => {
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

        {/* Profile summary */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">My Profile</Typography>
          {user?.email && (
            <Typography sx={{ marginTop: 1 }}>
              Logged in as: {user.email}
            </Typography>
          )}
          <Typography sx={{ marginTop: 1 }}>
            Total RSVP&apos;d events: {events.length}
          </Typography>
        </Box>

        {/* Events list */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4">Events I&apos;ve RSVP&apos;d</Typography>
          {events.length === 0 ? (
            <Typography sx={{ mt: 2 }}>
              You haven&apos;t RSVP&apos;d for any events yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 3,
                marginTop: 2,
              }}
            >
              {events.map((event) => (
                <Box key={event._id} sx={{ height: '100%' }}>
                  <GenericCard
                    name={event.name}
                    date={event.date}
                    description={event.description}
                    category={event.category}
                    location={event.location}
                    attendees={event.attendees}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export async function getServerSideProps(context) {
  // Parse cookies from the incoming request
  const cookies = parseCookie(context.req.headers.cookie || '');
  const token = cookies.token || null;

  // If there is no token, redirect to home (or login)
  if (!token) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    // Decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = {
      id: decoded.userId,
      email: decoded.email || null,
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // Fetch the user's RSVP'd events from your API
    const response = await axios.get(`${baseUrl}/api/rsvp`, {
      headers: {
        Cookie: context.req.headers.cookie || '',
      },
      withCredentials: true,
    });

    return {
      props: {
        events: response.data.events || [],
        user,
      },
    };
  } catch (error) {
    console.error(
      'Failed to load RSVPs:',
      error.response?.data || error.message
    );
    return { redirect: { destination: '/', permanent: false } };
  }
}

export default Profile;
