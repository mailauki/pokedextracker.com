import { decimal } from '../../utils/formatting';

import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  caught: number;
  total: number;
}

export function Progress ({ caught, total }: Props) {
  const theme = useTheme();

  const percent = 100 * caught / total;

  return (
    <Stack sx={{ mt: 1, mb: 2, position: 'relative', width: '100%' }}>
      <LinearProgress
        color="secondary"
        sx={{ height: 25, borderRadius: theme.shape.pill, m: 0.5 }}
        value={percent}
        variant="determinate"
      />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', textAlign: 'center' }}>
        <Typography variant="overline">
          <b>{decimal(percent, 1)}%</b> done!<span className="mobile"> (<b>{caught}</b> caught, <b>{total - caught}</b> to go)</span>
        </Typography>
      </Box>
    </Stack>
  );
}
