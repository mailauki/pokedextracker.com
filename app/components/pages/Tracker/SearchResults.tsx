import { useMemo } from 'react';

import { Pokemon } from './Pokemon';
import { nationalId, padding } from '../../../utils/formatting';

import type { Dispatch, SetStateAction } from 'react';
import type { UICapture } from './use-tracker';
import { Box } from '@mui/material';

const DEFER_CUTOFF = 120;

interface Props {
  captures: UICapture[];
  hideCaught: boolean;
  query: string;
  setHideCaught: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
  setSelectedPokemon: Dispatch<SetStateAction<number>>;
  sortAlphabetically: boolean;
}

export function SearchResults ({ captures, hideCaught, query, setHideCaught, setQuery, setSelectedPokemon, sortAlphabetically }: Props) {
  const handleClearCaughtFilter = () => setHideCaught(false);
  const handleClearClick = () => setQuery('');

  const filteredCaptures = useMemo(() => {
    if (sortAlphabetically) {
      return captures.sort((a, b) => {
        if (a.pokemon.name < b.pokemon.name) {
          return -1;
        }
        if (a.pokemon.name > b.pokemon.name) {
          return 1;
        }
        return 0;
      });
    } else {
      return captures.filter((capture) => {
        const dexId = capture.pokemon.dex_number;
        const natId = nationalId(capture.pokemon.national_id);

        const matchesCaught = !hideCaught || !capture.captured;
        const matchesQuery =
          // Case-insensitive name prefix match (e.g. bulba)
          capture.pokemon.name.toLowerCase().indexOf(query.toLowerCase()) === 0 ||
          // Exact dex ID match (e.g. 1, 2, 3)
          dexId.toString() === query ||
          // Exact national ID match (e.g. 1, 2, 3)
          natId.toString() === query ||
          // Exact 3-digit formatted dex ID match (e.g. 001, 002, 003)
          padding(dexId, 3) === query ||
          // Exact 4-digit formatted dex ID match (e.g. 0001, 0002, 0003)
          padding(dexId, 4) === query ||
          // Exact 3-digit formatted national ID match (e.g. 001, 002, 003)
          padding(natId, 3) === query ||
          // Exact 4-digit formatted national ID match (e.g. 0001, 0002, 0003)
          padding(natId, 4) === query;

        return matchesCaught && matchesQuery;
      });
    }
  }, [captures, hideCaught, query]);

  const sortCaptures = useMemo(() => {
    return captures.sort((a, b) => {
      // return (a.pokemon.name.toLowerCase() > b.pokemon.name.toLowerCase()) ? 1 : -1;
      // return (a.pokemon.name.toLowerCase() - b.pokemon.name.toLowerCase());
      if (a.pokemon.name < b.pokemon.name) {
        return -1;
      }
      if (a.pokemon.name > b.pokemon.name) {
        return 1;
      }
      return 0;
    });
  }, [captures, hideCaught, query]);

  if (filteredCaptures.length === 0) {
    let message = <p>No results. <a className="link" onClick={handleClearClick}>Clear your search?</a></p>;

    if (hideCaught) {
      if (query) {
        message = <p>No results in uncaught Pokémon. <a className="link" onClick={handleClearCaughtFilter}>Include caught Pokémon</a> or <a className="link" onClick={handleClearClick}>clear your search</a>?</p>;
      } else {
        message = <p>No uncaught Pokémon. <a className="link" onClick={handleClearCaughtFilter}>Show all Pokémon?</a></p>;
      }
    }

    return (
      <div>
        {message}
      </div>
    );
  }

  // if (sortAlphabetically) {
  //   return (
  //     <Box className="search-results" sx={{ mt: 6 }}>
  //       {sortCaptures.map((capture, i) => (
  //         <Pokemon
  //           capture={capture}
  //           delay={i > DEFER_CUTOFF ? 5 : 0}
  //           key={capture.pokemon.id}
  //           setSelectedPokemon={setSelectedPokemon}
  //         />
  //       ))}
  //     </Box>
  //   );
  // }

  return (
    <Box className="search-results" sx={{ mt: 6 }}>
      {filteredCaptures.map((capture, i) => (
        <Pokemon
          capture={capture}
          delay={i > DEFER_CUTOFF ? 5 : 0}
          key={capture.pokemon.id}
          setSelectedPokemon={setSelectedPokemon}
        />
      ))}
    </Box>
  );
}
