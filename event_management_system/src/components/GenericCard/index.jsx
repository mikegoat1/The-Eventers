import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import GenericButton from '@/components/GenericButton';

// Deterministically map a category to one of the three Block Party sticker
// fills (green / orange / honey) — all drawn from theme tokens.
const categoryFill = (category, theme) => {
  const palette = [
    theme.palette.secondary.main, // green
    theme.palette.primary.main, // orange
    theme.palette.warning.main, // honey
  ];
  const key = (category || 'general').toString();
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash + key.charCodeAt(i)) % palette.length;
  return palette[hash];
};

const GenericCard = ({
  name,
  date,
  description,
  category,
  location,
  attendees = [],
  image,
  onButtonClick,
  buttonText = 'RSVP',
  hideAttendees = false,
}) => {
  const theme = useTheme();
  const stickerColor = categoryFill(category, theme);

  return (
    <Card
      sx={{
        width: 320,
        position: 'relative',
        overflow: 'visible',
        borderRadius: `${theme.shape.borderRadius}px`,
        border: theme.custom.surfaceBorder,
        boxShadow: theme.custom.stickerShadow,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Event photo on top */}
      <Box
        sx={{
          position: 'relative',
          height: 180,
          borderTopLeftRadius: `${theme.shape.borderRadius}px`,
          borderTopRightRadius: `${theme.shape.borderRadius}px`,
          overflow: 'hidden',
          borderBottom: theme.custom.surfaceBorder,
        }}
      >
        <Box
          component="img"
          src={image || '/Assets/heroImage.png'}
          loading="lazy"
          alt={name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Category sticker chip */}
        {category && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              px: 1.25,
              py: 0.25,
              borderRadius: 999,
              backgroundColor: stickerColor,
              border: theme.custom.surfaceBorder,
              boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
              color: 'text.primary',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </Box>
        )}
        <IconButton
          aria-label="bookmark event"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'background.paper',
            border: theme.custom.surfaceBorder,
            boxShadow: `2px 2px 0 ${theme.custom.surfaceBorderColor}`,
            '&:hover': { backgroundColor: theme.custom.cream },
          }}
        >
          <BookmarkAdd fontSize="small" />
        </IconButton>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" component="h3" sx={{ lineHeight: 1.2 }}>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {date ? new Date(date).toLocaleString() : ''}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          {description || 'No description available.'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
          {location && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Location
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {location}
              </Typography>
            </Box>
          )}
          {!hideAttendees && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Attendees
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {attendees.length > 0 ? attendees.length : 'N/A'}
              </Typography>
            </Box>
          )}
        </Box>

        {onButtonClick && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <GenericButton
              variant="primary"
              size="small"
              text={buttonText}
              onClick={onButtonClick}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GenericCard;

GenericCard.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  description: PropTypes.string,
  category: PropTypes.string,
  location: PropTypes.string,
  attendees: PropTypes.array,
  image: PropTypes.string,
  onButtonClick: PropTypes.func,
  buttonText: PropTypes.string,
  hideAttendees: PropTypes.bool,
};
