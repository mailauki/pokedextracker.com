import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { decimal } from '../../utils/formatting';

interface Props {
  caught: number;
  total: number;
}

export function Progress ({ caught, total }: Props) {
  const percent = 100 * caught / total;

  return (
    <Stack sx={{ mt: 1, mb: 2, position: 'relative', width: '100%' }}>
      <LinearProgress sx={{ height: 25, borderRadius: 5, m: 0.5 }} value={percent} variant="determinate" />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', textAlign: 'center' }}>
        <Typography variant="overline">
          <b>{decimal(percent, 1)}%</b> done!<span className="mobile"> (<b>{caught}</b> caught, <b>{total - caught}</b> to go)</span>
        </Typography>
      </Box>
    </Stack>
  );
}
