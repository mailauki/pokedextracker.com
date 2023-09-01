// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { Link, Paper, Stack } from '@mui/material';
import { Circle } from '@mui/icons-material';

export function Footer () {
  return (
    // <footer className="main-footer">
    //   <a className="link" href="/">PokédexTracker</a>
    //   <FontAwesomeIcon icon={faCircle} />
    //   <a className="link" href="/blog/">Blog</a>
    //   <FontAwesomeIcon icon={faCircle} />
    //   <a className="link" href="https://twitter.com/PokedexTracker" rel="noopener noreferrer" target="_blank">Twitter</a>
    //   <FontAwesomeIcon icon={faCircle} />
    //   <a className="link" href="https://github.com/pokedextracker" rel="noopener noreferrer" target="_blank">Github</a>
    //   <FontAwesomeIcon icon={faCircle} />
    //   <a className="link" href="https://www.patreon.com/pokedextracker" rel="noopener noreferrer" target="_blank">Patreon</a>
    // </footer>
    <Paper elevation={1} sx={{ p: '100px 20px' }}>
      <Stack alignItems="center" direction="row" justifyContent="center" spacing={1}>
        <Link
          href="https://pokedextracker.com/"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >PokédexTracker</Link>

        <Circle fontSize="small" sx={{ fontSize: '8px' }} />

        <Link
          href="https://pokedextracker.com/blog/"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Blog</Link>

        <Circle fontSize="small" sx={{ fontSize: '8px' }} />

        <Link href="https://twitter.com/PokedexTracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Twitter</Link>

        <Circle fontSize="small" sx={{ fontSize: '8px' }} />

        <Link href="https://github.com/pokedextracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Github</Link>

        <Circle fontSize="small" sx={{ fontSize: '8px' }} />

        <Link href="https://www.patreon.com/pokedextracker"
          rel="noopener noreferrer"
          sx={{ fontWeight: 'bold' }}
          target="_blank"
          variant="overline"
        >Patreon</Link>
      </Stack>
    </Paper>
  );
}
