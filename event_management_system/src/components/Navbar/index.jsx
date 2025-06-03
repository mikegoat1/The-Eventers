import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  MenuItem,
  Menu,
  Avatar,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
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
const Navbar = ({ title, user }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [query, setQuery] = useState('');
  const [searchEventResults, setSearchEventResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const isProfileMenuOpen = Boolean(profileMenuAnchorEl);
  const open = Boolean(anchorEl);

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

  console.log('searchEventResults', searchEventResults);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchorEl(null);
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
              <MenuItem onClick={handleClose}>Login</MenuItem>
              <MenuItem onClick={handleClose}>Register</MenuItem>
              <MenuItem onClick={handleClose}>Home</MenuItem>
              <MenuItem onClick={handleClose}>Events</MenuItem>
              <MenuItem onClick={handleClose}>Help</MenuItem>
            </Menu>
            <Box sx={{ display: 'flex', alignItems: 'center' ,gap: 1 }}>
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
              <Image src="/Assets/Logo1.png" width={25} height={25} />
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
              display="flex"
              gap="8%"
              sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
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
                    size='small'
                  />
                  <GenericButton
                    variant="secondary"
                    text="Register"
                    onClick={registerOnClick}
                    size='small'
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
};

export default Navbar;
