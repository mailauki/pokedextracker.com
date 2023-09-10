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
import { BackToTop } from '../library/BackToTop';
import { logPageView } from '../../utils/analytics';
import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';

import { Toolbar } from '@mui/material';
import { ThemeProvider, alpha, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { amber, lightBlue } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface PaletteColor {
    hightlight?: string;
  }

  interface SimplePaletteColorOptions {
    hightlight?: string;
  }

  interface ThemeOptions {
    shape?: {
      pill?: number;
    };
  }
}

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
    if (isNightMode || prefersDarkMode) setDarkMode(true);
    else setDarkMode(isNightMode);
  }, [isNightMode, prefersDarkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          ...(!darkMode
            ? {
              primary: {
                main: lightBlue[900],
                hightlight: alpha(lightBlue[900], 0.5),
              },
              secondary: amber,
            }
            : {
              primary: {
                main: lightBlue[900],
                hightlight: alpha(lightBlue[900], 0.5),
              },
              secondary: amber,
            }),
        },
        shape: {
          pill: 5,
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              // root: ({ ownerState, theme }) => ({
              //   // ...(ownerState && {
              //   //   backgroundColor: '#F5F5F9',
              //   //   // color: theme.palette.grey[500],
              //   //   color: 'rgba(0, 0, 0, 0.87)',
              //   // }),
              // }),
              // root: {
              //   backgroundColor: '#F5F5F9',
              // },
            },
          },
        },
      }),
    [darkMode],
  );

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <div className={`root ${isNightMode ? 'night-mode' : ''}`}> */}
        <div className="page">
          <Nav darkMode={darkMode} />
          <Toolbar id="back-to-top-anchor" variant="dense" />

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

          <BackToTop />
        </div>
      </ThemeProvider>
    </Router>
  );
}
