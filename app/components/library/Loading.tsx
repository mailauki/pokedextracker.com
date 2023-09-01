import { CircularProgress, Stack, Typography } from '@mui/material';

export function Loading () {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 'calc(100vh - 48px)' }}>
      <CircularProgress />
      <Typography variant="overline">Loading...</Typography>
    </Stack>
  );
}
