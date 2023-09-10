import keyBy from 'lodash/keyBy';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { DexIndicator } from './DexIndicator';
import { DonatedFlair } from './DonatedFlair';
import { ReactGA } from '../../utils/analytics';
import { Share } from './Share';
import { useSession } from '../../hooks/contexts/use-session';
import { useUser } from '../../hooks/queries/users';

import type { Dex } from '../../types';

import { ClickAwayListener, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { Link, Twitter } from '@mui/icons-material';

interface Props {
  profile?: boolean;
}

export function Header ({ profile = false }: Props) {
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const { session } = useSession();
  const user = useUser(username).data!;
  const dex = useMemo<Dex | null>(() => !profile ? keyBy(user.dexes, 'slug')[slug] : null, [profile, user, slug]);

  const [showShare, setShowShare] = useState(false);

  const handleTweetClick = () => ReactGA.event({ action: 'click tweet', category: 'Share' });

  const ownPage = session?.id === user.id;

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      sx={{ mt: 1 }}
    >
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        useFlexGap
      >
        <Typography color="primary" sx={{ mr: 1 }} variant="h4">
          {dex?.title || `${user.username}'s Profile`}
        </Typography>

        <Stack direction="row">
          <ClickAwayListener onClickAway={() => setShowShare(false)}>
            <div>
              <Tooltip
                arrow
                disableFocusListener
                disableHoverListener
                onClose={() => setShowShare(false)}
                open={showShare}
                title={<Share profile={profile} />}
              >
                <IconButton
                  onClick={() => setShowShare(true)}
                  size="small"
                >
                  <Link fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>

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
        </Stack>
      </Stack>

      {profile && <DonatedFlair user={user} />}

      {dex && <DexIndicator dex={dex} />}
    </Stack>
  );
}
