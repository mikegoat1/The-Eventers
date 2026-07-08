import { createTheme } from '@mui/material/styles';

/**
 * "Block Party" design tokens — single source of truth for the restyle.
 * Fonts are self-hosted via next/font in _app.jsx and exposed as the CSS
 * variables --font-heading (Bricolage Grotesque) and --font-body (DM Sans);
 * the theme references those variables so no CDN @import is needed.
 */

// Core palette hexes (declared once here so nothing downstream hardcodes them)
const CREAM = '#FFF7EC'; // page background base
const PEACH = '#FFE9D2'; // page gradient end (peach -> butter)
const SURFACE = '#FFFFFF'; // card / sticker surface
const BORDER = '#2B2620'; // chunky sticker border + hard offset shadow (decorative, non-text)
const INK = '#211D18'; // warm near-black foreground ink (text + contrast text on fills) — AA on every brand fill
const ACCENT = '#EA5B24'; // primary — bright brand orange; paired with dark ink, not white
const GREEN = '#349B74'; // secondary — garden green (lightened so dark-ink chip text clears AA)
const HONEY = '#F2B705'; // warning — honey yellow
const TEXT_MUTED = '#6E655C'; // muted body text (darkened to clear AA on the peach gradient)

const stickerShadow = `4px 4px 0 ${BORDER}`;
const surfaceBorder = `2px solid ${BORDER}`;
const peachGradient = `linear-gradient(160deg, ${CREAM} 0%, ${PEACH} 100%)`;

const headingFont = 'var(--font-heading), "Bricolage Grotesque", system-ui, sans-serif';
const bodyFont = 'var(--font-body), "DM Sans", system-ui, sans-serif';

// Warm ink sits on every Block Party brand fill (never white-on-orange).
// Provided so augmentColor / getContrastText resolve to INK (#211D18) on brand
// colors; non-brand fills (e.g. error red) keep a legible white.
const getContrastText = (background) =>
  [ACCENT, GREEN, HONEY, PEACH, CREAM, SURFACE].includes(background)
    ? INK
    : SURFACE;

const theme = createTheme({
  palette: {
    getContrastText,
    primary: {
      main: ACCENT,
      contrastText: INK,
    },
    secondary: {
      main: GREEN,
      contrastText: INK,
    },
    warning: {
      main: HONEY,
      contrastText: INK,
    },
    background: {
      default: CREAM,
      paper: SURFACE,
    },
    text: {
      primary: INK,
      secondary: TEXT_MUTED,
    },
    // Custom named entries so components reference roles, not raw hex:
    honey: {
      main: HONEY,
      contrastText: INK,
    },
    surface: {
      main: SURFACE,
    },
    border: {
      main: BORDER,
    },
    muted: {
      main: TEXT_MUTED,
    },
  },
  shape: {
    borderRadius: 14,
  },
  // Reusable Block Party tokens — every component pulls from here.
  custom: {
    stickerShadow,
    surfaceBorder,
    surfaceBorderColor: BORDER,
    peachGradient,
    cream: CREAM,
    peach: PEACH,
    accentBright: ACCENT, // === primary.main now; kept for decorative call-sites
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: headingFont, fontWeight: 800 },
    h2: { fontFamily: headingFont, fontWeight: 800 },
    h3: { fontFamily: headingFont, fontWeight: 700 },
    h4: { fontFamily: headingFont, fontWeight: 700 },
    h5: { fontFamily: headingFont, fontWeight: 700 },
    h6: { fontFamily: headingFont, fontWeight: 700 },
    button: {
      fontFamily: bodyFont,
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          minHeight: '100%',
          color: INK,
          background: peachGradient,
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: INK,
        },
      },
    },
  },
});

export default theme;
