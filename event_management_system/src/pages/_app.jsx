import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
import { Bricolage_Grotesque, DM_Sans } from 'next/font/google';
import { ThemeProvider, THEME_ID } from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
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

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-body',
});

function MyApp({ Component, pageProps }) {
  return (
    <StrictMode>
      {/* Material + Joy coexistence (official MUI pattern): key the Material
          theme with THEME_ID and nest Joy's CssVarsProvider inside so the
          @mui/joy components already used on some pages (login/register/etc.)
          keep their own default theme instead of crashing. */}
      <ThemeProvider theme={{ [THEME_ID]: theme }}>
        <JoyCssVarsProvider>
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
        </JoyCssVarsProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
