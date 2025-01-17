import uniqBy from 'lodash/uniqBy';

import { capitalize } from '../../../../utils/formatting';

import type { Evolution } from '../../../../types';

import { Stack, Tooltip, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function evolutionKey (evolution: Evolution) {
  return `${evolution.trigger}:${evolution.level}:${evolution.stone}:${evolution.held_item}:${evolution.notes}`;
}

interface Props {
  evolutions: Evolution[];
  pokemonId?: number;
}

export function Evolutions ({ evolutions, pokemonId }: Props) {
  const elements = uniqBy(evolutions, evolutionKey).map((evolution) => {
    const key = evolutionKey(evolution);
    let trigger = null;
    let notes = null;

    switch (evolution.trigger) {
      case 'level':
        trigger = <span>Level Up {evolution.level ? `to ${evolution.level} ` : ''}</span>;
        break;
      case 'stone':
        trigger = <span>{capitalize(evolution.stone!)} Stone </span>;
        break;
      case 'candy':
        trigger = <span>{evolution.candy_count} Candies </span>;
        break;
      case 'other':
        break;
      default:
        trigger = <span>{capitalize(evolution.trigger)} </span>;
    }

    if (evolution.notes) {
      if (evolutions.length <= 3) {
        notes = <span>{evolution.notes}</span>;
      } else {
        notes = (
          <Tooltip arrow title={evolution.notes}>
            <AddCircleIcon fontSize="small" sx={{ fontSize: 'inherit' }} />
          </Tooltip>
        );
      }
    }

    return (
      <Stack
        alignItems="center"
        direction="column"
        justifyContent="center"
        key={key}
        sx={{ textAlign: 'center', maxWidth: '100px' }}
      >
        <ArrowRightIcon
          fontSize="small"
          sx={{ transform: evolution.trigger === 'breed' ? 'rotate(180deg)' : '' }}
        />
        <Typography variant="caption">
          {trigger}
          {evolution.held_item ? <span>holding {capitalize(evolution.held_item)} </span> : null}
          {notes}
        </Typography>
      </Stack>
    );
  });

  return (
    // styling hack for mr.rime
    <Stack
      direction="column"
      justifyContent={elements.length > 1 || pokemonId === 866 ? 'space-between' : 'center'}
    >
      {pokemonId === 866 ? <div></div> : null}
      {elements}
    </Stack>
  );
}
