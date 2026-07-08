import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const MissionStatementContainer = () => {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: '10%', display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          textAlign: 'center',
          padding: { xs: '32px 20px', md: '40px 48px' },
          backgroundColor: 'background.paper',
          border: (t) => t.custom.surfaceBorder,
          boxShadow: (t) => t.custom.stickerShadow,
          borderRadius: 3,
          width: '80%',
          mt: 4,
        }}
      >
        {/* Honey "pinned corkboard note" tab */}
        <Box
          sx={{
            position: 'absolute',
            top: -18,
            left: '50%',
            transform: 'translateX(-50%) rotate(-2deg)',
            px: 2,
            py: 0.5,
            backgroundColor: 'warning.main',
            color: 'text.primary',
            border: (t) => t.custom.surfaceBorder,
            boxShadow: (t) => `2px 2px 0 ${t.custom.surfaceBorderColor}`,
            borderRadius: 999,
            fontWeight: 800,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap',
          }}
        >
          Why we gather
        </Box>

        <Typography sx={{ mt: 1 }} variant="h5" component="h2">
          Our Mission Statement
        </Typography>
        <Typography variant="body1" component="p" sx={{ padding: '3%' }}>
          We ignite connections by bringing people together through exciting
          events that spark community, collaboration, and powerful networking.
          Our mission is to create a vibrant platform where ideas flow,
          relationships grow, and opportunities come alive. We believe great
          things happen when people connect — that’s why we focus on building
          spaces where diverse voices meet, share, and inspire. Whether you’re
          looking to expand your network, spark new projects, or simply meet
          like-minded people, we’re here to make it happen.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MissionStatementContainer;
