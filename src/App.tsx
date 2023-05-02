import { createRoot } from 'react-dom/client';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/system';
import theme from './theme';
import { Routes } from './routes/Routes';
import ResponsiveAppBar from './components/ResponsiveAppbar';
import keycloak from './util/keycloak';
import { ReactKeycloakProvider } from '@react-keycloak/web';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});
function App() {
  return (
    <React.Fragment>
      <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: 'login-required' }}>
        <ThemeProvider theme={theme}>
        <ResponsiveAppBar />
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            <Routes />
          </QueryClientProvider>
        </ThemeProvider>
      </ReactKeycloakProvider>
    </React.Fragment>
  );
}
const container = document.getElementById('root');

if (!container) {
  throw new Error('no container to render to');
}

const root = createRoot(container);
root.render(<App />);
