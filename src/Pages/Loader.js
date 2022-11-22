import * as React from 'react';
import {Box, CircularProgress, Container, CssBaseline} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Loader() {

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
        </Container>
    </ThemeProvider>

  );
}