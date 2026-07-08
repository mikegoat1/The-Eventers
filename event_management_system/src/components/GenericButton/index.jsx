import React from 'react';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Block Party button: solid rounded-pill sticker with chunky ink border +
// hard offset shadow. Every color pulls from the theme (zero hardcoded hex).
const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'customColor',
})(({ theme, customColor, variant, size }) => {
  const ink = theme.palette.text.primary; // warm near-black ink
  const accent = customColor || theme.palette.primary.main; // bright brand orange
  const { stickerShadow, surfaceBorder } = theme.custom;

  const commonStyles = {
    textTransform: 'none',
    borderRadius: 999, // rounded pill
    fontWeight: 700,
    lineHeight: 1.4,
    color: ink,
    border: surfaceBorder,
    boxShadow: stickerShadow,
    // Bouncy pop on hover — GPU-friendly transform/shadow only, <250ms.
    transition: theme.transitions.create(['transform', 'box-shadow'], {
      duration: 180,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    }),
    '&:hover': {
      transform: 'translate(-1px, -2px)',
      boxShadow: `6px 7px 0 ${theme.custom.surfaceBorderColor}`,
    },
    '&:active': {
      transform: 'translate(2px, 2px)',
      boxShadow: `1px 1px 0 ${theme.custom.surfaceBorderColor}`,
    },
    '&.Mui-disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.text.secondary,
      boxShadow: 'none',
      borderColor: theme.palette.text.secondary,
    },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:hover': { transform: 'none' },
      '&:active': { transform: 'none' },
    },
  };

  const primaryStyles = {
    backgroundColor: accent,
    '&:hover': {
      ...commonStyles['&:hover'],
      backgroundColor: accent,
    },
  };

  const secondaryStyles = {
    backgroundColor: theme.custom.cream,
    '&:hover': {
      ...commonStyles['&:hover'],
      backgroundColor: alpha(theme.palette.warning.main, 0.25),
    },
  };

  const sizeStyles = {
    small: { fontSize: '0.8125rem', padding: '5px 16px' },
    medium: { fontSize: '0.9375rem', padding: '8px 22px' },
    large: { fontSize: '1.0625rem', padding: '11px 28px' },
  };

  return {
    ...commonStyles,
    ...(variant === 'secondary' ? secondaryStyles : primaryStyles),
    ...sizeStyles[size],
  };
});

const GenericButton = ({
  text,
  onClick = null,
  variant = 'primary',
  disabled = false,
  size = 'medium',
  startIcon = null,
  endIcon = null,
  customColor = null,
  type = 'button',
}) => {
  return (
    <Stack spacing={2} direction="row">
      <StyledButton
        disableElevation
        variant={variant}
        onClick={onClick}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        customColor={customColor}
        disabled={disabled}
        type={type}
      >
        {text}
      </StyledButton>
    </Stack>
  );
};

GenericButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  customColor: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default GenericButton;
