import find from 'lodash/find';
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

import { AppBar, BottomNavigation, BottomNavigationAction, Box, Dialog, DialogContent, DialogContentText, DialogTitle, Drawer, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import useMediaQuery from '@mui/material/useMediaQuery';

const SEREBII_LINKS: Record<string, string> = {
  x_y: 'pokedex-xy',
  omega_ruby_alpha_sapphire: 'pokedex-xy',
  sun_moon: 'pokedex-sm',
  ultra_sun_ultra_moon: 'pokedex-sm',
  lets_go_pikachu_eevee: 'pokedex-sm',
  sword_shield: 'pokedex-swsh',
  sword_shield_expansion_pass: 'pokedex-swsh',
  brilliant_diamond_shining_pearl: 'pokedex-swsh',
  legends_arceus: 'pokedex-swsh',
  scarlet_violet: 'pokedex-sv',
  home: 'pokedex-sv',
};

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

  const serebiiPath = useMemo(() => {
    if (!pokemon) {
      return '';
    }

    const swshLocation = find(pokemon.locations, (loc) => loc.game.game_family.id === 'sword_shield');
    const bdspLocation = find(pokemon.locations, (loc) => loc.game.game_family.id === 'brilliant_diamond_shining_pearl');
    const plaLocation = find(pokemon.locations, (loc) => loc.game.game_family.id === 'legends_arceus');
    const svLocation = find(pokemon.locations, (loc) => loc.game.game_family.id === 'scarlet_violet');

    if (dex.game.game_family.id === 'home' && !svLocation) {
      if (swshLocation && swshLocation.value.length > 0 && swshLocation.value[0] === 'Currently unavailable' && !bdspLocation && !plaLocation) {
        // If the Pokemon's location is 'Currently unavailable' for SwSh and they
        // don't have locations for any other gen8 game, that means they aren't
        // available in this generation, so they don't have a gen8 Serebii page.
        // Because of this, we go back to the SuMo Serebii links. This will
        // probably need to be updating with future generations.
        return 'pokedex-sm';
      }

      // This is a HOME dex, there is no SV location, and there is a gen8
      // location, so we use the SwSh link.
      return 'pokedex-swsh';
    }

    return SEREBII_LINKS[dex.game.game_family.id];
  }, [dex, pokemon]);

  const handleInfoClick = () => {
    ReactGA.event({ action: showInfo ? 'collapse' : 'uncollapse', category: 'Info' });
    setShowInfo(!showInfo);
  };

  // if (!pokemon) {
  //   return (
  //     <Drawer
  //       anchor="right"
  //       open={showInfo}
  //       sx={{
  //         flexShrink: 0,
  //         ['& .MuiDrawer-paper']: {
  //           zIndex: 1050,
  //         },
  //       }}
  //       variant="permanent"
  //     >
  //       <Stack alignItems="stretch" direction="row" justifyContent="space-between" sx={{ height: '100%', width: matches ? '100vw' : 'var(--drawer-width)' }}>
  //         <IconButton
  //           color="inherit"
  //           disableRipple
  //           onClick={handleInfoClick}
  //           size="small"
  //           sx={{
  //             backgroundColor: 'primary.main',
  //             borderRadius: 0,
  //             borderRight: '1px solid',
  //             borderColor: 'divider',
  //             color: 'primary.contrastText',
  //             width: 'var(--info-drawer-button-width)',
  //           }}
  //         >
  //           {showInfo ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
  //         </IconButton>

  //         <Stack
  //           direction="column"
  //           justifyContent="space-between"
  //           sx={{
  //             height: '100%',
  //             // width: matches ? 'var(--info-drawer-width-mobile)' : 'var(--info-drawer-width)',
  //             display: showInfo ? '' : 'none',
  //           }}
  //         >
  //           <Box>
  //             <Toolbar variant="dense" />
  //           </Box>
  //         </Stack>
  //       </Stack>
  //     </Drawer>
  //   );
  // }

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