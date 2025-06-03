import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const MissionStatementContainer = () => {
  return (
    <Box sx={{ flexGrow: 1,marginBottom: '20%', display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#F8F7F7',
          width: '80%',
        }}
      >
        <Typography sx={{ paddingTop: '2%'}} variant="h5" component="div">
          Our Mission Statement
        </Typography>
        <Typography variant="body1" component="div" sx={{ padding: '3%' }}>
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
