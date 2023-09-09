// import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Info } from './Info';
// import { EvolutionFamily } from './EvolutionFamily';
// import { InfoLocations } from './InfoLocations';
// import { PokemonName } from '../../library/PokemonName';
import { ReactGA } from '../../../utils/analytics';
// import { iconClass } from '../../../utils/pokemon';
// import { nationalId, padding, serebiiLink } from '../../../utils/formatting';
import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { usePokemon } from '../../../hooks/queries/pokemon';
import { useUser } from '../../../hooks/queries/users';

import type { Dex } from '../../../types';

import { AppBar, Drawer, IconButton, Stack, Toolbar } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useMediaQuery from '@mui/material/useMediaQuery';

interface Props {
  selectedPokemon: number;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
}

export function InfoDrawer ({ selectedPokemon, setSelectedPokemon }: Props) {
  const matches = useMediaQuery('(max-width:800px)');

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const user = useUser(username).data!;
  const dex = useMemo<Dex>(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);
  const { data: pokemon } = usePokemon(selectedPokemon, {
    dex_type: dex.dex_type.id,
  });

  const { showInfo, setShowInfo } = useLocalStorageContext();

  const handleInfoClick = () => {
    ReactGA.event({ action: showInfo ? 'collapse' : 'uncollapse', category: 'Info' });
    setShowInfo(!showInfo);
  };

  if (!pokemon) {
    return (
      <Drawer
        anchor="right"
        open={showInfo}
        sx={{
          flexShrink: 0,
          ['& .MuiDrawer-paper']: {
            zIndex: 1050,
            width: showInfo && matches ? '100%' : 'fit-content',
          },
        }}
        variant="permanent"
      >
        <Stack
          alignItems="stretch"
          direction="row"
          justifyContent="space-between"
          sx={{ height: '100%' }}
        >
          <AppBar
            component="div"
            position="relative"
            sx={{
              flexDirection: 'row',
              width: 'fit-content',
              height: '100%',
            }}
          >
            <Toolbar
              disableGutters
              sx={{ flexDirection: 'row' }}
              variant="dense"
            >
              <IconButton
                color="inherit"
                disableRipple
                onClick={handleInfoClick}
                size="small"
                sx={{
                  borderRadius: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                {showInfo ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Toolbar>
          </AppBar>

          <Stack
            direction="column"
            justifyContent="space-between"
            sx={{
              height: '100%',
              width: matches ? '100%' : 'var(--info-drawer-width)',
              display: showInfo ? '' : 'none',
            }}
          >
          </Stack>
        </Stack>
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={showInfo}
      sx={{
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          zIndex: 1050,
          width: showInfo && matches ? '100%' : 'fit-content',
        },
      }}
      variant="permanent"
    >
      <Stack
        alignItems="stretch"
        direction="row"
        justifyContent="space-between"
        sx={{ height: '100%' }}
      >
        <AppBar
          component="div"
          position="relative"
          sx={{
            flexDirection: 'row',
            width: 'fit-content',
            height: '100%',
          }}
        >
          <Toolbar
            disableGutters
            sx={{ flexDirection: 'row' }}
            variant="dense"
          >
            <IconButton
              color="inherit"
              disableRipple
              onClick={handleInfoClick}
              size="small"
              sx={{
                borderRadius: 0,
                width: '100%',
                height: '100%',
              }}
            >
              {showInfo ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            height: '100%',
            width: matches ? '100%' : 'var(--info-drawer-width)',
            display: showInfo ? '' : 'none',
          }}
        >
          <Info selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
        </Stack>
      </Stack>
    </Drawer>
  );
}
