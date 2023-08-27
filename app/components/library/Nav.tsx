// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import { faCaretDown, faCog, faMoon, faSignOutAlt, faSun, faTh, faUser } from '@fortawesome/free-solid-svg-icons';
import { AppBar, Button, IconButton, ListItemIcon, Menu, MenuItem, Stack, Toolbar, Tooltip } from '@mui/material';
import LightIcon from '@mui/icons-material/Brightness4';
import DarkIcon from '@mui/icons-material/Brightness7';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from 'react';

import { ReactGA } from '../../utils/analytics';
import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../hooks/contexts/use-session';
import type { MouseEvent } from 'react';
import { Logout, Person, Settings } from '@mui/icons-material';

export function Nav () {
  const { isNightMode, setIsNightMode } = useLocalStorageContext();
  const { session, sessionUser, setToken } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleNightModeClick = () => setIsNightMode(!isNightMode);

  const handleSignOutClick = () => {
    ReactGA.event({ action: 'sign out', category: 'Session' });
    setToken(null);
  };

  // const links = (
  //   <>
  //     <Link to="/">Pokédex Tracker</Link>
  //     <a className="tooltip tooltip-below" onClick={handleNightModeClick}>
  //       <FontAwesomeIcon icon={isNightMode ? faSun : faMoon} />
  //       <span className="tooltip-text">Night Mode {isNightMode ? 'Off' : 'On'}</span>
  //     </a>
  //     <a href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">Patreon</a>
  //   </>
  // );

  // if (session && sessionUser) {
  //   return (
  //     <nav>
  //       {links}
  //       <div className="dropdown">
  //         <a href="#">{session.username} <FontAwesomeIcon icon={faCaretDown} /></a>
  //         <ul>
  //           <div className="dropdown-scroll">
  //             {sessionUser.dexes.map((dex) => <li key={dex.id}><Link to={`/u/${session.username}/${dex.slug}`}><FontAwesomeIcon icon={faTh} /> {dex.title}</Link></li>)}
  //           </div>
  //           <li><Link to={`/u/${session.username}`}><FontAwesomeIcon icon={faUser} /> Profile</Link></li>
  //           <li><Link to="/account"><FontAwesomeIcon icon={faCog} /> Account Settings</Link></li>
  //           <li><a onClick={handleSignOutClick}><FontAwesomeIcon icon={faSignOutAlt} /> Sign Out</a></li>
  //         </ul>
  //       </div>
  //     </nav>
  //   );
  // }

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
      <Tooltip arrow title={`Dark Mode ${isNightMode ? 'Off' : 'On'}`}>
        <IconButton color="inherit" onClick={handleNightModeClick} size="small">
          {isNightMode ? <DarkIcon fontSize="small" /> : <LightIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
      <Button color="inherit" component="a" href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">Patreon</Button>
    </>
  );

  if (session && !sessionUser) {
    return (
      // <nav>
      //   <Link to="/">Pokédex Tracker</Link>
      // </nav>
      <AppBar color="secondary" position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
          <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
          <Stack alignItems="center" direction="row">
            {nav}
          </Stack>
        </Toolbar>
      </AppBar>
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
      <AppBar color="secondary" position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
          <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
          <Stack alignItems="center" direction="row">
            {nav}
            {menu}
          </Stack>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    // <nav>
    //   {links}
    //   <Link to="/login">Login</Link>
    //   <Link to="/register">Register</Link>
    // </nav>
    <AppBar color="secondary" position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }} variant="dense">
        <Button color="inherit" component={Link} to="/">Pokédex Tracker</Button>
        <Stack alignItems="center" direction="row">
          {nav}
          {signin}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
