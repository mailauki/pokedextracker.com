import type { Location } from '../../../../types';

import { List, ListItem, ListItemText, ListSubheader, Skeleton } from '@mui/material';
import Bullet from '@mui/icons-material/Circle';

interface Props {
  locations: Location[];
}

export function InfoLocations ({ locations }: Props) {
  return (
    // !locations ? (
    //   <>
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 20 }} width="60%" />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
    //     <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="60%" />
    //   </>
    // ) : (
    <>
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
    </>
    // )
  );
}
