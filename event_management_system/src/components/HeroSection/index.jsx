import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import GenericButton from '../GenericButton';

const HeroSection = ({ title }) => {
  return (
    <Grid
      container
      spacing={5}
      direction="row"
      justifyContent="center"
      alignItems="center"
      padding={4}
      height="60vh"
    >
      <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h1>{title}</h1>
        <GenericButton
          color="inherit"
          variant="primary"
          text="Get Started"
          size="small"
        />
      </Grid>
      <Grid>
        <img src="https://via.placeholder.com/250" alt="placeholder" />
      </Grid>
    </Grid>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeroSection;
