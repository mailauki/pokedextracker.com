import { Link } from 'react-router-dom';
import { useState } from 'react';

import { ReactGA } from '../../utils/analytics';
import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../hooks/contexts/use-session';
import type { MouseEvent } from 'react';

import { AppBar, Button, IconButton, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Tooltip } from '@mui/material';
import LightIcon from '@mui/icons-material/Brightness4';
import DarkIcon from '@mui/icons-material/Brightness7';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Logout, Person, Settings } from '@mui/icons-material';

interface Props {
  darkMode: boolean;
}

export function Nav ({ darkMode }: Props) {
  const { isNightMode, setIsNightMode } = useLocalStorageContext();
  const { session, sessionUser, setToken } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNightModeClick = () => setIsNightMode(!isNightMode);

  const handleSignOutClick = () => {
    ReactGA.event({ action: 'sign out', category: 'Session' });
    setToken(null);
  };

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signin = (
    <>
      <Button color="inherit" component={Link} to="/login">Login</Button>
      <Button color="inherit" component={Link} to="/register">Register</Button>
    </>
  );

  const nav = (
    <>
      <Tooltip arrow title={`Dark Mode ${darkMode ? 'Off' : 'On'}`}>
        <IconButton color="inherit" onClick={handleNightModeClick} size="small">
          {darkMode ? <DarkIcon fontSize="small" /> : <LightIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Button color="inherit" component="a" href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">Patreon</Button>
    </>
  );

  if (session && !sessionUser) {
    return (
      <>
        <AppBar color="secondary" position="fixed">
          <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
            <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
            <Stack alignItems="center" direction="row">
              {nav}
            </Stack>
          </Toolbar>
        </AppBar>
      </>
    );
  }

  if (session && sessionUser) {
    const menu = (
      <>
        <Button color="inherit" onClick={handleClick}>{session.username}<ArrowDropDownIcon fontSize="small" /></Button>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          id="menu-appbar"
          keepMounted
          onClick={handleClose}
          onClose={handleClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuItem component={Link} onClick={handleClose} to={`/u/${session.username}`}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem component={Link} onClick={handleClose} to="/account">
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>
          <MenuItem onClick={handleSignOutClick}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </>
    );

    return (
      <>
        <AppBar color="secondary" position="fixed">
          <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
            <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
            <Stack alignItems="center" direction="row">
              {nav}
              {menu}
            </Stack>
          </Toolbar>
        </AppBar>
      </>
    );
  }

  return (
    <>
      <AppBar color="secondary" position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
          <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
          <Stack alignItems="center" direction="row">
            {nav}
            {signin}
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
