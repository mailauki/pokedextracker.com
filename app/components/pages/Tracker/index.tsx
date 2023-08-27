import keyBy from 'lodash/keyBy';
import throttle from 'lodash/throttle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';

import { Dex } from './Dex';
import { Footer } from '../../library/Footer';
import { Info } from './Info';
import { Nav } from '../../library/Nav';
import { NotFound } from '../NotFound';
import { Reload } from '../../library/Reload';
import { SCROLL_DEBOUNCE, SHOW_SCROLL_THRESHOLD } from './Scroll';
import { SearchBar } from './SearchBar';
import { TrackerContextProvider, useTrackerContext } from './use-tracker';
import { useCaptures } from '../../../hooks/queries/captures';
import { useUser } from '../../../hooks/queries/users';

// To enable the inner component to access the context value, it needs to be nested under the provider, so we need this
// wrapper component to add that nesting.
export function Tracker () {
  return (
    <TrackerContextProvider>
      <TrackerInner />
    </TrackerContextProvider>
  );
}

export function TrackerInner () {
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const trackerRef = useRef<HTMLDivElement>(null);

  const { setCaptures } = useTrackerContext();

  const { data: user, isLoading: userIsLoading } = useUser(username);
  const { data: capturesFromServer, isLoading: capturesIsLoading } = useCaptures(username, slug);

  const dex = useMemo(() => keyBy(user?.dexes, 'slug')[slug], [user, slug]);

  const [query, setQuery] = useState('');
  const [hideCaught, setHideCaught] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(0);

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = `${username}'s Living Dex | Pokédex Tracker`;
  }, []);

  useEffect(() => {
    if (trackerRef.current) {
      trackerRef.current.scrollTop = 0;
    }
  }, [query]);

  useEffect(() => {
    if (capturesFromServer) {
      setCaptures(capturesFromServer);
      setSelectedPokemon(capturesFromServer[0].pokemon.id);
    }
  }, [capturesFromServer]);

  const handleScroll = throttle(() => {
    if (!showScroll && trackerRef.current && trackerRef.current.scrollTop >= SHOW_SCROLL_THRESHOLD) {
      setShowScroll(true);
    } else if (showScroll && trackerRef.current && trackerRef.current.scrollTop < SHOW_SCROLL_THRESHOLD) {
      setShowScroll(false);
    }
  }, SCROLL_DEBOUNCE);

  const handleScrollButtonClick = useCallback(() => {
    if (trackerRef.current) {
      trackerRef.current.scrollTop = 0;
    }
  }, [trackerRef.current]);

  if (userIsLoading || capturesIsLoading || !selectedPokemon) {
    return <div className="loading">Loading...</div>;
  }

  if (!dex) {
    return <NotFound />;
  }

  return (
    <div className="tracker-container">
      <Nav />
      <Reload />
      <div className="tracker">
        <div className="dex-wrapper">
          <SearchBar
            hideCaught={hideCaught}
            query={query}
            setHideCaught={setHideCaught}
            setQuery={setQuery}
          />
          {/* <div className="dex-column" onScroll={handleScroll} ref={trackerRef}>
            <Dex
              hideCaught={hideCaught}
              onScrollButtonClick={handleScrollButtonClick}
              query={query}
              setHideCaught={setHideCaught}
              setQuery={setQuery}
              setSelectedPokemon={setSelectedPokemon}
              showScrollButton={showScroll}
            />
            <Footer />
          </div> */}
          <Dex
            hideCaught={hideCaught}
            onScrollButtonClick={handleScrollButtonClick}
            query={query}
            setHideCaught={setHideCaught}
            setQuery={setQuery}
            setSelectedPokemon={setSelectedPokemon}
            showScrollButton={showScroll}
          />
          {/* <Drawer
            anchor="right"
            open={open}
            sx={{
              flexShrink: 0,
              ['& .MuiDrawer-paper']: {
                // backgroundColor: 'primary.dark',
                // color: 'primary.contrastText',
                zIndex: 1050,
              },
            }}
            variant="permanent"
          >
            <Stack alignItems="stretch" direction="row" justifyContent="space-between" sx={{ height: '100%' }}>
              <IconButton
                color="inherit"
                disableRipple
                onClick={() => setOpen(!open)}
                size="small"
                sx={{ borderRadius: 0, borderRight: '1px solid', borderColor: 'divider' }}
              >
                {open ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
              </IconButton>

              <List sx={{ width: '100%', display: open ? '' : 'none' }}>
                <Toolbar />
                {['One Fish', 'Two Fish', 'Red Fish', 'Blue Fish'].map((text) => (
                  <ListItem disablePadding key={text}>
                    <ListItemButton>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Drawer> */}
        </div>
        <Info selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
      </div>
    </div>
  );
}
