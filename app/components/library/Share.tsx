import { useRef, useState } from 'react';
import { useParams } from 'react-router';

import { ReactGA } from '../../utils/analytics';
import { Box, Button, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography, alpha, useTheme } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
  profile: boolean;
  // setShowShare: boolean;
}

export function Share ({ profile, setShowShare }: Props) {
  const theme = useTheme();

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(`https://pokedextracker.com/u/${username}${profile ? '' : `/${slug}`}`);
    setIsCopied(true);
    // setShowShare(true);
  };

  const handleClick = () => {
    ReactGA.event({ action: 'select link', category: 'Share' });
    inputRef.current && inputRef.current.select();
  };

  return (
    // <div className="share" onClick={(e) => e.stopPropagation()}>
    //   Share this {profile ? 'Profile' : 'Living Dex'}:
    //   <input
    //     className="form-control"
    //     onClick={handleClick}
    //     readOnly
    //     ref={inputRef}
    //     value={`https://pokedextracker.com/u/${username}${profile ? '' : `/${slug}`}`}
    //   />
    // </div>
    <>
      <DialogTitle>
        Share this {profile ? 'Profile' : 'Living Dex'}:
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption">{isCopied ? 'Copied!' : 'Copy'}</Typography>
        <TextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="copy to clipboard"
                  onClick={handleCopy}
                  size="small"
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          fullWidth
          // onClick={handleClick}
          // readOnly
          // ref={inputRef}
          sx={{
            // backgroundColor: 'action.hover',
            // bgcolor: 'background.paper',
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            // bgcolor: 'transparent',
            // bgcolor: 'primary.background',
            borderRadius: '4px',
            overflow: 'hidden',
            // color: 'inherit',
            // color: 'intial',
            // color: 'text.primary',
            // color: 'aquamarine',
            // color: 'primary.main',
            // input: { color: 'text.primary' },
            // input: { color: 'white' },
          }}
          type="text"
          value={`https://pokedextracker.com/u/${username}${profile ? '' : `/${slug}`}`}
        />
      </DialogContent>
    </>
  );
}
