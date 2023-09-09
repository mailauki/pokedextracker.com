import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { DexCreate } from './DexCreate';
import { DexPreview } from './DexPreview';
import { Footer } from '../../library/Footer';
import { FriendCode } from '../../library/FriendCode';
import { Header } from '../../library/Header';
// import { Nav } from '../../library/Nav';
import { NotFound } from '../NotFound';
import { Loading } from '../../library/Loading';
import { Notification } from '../../library/Notification';
import { Reload } from '../../library/Reload';
import { useSession } from '../../../hooks/contexts/use-session';
import { useUser } from '../../../hooks/queries/users';

import { Box, Button, Container, Stack } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import { useTheme } from '@mui/material/styles';

export function Profile () {
  const theme = useTheme();

  const { username } = useParams<{ username: string }>();

  const {
    data: user,
    isLoading: userIsLoading,
  } = useUser(username);

  const { session } = useSession();

  const [showDexCreate, setShowDexCreate] = useState(false);

  useEffect(() => {
    document.title = `${username}'s Profile | Pokédex Tracker`;
  }, []);

  const handleCreateNewDexClick = () => setShowDexCreate(true);
  const handleDexCreateRequestClose = () => setShowDexCreate(false);

  if (userIsLoading) {
    return <Loading />;
  }

  if (!user) {
    return <NotFound />;
  }

  const ownPage = session?.id === user.id;

  return (
    <>
      {/* <Nav /> */}
      <Reload />
      {/* <div className="profile"> */}
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        {/* <div className="wrapper"> */}
        {/* <header>
          <Notification />
          <Header profile />
          <FriendCode />
        </header> */}
        <Box>
          <Notification />
          <Header profile />
          <FriendCode />
        </Box>

        {user.dexes.map((dex) => <DexPreview dex={dex} key={dex.id} />)}

        {ownPage &&
          <Stack alignItems="center" className="dex-create" justifyContent="center" sx={{ mt: 2, mb: 2 }}>
            <Button
              endIcon={<ArrowRightIcon />}
              onClick={handleCreateNewDexClick}
              size="large"
              variant="contained"
            >
              Create a New Dex
            </Button>
            <DexCreate isOpen={showDexCreate} onRequestClose={handleDexCreateRequestClose} />
          </Stack>
        }
        {/* </div> */}
      </Container>
      {/* </div> */}
      <Footer />
    </>
  );
}
