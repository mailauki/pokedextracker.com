import keyBy from 'lodash/keyBy';
import type { Dispatch, SetStateAction } from 'react';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { Info } from './Info';
import { ReactGA } from '../../../../utils/analytics';
import { useLocalStorageContext } from '../../../../hooks/contexts/use-local-storage-context';
import { usePokemon } from '../../../../hooks/queries/pokemon';
import { useUser } from '../../../../hooks/queries/users';

import type { Dex } from '../../../../types';

import { AppBar, Avatar, Box, Button, CardHeader, DialogContent, Divider, Drawer, IconButton, ListItem, ListItemIcon, ListItemText, Skeleton, Stack, Toolbar, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useMediaQuery from '@mui/material/useMediaQuery';

import { InfoFooter } from './InfoFooter';
import { InfoHeader } from './InfoHeader';
import { InfoLocations } from './InfoLocations';

interface Props {
  selectedPokemon: number;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
}

export function InfoDrawer ({ selectedPokemon, setSelectedPokemon }: Props) {
  const matches = useMediaQuery('(max-width:800px)');

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const user = useUser(username).data!;
  const dex = useMemo<Dex>(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);
  const { data: pokemon } = usePokemon(selectedPokemon, {
    dex_type: dex.dex_type.id,
  });

  const { showInfo, setShowInfo } = useLocalStorageContext();

  const handleInfoClick = () => {
    ReactGA.event({ action: showInfo ? 'collapse' : 'uncollapse', category: 'Info' });
    setShowInfo(!showInfo);
  };

  // if (!pokemon) {
  //   return (
  //     <Drawer
  //       anchor="right"
  //       open={showInfo}
  //       sx={{
  //         flexShrink: 0,
  //         ['& .MuiDrawer-paper']: {
  //           zIndex: 1050,
  //           width: showInfo && matches ? '100%' : 'fit-content',
  //         },
  //       }}
  //       variant="permanent"
  //     >
  //       <Stack
  //         alignItems="stretch"
  //         direction="row"
  //         justifyContent="space-between"
  //         sx={{ height: '100%' }}
  //       >
  //         <AppBar
  //           component="div"
  //           position="relative"
  //           sx={{
  //             flexDirection: 'row',
  //             width: 'fit-content',
  //             height: '100%',
  //           }}
  //         >
  //           <Toolbar
  //             disableGutters
  //             sx={{ flexDirection: 'row' }}
  //             variant="dense"
  //           >
  //             <IconButton
  //               color="inherit"
  //               disableRipple
  //               onClick={handleInfoClick}
  //               size="small"
  //               sx={{
  //                 borderRadius: 0,
  //                 width: '100%',
  //                 height: '100%',
  //               }}
  //             >
  //               {showInfo ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  //             </IconButton>
  //           </Toolbar>
  //         </AppBar>

  //         <Stack
  //           direction="column"
  //           justifyContent="space-between"
  //           sx={{
  //             height: '100%',
  //             width: matches ? '100%' : 'var(--info-drawer-width)',
  //             display: showInfo ? '' : 'none',
  //           }}
  //         >
  //           {/* <Skeleton height="100%" variant="rectangular" width="100%" /> */}
  //           {/* <Skeleton sx={{ fontSize: '1rem' }} variant="text" /> */}
  //           <Box>
  //             <Toolbar variant="dense" />
  //             {/* <ListItem
  //               secondaryAction={
  //                 // <Typography variant="h5">#{padding(dex.dex_type.tags.includes('regional') ? (pokemon.dex_number === -1 ? '---' : pokemon.dex_number) : nationalId(pokemon.national_id), dex.total >= 1000 ? 4 : 3)}</Typography>
  //                 <Skeleton animation="wave" sx={{ fontSize: '1rem' }} variant="text" width={30} />
  //               }
  //             >
  //               <ListItemIcon>
  //                 {loading ? (
  //                   <Skeleton
  //                     animation="wave"
  //                     height={40}
  //                     variant="circular"
  //                     width={40}
  //                   />
  //                 ) : (<></>)}
  //               </ListItemIcon>
  //               <ListItemText primary={loading ? (
  //                 <Skeleton sx={{ fontSize: '1rem' }} variant="text" width="80%" />
  //               ) : (<></>)} />
  //             </ListItem> */}
  //             <ListItem
  //               secondaryAction={loading ? (
  //                 <Skeleton animation="wave" height={14} width={35} />
  //               ) : (
  //                 '5 hours ago'
  //               )}
  //             >
  //               <ListItemIcon>
  //                 {loading ? (
  //                   <Skeleton animation="wave" height={40} variant="circular" width={40} />
  //                 ) : (
  //                   <Avatar
  //                     alt="Ted talk"
  //                     src="https://pbs.twimg.com/profile_images/877631054525472768/Xp5FAPD5_reasonably_small.jpg"
  //                   />
  //                 )}
  //               </ListItemIcon>
  //               <ListItemText>
  //                 {loading ? (
  //                   <Skeleton
  //                     animation="wave"
  //                     height={20}
  //                     width="80%"
  //                   />
  //                 ) : (
  //                   'Ted'
  //                 )}
  //               </ListItemText>
  //             </ListItem>
  //           </Box>

  //           <DialogContent dividers>
  //             {loading ? (
  //               <>
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 20 }} width="60%" />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="50%" />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="80%" />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} />
  //                 <Skeleton animation="wave" height={14} style={{ marginBottom: 6 }} width="60%" />
  //               </>
  //             ) : (
  //               <>
  //                 <Typography gutterBottom>
  //                   Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
  //                   dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
  //                   consectetur ac, vestibulum at eros.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
  //                   Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
  //                   magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
  //                   ullamcorper nulla non metus auctor fringilla.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
  //                   Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
  //                   dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
  //                   consectetur ac, vestibulum at eros.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
  //                   Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
  //                 </Typography>
  //                 <Typography gutterBottom>
  //                   Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
  //                   magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
  //                   ullamcorper nulla non metus auctor fringilla.
  //                 </Typography>
  //               </>
  //             )}
  //           </DialogContent>
  //           {/* <Skeleton
  //             animation="wave"
  //             height="100%"
  //             variant="rectangular"
  //             width="100%"
  //           /> */}
  //           <Box>
  //             <Skeleton height={20} variant="text" width="80%" />
  //           </Box>

  //           <Box>
  //             <Divider />

  //             <Stack direction="row">
  //               <Button
  //                 color="inherit"
  //                 component="a"
  //                 rel="noopener noreferrer"
  //                 size="large"
  //                 sx={{ p: 2, borderRadius: 0, width: '100%' }}
  //                 target="_blank"
  //               >
  //                 <Skeleton height={20} variant="text" width="80%" />
  //               </Button>

  //               <Divider flexItem orientation="vertical" />

  //               <Button
  //                 color="inherit"
  //                 component="a"
  //                 rel="noopener noreferrer"
  //                 size="large"
  //                 sx={{ p: 2, borderRadius: 0, width: '100%' }}
  //                 target="_blank"
  //               >
  //                 <Skeleton height={20} variant="text" width="80%" />
  //               </Button>
  //             </Stack>
  //           </Box>
  //         </Stack>
  //       </Stack>
  //     </Drawer>
  //   );
  // }

  return (
    <Drawer
      anchor="right"
      open={showInfo}
      sx={{
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          zIndex: 1050,
          width: showInfo && matches ? '100%' : 'fit-content',
        },
      }}
      variant="permanent"
    >
      <Stack
        alignItems="stretch"
        direction="row"
        justifyContent="space-between"
        sx={{ height: '100%' }}
      >
        <AppBar
          component="div"
          position="relative"
          sx={{
            flexDirection: 'row',
            width: 'fit-content',
            height: '100%',
          }}
        >
          <Toolbar
            disableGutters
            sx={{ flexDirection: 'row' }}
            variant="dense"
          >
            <IconButton
              color="inherit"
              disableRipple
              onClick={handleInfoClick}
              size="small"
              sx={{
                borderRadius: 0,
                width: '100%',
                height: '100%',
              }}
            >
              {showInfo ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Stack
          direction="column"
          justifyContent="space-between"
          sx={{
            height: '100%',
            width: matches ? '100%' : 'var(--info-drawer-width)',
            display: showInfo ? '' : 'none',
          }}
        >
          {/* <Info selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} /> */}
          <InfoHeader dex={dex} pokemon={pokemon} selectedPokemon={selectedPokemon} />

          <DialogContent dividers>
            <InfoLocations locations={pokemon?.locations} />
          </DialogContent>

          <InfoFooter pokemon={pokemon} selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
        </Stack>
      </Stack>
    </Drawer>
  );
}
