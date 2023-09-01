import { Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

import type { Dex } from '../../types';

interface Props {
  dex: Dex;
}

export function DexIndicator ({ dex }: Props) {
  return (
    <Stack
      alignItems="center"
      direction="row"
      flexWrap="wrap"
      justifyContent="center"
      spacing={1}
      sx={{ textTransform: 'uppercase' }}
      useFlexGap
    >
      {dex.shiny && <StarIcon color="error" fontSize="small" sx={{ fontSize: '14px' }} />}
      {dex.dex_type.tags.map((tag) => (
        <Chip className="label" key={tag} label={tag} size="small" sx={{ fontSize: '11px' }} />
      ))}
      <Chip className="label" label={dex.game.name} size="small" sx={{ fontSize: '11px' }} />
    </Stack>
  );
}
