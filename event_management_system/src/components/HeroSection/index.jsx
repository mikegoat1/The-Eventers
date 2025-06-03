import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid2';
import GenericButton from '../GenericButton';
import Image from 'next/image';
import { useRouter } from 'next/router';

const HeroSection = ({ title }) => {
  const router = useRouter();

  return (
    <Grid
      container
      spacing={5}
      direction="row"
      justifyContent="center"
      alignItems="center"
      padding={4}
      height="60vh"
      marginBottom={8}
      marginTop={10}
    >
      <Grid sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <h1>{title}</h1>
        <GenericButton
          color="inherit"
          variant="primary"
          text="Join GatherHub"
          size="medium"
          onClick={() => router.push('/register')}
        />
      </Grid>
      <Grid>
        <Image
          style={{ borderRadius: '10%' }}
          src="/Assets/heroImage.png"
          width={350}
          height={350}
          alt="placeholder"
        />
      </Grid>
    </Grid>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeroSection;
