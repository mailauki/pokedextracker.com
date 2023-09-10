import { useLocalStorageContext } from '../../hooks/contexts/use-local-storage-context';
import { Alert, Link } from '@mui/material';

export function Notification () {
  const { hideNotification, setHideNotification } = useLocalStorageContext();

  if (hideNotification) {
    return null;
  }

  const handleClick = () => setHideNotification(true);

  return (
    <Alert
      onClose={handleClick}
      severity="info"
      sx={{ mt: 2, mb: 2, display: hideNotification ? 'none' : '' }}
    >
      Pokémon HOME dexes have been updated for Scarlet and Violet! <Link href="http://bit.ly/pt-sv-home" rel="noopener noreferrer" target="_blank">Read more</Link>.
    </Alert>
  );
}
