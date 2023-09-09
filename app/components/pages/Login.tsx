// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import { faAsterisk, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

// import { Alert } from '../library/Alert';
// import { Footer } from '../library/Footer';
// import { Nav } from '../library/Nav';
import { Main } from '../library/Main';
import { ReactGA } from '../../utils/analytics';
// import { Reload } from '../library/Reload';
import { useLogin } from '../../hooks/queries/sessions';
import { useSession } from '../../hooks/contexts/use-session';

import type { ChangeEvent, FormEvent, MouseEvent } from 'react';

import { Box, Button, CircularProgress, Link as Anchor, Stack, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export function Login () {
  const history = useHistory();

  const { session, setToken } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  useEffect(() => {
    document.title = 'Login | Pokédex Tracker';
  }, []);

  useEffect(() => {
    if (session) {
      history.push(`/u/${session.username}`);
    }
  }, []);
  
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    loginMutation.reset();

    const payload = { username, password };

    try {
      const { token } = await loginMutation.mutateAsync({ payload });
      setToken(token);
      ReactGA.event({ action: 'login', category: 'Session' });
      history.push(`/u/${username}`);
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
      window.scrollTo({ top: 0 });
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <Main size="xs">
      <Stack alignItems="center" direction="column">
        <Typography color="primary" sx={{ mb: 2 }} variant="h4">Login</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            error={loginMutation.error?.message.includes('user')}
            fullWidth
            helperText={loginMutation.error?.message.includes('user') ? loginMutation.error?.message : null}
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={loginMutation.error?.message.includes('password')}
            fullWidth
            helperText={loginMutation.error?.message.includes('password') ? loginMutation.error?.message : null}
            id="password"
            label="Password"
            margin="normal"
            name="password"
            onChange={handlePasswordChange}
            placeholder="••••••••••••"
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
          />

          <Button
            disabled={loginMutation.isLoading}
            endIcon={loginMutation.isLoading ? <CircularProgress color="inherit" size={14} sx={{ display: loginMutation.isLoading ? '' : 'none' }} thickness={6} /> : <ArrowRightIcon />}
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            type="submit"
            variant="contained"
          >
            Let&apos;s go!
          </Button>

          <Typography align="center">Don&apos;t have an account yet? <Anchor component={Link} to="/register">Register here</Anchor>!</Typography>
        </Box>
      </Stack>
    </Main>
  );
}
