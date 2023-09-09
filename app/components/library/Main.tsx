import { Container } from '@mui/material';
import { Reload } from './Reload';
import { Footer } from './Footer';

export function Main ({ children }: any) {
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 2, mb: 4 }}>
        <Reload />
        {children}
      </Container>
      <Footer />
    </>
  );
}
