import React from 'react';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { darken } from '@mui/system';
// Create a size varian for the button

// Create a styled button with theme-aware and custom color support
const StyledButton = styled(Button)(({ customColor, variant, size }) => {
  const primaryStyles = {
    backgroundColor: customColor || '#FF5722',
    color: '#FDFCFC',
    borderRadius: '8px',
    // padding: '8px 24px',
    fontWeight: 'bold',
    // fontSize: '16px',
    lineHeight: '1.5',
    '&:hover': {
      backgroundColor: customColor ? darken(customColor, 0.2) : '#AD2800', // Darken the custom color or use a default hover color
    },
    '&:disabled': {
      backgroundColor: '#CAC0BF', // Disabled background color
      color: '#CABFBF', // Disabled text color
    },
  };

  const secondaryStyles = {
    border: `2px solid ${customColor || '#FFC107'}`, // Default secondary color
    color: customColor || '#080808',
    backgroundColor: '#FFF9E5',
    borderRadius: '8px',
    // padding: '12px 24px',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#FFC107', // Hover background color
      borderColor: customColor ? darken(customColor, 0.2) : '#9E7700', // Darken the custom color or use a default hover border color
    },
  };

  const commonStyles = {
    textTransform: 'none', // Prevent uppercase transformation
    transition: 'background-color 0.3s, border-color 0.3s', // Transition for background and border color
  };
  const sizeStyles = {
    small: {
      fontSize: '0.75rem',
      padding: '4px 12px',
    },
    medium: {
      fontSize: '0.875rem',
      padding: '6px 16px',
    },
    large: {
      fontSize: '1rem',
      padding: '8px 20px',
    },
  };
  return {
    ...(variant === 'secondary'
      ? { ...commonStyles, ...secondaryStyles }
      : { ...commonStyles, ...primaryStyles }),
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
