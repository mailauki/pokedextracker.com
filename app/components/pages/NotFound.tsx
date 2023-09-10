import { useEffect } from 'react';

import { Nav } from '../library/Nav';
import { Container, Stack, Typography } from '@mui/material';

export function NotFound () {
  useEffect(() => {
    document.title = '404 Not Found | Pokédex Tracker';
  }, []);

  return (
    // <div>
    //   <Nav />
    //   <div className="not-found">
    //     <img alt="Missing No" src="/missingno.svg" />
    //     <div className="not-found-caption">
    //       <h1>404 Error<br />Wild MISSINGNO.<br />Appeared!</h1>
    //       <p>Sorry - looks like the page you were looking for can not be found.</p>
    //     </div>
    //   </div>
    // </div>
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Stack
        // alignItems="center"
        // justifyContent="center"
        spacing={2}
        // sx={{ minHeight: 'calc(100vh - 48px)', textAlign: 'center' }}
        sx={{ textAlign: 'center' }}
      >
        <img alt="Missing No" src="/missingno.svg" style={{ height: '35vh' }} />

        <Typography
          color="primary"
          // sx={{ textAlign: 'center' }}
          textTransform="uppercase"
          variant="h3"
        >
          404 Error
          <br />
          Wild MISSINGNO.
          <br />
          Appeared!
        </Typography>

        <Typography>
          Sorry - looks like the page you were looking for can not be found.
        </Typography>
      </Stack>
    </Container>
  );
}
