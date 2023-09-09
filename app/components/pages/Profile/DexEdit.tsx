// import Modal from 'react-modal';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import slug from 'slug';

import { useEffect, useMemo, useRef, useState } from 'react';

import { Alert } from '../../library/Alert';
// import { FormWarning } from './FormWarning';
import { ReactGA } from '../../../utils/analytics';
import { useDeleteDex, useUpdateDex } from '../../../hooks/queries/dexes';
import { useDexTypes } from '../../../hooks/queries/dex-types';
import { useGames } from '../../../hooks/queries/games';
// import { useLocalStorageContext } from '../../../hooks/contexts/use-local-storage-context';
import { useSession } from '../../../hooks/contexts/use-session';

import type { ChangeEvent, MouseEvent, FormEvent } from 'react';
import type { Dex, DexType, Game } from '../../../types';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightIcon from '@mui/icons-material/ArrowRightAlt';
import CloseIcon from '@mui/icons-material/Close';

const GAME_WARNING = 'Any capture info specific to your old game will be lost.';
const REGIONAL_WARNING = 'Any non-regional capture info will be lost.';
const URL_WARNING = 'The old URL to your dex will not function anymore.';

interface Props {
  dex: Dex;
  isOpen: boolean;
  onRequestClose: () => void;
}

export function DexEdit ({ dex, isOpen, onRequestClose }: Props) {
  const formRef = useRef<HTMLDivElement>(null);

  // const { isNightMode } = useLocalStorageContext();
  const { session } = useSession();
  const { data: games } = useGames();
  const { data: dexTypes } = useDexTypes();

  const gamesById = useMemo<Record<string, Game>>(() => keyBy(games, 'id'), [games]);
  const dexTypesById = useMemo<Record<string, DexType>>(() => keyBy(dexTypes, 'id'), [dexTypes]);
  const dexTypesByGameFamilyId = useMemo<Record<string, DexType[]>>(() => groupBy(dexTypes, 'game_family_id'), [dexTypes]);

  const [title, setTitle] = useState(dex.title);
  const [game, setGame] = useState(dex.game.id);
  const [dexType, setDexType] = useState(dex.dex_type.id);
  const [shiny, setShiny] = useState(dex.shiny);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isConfirmingUpdate, setIsConfirmingUpdate] = useState(false);

  const regional = useMemo(() => dexTypesById[dexType]?.tags.includes('regional'), [dexTypesById, dexType]);

  const updateDexMutation = useUpdateDex();
  const deleteDexMutation = useDeleteDex();

  const reset = () => {
    updateDexMutation.reset();
    deleteDexMutation.reset();
    setTitle(dex.title);
    setGame(dex.game.id);
    setDexType(dex.dex_type.id);
    setShiny(dex.shiny);
    setIsConfirmingDelete(false);
    setIsConfirmingUpdate(false);
  };

  useEffect(() => {
    reset();
  }, [dex]);

  const showGameWarning = useMemo(() => {
    // If you're moving from the expansion down to the original as a regional
    // dex, we should show the game warning. The reason this needed is because
    // we made the national dex for sword_shield the same as the expansion, so
    // the clause checking for national total isn't evaluating to true.
    if (dex.game.game_family.id === 'sword_shield_expansion_pass' && gamesById[game]?.game_family.id === 'sword_shield' && regional) {
      return true;
    }

    const differentFamily = gamesById[game]?.game_family.id !== dex.game.game_family.id;
    const lessNationalCount = gamesById[game]?.game_family.national_total < dex.game.game_family.national_total;

    return differentFamily && lessNationalCount;
  }, [dex.id, game, gamesById, regional]);

  const showRegionalWarning = useMemo(() => regional && !dex.dex_type.tags.includes('regional'), [dex.id, regional]);
  const showUrlWarning = useMemo(() => slug(title || 'Living Dex', { lower: true }) !== dex.slug, [dex.id, title]);

  const handleRequestClose = () => {
    reset();
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

  const handleDeleteClick = async (e: MouseEvent<HTMLElement>) => {
    e.preventDefault();

    if (updateDexMutation.isLoading || deleteDexMutation.isLoading) {
      // We're already making a change, so exit early.
      return;
    }

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }

    updateDexMutation.reset();
    deleteDexMutation.reset();

    try {
      await deleteDexMutation.mutateAsync({ username: session!.username, slug: dex.slug });
      ReactGA.event({ action: 'delete', category: 'Dex' });
      handleRequestClose();
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    }
  };

  const handleUpdateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isConfirmingUpdate && (showGameWarning || showRegionalWarning || showUrlWarning)) {
      setIsConfirmingUpdate(true);
      return;
    }

    updateDexMutation.reset();
    deleteDexMutation.reset();

    try {
      await updateDexMutation.mutateAsync({
        username: session!.username,
        slug: dex.slug,
        payload: {
          title,
          slug: title !== dex.title ? slug(title, { lower: true }) : undefined,
          shiny,
          game,
          dex_type: dexType,
        },
      });
      ReactGA.event({ action: 'update', category: 'Dex' });
      handleRequestClose();
    } catch (_) {
      // Since React Query catches the error and attaches it to the mutation, we don't need to do anything with this
      // error besides prevent it from bubbling up.
      if (formRef.current) {
        formRef.current.scrollTop = 0;
      }
    }
  };

  if (!isOpen || !games || Object.keys(gamesById).length === 0 || Object.keys(dexTypesByGameFamilyId).length === 0) {
    return null;
  }

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleRequestClose} open={isOpen}>
      <DialogTitle>{isConfirmingDelete ? `Delete ${title || 'Dex'}` : 'Edit a Dex'}</DialogTitle>
      {isConfirmingDelete ? (
        <IconButton
          aria-label="close"
          onClick={() => setIsConfirmingDelete(false)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteClick}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <DeleteIcon />
        </IconButton>
      )}

      {isConfirmingDelete ? (
        <DialogContent sx={{ pl: 8, pr: 8, pb: 6 }}>
          <Stack alignItems="center" spacing={2}>
            <Typography variant="h5">Are you sure?</Typography>

            <Button
              color="error"
              fullWidth
              onClick={handleDeleteClick}
              size="large"
              variant="contained"
            >
              Yes
            </Button>

            <Button
              fullWidth
              onClick={() => setIsConfirmingDelete(false)}
              size="large"
              variant="outlined"
            >
              No
            </Button>
          </Stack>
        </DialogContent>
      ) : (
        <DialogContent sx={{ pl: 8, pr: 8, pb: 6 }}>
          <Alert message={updateDexMutation.error?.message || deleteDexMutation.error?.message} type="error" />

          <form onSubmit={handleUpdateSubmit}>
            <TextField
              error={showUrlWarning}
              fullWidth
              helperText={
                <Typography align="left" fontSize={12} noWrap>
                  {showUrlWarning ? URL_WARNING : `/u/${session!.username}/${slug(title || 'Living Dex', { lower: true })}` }
                </Typography>
              }
              id="dex_title"
              inputProps={{ maxLength: 300 }}
              label="Title"
              margin="normal"
              name="dex_title"
              onChange={handleTitleChange}
              placeholder="Living Dex"
              required
              type="text"
              value={title}
            />

            <FormControl error={showGameWarning} fullWidth margin="normal">
              <InputLabel>Game</InputLabel>
              <Select label="Game" onChange={handleGameChange} value={game}>
                {games.map((game) => (
                  <MenuItem key={game.id} value={game.id}>{game.name}</MenuItem>
                ))}
              </Select>
              {showGameWarning && <Typography align="left" color="error" fontSize={12} noWrap>{GAME_WARNING}</Typography>}
            </FormControl>

            <FormControl error={showRegionalWarning} fullWidth margin="normal">
              <FormLabel>Dex Type</FormLabel>
              <RadioGroup aria-labelledby="" name="dex-type" row>
                {dexTypesByGameFamilyId[gamesById[game].game_family.id].map((dt) => (
                  <FormControlLabel control={<Radio checked={dexType === dt.id} name="dex-type" onChange={() => setDexType(dt.id)} />} key={dt.id} label={dt.name} />
                ))}
              </RadioGroup>
              {showRegionalWarning && <Typography align="left" color="error" fontSize={12} noWrap>{REGIONAL_WARNING}</Typography>}
            </FormControl>

            <FormControl fullWidth margin="normal">
              <FormLabel>Type</FormLabel>
              <RadioGroup aria-labelledby="" name="type" row>
                <FormControlLabel control={<Radio checked={!shiny} name="type" onChange={() => setShiny(false)} />} label="Normal" />
                <FormControlLabel control={<Radio checked={shiny} name="type" onChange={() => setShiny(true)} />} label="Shiny" />
              </RadioGroup>
            </FormControl>

            <Button
              disabled={updateDexMutation.isLoading || deleteDexMutation.isLoading}
              endIcon={<ArrowRightIcon />}
              fullWidth
              size="large"
              sx={{ mt: 2, mb: 2 }}
              type="submit"
              variant="contained"
            >
              {isConfirmingUpdate ? 'Confirm' : ''} Edit
            </Button>
          </form>
        </DialogContent>
      )}

      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button aria-label="close" onClick={handleRequestClose}>Go Back</Button>
      </DialogActions>
    </Dialog>
  );
}
