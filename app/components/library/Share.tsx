import { useState } from 'react';
import { useParams } from 'react-router';

import { DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography, alpha, useTheme } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';

interface Props {
  profile: boolean;
}

export function Share ({ profile }: Props) {
  const theme = useTheme();

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://pokedextracker.com/u/${username}${profile ? '' : `/${slug}`}`);
    setIsCopied(true);
  };

  return (
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
          sx={{
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          type="text"
          value={`https://pokedextracker.com/u/${username}${profile ? '' : `/${slug}`}`}
        />
      </DialogContent>
    </>
  );
}
