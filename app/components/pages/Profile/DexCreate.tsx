// import Modal from 'react-modal';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import slug from 'slug';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { Alert } from '../../library/Alert';
import { ReactGA } from '../../../utils/analytics';
import { useCreateDex } from '../../../hooks/queries/dexes';
import { useDexTypes } from '../../../hooks/queries/dex-types';
import { useGames } from '../../../hooks/queries/games';
// import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../../hooks/contexts/use-session';

import type { ChangeEvent, FormEvent } from 'react';
import type { DexType, Game } from '../../../types';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function DexCreate ({ isOpen, onRequestClose }: Props) {
  const history = useHistory();

  const formRef = useRef<HTMLDivElement>(null);

  // const { isNightMode } = useLocalStorageContext();
  const { session } = useSession();
  const { data: games } = useGames();
  const { data: dexTypes } = useDexTypes();

  const gamesById = useMemo<Record<string, Game>>(() => keyBy(games, 'id'), [games]);
  const dexTypesById = useMemo<Record<string, DexType>>(() => keyBy(dexTypes, 'id'), [dexTypes]);
  const dexTypesByGameFamilyId = useMemo<Record<string, DexType[]>>(() => groupBy(dexTypes, 'game_family_id'), [dexTypes]);

  const [title, setTitle] = useState('');
  const [game, setGame] = useState(games?.[0].id || '');
  const [dexType, setDexType] = useState(dexTypesByGameFamilyId[games?.[0].game_family.id || '']?.[0].id || -1);
  const [shiny, setShiny] = useState(false);

  const createDexMutation = useCreateDex();

  useEffect(() => {
    if (games && !game) {
      setGame(games[0].id);
    }
  }, [games, game]);

  useEffect(() => {
    if (games && Object.keys(dexTypesByGameFamilyId).length > 0 && dexType === -1) {
      setDexType(dexTypesByGameFamilyId[games[0].game_family.id][0].id);
    }
  }, [games, dexTypesByGameFamilyId, dexType]);

  const handleRequestClose = () => {
    createDexMutation.reset();
    setTitle('');
    setGame(games![0].id || '');
    setDexType(dexTypesByGameFamilyId[games![0].game_family.id][0].id);
    setShiny(false);
    onRequestClose();
  };

  const handleGameChange = (e: SelectChangeEvent) => {
    const newGameId = e.target.value;

    // Update the dex type appropriately since every game family has a different
    // set of dex types (even if the names are matching across them). First we
    // check if the game family changed. If it didn't, then we don't need to do
    // anything. If it did, we try to see if there is a matching dex type with
    // the same name, and if there is, use that one. if not, just pick the first
    // available dex type.
    const oldGameFamilyId = gamesById[game].game_family.id;
    const newGameFamilyId = gamesById[newGameId].game_family.id;
    if (oldGameFamilyId !== newGameFamilyId) {
      const oldDexType = dexTypesById[dexType];
      const matchingNewDexType = find(dexTypesByGameFamilyId[newGameFamilyId], ['name', oldDexType.name]);
      const newDexTypeId = matchingNewDexType?.id || dexTypesByGameFamilyId[gamesById[newGameId].game_family.id][0].id;
      setDexType(newDexTypeId);
    }

    setGame(newGameId);
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createDexMutation.reset();

    try {
      const dex = await createDexMutation.mutateAsync({
        username: session!.username,
        payload: {
          title,
          slug: slug(title, { lower: true }),
          shiny,
          game,
          dex_type: dexType,
        },
      });
      ReactGA.event({ action: 'create', category: 'Dex' });
      history.push(`/u/${session!.username}/${dex.slug}`);
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    }
  };

  if (!isOpen || !games || !game || dexType === -1 || Object.keys(gamesById).length === 0 || Object.keys(dexTypesByGameFamilyId).length === 0) {
    return null;
  }

  return (
    <Dialog onClose={handleRequestClose} open={isOpen}>
      <DialogTitle>Create New Dex</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleRequestClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ pl: 8, pr: 8, pb: 6 }}>
        <Alert message={createDexMutation.error?.message} type="error" />

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            helperText={
              <Typography align="left" fontSize={12} noWrap>/u/{session!.username}/{slug(title || 'Living Dex', { lower: true })}</Typography>
            }
            id="dex_title"
            inputProps={{ maxLength: 300 }}
            label="Title" margin="normal"
            name="dex_title"
            onChange={handleTitleChange}
            placeholder="Living Dex"
            required
            type="text"
            value={title}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Game</InputLabel>
            <Select label="Game" onChange={handleGameChange} value={game}>
              {games.map((game) => (
                <MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Dex Type</FormLabel>
            <RadioGroup aria-labelledby="" name="dex-type" row>
              {dexTypesByGameFamilyId[gamesById[game].game_family.id].map((dt) => (
                <FormControlLabel
                  control={
                    <Radio
                      checked={dexType === dt.id}
                      name="dex-type"
                      onChange={() => setDexType(dt.id)}
                    />
                  }
                  key={dt.id}
                  label={dt.name}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <FormLabel>Type</FormLabel>
            <RadioGroup aria-labelledby="" name="type" row>
              <FormControlLabel
                control={
                  <Radio
                    checked={!shiny}
                    name="type"
                    onChange={() => setShiny(false)}
                  />
                }
                label="Normal"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={shiny}
                    name="type"
                    onChange={() => setShiny(true)}
                  />
                }
                label="Shiny"
              />
            </RadioGroup>
          </FormControl>

          <Button
            disabled={createDexMutation.isLoading}
            endIcon={<ArrowRightIcon />}
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            type="submit"
            variant="contained"
          >
            Create
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button aria-label="close" onClick={handleRequestClose}>
          Go Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
