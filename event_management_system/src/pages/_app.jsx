import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
import '../styles/globals.css';
// import { ThemeProvider } from '@mui/material';
// import theme from '@/ThemeProvider/ThemeProvider';

function MyApp({ Component, pageProps }) {
  return (
    <StrictMode>
      <Component {...pageProps} />
    </StrictMode>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
