import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import GenericCard from '@/components/GenericCard';
import GenericButton from '@/components/GenericButton';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import axios from 'axios';
import { parse as parseCookie } from 'cookie';
import jwt from 'jsonwebtoken';
import {
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';

// --- Block Party surfaces (all values resolved from theme tokens) ---

// Top bar: cream slab with a chunky ink rule underneath, matching Navbar.
const appBarSx = (theme) => ({
  backgroundColor: theme.custom.cream,
  color: theme.palette.text.primary,
  borderBottom: theme.custom.surfaceBorder,
});

// Every panel on this page is a sticker: white surface, chunky ink border,
// hard offset shadow, 14px radius.
const stickerCardSx = (theme) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  borderRadius: `${theme.shape.borderRadius}px`,
  border: theme.custom.surfaceBorder,
  boxShadow: theme.custom.stickerShadow,
  backgroundImage: 'none',
});

// Section headings get the hand-drawn honey swipe used in HeroSection.
const sectionHeadingSx = (theme) => ({
  position: 'relative',
  display: 'inline-block',
  // `isolation` makes this heading its own stacking context, so the z-index:-1
  // swipe paints behind the glyphs but still above any ancestor background.
  isolation: 'isolate',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 2,
    height: 8,
    borderRadius: 999,
    backgroundColor: theme.palette.warning.main,
    zIndex: -1,
  },
});

const Profile = ({ events, user, analytics, publishedEvents = [] }) => {
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
        <AppBar position="static" elevation={0} sx={appBarSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
            <GenericButton
              variant="secondary"
              text="Back"
              onClick={handleBack}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{ flexGrow: 1, textAlign: 'center', padding: 2 }}
            >
              GATHERHUB - My Events
            </Typography>
          </Box>
        </AppBar>

        {/* Profile summary */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6" component="h2" sx={sectionHeadingSx}>
            My Profile
          </Typography>
          {user?.email && (
            <Typography sx={{ marginTop: 1 }} color="text.secondary">
              Logged in as: {user.email}
            </Typography>
          )}
          <Typography sx={{ marginTop: 1 }} color="text.secondary">
            Total RSVP&apos;d events: {events.length}
          </Typography>
        </Box>

        {/* Analytics */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" component="h2" sx={sectionHeadingSx}>
            Event Analytics
          </Typography>
          {analytics?.summary ? (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Card elevation={0} sx={stickerCardSx}>
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      Organizer Summary
                    </Typography>
                    <Stack spacing={1.5} sx={{ mt: 2 }}>
                      {summaryMetrics.map((metric) => (
                        <Box
                          key={metric.label}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Typography color="text.secondary">
                            {metric.label}
                          </Typography>
                          <Typography sx={{ fontWeight: 700 }}>
                            {metric.value}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card elevation={0} sx={stickerCardSx}>
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      Category Popularity
                    </Typography>
                    {categoryData.length === 0 ? (
                      <Typography sx={{ mt: 2 }} color="text.secondary">
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
                              <Typography sx={{ fontWeight: 600 }}>
                                {category.category}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {category.totalEvents} events
                              </Typography>
                            </Box>
                            {/* Chunky ink-bordered meter with a brand-orange fill.
                                Decorative fill only — the count is stated in text. */}
                            <LinearProgress
                              variant="determinate"
                              value={
                                (category.totalEvents / maxCategoryEvents) * 100
                              }
                              aria-label={`${category.category} share of published events`}
                              sx={(theme) => ({
                                height: 12,
                                borderRadius: 999,
                                mt: 0.75,
                                border: theme.custom.surfaceBorder,
                                backgroundColor: theme.custom.cream,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: theme.palette.primary.main,
                                  borderRadius: 999,
                                },
                              })}
                            />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card elevation={0} sx={stickerCardSx}>
                  <CardContent>
                    <Typography variant="h6" component="h3">
                      Attendance Trends
                    </Typography>
                    {analytics.attendanceTrends?.length ? (
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        {analytics.attendanceTrends.map((trend) => (
                          <Grid key={trend.period} item xs={12} sm={6} md={4}>
                            {/* Mini sticker tile, cream fill so it reads as a
                                nested surface against the white card. */}
                            <Box
                              sx={(theme) => ({
                                height: '100%',
                                border: theme.custom.surfaceBorder,
                                borderRadius: `${theme.shape.borderRadius}px`,
                                boxShadow: theme.custom.stickerShadow,
                                backgroundColor: theme.custom.cream,
                                p: 2,
                              })}
                            >
                              <Typography sx={{ fontWeight: 700 }}>
                                {trend.period}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Events: {trend.totalEvents}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Attendees: {trend.totalAttendees}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Typography sx={{ mt: 2 }} color="text.secondary">
                        Publish events to start tracking attendance over time.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              We couldn&apos;t load your analytics yet. Create events to see
              organizer insights here.
            </Typography>
          )}
        </Box>

        {/* Published events */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" component="h2" sx={sectionHeadingSx}>
            Events I&apos;ve Published
          </Typography>
          {publishedEvents.length === 0 ? (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              You haven&apos;t published any events yet. Use the Events page to
              create your first gathering.
            </Typography>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, minmax(0, 1fr))',
                },
                gap: 3,
                marginTop: 2,
              }}
            >
              {publishedEvents.map((event) => (
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

        {/* Events list */}
        <Box sx={{ padding: 3 }}>
          <Typography variant="h4" component="h2" sx={sectionHeadingSx}>
            Events I&apos;ve RSVP&apos;d
          </Typography>
          {events.length === 0 ? (
            <Typography sx={{ mt: 2 }} color="text.secondary">
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

    let publishedEvents = [];
    try {
      const organizerResponse = await axios.get(
        `${baseUrl}/api/events/organizer`,
        {
          headers: {
            Cookie: context.req.headers.cookie || '',
          },
          withCredentials: true,
        }
      );
      publishedEvents = organizerResponse.data.events || [];
    } catch (organizerError) {
      console.error(
        'Failed to load organizer events:',
        organizerError.response?.data || organizerError.message
      );
    }

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
        publishedEvents,
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
