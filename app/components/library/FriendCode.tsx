import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import { ReactGA } from '../../utils/analytics';
import { useSession } from '../../hooks/contexts/use-session';
import { useUser } from '../../hooks/queries/users';

import type { ReactNode } from 'react';

import { IconButton, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export function FriendCode () {
  const { username } = useParams<{ username: string }>();

  const { session } = useSession();
  const user = useUser(username).data!;

  const ownPage = session?.id === user.id;

  let editAccountBtn: ReactNode = null;

  if (ownPage) {
    const handleClick = () => ReactGA.event({ action: 'click edit friend code', category: 'User' });

    editAccountBtn = (
      // <Link onClick={handleClick} to="/account"><FontAwesomeIcon icon={faPencilAlt} /></Link>
      <IconButton aria-label="edit" component={Link} onClick={handleClick} size="small" to="/account">
        <EditIcon fontSize="small" />
      </IconButton>
    );
  }

  return (
    // <div>
    //   <h2>
    //     <b>3DS FC</b>: <span className={user.friend_code_3ds ? '' : 'fc-missing'}>{user.friend_code_3ds || 'XXXX-XXXX-XXXX'}</span> {editAccountBtn}
    //   </h2>
    //   <h2>
    //     <b>Switch FC</b>: <span className={user.friend_code_switch ? '' : 'fc-missing'}>{user.friend_code_switch || 'SW-XXXX-XXXX-XXXX'}</span> {editAccountBtn}
    //   </h2>
    // </div>
    <Stack direction="column">
      <Stack alignItems="center" direction="row">
        <Typography sx={{ pt: 0.2, span: { color: user.friend_code_3ds ? '' : 'text.disabled' } }}>
          <b>3DS FC</b>: <span>{user.friend_code_3ds || 'XXXX-XXXX-XXXX'}</span>
        </Typography>
        {editAccountBtn}
      </Stack>
      <Stack alignItems="center" direction="row">
        <Typography sx={{ pt: 0.2, span: { color: user.friend_code_switch ? '' : 'text.disabled' } }}>
          <b>Switch FC</b>: <span>{user.friend_code_switch || 'SW-XXXX-XXXX-XXXX'}</span>
        </Typography>
        {editAccountBtn}
      </Stack>
    </Stack>
  );
}
