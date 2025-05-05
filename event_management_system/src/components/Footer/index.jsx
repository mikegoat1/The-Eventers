import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import  Typography  from '@mui/material/Typography';


const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#FF5722' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center', padding: '10px' }}>
          © 2025 GatherHub. All rights reserved.
        </Typography>
      </AppBar>
    </Box>
  );
}

export default Footer;