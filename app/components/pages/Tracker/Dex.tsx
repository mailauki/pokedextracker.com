import keyBy from 'lodash/keyBy';
import { Link } from 'react-router-dom';
// import { Container } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Box } from './Box';
// import { BackToTop } from '../../library/BackToTop';
import { DonatedFlair } from '../../library/DonatedFlair';
import { FriendCode } from '../../library/FriendCode';
import { Header } from '../../library/Header';
import { Notification } from '../../library/Notification';
import { Progress } from '../../library/Progress';
import { ReactGA } from '../../../utils/analytics';
// import { Scroll } from './Scroll';
import { SearchResults } from './SearchResults';
import { groupBoxes } from '../../../utils/pokemon';
import { useTrackerContext } from './use-tracker';
import { useUser } from '../../../hooks/queries/users';

import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';

import { Box as Wrapper, Link as Anchor } from '@mui/material';

const DEFER_CUTOFF = 1;

interface Props {
  hideCaught: boolean;
  onScrollButtonClick: MouseEventHandler<HTMLDivElement>;
  query: string;
  setHideCaught: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
  showScrollButton: boolean;
}

export function Dex ({
  hideCaught,
  // onScrollButtonClick,
  query,
  setHideCaught,
  setQuery,
  setSelectedPokemon,
  // showScrollButton,
}: Props) {
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const user = useUser(username).data!;
  const dex = useMemo(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);

  const { captures } = useTrackerContext();

  const caught = useMemo(() => captures.filter(({ captured }) => captured).length, [captures]);
  const total = captures.length;

  const groupedCaptures = useMemo(() => groupBoxes(captures), [captures]);
  const boxes = useMemo(() => {
    return (
      <>
        {groupedCaptures.map((box, i) => (
          <Box
            captures={box}
            deferred={i > DEFER_CUTOFF}
            dexTotal={dex.total}
            key={box[0].pokemon.id}
            setSelectedPokemon={setSelectedPokemon}
          />
        ))}
      </>
    );
  }, [groupedCaptures]);

  return (
    <>
      <Notification />
      <Wrapper>
        <Header />
        <>
          <Anchor
            color="text.secondary"
            component={Link}
            onClick={() => ReactGA.event({ action: 'click view profile', category: 'User' })}
            to={`/u/${username}`}
          >
            /u/{username}
          </Anchor>
          <DonatedFlair user={user} />
        </>
        <FriendCode />
      </Wrapper>

      <Progress caught={caught} total={total} />

      {query.length > 0 || hideCaught ?
        <SearchResults
          captures={captures}
          hideCaught={hideCaught}
          query={query}
          setHideCaught={setHideCaught}
          setQuery={setQuery}
          setSelectedPokemon={setSelectedPokemon}
        /> :
        boxes
      }
    </>
  );
}
