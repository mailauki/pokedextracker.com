import keyBy from 'lodash/keyBy';
import { useMemo } from 'react';
import { useParams } from 'react-router';

import { ReactGA } from '../../../utils/analytics';
import { padding } from '../../../utils/formatting';
import { useCreateCapture, useDeleteCapture } from '../../../hooks/queries/captures';
import { useSession } from '../../../hooks/contexts/use-session';
import { useTrackerContext } from './use-tracker';
import { useUser } from '../../../hooks/queries/users';

import type { UICapture } from './use-tracker';

import { Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  captures: UICapture[];
}

export function MarkAllButton ({ captures }: Props) {
  const theme = useTheme();

  const { username, slug } = useParams<{ username: string; slug: string }>();

  const { session } = useSession();
  const user = useUser(username).data!;
  const dex = useMemo(() => keyBy(user.dexes, 'slug')[slug], [user, slug]);

  const { setCaptures } = useTrackerContext();

  const createCapturesMutation = useCreateCapture();
  const deleteCapturesMutation = useDeleteCapture();

  const uncaught = useMemo(() => {
    return captures.reduce((total, capture) => total + (capture.captured ? 0 : 1), 0);
  }, [captures]);

  const ownPage = session?.id === user.id;

  if (!ownPage) {
    return null;
  }

  const handleButtonClick = async () => {
    createCapturesMutation.reset();
    deleteCapturesMutation.reset();

    const deleting = uncaught === 0;
    const pokemon = captures
    .filter((capture) => capture.captured === deleting)
    .map((capture) => capture.pokemon.id);
    const payload = { dex: dex.id, pokemon };

    setCaptures((prev) => prev.map((cap) => {
      if (!pokemon.includes(cap.pokemon.id)) {
        // We're not modifying this one.
        return cap;
      }
      return {
        ...cap,
        pending: true,
        // We need to make it look like captured is false, otherwise, the pending styles won't show up.
        captured: false,
      };
    }));

    if (deleting) {
      await deleteCapturesMutation.mutateAsync({ username: user.username, slug, payload });
    } else {
      await createCapturesMutation.mutateAsync({ username: user.username, slug, payload });
    }

    setCaptures((prev) => prev.map((cap) => {
      if (!pokemon.includes(cap.pokemon.id)) {
        // We're not modifying this one.
        return cap;
      }
      return {
        ...cap,
        pending: false,
        captured: !deleting,
      };
    }));

    ReactGA.event({
      category: 'Box',
      label: `${padding(captures[0].pokemon.national_id, 3)} - ${padding(captures[captures.length - 1].pokemon.national_id, 3)}`,
      action: deleting ? 'unmark all' : 'mark all',
    });
  };

  const isLoading = createCapturesMutation.isLoading || deleteCapturesMutation.isLoading;

  return (
    <Button
      // className="btn btn-blue"
      disableElevation
      disabled={isLoading}
      endIcon={isLoading ? <CircularProgress color="inherit" size={14} sx={{ display: isLoading ? '' : 'none' }} thickness={6} /> : null}
      onClick={handleButtonClick}
      size="small"
      sx={{ borderRadius: theme.shape.pill }}
      variant="contained"
    >
      {uncaught === 0 ? 'Unmark' : 'Mark'} All
    </Button>
  );
}
