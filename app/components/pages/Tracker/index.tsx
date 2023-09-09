import keyBy from 'lodash/keyBy';
// import throttle from 'lodash/throttle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Dex } from './Dex';
import { Footer } from '../../library/Footer';
import { Loading } from '../../library/Loading';
import { Info } from './Info';
import { InfoDrawer } from './InfoDrawer';
// import { Nav } from '../../library/Nav';
import { NotFound } from '../NotFound';
import { Reload } from '../../library/Reload';
// import { SCROLL_DEBOUNCE, SHOW_SCROLL_THRESHOLD } from './Scroll';
import { SearchBar } from './SearchBar';
import { TrackerContextProvider, useTrackerContext } from './use-tracker';
import { useCaptures } from '../../../hooks/queries/captures';
import { useUser } from '../../../hooks/queries/users';
import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';

import { Box, Container } from '@mui/material';

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
  // const [showScroll, setShowScroll] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(0);

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

  const { showInfo, setShowInfo } = useLocalStorageContext();

  // const handleScroll = throttle(() => {
  //   if (!showScroll && trackerRef.current && trackerRef.current.scrollTop >= SHOW_SCROLL_THRESHOLD) {
  //     setShowScroll(true);
  //   } else if (showScroll && trackerRef.current && trackerRef.current.scrollTop < SHOW_SCROLL_THRESHOLD) {
  //     setShowScroll(false);
  //   }
  // }, SCROLL_DEBOUNCE);

  // const handleScrollButtonClick = useCallback(() => {
  //   if (trackerRef.current) {
  //     trackerRef.current.scrollTop = 0;
  //   }
  // }, [trackerRef.current]);

  if (userIsLoading || capturesIsLoading || !selectedPokemon) {
    return <Loading />;
  }

  if (!dex) {
    return <NotFound />;
  }

  return (
    <>
      <Box className="container" sx={{ marginRight: showInfo ? 'var(--drawer-width)' : 'var(--info-drawer-button-width)' }}>
        <SearchBar
          hideCaught={hideCaught}
          query={query}
          setHideCaught={setHideCaught}
          setQuery={setQuery}
        />

        <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
          <Reload />
          <Dex
            hideCaught={hideCaught}
            query={query}
            setHideCaught={setHideCaught}
            setQuery={setQuery}
            setSelectedPokemon={setSelectedPokemon}
          />
        </Container>

        <Footer />
      </Box>

      <InfoDrawer selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
    </>
  );
}
