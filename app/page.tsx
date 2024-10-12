'use client';

import { ChakraProvider } from '@chakra-ui/react';
import LoginButton from './LoginButton';
import { Auth0Provider } from '@auth0/auth0-react';

export default function Home() {
  return (
    <ChakraProvider>
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h4>FreeCanjes</h4>
        <p>Donde tu usado vale.</p>
        {/* Aquí va el botón de inicio de sesión */}
        <LoginButton />
      </div>
    </ChakraProvider>
  );
}
