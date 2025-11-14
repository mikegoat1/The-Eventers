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
import { Card, CardContent, Grid, LinearProgress, Stack } from '@mui/material';

const Profile = ({ events, user, analytics }) => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const summaryMetrics = [
    {
      label: 'Events created',
      value: analytics?.summary?.totalEvents ?? 0,
    },
    {
      label: 'Total attendees',
      value: analytics?.summary?.totalAttendees ?? 0,
    },
    {
      label: 'Avg attendees per event',
      value: analytics?.summary?.averageAttendeesPerEvent ?? 0,
    },
  ];

  const categoryData = analytics?.categoryPopularity || [];
  const maxCategoryEvents =
    categoryData.reduce(
      (max, category) =>
        category.totalEvents > max ? category.totalEvents : max,
      0
    ) || 1;

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

        {/* Analytics */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4">Event Analytics</Typography>
          {analytics?.summary ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">Organizer Summary</Typography>
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      {summaryMetrics.map((metric) => (
                        <Box
                          key={metric.label}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Typography sx={{ color: '#6A6A6A' }}>
                            {metric.label}
                          </Typography>
                          <Typography fontWeight={600}>
                            {metric.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6">Category Popularity</Typography>
                    {categoryData.length === 0 ? (
                      <Typography sx={{ mt: 2 }}>
                        You haven&apos;t published any events yet.
                      </Typography>
                    ) : (
                      <Stack spacing={2} sx={{ mt: 2 }}>
                        {categoryData.map((category) => (
                          <Box key={category.category}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography>{category.category}</Typography>
                              <Typography variant="body2" sx={{ color: '#6A6A6A' }}>
                                {category.totalEvents} events
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={
                                (category.totalEvents / maxCategoryEvents) * 100
                              }
                              sx={{ height: 8, borderRadius: 2, mt: 0.5 }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Attendance Trends</Typography>
                    {analytics.attendanceTrends?.length ? (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {analytics.attendanceTrends.map((trend) => (
                          <Grid key={trend.period} item xs={12} sm={6} md={4}>
                            <Box
                              sx={{
                                border: '1px solid #E0E0E0',
                                borderRadius: 2,
                                p: 2,
                              }}
                            >
                              <Typography fontWeight={600}>
                                {trend.period}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6A6A6A' }}>
                                Events: {trend.totalEvents}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6A6A6A' }}>
                                Attendees: {trend.totalAttendees}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography sx={{ mt: 2 }}>
                        Publish events to start tracking attendance over time.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ mt: 2 }}>
              We couldn&apos;t load your analytics yet. Create events to see
              organizer insights here.
            </Typography>
          )}
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

    let analytics = null;
    try {
      const analyticsResponse = await axios.get(`${baseUrl}/api/analytics`, {
        headers: {
          Cookie: context.req.headers.cookie || '',
        },
        withCredentials: true,
      });
      analytics = analyticsResponse.data;
    } catch (analyticsError) {
      console.error(
        'Failed to load analytics:',
        analyticsError.response?.data || analyticsError.message
      );
    }

    return {
      props: {
        events: response.data.events || [],
        user,
        analytics,
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
