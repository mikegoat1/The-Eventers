import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';
import GenericButton from '../GenericButton';

// Staggered pop-in, disabled under prefers-reduced-motion.
const popIn = {
  '@keyframes bpPopIn': {
    from: { opacity: 0, transform: 'translateY(16px) scale(0.98)' },
    to: { opacity: 1, transform: 'translateY(0) scale(1)' },
  },
  animation: 'bpPopIn 240ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
};

const stickerTags = ['Free', 'Local', 'Family'];

const HeroSection = ({ title }) => {
  const router = useRouter();

  // Highlight the final word of the headline with a hand-drawn honey swipe.
  const words = title.trim().split(' ');
  const lead = words.slice(0, -1).join(' ');
  const keyWord = words[words.length - 1];

  return (
    <Grid
      container
      spacing={5}
      direction="row"
      justifyContent="center"
      alignItems="center"
      padding={4}
      marginBottom={8}
      marginTop={10}
    >
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            ...popIn,
            textAlign: 'left',
            fontSize: { xs: '2.75rem', md: '4rem' },
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {lead}{' '}
          <Box
            component="span"
            sx={{
              position: 'relative',
              display: 'inline-block',
              // Hand-drawn highlighter swipe behind the key word.
              '&::before': {
                content: '""',
                position: 'absolute',
                left: '-2%',
                right: '-2%',
                bottom: '0.08em',
                height: '0.42em',
                backgroundColor: (t) => alpha(t.palette.warning.main, 0.85),
                borderRadius: '999px 0 999px 0',
                transform: 'rotate(-1.5deg)',
                zIndex: -1,
              },
            }}
          >
            {keyWord}
          </Box>
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{
            ...popIn,
            animationDelay: '80ms',
            textAlign: 'left',
            fontWeight: 400,
            color: 'text.secondary',
            maxWidth: 460,
          }}
        >
          Find your people and show up. Local meetups, workshops, and block
          parties — all in one friendly place.
        </Typography>

        <Box sx={{ ...popIn, animationDelay: '160ms', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <GenericButton
            variant="primary"
            text="Join GatherHub"
            size="large"
            onClick={() => router.push('/register')}
          />
          <GenericButton
            variant="secondary"
            text="Browse events"
            size="large"
            onClick={() => router.push('/events')}
          />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            ...popIn,
            animationDelay: '120ms',
            position: 'relative',
            p: 1.5,
            pb: 4,
            backgroundColor: 'background.paper',
            border: (t) => t.custom.surfaceBorder,
            boxShadow: (t) => t.custom.stickerShadow,
            borderRadius: 3,
            transform: 'rotate(-3deg)',
            '@media (prefers-reduced-motion: reduce)': { transform: 'rotate(-3deg)' },
          }}
        >
          <Image
            style={{ borderRadius: 8, display: 'block' }}
            src="/Assets/heroImage.png"
            width={340}
            height={340}
            alt="People gathering at a community event"
          />
          {/* Pinned sticker tags */}
          <Box sx={{ display: 'flex', gap: 1, position: 'absolute', bottom: 10, left: 12 }}>
            {stickerTags.map((tag, i) => (
              <Box
                key={tag}
                sx={{
                  px: 1.25,
                  py: 0.25,
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  color: 'text.primary',
                  border: (t) => t.custom.surfaceBorder,
                  boxShadow: (t) => `2px 2px 0 ${t.custom.surfaceBorderColor}`,
                  backgroundColor: (t) =>
                    [t.palette.warning.main, t.palette.secondary.main, t.palette.primary.main][i],
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeroSection;
