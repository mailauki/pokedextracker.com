import keyBy from 'lodash/keyBy';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faLink } from '@fortawesome/free-solid-svg-icons';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { IconButton, Stack, Typography } from '@mui/material';
import { Link, Twitter } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { DexIndicator } from './DexIndicator';
import { DonatedFlair } from './DonatedFlair';
import { ReactGA } from '../../utils/analytics';
import { Share } from './Share';
import { useSession } from '../../hooks/contexts/use-session';
import { useUser } from '../../hooks/queries/users';

import type { Dex } from '../../types';
import type { MouseEvent } from 'react';

interface Props {
  profile?: boolean;
}

export function Header ({ profile = false }: Props) {
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const { session } = useSession();
  const user = useUser(username).data!;
  const dex = useMemo<Dex | null>(() => !profile ? keyBy(user.dexes, 'slug')[slug] : null, [profile, user, slug]);

  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    const closeShare = () => setShowShare(false);

    window.addEventListener('click', closeShare);

    return () => window.removeEventListener('click', closeShare);
  }, []);

  const handleShareClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();

    ReactGA.event({ action: showShare ? 'close' : 'open', category: 'Share' });

    setShowShare((prev) => !prev);
  };

  const handleTweetClick = () => ReactGA.event({ action: 'click tweet', category: 'Share' });

  const ownPage = session?.id === user.id;

  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      <Stack alignItems="center" direction="row" flexWrap="wrap" useFlexGap>
        <Typography color="primary" sx={{ mr: 1 }} variant="h4">
          {dex?.title || `${user.username}'s Profile`}
        </Typography>

        <div className="share-container">
          <IconButton
            component="a"
            onClick={handleShareClick}
            size="small"
          >
            <Link fontSize="small" />
          </IconButton>

          <IconButton
            component="a"
            href={`https://twitter.com/intent/tweet?text=Check out ${ownPage ? 'my' : `${user.username}'s`} ${profile ? 'profile' : 'living dex progress'} on @PokedexTracker! https://pokedextracker.com/u/${user.username}${dex ? `/${dex.slug}` : ''}`}
            onClick={handleTweetClick}
            rel="noopener noreferrer"
            size="small"
            target="_blank"
          >
            <Twitter fontSize="small" />
          </IconButton>
        </div>
      </Stack>

      {profile && <DonatedFlair user={user} />}

      {dex && <DexIndicator dex={dex} />}
    </Stack>
  );
}
