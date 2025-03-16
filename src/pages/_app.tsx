import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { AuthProvider } from '@context/AuthContext';
import { UIProvider } from '@context/UIContext';
import { theme } from '@styles/theme';
import '@styles/globals.css';

// Initialize React Query client
const queryClient = new QueryClient();

// Web3 provider getter
function getLibrary(provider: any) {
  return new ethers.BrowserProvider(provider);
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <UIProvider>
                <Component {...pageProps} />
              </UIProvider>
            </AuthProvider>
          </ThemeProvider>
        </Web3ReactProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp; 