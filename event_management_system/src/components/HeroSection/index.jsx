import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import GenericButton from '../GenericButton';

const HeroSection = ({ title }) => {
  return (
    <Grid
      container
      spacing={15}
      direction="row"
      justifyContent="center"
      alignItems="center"
      padding={4}
      height="50vh"
    >
      <Grid >
        <h1>{title}</h1>
        <p>This is the main entry point of the application.</p>
        <GenericButton
          color="inherit"
          variant="primary"
          text="Get Started"
          size="medium"
        />
      </Grid>
      <Grid >
        <img src="https://via.placeholder.com/250" alt="placeholder" />
      </Grid>
    </Grid>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeroSection;
