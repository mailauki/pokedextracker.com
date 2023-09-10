import keyBy from 'lodash/keyBy';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Evolutions } from './Evolutions';
import { iconClass } from '../../../../utils/pokemon';
import { useUser } from '../../../../hooks/queries/users';

import type { Dispatch, SetStateAction } from 'react';
import type { EvolutionFamily as EvolutionFamilyType } from '../../../../types';

import { IconButton, Stack, Typography } from '@mui/material';

interface Props {
  family: EvolutionFamilyType;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
}

export function EvolutionFamily ({ family, setSelectedPokemon }: Props) {
  const { username, slug } = useParams<{ username: string; slug: string }>();

  const user = useUser(username).data!;
  const dex = useMemo(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);

  let column1 = null;
  let column2 = null;

  if (family.pokemon.length > 1) {
    column1 = (
      <Stack
        direction="column"
        justifyContent={family.pokemon[1].length > 1 ? 'space-between' : 'center'}
      >
        {family.pokemon[1].map((pokemon) => (
          <IconButton disableRipple key={pokemon.id} onClick={() => setSelectedPokemon(pokemon.id)} title={pokemon.name}>
            <i className={iconClass(pokemon, dex)} />
          </IconButton>
        ))}
      </Stack>
    );
  }

  if (family.pokemon.length > 2) {
    column2 = (
      // styling hack for mr.rime
      <Stack
        direction="column"
        justifyContent={family.pokemon[2].length > 1 || family.pokemon[2][0].national_id === 866 ? 'space-between' : 'center'}
      >
        {family.pokemon[2][0].national_id === 866 ? <div></div> : <></>}
        {family.pokemon[2].map((pokemon) => (
          <IconButton disableRipple key={pokemon.id} onClick={() => setSelectedPokemon(pokemon.id)} title={pokemon.name}>
            <i className={iconClass(pokemon, dex)} />
          </IconButton>
        ))}
      </Stack>
    );
  }

  return (
    <Stack
      alignItems="center"
      // alignItems="stretch"
      direction="row"
      justifyContent="space-evenly"
      sx={{ p: 3 }}
    >
      <Stack
        direction="column"
        justifyContent="center"
      >
        <IconButton disableRipple onClick={() => setSelectedPokemon(family.pokemon[0][0].id)} title={family.pokemon[0][0].name}>
          <i className={iconClass(family.pokemon[0][0], dex)} />
        </IconButton>

        {family.evolutions.length === 0 ? <Typography variant="caption">Does not evolve</Typography> : null}
      </Stack>

      {family.evolutions.length > 0 ? <Evolutions evolutions={family.evolutions[0]} /> : null}

      {column1}

      {family.evolutions.length > 1 ? <Evolutions evolutions={family.evolutions[1]} pokemonId={family.pokemon[2][0].national_id} /> : null}

      {column2}
    </Stack>
  );
}
