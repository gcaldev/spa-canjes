// app/layout.tsx
//'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import Auth0Provider from './Auth0Provider'; // Importa el componente cliente
import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bienvenido a FreeCanjes',
  description: 'El lugar donde tu usado vale',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>

          <Auth0Provider>
          {children}
          </Auth0Provider>        
        </ChakraProvider>
        </body>
    </html>
  );
}
