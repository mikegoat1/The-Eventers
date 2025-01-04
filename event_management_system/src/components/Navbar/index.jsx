import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import GenericButton from '../GenericButton';

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
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));
const Navbar = ({ title }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
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
              sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}
            >
              <MenuIcon
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => setAnchorEl(event.currentTarget)}
              />
              <Menu id="mobile-menu" anchorEl={anchorEl} open={open}>
                <MenuItem onClick={handleClose}>Home</MenuItem>
                <MenuItem onClick={handleClose}>Events</MenuItem>
                <MenuItem onClick={handleClose}>Speakers</MenuItem>
                <MenuItem onClick={handleClose}>Blog</MenuItem>
                <MenuItem onClick={handleClose}>Help</MenuItem>
              </Menu>
            </IconButton>
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
            {/* <Box sx={{ flexGrow: 1 }} /> */}
            <Box sx={{ display: { xs: 'block', md: 'block' } }}>
              <Search sx={{ backgroundColor: '#F8F7F7' }}>
                <SearchIconWrapper>
                  <SearchIcon sx={{ color: '#0D0D0D' }} />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Event..."
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Box>
            <Box
              display="flex"
              gap="8%"
              sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}
            >
              <GenericButton color="inherit" variant="primary" text="Login" />
              <GenericButton
                color="inherit"
                variant="secondary"
                text="Register"
              />
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
