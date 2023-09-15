import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { EvolutionFamily } from './EvolutionFamily';
import { InfoLocations } from './InfoLocations';
import { PokemonName } from '../../../library/PokemonName';
import { ReactGA } from '../../../../utils/analytics';
import { iconClass } from '../../../../utils/pokemon';
import { nationalId, padding, serebiiLink } from '../../../../utils/formatting';
import { useLocalStorageContext } from '../../../../hooks/contexts/use-local-storage-context';
import { usePokemon } from '../../../../hooks/queries/pokemon';
import { useUser } from '../../../../hooks/queries/users';

import type { Dex } from '../../../../types';

import { AppBar, Avatar, Box, Button, DialogContent, Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText, Skeleton, Stack, Toolbar, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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

export function Info ({ selectedPokemon, setSelectedPokemon }: Props) {
  const matches = useMediaQuery('(max-width:800px)');

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const user = useUser(username).data!;
  const dex = useMemo<Dex>(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);
  const { data: pokemon } = usePokemon(selectedPokemon, {
    dex_type: dex.dex_type.id,
  });

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

  const { showInfo, setShowInfo } = useLocalStorageContext();

  const handleInfoClick = () => {
    ReactGA.event({ action: showInfo ? 'collapse' : 'uncollapse', category: 'Info' });
    setShowInfo(!showInfo);
  };

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
          <Box>
            <Toolbar variant="dense" />
            <ListItem
              secondaryAction={
                <Typography variant="h5">{!pokemon ? <Skeleton animation="wave" width={30} /> : `#${padding(dex.dex_type.tags.includes('regional') ? (pokemon.dex_number === -1 ? '---' : pokemon.dex_number) : nationalId(pokemon.national_id), dex.total >= 1000 ? 4 : 3)}`}</Typography>
              }
            >
              <ListItemIcon>
                {!pokemon ? (
                  <Skeleton animation="wave" height={30} variant="circular" width={30} />
                ) : (
                  <Avatar
                    sx={{ backgroundColor: 'transparent' }}
                    variant="square"
                  >
                    <i className={iconClass(pokemon, dex)} />
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText primary={
                <Typography
                  sx={{ display: 'flex', alignItems: 'center' }} variant="h4"
                >
                  {!pokemon ? (
                    <Skeleton animation="wave" width="80%" />
                  ) : (
                    <PokemonName name={pokemon.name} />
                  )}
                </Typography>
              } />
            </ListItem>
          </Box>

          <DialogContent dividers>
            {!pokemon ? (
              <>
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 20 }} width="60%" />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="60%" />
              </>
            ) : (
              <InfoLocations locations={pokemon.locations} />
            )}
          </DialogContent>

          <Box>
            {!pokemon ? (
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-evenly"
                sx={{ p: 3 }}
              >
                <Skeleton animation="wave" height={30} variant="circular" width={30} />
                <Skeleton animation="wave" height={60} width={60} />
                <Skeleton animation="wave" height={30} variant="circular" width={30} />
                <Skeleton animation="wave" height={60} width={60} />
                <Skeleton animation="wave" height={30} variant="circular" width={30} />
              </Stack>
            ) : (
              <EvolutionFamily family={pokemon.evolution_family} setSelectedPokemon={setSelectedPokemon} />
            )}

            <Divider />

            <Stack direction="row">
              {!pokemon ? (
                <Button
                  size="large"
                  sx={{ p: 2, borderRadius: 0, width: '100%' }}
                >
                  <Skeleton animation="wave" width="80%" />
                </Button>
              ) : (
                <Button
                  color="inherit"
                  component="a"
                  endIcon={<OpenInNewIcon sx={{ color: 'text.disabled' }} />}
                  href={`http://bulbapedia.bulbagarden.net/wiki/${encodeURI(pokemon.name)}_(Pok%C3%A9mon)`}
                  onClick={() => ReactGA.event({ action: 'open Bulbapedia link', category: 'Info', label: pokemon.name })}
                  rel="noopener noreferrer"
                  size="large"
                  sx={{ p: 2, borderRadius: 0, width: '100%' }}
                  target="_blank"
                >
                  Bulbapedia
                </Button>
              )}

              <Divider flexItem orientation="vertical" />

              {!pokemon ? (
                <Button
                  size="large"
                  sx={{ p: 2, borderRadius: 0, width: '100%' }}
                >
                  <Skeleton animation="wave" width="80%" />
                </Button>
              ) : (
                <Button
                  color="inherit"
                  component="a"
                  endIcon={<OpenInNewIcon sx={{ color: 'text.disabled' }} />}
                  href={serebiiLink(serebiiPath, pokemon.national_id)}
                  onClick={() => ReactGA.event({ action: 'open Serebii link', category: 'Info', label: pokemon.name })}
                  rel="noopener noreferrer"
                  size="large"
                  sx={{ p: 2, borderRadius: 0, width: '100%' }}
                  target="_blank"
                >
                  Serebii
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Drawer>
  );
}
