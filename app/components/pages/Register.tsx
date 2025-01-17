import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import slug from 'slug';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import { faAsterisk, faChevronDown, faLongArrowAltRight, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';

import { Alert } from '../library/Alert';
// import { Footer } from '../library/Footer';
// import { Nav } from '../library/Nav';
import { Main } from '../library/Main';
import { ReactGA } from '../../utils/analytics';
// import { Reload } from '../library/Reload';
import { friendCode3dsFormatter, friendCodeSwitchFormatter } from '../../utils/formatting';
import { useCreateUser } from '../../hooks/queries/users';
import { useDexTypes } from '../../hooks/queries/dex-types';
import { useGames } from '../../hooks/queries/games';
import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../hooks/contexts/use-session';

import type { ChangeEvent, FormEvent } from 'react';
import type { DexType, Game } from '../../types';

import { Box, Button, CircularProgress, Container, Link as Anchor, Stack, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Radio, FormControlLabel, RadioGroup, FormLabel, Tooltip } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import HelpIcon from '@mui/icons-material/Help';
import type { SelectChangeEvent } from '@mui/material/Select';

export function Register () {

  const history = useHistory();

  const { setHideNotification } = useLocalStorageContext();

  const { session, setToken } = useSession();
  const { data: games } = useGames();
  const { data: dexTypes } = useDexTypes();

  const gamesById = useMemo<Record<string, Game>>(() => keyBy(games, 'id'), [games]);
  const dexTypesById = useMemo<Record<string, DexType>>(() => keyBy(dexTypes, 'id'), [dexTypes]);
  const dexTypesByGameFamilyId = useMemo<Record<string, DexType[]>>(() => groupBy(dexTypes, 'game_family_id'), [dexTypes]);

  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [friendCode3ds, setFriendCode3ds] = useState('');
  const [friendCodeSwitch, setFriendCodeSwitch] = useState('');
  const [title, setTitle] = useState('');
  const [game, setGame] = useState(games?.[0].id || '');
  const [dexType, setDexType] = useState(dexTypesByGameFamilyId[games?.[0].game_family.id || '']?.[0].id || -1);
  const [shiny, setShiny] = useState(false);

  const createUserMutation = useCreateUser();

  useEffect(() => {
    document.title = 'Register | Pokédex Tracker';
  }, []);

  useEffect(() => {
    if (session) {
      history.push(`/u/${session.username}`);
    }
  }, []);

  useEffect(() => {
    if (games && !game) {
      setGame(games[0].id);
    }
  }, [games, game]);

  useEffect(() => {
    if (games && Object.keys(dexTypesByGameFamilyId).length > 0 && dexType === -1) {
      setDexType(dexTypesByGameFamilyId[games[0].game_family.id][0].id);
    }
  }, [games, dexTypesByGameFamilyId, dexType]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createUserMutation.reset();
    setError('');

    if (password !== passwordConfirm) {
      setError('passwords need to match');
      return;
    }

    const payload = {
      username,
      password,
      friend_code_3ds: friendCode3ds,
      friend_code_switch: friendCodeSwitch,
      title,
      slug: slug(title, { lower: true }),
      shiny,
      game,
      dex_type: dexType,
    };

    try {
      const { token } = await createUserMutation.mutateAsync({ payload });
      setToken(token);
      ReactGA.event({ action: 'register', category: 'Session' });
      setHideNotification(true);
      history.push(`/u/${username}/${payload.slug}`);
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
      window.scrollTo({ top: 0 });
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value);
  const handleFriendCode3dsChange = (e: ChangeEvent<HTMLInputElement>) => setFriendCode3ds(friendCode3dsFormatter(e.target.value));
  const handleFriendCodeSwitchChange = (e: ChangeEvent<HTMLInputElement>) => setFriendCodeSwitch(friendCodeSwitchFormatter(e.target.value));
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const handleGameChange = (e: SelectChangeEvent) => {
    const newGameId = e.target.value;

    // Update the dex type appropriately since every game family has a different
    // set of dex types (even if the names are matching across them). First we
    // check if the game family changed. If it didn't, then we don't need to do
    // anything. If it did, we try to see if there is a matching dex type with
    // the same name, and if there is, use that one. if not, just pick the first
    // available dex type.
    const oldGameFamilyId = gamesById[game].game_family.id;
    const newGameFamilyId = gamesById[newGameId].game_family.id;
    if (oldGameFamilyId !== newGameFamilyId) {
      const oldDexType = dexTypesById[dexType];
      const matchingNewDexType = find(dexTypesByGameFamilyId[newGameFamilyId], ['name', oldDexType.name]);
      const newDexTypeId = matchingNewDexType?.id || dexTypesByGameFamilyId[gamesById[newGameId].game_family.id][0].id;
      setDexType(newDexTypeId);
    }

    setGame(newGameId);
  };

  if (!games || !game || dexType === -1 || Object.keys(gamesById).length === 0 || Object.keys(dexTypesByGameFamilyId).length === 0) {
    return null;
  }

  return (
    <Main>
      <Stack alignItems="center" direction="column">
        <Typography color="primary" sx={{ mb: 2 }} variant="h4">Register</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Alert message={error || createUserMutation.error?.message} type="error" />

          <Stack alignItems="flex-start" direction="row" flexWrap="wrap" spacing={2} useFlexGap>
            <Container maxWidth="xs">
              <Typography variant="h6">Account Info</Typography>

              <TextField
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                fullWidth
                id="username"
                label="Username"
                margin="normal"
                name="username"
                onChange={handleUsernameChange}
                placeholder="ashketchum10"
                required
                spellCheck="false"
                type="text"
                value={username}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                margin="normal"
                name="password"
                onChange={handlePasswordChange}
                placeholder="••••••••••••"
                required
                type="password"
                value={password}
              />
              <TextField
                fullWidth
                id="password_confirm"
                label="Confirm Password"
                margin="normal"
                name="password_confirm"
                onChange={handlePasswordConfirmChange}
                placeholder="••••••••••••"
                required
                type="password"
                value={passwordConfirm}
              />

              <TextField
                fullWidth
                id="friend_code_3ds"
                label="3DS Friend Code"
                margin="normal"
                name="friend_code_3ds"
                onChange={handleFriendCode3dsChange}
                placeholder="XXXX-XXXX-XXXX"
                type="text"
                value={friendCode3ds}
              />

              <TextField
                fullWidth
                id="friend_code_switch"
                label="Switch Friend Code"
                margin="normal"
                name="friend_code_switch"
                onChange={handleFriendCodeSwitchChange}
                placeholder="SW-XXXX-XXXX-XXXX"
                type="text"
                value={friendCodeSwitch}
              />
            </Container>

            <Container maxWidth="xs">
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="h6">First Dex Info</Typography>

                <Tooltip
                  arrow
                  title={
                    <Box sx={{ textAlign: 'center', maxWidth: '200px' }}>
                      <Typography variant="caption">You can track multiple dexes on our app! This sets the settings for the first dex on your account.</Typography>
                    </Box>
                  }
                >
                  <HelpIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </Tooltip>
              </Stack>

              <TextField
                fullWidth
                id="dex_title"
                inputProps={{ maxLength: 300 }}
                label="Title" margin="normal"
                name="dex_title"
                onChange={handleTitleChange}
                placeholder="Living Dex"
                required
                type="text"
                value={title}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Game</InputLabel>
                <Select label="Game" onChange={handleGameChange} value={game}>
                  {games.map((game) => (
                    <MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <FormLabel>Dex Type</FormLabel>
                <RadioGroup aria-labelledby="" name="dex-type" row>
                  {dexTypesByGameFamilyId[gamesById[game].game_family.id].map((dt) => (
                    <FormControlLabel
                      control={
                        <Radio
                          checked={dexType === dt.id}
                          name="dex-type"
                          onChange={() => setDexType(dt.id)}
                        />
                      }
                      key={dt.id}
                      label={dt.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <FormLabel>Type</FormLabel>
                <RadioGroup aria-labelledby="" name="type" row>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={!shiny}
                        name="type"
                        onChange={() => setShiny(false)}
                      />
                    }
                    label="Normal"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={shiny}
                        name="type"
                        onChange={() => setShiny(true)}
                      />
                    }
                    label="Shiny"
                  />
                </RadioGroup>
              </FormControl>
            </Container>
          </Stack>

          <Container maxWidth="xs">
            <Button
              disabled={createUserMutation.isLoading}
              endIcon={createUserMutation.isLoading ? <CircularProgress color="inherit" size={14} sx={{ display: createUserMutation.isLoading ? '' : 'none' }} thickness={6} /> : <ArrowRightIcon />}
              fullWidth
              size="large"
              sx={{ mt: 2, mb: 2 }}
              type="submit"
              variant="contained"
            >
              Let&apos;s go!
            </Button>

            <Typography align="center">Already have an account? <Anchor component={Link} to="/login">Login here</Anchor>!</Typography>
          </Container>
        </Box>
      </Stack>
    </Main>
  );
}
