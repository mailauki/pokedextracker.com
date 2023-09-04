import type { Location } from '../../../types';

import { Box, List, ListItem, ListItemText, ListSubheader } from '@mui/material';
import Bullet from '@mui/icons-material/Circle';

interface Props {
  locations: Location[];
}

export function InfoLocations ({ locations }: Props) {
  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        // width: 'var(--info-drawer-width)',
        width: '100%',
        pb: 4,
      }}
    >
      {locations.map((location) => (
        <div key={location.game.id}>
          <List disablePadding>
            <ListSubheader disableSticky>Pokémon {location.game.name}</ListSubheader>

            {location.value.map((loc) => (
              <ListItem disablePadding key={loc} sx={{ ml: 4, width: 'calc(var(--info-drawer-width)-32px)' }}>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={loc} />
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </Box>
  );
}
