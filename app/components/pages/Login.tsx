// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import { faAsterisk, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { Alert } from '../library/Alert';
import { Footer } from '../library/Footer';
// import { Nav } from '../library/Nav';
import { ReactGA } from '../../utils/analytics';
import { Reload } from '../library/Reload';
import { useLogin } from '../../hooks/queries/sessions';
import { useSession } from '../../hooks/contexts/use-session';

import type { ChangeEvent, FormEvent } from 'react';

import { Box, Button, CircularProgress, Container, Link as Anchor, Stack, TextField, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';

export function Login () {
  const history = useHistory();

  const { session, setToken } = useSession();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useLogin();

  useEffect(() => {
    document.title = 'Login | Pokédex Tracker';
  }, []);

  useEffect(() => {
    if (session) {
      history.push(`/u/${session.username}`);
    }
  }, []);

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
    // <div className="login-container">
    //   <Nav />
    //   <Reload />
    //   <div className="form">
    //     <h1>Login</h1>
    //     <form className="form-column" onSubmit={handleSubmit}>
    //       <Alert message={loginMutation.error?.message} type="error" />
    //       <div className="form-group">
    //         <label htmlFor="username">Username</label>
    //         <input
    //           autoCapitalize="off"
    //           autoComplete="off"
    //           autoCorrect="off"
    //           className="form-control"
    //           id="username"
    //           maxLength={20}
    //           name="username"
    //           onChange={handleUsernameChange}
    //           placeholder="ashketchum10"
    //           required
    //           spellCheck="false"
    //           type="text"
    //           value={username}
    //         />
    //         <FontAwesomeIcon icon={faAsterisk} />
    //       </div>
    //       <div className="form-group">
    //         <label htmlFor="password">Password</label>
    //         <input
    //           className="form-control"
    //           id="password"
    //           maxLength={72}
    //           name="password"
    //           onChange={handlePasswordChange}
    //           placeholder="••••••••••••"
    //           required
    //           type="password"
    //           value={password}
    //         />
    //         <FontAwesomeIcon icon={faAsterisk} />
    //       </div>
    //       <button className="btn btn-blue" disabled={loginMutation.isLoading} type="submit">Let&apos;s go! <FontAwesomeIcon icon={faLongArrowAltRight} /></button>
    //       <p>Don&apos;t have an account yet? <Link className="link" to="/register">Register here</Link>!</p>
    //     </form>
    //   </div>
    //   <Footer />
    // </div>
    <>
      <Container maxWidth="xs" sx={{ mt: 2, mb: 4 }}>
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
              type="password"
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
      </Container>

      <Footer />
    </>
  );
}
