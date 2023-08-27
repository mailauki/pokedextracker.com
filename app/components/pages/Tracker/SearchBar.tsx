// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AppBar, Card, Checkbox, FormControlLabel, InputBase, Paper, Toolbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { useEffect, useRef } from 'react';

import { ReactGA } from '../../../utils/analytics';

import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   // backgroundColor: alpha(theme.palette.background.paper, 0.15),
//   // '&:hover': {
//   //   backgroundColor: alpha(theme.palette.background.paper, 0.25),
//   // },
//   // backgroundColor: theme.palette.action.selected,
//   // backgroundColor: theme.palette.action.disabledBackground,
//   backgroundColor: theme.palette.background.paper,
//   '&:hover': {
//     backgroundColor: theme.palette.action.hover,
//   },
//   marginRight: theme.spacing(2),
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(3),
//     width: 'auto',
//   },
// }));
const Search = styled(Paper)(({ theme }) => ({
  position: 'relative',
  border: '1px solid',
  borderRadius: theme.shape.borderRadius,
  borderColor: theme.palette.divider,
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  // [theme.breakpoints.up('sm')]: {
  //   marginLeft: theme.spacing(3),
  //   width: 'auto',
  // },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

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
    // <div className="dex-search-bar">
    //   <div className="wrapper">
    //     <div className="form-group">
    //       <FontAwesomeIcon icon={faSearch} />
    //       <input
    //         autoCapitalize="off"
    //         autoComplete="off"
    //         autoCorrect="off"
    //         className="form-control"
    //         id="search"
    //         name="search"
    //         onChange={handleInputChange}
    //         placeholder="Search by name or # (use / to quick search)"
    //         ref={inputRef}
    //         spellCheck="false"
    //         type="text"
    //         value={query}
    //       />
    //       {query.length > 0 ?
    //         <a className="clear-btn" onClick={handleClearClick}>
    //           <FontAwesomeIcon icon={faTimes} />
    //         </a> :
    //         null
    //       }
    //     </div>
    //     <div className="dex-search-bar-filters">
    //       <div className="form-group">
    //         <div className="checkbox">
    //           <label>
    //             <input
    //               checked={hideCaught}
    //               id="hide-caught"
    //               name="hide-caught"
    //               onChange={handleHideCaughtChange}
    //               type="checkbox"
    //             />
    //             <span className="checkbox-custom"><span /></span>Hide Caught Pokémon
    //           </label>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    // <Toolbar sx={{ flexDirection: 'column', mt: 2, alignItems: 'normal', borderBottom: 1, borderBottomColor: 'divider', position: 'sticky' }}>
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ zIndex: 1000, top: '48px', borderBottom: '1px solid', borderBottomColor: 'divider' }}>
      <Toolbar sx={{ flexDirection: 'column', mt: 2, alignItems: 'normal' }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
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
            spellCheck="false"
            type="text"
            value={query}
          />
        </Search>

        <FormControlLabel control={<Checkbox checked={hideCaught} id="hide-caught" name="hide-caught" onChange={handleHideCaughtChange} />} label="Hide Caught Pokémon" />
      </Toolbar>
    </AppBar>
  );
}
