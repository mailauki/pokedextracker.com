// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

import type { Dex } from '../../types';

interface Props {
  dex: Dex;
}

export function DexIndicator ({ dex }: Props) {
  return (
    // <div className="dex-indicator">
    //   <StarIcon color="error" fontSize="small" />
    //   {dex.shiny && <FontAwesomeIcon icon={faStar} title="Shiny" />}
    //   {dex.dex_type.tags.map((tag) => (
    //     <Chip className="label" key={tag} label={tag} />
    //   ))}
    //   <Chip className="label" label={dex.game.name} />
    // </div>
    <Stack alignItems="center" direction="row" spacing={1} sx={{ textTransform: 'uppercase' }}>
      <StarIcon color="error" fontSize="small" sx={{ fontSize: '14px' }} />
      {dex.dex_type.tags.map((tag) => (
        <Chip className="label" key={tag} label={tag} size="small" sx={{ fontSize: '11px' }} />
      ))}
      <Chip className="label" label={dex.game.name} size="small" sx={{ fontSize: '11px' }} />
    </Stack>
  );
}
