import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card } from '@mui/material';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';

const EventCarousel = ({ user, filterCategory, maxItems }) => {
  const [carouselEvents, setCarouselEvents] = useState(null);
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    pauseOnHover: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
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
  console.log('Carousel Events:', carouselEvents);
  return (
    <Box sx={{ mt: 4, px: 2, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
        Summer Events
      </Typography>
      <Slider {...settings}>
        {Array.isArray(carouselEvents) && carouselEvents.length > 0 ? (
          carouselEvents.map((event, i) => (
            <Box key={event._id || event.name} sx={{ px: 1 }}>
              <Card
                sx={{
                  width: '100%',
                  position: 'relative',
                  padding: 2,
                  px: 1,
                  backgroundImage: `url(https://picsum.photos/400/200?random=${i})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 1,
                  color: '#FFCB1F',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    zIndex: 2,
                    pointerEvents: 'none',
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 3 }}>
                  <Typography variant="h6">{event.name}</Typography>
                  <Box display="flex" flexDirection="row" mt={1} gap={1}>
                    <Typography variant="body2">
                      {new Date(event.date).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Location: {event.location || 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Category: {event.category || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          ))
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1">
              No events available at the moment.
            </Typography>
          </Box>
        )}
      </Slider>
    </Box>
  );
};

export default EventCarousel;
