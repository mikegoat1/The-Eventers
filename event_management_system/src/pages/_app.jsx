import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import theme from '@/ThemeProvider/ThemeProvider';
import '../styles/globals.css';

// Self-hosted fonts (no CDN @import). Exposed as CSS variables that the
// theme's fontFamily strings reference via var(--font-heading/--font-body).
// The variables are declared on :root (not a wrapper div) so that MUI content
// portaled to document.body — Menu, Dialog, Popover, Tooltip, Select — still
// resolves them instead of silently falling back to the browser default serif.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-heading',
});

// Loaded as a variable font (no `weight` array) so that the 600/700/800 weights
// used by buttons, sticker chips and card titles resolve to real faces instead
// of being synthesized into faux-bold by the browser.
const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

function MyApp({ Component, pageProps }) {
  return (
    <StrictMode>
      {/* Single Material UI theme. Joy UI has been fully removed from the app,
          so the former Material + Joy coexistence bridge (a themeId-keyed theme
          object nesting a second CssVars provider) is no longer needed. */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': {
              '--font-heading': bricolage.style.fontFamily,
              '--font-body': dmSans.style.fontFamily,
            },
          }}
        />
        <Component {...pageProps} />
      </ThemeProvider>
    </StrictMode>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
