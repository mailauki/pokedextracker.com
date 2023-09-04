// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
// import { faLongArrowAltRight, faRss } from '@fortawesome/free-solid-svg-icons';
// import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useEffect } from 'react';

import { useSession } from '../../hooks/contexts/use-session';

import { AppBar, Avatar, Box, Button, Container, IconButton, Link as Anchor, List, Stack, Typography, ListSubheader, ListItem, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import Bullet from '@mui/icons-material/Circle';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import { RssFeed, Twitter } from '@mui/icons-material';

export function Home () {
  const { session } = useSession();

  useEffect(() => {
    document.title = 'Pokédex Tracker | Track the Progress of Your Living Dex Completion';
  }, []);

  return (
    // <div className="home-container">
    //   <div className="home">
    //     <div className="hero">
    //       <img alt="Gotta catch 'em all!" src="/pokeball.svg" />
    //       <h1>Pokédex Tracker</h1>
    //     </div>

    //     <div className="sub">
    //       <h2>A tool for tracking your Living Dex progress! We currently support:</h2>
    //       <ul>
    //         <li><h2><Link className="link" to="/u/ashketchum10/scarlet-regional-living-dex">Pokémon Scarlet &amp; Violet Regional Dex</Link></h2></li>
    //         <li><h2><Link className="link" to="/u/ashketchum10/home-national-living-dex">HOME Generation 9 National Dex</Link> (and Generations 6, 7, and 8)</h2></li>
    //         <li><h2><Link className="link" to="/u/ashketchum10/legends-arceus-regional-living-dex">Pokémon Legends: Arceus Regional Dex</Link></h2></li>
    //         <li><h2>Pokémon Brilliant Diamond &amp; Shining Pearl <Link className="link" to="/u/ashketchum10/brilliant-diamond-regional-living-dex">Regional Dex</Link> and <Link className="link" to="/u/ashketchum10/brilliant-diamond-national-living-dex">National Dex</Link></h2></li>
    //         <li><h2><Link className="link" to="/u/ashketchum10/sword-expansion-pass-regional-living-dex">Pokémon Sword &amp; Shield (Expansion Pass) Regional Dex</Link></h2></li>
    //         <li><h2><Link className="link" to="/u/ashketchum10/sword-regional-living-dex">Pokémon Sword &amp; Shield Regional Dex</Link></h2></li>
    //         <li><h2>Previous Games: <Link className="link" to="/u/ashketchum10/lets-go-pikachu-regional-living-dex">Let&apos;s Go, Pikachu &amp; Let&apos;s Go, Eevee</Link>, <Link className="link" to="/u/ashketchum10/ultra-sun-regional-living-dex">Ultra Sun &amp; Ultra Moon</Link>, <Link className="link" to="/u/ashketchum10/sun-regional-living-dex">Sun &amp; Moon</Link>, <Link className="link" to="/u/ashketchum10/omega-ruby-regional-living-dex">Omega Ruby &amp; Alpha Sapphire</Link>, and <Link className="link" to="/u/ashketchum10/x-regional-living-dex">X &amp; Y</Link></h2></li>
    //         <li><h2><Link className="link" to="/u/ashketchum10/shinies">Shiny Dexes</Link> for all of the above!</h2></li>
    //       </ul>

    //       {session ?
    //         <div>
    //           <Link className="btn btn-blue" to={`/u/${session.username}`}>View Profile <FontAwesomeIcon icon={faLongArrowAltRight} /></Link>
    //         </div> :
    //         <div>
    //           <Link className="btn btn-blue" to="/register">Register <FontAwesomeIcon icon={faLongArrowAltRight} /></Link>
    //           <Link className="btn btn-white" to="/login">Login <FontAwesomeIcon icon={faLongArrowAltRight} /></Link>
    //         </div>
    //       }

    //       <h2>Easily toggle between and track your captured Pokémon, find the locations of those left to be captured, manage all your dexes on one <Link className="link" to="/u/ashketchum10">profile</Link>, and share a public link with others to see how you can help each other out.</h2>

    //       <p>This project is open source, and you can find the code on <a className="link" href="https://github.com/pokedextracker" rel="noopener noreferrer" target="_blank">GitHub</a>. Feel free to report issues, suggest features, or even submit a pull request. Help support this project financially by <a className="link" href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">donating</a>&mdash;every little bit helps!</p>

    //       <div className="social">
    //         <a className="link" href="https://twitter.com/PokedexTracker" rel="noopener noreferrer" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a>
    //         <a className="link" href="/blog/" rel="noopener noreferrer" target="_blank"><FontAwesomeIcon icon={faRss} /></a>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="footer">Made with <i className="pkicon pkicon-ball-love" /> in San Francisco</div>
    // </div>
    <>
      {/* <Box
        bgcolor="background.paper"
        sx={{
          backgroundImage: 'url(/pattern-night.png)',
          backgroundSize: '500px 250px',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'difference',
        }}
      >
        <Toolbar variant="dense" /> */}
        <Container maxWidth="sm" sx={{ mt: 2, mb: 4 }}>
          <Stack alignItems="center" direction="column" sx={{ textAlign: 'center' }}>
            <Avatar
              alt="Gotta catch 'em all!"
              src="/pokeball.svg"
              sx={{ width: 80, height: 80 }}
            />
            <Typography color="primary" sx={{ mb: 2, fontWeight: '400' }} variant="h2">Pokédex Tracker</Typography>

            <Typography>A tool for tracking your Living Dex progress!</Typography>

            <List>
              <ListSubheader disableGutters disableSticky sx={{ bgcolor: 'transparent' }}>We currently support:</ListSubheader>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/scarlet-regional-living-dex"
                    >
                      Pokémon Scarlet &amp; Violet Regional Dex
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/home-national-living-dex"
                    >
                      HOME Generation 9 National Dex
                    </Anchor>
                    {' (and Generations 6, 7, and 8)'}
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/legends-arceus-regional-living-dex"
                    >
                      Pokémon Legends: Arceus Regional Dex
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    {'Pokémon Brilliant Diamond '}&amp;{' Shining Pearl '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/brilliant-diamond-regional-living-dex"
                    >
                      Regional Dex
                    </Anchor>
                    {' and '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/brilliant-diamond-national-living-dex"
                    >
                      National Dex
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/sword-expansion-pass-regional-living-dex"
                    >
                      Pokémon Sword &amp; Shield (Expansion Pass) Regional Dex
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/sword-regional-living-dex"
                    >
                      Pokémon Sword &amp; Shield Regional Dex
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    {'Previous Games: '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/lets-go-pikachu-regional-living-dex"
                    >
                      Let&apos;s Go, Pikachu &amp; Let&apos;s Go, Eevee
                    </Anchor>
                    {', '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/ultra-sun-regional-living-dex"
                    >
                      Ultra Sun &amp; Ultra Moon
                    </Anchor>
                    {', '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/sun-regional-living-dex"
                    >
                      Sun &amp; Moon
                    </Anchor>
                    {', '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/omega-ruby-regional-living-dex"
                    >
                      Omega Ruby &amp; Alpha Sapphire
                    </Anchor>
                    {', and '}
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/x-regional-living-dex"
                    >
                      X &amp; Y
                    </Anchor>
                  </Typography>
                } />
              </ListItem>

              <ListItem disablePadding>
                <Bullet fontSize="small" sx={{ fontSize: '8px', mr: 2, color: 'text.secondary' }} />
                <ListItemText primary={
                  <Typography variant="subtitle2">
                    <Anchor
                      component={Link}
                      to="/u/ashketchum10/shinies"
                    >
                      Shiny Dexes
                    </Anchor>
                    {' for all of the above!'}
                  </Typography>
                } />
              </ListItem>
            </List>

            {session ? (
              <>
                <Button
                  component={Link}
                  endIcon={<ArrowRightIcon />}
                  // fullWidth
                  size="large"
                  sx={{ mt: 2, mb: 2 }}
                  to={`/u/${session.username}`}
                  type="submit"
                  variant="contained"
                >
                  Profile
                </Button>
              </>
            ) : (
              <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
                <Button
                  component={Link}
                  endIcon={<ArrowRightIcon />}
                  size="large"
                  to="/register"
                  type="submit"
                  variant="contained"
                >
                  Register
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  endIcon={<ArrowRightIcon />}
                  size="large"
                  to="/login"
                  type="submit"
                  variant="contained"
                >
                  Login
                </Button>
              </Stack>
            )}

            <Typography paragraph>Easily toggle between and track your captured Pokémon, find the locations of those left to be captured, manage all your dexes on one <Anchor component={Link} to="/u/ashketchum10">profile</Anchor>, and share a public link with others to see how you can help each other out.</Typography>

            <Typography paragraph>This project is open source, and you can find the code on <Anchor href="https://github.com/pokedextracker" rel="noopener noreferrer" target="_blank">GitHub</Anchor>. Feel free to report issues, suggest features, or even submit a pull request. Help support this project financially by <Anchor className="link" href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">donating</Anchor>&mdash;every little bit helps!</Typography>

            <Box>
              <IconButton
                color="primary"
                component="a"
                href="https://pokedextracker.com/blog/"
                rel="noopener noreferrer"
                size="small"
                target="_blank"
              >
                <Twitter fontSize="small" />
              </IconButton>

              <IconButton
                color="primary"
                component="a"
                href="https://twitter.com/PokedexTracker"
                rel="noopener noreferrer"
                size="small"
                target="_blank"
              >
                <RssFeed fontSize="small" />
              </IconButton>
            </Box>
          </Stack>
        </Container>
      {/* </Box> */}

      <AppBar color="inherit" component="footer" elevation={1} position="relative">
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={1}
          sx={{ p: 2 }}
        >
          <Typography>Made with</Typography>
          <i className="pkicon pkicon-ball-love" />
          <Typography>in San Francisco</Typography>
        </Stack>
      </AppBar>
    </>
  );
}
