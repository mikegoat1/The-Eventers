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
          textAlign: 'left',
          padding: { xs: '36px 20px 32px', md: '44px 48px 40px' },
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
          Come as you are. Leave with new people.
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            mt: 2,
            maxWidth: '65ch',
            color: 'text.secondary',
          }}
        >
          Every event here is an open invitation — bring your ideas, your
          questions, or just yourself. When different voices end up in the same
          room, projects start, collaborations click, and strangers turn into
          the people you build things with.
        </Typography>
      </Paper>
    </Box>
  );
};

export default MissionStatementContainer;
