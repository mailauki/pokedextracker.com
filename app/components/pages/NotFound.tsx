import { useEffect } from 'react';

// import { Nav } from '../library/Nav';
import { Container, Stack, Typography } from '@mui/material';

export function NotFound () {
  useEffect(() => {
    document.title = '404 Not Found | Pokédex Tracker';
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Stack
        spacing={2}
        sx={{ textAlign: 'center' }}
      >
        <img alt="Missing No" src="/missingno.svg" style={{ height: '35vh' }} />

        <Typography
          color="primary"
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
