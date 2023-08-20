import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import type { Dex } from '../../types';
import { Chip } from '@mui/material';

interface Props {
  dex: Dex;
}

export function DexIndicator ({ dex }: Props) {
  return (
    <div className="dex-indicator">
      {dex.shiny && <FontAwesomeIcon icon={faStar} title="Shiny" />}
      {dex.dex_type.tags.map((tag) => (
        <Chip className="label" key={tag} label={tag} />
      ))}
      <Chip className="label" label={dex.game.name} />
    </div>
    // <div className="dex-indicator">
    //   {dex.shiny && <FontAwesomeIcon icon={faStar} title="Shiny" />}
    //   {dex.dex_type.tags.map((tag) => (
    //     <span className="label" key={tag}>{tag}</span>
    //   ))}
    //   <span className="label">{dex.game.name}</span>
    // </div>
  );
}
