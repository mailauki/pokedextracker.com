import { Reload } from './Reload';
import { Footer } from './Footer';

import { Container } from '@mui/material';

export function Main ({ children, size }: any) {
  return (
    <>
      <Container maxWidth={size} sx={{ mt: 2, mb: 4 }}>
        <Reload />
        {children}
      </Container>
      <Footer />
    </>
  );
}
