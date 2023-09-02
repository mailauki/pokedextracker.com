import { AppBar, Link, Paper, Stack } from '@mui/material';
import { Circle } from '@mui/icons-material';

export function Footer () {
  return (
    // <Paper
    //   elevation={1}
    //   // sx={{ position: 'absolute', bottom: 0, width: '100%' }}
    // >
    //   <Stack
    //     alignItems="center"
    //     direction="row"
    //     divider={<Circle fontSize="small" sx={{ fontSize: '8px' }} />}
    //     flexWrap="wrap"
    //     justifyContent="center"
    //     spacing={1}
    //     sx={{ p: '80px 20px' }}
    //     useFlexGap
    //   >
    //     <Link
    //       href="https://pokedextracker.com/"
    //       rel="noopener noreferrer"
    //       sx={{ fontWeight: 'bold' }}
    //       target="_blank"
    //       variant="overline"
    //     >PokédexTracker</Link>

    //     <Link
    //       href="https://pokedextracker.com/blog/"
    //       rel="noopener noreferrer"
    //       sx={{ fontWeight: 'bold' }}
    //       target="_blank"
    //       variant="overline"
    //     >Blog</Link>

    //     <Link href="https://twitter.com/PokedexTracker"
    //       rel="noopener noreferrer"
    //       sx={{ fontWeight: 'bold' }}
    //       target="_blank"
    //       variant="overline"
    //     >Twitter</Link>

    //     <Link href="https://github.com/pokedextracker"
    //       rel="noopener noreferrer"
    //       sx={{ fontWeight: 'bold' }}
    //       target="_blank"
    //       variant="overline"
    //     >Github</Link>

    //     <Link href="https://www.patreon.com/pokedextracker"
    //       rel="noopener noreferrer"
    //       sx={{ fontWeight: 'bold' }}
    //       target="_blank"
    //       variant="overline"
    //     >Patreon</Link>
    //   </Stack>
    // </Paper>
    <AppBar color="inherit" component="footer" elevation={1} position="relative">
      <Stack
        alignItems="center"
        direction="row"
        divider={<Circle fontSize="small" sx={{ fontSize: '8px' }} />}
        flexWrap="wrap"
        justifyContent="center"
        spacing={1}
        sx={{ p: '80px 20px' }}
        useFlexGap
      >
        <Link
          href="https://pokedextracker.com/"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >PokédexTracker</Link>

        <Link
          href="https://pokedextracker.com/blog/"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Blog</Link>

        <Link href="https://twitter.com/PokedexTracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Twitter</Link>

        <Link href="https://github.com/pokedextracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Github</Link>

        <Link href="https://www.patreon.com/pokedextracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Patreon</Link>
      </Stack>
    </AppBar>
  );
}
