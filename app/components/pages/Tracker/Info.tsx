import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { Avatar, Button, DialogContent, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { EvolutionFamily } from './EvolutionFamily';
import { InfoLocations } from './InfoLocations';
import { PokemonName } from '../../library/PokemonName';
import { ReactGA } from '../../../utils/analytics';
import { iconClass } from '../../../utils/pokemon';
import { nationalId, padding, serebiiLink } from '../../../utils/formatting';
import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { usePokemon } from '../../../hooks/queries/pokemon';
import { useUser } from '../../../hooks/queries/users';

import type { Dex } from '../../../types';

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

  if (!pokemon) {
    return (
      <div className={`info ${showInfo ? '' : 'collapsed'}`}>
        <div className="info-collapse" onClick={handleInfoClick}>
          <FontAwesomeIcon icon={showInfo ? faCaretRight : faCaretLeft} />
        </div>

        <div className="info-main" />
      </div>
    );
  }

  return (
    // <div className={`info ${showInfo ? '' : 'collapsed'}`}>
    //   <div className="info-collapse" onClick={handleInfoClick}>
    //     <FontAwesomeIcon icon={showInfo ? faCaretRight : faCaretLeft} />
    //   </div>

    //   <div className="info-main">
    //     <div className="info-header">
    //       <i className={iconClass(pokemon, dex)} />
    //       <h1><PokemonName name={pokemon.name} /></h1>
    //       <h2>#{padding(dex.dex_type.tags.includes('regional') ? (pokemon.dex_number === -1 ? '---' : pokemon.dex_number) : nationalId(pokemon.national_id), dex.total >= 1000 ? 4 : 3)}</h2>
    //     </div>

    //     <InfoLocations locations={pokemon.locations} />

    //     <EvolutionFamily family={pokemon.evolution_family} setSelectedPokemon={setSelectedPokemon} />

    //     <div className="info-footer">
    //       <a
    //         href={`http://bulbapedia.bulbagarden.net/wiki/${encodeURI(pokemon.name)}_(Pok%C3%A9mon)`}
    //         onClick={() => ReactGA.event({ action: 'open Bulbapedia link', category: 'Info', label: pokemon.name })}
    //         rel="noopener noreferrer"
    //         target="_blank"
    //       >
    //         Bulbapedia <FontAwesomeIcon icon={faLongArrowAltRight} />
    //       </a>
    //       <a
    //         href={serebiiLink(serebiiPath, pokemon.national_id)}
    //         onClick={() => ReactGA.event({ action: 'open Serebii link', category: 'Info', label: pokemon.name })}
    //         rel="noopener noreferrer"
    //         target="_blank"
    //       >
    //         Serebii <FontAwesomeIcon icon={faLongArrowAltRight} />
    //       </a>
    //     </div>
    //   </div>
    // </div>
    <Drawer
      anchor="right"
      open={showInfo}
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
          onClick={handleInfoClick}
          size="small"
          sx={{ borderRadius: 0, borderRight: '1px solid', borderColor: 'divider' }}
        >
          {showInfo ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>

        <DialogContent dividers={scroll === 'paper'} sx={{ width: '100%', display: showInfo ? '' : 'none' }}>
          <List>
            <Toolbar />

            <ListItem
              secondaryAction={
                <Typography variant="h5">#{padding(dex.dex_type.tags.includes('regional') ? (pokemon.dex_number === -1 ? '---' : pokemon.dex_number) : nationalId(pokemon.national_id), dex.total >= 1000 ? 4 : 3)}</Typography>
              }
            >
              <ListItemIcon>
                <i className={iconClass(pokemon, dex)} />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="h3">{pokemon.name}</Typography>}
              />
            </ListItem>

            <InfoLocations locations={pokemon.locations} />

            <EvolutionFamily family={pokemon.evolution_family} setSelectedPokemon={setSelectedPokemon} />

            <Stack direction="row">
              <Button
                color="inherit"
                component="a"
                endIcon={<OpenInNewIcon sx={{ color: 'text.disabled' }} />}
                href={`http://bulbapedia.bulbagarden.net/wiki/${encodeURI(pokemon.name)}_(Pok%C3%A9mon)`}
                onClick={() => ReactGA.event({ action: 'open Bulbapedia link', category: 'Info', label: pokemon.name })}
                rel="noopener noreferrer"
                size="large"
                sx={{ borderRadius: 0, width: '100%' }}
                target="_blank"
              >
                Bulbapedia
              </Button>
              <Button
                color="inherit"
                component="a"
                endIcon={<OpenInNewIcon sx={{ color: 'text.disabled' }} />}
                href={serebiiLink(serebiiPath, pokemon.national_id)}
                onClick={() => ReactGA.event({ action: 'open Serebii link', category: 'Info', label: pokemon.name })}
                rel="noopener noreferrer"
                size="large"
                sx={{ borderRadius: 0, width: '100%' }}
                target="_blank"
              >
                Serebii
              </Button>
            </Stack>
          </List>
        </DialogContent>
      </Stack>
    </Drawer>
  );
}
