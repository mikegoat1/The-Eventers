import React from 'react';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

// Create a styled button with theme-aware and custom color support
const StyledButton = styled(Button)(({ theme, customcolor, variant }) => {
  const primaryColor = customcolor || theme.palette.primary.main;
  const primaryHoverColor = theme.palette.augmentColor({
    main: primaryColor,
  }).dark;
  const secondaryBorderColor = customcolor || theme.palette.secondary.main;
  const secondaryHoverBackgroundColor = theme.palette.action.hover;

  const primaryStyles = {
    backgroundColor: primaryColor,
    color: theme.palette.getContrastText(primaryColor),
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: primaryHoverColor,
    },
    '&:disabled': {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  };

  const secondaryStyles = {
    border: `2px solid ${secondaryBorderColor}`,
    color: secondaryBorderColor,
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 'bold',
    fontSize: '16px',
    '&:hover': {
      backgroundColor: secondaryHoverBackgroundColor,
      borderColor: theme.palette.secondary.dark,
    },
  };

  const commonStyles = {
    textTransform: 'none', // Prevent uppercase transformation
    transition: theme.transitions.create(['background-color', 'border-color'], {
      duration: theme.transitions.duration.short,
    }),
  };

  return variant === 'secondary'
    ? { ...commonStyles, ...secondaryStyles }
    : { ...commonStyles, ...primaryStyles };
});

const GenericButton = ({
  text,
  onClick,
  variant,
  disabled,
  size,
  startIcon,
  endIcon,
  customColor,
}) => {
  const theme = useTheme(); // Access the current theme

  return (
    <Stack spacing={2} direction="row">
      <StyledButton
        disableElevation
        variant={variant}
        onClick={onClick}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
        customcolor={customColor}
        disabled={disabled}
        theme={theme} // Pass theme for styling
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
};

GenericButton.defaultProps = {
  onClick: null,
  variant: 'primary',
  disabled: false,
  size: 'medium',
  startIcon: null,
  endIcon: null,
  customColor: null,
};

export default GenericButton;
