// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link as Anchor } from 'react-router-dom';
// import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Stack, Link, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useParams } from 'react-router';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { DexEdit } from './DexEdit';
import { DexIndicator } from '../../library/DexIndicator';
import { Progress } from '../../library/Progress';
import { useSession } from '../../../hooks/contexts/use-session';
import { useUser } from '../../../hooks/queries/users';

import type { Dex } from '../../../types';

interface Props {
  dex: Dex;
}

export function DexPreview ({ dex }: Props) {
  const { username } = useParams<{ username: string }>();

  const user = useUser(username).data!;

  const { session } = useSession();

  const [showEditDex, setShowEditDex] = useState(false);

  const handleRequestClose = () => {
    setShowEditDex(false);
  };

  const handleEditClick = () => setShowEditDex(true);

  const ownPage = session?.id === user.id;

  const matches = useMediaQuery('(max-width:600px)');

  return (
    // <div className="dex-preview">
    //   <div className="dex-preview-header">
    //     <h3><Link className="link" to={`/u/${user.username}/${dex.slug}`}>{dex.title}</Link></h3>
    //     {ownPage &&
    //       <div className="dex-edit">
    //         <a className="link" onClick={handleEditClick}><FontAwesomeIcon icon={faPencilAlt} /></a>
    //         <DexEdit dex={dex} isOpen={showEditDex} onRequestClose={handleRequestClose} />
    //       </div>
    //     }
    //     <DexIndicator dex={dex} />
    //   </div>
    //   <div className="percentage">
    //     <Progress caught={dex.caught} total={dex.total} />
    //   </div>
    // </div>
    <Stack direction="column">
      <Stack alignItems={matches ? 'normal' : 'center'} direction={matches ? 'column' : 'row'} justifyContent="space-between">
        <Stack alignItems="center" direction="row" spacing={1}>
          <Link component={Anchor} noWrap to={`/u/${user.username}/${dex.slug}`} underline="hover" variant="h6">{dex.title}</Link>
          <IconButton aria-label="edit" size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>
        <DexIndicator dex={dex} />
      </Stack>

      <Progress caught={dex.caught} total={dex.total} />
    </Stack>
  );
}
