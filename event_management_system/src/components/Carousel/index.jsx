import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';
import GenericButton from '../GenericButton';

// Deterministic category -> sticker fill, mirroring GenericCard.
const categoryFill = (category, theme) => {
  const palette = [
    theme.palette.secondary.main,
    theme.palette.primary.main,
    theme.palette.warning.main,
  ];
  const key = (category || 'general').toString();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1)
    hash = (hash + key.charCodeAt(i)) % palette.length;
  return palette[hash];
};

const EventCarousel = ({ user, filterCategory, maxItems, title }) => {
  const [carouselEvents, setCarouselEvents] = useState(null);
  const router = useRouter();
  const theme = useTheme();

  // Heading now reflects the ACTUAL filter, not a hardcoded season.
  const heading =
    title || (filterCategory ? `${filterCategory} Events` : 'Upcoming Events');

  const hasEvents = Array.isArray(carouselEvents) && carouselEvents.length > 0;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: false,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!router.isReady) return;
      try {
        const res = await axios.get(`/events`);
        let events = res.data;

        if (filterCategory) {
          events = events.filter((event) => event.category === filterCategory);
        }
        if (maxItems) {
          events = events.slice(0, maxItems);
        }
        setCarouselEvents(events);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, [router.isReady]);

  const handleJoinClick = () => {
    router.push('/register');
  };
  const handleReserveClick = (eventId) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <Box sx={{ mt: 4, px: 2, mb: 4 }}>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ textAlign: 'center' }}
      >
        {heading}
      </Typography>
      {!hasEvents ? (
        // Rendered outside <Slider>: react-slick clones its children to fill
        // slidesToShow, which would repeat the empty state once per slide.
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">
            No events available at the moment.
          </Typography>
        </Box>
      ) : (
        <Slider {...settings}>
          {carouselEvents.map((event) => {
            const stickerColor = categoryFill(event.category, theme);
            return (
              <Box key={event._id || event.name} sx={{ px: 1, py: 1 }}>
                <Card
                  sx={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: `${theme.shape.borderRadius}px`,
                    border: theme.custom.surfaceBorder,
                    boxShadow: theme.custom.stickerShadow,
                    backgroundColor: 'background.paper',
                  }}
                >
                  {/* Event photo on top — real event image */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: 160,
                      overflow: 'hidden',
                      borderBottom: theme.custom.surfaceBorder,
                    }}
                  >
                    <Box
                      component="img"
                      src={event.image || '/Assets/heroImage.png'}
                      loading="lazy"
                      alt={event.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {event.category && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          px: 1.25,
                          py: 0.25,
                          borderRadius: 999,
                          backgroundColor: stickerColor,
                          border: theme.custom.surfaceBorder,
                          boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
                          color: 'text.primary',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {event.category}
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {event.name}
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="row"
                      mt={1}
                      gap={1}
                      flexWrap="wrap"
                    >
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        · {event.location || 'N/A'}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      {!user ? (
                        <GenericButton
                          text="Join Up"
                          size="small"
                          onClick={handleJoinClick}
                        />
                      ) : (
                        <GenericButton
                          text="Reserve"
                          size="small"
                          onClick={() => handleReserveClick(event._id)}
                        />
                      )}
                    </Box>
                  </Box>
                </Card>
              </Box>
            );
          })}
        </Slider>
      )}
    </Box>
  );
};

EventCarousel.propTypes = {
  user: PropTypes.object,
  filterCategory: PropTypes.string,
  maxItems: PropTypes.number,
  title: PropTypes.string,
};

export default EventCarousel;
