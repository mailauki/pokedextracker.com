import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { EvolutionFamily } from './EvolutionFamily';
import { InfoLocations } from './InfoLocations';
import { ReactGA } from '../../../../utils/analytics';
import { iconClass } from '../../../../utils/pokemon';
import { nationalId, padding, serebiiLink } from '../../../../utils/formatting';

import { Box, Button, Divider, Skeleton, Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// interface Props {
//   pokemon: any;
//   selectedPokemon: number;
// }
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
  pokemon: any;
  selectedPokemon: number;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
}

export function InfoFooter ({ pokemon, selectedPokemon, setSelectedPokemon }) {
  // const { username, slug } = useParams<{ username: string; slug: string }>();

  // const user = useUser(username).data!;
  // const dex = useMemo<Dex>(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);
  // const { data: pokemon } = usePokemon(selectedPokemon, {
  //   dex_type: dex.dex_type.id,
  // });

  return (
    <Box>
      {!pokemon ? <Skeleton /> : <EvolutionFamily family={pokemon.evolution_family} setSelectedPokemon={setSelectedPokemon} />}

      <Divider />

      <Stack direction="row">
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

        <Divider flexItem orientation="vertical" />

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
      </Stack>
    </Box>
  );
}
