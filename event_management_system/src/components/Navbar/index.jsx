import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Divider,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Avatar,
  Button,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Check as CheckIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import GenericButton from '../GenericButton';
import axios from '../../lib/axios';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#FBEAEA', 0.15),
  border: '1px solid #BDBDBD',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    border: '2px solid #FF5722',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#0D0D0D',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const formatReminderDate = (date) =>
  new Date(date).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

const Navbar = ({ title, user = null }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [reminderMenuAnchorEl, setReminderMenuAnchorEl] = useState(null);
  const [query, setQuery] = useState('');
  const [searchEventResults, setSearchEventResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dueReminders, setDueReminders] = useState([]);
  const [reminderError, setReminderError] = useState('');
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  const isReminderMenuOpen = Boolean(reminderMenuAnchorEl);
  const open = Boolean(anchorEl);

  const loadDueReminders = useCallback(async () => {
    if (!user) {
      setDueReminders([]);
      setReminderError('');
      return;
    }

    try {
      const response = await axios.get('/reminders?state=due');
      setDueReminders(response.data.reminders || []);
      setReminderError('');
    } catch (err) {
      setReminderError(
        err.response?.data?.message || 'Unable to load reminders'
      );
    }
  }, [user]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 1) {
        axios
          .get(`/search?keyword=${encodeURIComponent(query)}`)
          .then((res) => setSearchEventResults(res.data))
          .catch((err) => console.error('Error fetching search results:', err));
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    loadDueReminders();
    const intervalId = setInterval(loadDueReminders, 60000);
    return () => clearInterval(intervalId);
  }, [loadDueReminders]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
  };
  const handleReminderMenuOpen = (event) => {
    setReminderMenuAnchorEl(event.currentTarget);
    loadDueReminders();
  };
  const handleReminderMenuClose = () => {
    setReminderMenuAnchorEl(null);
  };
  const handleDismissReminder = async (event, reminderId) => {
    event.stopPropagation();

    try {
      await axios.patch(`/reminders/${reminderId}`);
      setDueReminders((reminders) =>
        reminders.filter((reminder) => reminder._id !== reminderId)
      );
    } catch (err) {
      setReminderError(
        err.response?.data?.message || 'Unable to dismiss reminder'
      );
    }
  };
  const goToReminderEvent = (reminder) => {
    const eventId = reminder.eventId?._id || reminder.eventId;
    handleReminderMenuClose();

    if (eventId) {
      router.push(`/events/${eventId}`);
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
      handleProfileMenuClose();
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const goToProfile = () => {
    handleProfileMenuClose();
    router.push('/profile');
  };
  const loginOnClick = () => {
    router.push('/login');
  };
  const registerOnClick = () => {
    router.push('/register');
  };
  const goHome = () => {
    handleClose();
    router.push('/');
  };
  const goToEvents = () => {
    handleClose();
    router.push('/events');
  };
  const goToCalendar = () => {
    handleClose();
    router.push('/events/calendar');
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#F5F3F3',
            }}
          >
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}
            >
              <MenuIcon
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ color: '#FF5722' }}
              />
            </IconButton>
            <Menu
              id="mobile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem sx={{ color: '#000' }} onClick={loginOnClick}>
                Login
              </MenuItem>
              <MenuItem sx={{ color: '#000' }} onClick={registerOnClick}>
                Register
              </MenuItem>
              <MenuItem sx={{ color: '#000' }} onClick={goHome}>
                Home
              </MenuItem>
              <MenuItem sx={{ color: '#000' }} onClick={goToEvents}>
                Events
              </MenuItem>
              <MenuItem sx={{ color: '#000' }} onClick={goToCalendar}>
                Calendar
              </MenuItem>
            </Menu>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                className="navbarTitle"
                variant="h6"
                noWrap
                component="div"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: '#080808',
                  fontWeight: 'medium',
                  lineHeight: '18px',
                  letterSpacing: '0.5%',
                }}
              >
                {title}
              </Typography>
              <Image
                src="/Assets/Logo1.png"
                width={25}
                height={25}
                alt="GatherHub logo"
              />
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'block' } }}>
              <Search sx={{ backgroundColor: '#F8F7F7' }}>
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: '#0D0D0D' }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Event..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  inputProps={{ 'aria-label': 'search' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {searchFocused &&
                  query.length > 0 &&
                  searchEventResults.length > 0 && (
                    <Box
                      sx={{
                        borderRadius: '2%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: '#F8F7F7',
                        border: '1px solid #BDBDBD',
                        color: '#080808',
                        fontWeight: 'medium',
                        lineHeight: '18px',
                        letterSpacing: '0.5%',
                        zIndex: 10,
                        mt: 1,
                        p: 1,
                      }}
                    >
                      {searchEventResults.map((event) => (
                        <MenuItem
                          key={event._id}
                          id={event._id}
                          onClick={() =>
                            router.push({
                              pathname: '/events/[id]',
                              query: { id: event._id },
                            })
                          }
                          variant="body2"
                        >
                          {event.name}
                        </MenuItem>
                      ))}
                    </Box>
                  )}
              </Search>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                alignItems: 'center',
                mr: 2,
              }}
            >
              <Button onClick={goHome} sx={{ color: '#000' }}>
                Home
              </Button>
              <Button onClick={goToEvents} sx={{ color: '#000' }}>
                Events
              </Button>
              <Button onClick={goToCalendar} sx={{ color: '#000' }}>
                Calendar
              </Button>
            </Box>
            <Box
              sx={{
                display: { xs: user ? 'flex' : 'none', md: 'flex' },
                gap: { xs: 1, md: 2 },
                alignItems: 'center',
                mr: { xs: 0, md: 2 },
              }}
            >
              <Menu
                anchorEl={profileMenuAnchorEl}
                open={isProfileMenuOpen}
                onClose={handleProfileMenuClose}
                // anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                // transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={goToProfile}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
              {user && (
                <>
                  <Tooltip title="Reminders">
                    <IconButton
                      size="medium"
                      aria-label="reminders"
                      aria-controls="reminder-menu"
                      aria-haspopup="true"
                      onClick={handleReminderMenuOpen}
                    >
                      {dueReminders.length > 0 ? (
                        <Badge
                          badgeContent={dueReminders.length}
                          color="error"
                          overlap="circular"
                        >
                          <NotificationsIcon sx={{ color: '#000' }} />
                        </Badge>
                      ) : (
                        <NotificationsIcon sx={{ color: '#000' }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Menu
                    id="reminder-menu"
                    anchorEl={reminderMenuAnchorEl}
                    open={isReminderMenuOpen}
                    onClose={handleReminderMenuClose}
                    PaperProps={{ sx: { width: 340, maxWidth: '90vw' } }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Due reminders
                      </Typography>
                    </Box>
                    <Divider />
                    {reminderError ? (
                      <MenuItem disabled>{reminderError}</MenuItem>
                    ) : dueReminders.length === 0 ? (
                      <MenuItem disabled>No due reminders</MenuItem>
                    ) : (
                      dueReminders.map((reminder) => {
                        const eventName =
                          reminder.eventId?.name || 'Event reminder';
                        const location = reminder.eventId?.location || 'TBD';

                        return (
                          <MenuItem
                            key={reminder._id}
                            onClick={() => goToReminderEvent(reminder)}
                            sx={{
                              alignItems: 'flex-start',
                              gap: 1,
                              whiteSpace: 'normal',
                            }}
                          >
                            <ListItemText
                              primary={eventName}
                              secondary={`${formatReminderDate(
                                reminder.remindAt
                              )} • ${location}`}
                              primaryTypographyProps={{ fontWeight: 600 }}
                              secondaryTypographyProps={{
                                sx: { whiteSpace: 'normal' },
                              }}
                            />
                            <Tooltip title="Dismiss reminder">
                              <IconButton
                                size="small"
                                aria-label={`Dismiss ${eventName}`}
                                onClick={(event) =>
                                  handleDismissReminder(event, reminder._id)
                                }
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </MenuItem>
                        );
                      })
                    )}
                  </Menu>
                </>
              )}
              {user ? (
                <IconButton
                  size="medium"
                  edge="end"
                  aria-label="account"
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar sx={{ bgcolor: '#FF5722' }}>
                    {user.username?.[0] || 'U'}
                  </Avatar>
                </IconButton>
              ) : (
                <>
                  <GenericButton
                    text="Login"
                    variant="primary"
                    onClick={loginOnClick}
                    size="small"
                  />
                  <GenericButton
                    variant="secondary"
                    text="Register"
                    onClick={registerOnClick}
                    size="small"
                  />
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  }),
};

export default Navbar;
