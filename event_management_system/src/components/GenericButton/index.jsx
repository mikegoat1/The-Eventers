import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

const GenericButton = ({
  text,
  onClick,
  variant,
  disabledElevation,
  size,
  startIcon,
  endIcon,
}) => {
  return (
    <Stack spacing={2} direction="row">
      <Button
        disableElevation={disabledElevation}
        variant={variant}
        onClick={onClick}
        size={size}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {text}
      </Button>
    </Stack>
  );
};

GenericButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  disabledElevation: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
};

GenericButton.defaultProps = {
  onClick: null,
  variant: 'contained',
  disabledElevation: false,
  size: 'medium',
  startIcon: null,
  endIcon: null,
};

export default GenericButton;
