import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

interface Props {
  name: string;
}

export function PokemonName ({ name }: Props) {
  const male = name.indexOf('♂') > -1;
  const female = name.indexOf('♀') > -1;

  if (!male && !female) {
    return <>{name}</>;
  }

  return (
    <>
      {name.replace(/[♂♀]/g, '')}
      {male && <MaleIcon fontSize="inherit" />}
      {female && <FemaleIcon fontSize="inherit" />}
    </>
  );
}
