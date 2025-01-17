import classNames from 'classnames';
import keyBy from 'lodash/keyBy';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { PokemonName } from '../../library/PokemonName';
import { ReactGA } from '../../../utils/analytics';
import { iconClass } from '../../../utils/pokemon';
import { nationalId, padding } from '../../../utils/formatting';
import { useCreateCapture, useDeleteCapture } from '../../../hooks/queries/captures';
import { useDelayedRender } from '../../../hooks/use-delayed-render';
import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../../hooks/contexts/use-session';
import { useTrackerContext } from './use-tracker';
import { useUser } from '../../../hooks/queries/users';

import type { Dispatch, SetStateAction } from 'react';
import type { UICapture } from './use-tracker';

import { Avatar, Card, CardActionArea, CardActions, CardHeader, IconButton, Stack, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
  capture: UICapture | null;
  delay?: number;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
}

export function Pokemon ({ capture, delay = 0, setSelectedPokemon }: Props) {
  const render = useDelayedRender(delay);

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const { setCaptures } = useTrackerContext();
  const { setShowInfo } = useLocalStorageContext();

  const { session } = useSession();
  const user = useUser(username).data!;
  const dex = useMemo(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);

  const createCapturesMutation = useCreateCapture();
  const deleteCapturesMutation = useDeleteCapture();

  if (!render || !capture) {
    return (
      <div className="pokemon empty">
        <div className="set-captured" />
        <div className="set-captured-mobile" />
      </div>
    );
  }

  const handleSetCapturedClick = async () => {
    if (!session || session.id !== user.id) {
      return;
    }

    if (createCapturesMutation.isLoading || deleteCapturesMutation.isLoading) {
      // We're already making a request, so exit early.
      return;
    }

    createCapturesMutation.reset();
    deleteCapturesMutation.reset();

    const payload = { dex: dex.id, pokemon: [capture.pokemon.id] };

    setCaptures((prev) => prev.map((cap) => {
      if (cap.pokemon.id !== capture.pokemon.id) {
        // We're not modifying this one.
        return cap;
      }
      return {
        ...cap,
        pending: true,
        // We need to make it look like captured is false, otherwise, the pending styles won't show up.
        captured: false,
      };
    }));

    if (capture.captured) {
      await deleteCapturesMutation.mutateAsync({ username: user.username, slug, payload });
      ReactGA.event({ category: 'Pokemon', label: capture.pokemon.name, action: 'unmark' });
    } else {
      await createCapturesMutation.mutateAsync({ username: user.username, slug, payload });
      ReactGA.event({ category: 'Pokemon', label: capture.pokemon.name, action: 'mark' });
    }

    setCaptures((prev) => prev.map((cap) => {
      if (cap.pokemon.id !== capture.pokemon.id) {
        // We're not modifying this one.
        return cap;
      }
      return {
        ...cap,
        pending: false,
        captured: !capture.captured,
      };
    }));
  };

  const handleSetInfoClick = () => {
    ReactGA.event({ action: 'show info', category: 'Pokemon', label: capture.pokemon.name });

    setSelectedPokemon(capture.pokemon.id);
    setShowInfo(true);
  };

  const classes = {
    pokemon: true,
    viewing: !session || session.id !== user.id,
    captured: capture.captured,
    pending: capture.pending,
  };

  const regional = dex.dex_type.tags.includes('regional');
  const idToDisplay = regional ? (capture.pokemon.dex_number === -1 ? '---' : capture.pokemon.dex_number) : nationalId(capture.pokemon.national_id);
  const paddingDigits = dex.total >= 1000 ? 4 : 3;

  return (
    <Card
      className={classNames(classes)}
      elevation={capture.captured ? 0 : 2}
      sx={{
        position: 'relative',
        backgroundColor: capture.captured ? 'primary.hightlight' : '',
      }}
    >
      <CardActionArea className="set-captured" onClick={handleSetCapturedClick}>
        <div className="pokemon-card-mobile">
          <CardHeader
            avatar={
              <Avatar
                sx={{ backgroundColor: 'transparent' }}
                variant="square"
              >
                <i className={iconClass(capture.pokemon, dex)} />
              </Avatar>
            }
            subheader={
              <Typography
                sx={{ m: 1.5 }}
                variant="body2"
              >
                #{padding(idToDisplay, paddingDigits)}
              </Typography>
            }
            sx={{ height: '100%' }}
            title={
              <Typography
                fontWeight={500}
                sx={{ m: 1.5, display: 'flex', alignItems: 'center' }}
                variant="body1"
              >
                <PokemonName name={capture.pokemon.name} />
              </Typography>
            }
          />
        </div>

        <div className="pokemon-card">
          <Avatar
            sx={{ height: '100%', width: '100%', backgroundColor: 'transparent' }}
            variant="square"
          >
            <i className={iconClass(capture.pokemon, dex)} />
          </Avatar>

          <Stack
            alignItems="center"
            direction="column"
            height="var(--pokemon-box-size)"
            justifyContent="space-between"
            sx={{
              bgcolor: 'transparent',
              position: 'absolute',
              top: 0, left: 0,
            }}
            width="100%"
          >
            <Typography
              fontWeight={500}
              sx={{ m: 1.5, display: 'flex', alignItems: 'center' }}
              variant="body2"
            >
              <PokemonName name={capture.pokemon.name} />
            </Typography>

            <Typography
              sx={{ m: 1.5 }}
              variant="body2"
            >
              #{padding(idToDisplay, paddingDigits)}
            </Typography>
          </Stack>
        </div>
      </CardActionArea>

      <CardActions sx={{ position: 'absolute', bottom: 0, right: 0, p: 0.15 }}>
        <IconButton onClick={handleSetInfoClick}>
          <InfoIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
