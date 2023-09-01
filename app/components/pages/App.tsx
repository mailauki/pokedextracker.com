import { useEffect, useMemo, useState } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { historyContext } from '@rollbar/react';

import { Account } from './Account';
import { Home } from './Home';
import { Login } from './Login';
import { NotFound } from './NotFound';
import { Profile } from './Profile';
import { ProfileRedirect } from './ProfileRedirect';
import { Register } from './Register';
import { Rollbar } from '../../utils/rollbar';
import { Tracker } from './Tracker';
import { Nav } from '../library/Nav';
import { logPageView } from '../../utils/analytics';
import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Container } from '@mui/material';
import { amber, indigo } from '@mui/material/colors';

const history = createBrowserHistory();
history.listen(() => logPageView());
// @ts-ignore Rollbar's types are wrong. See https://github.com/rollbar/rollbar-react/issues/69
history.listen(historyContext(Rollbar));
logPageView();

export function App () {
  const { isNightMode } = useLocalStorageContext();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(isNightMode);

  useEffect(() => {
    if (isNightMode === prefersDarkMode) setDarkMode(true);
    else if (isNightMode !== prefersDarkMode && prefersDarkMode === true) setDarkMode(isNightMode);
    else setDarkMode(prefersDarkMode);
  }, [isNightMode, prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          ...(!darkMode
            ? {
              // tonalOffset: 0.4,
              primary: {
                main: '#12345F',
                background: '#18447D80',
              },
              secondary: amber,
            }
            : {
              primary: {
                main: '#12345F',
                background: '#102D5280',
              },
              secondary: amber,
            }),
        },
      }),
    [darkMode],
  );

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <div className={`root ${isNightMode ? 'night-mode' : ''}`}> */}
        <Nav />
        {/* <Container maxWidth="md"> */}
        <Switch>
          <Route component={Home} exact path="/" />
          <Route component={Login} exact path="/login" />
          <Route component={Register} exact path="/register" />
          <Route component={Account} exact path="/account" />
          <Route component={ProfileRedirect} exact path="/profile" />
          <Route component={Profile} exact path="/u/:username" />
          <Route component={Tracker} exact path="/u/:username/:slug" />
          <Route component={NotFound} path="/" />
        </Switch>
        {/* </Container> */}
        {/* </div> */}
      </ThemeProvider>
    </Router>
  );
}
