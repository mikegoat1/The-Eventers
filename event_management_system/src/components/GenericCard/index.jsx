

import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import AspectRatio from '@mui/joy/AspectRatio';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import Box from '@mui/material/Box';
import GenericButton from '@/components/GenericButton';


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
}) => {
  return (
    <Card sx={{ width: 320, position: 'relative' }}>
      <div>
        <Typography level="title-lg">{name}</Typography>
        <Typography level="body-sm">
          {date ? new Date(date).toLocaleString() : ''}
        </Typography>
        <Typography level="body-md" sx={{ marginTop: 1 }}>
          {description || 'No description available.'}
        </Typography>
        <IconButton
          aria-label="bookmark event"
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            position: 'absolute',
            top: '0.875rem',
            right: '0.5rem',
          }}
        >
          <BookmarkAdd />
        </IconButton>
      </div>
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={
            image ||
            'https://picsum.photos/600/400?random=1'
          }
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Category:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
            {category || 'N/A'}
          </Typography>
          <Typography level="body-xs">Location:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
            {location || 'N/A'}
          </Typography>
        </div>
        <Box>
          <Typography level="body-xs">Attendees:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
            {attendees.length > 0 ? `Attending: ${attendees.length}` : 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 1 }}>
          <GenericButton
            variant="primary"
            size="small"
            text={buttonText}
            onClick={onButtonClick}
          />
        </Box>
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
};