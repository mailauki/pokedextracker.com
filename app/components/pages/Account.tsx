// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAsterisk, faChevronDown, faCircleNotch, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Alert } from '../library/Alert';
// import { Footer } from '../library/Footer';
// import { Nav } from '../library/Nav';
import { Main } from '../library/Main';
import { ReactGA } from '../../utils/analytics';
// import { Reload } from '../library/Reload';
import { friendCode3dsFormatter, friendCodeSwitchFormatter } from '../../utils/formatting';
import { useSession } from '../../hooks/contexts/use-session';
import { useUpdateUser } from '../../hooks/queries/users';

import type { ChangeEvent, FormEvent } from 'react';

import { Box, Button, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';

export function Account () {
  const history = useHistory();

  const { session, sessionUser, setToken } = useSession();

  const [error, setError] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [friendCode3ds, setFriendCode3ds] = useState(sessionUser?.friend_code_3ds || '');
  const [friendCodeSwitch, setFriendCodeSwitch] = useState(sessionUser?.friend_code_switch || '');

  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    document.title = 'Account | Pokédex Tracker';
  }, []);

  useEffect(() => {
    if (!session) {
      history.push('/login');
    }
  }, [session]);

  useEffect(() => {
    if (sessionUser) {
      setFriendCode3ds(sessionUser.friend_code_3ds || '');
      setFriendCodeSwitch(sessionUser.friend_code_switch || '');
    }
  }, [sessionUser]);

  if (!sessionUser) {
    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateUserMutation.reset();
    setError('');

    if (isEditingPassword && password !== passwordConfirm) {
      setError('passwords need to match');
      return;
    }

    try {
      const { token } = await updateUserMutation.mutateAsync({
        username: sessionUser.username,
        payload: {
          password: isEditingPassword ? password : undefined,
          friend_code_3ds: friendCode3ds,
          friend_code_switch: friendCodeSwitch,
        },
      });
      setToken(token);
      ReactGA.event({ action: 'update', category: 'User' });
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
    }

    window.scrollTo({ top: 0 });
  };

  const handleChangePasswordClick = () => setIsEditingPassword((prev) => !prev);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
  const handlePasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value);
  const handleFriendCode3dsChange = (e: ChangeEvent<HTMLInputElement>) => setFriendCode3ds(friendCode3dsFormatter(e.target.value));
  const handleFriendCodeSwitchChange = (e: ChangeEvent<HTMLInputElement>) => setFriendCodeSwitch(friendCodeSwitchFormatter(e.target.value));

  return (
    <Main size="xs">
      <Stack alignItems="center" direction="column">
        <Typography color="primary" sx={{ mb: 2 }} variant="h4">{sessionUser.username}&apos;s Account</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Alert message={error || updateUserMutation.error?.message} type="error" />
          <Alert message={updateUserMutation.isSuccess && 'Account settings saved!'} type="success" />

          <Button
            color="inherit"
            fullWidth
            onClick={handleChangePasswordClick}
            size="large"
            variant="contained"
          >
            {isEditingPassword ? 'Cancel' : 'Change Password'}
          </Button>
          {isEditingPassword &&
            <>
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
              <Divider sx={{ mt: 2, mb: 1 }} />
            </>
          }

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

          <FormControl fullWidth margin="normal">
            <InputLabel id="language">Pokémon Name Language</InputLabel>
            <Select
              defaultValue="english"
              label="Pokémon Name Language"
              labelId="language"
            >
              <MenuItem value="english">English</MenuItem>
            </Select>
          </FormControl>

          <Button
            disabled={updateUserMutation.isLoading}
            endIcon={updateUserMutation.isLoading ? <CircularProgress color="inherit" size={14} sx={{ display: updateUserMutation.isLoading ? '' : 'none' }} thickness={6} /> : <ArrowRightIcon />}
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            type="submit"
            variant="contained"
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Main>
  );
}
