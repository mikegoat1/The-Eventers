import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'primary.main',
          color: 'text.primary',
          borderTop: (t) => t.custom.surfaceBorder,
        }}
      >
        <Typography
          variant="h6"
          component="p"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            padding: '14px',
            fontWeight: 700,
          }}
        >
          © 2025 GatherHub. All rights reserved.
        </Typography>
      </AppBar>
    </Box>
  );
};

export default Footer;
