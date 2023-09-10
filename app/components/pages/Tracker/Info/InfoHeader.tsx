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
// import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { usePokemon } from '../../../../hooks/queries/pokemon';
import { useUser } from '../../../../hooks/queries/users';

import type { Dex } from '../../../../types';

import { Box, ListItem, ListItemIcon, ListItemText, Skeleton, Toolbar, Typography } from '@mui/material';

interface Props {
  dex: any;
  pokemon: any;
  selectedPokemon: number;
}

export function InfoHeader ({ dex, pokemon, selectedPokemon }: Props) {
  // const { username, slug } = useParams<{ username: string; slug: string }>();

  // const user = useUser(username).data!;
  // const dex = useMemo<Dex>(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);
  // const { data: pokemon } = usePokemon(selectedPokemon, {
  //   dex_type: dex.dex_type.id,
  // });

  return (
    <Box>
      <Toolbar variant="dense" />
      <ListItem
        secondaryAction={
          <Typography variant="h5">{!pokemon ? <Skeleton /> : `#${padding(dex.dex_type.tags.includes('regional') ? (pokemon.dex_number === -1 ? '---' : pokemon.dex_number) : nationalId(pokemon.national_id), dex.total >= 1000 ? 4 : 3)}`}</Typography>
        }
      >
        <ListItemIcon>
          {!pokemon ? <Skeleton height={30} variant="circular" width={30} /> : <i className={iconClass(pokemon, dex)} />}
        </ListItemIcon>
        <ListItemText primary={<Typography variant="h4">{!pokemon ? <Skeleton /> : pokemon.name}</Typography>} />
      </ListItem>

      {/* <Divider /> */}
    </Box>
  );
}
