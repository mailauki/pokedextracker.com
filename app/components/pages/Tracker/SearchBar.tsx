import { AppBar, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useEffect, useRef } from 'react';

import { ReactGA } from '../../../utils/analytics';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface Props {
  hideCaught: boolean;
  query: string;
  setHideCaught: Dispatch<SetStateAction<boolean>>;
  setQuery: Dispatch<SetStateAction<string>>;
}

export function SearchBar ({ hideCaught, query, setHideCaught, setQuery }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.tagName.toLowerCase() !== 'input' && e.key === '/') {
        ReactGA.event({ action: 'used shortcut', category: 'Search' });
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keyup', handleKeyup);

    return () => document.removeEventListener('keyup', handleKeyup);
  }, [inputRef.current]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
  const handleHideCaughtChange = (e: ChangeEvent<HTMLInputElement>) => setHideCaught(e.target.checked);

  const handleClearClick = () => {
    setQuery('');
    inputRef.current && inputRef.current.focus();
  };

  return (
    <AppBar
      color="inherit"
      elevation={0}
      position="sticky"
      sx={{
        zIndex: 1000,
        top: '48px',
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
      }}
    >
      <Toolbar sx={{ flexDirection: 'column', mt: 2, alignItems: 'flex-start' }}>
        <TextField
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            endAdornment: <InputAdornment position="end" sx={{ display: query.length > 0 ? '' : 'none' }}>
              <IconButton
                aria-label="toggle password visibility"
                edge="end"
                onClick={handleClearClick}
                size="small"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>,
          }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          fullWidth
          id="search"
          inputProps={{ 'aria-label': 'search' }}
          name="search"
          onChange={handleInputChange}
          placeholder="Search by name or # (use / to quick search)"
          ref={inputRef}
          size="small"
          spellCheck="false"
          sx={{
            backgroundColor: 'action.hover',
            '&:hover': {
              backgroundColor: 'action.selected',
            },
          }}
          type="text"
          value={query}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={hideCaught}
              id="hide-caught"
              name="hide-caught"
              onChange={handleHideCaughtChange}
            />
          }
          label="Hide Caught Pokémon"
        />
      </Toolbar>
    </AppBar>
  );
}
